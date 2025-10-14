package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.narayana.jta.runtime.TransactionConfiguration;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import io.quarkus.security.UnauthorizedException;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.*;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteFullSSO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.dto.input.TitolarioInput;
import it.parsec326.pi.intranet.dto.input.VisibilitaTitolarioInput;
import it.parsec326.pi.intranet.dto.output.PermessiVisibilitaOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaPermessiVisibilitaDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaProtocolliDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaTitolarioDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.mapper.TitolarioMapper;
import it.parsec326.pi.intranet.mapper.VisibilitaTitolarioMapper;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.PermessoFascicoloDipendente;
import it.parsec326.pi.intranet.utils.common.TipologiaTitolario;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.commons.lang3.time.DateUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.hibernate.Hibernate;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.time.Instant;
import java.time.Year;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@ApplicationScoped
@Slf4j
public class TitolarioService implements PanacheCustomEntityServiceInterface<Titolario> {

    private final static String STORICO_INSERIMENTO_TITOLARIO = "Creazione voce";
    private final static String STORICO_MODIFICA_TITOLARIO = "Modifica voce";
    private final static String STORICO_ELIMINAZIONE_TITOLARIO = "Eliminizione voce";
    private final static String STORICO_DROP_TITOLARIO = "Eliminizione definitiva voce";
    private final static String STORICO_SPOSTAMENTO_TITOLARIO = "Spostamento fascicolo";
    private final static String STORICO_SPOSTAMENTO_PROTOCOLLO = "Riclassificazione protocollo";
    private final static String STORICO_SPOSTAMENTO_DOCUMENTO = "Riclassificazione documento";
    private final static String ERROR_MESSAGE_SPOSTAMENTO_ALLEGATO = "Non è stato spostato nessun Documento";

    @Inject
    @Getter
    UserTransaction transaction;

    @Inject
    EntityManager em;

    @Inject
    TitolarioMapper mapper;

    @Inject
    SSOClient ssoManager;

    @Inject
    StoricoService storicoService;

    @Inject
    VisibilitaTitolarioMapper visibilitaTitolarioMapper;

    @Inject
    DocumentService documentService;

    @Inject
    AllegatoService allegatoService;

    @Inject
    ProtocolloService protocolloService;

    @Inject
    ConfigurazioneService configurazioneService;

    @ConfigProperty(name = "zip.maxSize")
    Long zipMaxSize;

    public TitolariOutputDTO getHierarchyForTitolarioId(Long id) {

        String query = "WITH RECURSIVE titolario_hierarchy_query AS " +
                "(select * from titolario where id = ?1 " +
                "UNION ALL " +
                "select e.* From titolario e INNER JOIN titolario_hierarchy_query c ON e.id = c.id_padre " +
                ") Select * from titolario_hierarchy_query";

        List<Titolario> results = em.createNativeQuery(query, Titolario.class).setParameter(1, id.intValue()).getResultList();

        Collections.reverse(results);
        List<TitolarioOutputDTO> res = new ArrayList<>();
        for (Titolario t : results) {
            if (!Objects.equals(t.getId(), id))
                res.add(mapper.toOutputDTO(t));
        }
        TitolariOutputDTO dto = new TitolariOutputDTO();
        dto.setTitolario(res);
        return dto;
    }

    @Transactional
    public List<Titolario> getHierarchyTitolarioForTitolarioId(Long id) {
        String query = "WITH RECURSIVE titolario_hierarchy_query AS " +
                "(select * from titolario where id = ?1 " +
                "UNION ALL " +
                "select e.* From titolario e INNER JOIN titolario_hierarchy_query c ON e.id = c.id_padre " +
                ") Select * from titolario_hierarchy_query";

        return em.createNativeQuery(query, Titolario.class).setParameter(1, id.intValue()).getResultList();
    }

/*    @Transactional
    public List<Long> getHierarchyIdsTitolarioForTitolarioId(Long id){
        String query = "WITH RECURSIVE titolario_hierarchy_query AS " +
                "(select id from titolario where id = ?1 " +
                "UNION ALL " +
                "select e.id From titolario e INNER JOIN titolario_hierarchy_query c ON e.id = c.id_padre " +
                ") Select id from titolario_hierarchy_query";

        return em.createNativeQuery(query).setParameter(1, id.intValue()).getResultList();
    }*/

    public List<Object[]> getDescendantsPairsForTitolarioId(Long id) {
        String query = "WITH RECURSIVE titolario_hierarchy_query AS ( " +
                "select e.id, e.id_padre from titolario e where e.id_padre = ?1 " +
                "UNION ALL " +
                "select e.id, e.id_padre from titolario e INNER JOIN titolario_hierarchy_query c ON e.id_padre = c.id " +
                ") Select id, id_padre from titolario_hierarchy_query order by id_padre";
        return em.createNativeQuery(query).setParameter(1, id.intValue()).getResultList();
    }

    public List<Long> getDescendantsForTitolarioId(Long id) {
        String query = "WITH RECURSIVE titolario_hierarchy_query AS ( " +
                "select e.id from titolario e where e.id_padre = ?1 " +
                "UNION ALL " +
                "select e.id from titolario e INNER JOIN titolario_hierarchy_query c ON e.id_padre = c.id " +
                ") Select id from titolario_hierarchy_query";

        return em.createNativeQuery(query).setParameter(1, id.intValue()).getResultList();
    }

    public List<Long> getDescendantsWithoutFascicoloDipendenteForTitolarioId(Long id) {
        String query = "WITH RECURSIVE titolario_hierarchy_query AS ( " +
                "select e.id from titolario e where e.id_padre = ?1 " +
                "and e.is_fascicolo_dipendente = FALSE " +
                "UNION ALL " +
                "select e.id from titolario e INNER JOIN titolario_hierarchy_query c ON e.id_padre = c.id " +
                "where e.is_fascicolo_dipendente = false) " +
                "Select id from titolario_hierarchy_query ";

        return em.createNativeQuery(query).setParameter(1, id.intValue()).getResultList();
    }

/*    public List<Long> getDescendantsForFascicoloIdByCdrCode(String cdrCode) {
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("WITH RECURSIVE titolario_hierarchy_query AS ( ");
        queryBuilder.append("SELECT e.id FROM titolario e WHERE e.id_padre IN (");
        queryBuilder.append("SELECT t.id FROM titolario t WHERE t.tipologia_titolario = 'FascicoloLv1' AND t.cdr_code = ?1 AND t.is_fascicolo_dipendente = FALSE) ");
        queryBuilder.append("OR e.id IN (SELECT t.id FROM titolario t WHERE t.tipologia_titolario = 'FascicoloLv1' AND t.cdr_code = ?1 AND t.is_fascicolo_dipendente = FALSE) ");
        queryBuilder.append("UNION ALL SELECT e.id FROM titolario e INNER JOIN titolario_hierarchy_query c ON e.id_padre = c.id ");
        queryBuilder.append(") SELECT id FROM titolario_hierarchy_query");

        String query = queryBuilder.toString();

        return em.createNativeQuery(query)
                .setParameter(1, cdrCode)
                .getResultList();
    }*/


    @Transactional
    public boolean insertTitolario(TitolarioInput input) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try {
            if (input == null) throw new IllegalArgumentException("L'input non può essere nullo");

            Titolario titolario = new Titolario();
            this.setFieldTitolario(input, titolario, true);

            if (input.tsChiusura != null) {
                // Modifica ora, minuti, secondi e millisecondi della data ricevuta
                titolario.setTsChiusura(setEndOfDay(input.tsChiusura));
            } else if (!this.isRootType(titolario.getTipologiaTitolario())){
                // Imposta TsChiusura all'ultimo giorno dell'anno corrente
                Calendar cal = Calendar.getInstance();
                cal.set(Calendar.MONTH, Calendar.DECEMBER);
                cal.set(Calendar.DAY_OF_MONTH, 31);
                titolario.setTsChiusura(setEndOfDay(cal.getTime()));
            }

            titolario.setTsCreation(Calendar.getInstance().getTime());
            titolario.setIdUtenteCreatore(ssoManager.extractIdFromToken());
            titolario.setNomeUtenteCreatore(ssoManager.extractNameFromToken());
            titolario.setCdr(input.cdr);
            titolario.setIsFascicoloDipendente(false);
            titolario.setCdrCode(TipologiaTitolario.valueOf(input.tipologia).equals(TipologiaTitolario.FascicoloLv1) ? input.cdrCode : null);
            titolario.persistAndFlush();

            this.setStoricoFascicolo(titolario, STORICO_INSERIMENTO_TITOLARIO, titolario.getTipologiaTitolario().getTipologiaTitolario().concat(" - ").concat(titolario.getNome()));

            if (titolario.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)) {
                //NOTA: aggiungere permesso di scrittura esplicito per l'ufficio
                VisibilitaTitolarioInput vtInputDefault = new VisibilitaTitolarioInput();
                vtInputDefault.setIdTitolario(titolario.getId());
                vtInputDefault.setUtenti(new ArrayList<>());
                vtInputDefault.setUtenteAuthIdList(new ArrayList<>());
                vtInputDefault.setCdr(input.cdr);
                vtInputDefault.setCdrCode(input.cdrCode);
                vtInputDefault.setPermesso("scrittura");
                vtInputDefault.setNote("Permesso di scrittura di default");
                insertVisibilitaTitolario(vtInputDefault);
            }

