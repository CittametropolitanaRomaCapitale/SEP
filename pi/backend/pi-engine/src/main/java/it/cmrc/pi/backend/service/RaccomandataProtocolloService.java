package it.cmrc.pi.backend.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import io.quarkus.scheduler.Scheduled;
import it.parsec326.pi.intranet.client.RaccomandataWebClient;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.RaccomandataMittenteFields;
import it.parsec326.pi.intranet.dto.RaccomandataProtocolloDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaRaccomandataDTO;
import it.parsec326.pi.intranet.dto.client.raccomandata.*;
import it.parsec326.pi.intranet.dto.input.RaccomandataProtocolloInput;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.mapper.RaccomandataProtocolloMapper;
import it.parsec326.pi.intranet.model.Allegato;
import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.RaccomandataProtocollo;
import it.parsec326.pi.intranet.service.AllegatoService;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import it.parsec326.pi.intranet.service.StoricoService;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.StatoRaccomandataProtocollo;
import it.parsec326.pi.intranet.utils.common.TipoRaccomandata;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.*;

@Slf4j
@ApplicationScoped
public class RaccomandataProtocolloService  implements PanacheCustomEntityServiceInterface<RaccomandataProtocollo>  {

    private final static String STORICO_INSERT_NEW_RACCOMANDATA = "Inserimento nuova raccomandata in coda";
    private final static String STORICO_ANNULLA_RACCOMANDATA = "Eliminazione raccomandata non ancora inviata";

    @Inject
    SSOClient ssoManager;

    @Inject
    EntityManager em;

    @Inject
    StoricoService storicoService;

    @Inject
    AllegatoService allegatoService;

    @Inject
    RaccomandataWebClient raccomandataWebClient;

    @Inject
    RaccomandataProtocolloMapper raccomandataMapper;

    @Inject
    ConfigurazioneService configurazioneService;

    @ConfigProperty(name = "sync.invio-raccomandate.enabled")
    private boolean syncInvioRaccomandate;

    public List<RaccomandataProtocollo> getRaccomandateProtocollo(Long idProtocollo){

        return em.createNamedQuery("getRaccomandateProtocollo", RaccomandataProtocollo.class)
                .setParameter("idProtocollo",idProtocollo)
                .getResultList();
    }