            return true;
        } catch (IllegalArgumentException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,e.getMessage()).boom();
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nel salvataggio del Titolario", e).boom();
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }
        return false;
    }

    @Transactional
    public boolean updateTitolario(TitolarioInput input) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try {
            // Validazione dell'input
            if (input == null) {
                CustomException.get(CustomException.ErrorCode.INTERNAL,"TitolarioInput non può essere nullo").boom();
            }

            Titolario titolario = null;

            if (input.id != null) {
                titolario = Titolario.findById(input.id);
                if (titolario == null) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL,"Titolario con ID: {} non trovato",input.id).boom();
                }
            }else {
                CustomException.get(CustomException.ErrorCode.INTERNAL,"L'ID Titolario non puo' essere nullo").boom();
            }

            String oldName = titolario.getNome();
            String oldTipo = titolario.getTipologiaTitolario().getTipologiaTitolario();
            String oldNote = titolario.getNote();
            boolean oldLeaf = titolario.getLeaf();
            Long oldIdPadre = titolario.getIdPadre();
            String oldTsChiusura = Utils.fromDateToString(titolario.getTsChiusura(), Utils.DateFormat.DMY);

            this.setFieldTitolario(input, titolario, false);

            //NOTA: si setta la data di chiusura solo dai fascicoli in poi!
            if (!this.isRootType(titolario.getTipologiaTitolario())) {
                if(input.tsChiusura != null){
                    List<Long> descendantsList = this.getDescendantsForTitolarioId(titolario.getId());
                    Date today = Calendar.getInstance().getTime();
                    boolean isToday = DateUtils.isSameDay(input.tsChiusura, today);
                    Date chiusura = isToday ? today : setEndOfDay(input.tsChiusura);
                    descendantsList.forEach(id -> {
                        Titolario t = Titolario.findById(id);
                        if(t.getTsChiusura() == null || t.getTsChiusura().after(chiusura)) {
                            t.setTsChiusura(chiusura);
                            t.persistAndFlush();
                        }
                    });
                    // Modifica ora, minuti, secondi e millisecondi della data ricevuta
                    titolario.setTsChiusura(chiusura);
                }
            }

            titolario.setTsUpdate(Calendar.getInstance().getTime());

            titolario.persistAndFlush();

            StringBuilder sb = new StringBuilder();
            if (oldName != null && !oldName.equalsIgnoreCase(titolario.getNome())) sb.append(", Nome precedente: ").append(oldName);
            if (oldTipo != null && !oldTipo.equalsIgnoreCase(titolario.getTipologiaTitolario().getTipologiaTitolario())) sb.append(", Tipologia precedente: ").append(oldTipo);
            if (oldNote != null && !oldNote.equalsIgnoreCase(titolario.getNote())) sb.append(", Note precedenti: ").append(oldNote);
            if (oldTsChiusura != null && !oldTsChiusura.equals(Utils.fromDateToString(titolario.getTsChiusura(), Utils.DateFormat.DMY))) sb.append(", Data di chiusura precedente: ").append(oldTsChiusura);
            if (oldLeaf != Boolean.TRUE.equals(titolario.getLeaf())) sb.append(", Foglia precedente: ").append(oldLeaf ? "Sì" : "No");
            if (!Objects.equals(oldIdPadre, titolario.getIdPadre())) sb.append(", Titolario padre precedente: ").append(oldIdPadre);

            this.setStoricoFascicolo(titolario, STORICO_MODIFICA_TITOLARIO, !sb.isEmpty() ? sb.substring(2, sb.length()) : "");

            return true;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    String.format("Errore durante la elaborazione del Titolario - %s", e.getMessage())).boom();

            return false;
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }
    }

    @Transactional
    public void setFieldTitolario(TitolarioInput input, Titolario titolario, boolean insert) {
        if (input.idPadre != null && input.idPadre > 0) {
            Titolario tPadre = Titolario.findById(input.idPadre);
            TipologiaTitolario tipologiaTitolario = tPadre.getTipologiaTitolario();
            titolario.setIdPadre(input.idPadre);
            if(insert){
                titolario.setTipologiaTitolario(TipologiaTitolario.getTipologiaCorrente(tipologiaTitolario));
            }else if(input.tipologia != null){
                titolario.setTipologiaTitolario(TipologiaTitolario.valueOf(input.tipologia));
            }
        }else if(insert){
            titolario.setTipologiaTitolario(TipologiaTitolario.Titolo);
        }

        if(!insert && Boolean.TRUE.equals(input.leaf != titolario.getLeaf())){
            if(input.leaf){
               Optional<Titolario> record = Titolario.find("idPadre", titolario.getId()).firstResultOptional();
               if(record.isPresent()){
                   CustomException.get(CustomException.ErrorCode.INTERNAL,
                           String.format("Impossibile trasformare in foglia il Fascicolo: Presente sottoFascicolo %s ",record.get().getNome())).boom();
               }
               titolario.setLeaf(true);
            }else {
               if(!em.createNamedQuery("getAllIdProtocolloByFascicolo")
                        .setParameter("idFascicolo", titolario.getId())
                        .getResultList().isEmpty()){

                   CustomException.get(CustomException.ErrorCode.INTERNAL,
                           "Impossibile eseguire l'operazione: Il Fascicolo risulta associato ad uno o più Protocolli").boom();
               }
                if(!em.createNamedQuery("getAllAllegatiByFascicolo")
                        .setParameter("idFascicolo", titolario.getId())
                        .getResultList().isEmpty()){

                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            "Impossibile eseguire l'operazione: Il Fascicolo contiene uno o più documenti").boom();
                }
               titolario.setLeaf(false);
            }
        }

        titolario.setLeaf(input.leaf);
        titolario.setNome(input.nome);
        titolario.setNote(input.getNote());
        titolario.setIdUtenteLastOperation(ssoManager.extractIdFromToken());
    }

    private Date setEndOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    // Metodo di supporto registrare l'operazione nello storico
    @Transactional
    public void setStoricoFascicolo(Titolario fascicolo, String operazione, String note) {
        storicoService.insertNewStoricoForIdTitolario(
                fascicolo,
                ssoManager.extractIdFromToken(),
                ssoManager.extractNameFromToken(),
                operazione,
                note
        );
    }

    // Metodo di supporto per verificare se il Titolario è di tipo root
    public boolean isRootType(TipologiaTitolario tipologia) {
        return tipologia.equals(TipologiaTitolario.Titolo) ||
                tipologia.equals(TipologiaTitolario.Sezione) ||
                tipologia.equals(TipologiaTitolario.SottoSezione);
    }

    @Transactional
    public boolean deleteTitolario(Long idTitolario, boolean drop) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try {
            // Controlla se l'ID del titolario è nullo
            if (idTitolario == null) {
                CustomException.get(CustomException.ErrorCode.INTERNAL, "L'ID non può essere nullo").boom();
            }

            // Trova il Titolario tramite l'ID
            Titolario titolario = Titolario.findById(idTitolario);
            if (titolario == null) {
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Non è presente nessun titolario per l'ID: {}", idTitolario).boom();
            }

            boolean isRootType = this.isRootType(titolario.getTipologiaTitolario());
            if (isRootType && (!ssoManager.isUtenteAdmin())) {
                // IMPORTANTE: solo gli admin possono eliminare un titolo/sezione/sottosezione
                CustomException.get(CustomException.ErrorCode.INTERNAL,
                        String.format("Impossibile eliminare la voce del titolario: \"%s\", non si dispone dei permessi necessari", titolario.getNome())).boom();
            }

            if (drop && titolario.getTsDeleted() == null) {
                // IMPORTANTE: si può fare un drop del fascicolo soltanto se è già stato eliminato logicamente
                CustomException.get(CustomException.ErrorCode.INTERNAL,
                        String.format("Impossibile eliminare definitivamente la voce del titolario: \"%s\", bisogna dapprima eliminarlo logicamente", titolario.getNome())).boom();
            }

            if(drop && titolario.getIsFascicoloDipendente() ){
                CustomException.get(CustomException.ErrorCode.INTERNAL,
                        String.format("Impossibile eliminare definitivamente la voce del titolario: \"%s\", è un fascicolo del dipendente", titolario.getNome())).boom();
            }

            String idUtente = ssoManager.extractIdFromToken();
            String nomeUtente = ssoManager.extractNameFromToken();

            // Se il Fascicolo è una foglia, controlla l'esistenza di Protocolli associati
            if (titolario.getLeaf()) {
                if (!this.getAllProtocolliByFascicolo(idTitolario).isEmpty()) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            String.format("Impossibile eliminare la voce del titolario: \"%s\", presenti protocolli associati", titolario.getNome())).boom();
                }

                if (!this.getAllAllegatiByFascicolo(idTitolario).isEmpty()) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            String.format("Impossibile eliminare la voce del titolario: \"%s\", presenti documenti caricati", titolario.getNome())).boom();
                }

                if (drop) {
                    VisibilitaTitolario.delete("titolario.id = ?1",idTitolario);
                    Storico.delete("titolario.id = ?1",idTitolario);
                    titolario.delete();
                    storicoService.insertNewStoricoForOperazioneUtente(idUtente, nomeUtente, STORICO_DROP_TITOLARIO, titolario.getNome());
                }
                else {
                    titolario.setTsDeleted(Calendar.getInstance().getTime());
                    this.setStoricoFascicolo(titolario, STORICO_ELIMINAZIONE_TITOLARIO, titolario.getNome());
                    titolario.persistAndFlush();
                }

                return true;
            }

            List<Long> descendentsId = this.getDescendantsForTitolarioId(idTitolario);

            // Controlla l'esistenza di Protocolli associati nei Titolari figli
            for (Long id : descendentsId) {
                if (!this.getAllProtocolliByFascicolo(id).isEmpty()) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            String.format("Impossibile eliminare la voce del titolario: \"%s\", presente sotto fascicolo con protocolli associati", titolario.getNome())).boom();
                }

                if (!this.getAllAllegatiByFascicolo(id).isEmpty()) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            String.format("Impossibile eliminare la voce del titolario: \"%s\", presente sotto fascicolo con documenti caricati", titolario.getNome())).boom();
                }
            }

            // Elimina tutti i Titolari figli
            for (Long id : descendentsId) {
                Titolario sottoFascicolo = Titolario.findById(id);

                if (drop) {

                    if(sottoFascicolo.getIsFascicoloDipendente() ){
                        CustomException.get(CustomException.ErrorCode.INTERNAL,
                                String.format("Impossibile eliminare definitivamente la voce del titolario: \"%s\", è un fascicolo del dipendente", titolario.getNome())).boom();
                    }

                    if(sottoFascicolo.getTsDeleted() != null) {
                        VisibilitaTitolario.delete("titolario.id = ?1",id);
                        Storico.delete("titolario.id = ?1",id);
                        storicoService.insertNewStoricoForOperazioneUtente(idUtente, nomeUtente, STORICO_DROP_TITOLARIO, sottoFascicolo.getNome());
                        sottoFascicolo.delete();
                    }
                    else {
                        // se sottofascicolo non è cancellato logicamento  -> abort di tutto il processo
                        CustomException.get(CustomException.ErrorCode.INTERNAL,
                                String.format("Impossibile eliminare definitivamente la voce del titolario: \"%s\", esistono dei sottofascicoli non eliminati", titolario.getNome())).boom();
                    }
                }
                else {
                    if(sottoFascicolo.getTsDeleted() == null){
                        sottoFascicolo.setTsDeleted(Calendar.getInstance().getTime());
                        sottoFascicolo.persistAndFlush();
                        this.setStoricoFascicolo(sottoFascicolo, STORICO_ELIMINAZIONE_TITOLARIO, "Eliminazione : " + sottoFascicolo.getNome());
                    }
                }
            }

            // Elimina il Titolario principale
            if (drop) {
                VisibilitaTitolario.delete("titolario.id = ?1",idTitolario);
                Storico.delete("titolario.id = ?1",idTitolario);
                storicoService.insertNewStoricoForOperazioneUtente(idUtente, nomeUtente, STORICO_DROP_TITOLARIO, titolario.getNome());
                titolario.delete();
            }
            else {
                titolario.setTsDeleted(Calendar.getInstance().getTime());
                this.setStoricoFascicolo(titolario, STORICO_ELIMINAZIONE_TITOLARIO, "Eliminazione: " + titolario.getNome());
                titolario.persistAndFlush();
            }
            return true;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    String.format("Errore durante l'eliminazione della voce del titolario, %s",e.getMessage())).boom();
            return false;
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }
    }

    @Transactional
    public List<Protocollo> getAllProtocolliByFascicolo(Long idFascicolo) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        List<Protocollo> result = new ArrayList<>();

        try {
            if (idFascicolo == null) {
                throw new IllegalArgumentException("L'ID del Fascicolo non può essere nullo");
            }

            List<Long> idProtocollo = em.createNamedQuery("getAllIdProtocolloByFascicolo")
                    .setParameter("idFascicolo", idFascicolo)
                    .getResultList();

            // Popolamento della lista dei protocolli
            idProtocollo.forEach(id -> {
                Protocollo protocollo = Protocollo.findById(id);
                if (protocollo != null) {
                    result.add(protocollo);
                } else {
                    throw new IllegalArgumentException(String.format("Protocollo con ID: %s non trovato", id));
                }
            });

        } catch (IllegalArgumentException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw e;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    String.format("Errore durante il recupero dei protocolli per il fascicolo con ID: %s",idFascicolo), e).boom();
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }

        return result;
    }

    @Transactional
    public List<Allegato> getAllAllegatiByFascicolo(Long idFascicolo) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        List<Allegato> result = new ArrayList<>();

        try {
            if (idFascicolo == null) {
                throw new IllegalArgumentException("L'ID del Fascicolo non può essere nullo");
            }

            List<Long> idAllegato = em.createNamedQuery("getAllAllegatiByFascicolo")
                    .setParameter("idFascicolo", idFascicolo)
                    .getResultList();

            // Popolamento della lista dei protocolli
            idAllegato.forEach(id -> {
                Allegato allegato = Allegato.findById(id);
                if (allegato != null) {
                    result.add(allegato);
                } else {
                    throw new IllegalArgumentException(String.format("Allegato con ID: %s non trovato", id));
                }
            });

        } catch (IllegalArgumentException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw e;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException("Errore durante il recupero degli allegati per il fascicolo con ID " + idFascicolo, e);
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }

        return result;
    }

    @Transactional
    public PanacheQuery<Protocollo> getProtocolliByFascicoloQuery(RicercaProtocolliDTO dto){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        String idUtente = ssoManager.extractIdFromToken();
        boolean isAdmin = ssoManager.isUtenteAdmin();
        boolean isDirigente = ssoManager.isUtenteDirigente();
        boolean isArchivista = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("archivista"), dto.getCdrCode());
        boolean isProtocollatore = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("protocollatore"), dto.getCdrCode());
        Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(dto.getCdrCode());

        String by = "p.tsCreation";
        boolean desc = false;
        if(dto.getSort() != null){
            if(dto.getSort().by != null){
                by = "p." + dto.getSort().by;
            }
            desc = dto.getSort().desc;
        }

        Sort sortCriteria = SortInput.getSortOrDefault(new SortInput(by, desc));

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("SELECT p FROM Protocollo p JOIN p.protocolliClassificazioneList pc WHERE pc.idTitolario = :idFascicolo ");
        params.put("idFascicolo", dto.getIdFascicolo());

        if (!isAdmin) {
            boolean isImmutable = true;

            Titolario titolario = Titolario.findById(dto.getIdFascicolo());

            //se di livello 1 oppure non fascicolo del dipendente
            if (titolario.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1) || !titolario.getIsFascicoloDipendente()) {
                Map<String, Object> paramsVisibilitaTitolario = new HashMap<>();
                paramsVisibilitaTitolario.put("cdrCodes", cdrCodes);
                paramsVisibilitaTitolario.put("idUtente", idUtente);

                if (titolario.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)) {
                    paramsVisibilitaTitolario.put("titolario", titolario);
                }
                else {
                    List<Titolario> fascicoli = getHierarchyTitolarioForTitolarioId(dto.getIdFascicolo());
                    for(Titolario t : fascicoli) {
                        if (t.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)) {
                            paramsVisibilitaTitolario.put("titolario", t);
                            break;
                        }
                    }
                }
                VisibilitaTitolario vt = (VisibilitaTitolario) VisibilitaTitolario.find("titolario = :titolario and (cdrCode in :cdrCodes and (idUtente is null OR idUtente = :idUtente))", paramsVisibilitaTitolario).firstResultOptional().orElse(null);
                //se esiste un permesso di visibilità per l'utente o per l'ufficio -> si può vedere il fascicolo completo
                if (vt != null) {
                    isImmutable = false;
                }
            }
            //fascicolo del dipendente -> check sul permesso se posso visualizzare i protocolli del fascicolo
            else {
                PermessoFascicoloDipendente p = isFascicoloDipendenteVisibile(titolario, idUtente, cdrCodes, isArchivista, isProtocollatore, isDirigente);
                if (!p.equals(PermessoFascicoloDipendente.no)) {
                    isImmutable = false;
                }
            }

            //isImmutable è true se non ho trovato permessi sul fascicolo (né normale né del dipendente)
            if (isImmutable) {
                // si cercano soltanto i protocolli creati dall'utente oppure assegnati all'utente
                String sbQueryTitolariForProtocolli = "select id_protocollo from protocolli_classificazione where id_titolario = ?1 and " +
                        "id_protocollo in (select id from protocolli where id_utente = ?2 and cdr = ?3) " +
                        "or id_protocollo in ( " +
                        "select id_protocollo from referenti_protocollo where " +
                        "(id_destinatario = ?2 and attribuzione = 'competenza') ";

                if (isArchivista || isProtocollatore) {
                    sbQueryTitolariForProtocolli += "or (id_destinatario in ?4 and attribuzione = 'competenza') ";
                }
                sbQueryTitolariForProtocolli += ")";

                Query q = em.createNativeQuery(sbQueryTitolariForProtocolli);
                q.setParameter(1, dto.getIdFascicolo());
                q.setParameter(2, idUtente);
                q.setParameter(3, dto.getCdr());

                if (isArchivista || isProtocollatore) {
                    q.setParameter(4, ssoManager.getRelatedCdrCodes(dto.getCdrCode()));
                }
                try {
                    List<Long> idProtocolliAvailable = q.getResultList();

                    query.append("and p.id in :idProtocolliAvailable ");
                    params.put("idProtocolliAvailable", idProtocolliAvailable);
                }
                catch(Exception ignored) {
                    log.error(ignored.getMessage());
                }
            }
        }

        if (dto.isEmpty() && !dto.hasSearch()) {
            return Protocollo.find(query.toString(),sortCriteria, params);
        }

        if(dto.hasSearch()){
            query.append("and (:search = '' ")
                    .append("or lower(nProtocollo) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(stato) like LOWER(concat('%', REPLACE(:search, ' ', ''), '%')) ")
                    .append("or lower(oggetto) like LOWER(concat('%', :search, '%')) )");
            params.put("search", dto.getSearch().trim());
        }

        if (dto.hasNumero()) {
            query.append("and lower(nProtocollo) like LOWER(concat('%', :nProtocollo, '%')) ");
            params.put("nProtocollo", dto.getNumero());
        }

        if(dto.getAnno() != null){
            query.append("and extract(year from p.tsCreation) = :anno ");
            params.put("anno", dto.getAnno());
        }

        if (dto.hasOggetto()) {
            query.append("and lower(oggetto) like LOWER(concat('%', :oggetto, '%')) ");
            params.put("oggetto", dto.getOggetto().trim());
        }

        if (dto.hasStato()) {
//            appendInClause(query, params, "stato", dto.getStato(), "stato");
            query.append("and stato in :statoList ");
            params.put("statoList", dto.getStato());


        }

        if (dto.hasTipoRegistrazione()) {
//            appendInClause(query, params, "tipoRegistrazione", dto.getTipoRegistrazione(), "tipoRegistrazione");
            query.append("and tipoRegistrazione in :tipoRegistrazioneList ");
            params.put("tipoRegistrazioneList", dto.getTipoRegistrazione());
        }

        if (dto.hasMetodoSpedizione()) {
//            appendInClause(query, params, "metodoSpedizione", dto.getMetodoSpedizione(), "metodoSpedizione");
            query.append("and metodoSpedizione in :metodoSpedizioneList ");
            params.put("metodoSpedizioneList", dto.getMetodoSpedizione());
        }

        // se non ci sono parametri di ricerca avanzata, si ritorna subito la lista
        if(!dto.isRicercaAvanzata()){
            return Protocollo.find(query.toString(),sortCriteria, params);
        }

        if (dto.hasNote()) {
            query.append("and lower(note) like LOWER(concat('%', :note, '%')) ");
            params.put("note", dto.getNote().trim());
        }

        // aggiunta filtro per intervallo temporale
        if (dto.hasDataCreazioneIntervallo()) {
            query.append("and p.tsCreation BETWEEN :dataCreazioneFrom AND :dataCreazioneTo ");
            params.put("dataCreazioneFrom", dto.getDataCreazioneFrom());
            params.put("dataCreazioneTo", dto.getDataCreazioneTo());
        }
        else if (dto.getDataCreazioneFrom() != null) {
            query.append("and p.tsCreation >= :dataCreazioneFrom ");
            params.put("dataCreazioneFrom", dto.getDataCreazioneFrom());
        }
        else if (dto.getDataCreazioneTo() != null) {
            query.append("and p.tsCreation <= :dataCreazioneTo ");
            params.put("dataCreazioneTo", dto.getDataCreazioneTo());
        }

        if (dto.hasMittente()) {
            query.append("and lower(mittente) like LOWER(concat('%', :mittente, '%')) ");
            params.put("mittente", dto.getMittente().trim());
        }

        if (dto.hasAssegnatari()) {
            query.append("and lower(assegnatari) like LOWER(concat('%', :assegnatari, '%')) ");
            params.put("assegnatari", dto.getAssegnatari().trim());
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return Protocollo.find(query.toString(),sortCriteria, params);
    }

    public ProtocolliOutputDTO getProtocolliByFascicolo(RicercaProtocolliDTO dto){

        PanacheQuery<Protocollo> query = getProtocolliByFascicoloQuery(dto);
        List<Protocollo> protocolli = query.page(Page.of(dto.getPage(), dto.getSize())).list();
        protocolli.forEach(protocollo -> Hibernate.initialize(protocollo.getProtocolliClassificazioneList()));

        long totalResults = query.count();
        return new ProtocolliOutputDTO(protocolli, getPagesCount(totalResults, dto.getSize()), totalResults);
    }

/*
    private void appendInClause(StringBuilder query, Map<String, Object> params, String fieldName, List<String> values, String paramName) {
        if (values != null && !values.isEmpty()) {
            String inClause = values.stream()
                    .map(value -> {
                        String param = paramName + values.indexOf(value);
                        params.put(param, value.trim().toLowerCase());
                        return ":" + param;
                    })
                    .collect(Collectors.joining(", "));
            query.append("and lower(")
                    .append(fieldName)
                    .append(") in (")
                    .append(inClause)
                    .append(") ");
        }
    }
*/

    @Transactional
    public boolean spostaProtocollo(List<Long> idProtocolli, Long idFascicoloOld, Long idFascicoloNew) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try {
            // Verifica dei parametri
            if (idProtocolli == null || idProtocolli.isEmpty()) {
                throw new IllegalArgumentException("La lista degli ID dei protocolli non può essere nulla o vuota");
            }
            if (idFascicoloOld == null || idFascicoloNew == null) {
                throw new IllegalArgumentException("Gli ID del Fascicolo non possono essere nulli");
            }

            Titolario fascicolo = Titolario.findById(idFascicoloNew);

            if(fascicolo.getTsDeleted() != null || (fascicolo.getTsChiusura() != null && fascicolo.getTsChiusura().before(Calendar.getInstance().getTime()))) {
                throw new IllegalArgumentException("Impossibile spostare i protocolli in un fascicolo chiuso o eliminato");
            }

            // Esecuzione della query
            int updatedRows = em.createNamedQuery("spostaProtocollo")
                    .setParameter("idProtocolli", idProtocolli)
                    .setParameter("idFascicoloOld", idFascicoloOld)
                    .setParameter("idFascicoloNew", idFascicoloNew)
                    .executeUpdate();

            if(updatedRows == 0){
                return true;
            }

            String idUtenteForStorico = ssoManager.extractIdFromToken();
            String nomeUtenteForStorico = ssoManager.extractNameFromToken();
            for (Long idProtocollo : idProtocolli) {
                Protocollo p = Protocollo.findById(idProtocollo);
                storicoService.insertNewStoricoForNumeroProtocollo(p, idUtenteForStorico, nomeUtenteForStorico, STORICO_SPOSTAMENTO_PROTOCOLLO, "");
            }

            return true;
        } catch (IllegalArgumentException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,e.getMessage()).boom();
        } catch (PersistenceException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore durante lo spostamento dei protocolli nel database").boom();
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore imprevisto durante lo spostamento dei protocolli").boom();
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }
        return false;
    }

    public int getMaxLivelloFascicolazioneForTitolario() {
        List<Configurazione> confTitolario = configurazioneService.getAllConfigurazioniByCategoria("titolario");
        return configurazioneService.getMaxLivelloFascicolazioneTitolario(confTitolario);
    }

    @Transactional
    public boolean setMaxLivelloFascicolazioneForTitolario(Integer livello) {
        if (livello == null) {
            throw new IllegalArgumentException("Il parametro non può essere null");
        }

        if (!ssoManager.hasJwtToken() || (!ssoManager.isUtenteAdmin())) {
            throw new UnauthorizedException("Autenticazione non valida");
        }

        int maxLivello = getMaxLivelloFascicolazioneForTitolario();
        if (livello < maxLivello) {
            throw new IllegalArgumentException("Il parametro deve essere maggiore di quello precedentemente salvato");
        }

        return configurazioneService.saveMaxLivelloFascicolazione(String.valueOf(livello));
    }

    @Transactional
    public boolean spostaFascicolo(List<Long> idFascicoliList, Long idPadreDestinazione, String cdr, String cdrCode) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        int maxLivelloFascicolazione = getMaxLivelloFascicolazioneForTitolario();

        if (idPadreDestinazione == null) {
            throw new IllegalArgumentException("L'ID fascicolo destinazione non può essere null");
        }

        Titolario titolarioDestinazione = Titolario.findById(idPadreDestinazione);
        int livelloFascicolazioneDestinazione = 0;

        if (titolarioDestinazione == null) {
            throw new IllegalArgumentException("Fascicolo destinazione con ID " + idPadreDestinazione + " non trovato");
        }

        if (titolarioDestinazione.getTipologiaTitolario().equals(TipologiaTitolario.Titolo) || titolarioDestinazione.getTipologiaTitolario().equals(TipologiaTitolario.Sezione)) {
            throw new IllegalArgumentException("Fascicolo destinazione con ID " + idPadreDestinazione + " non valido. E' possibile spostare fascicoli in una sottosezione o in un fascicolo.");
        }

        // controllo che il fascicolo di destinazione non sia un fascicolo dipendente
        if (Boolean.TRUE.equals(titolarioDestinazione.getIsFascicoloDipendente())) {
            throw new IllegalArgumentException("Fascicolo destinazione con ID " + idPadreDestinazione + " non valido. E' un fascicolo del dipendente");
        }

        if (titolarioDestinazione.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLvN)) {
            livelloFascicolazioneDestinazione = 1;
            List<TitolarioOutputDTO> hierarchy = getHierarchyForTitolarioId(idPadreDestinazione).getTitolario();
            for(TitolarioOutputDTO h : hierarchy) {
                if (h.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLv1.name()) || h.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLvN.name())) {
                    livelloFascicolazioneDestinazione += 1;
                }
            }
        }
        else if (titolarioDestinazione.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)) {
            livelloFascicolazioneDestinazione = 1;
        }

        if (Boolean.TRUE.equals(titolarioDestinazione.getLeaf()) || livelloFascicolazioneDestinazione == maxLivelloFascicolazione) {
            throw new IllegalArgumentException("Fascicolo destinazione con ID " + idPadreDestinazione + " non valido. E' una foglia");
        }

        TipologiaTitolario newTipologiaFascicoloSorgente = TipologiaTitolario.getTipologiaCorrente(titolarioDestinazione.getTipologiaTitolario());


        try {
            for (Long idFascicolo : idFascicoliList) {

                String prefixError = "Errore nello spostamento del fascicolo: ";

                if (idFascicolo == null) {
                    throw new IllegalArgumentException(prefixError + "ID null");
                }

                prefixError = "Errore nello spostamento del fascicolo " + idFascicolo + ": ";

                Titolario fascicolo = Titolario.findById(idFascicolo);
                if (fascicolo == null) {
                    throw new IllegalArgumentException(prefixError + "Non esistente");
                }

                prefixError = "Errore nello spostamento del fascicolo " + fascicolo.getNome() + ": ";

                if (Boolean.TRUE.equals(fascicolo.getIsFascicoloDipendente())) {
                    throw new IllegalArgumentException(prefixError + "Fascicolo del dipendente non può essere spostato");
                }

                TitolariOutputDTO hierarchy = getHierarchyForTitolarioId(idFascicolo);
                if (hierarchy == null) {
                    throw new IllegalArgumentException(prefixError + "Gerarchia non trovata");
                }

                // Se fascicolo non è foglia, bisogna capire quanti livelli ha la sua discendenza per effettuare il controllo sul limite massimo
                // Se fascicolo è foglia non serve effettuare il check perché sarà spostato sotto la gerarchia di destinazione
                if (!fascicolo.getLeaf()) {
                    int livelloFascicoloSorgente = getDepthForFascicoloId(fascicolo.getId());
                    if (livelloFascicolazioneDestinazione + livelloFascicoloSorgente > maxLivelloFascicolazione) {
                        throw new IllegalArgumentException(prefixError + "Limite di gerarchia superato = " + livelloFascicolazioneDestinazione + " + " + livelloFascicoloSorgente + " > " + maxLivelloFascicolazione);
                    }

                    // Se fascicolo non ha discendenti e deve essere spostato al penultimo livello -> spostamento non valido
                    if (livelloFascicoloSorgente == 0 && livelloFascicolazioneDestinazione == maxLivelloFascicolazione - 1) {
                        throw new IllegalArgumentException(prefixError + "Deve essere prima reso contenitore di protocolli e documenti");
                    }
                }

                boolean mustDeletePermessiFascicoloCorrente = fascicolo.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1) && (!newTipologiaFascicoloSorgente.equals(TipologiaTitolario.FascicoloLv1));
                boolean mustWritePermessiFascicoloDestinazione = newTipologiaFascicoloSorgente.equals(TipologiaTitolario.FascicoloLv1);

                List<VisibilitaTitolario> permessiDaScrivere = null;
                String oldHierarchy = "TITOLI /";
                for (TitolarioOutputDTO t : hierarchy.getTitolario()) {
                    oldHierarchy = oldHierarchy.concat(" ").concat(t.getLabel()).concat(" /");
                    if (mustWritePermessiFascicoloDestinazione && t.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLv1.name())) {
                        Titolario fascicoloLv1ToGetPermessi = Titolario.findById(t.getId());
                        permessiDaScrivere = VisibilitaTitolario.list("titolario = ?1", fascicoloLv1ToGetPermessi);
                    }
                }

                // Modifica del fascicolo (tipo e padre) e persistenza su db
                fascicolo.setTipologiaTitolario(newTipologiaFascicoloSorgente);
                fascicolo.setIdPadre(idPadreDestinazione);

                if (newTipologiaFascicoloSorgente.equals(TipologiaTitolario.FascicoloLvN)) {
                    fascicolo.setCdrCode(null);
                    fascicolo.setCdr(null);
                }
                else {
                    fascicolo.setCdr(cdr);
                    fascicolo.setCdrCode(cdrCode);
                }

                fascicolo.persistAndFlush();

                setStoricoFascicolo(fascicolo, STORICO_SPOSTAMENTO_TITOLARIO, "Gerarchia precedente: ".concat(oldHierarchy));

                if (mustDeletePermessiFascicoloCorrente) {
                    VisibilitaTitolario.delete("titolario = ?1", fascicolo);
                }
                if (mustWritePermessiFascicoloDestinazione) {
                    for (VisibilitaTitolario visibilitaPadreToRead : permessiDaScrivere) {
                        VisibilitaTitolario newVisibilita = new VisibilitaTitolario();
                        newVisibilita.setTitolario(fascicolo);
                        newVisibilita.setIdUtente(visibilitaPadreToRead.getIdUtente());
                        newVisibilita.setCdr(visibilitaPadreToRead.getCdr());
                        newVisibilita.setCdrCode(visibilitaPadreToRead.getCdrCode());
                        newVisibilita.setTsCreation(new Date());
                        newVisibilita.setWrite(visibilitaPadreToRead.getWrite());
                        newVisibilita.setNote(visibilitaPadreToRead.getNote());
                        newVisibilita.setUsernameUtente(visibilitaPadreToRead.getUsernameUtente());
                        newVisibilita.setNomeUtente(visibilitaPadreToRead.getNomeUtente());
                        newVisibilita.persist();
                    }
                }
            }
            return true;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw CustomException.get(CustomException.ErrorCode.INTERNAL,
                    String.format("Errore durante lo spostamento dei fascicoli: %s", e.getMessage()));
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }
    }


    public String buildHierarchyString(List<TitolarioOutputDTO> hierarchy) {
        StringBuilder hierarchyString = new StringBuilder("TITOLI /");

        if (hierarchy != null) {
            for (TitolarioOutputDTO titolario : hierarchy) {
                hierarchyString.append(" ").append(titolario.getLabel()).append(" /");
            }
        }
        return hierarchyString.toString();
    }

    public boolean isFascicoloVisibile(Titolario fascicolo, String idUtente, Set<String> cdrCodes, List<TitolarioOutputDTO> hierarchyFascicolo) {

        List<VisibilitaTitolario> listPermessi = null;
        //lvl. 1 -> check sui permessi espliciti sul fascicolo
        if (fascicolo.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)) {
            listPermessi = VisibilitaTitolario.list("titolario = ?1", fascicolo);
        }
        else {
            //lvl. 2 e oltre -> check sul fascicolo di primo livello sui permessi
            for(TitolarioOutputDTO hierarchy : hierarchyFascicolo) {
                if (hierarchy.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLv1.getTipologiaTitolario())) {
                    Titolario fascicoloLv1 = Titolario.findById(hierarchy.getId());
                    listPermessi = VisibilitaTitolario.list("titolario = ?1", fascicoloLv1);
                    break;
                }
            }
        }

        if (listPermessi != null) {
            for(VisibilitaTitolario permesso : listPermessi) {
                if ( (permesso.getIdUtente() != null && permesso.getIdUtente().equalsIgnoreCase(idUtente) && cdrCodes.contains(permesso.getCdrCode())) || (cdrCodes.contains(permesso.getCdrCode()) && permesso.getIdUtente() == null) ) {
                    return true;
                }
            }
        }
        return false;
    }
    public PermessoFascicoloDipendente isFascicoloDipendenteVisibile(Titolario fascicolo, String idUtente, Set<String> cdrCodes, boolean isArchivista, boolean isProtocollatore, boolean isDirigente) {

        //fascicoli di livello >= 2 non foglia sono visibili di default perché devo consentire la navigazione!
        if (fascicolo.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLvN) && !fascicolo.getLeaf()) {
            return PermessoFascicoloDipendente.protocollazione;
        }

        String hql = "SELECT p FROM PermessiFascicoloDipendente p JOIN p.uffici u WHERE p.titolario = :titolario AND u.cdrCode in :cdrCodes";
        Query query = em.createQuery(hql);
        query.setParameter("cdrCodes", cdrCodes); // listaIdUffici è una List<Long> o Set<Long>
        query.setParameter("titolario", fascicolo);
        List<PermessiFascicoloDipendente> permessiFascicoloDipendente = query.getResultList();

        boolean isFascicoloForLoggedUser = fascicolo.getIdUtenteCreatore().equalsIgnoreCase(idUtente); // && fascicolo.getCdrCode().equalsIgnoreCase(cdrCode);

        for(PermessiFascicoloDipendente permesso : permessiFascicoloDipendente) {
            PermessoFascicoloDipendente visibilitaUtente = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaDipendente = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaDirigente = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaArchivista = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaProtocollatore = PermessoFascicoloDipendente.no;

            //fascicolo è uno di quelli dell'utente loggato -> si prende il permesso per il fascicolo
            if (isFascicoloForLoggedUser && permesso.getVisibilitaDipendente() != null) {
                visibilitaDipendente = permesso.getVisibilitaDipendente();
            }

            //se archivista, dirigente o protocollatore -> si prende il permesso per il fascicolo
            if (isArchivista && permesso.getVisibilitaArchivista() != null) {
                visibilitaArchivista = permesso.getVisibilitaArchivista();
            }
            if (isProtocollatore && permesso.getVisibilitaProtocollatore() != null) {
                visibilitaProtocollatore = permesso.getVisibilitaProtocollatore();
            }
            if (isDirigente && permesso.getVisibilitaDirigente() != null) {
                visibilitaDirigente = permesso.getVisibilitaDirigente();
            }

            //in ogni caso si prende permesso per il fascicolo
            if (permesso.getVisibilitaUtente() != null) {
                visibilitaUtente = permesso.getVisibilitaUtente();
            }

            //fra tutti i permessi collezionati per il fascicolo -> si computa il permesso "vincente"
            return PermessiFascicoloDipendente.computeOverallPermesso(List.of(visibilitaUtente, visibilitaDipendente, visibilitaProtocollatore, visibilitaArchivista, visibilitaDirigente));
        }
        return PermessoFascicoloDipendente.no;
    }

/*    private Map<Long, String> getAllFascicoliDipendenteVisibili(String idUtente, String cdrCode, boolean isArchivista, boolean isProtocollatore, boolean isDirigente) {

        //la map che sarà ritornata dalla funzione
        Map<Long, String> setFascicoliDipendenteVisibiliConPermessi = new HashMap<>();

        //troviamo tutti i fascicoli dei dipedenti
        Titolario sezione = Titolario.find("nome", StrutturaFascicoloDipendente.nomeSezioneDipendenti).firstResult();
        List<Titolario> gruppi = Titolario.find("idPadre", sezione.getId()).list();

        Long loggedUserFascicoloDipendenteId = null;
        for(Titolario sottosezioneGruppo : gruppi) {
            List<Titolario> fascicoliDipendentiAltri = Titolario.find("idPadre", sottosezioneGruppo.getId()).list();

            for(Titolario t : fascicoliDipendentiAltri) {
                //i fascicoli dei dipendenti di primo livello sono tutti visibili / ricercabili
                setFascicoliDipendenteVisibiliConPermessi.put(t.getId(), PermessoFascicoloDipendente.visualizzazione.name());

                if (t.getIdUtenteCreatore().equals(idUtente) && t.getCdrCode().equalsIgnoreCase(cdrCode)) {
                    loggedUserFascicoloDipendenteId = t.getId();
                }
            }
        }

        List<Long> loggedUserIdfascicoliDipendente = null;
        // tutta la gerarchia del fascicolo del dipendente loggato
        if(loggedUserFascicoloDipendenteId != null) {
            loggedUserIdfascicoliDipendente = getDescendantsForTitolarioId(loggedUserFascicoloDipendenteId);
        }
        // tutti i permessi dei fascicoli dei dipendenti in cui l'ufficio è quello dell'utente loggato
        String hql = "SELECT p FROM PermessiFascicoloDipendente p JOIN p.uffici u WHERE u.cdrCode = :cdrCode";
        Query query = em.createQuery(hql);
        query.setParameter("cdrCode", cdrCode); // listaIdUffici è una List<Long> o Set<Long>
        List<PermessiFascicoloDipendente> permessiFascicoloDipendente = query.getResultList(); //PermessiFascicoloDipendente.find("uffici.cdrCode = :cdrCode", params).list();

        for(PermessiFascicoloDipendente permesso : permessiFascicoloDipendente) {
            PermessoFascicoloDipendente visibilitaUtente = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaDipendente = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaDirigente = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaArchivista = PermessoFascicoloDipendente.no;
            PermessoFascicoloDipendente visibilitaProtocollatore = PermessoFascicoloDipendente.no;

            //Fascicolo di secondo livello, quindi visibile per consentire la navigazione!
            if (permesso.getVisibilitaDipendente() == null && permesso.getVisibilitaDirigente() == null && permesso.getVisibilitaUtente() == null && permesso.getVisibilitaArchivista() == null && permesso.getVisibilitaProtocollatore() == null) {
                setFascicoliDipendenteVisibiliConPermessi.put(permesso.getTitolario().getId(), PermessoFascicoloDipendente.visualizzazione.name());
                continue;
            }

            boolean isFascicoloForLoggedUser = loggedUserIdfascicoliDipendente != null ? loggedUserIdfascicoliDipendente.contains(permesso.getTitolario().getId()) : false;

            //fascicolo è uno di quelli dell'utente loggato -> si prende il permesso per il fascicolo
            if (isFascicoloForLoggedUser && permesso.getVisibilitaDipendente() != null) {
                visibilitaDipendente = permesso.getVisibilitaDipendente();
            }

            //se archivista, dirigente o protocollatore -> si prende il permesso per il fascicolo
            if (isArchivista && permesso.getVisibilitaArchivista() != null) {
                visibilitaArchivista = permesso.getVisibilitaArchivista();
            }
            if (isProtocollatore && permesso.getVisibilitaProtocollatore() != null) {
                visibilitaProtocollatore = permesso.getVisibilitaProtocollatore();
            }
            if (isDirigente && permesso.getVisibilitaDirigente() != null) {
                visibilitaDirigente = permesso.getVisibilitaDirigente();
            }

            //in ogni caso si prende permesso per il fascicolo
            if (permesso.getVisibilitaUtente() != null) {
                visibilitaUtente = permesso.getVisibilitaUtente();
            }


            //fra tutti i permessi collezionati per il fascicolo -> si computa il permesso "vincente"
            //se il permesso vincente è diverso da "no" allora il fascicolo si giudica visibile
            PermessoFascicoloDipendente overallPermesso = PermessiFascicoloDipendente.computeOverallPermesso(List.of(visibilitaUtente, visibilitaDipendente, visibilitaProtocollatore, visibilitaArchivista, visibilitaDirigente));
            if (overallPermesso != PermessoFascicoloDipendente.no) {
                setFascicoliDipendenteVisibiliConPermessi.put(permesso.getTitolario().getId(), overallPermesso.name());
            }
        }

        return setFascicoliDipendenteVisibiliConPermessi;
    }*/

    public boolean isFascicoloVisibileFromProtocolli(Long idFascicolo, String idUtente, boolean canViewProtocolliForCdr, Set<String> cdrCodes) {

        String sbQueryTitolariForProtocolli = "select id_titolario from protocolli_classificazione where " +
                "id_titolario = ?1 and (id_protocollo in (select id from protocolli where id_utente = ?2 and cdr in ?3) " +
                "or id_protocollo in ( " +
                "select id_protocollo from referenti_protocollo where " +
                "(id_destinatario = ?2 and attribuzione = 'competenza') ";

        if (canViewProtocolliForCdr) {
            sbQueryTitolariForProtocolli += "or (id_destinatario in ?3 and attribuzione = 'competenza') ";
        }
        sbQueryTitolariForProtocolli += "))";

        Query q = em.createNativeQuery(sbQueryTitolariForProtocolli);
        q.setParameter(1, idFascicolo);
        q.setParameter(2, idUtente);
        q.setParameter(3, cdrCodes);
        List<Long> idFascicoliFogliaConProtocolli = q.getResultList();
        return !idFascicoliFogliaConProtocolli.isEmpty();
    }

    public boolean isFascicoliVisibileFromProtocolli(Set<Long> idFascicoli, String idUtente, boolean canViewProtocolliForCdr, Set<String> cdrCodes) {

        String sbQueryTitolariForProtocolli = "select id_titolario from protocolli_classificazione where " +
                "id_titolario in ?1 and (id_protocollo in (select id from protocolli where id_utente = ?2 and cdr in ?3) " +
                "or id_protocollo in ( " +
                "select id_protocollo from referenti_protocollo where " +
                "(id_destinatario = ?2 and attribuzione = 'competenza') ";

        if (canViewProtocolliForCdr) {
            sbQueryTitolariForProtocolli += "or (id_destinatario in ?3 and attribuzione = 'competenza') ";
        }
        sbQueryTitolariForProtocolli += "))";

        Query q = em.createNativeQuery(sbQueryTitolariForProtocolli);
        q.setParameter(1, idFascicoli);
        q.setParameter(2, idUtente);
        q.setParameter(3, cdrCodes);
        List<Long> idFascicoliFogliaConProtocolli = q.getResultList();
        return !idFascicoliFogliaConProtocolli.isEmpty();
    }