    public PanacheQuery<RaccomandataProtocollo> getRaccomandateQuery(RicercaRaccomandataDTO dto) {
        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("id is not null ");

        if (dto.hasIdProtocollo()) {
            Protocollo p = Protocollo.findById(dto.getIdProtocollo());
            if (p == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile ottenere il protocollo per cercare le raccomandate").boom();

            query.append("and protocollo = :protocollo ");
            params.put("protocollo", p);
        }
        if (dto.hasStato()) {
            if (!StatoRaccomandataProtocollo.isSupported(dto.getStato())) {
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile ottenere lo stato per cercare le raccomandate").boom();
            }
            query.append("and stato = :stato ");
            params.put("stato", StatoRaccomandataProtocollo.valueOf(dto.getStato()));
        }

        if (dto.hasTsCreationTo()) {
            query.append("and tsCreation <= :tsCreationTo ");
            params.put("tsCreationTo", dto.getTsCreationTo());
        }

        if(dto.hasSearch()){
            String search = dto.getSearch().trim().toLowerCase().replace(" ", "");

            query.append("and (:search = '' ")
                    .append("or lower(REPLACE(numero, ' ', '')) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(REPLACE(stato, ' ', '')) like LOWER(concat('%', :search, '%')) ")
                    .append(")");
            params.put("search", search);
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return RaccomandataProtocollo.find(query.toString(), sortCriteria, params);
    }

    public RaccomandataProtocolloDTO getRaccomandate(RicercaRaccomandataDTO dto) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

        PanacheQuery<RaccomandataProtocollo> query = getRaccomandateQuery(dto);
        List<RaccomandataProtocollo> raccomandataList = query.page(Page.of(dto.getPage(), dto.getSize())).list();

        long totalResults = query.count();
        RaccomandataProtocolloDTO outputDTO = new RaccomandataProtocolloDTO(raccomandataList, getPagesCount(totalResults, dto.getSize()), totalResults);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return outputDTO;
    }

    /***
     *  Questo servizio crea la 'bozza' della raccomandata, che successivamente verrà inviata al servizio esterno,
     *  per essere processata.
     *  La raccomandata verrà salvata in tabella con lo stato IN_CODA. Questo per facilitare la successiva lettura
     *  delle raccomandate che dovranno essere recuperate ed inviate.
     */
    @Transactional
    public RaccomandataProtocollo insertNewRaccomandata(RaccomandataProtocolloInput input) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if(input == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nell'elaborazione della raccomandata").boom();
        if (!input.isValid()) CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile inserire la raccomandata. Campi non validi.").boom();

        Protocollo p = Protocollo.findById(input.getIdProtocollo());
        if (p == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile ottenere il protocollo da associare alla raccomandata").boom();
        Allegato a = Allegato.findById(input.getIdAllegato());
        if (a == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile ottenere l'allegato da associare alla raccomandata").boom();
        if (!TipoRaccomandata.isSupported(input.getTipo())) CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile ottenere il tipo di raccomandata").boom();
        RaccomandataProtocollo raccomandata = raccomandataMapper.toEntity(input);
        raccomandata.setTipo(TipoRaccomandata.valueOf(input.getTipo()));
        raccomandata.setProtocollo(p);
        raccomandata.setAllegato(a);
        raccomandata.setStato(StatoRaccomandataProtocollo.inCoda);
        raccomandata.setTsCreation(new Date());
        raccomandata.setIdUtente(ssoManager.extractIdFromToken());
        raccomandata.setNomeUtente(ssoManager.extractNameFromToken());

        raccomandata.persist();

        storicoService.insertNewStoricoForNumeroProtocollo(p, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), STORICO_INSERT_NEW_RACCOMANDATA, "");

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return raccomandata;
    }

    @Transactional
    public boolean annullaRaccomandata(Long id, String motivazione) {
        RaccomandataProtocollo r = RaccomandataProtocollo.findById(id);
        if (r == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile ottenere la raccomandata da annullare").boom();
        if (!r.canBeDeleted()) CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile annullare una raccomandata che è già stata inviata").boom();

        if (System.currentTimeMillis() - r.getTsCreation().getTime() > 5 * 60 * 1000) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile annullare la raccomandata: sono trascorsi più di 5 minuti dalla creazione").boom();
        }

        String dettaglioRaccomandata = "Destinatario: "+r.getDestinatario();

        r.delete();

        storicoService.insertNewStoricoForNumeroProtocollo(r.getProtocollo(), ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), STORICO_ANNULLA_RACCOMANDATA+" - "+dettaglioRaccomandata, motivazione);
        return true;
    }

    /***
     *  Questo servizio recupera le raccomandate in coda e le invia al servizio esterno.
     *  Il ritorno ci consente di recuperare tutti i dati necessari per identificare questa raccomandata, e quindi aggiornare il record.
     *  Il servizio ha uno schedule di 5 minuti.
     */
    @Transactional
    @Scheduled(cron = "0 */5 * * * ?")
    public void inviaRaccomandateInCoda() {
        if (!syncInvioRaccomandate) return;
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        RicercaRaccomandataDTO dto = new RicercaRaccomandataDTO();
        SortInput s = new SortInput();
        s.by = "tsCreation";
        s.desc = false;
        dto.setPage(0);
        dto.setSize(20);
        dto.setSort(s);
        dto.setStato(StatoRaccomandataProtocollo.inCoda.toString());
        dto.setTsCreationTo(new Date(System.currentTimeMillis() - 60 * 1000 * 5));
        RaccomandataProtocolloDTO raccomandateInCoda = getRaccomandate(dto);
        int raccomandataProcessate = 0;

        for(RaccomandataProtocollo raccomandata : raccomandateInCoda.getRaccomandate()) {
            log.info("Lettura di:{} raccomandate",raccomandateInCoda.getRaccomandate().size());

            DatiRaccomandataDTO datiRaccomandata = raccomandataMapper.toDatiRaccomandataDTO(raccomandata);
            datiRaccomandata.setServizio(raccomandata.getTipo().getTipoRaccomandata());
            datiRaccomandata.setLogin(configurazioneService.getLoginRaccomandata());

            AllegatoDTO allegatoInvio = new AllegatoDTO();
            allegatoInvio.setNomeFile(raccomandata.getAllegato().getNome());
            String estensione = raccomandata.getAllegato().getEstensione().replace(".","").toUpperCase();
            if(!estensione.equals("PDF")){
                String message = String.format(
                        "Errore nell'invio della raccomandata con id: %s, Il documento con id:%s non e' formato PDF",
                        raccomandata.getId(), raccomandata.getAllegato().getId());
                LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                CustomException.get(CustomException.ErrorCode.INTERNAL,message).boom();
            }

            allegatoInvio.setEstensione(estensione);

            byte[] fileFromMinio;
            try {
                fileFromMinio = allegatoService.searchByRef(raccomandata.getAllegato().getRiferimentoMinio());
                if (fileFromMinio == null) {
                    CustomException.get(CustomException.ErrorCode.NOT_FOUND,
                            "File non trovato su nel bucket per la raccomandata:{}", raccomandata.getId()).boom();
                }
            } catch (Exception e) {
                LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                throw CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage());
            }
            allegatoInvio.setFile(fileFromMinio);
            datiRaccomandata.setAllegato(allegatoInvio);

            DettaglioRaccomandataDTO ritornoInvio = raccomandataWebClient.invioRaccomandata(datiRaccomandata);
            if (ritornoInvio == null || (!ritornoInvio.hasIdPro() && ritornoInvio.isEmpty())) {
                String message = String.format("La raccomandata con id: %s non e' stata inviata correttamente", raccomandata.getId());
                LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                raccomandata.setStato(StatoRaccomandataProtocollo.errore);
                raccomandata.persistAndFlush();
                storicoService.insertNewStoricoForNumeroProtocollo(
                        raccomandata.getProtocollo(),
                        raccomandata.getIdUtente(),
                        raccomandata.getNomeUtente(),
                        message,
                        null);
                continue;
            }

            raccomandata.setIdRaccomandata(ritornoInvio.idPro);
            raccomandata.setNumero(ritornoInvio.idAccettazione);
            raccomandata.setCosto(ritornoInvio.costo);
            raccomandata.setStatoConsegna(ritornoInvio.statoConsegna);
            raccomandata.setTsConsegna(ritornoInvio.dataConsegna);
            raccomandata.setTsInoltro(ritornoInvio.dataInoltro);
            raccomandata.setStato(StatoRaccomandataProtocollo.getStato(ritornoInvio.stato));
            raccomandata.persistAndFlush();
            log.info("Invio riuscito della raccomandata con id: {}", raccomandata.id);

            // Teniamo traccia delle raccomandate inviate con successo
            raccomandataProcessate++;

            storicoService.insertNewStoricoForNumeroProtocollo(
                    raccomandata.getProtocollo(),
                    raccomandata.getIdUtente(),
                    raccomandata.getNomeUtente(),
                    "Invio raccomandata: " + raccomandata.getIdRaccomandata(),
                    null);

        }

        if(!raccomandateInCoda.getRaccomandate().isEmpty()){
            log.info("Fine lettura delle raccomandate - Processate: {}/{}",
                    raccomandataProcessate, raccomandateInCoda.getRaccomandate().size());
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }

    @Transactional
    public LoginRaccomandataDTO getLoginRaccomandata(){
        return configurazioneService.getLoginRaccomandata();
    }

    @Transactional
    public boolean updateStatoRaccomandateForProtocollo(Long idProtocollo) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        List<RaccomandataProtocollo> raccomandateToCheck = getRaccomandateProtocollo(idProtocollo);
        List<RaccomandataProtocollo> raccomandateFiltrate = filtraRaccomandateNonCompletate(raccomandateToCheck);

        if (raccomandateFiltrate.isEmpty()) {
            return false;
        }
        List<String> idRaccomandateList = raccomandateFiltrate.stream()
                .map(RaccomandataProtocollo::getIdRaccomandata)
                .toList();

        LoginRaccomandataDTO login = this.getLoginRaccomandata();

        List<DettaglioRaccomandataDTO> dettaglioRaccomandataDTOList = raccomandataWebClient.ricercaStatoRaccomandataList(new StatoRaccomandataInputDTO(login, idRaccomandateList));
        boolean aggiornamentoEseguito = false;

        for (DettaglioRaccomandataDTO r : dettaglioRaccomandataDTOList) {
            if (aggiornaRaccomandataConDettagli(raccomandateFiltrate, r)) {
                aggiornamentoEseguito = true;
            }
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return aggiornamentoEseguito;
    }

    private List<RaccomandataProtocollo> filtraRaccomandateNonCompletate(List<RaccomandataProtocollo> raccomandateToCheck) {
        return raccomandateToCheck.stream()
                .filter(r -> !r.hasCompletedLifetime()).toList();
    }

    private boolean aggiornaRaccomandataConDettagli(List<RaccomandataProtocollo> raccomandateFiltrate, DettaglioRaccomandataDTO raccomandataOut) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        Optional<RaccomandataProtocollo> optionalRaccomandata = raccomandateFiltrate.stream()
                .filter(r -> r.getIdRaccomandata().equals(raccomandataOut.idPro))
                .findFirst();

        try{
            if (optionalRaccomandata.isEmpty()) {
                LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                return false;
            }

            boolean isUpdated = false;
            RaccomandataProtocollo raccomandata = optionalRaccomandata.get();
            StringBuilder noteStorico = new StringBuilder("Campi aggiornati: ");

            if (raccomandataOut.idAccettazione != null && !raccomandataOut.idAccettazione.equalsIgnoreCase(raccomandata.getNumero())) {
                noteStorico.append("Numero: ")
                        .append(raccomandataOut.idAccettazione)
                        .append("; ");
                raccomandata.setNumero(raccomandataOut.idAccettazione);
                isUpdated = true;
            }

            if (raccomandataOut.costo != null && !raccomandataOut.costo.equals(raccomandata.getCosto())) {
                noteStorico.append("Costo: ")
                        .append(raccomandataOut.costo)
                        .append("; ");
                raccomandata.setCosto(raccomandataOut.costo);
                isUpdated = true;
            }

            StatoRaccomandataProtocollo nuovoStato = StatoRaccomandataProtocollo.getStato(raccomandataOut.stato);
            if (nuovoStato != null && !nuovoStato.equals(raccomandata.getStato())) {
                noteStorico.append("Stato: ")
                        .append(raccomandataOut.stato)
                        .append("; ");
                raccomandata.setStato(nuovoStato);
                isUpdated = true;
            }

            if (raccomandataOut.dataInserimento != null && !raccomandataOut.dataInserimento.equals(raccomandata.getTsInserimento())) {
                noteStorico.append("Data Inserimento: ")
                        .append(raccomandata.getTsInserimento())
                        .append(" -> ")
                        .append(Utils.fromDateToString(raccomandataOut.dataInserimento, Utils.DateFormat.DMY_HM))
                        .append("; ");
                raccomandata.setTsInserimento(raccomandataOut.dataInserimento);
                isUpdated = true;
            }

            if (raccomandataOut.dataInoltro != null && !raccomandataOut.dataInoltro.equals(raccomandata.getTsInoltro())) {
                noteStorico.append("Data Inoltro: ")
                        .append(raccomandata.getTsInoltro())
                        .append(" -> ")
                        .append(Utils.fromDateToString(raccomandataOut.dataInoltro, Utils.DateFormat.DMY_HM))
                        .append("; ");
                raccomandata.setTsInoltro(raccomandataOut.dataInoltro);
                isUpdated = true;
            }

            if (raccomandataOut.dataConsegna != null && !raccomandataOut.dataConsegna.equals(raccomandata.getTsConsegna())) {
                noteStorico.append("Data Consegna: ")
                        .append(raccomandata.getTsConsegna())
                        .append(" -> ")
                        .append(Utils.fromDateToString(raccomandataOut.dataConsegna, Utils.DateFormat.DMY_HM))
                        .append("; ");
                raccomandata.setTsConsegna(raccomandataOut.dataConsegna);
                isUpdated = true;
            }

            if (raccomandataOut.statoConsegna != null && !raccomandataOut.statoConsegna.equals(raccomandata.getStatoConsegna())) {
                noteStorico.append("Stato Consegna: ")
                        .append(raccomandata.getStatoConsegna())
                        .append(" -> ")
                        .append(raccomandataOut.statoConsegna)
                        .append("; ");
                raccomandata.setStatoConsegna(raccomandataOut.statoConsegna);
                isUpdated = true;
            }

            if(!isUpdated){
                return false;
            }

            raccomandata.persistAndFlush();

            storicoService.insertNewStoricoForNumeroProtocollo(
                    raccomandata.getProtocollo(),
                    ssoManager.extractIdFromToken(),
                    ssoManager.extractNameFromToken(),
                    "Aggiornamento raccomandata: " + raccomandata.getIdRaccomandata(),
                    noteStorico.toString()
            );
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return true;

        } catch (Exception e){
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore durante l'aggiornamento della raccomandata: " + raccomandataOut.idPro).boom();
            return false;
        }
    }

    @Transactional
    public RaccomandataMittenteFields getMittenteFileds() {
        List<Configurazione> configMittenteFields = em.createNamedQuery("getConfigurazioniByCategoria", Configurazione.class)
                .setParameter("categoria", "raccomandataWeb")
                .getResultList();
        Map<String, String> configMap = new HashMap<>();
        configMittenteFields.stream()
                .filter(c -> c.getNome() != null && c.getTipo() != null && c.getTipo().equalsIgnoreCase("campo_mittente"))
                .forEach(c -> configMap.put(c.getNome(), c.getValore()));

        return RaccomandataMittenteFields.builder()
                .mittente(configMap.get("mittente"))
                .dipartimentoServizio(configMap.get("dipartimentoServizio"))
                .indirizzo(configMap.get("indirizzo"))
                .civico(configMap.get("civico"))
                .presso(configMap.get("presso"))
                .citta(configMap.get("citta"))
                .cap(configMap.get("cap"))
                .provincia(configMap.get("provincia"))
                .build();

    }


    @Override
    public PanacheQuery<RaccomandataProtocollo> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<RaccomandataProtocollo> getFindByIdQuery(Long id) {
        return null;
    }

    @Override
    public UserTransaction getTransaction() {
        return null;
    }

}