/*    private Set<Long> getAllFascicoliIdVisibiliFromProtocolli(String idUtente, boolean canViewProtocolliForCdr, String cdr, String cdrCode) {

        String sbQueryTitolariForProtocolli = "select id_titolario from protocolli_classificazione where " +
                "id_protocollo in (select id from protocolli where id_utente = ?1 and cdr = ?2) " +
                "or id_protocollo in ( " +
                "select id_protocollo from referenti_protocollo where " +
                "(id_destinatario = ?1 and attribuzione = 'competenza') ";

        if (canViewProtocolliForCdr) {
            sbQueryTitolariForProtocolli += "or (id_destinatario = ?3 and attribuzione = 'competenza') ";
        }
        sbQueryTitolariForProtocolli += ")";

        Query q = em.createNativeQuery(sbQueryTitolariForProtocolli);
        q.setParameter(1, idUtente);
        q.setParameter(2, cdr);
        if (canViewProtocolliForCdr) {
            q.setParameter(3, cdrCode);
        }
        List<Long> idFascicoliFogliaConProtocolli = q.getResultList();

        Set<Long> setFascicoliVisibili = new HashSet<>();

        // per ogni fascicolo che posso vedere perché c'è almeno un protocollo che ho creato o che mi è stato assegnato,
        // colleziono tutta la gerarchia, perché devo poterci arrivare
        for(Long idFascicoloFoglia : idFascicoliFogliaConProtocolli) {
            List<Titolario> fascicoliVisibili = getHierarchyTitolarioForTitolarioId(idFascicoloFoglia);

            for(Titolario t : fascicoliVisibili) {
                setFascicoliVisibili.add(t.getId());
            }
        }
        return setFascicoliVisibili;
    }*/
/*    private Set<Long> getAllFascicoliIdVisibiliFromPermessi(String idUtente, String cdrCode) {

        //NOTA: commentato perché permessi sono espliciti!
        //fascicoli di 1,2,3 livello che posso vedere per il cdr scelto
        //List<Long> idFascicoliPerVisibilita = getDescendantsForFascicoloIdByCdrCode(cdrCode);

        //titoli sezioni e sottosezioni
        String sbQueryTitolariForVisibilita = "select id from titolario where tipologia_titolario in (?1, ?2, ?3)";
        List<Long> idTitoli = em.createNativeQuery(sbQueryTitolariForVisibilita)
                .setParameter(1, TipologiaTitolario.Titolo.getTipologiaTitolario())
                .setParameter(2, TipologiaTitolario.Sezione.getTipologiaTitolario())
                .setParameter(3, TipologiaTitolario.SottoSezione.getTipologiaTitolario())
                .getResultList();

        Set<Long> setIdFascicoliVisibiliPerPermessi = new HashSet<>();
        //setIdFascicoliVisibiliPerPermessi.addAll(idFascicoliPerVisibilita);
        setIdFascicoliVisibiliPerPermessi.addAll(idTitoli);

        try {
            String queryFascicoliVisibilitaPermessi = "SELECT id_titolario FROM visibilita_titolario WHERE cdr_code = ?1 and (id_utente is null or id_utente = ?2)";
            List<Long> idFascicoliVisibiliPermessi = em.createNativeQuery(queryFascicoliVisibilitaPermessi)
                    .setParameter(1, cdrCode)
                    .setParameter(2, idUtente)
                    .getResultList();

            for(Long vt : idFascicoliVisibiliPermessi) {
                //id del fascicolo di primo livello di cui devo prendere i discendenti che posso vedere
                List<Long> fascicoliVisibiliConPermessi = getDescendantsForTitolarioId(vt);
                //colleziono tutti i fascicoli che posso vedere tramite permessi
                setIdFascicoliVisibiliPerPermessi.add(vt);
                setIdFascicoliVisibiliPerPermessi.addAll(fascicoliVisibiliConPermessi);
            }
        }

        //caso in cui non ci sono permessi settati
        catch(Exception ignored) {}

        return setIdFascicoliVisibiliPerPermessi;
    }*/

/*    private boolean hasFascicoloPermissionToWrite(Titolario titolario, String idUtente, String cdrCode) {

        //0. se fascicolo è fascicolo del dipendente -> write mode a false
        if (titolario.getIsFascicoloDipendente()) {
            return false;
        }

        boolean setToWrite = false;

        //1. se utente è creatore della voce -> write mode a true
        if (titolario.getIdUtenteCreatore().equalsIgnoreCase(idUtente) && titolario.getCdrCode().equalsIgnoreCase(cdrCode)) {
            setToWrite = true;
        }
        //2. se utente non è creatore -> si cercano gli eventuali permessi write assegnati all'utente o all'ufficio per il fascicolo in esame
        else {
            String queryFascicoloWritePermission = "SELECT id FROM visibilita_titolario WHERE id_titolario = ?1 AND write_mode = true AND ( (id_utente = ?2 AND cdr_code = ?3) OR (id_utente IS NULL AND cdr_code = ?3) )";
            Long idFascicoloForWritePermission = null;
            try {
                idFascicoloForWritePermission = (Long) em.createNativeQuery(queryFascicoloWritePermission)
                        .setParameter(1, titolario.getId())
                        .setParameter(2, idUtente)
                        .setParameter(3, cdrCode)
                        .getSingleResult();
            } catch(Exception ignored) {}
            if (idFascicoloForWritePermission != null) {
                setToWrite = true;
            }
        }
        return setToWrite;
    }*/


    //NOTA: questo metodo non può essere inserito in cache perché dipende dalla vitalità dei protocolli,
    // che è molto più dinamica rispetto alla vitalità del titolario
    public TitolariOutputDTO getTitolarioSection(RicercaTitolarioDTO dto) {
        String idUtente = ssoManager.extractIdFromToken();
        boolean isAdmin = ssoManager.isUtenteAdmin();
        boolean isArchivista = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("archivista"), dto.getCdrCode());
        boolean isProtocollatore = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("protocollatore"), dto.getCdrCode());
        boolean isDirigente = ssoManager.isUtenteDirigente();
        Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(dto.getCdrCode());
        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

        String search = dto.hasSearch() ? dto.getSearch().trim() : null;

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("id is not null ");

        //cerco soltanto un livello alla volta!
        if (search == null) {
            //filtro per id padre
            if (dto.getIdPadre() != null) {
                query.append("and idPadre = :idPadre ");
                params.put("idPadre", dto.getIdPadre());
            }
            //filtro per titolari che sono alla radice dell'alberatura
            else {
                query.append("and idPadre IS NULL ");
            }
        }
        // filtro per termine passato
        else {
            query.append("and isFascicoloDipendente = FALSE and lower(nome) like concat('%', :search, '%') ");
            params.put("search", search.toLowerCase());

            // a partire dal sottoalbero di cui è stata selezionata la radice
            if (dto.getIdPadre() != null) {
                List<Long> fascicoliSottoalbero = getDescendantsWithoutFascicoloDipendenteForTitolarioId(dto.getIdPadre());
                fascicoliSottoalbero.add(dto.getIdPadre());
                query.append("and idPadre in :idPadri ");
                params.put("idPadri", fascicoliSottoalbero);
            }
        }

        if(!dto.isShowFascicoliChiusi()){
            Date today = Calendar.getInstance().getTime();
            query.append("and (tsChiusura >= :today OR tsChiusura IS NULL) ");
            params.put("today", today);
        }

        if(!dto.isShowFascicoliDeleted()){
            query.append("and tsDeleted IS NULL ");
        }

        if (search != null || dto.getIdPadre() != null) {
            if (search != null) {
                sortCriteria = Sort.by("nome", Sort.Direction.Ascending);
            }
            else {
                Titolario padreFromRicerca = Titolario.findById(dto.getIdPadre());
                if (!padreFromRicerca.getTipologiaTitolario().equals(TipologiaTitolario.Titolo) && !padreFromRicerca.getTipologiaTitolario().equals(TipologiaTitolario.Sezione)) {
                    sortCriteria = Sort.by("nome", Sort.Direction.Ascending);
                }
            }
        }

        // RISULTATI DELLA RICERCA SULLA TABELLA TITOLARIO
        List<Titolario> listTitolario = Titolario.find(query.toString(), sortCriteria, params).list();

        // ciclo su tutti i risultati, per capire come impostare i permessi
        List<TitolarioOutputDTO> titolariDTO = new ArrayList<>(listTitolario.size());

        log.info("getTitolarioSection - START: "+ new Date(System.currentTimeMillis()));

        boolean hasMoreResults = false;
        int startIndex = dto.getPage() * dto.getSize();
        int endIndex = startIndex + dto.getSize();
        int currentIndex = startIndex;
        boolean skipTitolario = dto.getLastIdTitolario() > 0;
        for(Titolario titolario : listTitolario) {
            if (dto.getLastIdTitolario() > 0 && titolario.getId() == dto.getLastIdTitolario()) {
                skipTitolario = false;
                continue;
            }
            if (skipTitolario) {
                continue;
            }

            //log.info("Checking titolario {} - {}", titolario.getId(), titolario.getNome());

            TitolarioOutputDTO outputDTO = mapper.toOutputDTO(titolario);
            outputDTO.setHierarchy(getHierarchyForTitolarioId(titolario.getId()).getTitolario());
            String hierarchyString = buildHierarchyString(outputDTO.getHierarchy());
            outputDTO.setHierarchyString(hierarchyString);
            outputDTO.setVisible(true); // imposto a true di default
            outputDTO.setWrite(isAdmin); // imposto a true se admin
            outputDTO.setImmutable(false); // di default impostato a false

            int livelloFascicolo = 0;
            for (TitolarioOutputDTO h : outputDTO.getHierarchy()) {
                if (h.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLvN.name()) || h.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLv1.name())) {
                    livelloFascicolo += 1;
                }
            }
            if (titolario.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1) || titolario.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLvN)) {
                livelloFascicolo += 1;
            }

            if (livelloFascicolo > 0) {
                outputDTO.setTipologia(TipologiaTitolario.getNomeFascicoloFromLivello(livelloFascicolo));
            }

            //NOTA: si imposta numero protocolli e documenti a 0 e i flag a true, poiché saranno valorizzati soltanto in caso di fascicoli
            outputDTO.setNumProtocolli(0);
            outputDTO.setNumDocumenti(0);
            boolean hasProtocolli = true;
            boolean hasDocumenti = true;

            if (!isRootType(titolario.getTipologiaTitolario())) {

                //check se bisogna mostrare fascicoli cancellati
                if (dto.isHideFascicoliDeleted() && titolario.getTsDeleted() != null) {
                    continue;
                }

                if (titolario.getLeaf()) {
                    // check se fascicolo o sua alberatura contiene protocolli o documenti
                    outputDTO.setNumProtocolli(containsProtocolli(titolario.getId()));
                    outputDTO.setNumDocumenti(containsDocumenti(titolario.getId()));
                    hasProtocolli = outputDTO.getNumProtocolli() > 0;
                    hasDocumenti = outputDTO.getNumDocumenti() > 0;
                }
            }

            if (dto.isShowFascicoliWithProtocolli() && !hasProtocolli) {
                continue;
            }
            if (dto.isShowFascicoliWithDocumenti() && !hasDocumenti) {
                continue;
            }

            if (isAdmin) {
                if (currentIndex >= startIndex && currentIndex < endIndex) {
                    titolariDTO.add(outputDTO);
                }
                currentIndex++;
                if (currentIndex >= endIndex) {
                    hasMoreResults = true;
                    break;
                }
                continue;
            }

            //utenti non admin hanno accesso soltanto ad un sottoinsieme del titolario -> controllare se l'utente ha accesso al fascicolo!

            //fino a sottosezione -> write mode a false
            if (isRootType(titolario.getTipologiaTitolario())) {
                outputDTO.setWrite(false);
                if (currentIndex >= startIndex && currentIndex < endIndex) {
                    currentIndex++;
                    titolariDTO.add(outputDTO);
                }
                if (currentIndex >= endIndex) {
                    hasMoreResults = true;
                    break;
                }
                continue;
            }
            //lv. 1
            else {

                boolean canViewFascicolo = false;
                boolean isFascicoloImmutable = false;
                boolean isFascicoloDipendente = false;

                Titolario fascicoloLvl1 = null;
                //lvl. 1 -> check sui permessi espliciti sul fascicolo
                if (titolario.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)) {
                    fascicoloLvl1 = titolario;
                }
                else {
                    //lvl. 2 e oltre -> check sul fascicolo di primo livello sui permessi
                    if (!titolario.getIsFascicoloDipendente()) {
                        for(TitolarioOutputDTO hierarchy : outputDTO.getHierarchy()) {
                            if (hierarchy.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLv1.getTipologiaTitolario())) {
                                fascicoloLvl1 = Titolario.findById(hierarchy.getId());
                                break;
                            }
                        }
                    }
                    //Se fascicolo del dipendente -> check sui permessi del fascicolo del dipendente
                    else {
                        PermessoFascicoloDipendente permessoFascicoloDipendente = isFascicoloDipendenteVisibile(titolario, idUtente, cdrCodes, isArchivista, isProtocollatore, isDirigente);
                        isFascicoloDipendente = true;
                        if (!permessoFascicoloDipendente.equals(PermessoFascicoloDipendente.no)) {
                            if (permessoFascicoloDipendente.equals(PermessoFascicoloDipendente.protocollazione)) {
                                outputDTO.setWrite(true);
                            }
                            // IMPORTANTE: se la condizione è vera, allora si sta navigando il titolario per protocollare -> check su permesso di protocollazione!
                            if (!dto.isShowFascicoliChiusi() && !dto.isShowFascicoliDeleted() && !dto.isShowFascicoliForProtocolli()) {
                                canViewFascicolo = permessoFascicoloDipendente.equals(PermessoFascicoloDipendente.protocollazione);
                            }
                            else {
                            	canViewFascicolo = true;
                        	}
                    	}
                	}
                }

                if (fascicoloLvl1 != null) {
                    List<VisibilitaTitolario> listPermessi = VisibilitaTitolario.find("titolario", fascicoloLvl1).list();
                    for(VisibilitaTitolario permesso : listPermessi) {
                        if ( (permesso.getIdUtente() != null && permesso.getIdUtente().equalsIgnoreCase(idUtente) && cdrCodes.contains(permesso.getCdrCode())) || (cdrCodes.contains(permesso.getCdrCode()) && permesso.getIdUtente() == null) ) {
                            canViewFascicolo = true;
                            if (!outputDTO.isWrite() && (isArchivista)) {
                                outputDTO.setWrite(permesso.getWrite());
                            }
                        }
                    }
                }

                if (!outputDTO.isWrite()) {
                    //check se fascicolo è visibile perché ci sono protoocolli dentro
                    if (!canViewFascicolo) {
                        Set<Long> descendentsId = new HashSet<>(this.getDescendantsForTitolarioId(titolario.getId()));
                        descendentsId.add(titolario.getId());
                        if (dto.isShowFascicoliForProtocolli() && isFascicoliVisibileFromProtocolli(descendentsId, idUtente, isProtocollatore || isArchivista, cdrCodes)) {
                            canViewFascicolo = true;
                            isFascicoloImmutable = true;
                        }
                    }
                }

                if (!canViewFascicolo)
                    continue;
                outputDTO.setImmutable(isFascicoloImmutable || isFascicoloDipendente);

                if (currentIndex >= startIndex && currentIndex < endIndex) {
                    currentIndex++;
                    titolariDTO.add(outputDTO);
                }
                if (currentIndex >= endIndex) {
                    hasMoreResults = true;
                    break;
                }
            }
        }

        log.info("getTitolarioSection - END: "+ new Date(System.currentTimeMillis()));
        // output del dto
        TitolariOutputDTO titolariOutputDto = new TitolariOutputDTO();
        titolariOutputDto.setTitolario(titolariDTO);
        titolariOutputDto.setHasMore(hasMoreResults);
        titolariOutputDto.setCurrentPage(dto.getPage());
        titolariOutputDto.setNextPage(hasMoreResults ? dto.getPage() + 1 : -1);
        titolariOutputDto.setLastIdTitolario(hasMoreResults ? titolariDTO.get(titolariDTO.size()-1).getId() : -1);
        titolariOutputDto.setLastIndex(endIndex);
        return titolariOutputDto;
    }

    private int containsDocumenti(Long id) {
        String query = "select count(*) as num_results from allegati a where a.id_titolario = ?1";
        Long result = (Long)em.createNativeQuery(query, Long.class)
                .setParameter(1, id)
                .getSingleResult();
        return result.intValue();
    }
    private int containsProtocolli(Long id) {
        String query = "select count(*) as num_results from protocolli_classificazione pc where pc.id_titolario = ?1";
        Long result = (Long)em.createNativeQuery(query, Long.class)
                .setParameter(1, id)
                .getSingleResult();
        return result.intValue();
    }

    public TitolariOutputDTO forceGetTitolarioSection(RicercaTitolarioDTO dto) {
        return getTitolarioSection(dto);
    }

    public List<TitolarioOutputDTO> getTitolarioByProtocollo(List<ProtocolliClassificazione> list, String idUtente, Set<String> cdrCodes, boolean isAdmin, boolean isProtocollatore, boolean isArchivista, boolean isDirigente) {
        List<TitolarioOutputDTO> titolarioProtocollo = new ArrayList<>();

        list.forEach(classificazione -> {
            Titolario titolario = Titolario.findById(classificazione.getIdTitolario());
            TitolarioOutputDTO titolarioDTO = mapper.toOutputDTO(titolario);

            List<TitolarioOutputDTO> hierarchyDTO = getHierarchyForTitolarioId(titolario.getId()).getTitolario();

            if (isAdmin) {
                titolarioDTO.setVisible(true);
            }
            else if (titolario.getIsFascicoloDipendente()) {
                titolarioDTO.setVisible(!isFascicoloDipendenteVisibile(titolario, idUtente, cdrCodes, isArchivista, isProtocollatore, isDirigente).equals(PermessoFascicoloDipendente.no));
            }
            else {
                titolarioDTO.setVisible(isFascicoloVisibile(titolario, idUtente, cdrCodes, hierarchyDTO));
            }

            String hierarchyString = buildHierarchyString(hierarchyDTO);
            titolarioDTO.setHierarchyString(hierarchyString);
            titolarioProtocollo.add(titolarioDTO);
        });

        return titolarioProtocollo;
    }

    public Titolario getTitolarioById(Long idTitolario){
        if(idTitolario == null) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Parametro idTitolario non può essere nullo").boom();
        }
        return Titolario.findById(idTitolario);
    }

    /**
     * Questo metodo consente di aggiungere permessi di visibilita' direttamente dalla sezione di dettaglio di un fascicolo,
     * Il metodo prevede l'inserimento permessi nelle seguenti casistiche
     *  - Intero ufficio
     *  - Ufficio + utente
     *  Il sistema rileva se un permesso è stato già assegnato si cancella quello esistente per sostituirlo a quello nuovo
     *  perche' potrebbe essere stata modificato il permesso da (Read -> Write)
     * */
    @Transactional
    public boolean insertVisibilitaTitolario (VisibilitaTitolarioInput input){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (input == null) {
            throw new IllegalArgumentException("L'input non può essere nullo");
        }

        Titolario titolario = getTitolarioById(input.idTitolario);

        if(input.cdr == null || input.cdr.isEmpty()){
            throw new IllegalArgumentException("L'ufficio non può essere nullo");
        }

        boolean isScrittura = input.getPermesso().equalsIgnoreCase("scrittura");

        try {
            if(input.utenteAuthIdList.isEmpty()){
                VisibilitaTitolario permessoUfficio = visibilitaTitolarioMapper.toEntityInsert(input);
                permessoUfficio.setIdUtenteLastOperation(ssoManager.extractIdFromToken());
                permessoUfficio.setTsCreation(Calendar.getInstance().getTime());

                VisibilitaTitolario existsPermesso = VisibilitaTitolario.find("titolario.id = ?1 and cdrCode = ?2 and idUtente is null",
                        titolario.id, input.cdrCode).firstResult();
                if (existsPermesso != null) {
                    existsPermesso.delete();
                }
                permessoUfficio.setWrite(isScrittura);
                permessoUfficio.persistAndFlush();

            }else {
                List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
                String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);

                for (String authIdUtente : input.utenteAuthIdList) {
                    DatiUtenteSSO utenteSSO = ssoManager.getUserByAuthId(authIdUtente, Integer.valueOf(applicationId));

                    if (utenteSSO.auth_id == null || utenteSSO.auth_id.isEmpty()) {
                        throw new IllegalArgumentException("L'id datiUtente non può essere nullo");
                    }
                    if (utenteSSO.username == null || utenteSSO.username.isEmpty()) {
                        throw new IllegalArgumentException("L'username datiUtente non può essere nullo");
                    }
                    if (utenteSSO.firstName == null || utenteSSO.firstName.isEmpty()) {
                        throw new IllegalArgumentException("Il nome utente non può essere nullo");
                    }

                    /**
                     * Per il permesso di SCRITTURA
                     * È necessario verificare che ciascun utente abbia il RUOLO di ARCHIVISTA per l'ufficio indicato,
                     * ----
                     * Per il permesso di LETTURA, si possono passare tutti i ruoli
                     */
                    List<String> rolesToCheckList = isScrittura ? List.of("archivista") : List.of("archivista", "protocollatore", "utente");
                    boolean canAddUser = ssoManager.hasMatchingRoleAndCdr(utenteSSO, rolesToCheckList, input.cdrCode);
                    if (!canAddUser) {
                        String message = String.format("Utente: %s non autorizzato al permesso di scrittura", utenteSSO.username);
                        CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
                    }

                    VisibilitaTitolario permessoUtente = visibilitaTitolarioMapper.toEntityInsert(input);
                    permessoUtente.setIdUtente(utenteSSO.auth_id);
                    permessoUtente.setUsernameUtente(utenteSSO.username);
                    permessoUtente.setNomeUtente(utenteSSO.firstName + " " + utenteSSO.lastName);
                    permessoUtente.setIdUtenteLastOperation(ssoManager.extractIdFromToken());
                    permessoUtente.setTsCreation(Calendar.getInstance().getTime());

                    VisibilitaTitolario existsUser = VisibilitaTitolario.find("titolario.id = ?1 and cdrCode = ?2 and idUtente = ?3",
                            titolario.id, input.cdrCode, utenteSSO.auth_id).firstResult();

                    if (existsUser != null) {
                        existsUser.delete();
                    }

                    permessoUtente.setWrite(isScrittura);
                    permessoUtente.persist();
                }
            }

        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,e.getMessage()).boom();
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    public TitolarioOutputDTO getDettaglioTitolario(Long idTitolario) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (idTitolario == null)
            throw new IllegalArgumentException("Il parametro idTitolario è obbligatorio in " + LogUtils.getCallerInfo());

        Titolario titolario = getTitolarioById(idTitolario);

        log.info("Richiesta dettaglio per il titolario: {} - da parte dell'utente: {}",
                titolario.getId(),
                ssoManager.extractNameFromToken());

        TitolarioOutputDTO titolarioDTO = mapper.toOutputDTO(titolario);
        String hierarchyString = buildHierarchyString(getHierarchyForTitolarioId(titolario.getId()).getTitolario());
        titolarioDTO.setHierarchyString(hierarchyString);

        return titolarioDTO;
    }

    @ExceptionChecked
    public PermessiVisibilitaOutputDTO getPermessiVisibilita(RicercaPermessiVisibilitaDTO dto) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

        PanacheQuery<VisibilitaTitolario> query = getPermessiVisibilitaQuery(dto);
        List<VisibilitaTitolario> permessi = query.page(Page.of(dto.getPage(), dto.getSize())).list();

        long totalResults = query.count();
        PermessiVisibilitaOutputDTO outputDTO = new PermessiVisibilitaOutputDTO(permessi, getPagesCount(totalResults, dto.getSize()), totalResults);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return outputDTO;
    }

    @Transactional
    public PanacheQuery<VisibilitaTitolario> getPermessiVisibilitaQuery(RicercaPermessiVisibilitaDTO ricercaDTO) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Sort sortCriteria = SortInput.getSortOrDefault(ricercaDTO.hasSort() ? ricercaDTO.getSort() : ricercaDTO.getDefaultSort());

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("id is not null ");

        if (ricercaDTO.hasIdTiolario()) {
          query.append("and titolario.id = :idTitolario ");
          params.put("idTitolario", ricercaDTO.getIdTitolario());
        }

        if(!ricercaDTO.getCdrNames().isEmpty()){
            query.append("and cdr IN (:cdrList) ");
            params.put("cdrList", ricercaDTO.getCdrNames());
        }

        if(ricercaDTO.hasSearch()){
            query.append("and (:search = '' ")
                    .append("or lower(usernameUtente) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(nomeUtente) like LOWER(concat('%', :search, '%')) ) ");
            params.put("search", ricercaDTO.getSearch().trim());
        }

        if(ricercaDTO.hasPermesso()){
            if (ricercaDTO.getPermesso().equalsIgnoreCase("lettura")){
                query.append("and write = false ");
            }else if (ricercaDTO.getPermesso().equalsIgnoreCase("scrittura")){
                query.append("and write = true ");
            }
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return VisibilitaTitolario.find(query.toString(), sortCriteria, params);
    }

    public boolean deleteVisibilitaTitolarioSingle(Long idVisibilita) {
        VisibilitaTitolario visibilitaToDelete = VisibilitaTitolario.findById(idVisibilita);

        if (visibilitaToDelete == null) {
            return false;
        }

        //se il permesso è di lettura cancellarlo direttamente
        if (!visibilitaToDelete.getWrite()) {
            visibilitaToDelete.delete();
            return true;
        }

        //se il permesos è di scrittura, controllare se almeno un altro permesso di scrittura rimane
        boolean canRemoveWritePermission = false;
        List<VisibilitaTitolario> allVisibilitaForTitolario = VisibilitaTitolario.find("titolario", visibilitaToDelete.getTitolario()).list();
        for (VisibilitaTitolario vt : allVisibilitaForTitolario) {
            if ( vt.getWrite() && (!vt.getId().equals(visibilitaToDelete.getId())) ) {
                canRemoveWritePermission = true;
                break;
            }
        }
        if (canRemoveWritePermission) {
            visibilitaToDelete.delete();
        }
        return canRemoveWritePermission;
    }

    @ExceptionChecked
    @Transactional
    public boolean deleteVisibilitaTitolario(List<Long> idVisibilitaList) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try {
            // Validazione dell'input
            if (idVisibilitaList.isEmpty()) {
                throw new IllegalArgumentException("L'elenco non può essere vuoto");
            }

            for(Long idVisibilita : idVisibilitaList) {
                if (!deleteVisibilitaTitolarioSingle(idVisibilita)) {
                    throw new IllegalArgumentException("Non è possibile eliminare un permesso. Accertarsi che il fascicolo contenga almeno un permesso di scrittura.");
                }
            }

            //for (Long id : idVisibilitaList)
            //    VisibilitaTitolario.deleteById(id);

            return true;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException(e.getMessage(), e);
        } finally {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }
    }

    @Transactional
    public boolean spostaAllegatiFascicolo(List<Long> allegatiIds, Long oldTitolarioId, Long newTitolarioId) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        int rowsUpdated = 0;
        try {
            if (allegatiIds == null || allegatiIds.isEmpty()) {
                throw new IllegalArgumentException("La lista degli ID degli allegati non può essere nulla o vuota");
            }
            if (oldTitolarioId == null || newTitolarioId == null) {
                throw new IllegalArgumentException("Gli ID del Fascicolo non possono essere nulli");
            }

            Titolario fascicoloNew = Titolario.findById(newTitolarioId);

            if (fascicoloNew.getTsChiusura().before(Calendar.getInstance().getTime())) {
                throw new IllegalArgumentException("Impossibile spostare gli allegati in un fascicolo chiuso");
            }
            if (fascicoloNew.getTsDeleted() != null) {
                throw new IllegalArgumentException("Impossibile spostare gli allegati in un fascicolo eliminato");
            }
            if (!fascicoloNew.getLeaf()) {
                throw new IllegalArgumentException("Impossibile spostare gli allegati in un fascicolo che non sia foglia");
            }
            //TODO: l'update avviene a transazione finita?
            rowsUpdated = em.createNamedQuery("spostaAllegatiTitolario")
                    .setParameter("newTitolario", newTitolarioId)
                    .setParameter("oldTitolario", oldTitolarioId)
                    .setParameter("allegatiIds", allegatiIds)
                    .executeUpdate();

            if (rowsUpdated == 0) {
                throw new IllegalArgumentException(ERROR_MESSAGE_SPOSTAMENTO_ALLEGATO);
            }

            String idUtenteForStorico = ssoManager.extractIdFromToken();
            String nomeUtenteForStorico = ssoManager.extractNameFromToken();
            Titolario fascicoloOld = Titolario.findById(oldTitolarioId);
            for (Long id : allegatiIds) {
                Allegato a = Allegato.findById(id);
                //TODO: che facciamo se il file non viene spostato in minio?
                allegatoService.spostaAllegatoTitolario(a, newTitolarioId);

                storicoService.insertNewStoricoForIdTitolario(
                        fascicoloOld,
                        idUtenteForStorico,
                        nomeUtenteForStorico,
                        STORICO_SPOSTAMENTO_DOCUMENTO,
                        String.format("Nome del documento: \"%s\"; Fascicolo di destinazione: \"%s\"",
                                documentService.shortenFileName(a.getNome(), 15), fascicoloNew.getNome()));

                storicoService.insertNewStoricoForIdTitolario(
                        fascicoloNew,
                        idUtenteForStorico,
                        nomeUtenteForStorico,
                        STORICO_SPOSTAMENTO_DOCUMENTO,
                        String.format("Nome del documento: \"%s\"; Fascicolo precedente: \"%s\"",
                                documentService.shortenFileName(a.getNome(), 15), fascicoloOld.getNome()));
            }

        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    public String getPathForTitolarioItem(long id){
        TitolariOutputDTO hierarchy = getHierarchyForTitolarioId(id);
        String itemPath = "TITOLI /";
        if (hierarchy != null) {
            for (TitolarioOutputDTO t : hierarchy.getTitolario()) {
                itemPath = itemPath.concat(" ").concat(t.getLabel()).concat(" /");
            }
        }
        return itemPath;
    }


    @Override
    public PanacheQuery<Titolario> getFindAllQuery(String search, SortInput sort) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }

    @Override
    public PanacheQuery<Titolario> getFindByIdQuery(Long id) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }



    private String computeGruppoForFascicoloDipendente(String letter) {
        String[] letterGroups = new String[] {
                "A, B, C, D, E",
                "F, G, H, I, J",
                "K, L, M, N, O",
                "P, Q, R, S, T",
                "U, V, W, X, Y, Z"
        };
        for(int i=1;i<=letterGroups.length;i++) {
            if (letterGroups[i-1].contains(letter)) {
                return "Gruppo " + i + ": "+letterGroups[i-1];
            }
        }
        return null;
    }
    private Titolario searchExistentFascicoloDipendente(String nomeFascicolo, List<Titolario> fascicoliDipendenti) {
        if (fascicoliDipendenti == null)
            return null;
        for(Titolario fascicolo : fascicoliDipendenti) {
            if (fascicolo.getNome().equalsIgnoreCase(nomeFascicolo))
                return fascicolo;
        }
        return null;
    }

    private void rewritePermessiForFascicolo(DatiUtenteFullSSO utente, Titolario fascicolo, List<Ufficio> uffici, Date now, List<StrutturaFascicoloDipendente> strutturaFascicoloDipendenteList, List<StrutturaVisibilitaFascicoloDipendente> strutturaVisibilitaFascicoloDipendenteList, Set<Ufficio> collectionUfficiFascicoloLv1) {

        if (utente != null) {
            List<VisibilitaTitolario> permessiFascicoloLv1 = VisibilitaTitolario.find("titolario", fascicolo).list();
            for (VisibilitaTitolario permessoFascicoloLv1 : permessiFascicoloLv1) {
                permessoFascicoloLv1.delete();
            }

            //NOTA: aggiungere permesso di scrittura esplicito per l'ufficio del dipendente
            VisibilitaTitolario permessoUfficio = new VisibilitaTitolario();
            permessoUfficio.setTitolario(fascicolo);
            permessoUfficio.setIdUtente(null);
            permessoUfficio.setCdr(fascicolo.getCdr());
            permessoUfficio.setCdrCode(fascicolo.getCdrCode());
            permessoUfficio.setWrite(false);
            permessoUfficio.setNote("Permesso di default");
            permessoUfficio.setUsernameUtente(utente.username);
            permessoUfficio.setNomeUtente(fascicolo.getNomeUtenteCreatore());
            permessoUfficio.setTsCreation(Calendar.getInstance().getTime());
            permessoUfficio.setIdUtenteLastOperation(utente.auth_id);
            permessoUfficio.persist();

            //Si aggiungono i permessi di visibilità anche agli uffici che devono accedere ai fascicoli di lv2!
            for(Ufficio ufficioToAddPermesso : collectionUfficiFascicoloLv1) {
                VisibilitaTitolario permessoUfficioUC = new VisibilitaTitolario();
                permessoUfficioUC.setTitolario(fascicolo);
                permessoUfficioUC.setIdUtente(null);
                permessoUfficioUC.setCdr(ufficioToAddPermesso.getCdr());
                permessoUfficioUC.setCdrCode(ufficioToAddPermesso.getCdrCode());
                permessoUfficioUC.setWrite(false);
                permessoUfficioUC.setNote("Permesso di default");
                permessoUfficioUC.setUsernameUtente(utente.username);
                permessoUfficioUC.setNomeUtente(fascicolo.getNomeUtenteCreatore());
                permessoUfficioUC.setTsCreation(Calendar.getInstance().getTime());
                permessoUfficioUC.setIdUtenteLastOperation(utente.auth_id);
                permessoUfficioUC.persist();
            }
        }


        //NOTA: rimuovere i permessi per tutti i fascicoli e ricrearli
        List<Long> idChildrenFascicoloDipendente = getDescendantsForTitolarioId(fascicolo.getId());
        Map<String, Object> params = new HashMap<>();
        params.put("listIds", idChildrenFascicoloDipendente);
        List<Titolario> fascicoliDipendenteToUpdate = Titolario.find("id in :listIds", params).list();


        Set<Ufficio> ufficiToAddToUfficioDipendente = new HashSet<>();

        for(Ufficio ufficio : uffici) {
            if (fascicolo.getCdrCode().equalsIgnoreCase(ufficio.getCdrCode())) {
                ufficiToAddToUfficioDipendente.add(ufficio);
                break;
            }
        }

        Map<String, Object> paramsPermessi = new HashMap<>();
        paramsPermessi.put("titolari", fascicoliDipendenteToUpdate);
        List<PermessiFascicoloDipendente> listPermessi = PermessiFascicoloDipendente.find("titolario in :titolari", paramsPermessi).list();

        for(PermessiFascicoloDipendente permessiFascicolo : listPermessi) {
            permessiFascicolo.delete();
        }

        for(Titolario fascicoloDipendenteToUpdate : fascicoliDipendenteToUpdate) {

            PermessiFascicoloDipendente permessoUC = new PermessiFascicoloDipendente();
            PermessiFascicoloDipendente permessoUfficioDipendente = new PermessiFascicoloDipendente();
            permessoUC.setTsCreation(now);
            permessoUfficioDipendente.setTsCreation(now);

            Set<Ufficio> ufficiToAddToUC = new HashSet<>();
            for(StrutturaFascicoloDipendente strutturaFascicolo : strutturaFascicoloDipendenteList) {
                if (strutturaFascicolo.getTipologia().equals(fascicoloDipendenteToUpdate.getTipologiaTitolario()) && strutturaFascicolo.getNome().equals(fascicoloDipendenteToUpdate.getNome())) {
                    for(StrutturaVisibilitaFascicoloDipendente sv : strutturaVisibilitaFascicoloDipendenteList) {
                        if (sv.getIdStrutturaFascicoloDipendente().equals(strutturaFascicolo.getId())) {
                            if (sv.getIdUfficio() != null) {
                                permessoUC.setVisibilitaDipendente(sv.getVisibilitaDipendente());
                                permessoUC.setVisibilitaDirigente(sv.getVisibilitaDirigenti());
                                permessoUC.setVisibilitaArchivista(sv.getVisibilitaArchivisti());
                                permessoUC.setVisibilitaProtocollatore(sv.getVisibilitaProtocollatori());
                                permessoUC.setVisibilitaUtente(sv.getVisibilitaUtenti());

                                for(Ufficio ufficio : uffici) {
                                    if (Objects.equals(sv.getIdUfficio(), ufficio.getId())) {
                                        ufficiToAddToUC.add(ufficio);
                                        break;
                                    }
                                }
                            }
                            else {
                                permessoUfficioDipendente.setVisibilitaDipendente(sv.getVisibilitaDipendente());
                                permessoUfficioDipendente.setVisibilitaDirigente(sv.getVisibilitaDirigenti());
                                permessoUfficioDipendente.setVisibilitaArchivista(sv.getVisibilitaArchivisti());
                                permessoUfficioDipendente.setVisibilitaProtocollatore(sv.getVisibilitaProtocollatori());
                                permessoUfficioDipendente.setVisibilitaUtente(sv.getVisibilitaUtenti());
                            }
                        }
                    }
                    break;
                }
            }
            permessoUC.setUffici(ufficiToAddToUC);
            permessoUC.setTitolario(fascicoloDipendenteToUpdate);
            permessoUC.persist();
            permessoUfficioDipendente.setUffici(ufficiToAddToUfficioDipendente);
            permessoUfficioDipendente.setTitolario(fascicoloDipendenteToUpdate);
            permessoUfficioDipendente.persist();
        }
    }
    private String createFascicoliForDipendente(List<Ufficio> uffici,
                                                List<StrutturaFascicoloDipendente> strutturaFascicoloDipendenteList,
                                                List<StrutturaVisibilitaFascicoloDipendente> strutturaVisibilitaFascicoloDipendenteList,
                                                DatiUtenteFullSSO utenteFullSSO,
                                                Long idSottosezioneExDipendenti,
                                                List<Titolario> fascicoliDipendenti,
                                                List<Titolario> gruppi,
                                                Date now,
                                                boolean rewritePermessi,
                                                Set<Ufficio> collectionUfficiForPermessiFascicoloLv1) {
        String nomeFascicolo = utenteFullSSO.lastName+" "+utenteFullSSO.firstName + " - ";

        if (utenteFullSSO.matricola == null || utenteFullSSO.matricola.isEmpty()) nomeFascicolo += "00000";
        else {
            nomeFascicolo += String.format("%5s", utenteFullSSO.matricola).replace(" ", "0");
        }
        String firstLetter = utenteFullSSO.lastName.toUpperCase().substring(0, 1);

        //1. get della sottosezione su cui appendere il fascicolo
        String nomeSottosezioneGruppo = null;
        if (utenteFullSSO.department != null && utenteFullSSO.department.equalsIgnoreCase("COMANDATI")) nomeSottosezioneGruppo = StrutturaFascicoloDipendente.nomeSottosezioneComandati;
        else if (utenteFullSSO.department != null && utenteFullSSO.department.equalsIgnoreCase("EXDIPENDENTI")) nomeSottosezioneGruppo = StrutturaFascicoloDipendente.nomeSottosezioneExDipendenti;
        else nomeSottosezioneGruppo = computeGruppoForFascicoloDipendente(firstLetter);

        Long idSottosezioneToUse = null;
        for(Titolario sottosezioneGruppo : gruppi) {
            if (sottosezioneGruppo.getNome().equalsIgnoreCase(nomeSottosezioneGruppo)) {
                idSottosezioneToUse = sottosezioneGruppo.getId();
                break;
            }
        }

        //2. check se fascicolo già esiste
        Titolario existentFascicoloDipendente = searchExistentFascicoloDipendente(nomeFascicolo, fascicoliDipendenti);
        if (existentFascicoloDipendente != null) {



            //NOTA: controllare se il fascicolo del dipendente è nella sottosezione degli ex-dipendenti, nel caso spostarlo nella sottosezione corretta
            if (!Objects.equals(idSottosezioneToUse, idSottosezioneExDipendenti) && Objects.equals(existentFascicoloDipendente.getIdPadre(), idSottosezioneExDipendenti)) {
                existentFascicoloDipendente.setIdPadre(idSottosezioneToUse);
                existentFascicoloDipendente.persist();
            }

            //NOTA: se il flag è settato, si cancellano tutti i permessi salvati e si ricreano
            if (rewritePermessi) {
                rewritePermessiForFascicolo(utenteFullSSO, existentFascicoloDipendente, uffici, now, strutturaFascicoloDipendenteList, strutturaVisibilitaFascicoloDipendenteList, collectionUfficiForPermessiFascicoloLv1);
                return nomeFascicolo;
            }

            //NOTA: vedere se l'ufficio del dipendente è cambiato, nel caso effettuare update dei permessi cambiando ufficio vecchio con quello nuovo
            // update permessi_fascicolo_dipendente set id_ufficio = <nuovo id ufficio> where where id in () and id_ufficio is not null;
            if (!existentFascicoloDipendente.getCdrCode().equalsIgnoreCase(utenteFullSSO.cdrCode)) {
                String oldCdrCode = existentFascicoloDipendente.getCdrCode();

                existentFascicoloDipendente.setCdrCode(utenteFullSSO.cdrCode);
                for(Ufficio ufficio : uffici) {
                    if (utenteFullSSO.cdrCode.equalsIgnoreCase(ufficio.getCdrCode())) {
                        existentFascicoloDipendente.setCdr(ufficio.getCdr());
                        break;
                    }
                }
                existentFascicoloDipendente.persist();


                VisibilitaTitolario vtFascicoloDipendente = VisibilitaTitolario.find("cdrCode = ?1 and titolario = ?2", oldCdrCode, existentFascicoloDipendente).firstResult();
                vtFascicoloDipendente.setCdr(existentFascicoloDipendente.getCdr());
                vtFascicoloDipendente.setCdrCode(existentFascicoloDipendente.getCdrCode());
                vtFascicoloDipendente.persist();

                Long newId = null;
                Long oldId = null;
                for(Ufficio ufficio : uffici) {
                    if (utenteFullSSO.cdrCode.equalsIgnoreCase(ufficio.getCdrCode())) {
                        newId = ufficio.getId();
                    }
                    if (oldCdrCode.equalsIgnoreCase(ufficio.getCdrCode())) {
                        oldId = ufficio.getId();
                    }
                }
                List<Long> idChildrenFascicoloDipendente = getDescendantsForTitolarioId(existentFascicoloDipendente.getId());
                Map<String, Object> params = new HashMap<>();
                params.put("listIds", idChildrenFascicoloDipendente);
                List<Titolario> fascicoliDipendente = Titolario.find("id in :listIds", params).list();

                List<Long> idPermessiToUpdate = new ArrayList<>();
                for (Titolario t : fascicoliDipendente) {
                    for(PermessiFascicoloDipendente pt : t.getPermessiFascicoloDipendente()) {
                        idPermessiToUpdate.add(pt.getId());
                    }
                }

                String query = "UPDATE permessi_fascicolo_dipendente_cdr SET id_ufficio = :newUfficio WHERE id_permessi_fascicolo_dipendente IN :idPermessi AND id_ufficio = :oldUfficio";
                em.createNativeQuery(query)
                        .setParameter("newUfficio", newId)
                        .setParameter("oldUfficio", oldId)
                        .setParameter("idPermessi", idPermessiToUpdate)
                        .executeUpdate();
            }

            return nomeFascicolo;
        }

        //3. inserire il fascicolo di livello 1
        Titolario fascicoloDipendente = new Titolario();
        fascicoloDipendente.setTipologiaTitolario(TipologiaTitolario.FascicoloLv1);
        fascicoloDipendente.setNome(nomeFascicolo);
        fascicoloDipendente.setNote("Ufficio: "+(utenteFullSSO.department == null ? "N.D." : utenteFullSSO.department));
        fascicoloDipendente.setCdrCode(utenteFullSSO.cdrCode);
        for(Ufficio ufficio : uffici) {
            if (utenteFullSSO.cdrCode.equalsIgnoreCase(ufficio.getCdrCode())) {
                fascicoloDipendente.setCdr(ufficio.getCdr());
                break;
            }
        }
        fascicoloDipendente.setIdPadre(idSottosezioneToUse);
        fascicoloDipendente.setLeaf(false);
        fascicoloDipendente.setTsCreation(now);
        fascicoloDipendente.setIdUtenteCreatore(utenteFullSSO.auth_id);
        fascicoloDipendente.setNomeUtenteCreatore(utenteFullSSO.firstName+" "+utenteFullSSO.lastName);
        fascicoloDipendente.setIsFascicoloDipendente(false);
        fascicoloDipendente.persist();

        //NOTA: aggiungere permesso di scrittura esplicito per l'ufficio del dipendente
        VisibilitaTitolario permessoUfficio = new VisibilitaTitolario();
        permessoUfficio.setTitolario(fascicoloDipendente);
        permessoUfficio.setIdUtente(null);
        permessoUfficio.setCdr(fascicoloDipendente.getCdr());
        permessoUfficio.setCdrCode(fascicoloDipendente.getCdrCode());
        permessoUfficio.setWrite(false);
        permessoUfficio.setNote("Permesso di default");
        permessoUfficio.setUsernameUtente(utenteFullSSO.username);
        permessoUfficio.setNomeUtente(fascicoloDipendente.getNomeUtenteCreatore());
        permessoUfficio.setTsCreation(Calendar.getInstance().getTime());
        permessoUfficio.setIdUtenteLastOperation(utenteFullSSO.auth_id);
        permessoUfficio.persist();

        //Si aggiungono i permessi di visibilità anche agli uffici che devono accedere ai fascicoli di lv2!
        for(Ufficio ufficioToAddPermesso : collectionUfficiForPermessiFascicoloLv1) {
            VisibilitaTitolario permessoUfficioUC = new VisibilitaTitolario();
            permessoUfficioUC.setTitolario(fascicoloDipendente);
            permessoUfficioUC.setIdUtente(null);
            permessoUfficioUC.setCdr(ufficioToAddPermesso.getCdr());
            permessoUfficioUC.setCdrCode(ufficioToAddPermesso.getCdrCode());
            permessoUfficioUC.setWrite(false);
            permessoUfficioUC.setNote("Permesso di default");
            permessoUfficioUC.setUsernameUtente(utenteFullSSO.username);
            permessoUfficioUC.setNomeUtente(fascicoloDipendente.getNomeUtenteCreatore());
            permessoUfficioUC.setTsCreation(Calendar.getInstance().getTime());
            permessoUfficioUC.setIdUtenteLastOperation(utenteFullSSO.auth_id);
            permessoUfficioUC.persist();
        }

        //4. creare i fascicoli di livello 2 e 3
        for(StrutturaFascicoloDipendente strutturaFascicolo : strutturaFascicoloDipendenteList) {
            if (strutturaFascicolo.getTipologia().equals(TipologiaTitolario.FascicoloLvN)) {
                Titolario fascicoloDipendenteLv2 = new Titolario();
                fascicoloDipendenteLv2.setTipologiaTitolario(TipologiaTitolario.FascicoloLvN);
                fascicoloDipendenteLv2.setNome(strutturaFascicolo.getNome());
                fascicoloDipendenteLv2.setIdPadre(fascicoloDipendente.getId());
                fascicoloDipendenteLv2.setLeaf(strutturaFascicolo.getLeaf());
                fascicoloDipendenteLv2.setTsCreation(now);
                fascicoloDipendenteLv2.setIdUtenteCreatore(utenteFullSSO.auth_id);
                fascicoloDipendenteLv2.setNomeUtenteCreatore(utenteFullSSO.firstName+" "+utenteFullSSO.lastName);
                fascicoloDipendenteLv2.setIsFascicoloDipendente(true);

                /**/
                Set<Ufficio> ufficiToAddToUfficioDipendente = new HashSet<>();

                for(Ufficio ufficio : uffici) {
                    if (utenteFullSSO.cdrCode.equalsIgnoreCase(ufficio.getCdrCode())) {
                        ufficiToAddToUfficioDipendente.add(ufficio);
                        break;
                    }
                }

                PermessiFascicoloDipendente permessoLv2UC = new PermessiFascicoloDipendente();
                permessoLv2UC.setTsCreation(now);
                PermessiFascicoloDipendente permessoLv2UfficioDipendente = new PermessiFascicoloDipendente();
                permessoLv2UfficioDipendente.setTsCreation(now);
                permessoLv2UfficioDipendente.setUffici(ufficiToAddToUfficioDipendente);

                Set<Ufficio> ufficiToAddToUC = new HashSet<>();

                //NOTA: aggiungere il permesso per il fascicolo di livello 2
                for (StrutturaVisibilitaFascicoloDipendente sv : strutturaVisibilitaFascicoloDipendenteList) {
                    if (sv.getIdStrutturaFascicoloDipendente() == strutturaFascicolo.getId()) {

                        if (sv.getIdUfficio() != null) {
                            permessoLv2UC.setVisibilitaDipendente(sv.getVisibilitaDipendente());
                            permessoLv2UC.setVisibilitaDirigente(sv.getVisibilitaDirigenti());
                            permessoLv2UC.setVisibilitaArchivista(sv.getVisibilitaArchivisti());
                            permessoLv2UC.setVisibilitaProtocollatore(sv.getVisibilitaProtocollatori());
                            permessoLv2UC.setVisibilitaUtente(sv.getVisibilitaUtenti());

                            for(Ufficio ufficio : uffici) {
                                if (Objects.equals(sv.getIdUfficio(), ufficio.getId())) {
                                    ufficiToAddToUC.add(ufficio);
                                    break;
                                }
                            }
                        }
                        else {
                            permessoLv2UfficioDipendente.setVisibilitaDipendente(sv.getVisibilitaDipendente());
                            permessoLv2UfficioDipendente.setVisibilitaDirigente(sv.getVisibilitaDirigenti());
                            permessoLv2UfficioDipendente.setVisibilitaArchivista(sv.getVisibilitaArchivisti());
                            permessoLv2UfficioDipendente.setVisibilitaProtocollatore(sv.getVisibilitaProtocollatori());
                            permessoLv2UfficioDipendente.setVisibilitaUtente(sv.getVisibilitaUtenti());
                        }
                    }
                }
                permessoLv2UC.setUffici(ufficiToAddToUC);

                /**/
                fascicoloDipendenteLv2.persist();

                permessoLv2UC.setTitolario(fascicoloDipendenteLv2);
                permessoLv2UfficioDipendente.setTitolario(fascicoloDipendenteLv2);
                permessoLv2UC.persist();
                permessoLv2UfficioDipendente.persist();

                if (!strutturaFascicolo.getLeaf()) {
                    for(StrutturaFascicoloDipendente strutturaFascicoloInner : strutturaFascicoloDipendenteList) {
                        if (Objects.equals(strutturaFascicoloInner.getIdPadre(), strutturaFascicolo.getId()) && strutturaFascicoloInner.getTipologia().equals(TipologiaTitolario.FascicoloLvN)) {
                            Titolario fascicoloDipendenteLv3 = new Titolario();
                            fascicoloDipendenteLv3.setTipologiaTitolario(TipologiaTitolario.FascicoloLvN);
                            fascicoloDipendenteLv3.setNome(strutturaFascicoloInner.getNome());
                            fascicoloDipendenteLv3.setIdPadre(fascicoloDipendenteLv2.getId());
                            fascicoloDipendenteLv3.setLeaf(strutturaFascicoloInner.getLeaf());
                            fascicoloDipendenteLv3.setTsCreation(now);
                            fascicoloDipendenteLv3.setIdUtenteCreatore(utenteFullSSO.auth_id);
                            fascicoloDipendenteLv3.setNomeUtenteCreatore(utenteFullSSO.firstName+" "+utenteFullSSO.lastName);
                            fascicoloDipendenteLv3.setIsFascicoloDipendente(true);

                            //NOTA: aggiungere il permesso per il fascicolo di livello 3
                            /**/
                            PermessiFascicoloDipendente permessoLv3UC = new PermessiFascicoloDipendente();
                            permessoLv3UC.setTitolario(fascicoloDipendenteLv3);
                            permessoLv3UC.setTsCreation(now);
                            PermessiFascicoloDipendente permessoLv3UfficioDipendente = new PermessiFascicoloDipendente();
                            permessoLv3UfficioDipendente.setTitolario(fascicoloDipendenteLv3);
                            permessoLv3UfficioDipendente.setTsCreation(now);
                            permessoLv3UfficioDipendente.setUffici(ufficiToAddToUfficioDipendente);

                            Set<Ufficio> ufficiToAddToUCLv3 = new HashSet<>();
                            for (StrutturaVisibilitaFascicoloDipendente sv : strutturaVisibilitaFascicoloDipendenteList) {
                                if (sv.getIdStrutturaFascicoloDipendente() == strutturaFascicoloInner.getId()) {

                                    if (sv.getIdUfficio() != null) {
                                        permessoLv3UC.setVisibilitaDipendente(sv.getVisibilitaDipendente());
                                        permessoLv3UC.setVisibilitaDirigente(sv.getVisibilitaDirigenti());
                                        permessoLv3UC.setVisibilitaArchivista(sv.getVisibilitaArchivisti());
                                        permessoLv3UC.setVisibilitaProtocollatore(sv.getVisibilitaProtocollatori());
                                        permessoLv3UC.setVisibilitaUtente(sv.getVisibilitaUtenti());

                                        for(Ufficio ufficio : uffici) {
                                            if (Objects.equals(sv.getIdUfficio(), ufficio.getId())) {
                                                ufficiToAddToUCLv3.add(ufficio);
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        permessoLv3UfficioDipendente.setVisibilitaDipendente(sv.getVisibilitaDipendente());
                                        permessoLv3UfficioDipendente.setVisibilitaDirigente(sv.getVisibilitaDirigenti());
                                        permessoLv3UfficioDipendente.setVisibilitaArchivista(sv.getVisibilitaArchivisti());
                                        permessoLv3UfficioDipendente.setVisibilitaProtocollatore(sv.getVisibilitaProtocollatori());
                                        permessoLv3UfficioDipendente.setVisibilitaUtente(sv.getVisibilitaUtenti());
                                    }
                                }
                            }
                            permessoLv3UC.setUffici(ufficiToAddToUCLv3);

                            /**/
                            fascicoloDipendenteLv3.persist();

                            permessoLv3UC.setTitolario(fascicoloDipendenteLv3);
                            permessoLv3UfficioDipendente.setTitolario(fascicoloDipendenteLv3);
                            permessoLv3UC.persist();
                            permessoLv3UfficioDipendente.persist();

                        }
                    }
                }
            }
        }
        return nomeFascicolo;
    }

    @Transactional
    @TransactionConfiguration(timeout = 180)
    public void createFascicoliDipendenti(boolean rewritePermessi, boolean rewritePermessiExDipendenti, long start, long end, String onlyForUserId) {


        log.info("START Creazione fascicoli dipendenti");
        Date now = Date.from(Instant.now());
        List<Ufficio> uffici = Ufficio.findAll().list();
        List<StrutturaVisibilitaFascicoloDipendente> strutturaVisibilitaFascicoloDipendenteList = StrutturaVisibilitaFascicoloDipendente.findAll().list();
        List<StrutturaFascicoloDipendente> strutturaFascicoloDipendenteList = StrutturaFascicoloDipendente.findAll().list();

        Set<Ufficio> collectionUfficiForPermessiFascicoloLv1 = new HashSet<>();
        for (StrutturaVisibilitaFascicoloDipendente sv : strutturaVisibilitaFascicoloDipendenteList) {
            if (sv.getIdUfficio() != null) {
                for(Ufficio u : uffici) {
                    if (u.getId().equals(sv.getIdUfficio())) {
                        collectionUfficiForPermessiFascicoloLv1.add(u);
                        break;
                    }
                }
            }
        }


        if (rewritePermessiExDipendenti) {
            log.info("START Rewrite permessi ex dipendenti");
            Titolario sezioneExDipendenti = Titolario.find("nome", StrutturaFascicoloDipendente.nomeSottosezioneExDipendenti).firstResult();
            List<Titolario> fascicoliExDipendenti = Titolario.find("idPadre", sezioneExDipendenti.getId()).list();

            int cur = 0;
            int size = fascicoliExDipendenti.size();
            for(Titolario fascicoloExDipendente : fascicoliExDipendenti) {
                cur++;
                if (start > 0 && cur < start)
                    continue;
                if (end > 0 && cur > end)
                    continue;
                log.info("Rewrite permessi for fascicolo ex dipendente ({}/{}): {} {}", cur, size, fascicoloExDipendente.getNomeUtenteCreatore());
                rewritePermessiForFascicolo(null, fascicoloExDipendente, uffici, now, strutturaFascicoloDipendenteList, strutturaVisibilitaFascicoloDipendenteList, collectionUfficiForPermessiFascicoloLv1);
            }

            log.info("END Rewrite permessi ex dipendenti");
            return;
        }

        // prendere tutti i fascicoli dei dipendenti già inseriti nel DB
        Titolario sezione = Titolario.find("nome", StrutturaFascicoloDipendente.nomeSezioneDipendenti).firstResult();
        List<Titolario> sottosezioniGruppo = Titolario.find("idPadre", sezione.getId()).list();

        Titolario exDipendentiSottosezione = null;

        List<Titolario> fascicoliDipendenti = new ArrayList<>();
        for(Titolario sottosezioneGruppo : sottosezioniGruppo) {
            if (sottosezioneGruppo.getNome().equalsIgnoreCase(StrutturaFascicoloDipendente.nomeSottosezioneExDipendenti)) {
                exDipendentiSottosezione = sottosezioneGruppo;
            }
            fascicoliDipendenti.addAll(Titolario.find("idPadre", sottosezioneGruppo.getId()).list());
        }

        List<DatiUtenteFullSSO> utentiSSO = ssoManager.fullUsersWithAttributes();

        //NOTA: ordinare alfabeticamente la lista!
        utentiSSO.sort(Comparator.comparing(u -> u.lastName + u.firstName));

        List<String> nomiFascicoliUtenteCreati = new ArrayList<>();
        int cur = 0; int size = utentiSSO.size();
        for(DatiUtenteFullSSO utenteSSO : utentiSSO) {
            if (!utenteSSO.mustBeImportedInTitolario) {
                continue;
            }
            cur++;
            if (start > 0 && cur < start)
                continue;
            if (end > 0 && cur > end)
                continue;

            if (onlyForUserId != null && !onlyForUserId.isEmpty() && !utenteSSO.auth_id.equalsIgnoreCase(onlyForUserId))
                continue;

            log.info("Creazione fascicolo dipendente ({}/{}): {} {}", cur, size, utenteSSO.lastName, utenteSSO.firstName);

            String nomeFascicoloUtente = createFascicoliForDipendente(uffici, strutturaFascicoloDipendenteList, strutturaVisibilitaFascicoloDipendenteList, utenteSSO, exDipendentiSottosezione != null ? exDipendentiSottosezione.getId() : null, fascicoliDipendenti, sottosezioniGruppo, now, rewritePermessi, collectionUfficiForPermessiFascicoloLv1);
            nomiFascicoliUtenteCreati.add(nomeFascicoloUtente);
        }
        Collections.sort(nomiFascicoliUtenteCreati);

        //Spostamento fascicoli dipendenti non trovati nell'iterazione corrente in fascicolo di ex-dipendenti
        if (exDipendentiSottosezione != null) {
            for(Titolario fascicoloDipendente : fascicoliDipendenti) {
                if (!nomiFascicoliUtenteCreati.contains(fascicoloDipendente.getNome())) {
                    fascicoloDipendente.setIdPadre(exDipendentiSottosezione.getId());
                    fascicoloDipendente.persist();
                }
            }
        }
        log.info("END Creazione fascicoli dipendenti");
    }


    /**/
    private Long persistFascicoloPerUfficio(String nome, TipologiaTitolario tipo, Long idPadre, boolean isLeaf, String cdrCode, String cdr, Date now, List<Ufficio> allUffici) {
        Titolario fascicoloUfficio = new Titolario();
        fascicoloUfficio.setTipologiaTitolario(tipo);
        fascicoloUfficio.setNome(nome);
        fascicoloUfficio.setIdPadre(idPadre);
        fascicoloUfficio.setLeaf(isLeaf);
        fascicoloUfficio.setTsCreation(now);
        fascicoloUfficio.setIdUtenteCreatore("");
        fascicoloUfficio.setNomeUtenteCreatore("Sistema");
        fascicoloUfficio.setCdr(cdr);
        fascicoloUfficio.setCdrCode(cdrCode);
        fascicoloUfficio.setIsFascicoloDipendente(false);
        fascicoloUfficio.persist();

        //NOTA: aggiungere permesso di scrittura esplicito per l'ufficio
        if (tipo.equals(TipologiaTitolario.FascicoloLv1)) {
            if (allUffici != null) {
                for(Ufficio u : allUffici) {
                    VisibilitaTitolario permessoUfficio = new VisibilitaTitolario();
                    permessoUfficio.setTitolario(fascicoloUfficio);
                    permessoUfficio.setIdUtente(null);
                    permessoUfficio.setCdr(u.getCdr());
                    permessoUfficio.setCdrCode(u.getCdrCode());
                    permessoUfficio.setWrite(true);
                    permessoUfficio.setNote("Permesso di default");
                    permessoUfficio.setUsernameUtente("");
                    permessoUfficio.setNomeUtente("Sistema");
                    permessoUfficio.setTsCreation(Calendar.getInstance().getTime());
                    permessoUfficio.setIdUtenteLastOperation("");
                    permessoUfficio.persist();
                }
            }
            else {
                VisibilitaTitolario permessoUfficio = new VisibilitaTitolario();
                permessoUfficio.setTitolario(fascicoloUfficio);
                permessoUfficio.setIdUtente(null);
                permessoUfficio.setCdr(cdr);
                permessoUfficio.setCdrCode(cdrCode);
                permessoUfficio.setWrite(true);
                permessoUfficio.setNote("Permesso di default");
                permessoUfficio.setUsernameUtente("");
                permessoUfficio.setNomeUtente("Sistema");
                permessoUfficio.setTsCreation(Calendar.getInstance().getTime());
                permessoUfficio.setIdUtenteLastOperation("");
                permessoUfficio.persist();
            }
        }

        return fascicoloUfficio.getId();
    }
    private void createFascicoloPerUfficio(String cdrCode, String cdr, Long idSottosezione, Date now, String currentYear, String nextYear, List<Titolario> fascicoli, List<Ufficio> uffici) {
        String nomeFascicolo = cdr;
        if (fascicoli != null) {
            for(Titolario t : fascicoli) {
                if (t.getNome().equalsIgnoreCase(nomeFascicolo)) {
                    List<Titolario> tAnni = Titolario.find("idPadre", t.getId()).list();

                    boolean currentYearIsPresent = false;
                    boolean nextYearIsPresent = false;
                    for(Titolario tAnno : tAnni) {
                        if (tAnno.getNome().equalsIgnoreCase(currentYear)) currentYearIsPresent = true;
                        if (tAnno.getNome().equalsIgnoreCase(nextYear)) nextYearIsPresent = true;
                    }

                    if (!currentYearIsPresent) {
                        persistFascicoloPerUfficio(currentYear, TipologiaTitolario.FascicoloLvN, t.getId(), true, cdrCode, cdr, now, null);
                    }
                    if (!nextYearIsPresent) {
                        persistFascicoloPerUfficio(nextYear, TipologiaTitolario.FascicoloLvN, t.getId(), true, cdrCode, cdr, now, null);
                    }
                    return;
                }
            }

        }

        Long idFascicolo = persistFascicoloPerUfficio(nomeFascicolo, TipologiaTitolario.FascicoloLv1, idSottosezione, false, cdrCode, cdr, now, uffici);
        persistFascicoloPerUfficio(currentYear, TipologiaTitolario.FascicoloLvN, idFascicolo, true, cdrCode, cdr, now, null);
        persistFascicoloPerUfficio(nextYear, TipologiaTitolario.FascicoloLvN, idFascicolo, true, cdrCode, cdr, now, null);
    }

    @Transactional
    @TransactionConfiguration(timeout = 120)
    public void createFascicoliFattureDetermine() {

        Titolario sezione = Titolario.find("nome", "5 - ATTIVITA' RELATIVA AI DIPARTIMENTI").firstResult();
        List<Titolario> sottosezioniGruppo = Titolario.find("idPadre", sezione.getId()).list();

        Long idSottosezioneFatture = null;
        Long idSottosezioneDetermine = null;
        List<Titolario> fascicoliUfficiFatture = null;
        List<Titolario> fascicoliUfficiDetermine = null;
        for(Titolario t : sottosezioniGruppo) {
            if (t.getNome().equals("3 - FATTURE ELETTRONICHE")) {
                idSottosezioneFatture = t.getId();
                fascicoliUfficiFatture = Titolario.find("idPadre", t.getId()).list();
            }
            if (t.getNome().equals("5 - DETERMINAZIONI DIRIGENZIALI")) {
                idSottosezioneDetermine = t.getId();
                fascicoliUfficiDetermine = Titolario.find("idPadre", t.getId()).list();
            }
        }

        if (idSottosezioneFatture == null) {
            log.error("SOTTOSEZIONE PER CLASSIFICAZIONE FATTURE NON TROVATA NEL TITOLARIO PER AGGIUNGERE I FASCICOLI PER FATTURE E DETERMINE");
        }
        if (idSottosezioneDetermine == null) {
            log.error("SOTTOSEZIONE PER CLASSIFICAZIONE DETERMINE NON TROVATA NEL TITOLARIO PER AGGIUNGERE I FASCICOLI PER FATTURE E DETERMINE");
        }

        if (idSottosezioneFatture == null && idSottosezioneDetermine == null) {
            return;
        }

        Date now = Date.from(Instant.now());
        String currentYear = Year.now().toString();
        String nextYear = String.valueOf(Year.now().getValue() + 1);

        Sort sort = Sort.by("cdr").ascending();
        List<Ufficio> uffici = Ufficio.findAll(sort).list();

        //Fascicoli "calderone"
        if (idSottosezioneFatture != null)
            createFascicoloPerUfficio("0000", "Non categorizzato", idSottosezioneFatture, now, currentYear, nextYear, fascicoliUfficiFatture, uffici);
        if (idSottosezioneDetermine != null)
            createFascicoloPerUfficio("0000", "Non categorizzato", idSottosezioneDetermine, now, currentYear, nextYear, fascicoliUfficiDetermine, uffici);

        //Per ogni ufficio

        for(Ufficio u : uffici) {
            if (idSottosezioneFatture != null)
                createFascicoloPerUfficio(u.getCdrCode(), u.getCdr(), idSottosezioneFatture, now, currentYear, nextYear, fascicoliUfficiFatture, null);
            if (idSottosezioneDetermine != null)
                createFascicoloPerUfficio(u.getCdrCode(), u.getCdr(), idSottosezioneDetermine, now, currentYear, nextYear, fascicoliUfficiDetermine, null);
        }
    }
    /**/

    /***
     * Query ricorsiva.
     * Ritorna tutta la gerarchia del titolario filtrando per elementi foglia.
     * @param idList - lista di idTitolario
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<Long> getNotDipendenteLeafTitolarioId(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            return Collections.emptyList();
        }

        String query = """
        WITH RECURSIVE titolario_hierarchy_query AS (
            SELECT * FROM titolario WHERE id IN (:ids)
            UNION ALL
            SELECT e.* FROM titolario e
            INNER JOIN titolario_hierarchy_query c ON e.id_padre = c.id
        )
        SELECT id FROM titolario_hierarchy_query
        WHERE is_leaf = TRUE AND is_fascicolo_dipendente = false
        """;

        return em.createNativeQuery(query, Long.class)
                .setParameter("ids", idList)
                .getResultList();
    }

    public int getDepthForFascicoloId(Long idFascicolo) {

        String query = """
            WITH RECURSIVE "discendenti_query" AS (
                SELECT t.id, t.id_padre, 0 AS livello
                FROM titolario t
                WHERE t.id = :idFascicolo
                UNION ALL
                SELECT t1.id, t1.id_padre, d.livello + 1
                FROM titolario t1
                JOIN "discendenti_query" d ON t1.id_padre = d.id
            ) SELECT max(livello) FROM "discendenti_query"
        """;

        Long result = (Long)em.createNativeQuery(query, Long.class)
                .setParameter("idFascicolo", idFascicolo)
                .getSingleResult();
        return result.intValue();
    }


    /***
     * Query ricorsiva.
     * Ritorna tutta la gerarchia del titolario filtrando per elementi foglia.
     * @param idList - lista di idTitolario
     */
    @SuppressWarnings("unchecked")
    public List<Titolario> getFilteredLeafIds(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            return Collections.emptyList();
        }

        String query = """
        WITH RECURSIVE titolario_hierarchy_query AS (
            SELECT * FROM titolario WHERE id IN (:ids)
            UNION ALL
            SELECT e.* FROM titolario e
            INNER JOIN titolario_hierarchy_query c ON e.id_padre = c.id
        )
        SELECT * FROM titolario_hierarchy_query WHERE is_leaf = TRUE
        """;

        return em.createNativeQuery(query, Titolario.class)
                .setParameter("ids", idList)
                .getResultList();
    }

    /***
     * Ritorna una lista di idTitolario partendo dal nome,
     * recuperando la gerarchi per ogni risultato trovato e filtrando per elementi foglia.
     * @param nome - nome del titolario da cercare
     */
    public Set<Long> getAllTitolarioByName(String nome){
        if(nome == null || nome.isEmpty()){
            return new HashSet<>();
        }

        List<Titolario> titolarioList = em
                .createNamedQuery("searchTitolarioByNome",Titolario.class)
                .setParameter("nome",nome.trim())
                .getResultList();

        if(titolarioList.isEmpty()){
            return new HashSet<>();
        }

        Set<Long> filteredLeafIds = new HashSet<>();
        List<Long> nonLeafIds = new ArrayList<>();

        // Se un titolario è foglia non serve calcolare la gerarchia, si mette subito nella lista di ritorno
        for (Titolario titolario : titolarioList) {
            if (Boolean.TRUE.equals(titolario.getLeaf())) {
                filteredLeafIds.add(titolario.getId());
            } else {
                nonLeafIds.add(titolario.getId());
            }
        }

        // Si calcola la gerarchia e si trovano gli elementi foglia
        if (!nonLeafIds.isEmpty()) {
            List<Long> hierarchyLeafIds = getFilteredLeafIds(nonLeafIds)
                    .stream()
                    .map(Titolario::getId)
                    .toList();

            filteredLeafIds.addAll(hierarchyLeafIds);
        }

        return new HashSet<>(filteredLeafIds);
    }

    public List<TitolarioOutputDTO> getFullTitolarioHerarchyList(List<ProtocolliClassificazione> list) {
        List<TitolarioOutputDTO> titolarioProtocollo = new ArrayList<>();

        list.forEach(classificazione -> {
            Titolario titolario = Titolario.findById(classificazione.getIdTitolario());
            TitolarioOutputDTO titolarioDTO = mapper.toOutputDTO(titolario);

            String hierarchyString = buildHierarchyString(getHierarchyForTitolarioId(titolario.getId()).getTitolario());
            String fullHierarchy =  hierarchyString.concat(" ").concat(titolario.getNome());
            titolarioDTO.setHierarchyString(fullHierarchy);

            titolarioProtocollo.add(titolarioDTO);
        });

        return titolarioProtocollo;
    }

    public List<TitolarioOutputDTO> getHierarchyStringByIdProtocollo(Long idProtocollo){
        Protocollo protocollo = protocolloService.findById(idProtocollo);
        return getFullTitolarioHerarchyList(protocollo.getProtocolliClassificazioneList());
    }

    /**
     * Metodo per estrarre una lista di ID di Titolario che l'utente può vedere in base alla sua utenza e ufficio selezionato.
     * Il metodo si divide in 3 step:
     * 1 - Recuperare tutti i fascicoli per i quali l'utente ha la visibilità nella tabella VisibilitaTitolario
     * 2 - Tramite gli id recuperati in precedenza si ricavano tutti i fascicoli foglia figli
     * 3 - Si estraggono tutti i fascicoli del dipendente per i quali l'utente ha la visibilità
     * @param selectedOffice - Ufficio selezionato
     */
    public List<Long> getAllVisibleTitolarioIdByUserAndCdrCode(String selectedOffice){

        Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(selectedOffice);

        // Lista di tutti i fascicoli di primo livello a cui posso accedere
        List<Long> titolariVisibiliIds = em.createQuery(
                        "SELECT vt.titolario.id FROM VisibilitaTitolario vt " +
                                "WHERE vt.titolario.tsDeleted is null " +
                                "AND ((vt.idUtente = :authId AND vt.cdrCode in :cdrCodes) " +
                                "OR (vt.idUtente IS NULL AND vt.cdrCode in :cdrCodes))",
                        Long.class)
                .setParameter("authId", ssoManager.extractIdFromToken())
                .setParameter("cdrCodes", cdrCodes)
                .getResultList();


        List<Long> allTitolarioAccessibileIdList = new ArrayList<>();
        int MAX_CHUNK_SIZE = 60000;
        int totalSize = titolariVisibiliIds.size();
        for (int i = 0; i < totalSize; i += MAX_CHUNK_SIZE) {
            int end = Math.min(i + MAX_CHUNK_SIZE, totalSize);
            List<Long> chunk = titolariVisibiliIds.subList(i, end);
            List<Long> partialResult = getNotDipendenteLeafTitolarioId(chunk);
            allTitolarioAccessibileIdList.addAll(partialResult);
        }

        allTitolarioAccessibileIdList.addAll(getAllIdFascicoliDipendenteByRoles(selectedOffice, cdrCodes));

        return allTitolarioAccessibileIdList;
    }

    /**
     * Metodo per estrarre una lista di ID di Titolario del fascicolo dipendente che l'utente può vedere in base alla sua utenza e ufficio selezionato.
     * @param selectedOffice - Ufficio selezionato
     */
    public List<Long> getAllIdFascicoliDipendenteByRoles(String selectedOffice, Set<String> cdrCodes){
        DatiUtenteSSO datiUtenteSSO = ssoManager.getDatiUtente();
        
        boolean isDirigente = ssoManager.isUtenteDirigente();
        boolean isArchivista = ssoManager.hasMatchingRoleAndCdr(datiUtenteSSO, List.of("archivista"), selectedOffice);
        boolean isProtocollatore = ssoManager.hasMatchingRoleAndCdr(datiUtenteSSO, List.of("protocollatore"), selectedOffice);

        // Lista fascicoli dipendenti con permessi speciali basati sul ruolo
        String permessoQuery = "SELECT pfd.titolario.id FROM PermessiFascicoloDipendente pfd " +
                "join pfd.uffici u " +
                "join ProtocolliClassificazione pc on pc.idTitolario = pfd.titolario.id " +
                "WHERE pfd.titolario.isFascicoloDipendente = TRUE " +
                "AND pfd.titolario.leaf = TRUE " +
                "AND pc.protocollo is not null " +
                "AND u.cdrCode in :cdrCodes AND ( " +
                "pfd.visibilitaUtente = 'visualizzazione' OR ";

        if (isDirigente) {
            permessoQuery += "(pfd.visibilitaDirigente = 'visualizzazione') OR (pfd.visibilitaArchivista = 'protocollazione') OR ";
        }

        if (isArchivista) {
            permessoQuery += "(pfd.visibilitaArchivista = 'visualizzazione') OR (pfd.visibilitaArchivista = 'protocollazione') OR ";
        }

        if (isProtocollatore) {
            permessoQuery += "(pfd.visibilitaProtocollatore = 'visualizzazione') OR (pfd.visibilitaProtocollatore = 'protocollazione') OR ";
        }

        permessoQuery += "( pfd.titolario.idUtenteCreatore = :authId and (pfd.visibilitaDipendente = 'visualizzazione' OR pfd.visibilitaDipendente = 'protocollazione')) ) ";

        return em.createQuery(permessoQuery, Long.class)
                .setParameter("cdrCodes", cdrCodes)
                .setParameter("authId", datiUtenteSSO.auth_id)
                .getResultList();
    }

    private void getAllTitolariVisibili(Set<Titolario> results, Long idPadre, RicercaTitolarioDTO dto) {
        dto.setIdPadre(idPadre);
        TitolariOutputDTO output = getTitolarioSection(dto);
        for(TitolarioOutputDTO out : output.getTitolario()) {
            Titolario child = new Titolario();
            child.setId(out.getId());
            child.setIdPadre(out.getIdPadre());
            child.setCdr(out.getCdr());
            child.setLeaf(out.isLeaf());
            child.setTipologiaTitolario(TipologiaTitolario.fromString(out.getTipologia()));
            child.setNome(out.getLabel());
            child.setTsCreation(out.getTsCreation());
            child.setTsChiusura(out.getTsChiusura());
            child.setTsDeleted(out.getTsDeleted());
            child.setNote(out.getNote());
            child.setNomeUtenteCreatore(out.getNomeUtenteCreatore());
            child.setIsFascicoloDipendente(out.isFascicoloDipendente());

            results.add(child);
            getAllTitolariVisibili(results, out.getId(), dto);
        }
    }
    public Set<Titolario> getDescendantsForTitolarioId(Long id, String cdrCode) {
        Set<Titolario> results = new HashSet<>();
        Titolario t = Titolario.findById(id);
        if (isRootType(t.getTipologiaTitolario())) {
            throw new IllegalArgumentException("Titoli, Sezioni e Sottosezioni non sono scaricabili in formato zip");
        }
        results.add(t);
        RicercaTitolarioDTO dto = new RicercaTitolarioDTO();
        dto.setPage(0);
        dto.setSize(1000);
        dto.setCdrCode(cdrCode);
        dto.setCdr(List.of(cdrCode));
        dto.setHideFascicoliDeleted(true);
        dto.setLastIdTitolario(-1);
        dto.setShowFascicoliChiusi(true);
        dto.setShowFascicoliDeleted(false);
        dto.setShowFascicoliForProtocolli(true);
        dto.setShowFascicoliWithDocumenti(false);
        dto.setShowFascicoliWithProtocolli(false);
        dto.setStartIndex(-1);
        dto.setSearch("");
        getAllTitolariVisibili(results, id, dto);
        return results;


        /*
        String idUtente = ssoManager.extractIdFromToken();
        boolean isAdmin = ssoManager.isUtenteAdmin();
        boolean isArchivista = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("archivista"), cdrCode);
        boolean isProtocollatore = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("protocollatore"), cdrCode);
        boolean isDirigente = ssoManager.isUtenteDirigente();

        Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(cdrCode);

        String query = "WITH RECURSIVE titolario_hierarchy_query AS ( " +
                "SELECT t.* FROM titolario t WHERE t.id = ?1 " +
                "UNION ALL " +
                "SELECT e.* FROM titolario e INNER JOIN titolario_hierarchy_query c ON e.id_padre = c.id " +
                ") SELECT * FROM titolario_hierarchy_query";

        List<Titolario> queryResult = em.createNativeQuery(query, Titolario.class).setParameter(1, id.intValue()).getResultList();
        Set<Titolario> filtered = new HashSet<>();

        if(isAdmin){
            filtered.addAll(queryResult);
            return filtered;
        }

            for(Titolario t : queryResult){
                if (this.isRootType(t.getTipologiaTitolario())) {
                    filtered.add(t);
                    continue;
                }

                if (!chekckIdIsPresent(filtered, t.getId()) && t.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)) {
                    checkfascicoloLvl1(queryResult, filtered, t, idUtente, cdrCodes);
                }else {
                    if (!t.getIsFascicoloDipendente()){
                        List<TitolarioOutputDTO> hierarchys = this.getHierarchyForTitolarioId(t.getId()).getTitolario();
                        TitolarioOutputDTO titolarioOutputLv1DTO = hierarchys.stream().filter(h -> h.getTipologia().equalsIgnoreCase(TipologiaTitolario.FascicoloLv1.getTipologiaTitolario())).findFirst().get();
                        if (!chekckIdIsPresent(filtered, t.getId())) {
                            Titolario tlv1 = getTitolarioFromQueryResult(queryResult, titolarioOutputLv1DTO.getId());
                            checkfascicoloLvl1(queryResult, filtered, tlv1, idUtente, cdrCodes);
                        }
                    }
                    else {
                        PermessoFascicoloDipendente permessoFascicoloDipendente = this.isFascicoloDipendenteVisibile(t, idUtente, cdrCodes, isArchivista, isProtocollatore, isDirigente);
                        if (!permessoFascicoloDipendente.equals(PermessoFascicoloDipendente.no)) {
                            if(filtered.stream().filter(tFiltered -> tFiltered.getId().equals(t.getIdPadre())).findFirst().orElse(null) != null){
                                extractedPermessi(queryResult, filtered, t);
                            };
                        }
                    }
                }

                Set<Long> descendentsId = new HashSet<>(this.getDescendantsForTitolarioId(t.getId()));
                descendentsId.add(t.getId());
                if(this.isFascicoliVisibileFromProtocolli(descendentsId, idUtente, isProtocollatore || isArchivista, cdrCodes)){
                    extractedPermessi(queryResult, filtered, t);
                    filtered.add(t);
                }

            }


        return filtered;
        */
    }

    public  Map<Long, Long> getLongLongMap(Map<Long, String> nameMap, Set<Titolario> filtered) {
        List<Object[]> results = new ArrayList<>();
        for (Titolario titolario : filtered) {
            Object[] row = new Object[] {
                    titolario.getId(),
                    titolario.getNome().replaceAll("/", "-"),
                    titolario.getIdPadre()
            };
            results.add(row);
        }
        Map<Long, Long> parentMap = new HashMap<>();
        for (Object[] row : results) {
            Long currentId = ((Number) row[0]).longValue();
            String currentName = (String) row[1];
            Long parentId = row[2] != null ? ((Number) row[2]).longValue() : null;
            parentMap.put(currentId, parentId);
            nameMap.put(currentId, currentName);
        }
        return parentMap;
    }

    public File createTitolarioZip(Set<Titolario> result, Map<Long, Long> parentMap, Map<Long, String> nameMap, String cdrCode) throws Exception {
        File zipFile = File.createTempFile("titolario_" + Utils.fromDateToString(Calendar.getInstance().getTime(), Utils.DateFormat.DMY_HMS_COMPACT), ".zip");

        // Set per tenere traccia dei path già inseriti
        Set<String> zipEntryNames = new HashSet<>();

        try (FileOutputStream fos = new FileOutputStream(zipFile);
             ZipOutputStream zipOut = new ZipOutputStream(fos)) {

            for (Long id : parentMap.keySet()) {
                String path = buildPath(id, parentMap, nameMap);
                if (path == null) {
                    continue;
                }

                // Aggiungi directory solo se non già presente
                String dirEntry = path + "/";
                if (zipEntryNames.add(dirEntry)) {
                    zipOut.putNextEntry(new ZipEntry(dirEntry));
                    zipOut.closeEntry();
                }

                // Se il Titolario è una foglia, aggiungi i file degli Allegati
                Titolario titolario = result.stream().filter(t -> t.getId().equals(id)).findFirst().orElse(null);
                if (titolario != null) {
                    List<Allegato> allegati = Allegato.find("titolario.id", id).list();

                    if(titolario.getLeaf()){
                        RicercaProtocolliDTO dto = new RicercaProtocolliDTO();
                        dto.setPage(0);
                        dto.setSize(2000);
                        dto.setIdFascicolo(titolario.getId());
                        dto.setCdrCode(cdrCode);
                        dto.setRicercaAvanzata(false);
                        dto.setFiltroUfficio(false);
                        dto.setFiltroAll(false);

                        PanacheQuery<Protocollo> query = getProtocolliByFascicoloQuery(dto);
                        List<Protocollo> protocolliTitolario = query.page(Page.of(dto.getPage(), dto.getSize())).list();
                        protocolliTitolario.forEach(protocollo -> Hibernate.initialize(protocollo.getProtocolliClassificazioneList()));


                        if(!protocolliTitolario.isEmpty()){
                            for(Protocollo protocollo : protocolliTitolario){
                                allegati.addAll(protocollo.getAllegati());
                            }
                        }

                    }

                    if(allegati.size() > zipMaxSize){
                        throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Il file di estrazione supera " + zipMaxSize.toString() + "file da inserire");
                    }

                    for (Allegato allegato : allegati) {
                        String filePath;
                        if (allegato.getProtocollo() != null) {
                            String protocolloFolder = allegato.getProtocollo().getNProtocollo();
                            filePath = path + "/" + protocolloFolder + "/" + allegato.getNome();
                        } else {
                            filePath = path + "/" + allegato.getNome();
                        }

                        // Se già inserito, salta
                        if (!zipEntryNames.add(filePath)) {
                            // log.warn("Duplicate ZIP entry skipped: " + filePath);
                            continue;
                        }

                        InputStream fileStream = allegatoService.downloadByRef(allegato.getRiferimentoMinio());
                        if (fileStream != null) {
                            zipOut.putNextEntry(new ZipEntry(filePath));
                            fileStream.transferTo(zipOut);
                            zipOut.closeEntry();
                            fileStream.close();
                        }
                    }
                }
            }
        }

        return zipFile;
    }

    private String buildPath(Long id, Map<Long, Long> parentMap, Map<Long, String> nameMap) {
        String name = nameMap.get(id);
        if (name == null) {  // Se il nome è null, significa che è la root
            return null;
        }

        StringBuilder path = new StringBuilder(name);

        Long parentId = parentMap.get(id);
        while (parentId != null) {
            String parentName = nameMap.get(parentId);
            if (parentName == null) {
                parentId = parentMap.get(parentId);
                continue;
            }
            path.insert(0, parentName + "/");
            parentId = parentMap.get(parentId);
        }

        return path.toString();
    }

    public void checkfascicoloLvl1(List<Titolario> all, Set<Titolario> filtered, Titolario titolario, String idUtente, Set<String> cdrCodes) {
        List<VisibilitaTitolario> listPermessi = VisibilitaTitolario.find("titolario", titolario).list();
        for(VisibilitaTitolario permesso : listPermessi) {
            if ((permesso.getIdUtente() != null && permesso.getIdUtente().equalsIgnoreCase(idUtente) && cdrCodes.contains(permesso.getCdrCode())) || (cdrCodes.contains(permesso.getCdrCode()) && permesso.getIdUtente() == null) ) {
                extracted(all, filtered, titolario);
            }
        }
    }

    private void extracted(List<Titolario> all, Set<Titolario> filtered, Titolario titolario) {
        if(!filtered.contains(titolario)) {
            filtered.add(titolario);
            List<Titolario> lvs2 = all.stream().filter(t -> t.getIdPadre() != null && t.getIdPadre().equals(titolario.getId()) && !t.getIsFascicoloDipendente()).toList();
            filtered.addAll(lvs2);
            for(Titolario lv2 : lvs2) {
                List<Titolario> lvs3 = all.stream().filter(t -> t.getIdPadre() != null && t.getIdPadre().equals(lv2.getId()) && !t.getIsFascicoloDipendente()).toList();
                filtered.addAll(lvs3);
            }
        }
    }

    /*
    private void extractedPermessi(List<Titolario> all, Set<Titolario> filtered, Titolario titolario) {
        if(!filtered.contains(titolario)) {
            if(titolario.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv1)){
                filtered.add(titolario);
            }else {
                filtered.add(titolario);
                Titolario tp1 = all.stream().filter( t -> t.getId().equals(titolario.getIdPadre())).findFirst().get();
                filtered.add(tp1);
                if(tp1.getTipologiaTitolario().equals(TipologiaTitolario.FascicoloLv2)) {
                    Titolario tp2 = all.stream().filter( t -> t.getId().equals(tp1.getIdPadre())).findFirst().get();
                    filtered.add(tp2);
                }
            }
        }
    }
    */

    public boolean chekckIdIsPresent(Set<Titolario> filtered, Long idFascicolo) {
        return filtered.stream().map(Titolario::getId).anyMatch(id -> id.equals(idFascicolo));
    }

    public Titolario getTitolarioFromQueryResult(List<Titolario> queryResult,  Long idFascicolo) {
        Optional<Titolario> result = queryResult.stream().filter(t -> t.getId().equals(idFascicolo)).findFirst();
        if(result.isPresent()) {
            return result.get();
        }
        return null;
    }
}
