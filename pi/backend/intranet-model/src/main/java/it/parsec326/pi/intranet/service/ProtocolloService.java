package it.parsec326.pi.intranet.service;

import io.quarkus.cache.CacheInvalidate;
import io.quarkus.cache.CacheResult;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import io.quarkus.security.UnauthorizedException;
import it.gov.agid.protocollo.ObjectFactory;
import it.gov.agid.protocollo.*;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.client.SendEmailClient;
import it.parsec326.pi.intranet.client.SendNotificaClient;
import it.parsec326.pi.intranet.dto.*;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSlimSSO;
import it.parsec326.pi.intranet.dto.client.sso.Office;
import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import it.parsec326.pi.intranet.dto.excel.ErrorRecord;
import it.parsec326.pi.intranet.dto.excel.ImportResult;
import it.parsec326.pi.intranet.dto.input.segnatura.RiferimentoProtocolloSegnaturaDTO;
import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.dto.input.*;
import it.parsec326.pi.intranet.dto.input.segnatura.SegnaturaDestinatarioInput;
import it.parsec326.pi.intranet.dto.input.segnatura.SegnaturaInput;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaAnagraficaDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaGruppiDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaProtocolliDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaReferentiDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.mapper.ProtocolloMapper;
import it.parsec326.pi.intranet.mapper.ReferenteMapper;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.*;
import it.parsec326.pi.intranet.utils.common.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import jakarta.ws.rs.NotFoundException;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBElement;
import jakarta.xml.bind.Marshaller;
import lombok.Getter;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;
import org.w3._2000._09.xmldsig_.*;
import org.w3c.dom.Document;
import org.w3c.dom.ls.LSInput;
import org.w3c.dom.ls.LSResourceResolver;

import javax.xml.XMLConstants;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static it.parsec326.pi.intranet.utils.Utils.getNomeAllegatoConProtocollo;


@ApplicationScoped
@Slf4j
public class ProtocolloService implements PanacheCustomEntityServiceInterface<Protocollo> {

    @Inject
    @Getter
    UserTransaction transaction;

    @Inject
    MinioConnectionFactory minioFactory;

    @Inject
    EntityManager em;

    @Inject
    ProtocolloMapper mapper;

    @Inject
    ReferenteMapper referenteMapper;

    @Inject
    DocumentService documentService;

    @Inject
    EmailService emailService;

    @Inject
    AllegatoService allegatoService;

    @Inject
    SendEmailClient sendEmailClient;

    @Inject
    SendNotificaClient sendNotificaClient;

    @Inject
    AttachmentContentTypeService attachmentContentTypeService;

    @Inject
    StoricoService storicoService;

    @Inject
    SSOClient ssoManager;

    @Inject
    ReferentiProtocolloService referentiProtocolloService;

    @Inject
    PecPeoService pecPeoService;

    @Inject
    AnagraficaService anagraficaService;

    @Inject
    IpaService ipaService;

    @Inject
    TitolarioService titolarioService;

    @Inject
    NumeroProtocolloCircolareService numeroProtocolloCircolareService;

    @Inject
    NotificaService notificaService;

    @Inject
    ConfigurazioneService configurazioneService;

    @Inject
    EmailTemplateService emailTemplateService;

    @Inject
    TagService tagService;

    @Inject
    UfficioService ufficioService;

    @Inject
    PecOperationService pecOperationService;

    String parameter = "";

    static final String LOG_PEO_NOTIFICA = "Estrazione peoInvioNotifica: {}, per l'elaborazione delle notifiche.";

    @Override
    public Protocollo findById(Long id) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (id == null)
            throw new IllegalArgumentException("Il parametro id è obbligatorio in " + LogUtils.getCallerInfo());

        Protocollo protocollo = Protocollo.findById(id);
        if (protocollo == null) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new NotFoundException("Protocollo non trovato per id:{} " + id);
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return protocollo;
    }

    public Protocollo getProtocolloByNumero(String nProtocollo) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (nProtocollo == null || nProtocollo.isEmpty())
            throw new IllegalArgumentException("Il parametro numero è obbligatorio in " + LogUtils.getCallerInfo());

        Protocollo protocollo = em.createNamedQuery("findProtocolloByNumero",Protocollo.class)
                .setParameter("numero",nProtocollo)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);

        if (protocollo == null) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new NoResultException(String.format("Protocollo o Circolare con Numero: %s non trovato", nProtocollo));
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return protocollo;
    }

    public DettaglioProtocolloDTO getDettaglioProtocollo(String nProtocollo, String selectedOffice) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (selectedOffice == null)
            throw new IllegalArgumentException("Il parametro selectedOffice è obbligatorio in " + LogUtils.getCallerInfo());

        if (!ssoManager.hasJwtToken()) {
            throw new UnauthorizedException("E' necessaria l'autenticazione per accedere alla risorsa " + LogUtils.getCallerInfo());
        }


        Protocollo protocollo = new Protocollo();
        try {
            protocollo = getProtocolloByNumero(nProtocollo);
            protocollo.removeDiscardedAllegati();
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.NOT_FOUND, e.getMessage()).boom();
        }

        log.info("Richiesta dettaglio per il protocollo: {} - da parte dell'utente: {} - per l'ufficio: {}",
                protocollo.getId(),
                ssoManager.extractNameFromToken(),
                selectedOffice);

        DettaglioProtocolloDTO protocolloDTO = new DettaglioProtocolloDTO();
        List<ReferentiProtocollo> referentiList = ReferentiProtocollo.list("idProtocollo", protocollo.getId());
        Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(selectedOffice);

        // si recupera la pec dell'ufficio selezionato
        List<PecPeo> pecUfficioList = em.createNamedQuery("findAllPecPeoByCdr", PecPeo.class)
                .setParameter("cdrCode", selectedOffice)
                .getResultList();

        // si recupera la pec dell'utente selezionato
        List<PecPeo> pecUtenteList = null;
        try {
            pecUtenteList = em.createNamedQuery("findAllPecPeoByIdUtente", PecPeo.class)
                    .setParameter("idUtente", ssoManager.extractIdFromToken())
                    .getResultList();
        }
        catch (Exception ignored) {}

        List<String> offices = ssoManager.extractOfficesByRoles(ssoManager.getDatiUtente());

        List<ReferenteOutputDTO> destinatarioOriginalePecTo = new ArrayList<>();
        List<ReferenteOutputDTO> destinatarioOriginalePecCc = new ArrayList<>();
        boolean canViewProtocolloFromPecTo = false;
        boolean canViewProtocolloFromPecCc = false;

        if (protocollo.getTipoRegistrazione().equals(TipoRegistrazione.Entrata) && protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Pec)) {
            List<Email> emailFromProtocollo = Email.find("protocollo", protocollo).list();
            if (emailFromProtocollo != null && !emailFromProtocollo.isEmpty()) {
                for (Email email : emailFromProtocollo) {
                    if (email.getEmailDirection().equals(EmailDirection.ENTRATA) && email.getTipoEmail().equalsIgnoreCase("pec")) {

                        if (email.getTo() != null) {
                            List<PecPeo> pecPeoDestinatariTo = PecPeo.find("lower(indirizzoEmail) in :indirizzi", Map.of("indirizzi", Arrays.asList(email.getTo().toLowerCase().split(",")))).list();
                            for (PecPeo pc : pecPeoDestinatariTo) {
                                if (pc.getUffici() != null) {
                                    for (Ufficio u : pc.getUffici()) {
                                        ReferenteOutputDTO ro = new ReferenteOutputDTO();
                                        ro.setTipo(TipoDestinatarioReferente.UFFICIO.getNome());
                                        ro.setNome(u.getCdr());
                                        ro.setLabel(u.getCdr());
                                        destinatarioOriginalePecTo.add(ro);
                                    }
                                }
                                if (pc.getUtente() != null) {
                                    ReferenteOutputDTO ro = new ReferenteOutputDTO();
                                    ro.setTipo(TipoDestinatarioReferente.UTENTE.getNome());
                                    ro.setNome(pc.getUtente());
                                    ro.setLabel(pc.getUtente());
                                    destinatarioOriginalePecTo.add(ro);
                                }
                            }
                        }
                        if (email.getCc() != null) {
                            List<PecPeo> pecPeoDestinatariTo = PecPeo.find("lower(indirizzoEmail) in :indirizzi", Map.of("indirizzi", Arrays.asList(email.getCc().toLowerCase().split(",")))).list();
                            for (PecPeo pc : pecPeoDestinatariTo) {
                                if (pc.getUffici() != null) {
                                    for (Ufficio u : pc.getUffici()) {
                                        ReferenteOutputDTO ro = new ReferenteOutputDTO();
                                        ro.setTipo(TipoDestinatarioReferente.UFFICIO.getNome());
                                        ro.setNome(u.getCdr());
                                        ro.setLabel(u.getCdr());
                                        destinatarioOriginalePecCc.add(ro);
                                    }
                                }
                                if (pc.getUtente() != null) {
                                    ReferenteOutputDTO ro = new ReferenteOutputDTO();
                                    ro.setTipo(TipoDestinatarioReferente.UTENTE.getNome());
                                    ro.setNome(pc.getUtente());
                                    ro.setLabel(pc.getUtente());
                                    destinatarioOriginalePecCc.add(ro);
                                }
                            }
                        }



                        for(PecPeo pecUfficio : pecUfficioList) {
                            if (email.getTo() != null && email.getTo().toLowerCase().contains(pecUfficio.getIndirizzoEmail().toLowerCase())) {
                                canViewProtocolloFromPecTo = true;
                            }
                            if (email.getCc() != null && email.getCc().toLowerCase().contains(pecUfficio.getIndirizzoEmail().toLowerCase())) {
                                canViewProtocolloFromPecCc = true;
                            }
                        }
                        if (pecUtenteList != null) {
                            for (PecPeo pecUtente : pecUtenteList) {
                                if (email.getTo() != null && email.getTo().toLowerCase().contains(pecUtente.getIndirizzoEmail().toLowerCase())) {
                                    canViewProtocolloFromPecTo = true;
                                }
                                if (email.getCc() != null && email.getCc().toLowerCase().contains(pecUtente.getIndirizzoEmail().toLowerCase())) {
                                    canViewProtocolloFromPecCc = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        //set dei tag oppure dei referenti
        List<Tag> tagList = getTagFromReferentiProtocollo(referentiList);
        if(tagList != null && !tagList.isEmpty()){
            protocolloDTO.setTagList(tagList);
        }else{
            Map<String, List<ReferenteOutputDTO>> destinatariMap = separaDestinatariOriginali(referentiList);
            protocolloDTO.setDestinatariCompetenza(destinatariMap.getOrDefault("competenza", new ArrayList<>()));
            protocolloDTO.setDestinatariConoscenza(destinatariMap.getOrDefault("conoscenza", new ArrayList<>()));
            if (protocolloDTO.getDestinatariCompetenza().isEmpty() ) {
                protocolloDTO.setDestinatariCompetenza(destinatarioOriginalePecTo);
            }
            if (protocolloDTO.getDestinatariConoscenza().isEmpty()) {
                protocolloDTO.setDestinatariConoscenza(destinatarioOriginalePecCc);
            }
        }

        boolean isDirigente = ssoManager.isUtenteDirigente();
        boolean isArchivista = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("archivista"), selectedOffice);
        boolean isProtocollatore = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("protocollatore"), selectedOffice);
        boolean isUtenteAdmin = ssoManager.isUtenteAdmin();

        boolean isUtenteProtocollatoreArchivista = offices.contains(selectedOffice);
        boolean isUtenteProtocollatoreArchivistaForProtocollo = offices.contains(protocollo.getCdrCode());

        //NOTA: autore del protocollo è considerato admin, protocollatore/archivista dell'ufficio del protocollo, utente che ha creato effettivamente il protocollo
        boolean isProtocolAuthor = isUtenteAdmin || isUtenteProtocollatoreArchivistaForProtocollo || ssoManager.extractIdFromToken().equalsIgnoreCase(protocollo.getIdUtente());

        //set titolario
        protocolloDTO.setTitolario(titolarioService.getTitolarioByProtocollo(protocollo.getProtocolliClassificazioneList(), ssoManager.extractIdFromToken(), cdrCodes, isUtenteAdmin, isProtocollatore, isArchivista, isDirigente));
        boolean isProtocolloClassificato = protocollo.getProtocolliClassificazioneList() != null && !protocollo.getProtocolliClassificazioneList().isEmpty();


        StatoProtocollo statoAssegnazioneCompetenza = null;
        boolean hasUtenteRifiutatoProtocollo = false;
        boolean isUtenteAssegnatarioCompetenza = false;
        boolean isUtenteAssegnatarioConoscenza = false;
        boolean isUfficioAssegnatarioCompetenza = false;
        boolean isUfficioAssegnatarioConoscenza = false;
        for(ReferentiProtocollo ref : referentiList) {
            if (ref.getTipoDestinatario().equalsIgnoreCase("utente") && ref.getIdDestinatario().equals(ssoManager.extractIdFromToken())) {
                if (ref.getAttribuzione().equalsIgnoreCase("competenza")) {
                    isUtenteAssegnatarioCompetenza = true;
                    statoAssegnazioneCompetenza = ref.getStatoProtocollo();
                    if (ref.getStatoProtocollo() != null && ref.getStatoProtocollo().equals(StatoProtocollo.Rifiutato)) {
                        hasUtenteRifiutatoProtocollo = true;
                    }
                }
                else if (ref.getAttribuzione().equalsIgnoreCase("conoscenza")) isUtenteAssegnatarioConoscenza = true;
            }
            else if (isUtenteProtocollatoreArchivista && ref.getTipoDestinatario().equalsIgnoreCase("ufficio") && cdrCodes.contains(ref.getIdDestinatario())) {
                if (ref.getAttribuzione().equalsIgnoreCase("competenza")) isUfficioAssegnatarioCompetenza = true;
                else if (ref.getAttribuzione().equalsIgnoreCase("conoscenza")) isUfficioAssegnatarioConoscenza = true;
            }
        }

        //utente protocollatore/archivista e non ci sono referenti -> protocollo può essere visto se l'ufficio dell'utente
        boolean isPrendereIncaricoFromPecEnabled = (isUtenteProtocollatoreArchivista && (canViewProtocolloFromPecTo || canViewProtocolloFromPecCc));
        boolean isViewFromPecEnabled = (isUtenteProtocollatoreArchivista && canViewProtocolloFromPecCc);

        protocolloDTO.setCanViewFromPec(isViewFromPecEnabled);
        protocolloDTO.setCanPrendereInCaricoFromPec(isPrendereIncaricoFromPecEnabled);

        //NOTA: se non sono autore né assegnatario, si controlla se si può vedere il protocollo in base alla classificazione
        boolean isClassificatoInFascicoloNonVisibile =  false;
        if(!isProtocolAuthor && !isUtenteAssegnatarioCompetenza && !isUtenteAssegnatarioConoscenza && !isUfficioAssegnatarioCompetenza && !isUfficioAssegnatarioConoscenza) {
            isClassificatoInFascicoloNonVisibile = isProtocolloClassificatoInFascicoloNonVisibile(protocollo.getProtocolliClassificazioneList(), selectedOffice, cdrCodes);
        }

        //1. Non autorizzato se protocollo classificato in un fascicolo non visibile (sarà eventualmente valorizzato a true solo in caso non si è autori o assegnatari)
        if (isClassificatoInFascicoloNonVisibile) {
            protocolloDTO.setProtocollo(protocollo);
            protocolloDTO.setAuthorized(false);
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return protocolloDTO;
        }

        protocolloDTO.setProtocolAuthor(isProtocolAuthor);
        protocolloDTO.setAuthorized(true);
        protocolloDTO.setProtocollo(protocollo);

        //2. Annullato -> uscita immediata
        if(StatoProtocollo.Annullato.equals(protocollo.getStato())){
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return protocolloDTO;
        }

        boolean isProtocolloEntrataPec = TipoRegistrazione.Entrata.equals(protocollo.getTipoRegistrazione()) && MetodoSpedizione.Pec.equals(protocollo.getMetodoSpedizione());

        //3. set richiesta di annullamento se sono autore non admin e non protocollo entrata pec
        if(isProtocolAuthor && !isUtenteAdmin && !isProtocolloEntrataPec && !protocollo.getStato().equals(StatoProtocollo.RichiestaDiAnnullamento)){
            protocolloDTO.setRichiestaAnnullamento(true);
        }

        //4. Se admin e protocollo non inserito da sistema -> si setta gestione annullamento oppure annullamento
        if(isUtenteAdmin && (protocollo.getCdrCode() != null) ){
            if(protocollo.getStato().equals(StatoProtocollo.RichiestaDiAnnullamento)){
                protocolloDTO.setGestioneAnnullamento(true);
            }else {
                protocolloDTO.setAnnulla(true);
            }
        }

        //5. si può assegnare se sono autore o posso prendere in carico da pec oppure sono assegnatario che non ha rifiutato
        if( isProtocolAuthor
                || isPrendereIncaricoFromPecEnabled
                || (isUtenteAssegnatarioCompetenza && !hasUtenteRifiutatoProtocollo)
                || isUfficioAssegnatarioCompetenza
        ) {
            protocolloDTO.setAssegna(true);
        }

        //6. assegnatario solo per conoscenza -> si esce
        if ((!isUtenteAssegnatarioCompetenza && !isUfficioAssegnatarioCompetenza) && (isUtenteAssegnatarioConoscenza || isUfficioAssegnatarioConoscenza)) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return protocolloDTO;
        }

        if (isUtenteAssegnatarioCompetenza || isUfficioAssegnatarioCompetenza || isPrendereIncaricoFromPecEnabled) {
            protocolloDTO.setRifiuta(statoAssegnazioneCompetenza == null || !statoAssegnazioneCompetenza.equals(StatoProtocollo.Rifiutato));

            if (isUtenteAssegnatarioCompetenza) {
                protocolloDTO.setStatoProtocollo(statoAssegnazioneCompetenza.toString());
            }
            else {
                protocolloDTO.setStatoProtocollo(StatoProtocollo.DaPrendereInCarico.getStato());
            }
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return protocolloDTO;
    }

    public List<ReferentiProtocollo> getAssegnatariPerCompetenza(List<ReferentiProtocollo> referentiList) {
        if (referentiList == null) return null;
        return referentiList.stream()
                .filter(referente -> referente.getAttribuzione() != null && referente.getAttribuzione().equalsIgnoreCase("competenza") &&
                        (referente.getTipoDestinatario().equalsIgnoreCase("utente") ||
                                referente.getTipoDestinatario().equalsIgnoreCase("ufficio")))
                .toList();
    }

    private Map<String, List<ReferenteOutputDTO>> separaDestinatariOriginali(List<ReferentiProtocollo> referentiList) {
        return referentiList.stream()
                .filter(ReferentiProtocollo::isCreationOption)
                .collect(Collectors.groupingBy(
                        referente -> "competenza".equalsIgnoreCase(referente.getAttribuzione()) ? "competenza" : "conoscenza",
                        Collectors.mapping(referenteMapper::toDtoDettaglio, Collectors.toList())
                ));
    }

    public List<Tag> getTagFromReferentiProtocollo(List<ReferentiProtocollo> referentiList) {
        return referentiList.stream()
                .filter(rp -> rp.getTipoDestinatario().equalsIgnoreCase("tag"))
                .map(rp -> tagService.findTagById(Long.valueOf(rp.getIdDestinatario())))
                .toList();
    }

    public Allegato getAllegatoPrincipale(String nProtocollo) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Protocollo protocollo = getProtocolloByNumero(nProtocollo);
        Allegato allegatoPrincipale = null;
        for(Allegato allegato : protocollo.getAllegati()) {
            if (allegato.getIsMain()) {
                allegatoPrincipale = allegato;
                break;
            }
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return allegatoPrincipale;
    }

    /**
     * Servizio che restituisce una lista di protocolli paginata
     * accetta la ricerca globale, sort, paginazione e filtri ritorna
     * @param dto - conterrà tutti i parametri in input che vengono dai filtri
     * @return
     */
    @ExceptionChecked
    public ProtocolliOutputDTO getProtocolli(RicercaProtocolliDTO dto) {
        long start = System.currentTimeMillis();
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());
        if (!ssoManager.hasJwtToken()) {
            return new ProtocolliOutputDTO(new ArrayList<>(), 0, 0);
        }

        PanacheQuery<Protocollo> query = getProtocolliQuery(dto);
        List<Protocollo> protocolli = query.page(Page.of(dto.getPage(), dto.getSize())).list();
        ProtocolliOutputDTO outputDTO = new ProtocolliOutputDTO(protocolli, getPagesCount(query.count(), dto.getSize()), query.count());

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        long end = System.currentTimeMillis() - start;
        log.info("[getProtocolli] Tempo di esecuzione query: {} ms", end);
        return outputDTO;
    }

    @ExceptionChecked
    @Transactional
    public ProtocolliOutputDTO getProtocolliNative(RicercaProtocolliDTO dto) {
        long start = System.currentTimeMillis();
        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());
        if (!ssoManager.hasJwtToken()) {
            return new ProtocolliOutputDTO(new ArrayList<>(), 0, 0);
        }

        Map<String, Object> res = getProtocolliQueryNative(dto);
        String strQueryCount = (String)res.get("queryCount");
        String strQuery = (String)res.get("query");
        Map<String, Object> params = (Map<String, Object>) res.get("params");

        Query queryCount = em.createNativeQuery(strQueryCount, Long.class);
        Query query = em.createNativeQuery(strQuery, Long.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            queryCount.setParameter(entry.getKey(), entry.getValue());
            query.setParameter(entry.getKey(), entry.getValue());
        }

        Long countProtocolli = (Long) queryCount.getSingleResult();
        List<Long> idProtocolli = query.getResultList();

        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());
        List<Protocollo> protocolli = Protocollo.find("id in ?1", sortCriteria, idProtocolli).list();

        protocolli.forEach(protocollo -> {
            Hibernate.initialize(protocollo.getProtocolliClassificazioneList());
            Hibernate.initialize(protocollo.getAllegati());
            Hibernate.initialize(protocollo.getRaccomandate());
        });

        ProtocolliOutputDTO outputDTO = new ProtocolliOutputDTO(protocolli, getPagesCount(countProtocolli, dto.getSize()), countProtocolli);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        long end = System.currentTimeMillis() - start;
        log.info("[getProtocolliNative] Tempo di esecuzione query: {} ms", end);
        return outputDTO;
    }


    @ExceptionChecked
    @Transactional
    public List<Protocollo> getProtocolliToExport(RicercaProtocolliDTO dto, boolean skipLimitControl) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (dto == null) {
            throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());
        }

        dto.setSize(150);
        dto.setPage(0);

        Map<String, Object> res = getProtocolliQueryNative(dto);
        String strQueryCount = (String)res.get("queryCount");
        String strQuery = (String)res.get("query");
        Map<String, Object> params = (Map<String, Object>) res.get("params");

        Query queryCount = em.createNativeQuery(strQueryCount, Long.class);
        Query query = em.createNativeQuery(strQuery, Long.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            queryCount.setParameter(entry.getKey(), entry.getValue());
            query.setParameter(entry.getKey(), entry.getValue());
        }

        Long countProtocolli = (Long) queryCount.getSingleResult();
        if (!skipLimitControl && countProtocolli > 150) {
            throw new RuntimeException("Numero risultati superiore al limite di 150.");
        }

        List<Long> idProtocolli = query.getResultList();

        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());
        List<Protocollo> protocolli = Protocollo.find("id in ?1", sortCriteria, idProtocolli).list();
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return protocolli;
    }


    /*
    Funzione restituisce una mappa
        - query: query nativa per id protocolli
        - count: query nativa per count
        - params: Mappa di parametri da utilizzare
     */
    private Map<String, Object> buildGetProtocolliQueryNative(String where, String sort, String limit, Map<String, Object> params) {
        StringBuilder query = new StringBuilder("SELECT p.id FROM protocolli p WHERE ");
        StringBuilder queryCount = new StringBuilder("SELECT count(*) as total_results FROM protocolli p WHERE ");

        query.append(where).append(" ").append(sort).append(" ").append(limit);
        queryCount.append(where);

        String strQuery = query.toString();
        String strCount = queryCount.toString();
        log.info("[getProtocolliQueryNative] - Params = {}", params);
        log.info("[getProtocolliQueryNative] - Query = {}", strQuery);
        log.info("[getProtocolliQueryNative] - Query Count = {}", strCount);

        Map<String, Object> returnValues = new HashMap<>();
        returnValues.put("query", strQuery);
        returnValues.put("queryCount", strCount);
        returnValues.put("params", params);
        return returnValues;
    }
    @Transactional
    public Map<String, Object> getProtocolliQueryNative(RicercaProtocolliDTO dto) {
        DatiUtenteSSO datiUtenteSSO = null;
        try{
            datiUtenteSSO = ssoManager.getDatiUtente();
        }catch(Exception e){
            log.error("[getProtocolliQueryNative] - Errore durante la chiamata ad SSO-Backend nel metodo getDatiUtente: [dettagli]: {}", e.getMessage());
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Si è verificato un errore nel recupero delle informazioni di autenticazione. Si consiglia di effettuare nuovamente l'accesso e riprovare.").boom();
        }

        Map<String, Object> params = new HashMap<>();

        // SORT
        StringBuilder querySort = new StringBuilder("ORDER BY ");
        String by = dto.getDefaultSort().by;
        boolean desc = dto.getDefaultSort().desc;
        if (dto.hasSort()) {
            by = dto.getSort().by;
            desc = dto.getSort().desc;
        }
        querySort.append(dto.getSortColumnNative(by)).append(" ").append(desc ? "DESC" : "ASC");

        // Pagination
        StringBuilder queryLimit = new StringBuilder("LIMIT ");
        queryLimit.append(dto.getSize()).append(" OFFSET ").append(dto.getPage() * dto.getSize());

        StringBuilder whereClasues = new StringBuilder("p.id is not null ");

        if (dto.isEmpty() && !dto.hasSearch() && dto.isFiltroAll()) {
            return buildGetProtocolliQueryNative(whereClasues.toString(), querySort.toString(), queryLimit.toString(), params);
        }

        if (dto.hasCdr()) {
            whereClasues.append("and cdr_code in :cdrCode ");
            params.put("cdrCode", ssoManager.getRelatedCdrCodes(dto.getCdr()));
        }

        if(dto.hasSearch()){
            whereClasues.append("and (")
                    .append("lower(n_protocollo) like LOWER(concat('%', :search, '%')) ")
                    //.append("or lower(stato) like LOWER(concat('%', REPLACE(:search, ' ', ''), '%')) ")
                    .append("or lower(mittente) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(destinatari) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(oggetto) like LOWER(concat('%', :search, '%')) ) ");
            params.put("search", dto.getSearch().trim());
        }

        if (dto.hasNumero()) {
            whereClasues.append("and lower(n_protocollo) like LOWER(concat('%', :nProtocollo, '%')) ");
            params.put("nProtocollo", dto.getNumero());
        }

        if (dto.hasNumeroEmergenza()){
            whereClasues.append("and LOWER(n_protocollo_emergenza) like LOWER(concat('%', :numeroEmergenza, '%')) ");
            params.put("numeroEmergenza", dto.getNumeroEmergenza());
        }

        if(dto.getAnno() != null){
            whereClasues.append("and extract(year from ts_creation) = :anno ");
            params.put("anno", dto.getAnno());
        }

        if (dto.hasOggetto()) {
            whereClasues.append("and lower(oggetto) like LOWER(concat('%', :oggetto, '%')) ");
            params.put("oggetto", dto.getOggetto().trim());
        }

        if (dto.hasStato()) {
            whereClasues.append("and stato in :statoList ");
            params.put("statoList", dto.getStato());
        }

        if (dto.hasTipoRegistrazione()) {
            whereClasues.append("and tipo_registrazione in :tipoRegistrazioneList ");
            params.put("tipoRegistrazioneList", dto.getTipoRegistrazione());
        }

        if (dto.hasMetodoSpedizione()) {
            whereClasues.append("and metodo_spedizione in :metodoSpedizioneList ");
            params.put("metodoSpedizioneList", dto.getMetodoSpedizione());
        }

        if (dto.hasNote()) {
            whereClasues.append("and lower(note) like LOWER(concat('%', :note, '%')) ");
            params.put("note", dto.getNote().trim());
        }

        // aggiunta filtro per intervallo temporale
        if (dto.hasDataCreazioneIntervallo()) {
            whereClasues.append("and ts_creation BETWEEN :dataCreazioneFrom AND :dataCreazioneTo ");
            params.put("dataCreazioneFrom", dto.getDataCreazioneFrom());
            params.put("dataCreazioneTo", dto.getDataCreazioneTo());
        }
        else if (dto.getDataCreazioneFrom() != null) {
            whereClasues.append("and ts_creation >= :dataCreazioneFrom ");
            params.put("dataCreazioneFrom", dto.getDataCreazioneFrom());
        }
        else if (dto.getDataCreazioneTo() != null) {
            whereClasues.append("and ts_creation <= :dataCreazioneTo ");
            params.put("dataCreazioneTo", dto.getDataCreazioneTo());
        }

        //filtro per intervallo data emergenza
        if (dto.hasDataCreazioneEmergenzaIntervallo()) {
            whereClasues.append("and data_protocollo_emergenza BETWEEN :dataCreazioneEmergenzaFrom AND :dataCreazioneEmergenzaTo ");
            params.put("dataCreazioneEmergenzaFrom", dto.getDataCreazioneEmergenzaFrom());
            params.put("dataCreazioneEmergenzaTo", dto.getDataCreazioneEmergenzaTo());
        }
        else if (dto.getDataCreazioneEmergenzaFrom() != null) {
            whereClasues.append("and data_protocollo_emergenza >= :dataCreazioneEmergenzaFrom ");
            params.put("dataCreazioneEmergenzaFrom", dto.getDataCreazioneEmergenzaFrom());
        }
        else if (dto.getDataCreazioneEmergenzaTo() != null) {
            whereClasues.append("and data_protocollo_emergenza <= :dataCreazioneEmergenzaTo ");
            params.put("dataCreazioneEmergenzaTo", dto.getDataCreazioneEmergenzaTo());
        }

        if (dto.hasMittente()) {
            whereClasues.append("and lower(mittente) like LOWER(concat('%', :mittente, '%')) ");
            params.put("mittente", dto.getMittente().trim());
        }

        if (dto.hasAssegnatari()) {
            whereClasues.append("and lower(assegnatari) like LOWER(concat('%', :assegnatari, '%')) ");
            params.put("assegnatari", dto.getAssegnatari().trim());
        }

        if (dto.isRicercaAvanzata() && dto.hasDestinatari()) {
            whereClasues.append("and lower(destinatari) like LOWER(concat('%', :destinatari, '%')) ");
            params.put("destinatari", dto.getDestinatari().trim());
        }

        if (dto.isRicercaAvanzata() && dto.hasLagList()) {
            appendDestinatariConditionNative(whereClasues, params, dto.getTagList());
        }

        /** /
        //NOTA: 01/07/2025 - Il parametro non è più supportato nella ricerca dei protocolli
        if (dto.hasNomeTitolario()) {
            Set<Long> filteredIdTitolario = titolarioService.getAllTitolarioByName(dto.getNomeTitolario());
            if (filteredIdTitolario.isEmpty()) {
                whereClasues.append("and 1 = 0 ");
            } else {
                whereClasues.append("and p.id in (select pc.id_protocollo from protocolli_classificazione pc where pc.id_titolario in :idTitolarioList) ");
                params.put("idTitolarioList", filteredIdTitolario);
            }
        }
        /**/
        if (dto.hasIdFascicoli()) {
            if(!ssoManager.isUtenteAdmin()){
                //NOTA: controllo sugli ID per capire se sono tutti visibili per utente
                List<Long> fascicoliVisibili = titolarioService.getAllVisibleTitolarioIdByUserAndCdrCode(dto.getSelectedOffice());
                if (!fascicoliVisibili.containsAll(dto.getIdFascicoli())) {
                    log.error("[getProtocolliQueryNative] - Errore nel controllo sui permessi dei fascicoli selezionati");
                    CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                            "Errore: non si dispone dei permessi per visualizzare i protocolli dei fascicoli selezionati con l'ufficio corrente.").boom();
                }
            }
            whereClasues.append("and p.id in (select pc.id_protocollo from protocolli_classificazione pc where pc.id_titolario in :idTitolarioList) ");
            params.put("idTitolarioList", dto.getIdFascicoli());
        }

        // ==============
        //admin e filtro all -> non si filtra ulteriormente
        if (dto.isFiltroAll() && ssoManager.isUtenteAdmin()) {
            return buildGetProtocolliQueryNative(whereClasues.toString(), querySort.toString(), queryLimit.toString(), params);
        }

        // ==============
        // IL MIO UFFICIO
        /*
            1. protocolli creati dall'ufficio che sono nel titolario accessibile all'utente
            2. protocolli in entrata pec che hanno come destinatario TO e CC una delle pec dell'ufficio
            3. protocolli assegnati all'ufficio
         */
        if (dto.isFiltroUfficio()) {

            // [APERTURA AND] per consentire la corretta gestione dei filtri e search su tutta la query
            whereClasues.append("AND (");

            Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(dto.getSelectedOffice());
            if (cdrCodes.size() == 0) {
                log.error("[getProtocolliQueryNative] - Ufficio selezionato non inserito nei parametri di ricerca");
                CustomException.get(CustomException.ErrorCode.BAD_REQUEST,"Ufficio selezionato non inserito nei parametri di ricerca").boom();
            }

            /*
             *  Se utente NON è admin, si filtra la lista per i protocolli:
             *  1) classificati in fascicoli per cui l'utente ha la visibilità
             *  2) quelli non classificati
             */

            Set<Long> idProtocolliVisibiliUtente;
            if(!ssoManager.isUtenteAdmin()) {
                List<Long> allTitolarioAccessibileIdList = titolarioService.getAllVisibleTitolarioIdByUserAndCdrCode(dto.getSelectedOffice());
                Long[] allTitolarioAccessibileArray = allTitolarioAccessibileIdList.toArray(new Long[0]);
                List<Long> idProtocolliClassificati = getAllProtocolliClassificatiByCdrCodeAndVisibility(allTitolarioAccessibileArray, cdrCodes);
                idProtocolliVisibiliUtente = new HashSet<>(idProtocolliClassificati);
                log.info("[getProtocolliQueryNative] numero protocolli visibili from titolario: {}", idProtocolliClassificati.size());
            } else {
                idProtocolliVisibiliUtente = null;
            }

            String queryProtocolliAssegnatiUfficio = "SELECT DISTINCT rp.id_protocollo FROM referenti_protocollo rp WHERE rp.id_protocollo NOT IN (SELECT p2.id from protocolli p2 where p2.cdr_code in :selectedCdrCodes) AND rp.id_destinatario in :selectedCdrCodes AND rp.tipo_destinatario = :tipoDestinatarioAssegnazione";
            if (idProtocolliVisibiliUtente != null) {
                if (idProtocolliVisibiliUtente.size() > 0) {

                    //NOTE: creare temp table
                    /**/
                    em.createNativeQuery("CREATE TEMP TABLE temp_protocolli_ids (id BIGINT) ON COMMIT DROP").executeUpdate();
                    Session session = em.unwrap(Session.class);
                    session.doWork(connection -> {
                        try {
                            PGConnection pgConnection = connection.unwrap(PGConnection.class);
                            CopyManager copyManager = pgConnection.getCopyAPI();

                            StringBuilder sb = new StringBuilder();
                            for (Long id : idProtocolliVisibiliUtente) {
                                sb.append(id).append("\n"); // riga per riga
                            }

                            InputStream inputStream = new ByteArrayInputStream(sb.toString().getBytes(StandardCharsets.UTF_8));

                            copyManager.copyIn("COPY temp_protocolli_ids(id) FROM STDIN", inputStream);
                        } catch (Exception e) {
                            throw new RuntimeException("Errore durante COPY", e);
                        }
                    });
                    whereClasues.append("( (p.cdr_code in :selectedCdrCodes AND p.id in (SELECT * from temp_protocolli_ids)) OR p.id in (").append(queryProtocolliAssegnatiUfficio).append(")) ");
                    /**/

                    //whereClasues.append("( (p.cdr_code in :selectedCdrCodes AND p.id in ("+StringUtils.join(idProtocolliVisibiliUtente, ",")+")) OR p.id in (").append(queryProtocolliAssegnatiUfficio).append(")) ");
                }
                else {
                    whereClasues.append("( p.id in (").append(queryProtocolliAssegnatiUfficio).append(")) ");
                }
            }
            else {
                whereClasues.append("(p.cdr_code in :selectedCdrCodes OR p.id in (").append(queryProtocolliAssegnatiUfficio).append(")) ");
            }
            params.put("tipoDestinatarioAssegnazione", TipoDestinatarioReferente.UFFICIO.getNome());
            params.put("selectedCdrCodes", cdrCodes);

            // si recuperano le pec dell'ufficio selezionato e le pec associate all'utente
            List<String> pecAddressesToUse = pecPeoService.getPecPeoQuery(
                    ssoManager.extractIdFromToken(),
                    TipologiaPosta.PEC.getTipologiaPosta(),
                    dto.getSelectedOffice());

            if(!pecAddressesToUse.isEmpty()) {
                String queryForIdPecEntrata = getProtocolliFromPecAddressesNative(pecAddressesToUse);
                whereClasues.append("OR p.id in ( ")
                        .append(queryForIdPecEntrata)
                        .append(") ");

                params.put("tipoEmailPEC", "PEC");
                params.put("emailDirectionEntrata", EmailDirection.ENTRATA.getDirection());
                for (int i = 0; i < pecAddressesToUse.size(); i++) {
                    params.put("pecAddress" + i, pecAddressesToUse.get(i).toLowerCase());
                }
            }

            whereClasues.append(") "); // [CHIUSURA AND] per consentire la corretta gestione dei filtri e search su tutta la query

            return buildGetProtocolliQueryNative(whereClasues.toString(), querySort.toString(), queryLimit.toString(), params);
        }

        // ==============
        // I MIEI COMPITI
        /*
            1. protocolli assegnati all'utente e non rifiutati
            2. protocolli assegnati all'ufficio se utente è protocollatore / archivista
            3. protocolli di cui si è richiesto l'annullamento se utente è admin
         */
        boolean mustIncludeRichiesteAnnullamento = ssoManager.isUtenteAdmin();

        whereClasues.append("and ");
        if (mustIncludeRichiesteAnnullamento) whereClasues.append(" (");
        whereClasues.append("p.id in (SELECT rp.id_protocollo from referenti_protocollo rp where (rp.id_destinatario = :authId and rp.assegnato = true) ");
        params.put("authId", datiUtenteSSO.auth_id);

        List<String> offices = ssoManager.extractOfficesByRoles(datiUtenteSSO);
        if (!offices.isEmpty()) {
            Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(dto.getSelectedOffice());
            if (cdrCodes.size() == 0) {
                log.error("[getProtocolliQuery] - Ufficio selezionato non inserito nei parametri di ricerca");
                CustomException.get(CustomException.ErrorCode.BAD_REQUEST,"Ufficio selezionato non inserito nei parametri di ricerca").boom();
            }
            if (offices.contains(dto.getSelectedOffice())) {
                whereClasues.append("or (rp.id_destinatario in :offices and rp.assegnato = true) ");
                params.put("offices", cdrCodes);
            }
        }
        whereClasues.append(") ");

        if (mustIncludeRichiesteAnnullamento) {
            whereClasues.append("or stato = :statoRichiestaAnnullamento) ");
            params.put("statoRichiestaAnnullamento", StatoProtocollo.RichiestaDiAnnullamento.getStato());
        }

        whereClasues.append("and p.id not in (SELECT id_protocollo from referenti_protocollo rp where rp.id_destinatario = :authId and rp.stato_protocollo = :statoProtocolloRifiutato) ");
        params.put("statoProtocolloRifiutato", StatoProtocollo.Rifiutato.getStato());
        return buildGetProtocolliQueryNative(whereClasues.toString(), querySort.toString(), queryLimit.toString(), params);
    }
    /**
     * Servizio che costruisce la query di ricerca per i protocolli e ritorna la lista
     * accetta i parametri passati dai filtri, ritornando una lista di protocolli
     * Il metodo ritorna una lista con tutti i protocolli o meno in base ai parametri valorizzati
     * @param ricercaProtocolliDTO - conterrà tutti i parametri in input che vengono dai filtri, incluse (ricerca globale, sort, paginazione)
     * @return
     */
    private PanacheQuery<Protocollo> getProtocolliQuery(RicercaProtocolliDTO ricercaProtocolliDTO){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        DatiUtenteSSO datiUtenteSSO = null;
        try{
            datiUtenteSSO = ssoManager.getDatiUtente();
        }catch(Exception e){
            log.error("[getProtocolliQuery] - Errore durante la chiamata ad SSO-Backend nel metodo getDatiUtente: [dettagli]: {}", e.getMessage());
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Si è verificato un errore nel recupero delle informazioni di autenticazione. Si consiglia di effettuare nuovamente l'accesso e riprovare.").boom();
        }

        // SORT
        Sort sortCriteria = SortInput.getSortOrDefault(ricercaProtocolliDTO.hasSort() ? ricercaProtocolliDTO.getSort() : ricercaProtocolliDTO.getDefaultSort());

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("id is not null ");

        if (ricercaProtocolliDTO.isEmpty() && !ricercaProtocolliDTO.hasSearch() && ricercaProtocolliDTO.isFiltroAll()) {
            return Protocollo.find(query.toString(),sortCriteria, params);
        }

        if (ricercaProtocolliDTO.hasCdr()) {
            query.append("and cdrCode in :cdrCode ");
            params.put("cdrCode", ssoManager.getRelatedCdrCodes(ricercaProtocolliDTO.getCdr()));
        }

        if(ricercaProtocolliDTO.hasSearch()){
            query.append("and (:search = '' ")
                    .append("or lower(nProtocollo) like LOWER(concat('%', :search, '%')) ")
                    //.append("or lower(stato) like LOWER(concat('%', REPLACE(:search, ' ', ''), '%')) ")
                    .append("or lower(mittente) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(destinatari) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(oggetto) like LOWER(concat('%', :search, '%')) ) ");
          params.put("search", ricercaProtocolliDTO.getSearch().trim());
        }

        if (ricercaProtocolliDTO.hasNumero()) {
          query.append("and lower(nProtocollo) like LOWER(concat('%', :nProtocollo, '%')) ");
          params.put("nProtocollo", ricercaProtocolliDTO.getNumero());
        }

        if (ricercaProtocolliDTO.hasNumeroEmergenza()){
            query.append("and LOWER(nProtocolloEmergenza) like LOWER(concat('%', :numeroEmergenza, '%')) ");
            params.put("numeroEmergenza", ricercaProtocolliDTO.getNumeroEmergenza());
        }

        if(ricercaProtocolliDTO.getAnno() != null){
          query.append("and extract(year from tsCreation) = :anno ");
          params.put("anno", ricercaProtocolliDTO.getAnno());
        }

        if (ricercaProtocolliDTO.hasOggetto()) {
          query.append("and lower(oggetto) like LOWER(concat('%', :oggetto, '%')) ");
          params.put("oggetto", ricercaProtocolliDTO.getOggetto().trim());
        }

        if (ricercaProtocolliDTO.hasStato()) {
            query.append("and stato in :statoList ");
            params.put("statoList", ricercaProtocolliDTO.getStato());
        }

        if (ricercaProtocolliDTO.hasTipoRegistrazione()) {
            query.append("and tipoRegistrazione in :tipoRegistrazioneList ");
            params.put("tipoRegistrazioneList", ricercaProtocolliDTO.getTipoRegistrazione());
        }

        if (ricercaProtocolliDTO.hasMetodoSpedizione()) {
            query.append("and metodoSpedizione in :metodoSpedizioneList ");
            params.put("metodoSpedizioneList", ricercaProtocolliDTO.getMetodoSpedizione());
        }

        if (ricercaProtocolliDTO.hasNote()) {
            query.append("and lower(note) like LOWER(concat('%', :note, '%')) ");
            params.put("note", ricercaProtocolliDTO.getNote().trim());
        }

        // aggiunta filtro per intervallo temporale
        if (ricercaProtocolliDTO.hasDataCreazioneIntervallo()) {
            query.append("and tsCreation BETWEEN :dataCreazioneFrom AND :dataCreazioneTo ");
            params.put("dataCreazioneFrom", ricercaProtocolliDTO.getDataCreazioneFrom());
            params.put("dataCreazioneTo", ricercaProtocolliDTO.getDataCreazioneTo());
        }
        else if (ricercaProtocolliDTO.getDataCreazioneFrom() != null) {
            query.append("and tsCreation >= :dataCreazioneFrom ");
            params.put("dataCreazioneFrom", ricercaProtocolliDTO.getDataCreazioneFrom());
        }
        else if (ricercaProtocolliDTO.getDataCreazioneTo() != null) {
            query.append("and tsCreation <= :dataCreazioneTo ");
            params.put("dataCreazioneTo", ricercaProtocolliDTO.getDataCreazioneTo());
        }
        //filtro per intervallo data emergenza
        if (ricercaProtocolliDTO.hasDataCreazioneEmergenzaIntervallo()) {
            query.append("and dataProtocolloEmergenza BETWEEN :dataCreazioneEmergenzaFrom AND :dataCreazioneEmergenzaTo ");
            params.put("dataCreazioneEmergenzaFrom", ricercaProtocolliDTO.getDataCreazioneEmergenzaFrom());
            params.put("dataCreazioneEmergenzaTo", ricercaProtocolliDTO.getDataCreazioneEmergenzaTo());
        }
        else if (ricercaProtocolliDTO.getDataCreazioneEmergenzaFrom() != null) {
            query.append("and dataProtocolloEmergenza >= :dataCreazioneEmergenzaFrom ");
            params.put("dataCreazioneEmergenzaFrom", ricercaProtocolliDTO.getDataCreazioneEmergenzaFrom());
        }
        else if (ricercaProtocolliDTO.getDataCreazioneEmergenzaTo() != null) {
            query.append("and dataProtocolloEmergenza <= :dataCreazioneEmergenzaTo ");
            params.put("dataCreazioneEmergenzaTo", ricercaProtocolliDTO.getDataCreazioneEmergenzaTo());
        }

        if (ricercaProtocolliDTO.hasMittente()) {
            query.append("and lower(mittente) like LOWER(concat('%', :mittente, '%')) ");
            params.put("mittente", ricercaProtocolliDTO.getMittente().trim());
        }

        if (ricercaProtocolliDTO.hasAssegnatari()) {
            query.append("and lower(assegnatari) like LOWER(concat('%', :assegnatari, '%')) ");
            params.put("assegnatari", ricercaProtocolliDTO.getAssegnatari().trim());
        }

        if (ricercaProtocolliDTO.isRicercaAvanzata() && ricercaProtocolliDTO.hasDestinatari()) {
            query.append("and lower(destinatari) like LOWER(concat('%', :destinatari, '%')) ");
            params.put("destinatari", ricercaProtocolliDTO.getDestinatari().trim());
        }

        if (ricercaProtocolliDTO.isRicercaAvanzata() && ricercaProtocolliDTO.hasLagList()) {
            appendDestinatariCondition(query, params, ricercaProtocolliDTO.getTagList());
        }

        if (ricercaProtocolliDTO.hasNomeTitolario()) {
            Set<Long> filteredIdTitolario = titolarioService.getAllTitolarioByName(ricercaProtocolliDTO.getNomeTitolario());
            if (filteredIdTitolario.isEmpty()) {
                query.append("and 1 = 0 ");
            } else {
                query.append("and id in ( " +
                        "select pc.protocollo.id from ProtocolliClassificazione pc " +
                        "where pc.idTitolario in :idTitolarioList) ");
                params.put("idTitolarioList", filteredIdTitolario);
            }
        }

        // ==============
        //admin e filtro all -> non si filtra ulteriormente
        if (ricercaProtocolliDTO.isFiltroAll() && ssoManager.isUtenteAdmin()) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            log.info("[getProtocolliQuery] - Params = {}", params);
            return Protocollo.find(query.toString(), sortCriteria, params);
        }

        // ==============
        // IL MIO UFFICIO
        /*
            1. protocolli creati dall'ufficio che sono nel titolario accessibile all'utente
            2. protocolli in entrata pec che hanno come destinatario TO e CC una delle pec dell'ufficio
            3. protocolli assegnati all'ufficio
         */
        if (ricercaProtocolliDTO.isFiltroUfficio()) {
            
            // [APERTURA AND] per consentire la corretta gestione dei filtri e search su tutta la query
            query.append("AND (");

            Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(ricercaProtocolliDTO.getSelectedOffice());
            if (cdrCodes.size() == 0) {
                log.error("[getProtocolliQuery] - Ufficio selezionato non inserito nei parametri di ricerca");
                CustomException.get(CustomException.ErrorCode.BAD_REQUEST,"Ufficio selezionato non inserito nei parametri di ricerca").boom();
            }

            /*
             *  Se utente NON è admin, si filtra la lista per i protocolli:
             *  1) classificati in fascicoli per cui l'utente ha la visibilità
             *  2) quelli non classificati
             */
            Set<Long> idProtocolliVisibiliUtente = null;
            if(!ssoManager.isUtenteAdmin()) {
                List<Long> allTitolarioAccessibileIdList = titolarioService.getAllVisibleTitolarioIdByUserAndCdrCode(ricercaProtocolliDTO.getSelectedOffice());
                Long[] allTitolarioAccessibileArray = allTitolarioAccessibileIdList.toArray(new Long[0]);
                List<Long> idProtocolliClassificati = getAllProtocolliClassificatiByCdrCodeAndVisibility(allTitolarioAccessibileArray, cdrCodes);
                idProtocolliVisibiliUtente = new HashSet<>(idProtocolliClassificati);
            }

            String queryProtocolliAssegnatiUfficio = "SELECT DISTINCT rp.idProtocollo FROM ReferentiProtocollo rp WHERE rp.idProtocollo NOT IN (SELECT p.id from Protocollo p where p.cdrCode in :selectedCdrCodes) AND rp.idDestinatario in :selectedCdrCodes AND rp.tipoDestinatario = :tipoDestinatarioAssegnazione";
            if (idProtocolliVisibiliUtente != null) {
                if (idProtocolliVisibiliUtente.size() > 0) {
                    query.append("( (cdrCode in :selectedCdrCodes AND id in ("+StringUtils.join(idProtocolliVisibiliUtente, ",")+")) OR id in (").append(queryProtocolliAssegnatiUfficio).append(")) ");
                }
                else {
                    query.append("( id in (").append(queryProtocolliAssegnatiUfficio).append(")) ");
                }
            }
            else {
                query.append("(cdrCode in :selectedCdrCodes OR id in (").append(queryProtocolliAssegnatiUfficio).append(")) ");
            }
            params.put("tipoDestinatarioAssegnazione", TipoDestinatarioReferente.UFFICIO.getNome());
            params.put("selectedCdrCodes", cdrCodes);

            // si recuperano le pec dell'ufficio selezionato e le pec associate all'utente
            List<String> pecAddressesToUse = pecPeoService.getPecPeoQuery(
                    ssoManager.extractIdFromToken(),
                    TipologiaPosta.PEC.getTipologiaPosta(),
                    ricercaProtocolliDTO.getSelectedOffice());

            if(!pecAddressesToUse.isEmpty()) {
                String queryForIdPecEntrata = getProtocolliFromPecAddresses(pecAddressesToUse);
                query.append("OR id in ( ")
                        .append(queryForIdPecEntrata)
                        .append(") ");

                params.put("tipoEmailPEC", "PEC");
                params.put("emailDirectionEntrata", EmailDirection.ENTRATA);
                for (int i = 0; i < pecAddressesToUse.size(); i++) {
                    params.put("pecAddress" + i, pecAddressesToUse.get(i).toLowerCase());
                }
            }

            query.append(") "); // [CHIUSURA AND] per consentire la corretta gestione dei filtri e search su tutta la query

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            log.info("[getProtocolliQuery] - Params = {}", params);
            return Protocollo.find(query.toString(), sortCriteria, params);
        }

        // ==============
        // I MIEI COMPITI
        /*
            1. protocolli assegnati all'utente e non rifiutati
            2. protocolli assegnati all'ufficio se utente è protocollatore / archivista
            3. protocolli di cui si è richiesto l'annullamento se utente è admin
         */
        boolean mustIncludeRichiesteAnnullamento = ssoManager.isUtenteAdmin();

        query.append("and ");
        if (mustIncludeRichiesteAnnullamento) query.append(" (");
        query.append("id in (SELECT idProtocollo from ReferentiProtocollo where (idDestinatario = :authId and isAssegnato) ");
        params.put("authId", datiUtenteSSO.auth_id);

        List<String> offices = ssoManager.extractOfficesByRoles(datiUtenteSSO);
        if (!offices.isEmpty()) {
            Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(ricercaProtocolliDTO.getSelectedOffice());
            if (cdrCodes.size() == 0) {
                log.error("[getProtocolliQuery] - Ufficio selezionato non inserito nei parametri di ricerca");
                CustomException.get(CustomException.ErrorCode.BAD_REQUEST,"Ufficio selezionato non inserito nei parametri di ricerca").boom();
            }
            if (offices.contains(ricercaProtocolliDTO.getSelectedOffice())) {
                query.append("or (idDestinatario in :offices and isAssegnato) ");
                params.put("offices", cdrCodes);
            }
        }
        query.append(") ");

        if (mustIncludeRichiesteAnnullamento) {
            query.append("or stato = :statoRichiestaAnnullamento) ");
            params.put("statoRichiestaAnnullamento", StatoProtocollo.RichiestaDiAnnullamento);
        }

        query.append("and id not in (SELECT idProtocollo from ReferentiProtocollo where idDestinatario = :authId and statoProtocollo = :statoProtocolloRifiutato) ");
        params.put("statoProtocolloRifiutato", StatoProtocollo.Rifiutato);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        log.info("[getProtocolliQuery] - Params = {}", params);
        return Protocollo.find(query.toString(), sortCriteria, params);
    }

    @Transactional
    @ExceptionChecked
    public Protocollo saveProtocollo(ProtocolloInput protocolloInput) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        log.info("Salvataggio di un nuovo protocollo di tipo: {} - da parte dell'utente: {} - dall'ufficio: {}",
                protocolloInput.tipoRegistrazione,
                ssoManager.extractNameFromToken(),
                protocolloInput.cdr);

        Protocollo protocollo;
        try {
            protocollo = mapper.toEntity(protocolloInput);
            protocollo.setIdUtente(ssoManager.extractIdFromToken());
            protocollo.setIdUtenteLastOperation(ssoManager.extractIdFromToken());
            protocollo.setUtente(ssoManager.extractNameFromToken());
            protocollo.setTsCreation(Calendar.getInstance().getTime());
            protocollo.setTsStartVali(Calendar.getInstance().getTime());

            if(protocolloInput.getMittente() != null){
                MittenteProtocolloInput mittente = protocolloInput.getMittente();
                boolean isIpa = mittente.isIpa != null ? mittente.isIpa : false;
                if(isIpa){
                    protocollo.setIdMittente(maptoAnagrafica(mittente.tipologiaIpa, mittente.codAmm, mittente.codAoo, mittente.codUniOu).getId().toString());
                    protocollo.setMittente(mittente.descMittente);
                }
            }
            if (protocollo.getIdMittente() == null || protocollo.getIdMittente().isEmpty()) {
                throw new RuntimeException("Il mittente è obbligatorio per il salvataggio di un protocollo");
            }
            
            /*
            - lo stato di un protocollo in uscita è “completato” se non ci sono assegnatari
            - lo stato di una circolare/protocollo con soli tag è “completato” se non ci sono assegnatari
            */
            if((protocolloInput.getTagList() != null && !protocolloInput.getTagList().isEmpty()) ||
                    TipoRegistrazione.Uscita.toString().equalsIgnoreCase(protocollo.getTipoRegistrazione().toString())) {
                protocollo.setStato(StatoProtocollo.Completato);
            }else {
                boolean inCorso = Optional.ofNullable(protocolloInput.getReferenti())
                        .orElse(Collections.emptyList())
                        .stream()
                        .anyMatch(referente -> Boolean.TRUE.equals(referente.getIsAssegnato()));

                protocollo.setStato(inCorso ? StatoProtocollo.InCorso : StatoProtocollo.DaAssegnare);

            }


            String numeroProtocollo = TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione())
                    ? numeroProtocolloCircolareService.generateDistribuitedNumeroCircolare()
                    : numeroProtocolloCircolareService.generateDistribuitedNumeroProtocollo();

            protocollo.setNProtocollo(numeroProtocollo);
            log.info(LogUtils.GENERAZIONE_NUM_PROTOCOLLO_FORMAT,protocollo.getNProtocollo());

            for(Allegato allegato : protocollo.getAllegati()){
                String nomeAllegatoConNProtocollo = getNomeAllegatoConProtocollo(allegato.getNome(), protocollo.getNProtocollo());
                em.createNamedQuery("updateNameAllegatoById")
                        .setParameter("nome", nomeAllegatoConNProtocollo)
                        .setParameter("idAllegato", allegato.getId())
                        .executeUpdate();
                allegato.setNome(nomeAllegatoConNProtocollo);
            }

            for (AllegatoInput input : protocolloInput.getAllegati()) {
                String filigrana = String.format(ProtocolloUtils.formatoFiligrana,
                        protocollo.getNProtocollo(),
                        Utils.fromDateToString(protocollo.getTsCreation(), Utils.DateFormat.DMY_HM),
                        protocollo.getTipoRegistrazione().toString().toUpperCase());
                documentService.saveDocumentTimbrato(input.getIdAllegato(), filigrana, input.getPosition(), protocollo.getNProtocollo());
            }

            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
            Titolario fascicolo = Titolario.findById(protocolloInput.idTitolario.get(0));

            SegnaturaInput segnaturaInput = new SegnaturaInput();
            segnaturaInput.setDenominazioneMittente(configurazioneService.getDenominazioneAmministrazione(configurazioniGlobali));
            segnaturaInput.setCfMittente(configurazioneService.getCfAmministrazione(configurazioniGlobali));
            segnaturaInput.setCodiceIpaMittente(configurazioneService.getCodiceIpa(configurazioniGlobali));
            segnaturaInput.setCodiceAooMittente(configurazioneService.getCodiceAoo(configurazioniGlobali));

            segnaturaInput.setNumeroRegistrazione(protocollo.getNumeroProgressivoForSignature());
            segnaturaInput.setDataRegistrazione(protocollo.getTsCreationFormatted());
            segnaturaInput.setOggetto(protocollo.getOggetto());

            String hierarchyString = titolarioService.buildHierarchyString(titolarioService.getHierarchyForTitolarioId(fascicolo.getId()).getTitolario());
            segnaturaInput.setFascicoloNome(fascicolo.getNome());
            segnaturaInput.setFascicoloCodiceFlat(hierarchyString);

            for (AllegatoInput input : protocolloInput.getAllegati()) {
                if (!input.isMain()) continue;

                String nomeAllegatoConNProtocollo = getNomeAllegatoConProtocollo(input.getNome(), protocollo.getNProtocollo());

                segnaturaInput.setNomeAllegato(nomeAllegatoConNProtocollo);
                segnaturaInput.setMimeTypeAllegato("none");
                AttachmentContentType attachmentContentType = attachmentContentTypeService.findByExtension(input.getEstensione());
                if (attachmentContentType != null) {
                    segnaturaInput.setMimeTypeAllegato(attachmentContentType.getType());
                }

                for(Allegato a : protocollo.getAllegati()) {
                    if (a.getId().equals(input.getIdAllegato())) {
                        segnaturaInput.setImprontaBytes(a.getImpronta().getBytes());
                        break;
                    }
                }
            }

            boolean isDestinatariTag = protocolloInput.getTagList() != null && !protocolloInput.getTagList().isEmpty();
            if(isDestinatariTag){
                for(Tag tag : protocolloInput.getTagList()){
                    SegnaturaDestinatarioInput dest = new SegnaturaDestinatarioInput();
                    dest.tipoDestinatario = "tag";
                    dest.isConoscenza = true;
                    dest.denominazione = tag.getNome();
                    segnaturaInput.getDestinatari().add(dest);
                }
            }

            if(protocolloInput.getReferenti() != null && (!protocolloInput.getReferenti().isEmpty()) ) {
                for (ReferenteProtocolloInput input : protocolloInput.getReferenti()) {
                    SegnaturaDestinatarioInput dest = new SegnaturaDestinatarioInput();
                    dest.tipoDestinatario = input.tipoDestinatario;
                    boolean isIpa = input.isIpa != null ? input.isIpa : false;
                    dest.isConoscenza = Boolean.FALSE.equals(input.getIsAssegnato());

                    if (TipoDestinatarioReferente.UTENTE.toString().equalsIgnoreCase(input.getTipoDestinatario())) {
                        DatiUtenteSSO recipientNotifica = ssoManager.getUserByAuthId(input.idAssegnatario, Integer.valueOf(configurazioneService.getApplicationId(configurazioniGlobali)));
                        dest.tipoDestinatario = "utente";
                        dest.nome = recipientNotifica.firstName;
                        dest.cognome = recipientNotifica.lastName;
                    } else if (TipoDestinatarioReferente.UFFICIO.toString().equalsIgnoreCase(input.getTipoDestinatario())) {
                        dest.tipoDestinatario = "ufficio";
                        dest.denominazione = input.nomeAssegnatario;
                    } else {
                        dest.denominazione = input.nomeAssegnatario;
                    }
                    segnaturaInput.getDestinatari().add(dest);
                }
            }

            Allegato allegato = allegatoService.saveAllegati(buildSignatureXML("Segnatura " + protocollo.getNProtocollo(), segnaturaInput));
            protocollo.getAllegati().add(allegato);
            protocollo.persist();

            for(Long idTitolario : protocolloInput.idTitolario) {
               Titolario titolario = Titolario.findById(idTitolario);
                if(Boolean.FALSE.equals(titolario.getLeaf())){
                    throw new IllegalArgumentException(String.format("Non è possibile inserire il Protocollo/Circolare all'interno del fascicolo %s", titolario.getNome()));
                }
                ProtocolliClassificazione.builder()
                        .protocollo(protocollo)
                        .idTitolario(idTitolario)
                        .tsCreation(Calendar.getInstance().getTime())
                        .idUtenteLastOperation(ssoManager.extractIdFromToken())
                        .build()
                        .persistAndFlush();
            }

            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), StoricoOperazione.CreazioneProtocollo.getStatoParameter(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()) ? "Circolare" : "Protocollo"), protocolloInput.getNote());

            // Lista che conterrà tutti gli id delle notifiche da inviare
            List<Long> notificheToSendList = new ArrayList<>();

            if(isDestinatariTag){
                StringBuilder destinatariProtocollo = new StringBuilder();
                for(Tag tag : protocolloInput.getTagList()){
                    ReferentiProtocollo.builder()
                            .idProtocollo(protocollo.getId())
                            .idMittente(protocollo.getIdUtente())
                            .nomeMittente(protocollo.getUtente())
                            .idDestinatario(tag.getId().toString())
                            .nomeDestinatario(tag.getNome())
                            .tipoDestinatario("tag")
                            .isAssegnato(false)
                            .creationOption(true)
                            .statoProtocollo(StatoProtocollo.DaAssegnare)
                            .tsCreation(Calendar.getInstance().getTime())
                            .tsStartVali(Calendar.getInstance().getTime())
                            .tsStatoProtocollo(Calendar.getInstance().getTime())
                            .build()
                            .persist();

                    destinatariProtocollo.append(tag.getNome()).append(", ");
                }

                protocollo.setDestinatari(destinatariProtocollo.length() > 2 ? destinatariProtocollo.substring(0, destinatariProtocollo.length() - 2) : "");
            }

            if(protocolloInput.getReferenti() != null && (!protocolloInput.getReferenti().isEmpty()) ){
                String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
                String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
                PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();

                // Set<String> listRecipientNotifica = new HashSet<>();
                Map<DatiUtenteSlimSSO,String> listRecipientNotifica = new HashMap<>();
                Map<Office, String> listRecipientCdrNotifica = new HashMap<>();

                for(ReferenteProtocolloInput input : protocolloInput.getReferenti()) {
                    String anagraficaId = "";
                    boolean isIpa = input.isIpa != null ? input.isIpa : false;

                    // Se idAssegnatario è null si tratta di risposta con protocollo, cerco l'anagrafica per nome
                    if(input.idAssegnatario == null) {
                        RicercaAnagraficaDTO dto = new RicercaAnagraficaDTO();
                        dto.setSize(1);
                        dto.setPage(0);
                        dto.setSearch(input.nomeAssegnatario);

                        Anagrafica destinatario = Anagrafica.buildAnagraficaFromPec(input.nomeAssegnatario, "Creato da risposta via PEC");
                        String impronta = anagraficaService.generateImpronta(destinatario);
                        Anagrafica anagraficaTrovata = anagraficaService.getContattoEsistenteConCampiUnivoci(impronta);

                        // Caso 1: Contatto presente in anagrafica
                        if (anagraficaTrovata != null) {
                            if(anagraficaTrovata.isCancellato()) {
                                anagraficaTrovata.setCancellato(false);
                                anagraficaTrovata.setCertificato(false);
                            }

                            anagraficaTrovata.persistAndFlush();
                            anagraficaId = anagraficaTrovata.getId().toString();
                        }
                        // Caso 2: contatto non presente in anagrafica
                        else{
                            // salvo il contatto
                            destinatario.setImpronta(impronta);
                            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                            anagraficaService.save(destinatario);

                            anagraficaId = destinatario.getId().toString();
                        }
                    } else {
                        // Se l'idAssegnatario è presente, lo uso direttamente
                        anagraficaId = input.getIdAssegnatario();
                    }

                    // Se isIpa è true, recupero l'anagrafica con i parametri IPA
                    if(isIpa) {
                        anagraficaId = maptoAnagrafica(input.tipologiaIpa, input.codAmm, input.codAoo, input.codUniOu).getId().toString();
                    }

                    // Si imposta lo stato dell'assegnazione solo in caso di utente per competenza
                    StatoProtocollo statoAssegnazione = null;
                    if (TipoDestinatarioReferente.UTENTE.toString().equalsIgnoreCase(input.getTipoDestinatario())) {
                        statoAssegnazione = Boolean.TRUE.equals(input.getIsAssegnato())
                                ? StatoProtocollo.DaPrendereInCarico
                                : null;
                    }else{
                        statoAssegnazione = StatoProtocollo.Assegnato;
                    }

                    ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                            .idProtocollo(protocollo.getId())
                            .idMittente(protocollo.getIdUtente())
                            .nomeMittente(protocollo.getUtente())
                            .idDestinatario(anagraficaId)
                            .nomeDestinatario(input.getNomeAssegnatario())
                            .attribuzione(input.getAttribuzione())
                            .tipoDestinatario(input.getTipoDestinatario())
                            .isAssegnato(input.getIsAssegnato())
                            .creationOption(true)
                            .statoProtocollo(statoAssegnazione)
                            .tsCreation(Calendar.getInstance().getTime())
                            .tsStartVali(Calendar.getInstance().getTime())
                            .tsStatoProtocollo(Calendar.getInstance().getTime())
                            .ufficioLavorazione(input.getCdrAssegnatario())
                            .build();

                    if (Boolean.TRUE.equals(input.getIsAssegnato())) {

                        String storicoOperazione = StoricoOperazione.AssegnazioneProtocollo
                                .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                                .concat(referentiProtocollo.getNomeDestinatario())
                                .concat(referentiProtocollo.getUfficioLavorazione() != null ? " " + referentiProtocollo.getUfficioLavorazione() : "")
                                .concat(".");

                        storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), storicoOperazione, null);
                    }

                    referentiProtocollo.persist();

                    if (peoInvioNotifica == null)
                        continue;

                    Ufficio ufficioCreatore = ufficioService.findByCdrCode(protocolloInput.cdrCode);

                    // Non invio la notifica se l'ufficio destinatario coincide con l'ufficio creatore
                    if(input.isAssegnato && input.tipoDestinatario.equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome()) && input.idAssegnatario.equals(ufficioCreatore.getCdrCode()))
                        continue;

                    // utente o ufficio interno assegnatario di un protocollo -> invio mail di notifica
                    if (input.isAssegnato && (input.tipoDestinatario.equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome()) || input.tipoDestinatario.equalsIgnoreCase(TipoDestinatarioReferente.UTENTE.getNome()))) {

                        if (input.tipoDestinatario.equalsIgnoreCase(TipoDestinatarioReferente.UTENTE.getNome())) {
                            DatiUtenteSSO recipientNotifica = ssoManager.getUserByAuthId(input.idAssegnatario, Integer.valueOf(applicationId));
                            if (recipientNotifica.email != null) {
                                listRecipientNotifica.putIfAbsent(DatiUtenteSlimSSO.mapFromDatiUtenteSSO(recipientNotifica), referentiProtocollo.getAttribuzione());
                            }
                        }
                        else {
                            /*
                            //NOTA: inibire invio notifica ai protocollatori / archivisti dell'ufficio
                            List<String> rolesToFilter = List.of("protocollatore", "archivista");
                            // ufficio -> devo notificare tutti i protocollatori e archivisti dell'ufficio
                            List<DatiUtenteSlimSSO> utentiInUfficio = ssoManager.getUsersByCdrCode(applicationId, referentiProtocollo.getIdDestinatario());
                            for(DatiUtenteSlimSSO utenteInUfficio : utentiInUfficio) {
                                List<String> offices = ssoManager.extractOfficesByRoles(utenteInUfficio, rolesToFilter);
                                if (offices.contains(input.idAssegnatario) && utenteInUfficio.email != null) {
                                    listRecipientNotifica.putIfAbsent(utenteInUfficio, referentiProtocollo.getAttribuzione());
                                }
                            }
                             */
                            try {
                                List<PecPeo> listCdrPeo = em.createNamedQuery("findAllPecPeoByCdr", PecPeo.class)
                                        .setParameter("cdrCode", input.idAssegnatario)
                                        .getResultList();
                                for(PecPeo cdrPeo : listCdrPeo) {
                                    if (cdrPeo.isAttiva() && cdrPeo.getConfigurazione().getTipologiaPosta().isPeo() && cdrPeo.getIdUtente() == null) {
                                        Office cdrForNotifica = new Office();
                                        cdrForNotifica.code = input.idAssegnatario;
                                        cdrForNotifica.description = cdrPeo.getIndirizzoEmail(); //NOTA: usiamo il campo description per memorizzare la peo dell'ufficio
                                        cdrForNotifica.name = input.nomeAssegnatario;
                                        listRecipientCdrNotifica.putIfAbsent(cdrForNotifica, referentiProtocollo.getAttribuzione());
                                    }
                                }
                            }
                            catch (Exception ignored) {}
                        }
                    }
                }

                EmailTemplate template = emailTemplateService.getTemplate(Operazione.assegnazione, "notifica");
                if ((!listRecipientNotifica.isEmpty()) || (!listRecipientCdrNotifica.isEmpty()) && template != null && peoInvioNotifica != null) {
                    log.info(LOG_PEO_NOTIFICA, peoInvioNotifica.getIndirizzoEmail());

                    for(Map.Entry<DatiUtenteSlimSSO, String> entry : listRecipientNotifica.entrySet()) {
                        DatiUtenteSlimSSO recipientSSO = entry.getKey();
                        String obiettivoLavorazione = entry.getValue().equalsIgnoreCase("competenza") ? "Assegnazione per competenza" : "Assegnazione per conoscenza";

                        String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                        String sbCorpoEmailNotifica = template.getCorpo()
                                .replace("{{headerCorpo}}", oggettoEmailNotifica)
                                .replace("{{cognomeUtenteTO}}", recipientSSO.lastName)
                                .replace("{{nomeUtenteTO}}", recipientSSO.firstName)
                                .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                                .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                                .replace("{{numero}}", protocollo.getNProtocollo())
                                .replace("{{oggetto}}", protocollo.getOggetto())
                                .replace("{{obiettivoLavorazione}}",  obiettivoLavorazione)
                                .replace("{{noteAssegnazione}}", "-")
                                .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                        Long idNotifica = notificaService.newNotifica(
                                protocollo.getId(), peoInvioNotifica.getIndirizzoEmail(),
                                recipientSSO.email,
                                oggettoEmailNotifica,
                                sbCorpoEmailNotifica,
                                Operazione.assegnazione.toString());

                        if (idNotifica != null) {
                            notificheToSendList.add(idNotifica);
                        }
                    }
                    for(Map.Entry<Office, String> entry : listRecipientCdrNotifica.entrySet()) {
                        Office recipientSSO = entry.getKey();
                        String obiettivoLavorazione = entry.getValue().equalsIgnoreCase("competenza") ? "Assegnazione per competenza" : "Assegnazione per conoscenza";

                        String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                        String sbCorpoEmailNotifica = template.getCorpo()
                                .replace("{{headerCorpo}}", oggettoEmailNotifica)
                                .replace("{{cognomeUtenteTO}}", "("+recipientSSO.code+")")
                                .replace("{{nomeUtenteTO}}", recipientSSO.name)
                                .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                                .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                                .replace("{{numero}}", protocollo.getNProtocollo())
                                .replace("{{oggetto}}", protocollo.getOggetto())
                                .replace("{{obiettivoLavorazione}}",  obiettivoLavorazione)
                                .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                        Long idNotifica = notificaService.newNotifica(
                                protocollo.getId(), peoInvioNotifica.getIndirizzoEmail(),
                                recipientSSO.description, //NOTA: usiamo il campo description per memorizzare la peo dell'ufficio
                                oggettoEmailNotifica,
                                sbCorpoEmailNotifica,
                                Operazione.assegnazione.toString());

                        if (idNotifica != null) {
                            notificheToSendList.add(idNotifica);
                        }
                    }
                }else{
                    StringBuilder errorSb = new StringBuilder("[Attenzione] - Problematica durante la preparazione delle notifiche peo ")
                            .append("in fase di: [%s] - ")
                            .append("del protocollo: [%s] -")
                            .append("Template: %s - " )
                            .append("peoInvioNotifica: %s - ");

                    String fullMessage = String.format(
                            errorSb.toString(),
                            "saveProtocollo",
                            protocollo.getId(),
                            template == null ? "null" : template.getId(),
                            peoInvioNotifica == null ? "null" : peoInvioNotifica.getIndirizzoEmail());

                    log.error(fullMessage);
                }
            }

            List<Long> idEmails = new ArrayList<>();
            if(!isDestinatariTag){
                if (protocollo.getTipoRegistrazione().equals(TipoRegistrazione.Uscita)
                        && (protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Pec)
                        || protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Email))) {


                    Map<String, Boolean> setIDReferenteSendToPeo = new HashMap<>();
                    for(ReferenteProtocolloInput referente : protocolloInput.referenti) {
                        setIDReferenteSendToPeo.put(referente.idAssegnatario, referente.usePeoForSendEmail);
                    }

                    // TODO Gestire la dimensione della mail
                    idEmails = emailService.saveRecordEmail(protocollo, "Sì", setIDReferenteSendToPeo);
                }
            }

            // si inviano in blocco tutte le notifiche ed email per garantire il contesto delle transactions
            if(!idEmails.isEmpty()){
                sendEmailClient.sendEmails(idEmails);
            }

            if(!notificheToSendList.isEmpty()){
                sendNotificaClient.sendNotifiche(notificheToSendList);
            }

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException("Si è verificato un errore durante la creazione del protocollo: " + ExceptionUtils.getRootCauseMessage(e), e);
        }

        return protocollo;
    }

    @Transactional
    @ExceptionChecked
    public boolean updateNoteProtocollo(ProtocolloUpdateInput updateInput) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Protocollo protocollo = getProtocolloByNumero(updateInput.nProtocollo);
        boolean isCircolare = TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione());
        parameter = isCircolare ? "Circolare" : "Protocollo";

        if (updateInput.getNote() != null && updateInput.getNote().length() > 255) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.BAD_REQUEST, "La lunghezza massima delle note di protocollo è di 255 caratteri").boom();
            return false;
        }

        String oldNote = protocollo.getNote();
        protocollo.setNote(updateInput.getNote());

        if (Objects.equals(protocollo.getNote(), oldNote)) {
            return true;
        }

        String storicoOperazione;
        if((protocollo.getNote() == null || protocollo.getNote().isEmpty()) && (oldNote != null && !oldNote.isEmpty())) {
            storicoOperazione = "ha rimosso le note del Protocollo";
        } else {
            storicoOperazione = "ha aggiornato la sezione note del Protocollo";
        }
        aggiuntaStorico(protocollo, storicoOperazione, protocollo.getNote());

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    @Transactional
    @ExceptionChecked
    public Protocollo updateProtocollo(ProtocolloUpdateInput updateInput) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Protocollo protocollo = getProtocolloByNumero(updateInput.nProtocollo);
        boolean isCircolare = TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione());
        parameter = isCircolare ? "Circolare" : "Protocollo";

        log.info("Aggiornamento {} con id: {} - da parte dell'utente: {}", parameter, protocollo.getId(), ssoManager.extractNameFromToken());

        this.updateFascicolazioneProtocollo(protocollo.getId(), updateInput.idTitolario, updateInput.cdrCode);

        String oldNote = protocollo.getNote();
        String oldNProtocolloCircolare = protocollo.getNProtocolloCircolare();
        int oldSizeAllegati = protocollo.getAllegati().size();
        Allegato oldAllegatoPrincipale = protocollo.getAllegati().stream()
                .filter(Allegato::getIsMain)
                .findFirst()
                .orElse(null);
        try {
            protocollo.setNote(updateInput.getNote());
            protocollo.setNProtocolloCircolare(updateInput.getNProtocolloCircolare());

            List<AllegatoInput> allegatiDaTimbrare = new ArrayList<>();

            //si aggiungono gli allegati nuovi ed eventualmente si aggiornano i dati modificati (doc principale, descrizione e collocazione)
            for(AllegatoInput input : updateInput.getAllegati()){
                input.setNome(getNomeAllegatoConProtocollo(input.getNome(), protocollo.getNProtocollo()));
                Allegato allegato = allegatoService.updateAllegato(input);
                if (protocollo.addAllegato(allegato)) {
                    allegatiDaTimbrare.add(input);
                }
            }

            //NOTA: si timbrano soltanto i nuovi allegati che sono stati effettivamente aggiunti
            String filigrana = String.format(ProtocolloUtils.formatoFiligrana,
                    (protocollo.getNProtocolloEmergenza() != null && !protocollo.getNProtocolloEmergenza().isEmpty()) ? protocollo.getNProtocolloEmergenza() + " - " +protocollo.getNProtocollo() : protocollo.getNProtocollo(),
                    Utils.fromDateToString(protocollo.getTsCreation(), Utils.DateFormat.DMY_HM),
                    protocollo.getTipoRegistrazione().toString().toUpperCase());

            for (AllegatoInput allegatoDaTimbrare : allegatiDaTimbrare) {
                allegatoDaTimbrare.setNome(getNomeAllegatoConProtocollo(allegatoDaTimbrare.getNome(), protocollo.getNProtocollo()));
                documentService.saveDocumentTimbrato(allegatoDaTimbrare.getIdAllegato(), filigrana, allegatoDaTimbrare.getPosition(), protocollo.getNProtocollo());
            }

            AllegatoInput newAllegatoPrincipale = updateInput.getAllegati().stream()
                    .filter(AllegatoInput::isMain)
                    .findFirst()
                    .orElse(null);

            boolean isNuovaSegnatura = false;
            boolean isModificaDocPrincipale = false;
            if(newAllegatoPrincipale != null && oldAllegatoPrincipale != null && (!Objects.equals(newAllegatoPrincipale.getIdAllegato(), oldAllegatoPrincipale.getId()))) {
                isModificaDocPrincipale = true;
                isNuovaSegnatura = allegatoService.renameSegnaturaNonValida(protocollo);

                List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
                Titolario fascicolo = Titolario.findById(protocollo.getProtocolliClassificazioneList().get(0).getIdTitolario());

                SegnaturaInput segnaturaInput = new SegnaturaInput();
                segnaturaInput.setDenominazioneMittente(configurazioneService.getDenominazioneAmministrazione(configurazioniGlobali));
                segnaturaInput.setCfMittente(configurazioneService.getCfAmministrazione(configurazioniGlobali));
                segnaturaInput.setCodiceIpaMittente(configurazioneService.getCodiceIpa(configurazioniGlobali));
                segnaturaInput.setCodiceAooMittente(configurazioneService.getCodiceAoo(configurazioniGlobali));

                segnaturaInput.setNumeroRegistrazione(protocollo.getNumeroProgressivoForSignature());
                segnaturaInput.setDataRegistrazione(protocollo.getTsCreationFormatted());
                segnaturaInput.setOggetto(protocollo.getOggetto());

                String hierarchyString = titolarioService.buildHierarchyString(titolarioService.getHierarchyForTitolarioId(fascicolo.getId()).getTitolario());
                segnaturaInput.setFascicoloNome(fascicolo.getNome());
                segnaturaInput.setFascicoloCodiceFlat(hierarchyString);


                String nomeAllegatoConNProtocollo = getNomeAllegatoConProtocollo(newAllegatoPrincipale.getNome(), protocollo.getNProtocollo());
                segnaturaInput.setNomeAllegato(nomeAllegatoConNProtocollo);
                segnaturaInput.setMimeTypeAllegato("none");
                AttachmentContentType attachmentContentType = attachmentContentTypeService.findByExtension(newAllegatoPrincipale.getEstensione());
                if (attachmentContentType != null) {
                    segnaturaInput.setMimeTypeAllegato(attachmentContentType.getType());
                }

                for(Allegato a : protocollo.getAllegati()) {
                    if (a.getId().equals(newAllegatoPrincipale.getIdAllegato())) {
                        segnaturaInput.setImprontaBytes(a.getImpronta().getBytes());
                        break;
                    }
                }

                List<ReferentiProtocollo> rp = ReferentiProtocollo.find("idProtocollo", protocollo.getId()).list();
                for(ReferentiProtocollo ref : rp) {
                    if (!ref.isCreationOption()) continue;

                    SegnaturaDestinatarioInput dest = new SegnaturaDestinatarioInput();
                    dest.tipoDestinatario = ref.getTipoDestinatario();
                    dest.isConoscenza = ref.getAttribuzione().equalsIgnoreCase("conoscenza");
                    dest.denominazione = ref.getNomeDestinatario();
                    if (dest.isTipoUtente()) {
                        String[] refsNomi = ref.getNomeDestinatario().split(" ", 2);
                        dest.nome = refsNomi[0];
                        dest.cognome = refsNomi[1];
                    }
                    segnaturaInput.getDestinatari().add(dest);
                }

                Allegato allegato = allegatoService.saveAllegati(buildSignatureXML("Segnatura " + protocollo.getNProtocollo(), segnaturaInput));
                protocollo.getAllegati().add(allegato);
            }

            protocollo.persistAndFlush();

            String storicoOperazione;
            if((protocollo.getNote() == null || protocollo.getNote().isEmpty()) && (oldNote != null && !oldNote.isEmpty())) {
                storicoOperazione = "ha rimosso le note del Protocollo";
                aggiuntaStorico(protocollo, storicoOperazione, null);
            } else if (!Objects.equals(protocollo.getNote(), oldNote)) {
                storicoOperazione = "ha aggiornato la sezione note del Protocollo";
                aggiuntaStorico(protocollo, storicoOperazione, protocollo.getNote());
            }

            if (!Objects.equals(protocollo.getNProtocolloCircolare(), oldNProtocolloCircolare)) {
                    storicoOperazione = String.format("ha agganciato un nuovo protocollo circolare: %s ",protocollo.getNProtocolloCircolare());
                aggiuntaStorico(protocollo, storicoOperazione, null);
                }

            if (protocollo.getAllegati().size() != oldSizeAllegati) {
                int allegatiAggiunti = protocollo.getAllegati().size() - oldSizeAllegati;
                    storicoOperazione = String.format("ha aggiunto %s %s ", allegatiAggiunti, allegatiAggiunti == 1 ? "nuovo allegato" : "nuovi allegati");
                aggiuntaStorico(protocollo, storicoOperazione, null);
            }

            if(isModificaDocPrincipale) {
                storicoOperazione = String.format("ha modificato l'allegato principale con: %s ",newAllegatoPrincipale.getNome());
                aggiuntaStorico(protocollo, storicoOperazione, null);

                storicoOperazione = String.format("generazione %s file Segnatura.xml",isNuovaSegnatura ? "di un nuovo" : "del");
                aggiuntaStorico(protocollo, storicoOperazione, null);
            }

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Problematica relativa all'aggiornamento" + parameter, e).boom();
        }

        return protocollo;
    }

    @Transactional
    public void updateFascicolazioneProtocollo(Long idProtocollo, List<Long> idTitolario, String selectedCdr){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        /*
         * Recupero tutti i record presenti in ProtocolliClassificazione per un determinato idProtocollo
         * */
        try{

            Protocollo protocollo = findById(idProtocollo);
            List<ProtocolliClassificazione> pCList = protocollo.getProtocolliClassificazioneList();
            String idUtente = ssoManager.extractIdFromToken();
            String nomeUtente = ssoManager.extractNameFromToken();

            Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(selectedCdr);
            boolean isDirigente = ssoManager.isUtenteDirigente();
            boolean isArchivista = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("archivista"), selectedCdr);
            boolean isProtocollatore = ssoManager.hasMatchingRoleAndCdr(ssoManager.getDatiUtente(), List.of("protocollatore"), selectedCdr);
            boolean isUtenteAdmin = ssoManager.isUtenteAdmin();

            log.info("Aggiornamento della classificazione del protocollo con id: {} - da parte dell'utente: {}", idProtocollo, ssoManager.extractNameFromToken());

            // TODO: sostituito la logica con la nuova della join
//            List<ProtocolliClassificazione> pCList = em.createNamedQuery("findAllProtocolloClassificatoByIdProtocollo", ProtocolliClassificazione.class)
//                    .setParameter("idProtocollo", idProtocollo)
//                    .getResultList();

            List<Long> related = new ArrayList<>();
            if(!pCList.isEmpty()){
                /*
                 * Cicliamo sulla lista ProtocolliClassificazione per verificare se gli idTitolario passati in input
                 * abbiano già una relazione in tabella
                 * */
                for(ProtocolliClassificazione protocolliClassificazione : pCList) {
                    if(idTitolario.contains(protocolliClassificazione.getIdTitolario())){
                        /*
                         * Se la relazione è già presente aggiungiamo l'idTitolario nella lista related
                         * */
                        related.add(protocolliClassificazione.getIdTitolario());
                        /* Non aggiorniamo il record per salvaguardare l'informazione della precedenza operazione (id_utente)
                        protocolliClassificazione.setTsUpdate(Calendar.getInstance().getTime());
                        protocolliClassificazione.setIdUtenteLastOperation(ssoManager.extractIdFromToken());
                        em.merge(protocolliClassificazione);
                        */
                    } else{
                        /*
                         *Se l'idTitolario non è presente nella lista passata in input
                         * allora lo rimuovo dal db
                         * */
                        Titolario titolario = Titolario.findById(protocolliClassificazione.getIdTitolario());

                        boolean canRemoveFascicolo = true;
                        List<TitolarioOutputDTO> hierarchyDTOToRemove = titolarioService.getHierarchyForTitolarioId(titolario.getId()).getTitolario();
                        if (!isUtenteAdmin) {
                            if (titolario.getIsFascicoloDipendente()) {
                                canRemoveFascicolo = !titolarioService.isFascicoloDipendenteVisibile(titolario, idUtente, cdrCodes, isArchivista, isProtocollatore, isDirigente).equals(PermessoFascicoloDipendente.no);
                            }
                            else {
                                canRemoveFascicolo = titolarioService.isFascicoloVisibile(titolario, idUtente, cdrCodes, hierarchyDTOToRemove);
                            }
                        }
                        if (!canRemoveFascicolo) {
                            continue;
                        }

                        em.createNamedQuery("deleteClassificazioneById")
                                .setParameter("id",protocolliClassificazione.getId())
                                .executeUpdate();

                        String hierarchyString = titolarioService.buildHierarchyString(hierarchyDTOToRemove);

                        String storicoOperazione = StoricoOperazione
                                .RimozioneClassificazione
                                .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                                .concat(hierarchyString).concat(" ").concat(titolario.getNome());

                        storicoService.insertNewStoricoForNumeroProtocollo(
                                Protocollo.findById(idProtocollo),
                                idUtente,
                                nomeUtente,
                                storicoOperazione,
                                "");
                    }
                }
            }

            for(Long id : idTitolario){
                if(!related.contains(id)){
                    Titolario titolario = Titolario.findById(id);
                    if(Boolean.FALSE.equals(titolario.getLeaf())){
                        throw new IllegalArgumentException(String.format("Non è possibile inserire il Protocollo/Circolare all'interno del fascicolo %s", titolario.getNome()));
                    }
                    ProtocolliClassificazione.builder()
                            .protocollo(protocollo)
                            .idTitolario(id)
                            .tsCreation(Calendar.getInstance().getTime())
                            .idUtenteLastOperation(ssoManager.extractIdFromToken())
                            .build()
                            .persist();

                    String hierarchyString = titolarioService.buildHierarchyString(
                            titolarioService.getHierarchyForTitolarioId(id).getTitolario()
                    );

                    String storicoOperazione = StoricoOperazione
                            .Classificazione
                            .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                            .concat(hierarchyString).concat(" ").concat(titolario.getNome());

                    storicoService.insertNewStoricoForNumeroProtocollo(protocollo, idUtente, nomeUtente, storicoOperazione,"");
                }
            }

            pecOperationService.insertPecOperation(protocollo, selectedCdr, idUtente, nomeUtente, Operazione.classificazione);

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        }catch (Exception e){
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException("Problematica relativa alla fascicolazione del protocollo", e);
        }

    }

    private void aggiuntaStorico (Protocollo protocollo, String storicoOperazione, String note) {
        storicoService.insertNewStoricoForNumeroProtocollo(
                protocollo,
                ssoManager.extractIdFromToken(),
                ssoManager.extractNameFromToken(),
                storicoOperazione,
                note
        );
    }

    /**
     *  saveProtocolloByEmail entra in azione per protocollare una mail direttamente dalla sezione PEC
     */
    @Transactional
    @ExceptionChecked
    public Protocollo saveProtocolloByEmail(Long idEmail) {
        Email email = Email.findById(idEmail);

        EmailContentDTO.EmailContentDTOBuilder emailContentDTO = EmailContentDTO.builder()
                .idEmail(email.getId())
                .subject(email.getOggetto())
                .body(email.getCorpo())
                .from(email.getFrom())
                .to(Utils.stringToList(email.getTo()))
                .cc(Utils.stringToList(email.getCc()));

        List<Allegato> allegati = em.createNamedQuery("findAllegatiByIdEmail", Allegato.class)
                .setParameter("idEmail", email.getId())
                .getResultList();

        Protocollo protocollo = saveProtocolloFromPec(emailContentDTO.build(), allegati, null);

        if(protocollo == null || protocollo.getNProtocollo() == null){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante la protocollazione della mail:{}", idEmail).boom();
        }

        email.setProtocollo(protocollo);
        email.persist();

        return protocollo;
    }


    /**
     *  entra in azione per la protocollazione automatica gestita da email-engine,
     *  crea un nuovo protocollo e notifica gli assegnatari.
     */
    @ExceptionChecked
    @Transactional
    public Protocollo saveProtocolloFromPec(EmailContentDTO emailContentDTO, List<Allegato> attachmentList, RiferimentoProtocolloSegnaturaDTO riferimentoProtocolloSegnaturaDTO) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        log.info("Salvataggio di un nuovo protocollo di tipo: PEC");

        Protocollo protocollo = new Protocollo();
        protocollo.setMittente(emailContentDTO.getFrom());
        boolean isMittenteUfficio = false;
        try {
            PecPeo mittenteInOrganigramma = pecPeoService.getPecPeoByEmail(emailContentDTO.getFrom());

            isMittenteUfficio =  mittenteInOrganigramma != null && mittenteInOrganigramma.getIdUtente() == null;
            if(mittenteInOrganigramma != null && mittenteInOrganigramma.getIdUtente() == null){
                if(mittenteInOrganigramma.getUffici().size() == 1){
                    protocollo.setIdMittente(mittenteInOrganigramma.getUffici().get(0).getCdrCode());
                }
            }else if(mittenteInOrganigramma != null){
                protocollo.setIdMittente(mittenteInOrganigramma.getIdUtente());
            }
        }
        catch(Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nella lavorazione del mittente del protocollo",e).boom();
        }

        if(protocollo.getIdMittente() == null && !isMittenteUfficio) {
            //TODO: creare un metodo getAnagraficaByEmail invece che usare la search
            RicercaAnagraficaDTO dto = new RicercaAnagraficaDTO();
            dto.setSize(1);
            dto.setPage(0);
            dto.setSearch(emailContentDTO.getFrom());
            Anagrafica mittenteInAnagrafica = anagraficaService.getAnagraficaQuery(dto).firstResultOptional().orElse(null);
            if (mittenteInAnagrafica != null) {
                protocollo.setIdMittente(mittenteInAnagrafica.getId().toString());
            }
            else {
                //Mittente non trovato neanche in anagrafica interna -> si aggiunge un nuovo elemento
                Anagrafica nuovaAnagrafica = Anagrafica.buildAnagraficaFromPec(emailContentDTO.getFrom(), "Creata da PEC in entrata con oggetto: "+emailContentDTO.getSubject());
                nuovaAnagrafica.setImpronta(anagraficaService.generateImpronta(nuovaAnagrafica));
                nuovaAnagrafica.persistAndFlush();
                protocollo.setIdMittente(nuovaAnagrafica.getId().toString());
            }
        }

        // TO-DO: in caso di protocollazione non automatica settare l'utente che ha effetuato la protocollazione della pec
        try {
            protocollo.setIdUtente("0");
            protocollo.setUtente("Sistema");
            protocollo.setIndirizzoPecPeo(emailContentDTO.getFrom());
            protocollo.setOggetto(emailContentDTO.getSubject());
            protocollo.setCorpoPecPeo(emailContentDTO.getBody());
            //protocollo.setStato(StatoProtocollo.Protocollato);
            protocollo.setTipoRegistrazione(TipoRegistrazione.Entrata);
            protocollo.setMetodoSpedizione(MetodoSpedizione.Pec);

            String numeroProtocollo = numeroProtocolloCircolareService.generateDistribuitedNumeroProtocollo();

            protocollo.setNProtocollo(numeroProtocollo);
            log.info(LogUtils.GENERAZIONE_NUM_PROTOCOLLO_FORMAT,protocollo.getNProtocollo());

            // TODO: estrarre un metodo per la gestione allegati o rendere più efficente - Start
            for(Allegato allegato : attachmentList){
                String nomeAllegatoConNProtocollo = getNomeAllegatoConProtocollo(allegato.getNome(), protocollo.getNProtocollo());
                em.createNamedQuery("updateNameAllegatoById")
                        .setParameter("nome", nomeAllegatoConNProtocollo)
                        .setParameter("idAllegato", allegato.getId())
                        .executeUpdate();
                allegato.setNome(nomeAllegatoConNProtocollo);
            }

            protocollo.setAllegati(attachmentList);
            protocollo.setTsCreation(Calendar.getInstance().getTime());
            protocollo.setTsStartVali(Calendar.getInstance().getTime());

            String filigrana = String.format(ProtocolloUtils.formatoFiligrana,
                    protocollo.getNProtocollo(),
                    Utils.fromDateToString(protocollo.getTsCreation(), Utils.DateFormat.DMY_HM),
                    protocollo.getTipoRegistrazione().toString().toUpperCase());

            for (Allegato allegato : protocollo.getAllegati()) {
                documentService.saveDocumentTimbrato(allegato, filigrana, "top", protocollo.getNProtocollo());
            }

            // TODO: estrarre un metodo per la gestione allegati o rendere più efficente - End

            Set<String> recipientEmailsToUseForRispostaAutomatica = new HashSet<>();
            /**
             *  Si differenzia tra utente ed ufficio perché, gli indirizzi possono essere associati a più uffici,
             *  quindi in caso di assegnazione per ufficio bisogna fare un ciclo su tutti gli uffici configurati.
            */
            List<PecPeo> usersWithPecs = pecPeoService.getPecPeoFromEmails(emailContentDTO.getTo());
            StringBuilder assegnatariSb = new StringBuilder();
            Set<String> idAssegnati = new HashSet<>();
            for(PecPeo pecPeo : usersWithPecs) {
                // Ufficio interno assegnatario del protocollo
                if(pecPeo.getIdUtente() == null){
                    for(Ufficio ufficio : pecPeo.getUffici()){
                        if (idAssegnati.add(ufficio.getCdr())) {
                            recipientEmailsToUseForRispostaAutomatica.add(pecPeo.getIndirizzoEmail());
                            assegnatariSb.append(ufficio.getCdr()).append(", ");
                        }
                    }
                }else{
                    // // Utente assegnatario del protocollo
                    if (idAssegnati.add(pecPeo.getUtente())) {
                        recipientEmailsToUseForRispostaAutomatica.add(pecPeo.getIndirizzoEmail());
                        assegnatariSb.append(pecPeo.getUtente()).append(", ");
                    }
                }
            }
            idAssegnati.clear();

            //se non ci sono destinatari interni in TO, si controllano i destinatari in CC!
            if (assegnatariSb.isEmpty() && emailContentDTO.getCc() != null && !emailContentDTO.getCc().isEmpty()) {
                List<PecPeo> usersCcWithPecs = pecPeoService.getPecPeoFromEmails(emailContentDTO.getCc());
                for(PecPeo pecPeo : usersWithPecs) {
                    // Ufficio interno assegnatario del protocollo
                    if(pecPeo.getIdUtente() == null){
                        for(Ufficio ufficio : pecPeo.getUffici()){
                            if (idAssegnati.add(ufficio.getCdr())) {
                                if (assegnatariSb.isEmpty()) assegnatariSb.append("CC: ");
                                assegnatariSb.append(ufficio.getCdr()).append(", ");
                                recipientEmailsToUseForRispostaAutomatica.add(pecPeo.getIndirizzoEmail());
                            }
                        }
                    }else{
                        // // Utente assegnatario del protocollo
                        if (idAssegnati.add(pecPeo.getUtente())) {
                            if (assegnatariSb.isEmpty()) assegnatariSb.append("CC: ");
                            assegnatariSb.append(pecPeo.getUtente()).append(", ");
                            recipientEmailsToUseForRispostaAutomatica.add(pecPeo.getIndirizzoEmail());
                        }
                    }
                }
            }
            idAssegnati.clear();

            //NOTA: nessun assegnatario di default per una pec in entrata
            protocollo.setAssegnatari("");
            protocollo.setStato(StatoProtocollo.DaAssegnare);
            protocollo.setDestinatari(assegnatariSb.length() > 2 ? assegnatariSb.substring(0, assegnatariSb.length() - 2) : "");

            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");

            SegnaturaInput segnaturaInput = new SegnaturaInput();
            segnaturaInput.setDenominazioneMittente(configurazioneService.getDenominazioneAmministrazione(configurazioniGlobali));
            segnaturaInput.setCfMittente(configurazioneService.getCfAmministrazione(configurazioniGlobali));
            segnaturaInput.setCodiceIpaMittente(configurazioneService.getCodiceIpa(configurazioniGlobali));
            segnaturaInput.setCodiceAooMittente(configurazioneService.getCodiceAoo(configurazioniGlobali));

            segnaturaInput.setNumeroRegistrazione(protocollo.getNumeroProgressivoForSignature());
            segnaturaInput.setDataRegistrazione(protocollo.getTsCreationFormatted());
            segnaturaInput.setOggetto(protocollo.getOggetto());

            segnaturaInput.setRiferimentoProtocolloSegnaturaDTO(riferimentoProtocolloSegnaturaDTO);

            for (Allegato allegato : protocollo.getAllegati()) {
                if (!allegato.getIsMain()) continue;

                String nomeAllegatoConNProtocollo = getNomeAllegatoConProtocollo(allegato.getNome(), protocollo.getNProtocollo());

                segnaturaInput.setNomeAllegato(nomeAllegatoConNProtocollo);
                segnaturaInput.setMimeTypeAllegato("none");
                AttachmentContentType attachmentContentType = attachmentContentTypeService.findByExtension(allegato.getEstensione());
                if (attachmentContentType != null) {
                    segnaturaInput.setMimeTypeAllegato(attachmentContentType.getType());
                }

                segnaturaInput.setImprontaBytes(allegato.getImpronta().getBytes());
                /*
                for(Allegato a : protocollo.getAllegati()) {
                    if (a.getId().equals(allegato.getId())) {
                        segnaturaInput.setImprontaBytes(a.getImpronta().getBytes());
                        break;
                    }
                }
                */
            }

            FileUploadForm fileUploadForm = buildSignatureXML("Segnatura " + protocollo.getNProtocollo(), segnaturaInput);
            fileUploadForm.setProtocollazioneAuto(true);
            Allegato allegatoSegnatura = allegatoService.saveAllegati(fileUploadForm);
            allegatoSegnatura.setProtocollo(protocollo);
            protocollo.getAllegati().add(allegatoSegnatura);

            protocollo.persist();

            // Se arriviamo dalla action protocolla della lista email
            if(emailContentDTO.getIdEmail() == null){
                emailService.saveRecordEmail(emailContentDTO, protocollo, null);
            }

            //NOTA: la protocollazione automatica della PEC viene salvata nello storico con assegnato nessun utente
            storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(protocollo, StoricoOperazione.CreazioneAutomaticaProtocollo.getStatoParameter(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()) ? "Circolare" : "Protocollo"));


            //NOTA 03/09/2025: la lista di email destinatarie non è utilizzata perché la query per scegliere il mittente della risposta automatica filtra per l'opzione "Abilita risposta automatica"
            log.info("Insieme di destinatari da controllare per risposta automatica: {}", recipientEmailsToUseForRispostaAutomatica.toString());

            boolean isPecToExclude = PecEscluseRispostaAutomatica.find("LOWER(indirizzo)", emailContentDTO.getFrom().toLowerCase()).firstResult() != null;

            if (!isPecToExclude) {
                try {
                    EmailTemplate template = emailTemplateService.getTemplate(Operazione.protocollazioneAutomatica, "notifica");

                    String numeroProtocolloToSendInSubject = protocollo.getNProtocollo();
                    String numeroProtocolloToSendInBody = "";
                    //NOTA: in caso di esistenza del riferimento di protocollo estratto dal file di Segnatura.xml allegato alla PEC -> si invia la risposta automatica di protocollazione
                    if (riferimentoProtocolloSegnaturaDTO != null && riferimentoProtocolloSegnaturaDTO.getNumero() != null) {
                        numeroProtocolloToSendInSubject =  riferimentoProtocolloSegnaturaDTO.getNumero();
                        numeroProtocolloToSendInBody = " (n. prot. "+riferimentoProtocolloSegnaturaDTO.getNumero()+") ";
                    }
                    String oggettoEmailNotificaAutomatica = template.getOggetto().replace("{{numero}}", numeroProtocolloToSendInSubject);
                    String sbCorpoEmailNotificaAutomatica = template.getCorpo()
                            .replace("{{data}}", Utils.fromDateToString(protocollo.getTsCreation(), Utils.DateFormat.DMY_HM))
                            .replace("{{numero}}", protocollo.getNProtocollo())
                            .replace("{{numeroEsterno}}", numeroProtocolloToSendInBody)
                            .replace("{{oggetto}}", protocollo.getOggetto());
                    Long idRispostaAutomatica = emailService.saveRecordEmailAvvenutaProtocollazioneAutomatica(protocollo, emailContentDTO, "No", allegatoSegnatura, oggettoEmailNotificaAutomatica, sbCorpoEmailNotificaAutomatica);
                    if(idRispostaAutomatica != null){
                        sendEmailClient.sendEmail(idRispostaAutomatica);
                    }

                }
                catch(Exception ignored) {
                    log.error("Impossibile inviare notifica di protocollazione automatica: {}", ignored.getMessage());
                }
            }

            /*
            NOTA: disabilitata assegnazione automatica da protocollo in entrata pec

            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
            String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
            String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
            PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();

            Set<DatiUtenteSlimSSO> listRecipientNotifica = new HashSet<>();
            Set<Office> listRecipientCdrNotifica = new HashSet<>();
            for(PecPeo pecPeo : usersWithPecs) {
                // Ufficio interno assegnatario del protocollo
                if(pecPeo.getIdUtente() == null){
                    for(Ufficio ufficio : pecPeo.getUffici()){
                        if (idAssegnati.add(ufficio.getCdr())) {
                            ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                                    .idProtocollo(protocollo.getId())
                                    .idDestinatario(ufficio.getCdrCode())
                                    .nomeDestinatario(ufficio.getCdr())
                                    .attribuzione(TipoAttribuzione.COMPETENZA.getNome())
                                    .tipoDestinatario(TipoDestinatarioReferente.UFFICIO.getNome())
                                    .statoProtocollo(StatoProtocollo.Assegnato)
                                    .isAssegnato(true)
                                    .creationOption(true)
                                    .tsCreation(Calendar.getInstance().getTime())
                                    .tsStartVali(Calendar.getInstance().getTime())
                                    .tsStatoProtocollo(Calendar.getInstance().getTime())
                                    .build();

                            String storicoOperazione = StoricoOperazione
                                    .AssegnazioneProtocollo
                                    .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                                    .concat(referentiProtocollo.getNomeDestinatario())
                                    .concat(".");

                            storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(protocollo, storicoOperazione);
                            referentiProtocollo.persist();

                            if (peoInvioNotifica == null){
                                continue;
                            }
                            // Ufficio interno assegnatario di un protocollo -> invio mail di notifica
                            List<String> rolesToFilter = List.of("protocollatore", "archivista");

                            // Devo notificare tutti i protocollatori e archivisti dell'ufficio
                            List<DatiUtenteSlimSSO> utentiInUfficio = ssoManager.getUtentiPerUfficio(applicationId, referentiProtocollo.getIdDestinatario(), "");
                            for(DatiUtenteSlimSSO utenteInUfficio : utentiInUfficio) {
                                List<String> offices = ssoManager.extractOfficesByRoles(utenteInUfficio, rolesToFilter);
                                if (offices.contains(referentiProtocollo.getIdDestinatario()) && utenteInUfficio.email != null) {
                                    listRecipientNotifica.add(utenteInUfficio);
                                }
                            }

                            try {
                                List<PecPeo> listCdrPeo = em.createNamedQuery("findAllPecPeoByCdr", PecPeo.class)
                                        .setParameter("cdrCode", referentiProtocollo.getIdDestinatario())
                                        .getResultList();

                                for(PecPeo cdrPeo : listCdrPeo) {
                                    if (cdrPeo.isAttiva() && cdrPeo.getConfigurazione().getTipologiaPosta().isPeo() && cdrPeo.getIdUtente() == null) {
                                        //TODO: utilizzare un DTO specificio
                                        Office cdrForNotifica = new Office();
                                        cdrForNotifica.code = referentiProtocollo.getIdDestinatario();
                                        cdrForNotifica.description = cdrPeo.getIndirizzoEmail(); //NOTA: usiamo il campo description per memorizzare la peo dell'ufficio
                                        cdrForNotifica.name = referentiProtocollo.getNomeDestinatario();
                                        listRecipientCdrNotifica.add(cdrForNotifica);
                                    }
                                }
                            }
                            catch (Exception e) {
                                log.error(String.format("Problematica durante la chiamata findAllPecPeoByCdr. %s",e));
                            }
                        }
                    }
                } else {
                    // Utente assegnatario del protocollo
                    if (idAssegnati.add(pecPeo.getUtente())) {

                        ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                                .idProtocollo(protocollo.getId())
                                .idDestinatario(pecPeo.getIdUtente())
                                .nomeDestinatario(pecPeo.getUtente())
                                .attribuzione(TipoAttribuzione.COMPETENZA.getNome())
                                .tipoDestinatario(TipoDestinatarioReferente.UTENTE.getNome())
                                .statoProtocollo(StatoProtocollo.DaPrendereInCarico)
                                .isAssegnato(true)
                                .creationOption(true)
                                .tsCreation(Calendar.getInstance().getTime())
                                .tsStartVali(Calendar.getInstance().getTime())
                                .tsStatoProtocollo(Calendar.getInstance().getTime())
                                .build();

                        String storicoOperazione = StoricoOperazione
                                .AssegnazioneProtocollo
                                .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                                .concat(referentiProtocollo.getNomeDestinatario())
                                .concat(".");

                        storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(protocollo, storicoOperazione);
                        referentiProtocollo.persist();

                        if (peoInvioNotifica == null){
                            continue;
                        }
                        // utente assegnatario di un protocollo -> invio mail di notifica
                        DatiUtenteSSO recipientNotifica = ssoManager.getUserByAuthId(referentiProtocollo.getIdDestinatario(), Integer.valueOf(applicationId));
                        if (recipientNotifica.email != null){
                            listRecipientNotifica.add(DatiUtenteSlimSSO.mapFromDatiUtenteSSO(recipientNotifica));
                        }
                    }
                }
            }
            */

            /*
            // NOTA: disabilitato invio notifica per pec in ingresso protocollate in automatico
            EmailTemplate template = emailTemplateService.getTemplate(Operazione.assegnazioneAutomatica, "notifica");
            if (!listRecipientNotifica.isEmpty() && template != null) {
                for(DatiUtenteSlimSSO recipientNotifica : listRecipientNotifica) {
                    String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                    String sbCorpoEmailNotifica = template.getCorpo()
                            .replace("{{headerCorpo}}", oggettoEmailNotifica)
                            .replace("{{cognomeUtenteTO}}", recipientNotifica.lastName)
                            .replace("{{nomeUtenteTO}}", recipientNotifica.firstName)
                            .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                            .replace("{{numero}}", protocollo.getNProtocollo())
                            .replace("{{oggetto}}", protocollo.getOggetto())
                            .replace("{{obiettivoLavorazione}}", "Assegnazione per competenza")
                            .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                    Long idNotifica = notificaService.newNotifica(
                            protocollo.getId(),
                            peoInvioNotifica.getIndirizzoEmail(),
                            recipientNotifica.email,
                            oggettoEmailNotifica,
                            sbCorpoEmailNotifica,
                            Operazione.assegnazioneAutomatica.toString());
                    if (idNotifica != null) {
                        emailKafkaProducer.sendIdNotificaToKafkaFromBackgroundThread(idNotifica);
                    }
                }
                for(Office recipientSSO : listRecipientCdrNotifica) {
                    String obiettivoLavorazione = "Assegnazione per competenza";

                    String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                    String sbCorpoEmailNotifica = template.getCorpo()
                            .replace("{{headerCorpo}}", oggettoEmailNotifica)
                            .replace("{{cognomeUtenteTO}}", "("+recipientSSO.code+")")
                            .replace("{{nomeUtenteTO}}", recipientSSO.name)
                            .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                            .replace("{{numero}}", protocollo.getNProtocollo())
                            .replace("{{oggetto}}", protocollo.getOggetto())
                            .replace("{{obiettivoLavorazione}}",  obiettivoLavorazione)
                            .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                    Long idNotifica = notificaService.newNotifica(
                            protocollo.getId(), peoInvioNotifica.getIndirizzoEmail(),
                            recipientSSO.description, //NOTA: usiamo il campo description per memorizzare la peo dell'ufficio
                            oggettoEmailNotifica,
                            sbCorpoEmailNotifica,
                            Operazione.assegnazioneAutomatica.toString());

                    if (idNotifica != null) {
                        emailKafkaProducer.sendIdNotificaToKafkaFromBackgroundThread(idNotifica);
                    }
                }
            }
            else {
                StringBuilder errorSb = new StringBuilder("[Attenzione] - Problematica durante la preparazione delle notifiche peo ")
                        .append("in fase di: [%s] - ")
                        .append("del protocollo: [%s] - ")
                        .append("Template: %s - " )
                        .append("PeoInvioNotifica: %s - ");

                String fullMessage = String.format(
                        errorSb.toString(),
                        "saveProtocolloFormPec",
                        protocollo.getId(),
                        template == null ? "null" : template.getId(),
                        peoInvioNotifica == null ? "null" : peoInvioNotifica.getIndirizzoEmail());

                log.error(fullMessage);
            }

            if (!emailContentDTO.getCc().isEmpty()) {
                List<PecPeo> usersConoscenzaWithPecs = pecPeoService.getPecPeoFromEmails(emailContentDTO.getCc());
                for(PecPeo pecPeo : usersConoscenzaWithPecs) {
                    // Ufficio interno assegnato per conoscenza al protocollo
                    if(pecPeo.getIdUtente() == null){
                        for(Ufficio ufficio : pecPeo.getUffici()){
                            ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                                    .idProtocollo(protocollo.getId())
                                    .idDestinatario(ufficio.getCdrCode())
                                    .nomeDestinatario(ufficio.getCdr())
                                    .attribuzione(TipoAttribuzione.CONOSCENZA.getNome())
                                    .tipoDestinatario(TipoDestinatarioReferente.UFFICIO.getNome())
                                    .isAssegnato(false)
                                    .creationOption(true)
                                    .tsCreation(Calendar.getInstance().getTime())
                                    .tsStartVali(Calendar.getInstance().getTime())
                                    .build();
                            log.info("Salvataggio record uffico conoscenza:{}", ufficio.getCdr());
                            referentiProtocollo.persist();
                        }
                    }else{
                        // Utente assegnato per conoscenza al protocollo
                        ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                                .idProtocollo(protocollo.getId())
                                .idDestinatario(pecPeo.getIdUtente())
                                .nomeDestinatario(pecPeo.getUtente())
                                .attribuzione(TipoAttribuzione.CONOSCENZA.getNome())
                                .tipoDestinatario(TipoDestinatarioReferente.UTENTE.getNome())
                                .isAssegnato(false)
                                .creationOption(true)
                                .tsCreation(Calendar.getInstance().getTime())
                                .tsStartVali(Calendar.getInstance().getTime())
                                .idMittente(protocollo.getIdUtente())
                                .nomeMittente(protocollo.getUtente())
                                .build();

                        referentiProtocollo.persist();
                        log.info("Salvataggio record utente conoscenza:{}", pecPeo.getUtente());
                    }
                }
            }
            */


            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException("Problematica relativa alla creazione del protocollo", e);
        }

        return protocollo;
    }

    @Transactional
    public boolean richiestaAnnullamentoProtocollo(Long idProtocollo, String notaAnnullamento){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        log.info("Richiesta di annullamento del protocollo con id: {} - da parte dell'utente: {}", idProtocollo, ssoManager.extractNameFromToken());

        Protocollo protocollo = null;
        try{
            protocollo = findById(idProtocollo);
            protocollo.setStato(StatoProtocollo.RichiestaDiAnnullamento);
            protocollo.persist();

            String storicoOperazione = StoricoOperazione
                    .RichiestaDiAnnullamento
                    .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()));

            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), storicoOperazione, notaAnnullamento);

            //NOTA: notifica da parte dell'utente loggato agli admin del protocollo
            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");

            String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
            String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);

            PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();

            // Lista che conterrà tutti gli id delle notifiche da inviare
            List<Long> notificheToSendList = new ArrayList<>();
            List<DatiUtenteSlimSSO> adminsRecipients = ssoManager.getAdminsForApplicationSlim(Integer.valueOf(applicationId));
            EmailTemplate template = emailTemplateService.getTemplate(Operazione.richiestaAnnullamento, "notifica");

            if (peoInvioNotifica != null && !adminsRecipients.isEmpty() && template != null) {
                log.info(LOG_PEO_NOTIFICA, peoInvioNotifica.getIndirizzoEmail());

                for(DatiUtenteSlimSSO adminRecipient : adminsRecipients) {

                    String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                    String sbCorpoEmailNotifica = template.getCorpo()
                            .replace("{{headerCorpo}}", oggettoEmailNotifica)
                            .replace("{{cognomeUtenteTO}}", adminRecipient.lastName)
                            .replace("{{nomeUtenteTO}}", adminRecipient.firstName)
                            .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                            .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                            .replace("{{numero}}", protocollo.getNProtocollo())
                            .replace("{{motivo}}", notaAnnullamento != null ? notaAnnullamento : "-")
                            .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                    Long idNotifica = notificaService.newNotifica(
                            protocollo.getId(),
                            peoInvioNotifica.getIndirizzoEmail(),
                            adminRecipient.email,
                            oggettoEmailNotifica,
                            sbCorpoEmailNotifica,
                            Operazione.richiestaAnnullamento.toString());
                    if (idNotifica != null) {
                        notificheToSendList.add(idNotifica);
                    }
                }
            } else {
                StringBuilder errorSb = new StringBuilder("[Attenzione] - Problematica durante la preparazione delle notifiche peo ")
                        .append("in fase di: [%s] - ")
                        .append("del protocollo: [%s] - ")
                        .append("Template: %s - " )
                        .append("PeoInvioNotifica: %s -");

                String fullMessage = String.format(
                        errorSb.toString(),
                        Operazione.richiestaAnnullamento,
                        protocollo.getId(),
                        template == null ? "null" : template.getId(),
                        peoInvioNotifica == null ? "null" : peoInvioNotifica.getIndirizzoEmail());

                log.error(fullMessage);
            }

            // si inviano in blocco tutte le notifiche per garantire il contesto delle transactions
            sendNotificaClient.sendNotifiche(notificheToSendList);

        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Errore durante la richiesta di annullamento per il Protocollo/Circolare:{}",protocollo.getNProtocollo()).boom();
            return false;
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }



    @Transactional
    public boolean annullaProtocollo(Long idProtocollo, String notaAnnullamento) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        boolean isCircolare = false;
        try {
            Protocollo protocollo = findById(idProtocollo);
            protocollo.setStato(StatoProtocollo.Annullato);

            isCircolare = TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione());
            parameter = isCircolare ? "Circolare" : "Protocollo";
            log.info("Annullamento {} con id: {} - da parte dell'utente: {}",parameter, idProtocollo, ssoManager.extractNameFromToken());

            if(referentiProtocolloService.deleteAllReferentiProtocollo(protocollo)){
                storicoService.insertNewStoricoForNumeroProtocollo(protocollo, "Sistema", "Sistema", StoricoOperazione.RimozioneAssegnatari.getStato(), null);
            }else{
                log.error("Errore nella cancellazione degli assegnatari {} con id: {}",parameter, idProtocollo);
            }

            protocollo.persist();
            String operazioneStorico = StoricoOperazione
                    .Annullamento.getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()));

            storicoService.insertNewStoricoForNumeroProtocollo(
                    protocollo,
                    ssoManager.extractIdFromToken(),
                    ssoManager.extractNameFromToken(),
                    operazioneStorico,
                    notaAnnullamento);

            //NOTA: notifica da parte dell'utente loggato all'utente creatore del protocollo
            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");

            String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
            String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
            PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();
            EmailTemplate template = emailTemplateService.getTemplate(Operazione.annullamento, "notifica");
            DatiUtenteSSO recipientUser = ssoManager.getUserByAuthId(protocollo.getIdUtente(), Integer.valueOf(applicationId));

            // Lista che conterrà tutti gli id delle notifiche da inviare
            List<Long> notificheToSendList = new ArrayList<>();

            if (recipientUser != null && peoInvioNotifica != null && template != null) {
                log.info(LOG_PEO_NOTIFICA, peoInvioNotifica.getIndirizzoEmail());

                String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                String sbCorpoEmailNotifica = template.getCorpo()
                        .replace("{{headerCorpo}}", oggettoEmailNotifica)
                        .replace("{{cognomeUtenteTO}}", recipientUser.lastName)
                        .replace("{{nomeUtenteTO}}", recipientUser.firstName)
                        .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                        .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                        .replace("{{numero}}", protocollo.getNProtocollo())
                        .replace("{{nota}}", notaAnnullamento != null ? notaAnnullamento : "-")
                        .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                Long idNotifica = notificaService.newNotifica(
                        protocollo.getId(),
                        peoInvioNotifica.getIndirizzoEmail(),
                        recipientUser.email,
                        oggettoEmailNotifica,
                        sbCorpoEmailNotifica,
                        Operazione.annullamento.toString());

                if (idNotifica != null) {
                    notificheToSendList.add(idNotifica);
                }
            } else {
                StringBuilder errorSb = new StringBuilder("[Attenzione] - Problematica durante la preparazione delle notifiche peo ")
                        .append("in fase di: [%s] - ")
                        .append("del protocollo: [%s] - ")
                        .append("Template: %s - " )
                        .append("PeoInvioNotifica: %s - ");

                String fullMessage = String.format(
                        errorSb.toString(),
                        Operazione.annullamento,
                        protocollo.getId(),
                        template == null ? "null" : template.getId(),
                        peoInvioNotifica == null ? "null" : peoInvioNotifica.getIndirizzoEmail());

                log.error(fullMessage);
            }

            // si inviano in blocco tutte le notifiche per garantire il contesto delle transactions
            sendNotificaClient.sendNotifiche(notificheToSendList);

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return true;
        } catch (Exception e) {
            String errorDetailMessage = !isCircolare ? "del protcollo" : "della circolare";
            String fullErrorMessage = String.format("Errore imprevisto durante l'annullamento %s con id: %s - [%s]",errorDetailMessage,idProtocollo, e.getMessage());
            CustomException.get(CustomException.ErrorCode.INTERNAL, fullErrorMessage).boom();

        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return false;
    }

    @Transactional
    public boolean rifiutaAnnullamentoProtocollo(Long idProtocollo, String notaRifiuto){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        boolean isCircolare = false;
        try {
            //NOTA: prendere tutti gli assegnatari del protocollo per capire in che stato settare il protocollo (Se in corso, preso in carico oppure da assegnare)
            Protocollo protocollo = findById(idProtocollo);

            isCircolare = TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione());
            parameter = isCircolare ? "Circolare" : "Protocollo";
            log.info("Rifiuto della richiesta di annullamento del protocollo/circolare con id: {} - da parte dell'utente: {}", idProtocollo, ssoManager.extractNameFromToken());

            protocollo.setStato(StatoProtocollo.InCorso);
            List<ReferentiProtocollo> referentiList = ReferentiProtocollo.list("idProtocollo", idProtocollo);
            boolean isTag = referentiList.stream().anyMatch(r -> r.getTipoDestinatario() != null && r.getTipoDestinatario().equalsIgnoreCase("tag"));
            protocollo.setStato(protocollo.computeStatoProtocollo(this.getAssegnatariPerCompetenza(referentiList), isTag));
            protocollo.persist();

            String storicoOperazione = StoricoOperazione
                    .RifiutoRichiestaDiAnnullamento
                    .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()));

            storicoService.insertNewStoricoForNumeroProtocollo(
                    protocollo,
                    ssoManager.extractIdFromToken(),
                    ssoManager.extractNameFromToken(),
                    storicoOperazione,
                    notaRifiuto);

            //NOTA: notifica da parte dell'utente loggato all'utente creatore del protocollo
            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");

            String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
            String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
            PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();

            EmailTemplate template = emailTemplateService.getTemplate(Operazione.rifiutoAnnullamento, "notifica");
            DatiUtenteSSO recipientUser = ssoManager.getUserByAuthId(protocollo.getIdUtente(), Integer.valueOf(applicationId));

            // Lista che conterrà tutti gli id delle notifiche da inviare
            List<Long> notificheToSendList = new ArrayList<>();

            if (recipientUser != null && peoInvioNotifica != null && template != null) {
                log.info(LOG_PEO_NOTIFICA, peoInvioNotifica.getIndirizzoEmail());

                String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                String sbCorpoEmailNotifica = template.getCorpo()
                        .replace("{{headerCorpo}}", oggettoEmailNotifica)
                        .replace("{{cognomeUtenteTO}}", recipientUser.lastName)
                        .replace("{{nomeUtenteTO}}", recipientUser.firstName)
                        .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                        .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                        .replace("{{numero}}", protocollo.getNProtocollo())
                        .replace("{{nota}}", notaRifiuto != null ? notaRifiuto : "-")
                        .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                Long idNotifica = notificaService.newNotifica(
                        protocollo.getId(),
                        peoInvioNotifica.getIndirizzoEmail(),
                        recipientUser.email,
                        oggettoEmailNotifica,
                        sbCorpoEmailNotifica,
                        Operazione.rifiutoAnnullamento.toString());

                if (idNotifica != null) {
                    notificheToSendList.add(idNotifica);
                }
            }else {
                StringBuilder errorSb = new StringBuilder("[Attenzione] - Problematica durante la preparazione delle notifiche peo ")
                        .append("in fase di: [%s] - ")
                        .append("del protocollo/circolare: [%s] - ")
                        .append("Template: %s - " )
                        .append("recipientSSO: %s - ")
                        .append("peoInvioNotifica: %s - ");

                String fullMessage = String.format(
                        errorSb.toString(),
                        Operazione.rifiutoAnnullamento,
                        protocollo.getId(),
                        template == null ? "null" : template.getId(),
                        recipientUser == null ? "null" : recipientUser.username,
                        peoInvioNotifica == null ? "null" : peoInvioNotifica.getIndirizzoEmail());

                log.error(fullMessage);
            }

            // si inviano in blocco tutte le notifiche per garantire il contesto delle transactions
            sendNotificaClient.sendNotifiche(notificheToSendList);

        }catch (Exception e){
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Errore durante il rifiuto della richiesta di annullamento per il Protocollo/Circolare con id: {}",idProtocollo).boom();
            return false;
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    @Transactional
    public boolean gestioneAnnullamento(Long idProtocollo, boolean isAnnulla, String nota){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if(isAnnulla){
            return annullaProtocollo(idProtocollo, nota);
        }else {
            return rifiutaAnnullamentoProtocollo(idProtocollo, nota);

        }
    }

    public boolean assegnaProtocolloMassiva(List<String> numbers, String selectedOffice, List<ReferenteProtocolloInput> referenti, String noteAssegnazione) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        log.info("Assegnazione massiva di: {} Protocolli/Circolari - da parte dell'utente: {}", numbers.size(), ssoManager.extractNameFromToken());

        if (numbers.isEmpty()) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Nessun Protocollo/Circolare selezionato per l'assegnazione").boom();
        }
        if (referenti.isEmpty()) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Nessun Assegnatario selezionato per la lavorazione").boom();
        }
        Map<String, Long> protccolloMap = new HashMap<>();

        // Eseguiamo un primo ciclo per intercettare eventuali incongruenze in riferimento all'assegnazione del protocollo
        for (String nProtocollo : numbers) {
            try {
                DettaglioProtocolloDTO dettaglioProtocolloDTO = this.getDettaglioProtocollo(nProtocollo, selectedOffice);

                // Mappiamo il numero protocollo al rispettivo id per evitare di invocare nuovamente il servizio di dettaglio nel secondo ciclo
                protccolloMap.put(nProtocollo, dettaglioProtocolloDTO.getProtocollo().getId());

                if (dettaglioProtocolloDTO.getProtocollo().getStato().equals(StatoProtocollo.Annullato)) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            String.format("Errore durante l'operazione di l'assegnazione. Il Protocollo/Circolare: %s risulta Annullato", nProtocollo)).boom();
                }

                if (!dettaglioProtocolloDTO.isAssegna()) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            String.format("L'Utente non è abilitato all'assegnazione Protocollo/Circolare: %s.", nProtocollo)).boom();
                }

            } catch (Exception e) {
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
            }
        }

        // Eseguiamo il secondo ciclo per effettuare l'effettiva assegnazione
        for (String nProtocollo : numbers) {
            try {
                this.assegnaProtocollo(protccolloMap.get(nProtocollo), referenti, selectedOffice, noteAssegnazione);
            } catch (Exception e) {
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
            }
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    @Transactional
    public boolean assegnaProtocollo(Long idProtocollo, List<ReferenteProtocolloInput> referenti, String selectedOffice, String noteAssegnazione) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try{
            Protocollo protocollo = Protocollo.findById(idProtocollo);

            log.info("Assegnazione per competenza al protocollo con id: {} - da parte dell'utente: {} , agli utenti: {}",
                    idProtocollo,
                    ssoManager.extractNameFromToken(),
                    referenti.stream()
                            .map(r -> r.nomeAssegnatario)
                            .collect(Collectors.joining(", ")));

            DatiUtenteSSO datiUtenteSSO = ssoManager.getDatiUtente();
            String idUtente = ssoManager.extractIdFromToken();
            String nomeUtente = ssoManager.extractNameFromToken();

            PanacheQuery<ReferentiProtocollo> queryAssegnatariPresenti = getQueryForAssegnatariIdProtocollo(idProtocollo);
            List<ReferentiProtocollo> referentiAssegnatari = queryAssegnatariPresenti.list();


            /** /
             //Se ho assegnato / riassegnato, devo prendere il record che mi appartiene nella tabella referenti_protocollo
             PanacheQuery<ReferentiProtocollo> queryAssegnatarioUtenteLoggato = getQueryForReferentiIdProtocollo(idProtocollo, datiUtenteSSO);
             ReferentiProtocollo referenteProtocolloUtenteLoggato = queryAssegnatarioUtenteLoggato.firstResultOptional().orElse(null);
             // utente loggato è assegnatario del protocollo -> va nella history con stato "Riassegnato"
             if (referenteProtocolloUtenteLoggato != null && (!referentiAssegnatari.isEmpty()) ) {
                Optional<ReferentiProtocollo> optionalUtenteLoggatoInDb = referentiAssegnatari.stream().filter(item -> item.getIdDestinatario().equalsIgnoreCase(referenteProtocolloUtenteLoggato.getIdDestinatario())).findAny();
                Optional<ReferenteProtocolloInput> optionalUtenteLoggatoInInput = referenti.stream().filter(item -> item.getIdAssegnatario().equalsIgnoreCase(referenteProtocolloUtenteLoggato.getIdDestinatario())).findAny();
                if (optionalUtenteLoggatoInDb.isPresent() && (optionalUtenteLoggatoInInput.isEmpty())) {
                    referenteProtocolloUtenteLoggato.setStatoProtocollo(StatoProtocollo.Riassegnato);
                    referenteProtocolloUtenteLoggato.setTsStatoProtocollo(Calendar.getInstance().getTime());
                    referenteProtocolloUtenteLoggato.persist();
                }
            }
            /**/

            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
            List<Configurazione> configurazioniNotifiche = configurazioneService.getAllConfigurazioniByCategoria("notifiche");

            String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
            String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
            PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche(configurazioniNotifiche);

            Set<DatiUtenteSlimSSO> listRecipientNotifica = new HashSet<>();
            Set<Office> listRecipientCdrNotifica = new HashSet<>();

            for(ReferenteProtocolloInput input : referenti){

                ReferentiProtocollo referentiProtocollo = null;
                //check se l'assegnatario scelto è già nel db -> skip
                if (!referentiAssegnatari.isEmpty()) {
                    Optional<ReferentiProtocollo> optional = referentiAssegnatari.stream()
                            .filter(item -> item.getIdDestinatario().equalsIgnoreCase(input.getIdAssegnatario()))
                            .findAny();
                    if (optional.isPresent()) {
                        ReferentiProtocollo refProtocolloInDb = optional.get();
                        referentiProtocollo = refProtocolloInDb;

                        // si moidificano i dati del destinatario per la corretta gestione delle notifiche
                        referentiProtocollo.setIdMittente(ssoManager.extractIdFromToken());
                        referentiProtocollo.setNomeMittente(ssoManager.extractNameFromToken());
                        referentiProtocollo.setNoteAssegnazione(noteAssegnazione);
                        referentiProtocollo.setUfficioLavorazione(input.getCdrAssegnatario());

                        if(!refProtocolloInDb.isAssegnato() && refProtocolloInDb.getTipoDestinatario().equalsIgnoreCase("ufficio")){
                            referentiProtocollo.setAssegnato(true);
                        } else if (refProtocolloInDb.getStatoProtocollo().equals(StatoProtocollo.Rifiutato)) {
                            referentiProtocollo.setStatoProtocollo(getStatoAssegnazione(referentiProtocollo.getTipoDestinatario()));
                            referentiProtocollo.setTsStatoProtocollo(Date.from(Instant.now()));
                        }
                    }
                }

                if (referentiProtocollo == null) {

                    referentiProtocollo = ReferentiProtocollo.builder()
                            .idProtocollo(idProtocollo)
                            .idDestinatario(input.getIdAssegnatario())
                            .nomeDestinatario(input.getNomeAssegnatario())
                            .attribuzione(TipoAttribuzione.COMPETENZA.getNome())
                            .tipoDestinatario(input.getTipoDestinatario())
                            .statoProtocollo(getStatoAssegnazione(input.tipoDestinatario))
                            .isAssegnato(true)
                            .tsStatoProtocollo(Calendar.getInstance().getTime())
                            .tsCreation(Calendar.getInstance().getTime())
                            .tsStartVali(Calendar.getInstance().getTime())
                            .idMittente(datiUtenteSSO.auth_id)
                            .nomeMittente(datiUtenteSSO.firstName+" "+datiUtenteSSO.lastName)
                            .creationOption(false)
                            .noteAssegnazione(noteAssegnazione)
                            .ufficioLavorazione(input.getCdrAssegnatario())
                            .build();
                }

                String storicoOperazione = StoricoOperazione.AssegnazioneProtocollo
                        .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                        .concat(referentiProtocollo.getNomeDestinatario())
                        .concat(referentiProtocollo.getUfficioLavorazione() != null ? " " + referentiProtocollo.getUfficioLavorazione() : "")
                        .concat(".");

                storicoService.insertNewStoricoForNumeroProtocollo(protocollo, idUtente, nomeUtente, storicoOperazione, noteAssegnazione);

                referentiProtocollo.persistAndFlush();

                if(MetodoSpedizione.Pec.toString().equalsIgnoreCase(protocollo.getMetodoSpedizione().toString())){
                    pecOperationService.insertPecOperation(protocollo, selectedOffice, idUtente, nomeUtente, Operazione.assegnazione);
                }

                if (peoInvioNotifica == null)
                    continue;

                // Al momento commentata, da ripristinare qualora ci fosse l'esigenza di non inviare la notifdica anche in fase di assegnazione
                /* Ufficio ufficioCreatore = ufficioService.findByCdrCode(selectedOffice);

                // Non invio la notifica se l'ufficio destinatario coincide con l'ufficio creatore
                if(referentiProtocollo.isAssegnato() && referentiProtocollo.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome()) && input.idAssegnatario.equals(ufficioCreatore.getCdrCode()))
                    continue;
                 */

                // utente o ufficio interno assegnatario di un protocollo -> invio mail di notifica
                if ((referentiProtocollo.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome()) || referentiProtocollo.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UTENTE.getNome()))) {

                    if (referentiProtocollo.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UTENTE.getNome())) {
                        DatiUtenteSSO recipientNotifica = ssoManager.getUserByAuthId(referentiProtocollo.getIdDestinatario(), Integer.valueOf(applicationId));
                        if (recipientNotifica.email != null)
                            listRecipientNotifica.add(DatiUtenteSlimSSO.mapFromDatiUtenteSSO(recipientNotifica));
                    }
                    else {

                        /*
                        //NOTA: inibire invio notifica ai protocollatori / archivisti dell'ufficio
                        List<String> rolesToFilter = List.of("protocollatore", "archivista");
                        // ufficio -> devo notificare tutti i protocollatori e archivisti dell'ufficio
                        List<DatiUtenteSlimSSO> utentiInUfficio = ssoManager.getUsersByCdrCode(applicationId, referentiProtocollo.getIdDestinatario());
                        for(DatiUtenteSlimSSO utenteInUfficio : utentiInUfficio) {
                            List<String> offices = ssoManager.extractOfficesByRoles(utenteInUfficio, rolesToFilter);
                            if (offices.contains(referentiProtocollo.getIdDestinatario()) && utenteInUfficio.email != null) {
                                listRecipientNotifica.add(utenteInUfficio);
                            }
                        }
                        */

                        try {
                            List<PecPeo> listCdrPeo = em.createNamedQuery("findAllPecPeoByCdr", PecPeo.class)
                                    .setParameter("cdrCode", referentiProtocollo.getIdDestinatario())
                                    .getResultList();
                            for(PecPeo cdrPeo : listCdrPeo) {
                                if (cdrPeo.isAttiva() && cdrPeo.getConfigurazione().getTipologiaPosta().isPeo() && cdrPeo.getIdUtente() == null) {
                                    Office cdrForNotifica = new Office();
                                    cdrForNotifica.code = referentiProtocollo.getIdDestinatario();
                                    cdrForNotifica.description = cdrPeo.getIndirizzoEmail(); //NOTA: usiamo il campo description per memorizzare la peo dell'ufficio
                                    cdrForNotifica.name = referentiProtocollo.getNomeDestinatario();
                                    listRecipientCdrNotifica.add(cdrForNotifica);
                                }
                            }
                        }
                        catch (Exception ignored) {}
                    }
                }
            }

            // Lista che conterrà tutti gli id delle notifiche da inviare
            List<Long> notificheToSendList = new ArrayList<>();
            EmailTemplate template = emailTemplateService.getTemplate(Operazione.assegnazione, "notifica");
            if ( (!listRecipientNotifica.isEmpty() || !listRecipientCdrNotifica.isEmpty()) && template != null) {
                log.info(LOG_PEO_NOTIFICA, peoInvioNotifica.getIndirizzoEmail());

                for(DatiUtenteSlimSSO recipientNotifica : listRecipientNotifica) {
                    String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                    String sbCorpoEmailNotifica = template.getCorpo()
                            .replace("{{headerCorpo}}", oggettoEmailNotifica)
                            .replace("{{cognomeUtenteTO}}", recipientNotifica.lastName)
                            .replace("{{nomeUtenteTO}}", recipientNotifica.firstName)
                            .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                            .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                            .replace("{{numero}}", protocollo.getNProtocollo())
                            .replace("{{oggetto}}", protocollo.getOggetto())
                            .replace("{{obiettivoLavorazione}}", "Assegnazione per competenza")
                            .replace("{{noteAssegnazione}}", noteAssegnazione != null ? noteAssegnazione : "-")
                            .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));


                    Long idNotifica = notificaService.newNotifica(
                            protocollo.getId(),
                            peoInvioNotifica.getIndirizzoEmail(),
                            recipientNotifica.email,
                            oggettoEmailNotifica,
                            sbCorpoEmailNotifica,
                            Operazione.assegnazione.toString());

                    if (idNotifica != null) {
                        notificheToSendList.add(idNotifica);
                    }
                }
                for(Office recipientSSO : listRecipientCdrNotifica) {
                    String obiettivoLavorazione = "Assegnazione per competenza";

                    String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                    String sbCorpoEmailNotifica = template.getCorpo()
                            .replace("{{headerCorpo}}", oggettoEmailNotifica)
                            .replace("{{cognomeUtenteTO}}", "("+recipientSSO.code+")")
                            .replace("{{nomeUtenteTO}}", recipientSSO.name)
                            .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                            .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                            .replace("{{numero}}", protocollo.getNProtocollo())
                            .replace("{{oggetto}}", protocollo.getOggetto())
                            .replace("{{obiettivoLavorazione}}",  obiettivoLavorazione)
                            .replace("{{noteAssegnazione}}", noteAssegnazione != null ? noteAssegnazione : "-")
                            .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

                    Long idNotifica = notificaService.newNotifica(
                            protocollo.getId(), peoInvioNotifica.getIndirizzoEmail(),
                            recipientSSO.description, //NOTA: usiamo il campo description per memorizzare la peo dell'ufficio
                            oggettoEmailNotifica,
                            sbCorpoEmailNotifica,
                            Operazione.assegnazione.toString());

                    if (idNotifica != null) {
                        notificheToSendList.add(idNotifica);
                    }
                }
            } else{
                StringBuilder errorSb = new StringBuilder("[Attenzione] - Problematica durante la preparazione delle notifiche peo ")
                        .append("in fase di: [%s] - ")
                        .append("del protocollo: [%s] - ")
                        .append("Template: %s - " )
                        .append("peoInvioNotifica: %s ");

                String fullMessage = String.format(
                        errorSb.toString(),
                        Operazione.assegnazione,
                        protocollo.getId(),
                        template == null ? "null" : template.getId(),
                        peoInvioNotifica == null ? "null" : peoInvioNotifica.getIndirizzoEmail());

                log.error(fullMessage);
            }

            StringBuilder assegnatariSb = new StringBuilder();
            PanacheQuery<ReferentiProtocollo> queryAssegnatari = getQueryForAssegnatariIdProtocollo(idProtocollo);
            List<ReferentiProtocollo> listAssegnatari = queryAssegnatari.list();
            for(ReferentiProtocollo rp : listAssegnatari) {
                assegnatariSb.append(rp.getNomeDestinatario())
                        .append(", ");
            }
            protocollo.setAssegnatari(assegnatariSb.length() > 2 ? assegnatariSb.substring(0, assegnatariSb.length() - 2) : "");
            boolean isTag = listAssegnatari.stream().anyMatch(r -> r.getTipoDestinatario() != null && r.getTipoDestinatario().equalsIgnoreCase("tag"));
            protocollo.setStato(protocollo.computeStatoProtocollo(listAssegnatari, isTag));
            protocollo.persistAndFlush();

            // si inviano in blocco tutte le notifiche per garantire il contesto delle transactions
            sendNotificaClient.sendNotifiche(notificheToSendList);

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return true;

        }catch (Exception e){
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(
                    CustomException.ErrorCode.INTERNAL,
                    "Errore nell'assegnazione del protocollo: {}", e.getMessage()).boom();
            return false;
        }
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public boolean revocaAssegnazioneProtocollo(Long referentiProtocolloId){
        if(referentiProtocolloId == null){
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "L'ID non puo' essere null");
        }
        ReferentiProtocollo rp = ReferentiProtocollo.findById(referentiProtocolloId);
        if(rp == null){
            log.error("Nessun record trovato in referenti_protocollo per l'ID {}", referentiProtocolloId);
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Problematica interna per la revoca dell'assegnazione");
        }
        checkRevocaAssegnazione(rp, ssoManager.extractIdFromToken());
        String operazioneStorico = String.format("ha revocato l'assegnazione del Protocollo a %s.", rp.getNomeDestinatario());
        Protocollo protocollo = Protocollo.findById(rp.getIdProtocollo());
        storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), operazioneStorico, null);
        if(rp.isCreationOption()){
            rp.setAssegnato(false);
            rp.persistAndFlush();
        }else {
            rp.delete();
        }
        updateStatoAfterRevoca(protocollo);

        //NOTA: inviare una notifica di revoca all'assegnatario
        List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
        String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
        String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
        PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();
        if (peoInvioNotifica != null) {

            EmailTemplate template = emailTemplateService.getTemplate(Operazione.revoca, "notifica");

            String notificaLastNameTo = "";
            String notificaFirstNameTo = "";
            String notificaEmailTo = "";
            if (rp.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome())) {
                try {
                    List<PecPeo> listCdrPeo = em.createNamedQuery("findAllPecPeoByCdr", PecPeo.class)
                            .setParameter("cdrCode", rp.getIdDestinatario())
                            .getResultList();
                    for(PecPeo cdrPeo : listCdrPeo) {
                        if (cdrPeo.isAttiva() && cdrPeo.getConfigurazione().getTipologiaPosta().isPeo() && cdrPeo.getIdUtente() == null) {
                            notificaLastNameTo = rp.getNomeDestinatario();
                            notificaEmailTo = cdrPeo.getIndirizzoEmail();
                        }
                    }
                }
                catch (Exception ignored) {}
            }
            else {
                DatiUtenteSSO recipientNotifica = ssoManager.getUserByAuthId(rp.getIdDestinatario(), Integer.valueOf(applicationId));
                if (recipientNotifica.email != null) {
                    notificaLastNameTo = recipientNotifica.lastName;
                    notificaFirstNameTo = recipientNotifica.firstName;
                    notificaEmailTo = recipientNotifica.email;
                }
            }

            if (notificaEmailTo != null && !notificaEmailTo.isEmpty()) {
                String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
                String sbCorpoEmailNotifica = template.getCorpo()
                        .replace("{{headerCorpo}}", oggettoEmailNotifica)
                        .replace("{{cognomeUtenteTO}}", notificaLastNameTo)
                        .replace("{{nomeUtenteTO}}", notificaFirstNameTo)
                        .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                        .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                        .replace("{{numero}}", protocollo.getNProtocollo())
                        .replace("{{oggetto}}", protocollo.getOggetto());

                Long idNotifica = notificaService.newNotifica(
                        protocollo.getId(), peoInvioNotifica.getIndirizzoEmail(),
                        notificaEmailTo,
                        oggettoEmailNotifica,
                        sbCorpoEmailNotifica,
                        Operazione.revoca.toString());

                if (idNotifica != null) {
                    sendNotificaClient.sendNotifica(idNotifica);
                }
            }
        }

        return true;
    }

    @Transactional
    public void updateStatoAfterRevoca(Protocollo protocollo){
            List<ReferentiProtocollo> referentiList = ReferentiProtocollo.list("idProtocollo",protocollo.getId());
            boolean isTag = referentiList.stream().anyMatch(r -> r.getTipoDestinatario() != null && r.getTipoDestinatario().equalsIgnoreCase("tag"));
        protocollo.setStato(protocollo.computeStatoProtocollo(this.getAssegnatariPerCompetenza(referentiList), isTag));
        protocollo.persist();
    }

    private void checkRevocaAssegnazione(ReferentiProtocollo rp, String idUtente){
        if(!rp.getIdMittente().equalsIgnoreCase(idUtente)){
            log.error("L'utente con ID {} non è abilitato alla revoca dell'assegnazione con ID {}", idUtente, rp.getId());
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Utente non abilitato alla revoca dell'assegnazione");
        }
        if(rp.getTipoDestinatario().equalsIgnoreCase("utente") && !StatoProtocollo.DaPrendereInCarico.toString().equalsIgnoreCase(rp.getStatoProtocollo().toString())){
            log.error("Errore revoca assegnazione, record ID {}, stato {}", rp.getId(), rp.getIdProtocollo().toString());
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile revocare l'assegnazione. Stato: " + rp.getStatoProtocollo().toString());
        }
        if (!rp.getAttribuzione().equalsIgnoreCase("competenza")) {
            log.error("Errore revoca assegnazione, l'attribuzione non è di competenza. ID {}", rp.getId());
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile revocare l'assegnazione. L'attribuzione non è di competenza");
        }
        /*if (!rp.getTipoDestinatario().equalsIgnoreCase("utente")) {
            log.error("Errore revoca assegnazione, il tipo destinatario non è utente. ID {}", rp.getId());
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile revocare l'assegnazione. Il tipo destinatario non è utente");
        }*/
    }

    public boolean rifiutoProtocolloMassiva(List<String> numbers, String selectedOffice, String note){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if(numbers.isEmpty()){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Nessun Protocollo/Circolare selezionato per il rifiuto").boom();
        }
        // Eseguiamo un primo ciclo per intercettare eventuali incongruenze in riferimento il rifiuto protocollo
        for(String nProtocollo : numbers){
            try{
                DettaglioProtocolloDTO dettaglioProtocolloDTO = this.getDettaglioProtocollo(nProtocollo, selectedOffice);
                if(dettaglioProtocolloDTO.getProtocollo().getStato().equals(StatoProtocollo.Annullato)){
                    CustomException.get(CustomException.ErrorCode.INTERNAL, String.format("Errore durante l'operazione di rifiuto. Il Protocollo/Circolare %s risulta Annullato", nProtocollo)).boom();

                }
                if(!dettaglioProtocolloDTO.isRifiuta()){
                    CustomException.get(CustomException.ErrorCode.INTERNAL, String.format("Utente non abilitato al rifiuto del Protocollo/Circolare %s.", nProtocollo)).boom();
                }
            }catch (Exception e){
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                CustomException.get(CustomException.ErrorCode.INTERNAL,e.getMessage()).boom();
            }
        }

        // Eseguiamo il secondo ciclo per effettuare l'effettivo rifiuto
        for(String nProtocollo : numbers){
            try {
                this.rifiutaProtocollo(nProtocollo, note, selectedOffice);
            }catch (Exception e){
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();

            }
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    /**
     * Servizio che consente ad un utente destinatario per competenza di un protocollo di rifiutarlo
     * 1) Aggiorna la colonna assegnatari della tabella protocollo
     * 2) Inserisce l'operazione nello storico
     * 3) Manda una mail di notifica all'utente che ha assegnato l'utente che rifiuta
     * @param nProtocollo - Numero protocollo
     * @param note - Note facoltative
     * @return
     */
    @Transactional
    public boolean rifiutaProtocollo(String nProtocollo, String note, String selectedOffice) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try{
            Protocollo protocollo = getProtocolloByNumero(nProtocollo);

            log.info("Rifiuto del protocollo con id: {} - da parte dell'utente: {} - dall'ufficio: {}",
                    protocollo.getId(),
                    ssoManager.extractNameFromToken(),
                    selectedOffice);

            referentiProtocolloService.updateStatoProtocollo(protocollo, StatoProtocollo.Rifiutato, Operazione.rifiuto, selectedOffice, note);
        }catch (Exception e){
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,e).boom();
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    private PanacheQuery<ReferentiProtocollo> getQueryForAssegnatariIdProtocollo(Long idProtocollo) {
        StringBuilder query = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        query.append("idProtocollo = :idProtocollo and lower(attribuzione) = 'competenza'");
        params.put("idProtocollo", idProtocollo);

        return ReferentiProtocollo.find(query.toString(), params);
    }

    private PanacheQuery<ReferentiProtocollo> getQueryForReferentiIdProtocollo(Long idProtocollo, DatiUtenteSSO datiUtenteSSO) {
        StringBuilder query = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        query.append("idProtocollo = :idProtocollo ");
        params.put("idProtocollo", idProtocollo);

        query.append("and ( ( lower(tipoDestinatario) = 'utente' and lower(attribuzione) = 'competenza' and lower(idDestinatario) = lower(:idDestinatarioUtente) ) ");
        params.put("idDestinatarioUtente", datiUtenteSSO.auth_id);

        List<String> offices = ssoManager.extractOfficesByRoles(datiUtenteSSO);
        if (!offices.isEmpty()) {
            for(String office : offices) {
                query.append("or ( lower(idDestinatario) = :u").append(office);
                query.append(" and lower(tipoDestinatario) = 'ufficio' and lower(attribuzione) = 'competenza' ) ");
                params. put("u".concat(office), office.toLowerCase());
            }
        }
        query.append(")");

        return ReferentiProtocollo.find(query.toString(), params);
    }


    @Override
    public PanacheQuery<Protocollo> getFindAllQuery(String search, SortInput sort) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }

    @Override
    public PanacheQuery<Protocollo> getFindByIdQuery(Long id) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }

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

    private void appendDestinatariConditionNative(StringBuilder query, Map<String, Object> params, List<String> tagList) {
        if (tagList == null || tagList.isEmpty()) {
            return;
        }

        query.append("AND (");

        for (int i = 0; i < tagList.size(); i++) {
            String paramName = "destinatari" + i;
            query.append("lower(destinatari) LIKE LOWER(concat('%', :").append(paramName).append(", '%'))");

            if (i < tagList.size() - 1) {
                query.append(" OR ");
            }

            params.put(paramName, tagList.get(i).trim());
        }

        query.append(") ");
    }
    private void appendDestinatariCondition(StringBuilder query, Map<String, Object> params, List<String> tagList) {
        if (tagList == null || tagList.isEmpty()) {
            return;
        }

        query.append("AND (");

        for (int i = 0; i < tagList.size(); i++) {
            String paramName = "destinatari" + i;
            query.append("lower(destinatari) LIKE LOWER(concat('%', :").append(paramName).append(", '%'))");

            if (i < tagList.size() - 1) {
                query.append(" OR ");
            }

            params.put(paramName, tagList.get(i).trim());
        }

        query.append(") ");
    }

    public FileUploadForm buildSignatureXML(String oggetto, SegnaturaInput input) throws Exception {
        JAXBContext jaxbContext = JAXBContext.newInstance(SegnaturaInformaticaType.class);
        Marshaller marshaller = jaxbContext.createMarshaller();
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

        ObjectFactory factory = new ObjectFactory();
        SegnaturaInformaticaType segnatura = factory.createSegnaturaInformaticaType();
        SignatureType signatureType = new SignatureType();
        SignatureValueType signatureValueType = new SignatureValueType();
        SignedInfoType signedInfoType = new SignedInfoType();
        ReferenceType referenceType = new ReferenceType();
        referenceType.setDigestValue(new byte[]{1, 2, 3, 4});
        TransformsType transformsType = new TransformsType();
        TransformType transformType = new TransformType();
        transformType.setAlgorithm("http://www.w3.org/2000/09/xmldsig#enveloped-signature");
        transformsType.getTransform().add(transformType);
        referenceType.setTransforms(transformsType);
        DigestMethodType digestMethodType = new DigestMethodType();
        digestMethodType.setAlgorithm("http://www.w3.org/2000/09/xmldsig#sha1");
        referenceType.setDigestMethod(digestMethodType);
        signedInfoType.getReference().add(referenceType);
        SignatureMethodType signatureMethodType = new SignatureMethodType();
        signatureMethodType.setAlgorithm("http://www.w3.org/2000/09/xmldsig#rsa-sha1");
        signedInfoType.setSignatureMethod(signatureMethodType);
        CanonicalizationMethodType canonicalizationMethodType = new CanonicalizationMethodType();
        canonicalizationMethodType.setAlgorithm("http://www.w3.org/TR/2001/REC-xml-c14n-20010315");
        signedInfoType.setCanonicalizationMethod(canonicalizationMethodType);
        signatureType.setSignedInfo(signedInfoType);
        signatureValueType.setValue(new byte[]{1, 2, 3, 4});
        signatureType.setSignatureValue(signatureValueType);
        segnatura.setSignature(signatureType);
        segnatura.setVersione("3.0.0");
        segnatura.setLang("it");

        IntestazioneType intestazione = factory.createIntestazioneType();
        IdentificatoreType identificatore = factory.createIdentificatoreType();
        CodiceIPA codiceAmministrazione = factory.createCodiceIPA();
        codiceAmministrazione.setValue(input.getCodiceIpaMittente()); //configurazioneService.getCodiceIpa(configurazioni));
        identificatore.setCodiceAmministrazione(codiceAmministrazione);
        CodiceIPA codiceAOO = factory.createCodiceIPA();
        codiceAOO.setValue(input.getCodiceAooMittente()); //configurazioneService.getCodiceAoo(configurazioni));
        identificatore.setCodiceAOO(codiceAOO);
        identificatore.setNumeroRegistrazione(input.getNumeroRegistrazione()); //protocollo.getNumeroProgressivoForSignature());
        identificatore.setCodiceRegistro(input.getCodiceAooMittente()); // configurazioneService.getCodiceAoo(configurazioni));
        XMLGregorianCalendar dataReg = DatatypeFactory.newInstance().newXMLGregorianCalendar(input.getDataRegistrazione()); // protocollo.getTsCreationFormatted());
        identificatore.setDataRegistrazione(dataReg);
        intestazione.setIdentificatore(identificatore);
        intestazione.setOggetto(input.getOggetto());
        RiservatoType riservatoType = factory.createRiservatoType();
        riservatoType.setValue(true);
        intestazione.setRiservato(riservatoType);
        ClassificaType classificaType = factory.createClassificaType();

        classificaType.setCodiceFlat("-");
        classificaType.setDenominazione("-");
        if (input.getFascicoloCodiceFlat() != null) {
            classificaType.setCodiceFlat(input.getFascicoloCodiceFlat());
            classificaType.setDenominazione(input.getFascicoloNome());
        }
        classificaType.setCodicePath(null);
        intestazione.setClassifica(classificaType);

        segnatura.setIntestazione(intestazione);

        DescrizioneType descrizioneType = factory.createDescrizioneType();
        SoggettoType soggettoType = factory.createSoggettoType();
        AmministrazioneType amministrazioneType = factory.createAmministrazioneType();
        amministrazioneType.setDenominazioneAmministrazione(input.getDenominazioneMittente()); //configurazioneService.getDenominazioneAmministrazione(configurazioni));
        amministrazioneType.setCFAmministrazione(input.getCfMittente()); //configurazioneService.getCfAmministrazione(configurazioni));
        CodiceIPA codiceIPA = factory.createCodiceIPA();
        codiceIPA.setValue(input.getCodiceIpaMittente()); //configurazioneService.getCodiceIpa(configurazioni));
        amministrazioneType.setCodiceIPAAmministrazione(codiceIPA);
        soggettoType.setAmministrazione(amministrazioneType);
        descrizioneType.setMittente(soggettoType);

        for(SegnaturaDestinatarioInput dest : input.getDestinatari()) {
            DestinatarioType destinatarioType = factory.createDestinatarioType();
            destinatarioType.setPerConoscenza(dest.isConoscenza); //rp.getAttribuzione().equalsIgnoreCase("conoscenza"));

            if (dest.isTipoEnte()) {
                AmministrazioneType ammType = factory.createAmministrazioneType();
                ammType.setDenominazioneAmministrazione(dest.denominazione);
                CodiceIPA codiceIPADestinatario = factory.createCodiceIPA();
                codiceIPADestinatario.setValue("N.D.");
                ammType.setCodiceIPAAmministrazione(codiceIPADestinatario);
                destinatarioType.setAmministrazione(ammType);
            } else if (dest.isTipoUfficio()) {
                PersonaGiuridicaType pgType = factory.createPersonaGiuridicaType();
                pgType.setDenominazione(dest.denominazione);
                destinatarioType.setPersonaGiuridica(pgType);
            } else if (dest.isTipoUtente()) {
                PersonaFisicaType pfType = factory.createPersonaFisicaType();
                pfType.setNome(dest.nome);
                pfType.setCognome(dest.cognome);
                destinatarioType.setPersonaFisica(pfType);
            } else {
                PersonaGiuridicaType pgType = factory.createPersonaGiuridicaType();
                pgType.setDenominazione(dest.denominazione);
                destinatarioType.setPersonaGiuridica(pgType);
            }
            descrizioneType.getDestinatario().add(destinatarioType);
        }

        if (input.getRiferimentoProtocolloSegnaturaDTO() != null) {
            RiferimentiType riferimentoProtEsterno = factory.createRiferimentiType();

            IdentificatoreType identificatoreTypeProtEsterno = factory.createIdentificatoreType();

            CodiceIPA ipaProtEsterno = factory.createCodiceIPA();
            ipaProtEsterno.setValue(input.getRiferimentoProtocolloSegnaturaDTO().getCodiceIpa());
            identificatoreTypeProtEsterno.setCodiceAmministrazione(ipaProtEsterno);

            CodiceIPA aooProtEsterno = factory.createCodiceIPA();
            aooProtEsterno.setValue(input.getRiferimentoProtocolloSegnaturaDTO().getCodiceAOO());
            identificatoreTypeProtEsterno.setCodiceAOO(aooProtEsterno);

            identificatoreTypeProtEsterno.setCodiceRegistro(input.getRiferimentoProtocolloSegnaturaDTO().getCodiceRegistro());

            identificatoreTypeProtEsterno.setNumeroRegistrazione(input.getRiferimentoProtocolloSegnaturaDTO().getNumero());

            XMLGregorianCalendar rifDataRegistrazione = DatatypeFactory.newInstance().newXMLGregorianCalendar(input.getRiferimentoProtocolloSegnaturaDTO().getDataRegistrazione()); // protocollo.getTsCreationFormatted());
            identificatoreTypeProtEsterno.setDataRegistrazione(rifDataRegistrazione);

            if (input.getRiferimentoProtocolloSegnaturaDTO().getOraRegistrazione() != null) {
                XMLGregorianCalendar rifOraRegistrazione = DatatypeFactory.newInstance().newXMLGregorianCalendar(input.getRiferimentoProtocolloSegnaturaDTO().getOraRegistrazione());
                identificatoreTypeProtEsterno.setOraRegistrazione(rifOraRegistrazione);
            }

            riferimentoProtEsterno.setIdentificatore(identificatoreTypeProtEsterno);
            riferimentoProtEsterno.setOggetto(input.getRiferimentoProtocolloSegnaturaDTO().getOggetto());

            ClassificaType classificaProtEsterno = factory.createClassificaType();
            classificaProtEsterno.setCodiceFlat("-");
            classificaProtEsterno.setDenominazione("-");
            if (input.getRiferimentoProtocolloSegnaturaDTO().getClassificazione() != null) {
                classificaProtEsterno.setDenominazione(input.getRiferimentoProtocolloSegnaturaDTO().getClassificazione());
            }
            classificaProtEsterno.setCodicePath(null);
            riferimentoProtEsterno.setClassifica(classificaProtEsterno);

            segnatura.setRiferimenti(riferimentoProtEsterno);
        }


        DocumentoType documentoType = factory.createDocumentoType();
        documentoType.setNomeFile(input.getNomeAllegato());
        documentoType.setMimeType(input.getMimeTypeAllegato());
        ImprontaType improntaType = factory.createImprontaType();
        improntaType.setValue(input.getImprontaBytes());
        documentoType.setImpronta(improntaType);
        descrizioneType.setDocumentoPrimario(documentoType);
        segnatura.setDescrizione(descrizioneType);

        // Create a JAXBElement from the SegnaturaInformaticaType object
        JAXBElement<SegnaturaInformaticaType> jaxbElement = factory.createSegnaturaInformatica(segnatura);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        marshaller.marshal(segnatura, outputStream);

        // Create a DOM document to hold the XML
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        Document document = dbf.newDocumentBuilder().newDocument();
        marshaller.marshal(jaxbElement, new DOMResult(document));

        // Load the schema from the classpath with custom ResourceResolver
        SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);

        schemaFactory.setResourceResolver(new LSResourceResolver() {
            @Override
            public LSInput resolveResource(String type, String namespaceURI, String publicId, String systemId, String baseURI) {
                if (systemId.endsWith("xmldsig-core-schema.xsd")) {
                    InputStream stream = getClass().getResourceAsStream("/xsd/import_schemas/xmldsig-core-schema.xsd");
                    //InputStream stream = minioFactory.downloadFile("pi-docs","xsd/import_schemas/xmldsig-core-schema.xsd");
                    if (stream == null) {
                        throw new RuntimeException("XSD file xmldsig-core-schema.xsd not found in classpath");
                    }
                    return new LSInput() {
                        @Override
                        public InputStream getByteStream() {
                            return stream;
                        }

                        @Override
                        public void setByteStream(InputStream byteStream) {
                        }

                        @Override
                        public String getStringData() {
                            return null;
                        }

                        @Override
                        public void setStringData(String stringData) {
                        }

                        @Override
                        public Reader getCharacterStream() {
                            return null;
                        }

                        @Override
                        public void setCharacterStream(Reader characterStream) {
                        }

                        @Override
                        public String getSystemId() {
                            return systemId;
                        }

                        @Override
                        public void setSystemId(String systemId) {
                        }

                        @Override
                        public String getPublicId() {
                            return publicId;
                        }

                        @Override
                        public void setPublicId(String publicId) {
                        }

                        @Override
                        public String getBaseURI() {
                            return baseURI;
                        }

                        @Override
                        public void setBaseURI(String baseURI) {
                        }

                        @Override
                        public String getEncoding() {
                            return null;
                        }

                        @Override
                        public void setEncoding(String encoding) {
                        }

                        @Override
                        public boolean getCertifiedText() {
                            return false;
                        }

                        @Override
                        public void setCertifiedText(boolean certifiedText) {
                        }
                    };
                }
                return null;
            }
        });


        URL mainSchemaURL = getClass().getResource("/xsd/segnatura_protocollo.xsd");
        InputStream mainSchemaStream = mainSchemaURL.openStream();
        //InputStream mainSchemaStream = minioFactory.downloadFile("pi-docs","xsd/segnatura_protocollo.xsd");
        if (mainSchemaStream == null) {
            throw new FileNotFoundException("XSD file segnatura_protocollo.xsd not found in classpath");
        }

        Schema schema = schemaFactory.newSchema(new StreamSource(mainSchemaStream));
        marshaller.setSchema(schema);

        FileUploadForm fileUploadForm = new FileUploadForm();
        fileUploadForm.setFileName("Segnatura.xml");
        fileUploadForm.setOggetto(oggetto); //"Segnatura " + input.getNProtocollo());
        fileUploadForm.setIsMain("0");
        fileUploadForm.setDimensione((long) outputStream.toByteArray().length);
        fileUploadForm.setCollocazioneTelematica("");
        fileUploadForm.setFileData(outputStream.toByteArray());

        return fileUploadForm;
    }

    private List<Office> getUfficiFiltered(List<Office> allOffices, List<DatiUtenteSlimSSO> utentiList, Set<String> officeCodesSearched, String searchFilter) {
        if (!officeCodesSearched.isEmpty()) {
            List<Office> ufficiFiltered = new ArrayList<>();
            for(Office office : allOffices) {
                if (officeCodesSearched.contains(office.code))
                    ufficiFiltered.add(office);
            }
            return ufficiFiltered;
        }
        HashMap<String, Long> ufficiWithUserFiltered = new HashMap<>();
        for (DatiUtenteSlimSSO utente : utentiList) {
            for (String officeCdrCode : utente.cdrCodes.keySet()) {
                if (officeCdrCode == null)
                    continue;
                if (!ufficiWithUserFiltered.containsKey(officeCdrCode)) {
                    ufficiWithUserFiltered.put(officeCdrCode, 1L);
                }
            }
        }

        List<Office> ufficiFiltered = new ArrayList<>();
        for(Office office : allOffices) {
            if (office.name == null)
                continue;

            if (searchFilter.isBlank() || ufficiWithUserFiltered.containsKey(office.code)) {
                ufficiFiltered.add(office);
                continue;
            }
            if ((searchFilter.isBlank() || office.name.toLowerCase().contains(searchFilter) || office.description.toLowerCase().contains(searchFilter))) {
                ufficiFiltered.add(office);
                continue;
            }
        }
        return ufficiFiltered;
    }
    private HashMap<String, ReferenteOutputDTO> getMapUfficiFromUtenti(List<Office> allUffici, List<DatiUtenteSlimSSO> utentiList) {
        HashMap<String, Long> hashUtenti = new HashMap<>();
        HashMap<String, ReferenteOutputDTO> hashUffici = new HashMap<>();
        for (DatiUtenteSlimSSO utente : utentiList) {
            for(String officeCdrCode : utente.cdrCodes.keySet()) {
                if (officeCdrCode == null)
                    continue;

                Office officeToUse = null;
                for(Office o : allUffici) {
                    if (o.code.equalsIgnoreCase(officeCdrCode)) {
                        officeToUse = o;
                        break;
                    }
                }
                if (officeToUse == null)
                    continue;

                ReferenteOutputDTO utenteOutput = new ReferenteOutputDTO();
                utenteOutput.setId(UUID.randomUUID().toString());
                utenteOutput.setIdDestinatario(utente.authId);

                String lblToUse = utente.firstName.concat(" ").concat(utente.lastName);
                utenteOutput.setLabel(lblToUse);
                utenteOutput.setTipo(TipoDestinatarioReferente.UTENTE.getNome());
                utenteOutput.setChildren(null);

                if ( (!hashUffici.containsKey(officeToUse.name)) ) {
                    ReferenteOutputDTO ufficio = new ReferenteOutputDTO();
                    ufficio.setId(UUID.randomUUID().toString());
                    ufficio.setIdDestinatario(officeToUse.code);
                    ufficio.setTipo(TipoDestinatarioReferente.UFFICIO.getNome());

                    StringBuilder lblToUseOfficeBuilder = new StringBuilder();
                    if (officeToUse.name != null) {
                        lblToUseOfficeBuilder.append("(").append(officeToUse.name).append(") ");
                    }
                    if (officeToUse.description != null) {
                        lblToUseOfficeBuilder.append(officeToUse.description).append(" ");
                    }

                    if (officeToUse.service != null) {
                        lblToUseOfficeBuilder.append("- ").append(officeToUse.service);
                    }
                    ufficio.setLabel(lblToUseOfficeBuilder != null ? lblToUseOfficeBuilder.toString() : "-");

                    ufficio.setChildren(new ArrayList<>());
                    hashUffici.put(officeToUse.name, ufficio);
                }

                if (hashUffici.containsKey(officeToUse.name))
                    hashUffici.get(officeToUse.name).getChildren().add(utenteOutput);
                else {
                    String lblUtente = utenteOutput.getLabel();
                    utenteOutput.setLabel("(".concat(officeToUse.name).concat(") ").concat(lblUtente));

                    hashUffici.put(utente.authId, utenteOutput);
                }

                if (!hashUtenti.containsKey(utente.authId)) {
                    hashUtenti.put(utente.authId, 1L);
                    //numElementiInseriti += 1;
                }
            }
        }
        return hashUffici;
    }
    private HashMap<String, ReferenteOutputDTO> addLonelyOffices(HashMap<String, ReferenteOutputDTO> hashUffici, List<Office> officesToAddToList, int numElementiInseriti, Integer size) {
        for(Office officeToAdd : officesToAddToList) {
            if (numElementiInseriti < size && (!hashUffici.containsKey(officeToAdd.name))) {
                ReferenteOutputDTO ufficio = new ReferenteOutputDTO();
                ufficio.setId(UUID.randomUUID().toString());
                ufficio.setIdDestinatario(officeToAdd.code);
                ufficio.setTipo(TipoDestinatarioReferente.UFFICIO.getNome());

                StringBuilder labelBuilder = new StringBuilder();
                if (officeToAdd.name != null) {
                    labelBuilder.append("(").append(officeToAdd.name).append(") ");
                }
                if (officeToAdd.short_description != null) {
                    labelBuilder.append(officeToAdd.short_description).append(" ");
                }
                ufficio.setLabel(labelBuilder != null ? labelBuilder.toString() : "-");
                ufficio.setChildren(null);
                hashUffici.put(officeToAdd.name, ufficio);
                numElementiInseriti += 1;
            }
        }
        return hashUffici;
    }
    private void addUserToOrganigrammaResults(Office o, DatiUtenteSlimSSO u, boolean userIsAdmin, List<ReferenteOutputDTO> results) {
        ReferenteOutputDTO utenteOutput = null;
        if (u != null) {
            utenteOutput = new ReferenteOutputDTO();
            utenteOutput.setId(UUID.randomUUID().toString());
            utenteOutput.setIdDestinatario(u.authId);
            String lblToUse = u.lastName.concat(" ").concat(u.firstName);
            if (userIsAdmin)
                lblToUse += " (Amministratore di sistema)";
            utenteOutput.setLabel(lblToUse); //u.getLabelForOffice(o.code));
            utenteOutput.setTipo(TipoDestinatarioReferente.UTENTE.getNome());
            utenteOutput.setChildren(null);
        }

        for(ReferenteOutputDTO officeResult : results) {
            if (officeResult.getIdDestinatario().equalsIgnoreCase(o.code)) {
                if (utenteOutput != null)
                    officeResult.getChildren().add(utenteOutput);
                return;
            }
        }

        ReferenteOutputDTO ufficioOutput = new ReferenteOutputDTO();
        ufficioOutput.setId(UUID.randomUUID().toString());
        ufficioOutput.setIdDestinatario(o.code);
        ufficioOutput.setTipo(TipoDestinatarioReferente.UFFICIO.getNome());

        StringBuilder labelBuilder = new StringBuilder();
        if (o.name != null) {
            labelBuilder.append(o.name).append(" - ");
    }
        if (o.short_description != null) {
            labelBuilder.append(o.short_description).append(" ");
        }
        ufficioOutput.setLabel(labelBuilder != null ? labelBuilder.toString() : "-");
        if (utenteOutput != null)
            ufficioOutput.setChildren(new ArrayList<>(List.of(utenteOutput)));
        else
            ufficioOutput.setChildren(null);
        results.add(ufficioOutput);
    }
    public ReferentiOutputDTO getOrganigramma(RicercaReferentiDTO dto) {

        List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
        String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);

        String searchFilter = InputUtils.normalizeSearchInput(dto.getSearch());

        ReferentiOutputDTO output = new ReferentiOutputDTO();
        List<ReferenteOutputDTO> referenti = new ArrayList<>();
        output.setReferenti(referenti);
        output.setPageCount(0);

        List<DatiUtenteSlimSSO> allAdmins = ssoManager.getAdminsForApplicationSlim(Integer.valueOf(applicationId));

        List<Office> allOfficesFromSSO = /*dto.isNoCache() ? ssoManager.forceGetOffices("") : */ ssoManager.getOffices("");
        allOfficesFromSSO.sort((o1, o2) -> o1.name.compareTo(o2.name));
        /*
        List<Office> allOffices = allOfficesFromSSO.stream()
                .filter(o -> {
                    if (searchFilter.isBlank()) return true;
                    if (o.name != null && o.name.equalsIgnoreCase(searchFilter)) return true;
                    if (o.description != null && o.description.equalsIgnoreCase(searchFilter)) return true;
                    if (o.short_description != null && o.short_description.equalsIgnoreCase(searchFilter)) return true;
                    return false;
                })
                .toList();
        */

        Map<String, String> allOfficesMapToUseInSearch = new HashMap<>();
        for (Office o : allOfficesFromSSO) {
            if (o.code != null) {
                allOfficesMapToUseInSearch.put(o.code, (o.name+" "+o.short_description+" "+o.description+" "+o.service).toLowerCase());
            }
        }


        List<DatiUtenteSlimSSO> utenti = /*dto.isNoCache() ? ssoManager.forceGetAllUtenti(applicationId) : */ ssoManager.getAllUtenti(applicationId);

        Map<String, String> usersAddedForSearchedOffice = new HashMap<>();
        Set<String> officeCodesSearched = new HashSet<>();

        Stream<DatiUtenteSlimSSO> utentiFilteredToRead = utenti.stream().filter(utente -> {
            if (!searchFilter.isBlank()) {
                for (String cdrCode : utente.cdrCodes.keySet()) {
                    if (allOfficesMapToUseInSearch.containsKey(cdrCode)) {
                        if (allOfficesMapToUseInSearch.get(cdrCode).contains(searchFilter)) {
                            usersAddedForSearchedOffice.put(utente.authId, cdrCode);
                            officeCodesSearched.add(cdrCode);
                            return true;
                        }
                    }
                }
            }
            return searchFilter.isBlank() ||
                    (utente.username != null && utente.username.toLowerCase().contains(searchFilter)) ||
                    (utente.lastName != null && utente.lastName.toLowerCase().contains(searchFilter)) ||
                    (utente.firstName != null && utente.firstName.toLowerCase().contains(searchFilter)) ||
                    (utente.firstName != null && utente.lastName != null &&
                            (utente.firstName.toLowerCase() + " " + utente.lastName.toLowerCase()).contains(searchFilter.toLowerCase())) ||
                    (utente.firstName != null && utente.lastName != null &&
                            (utente.lastName.toLowerCase() + " " + utente.firstName.toLowerCase()).contains(searchFilter.toLowerCase()));
        });
        List<DatiUtenteSlimSSO> utentiList = utentiFilteredToRead.toList();
        allOfficesMapToUseInSearch.clear();

        List<Office> ufficiFiltered = getUfficiFiltered(allOfficesFromSSO, utentiList, officeCodesSearched, searchFilter);

        int idxToStart = (dto.getPage()) * dto.getSize();
        int idxToEnd = idxToStart + dto.getSize();
        int totalUsers = 0;

        //Collect all users inside offices
        Map<Office, List<DatiUtenteSlimSSO>> hashUsersForOffices = new LinkedHashMap<>();
        for(Office o : ufficiFiltered) {
            List<DatiUtenteSlimSSO> utentiForOffice = new ArrayList<>();
            for(DatiUtenteSlimSSO u : utentiList) {
                if (!usersAddedForSearchedOffice.isEmpty()) {
                    if (usersAddedForSearchedOffice.containsKey(u.authId) && usersAddedForSearchedOffice.get(u.authId).equalsIgnoreCase(o.code)) {
                        utentiForOffice.add(u);
                    }
                }
                else if (u.cdrCodes.containsKey(o.code)) {
                    utentiForOffice.add(u);
                }
            }
            totalUsers += utentiForOffice.size();

            //NOTA: 23/09/2025
            // uffici vuoti non vengono inseriti in organigramma!
            if (!utentiForOffice.isEmpty()) {
                hashUsersForOffices.put(o, utentiForOffice);
            }

            //NOTA: codice per aggiunta in organigramma di uffici senza utenti
            /*
            if (utentiForOffice.isEmpty()) {
                totalUsers += 1;
            }
            hashUsersForOffices.put(o, utentiForOffice);
            */
        }

        List<ReferenteOutputDTO> results = new ArrayList<>();
        int idx = 0;
        for(Map.Entry<Office, List<DatiUtenteSlimSSO>> listUsersInOffice : hashUsersForOffices.entrySet()) {
            for(DatiUtenteSlimSSO d : listUsersInOffice.getValue()) {
                if (idx >= idxToStart && idx < idxToEnd) {
                    boolean isAdmin = false;
                    for(DatiUtenteSlimSSO admin : allAdmins) {
                        if (d.authId.equalsIgnoreCase(admin.authId)) {
                            isAdmin = true;
                            break;
                        }
                    }
                    addUserToOrganigrammaResults(listUsersInOffice.getKey(), d, isAdmin, results);
                }
                idx++;
            }
            if (listUsersInOffice.getValue().isEmpty()) {
                if (idx >= idxToStart && idx < idxToEnd) {
                    addUserToOrganigrammaResults(listUsersInOffice.getKey(), null, false, results);
                }
                idx++;
            }
        }
        //results.sort((o1, o2) -> o1.getLabel().compareToIgnoreCase(o2.getLabel()));
        output.setPageCount((long) Math.ceil((totalUsers) / (double) dto.getSize()));
        if (output.getPageCount() < dto.getPage()) {
            throw new RuntimeException("Pagina richiesta non trovata");
        }
        output.setReferenti(results);
        return output;
    }

    public ReferentiOutputDTO getContattiFromAnagrafica(RicercaReferentiDTO dto) {

        if(dto.getMetodoSpedizione() == null || dto.getMetodoSpedizione().isEmpty()){
            CustomException.get(CustomException.ErrorCode.INTERNAL,"per ricercare nella rubrica bisogna prima selezionare un metodo di spedizione").boom();
        }

        if (TipologiaRubrica.IPA.equals(dto.getTipologiaRubrica())) {
            if ( dto.getTipoRicercaIPA().equalsIgnoreCase("enti") && dto.getSearch() != null && (!dto.getSearch().isEmpty()) ) {
                return ipaService.getOutputDTOFromIpaEnte(dto.getSearch(), dto.getSize(), dto.getPage());
            }
            else if ( dto.getTipoRicercaIPA().equalsIgnoreCase("aoo") && dto.getIpaCodAmm() != null && (!dto.getIpaCodAmm().isEmpty()) ) {
                return ipaService.getOutputDTOFromIpaAOO(dto.getIpaCodAmm(), dto.getIpaCodAoo(), dto.getSearch(), dto.getSize(), dto.getPage());
            }
            else if ( dto.getTipoRicercaIPA().equalsIgnoreCase("uo") && dto.getIpaCodAmm() != null && (!dto.getIpaCodAmm().isEmpty()) ) {
                return ipaService.getOutputDTOFromIpaUO(dto.getIpaCodAmm(), dto.getSearch(), dto.getSize(), dto.getPage());
            }
            // default si torna una lista vuota
            ReferentiOutputDTO referentiOutputDTO = new ReferentiOutputDTO();
            referentiOutputDTO.setPageCount(0);
            referentiOutputDTO.setReferenti(new ArrayList<>());
            return referentiOutputDTO;
        }

        if(TipologiaRubrica.GRUPPI.equals(dto.getTipologiaRubrica())){
            RicercaGruppiDTO ricercaDTO = new RicercaGruppiDTO();
            ricercaDTO.setPage(dto.getPage());
            ricercaDTO.setSize(dto.getSize());
            ricercaDTO.setSearch(dto.getSearch());
            ricercaDTO.setSort(dto.getSort());
            return anagraficaService.getAllGruppiMappedToReferentiOutputDTO(dto.getMetodoSpedizione(), ricercaDTO);
        }

        //NOTA: In questa fase si tratta sicuramente di TipologiaRubrica.ANAGRAFICA_INTERNA
        RicercaAnagraficaDTO ricercaAnagraficaDto = new RicercaAnagraficaDTO();
        ricercaAnagraficaDto.setSearch(dto.getSearch());
        ricercaAnagraficaDto.setSize(dto.getSize());
        ricercaAnagraficaDto.setPage(dto.getPage());
        ricercaAnagraficaDto.setSort(dto.getSort());
        AnagraficaOutputDTO anagraficaInterna = anagraficaService.getAllAnagrafica(ricercaAnagraficaDto);

        ReferentiOutputDTO referentiOutputDTO = new ReferentiOutputDTO();
        referentiOutputDTO.setPageCount(anagraficaInterna.getPageCount());

        List<ReferenteOutputDTO> referenti = new ArrayList<>();
        for(Anagrafica contattoInterno : anagraficaInterna.getAnagraficaList()) {

            ReferenteOutputDTO referenteDto = new ReferenteOutputDTO();
            referenteDto.setTipo(TipoDestinatarioReferente.ANAGRAFICA_INTERNA.getNome());
            referenteDto.setId(contattoInterno.getId().toString());
            referenteDto.setIdDestinatario(contattoInterno.getId().toString());
            referenteDto.setChildren(null);

            referenteDto.setRagioneSociale(contattoInterno.getRagioneSociale());
            referenteDto.setCognome(contattoInterno.getCognome());
            referenteDto.setNome(contattoInterno.getNome());
            referenteDto.setCfPiva(contattoInterno.getCfPiva());
            referenteDto.setPec(contattoInterno.getPec());
            referenteDto.setEmail(contattoInterno.getEmail());
            referenteDto.setCitta(contattoInterno.getCitta());
            referenteDto.setCap(contattoInterno.getCap());
            referenteDto.setIndirizzo(contattoInterno.getIndirizzo());

            StringBuilder lblToOutput = new StringBuilder(contattoInterno.getRagioneSociale());
            if(contattoInterno.getCfPiva() != null && !contattoInterno.getCfPiva().isEmpty())
                lblToOutput.append(" ").append(contattoInterno.getCfPiva());

            if (dto.getMetodoSpedizione() != null && dto.getMetodoSpedizione().equalsIgnoreCase(String.valueOf(MetodoSpedizione.Pec))) {
                if (contattoInterno.getPec() != null && !contattoInterno.getPec().isEmpty())
                    lblToOutput.append(" (").append(contattoInterno.getPec()).append(")");
                else {
                    if (contattoInterno.getEmail() != null && !contattoInterno.getEmail().isEmpty())
                        lblToOutput.append(" (").append(contattoInterno.getEmail()).append(")");
                }
            }

            if (dto.getMetodoSpedizione() != null && dto.getMetodoSpedizione().equalsIgnoreCase(String.valueOf(MetodoSpedizione.Email)) && (contattoInterno.getEmail() != null && !contattoInterno.getEmail().isEmpty())) {
                lblToOutput.append(" (").append(contattoInterno.getEmail()).append(")");
            }

            if(contattoInterno.getIndirizzo() != null && !contattoInterno.getIndirizzo().isEmpty())
                lblToOutput.append(" - ").append(contattoInterno.getIndirizzo());

            if(contattoInterno.getCitta() != null && !contattoInterno.getCitta().isEmpty())
                lblToOutput.append(", ").append(contattoInterno.getCitta());

            if(contattoInterno.getCap() != null && !contattoInterno.getCap().isEmpty())
                lblToOutput.append(" ").append(contattoInterno.getCap());

            referenteDto.setLabel(lblToOutput.toString());
            referenti.add(referenteDto);
        }
        referentiOutputDTO.setReferenti(referenti);
        return referentiOutputDTO;
    }
    @Transactional
    public Anagrafica maptoAnagrafica(String tipologia, String codAmm, String codAoo, String codUniOu){
        Anagrafica anagrafica;
        switch (tipologia){
            case "ENTE":
                anagrafica = anagraficaService.mapInfoEnteToAnagrafica(codAmm);
                break;
            case "UO":
                anagrafica = anagraficaService.mapInfoUOToAnagrafica(codUniOu);
                break;
            case "AOO":
                anagrafica = anagraficaService.mapAooToAnagrafica(codAmm, codAoo);
                break;
            default:
                throw new RuntimeException("Tipologia Ipa non trovata");
        }
        return anagrafica;
    }


    @CacheResult(cacheName = "findReferenti")
    public ReferentiOutputDTO findReferenti(@NonNull RicercaReferentiDTO dto) {
        if (dto.getSize() <= 0 || dto.getPage() < 0) {
            throw new RuntimeException("I parametri size e page sono necessari per la ricerca");
        }

        if (dto.getTipoRegistrazione().equalsIgnoreCase("uscita" ) && !dto.isMittente()) {
            return getContattiFromAnagrafica(dto);
        } else if (dto.getTipoRegistrazione().equalsIgnoreCase("entrata") && dto.isMittente()) {
            return getContattiFromAnagrafica(dto);
        }

        return getOrganigramma(dto);
    }

    @CacheInvalidate(cacheName = "findReferenti")
    public ReferentiOutputDTO forceFindReferenti(@NonNull RicercaReferentiDTO dto) {
        return findReferenti(dto);
    }

    @Transactional
    public void fascicolazioneProtocolloFromRestApi(String nProtocollo, String fascicolo, boolean replace) {
        if (nProtocollo == null || nProtocollo.isEmpty()) {
            throw new IllegalArgumentException("ERR_001: Il numero del protocollo è obbligatorio.");
        }
        if (fascicolo == null || fascicolo.isEmpty()) {
            throw new IllegalArgumentException("ERR_002: Il fascicolo del protocollo è obbligatorio.");
        }

        Protocollo p = getProtocolloByNumero(nProtocollo);
        if (p == null) {
            throw new IllegalArgumentException("ERR_003: Il protocollo richiesto non esiste");
        }

        if (StatoProtocollo.Annullato.equals(p.getStato())) {
            throw new IllegalArgumentException("ERR_004: Il protocollo richiesto è annullato");
        }

        Titolario titolario = null;
        int lastSlash = fascicolo.lastIndexOf("/");
        String inputNameTitolario = fascicolo.substring(lastSlash + 1);

        List<Titolario> titolari = em.createNamedQuery("getTitolarioFromNome", Titolario.class).setParameter("nome", inputNameTitolario).getResultList();
        if(titolari != null && !titolari.isEmpty()){
            for(Titolario t : titolari){
                StringBuilder classificazione = new StringBuilder();
                List<TitolarioOutputDTO> titolariDTO = titolarioService.getHierarchyForTitolarioId(t.getId()).getTitolario();
                titolariDTO.forEach(x -> classificazione.append(x.getLabel()).append("/"));
                classificazione.append(t.getNome());
                if(classificazione.toString().equalsIgnoreCase(fascicolo)){
                    titolario = t;
                    break;
                }
            }
        }
        if (titolario == null) {
            throw new IllegalArgumentException("ERR_004: Nessun fascicolo trovato");
        }
        if(titolario.getTsDeleted() != null || (titolario.getTsChiusura() != null && titolario.getTsChiusura().before(Calendar.getInstance().getTime()))){
            throw new IllegalArgumentException("ERR_018: Il fascicolo di destinazione è in uno stato di chiusura");
        }

        boolean fascicoloAlreadyAdded = false;
        List<ProtocolliClassificazione> fascicoli = ProtocolliClassificazione.find("protocollo", p).list();

        for(ProtocolliClassificazione f : fascicoli) {
            if (Objects.equals(f.getIdTitolario(), titolario.getId())) {
                fascicoloAlreadyAdded = true;
                break;
            }
        }
        if (replace) {
            for(ProtocolliClassificazione f : fascicoli) {
                if (!Objects.equals(f.getIdTitolario(), titolario.getId())) {
                    f.delete();
                }
            }
            storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(p, "Eliminazione classificazione richiesta da REST API");
        }

        if (fascicoloAlreadyAdded)
            return;
        ProtocolliClassificazione.builder()
                .protocollo(p)
                .idTitolario(titolario.getId())
                .tsCreation(Calendar.getInstance().getTime())
                .idUtenteLastOperation("Sistema")
                .build()
                .persist();

        storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(p, "Classificazione protocollo da REST API per il Fascicolo: " + titolario.getNome());
        emailService.setClassificazioneEmail(p.getId());
    }

    @Transactional
    public boolean fascicolazioneProtocollo(Long idProtocollo, List<Long> idTitolarioList, String selectedOffice){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        log.info("Classificazione del protocollo con id: {} - da parte dell'utente: {} - dall'ufficio: {}",
                idProtocollo,
                ssoManager.extractNameFromToken(),
                selectedOffice);

        try {
            if(idTitolarioList == null || idTitolarioList.isEmpty()){
                CustomException.get(
                        CustomException.ErrorCode.INTERNAL,"Inserire almeno un titolario da classificare"
                ).boom();
            }

            Protocollo protocollo = findById(idProtocollo);
            String idUtente = ssoManager.extractIdFromToken();
            String nomeUtente = ssoManager.extractNameFromToken();
            DettaglioProtocolloDTO dettaglioProtocollo = getDettaglioProtocollo(protocollo.getNProtocollo(), selectedOffice);

            if(StatoProtocollo.Annullato.equals(dettaglioProtocollo.getProtocollo().getStato())){
                String message = String.format("Il protocollo: %s risulta annullato, verificare la selezione",protocollo.getNProtocollo());
                CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
            }

            boolean isUtenteAssegnato = referentiProtocolloService.getAllAssegnatariForProtocollo(protocollo.getId()).stream()
                    .anyMatch(referente -> referente.getIdDestinatario().equalsIgnoreCase(idUtente));

            boolean isPecEntrataFascicolabile = protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Pec) && protocollo.getTipoRegistrazione().equals(TipoRegistrazione.Entrata) && dettaglioProtocollo.isCanPrendereInCaricoFromPec();

            boolean isUtenteAdmin = ssoManager.isUtenteAdmin();

            if(!isUtenteAdmin && !isUtenteAssegnato && !isPecEntrataFascicolabile){
                String message = String.format("Il protocollo: %s, non è di competenza dell'utente", protocollo.getNProtocollo());
                CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
            }

            if(!isPecEntrataFascicolabile && StatoProtocollo.DaPrendereInCarico.toString().equals(dettaglioProtocollo.getStatoProtocollo())){
                String message = String.format("Il protocollo: %s, non risulta preso in carico", protocollo.getNProtocollo());
                CustomException.get(CustomException.ErrorCode.INTERNAL,message).boom();
            }

            // TODO: prendere la classificazione dal protocollo
            List<TitolarioOutputDTO> classificazioneProtocollo = dettaglioProtocollo.getTitolario();
          for(Long id : idTitolarioList){
                boolean isClassificato = classificazioneProtocollo.stream().anyMatch(titolario -> id.equals(titolario.getId()));

                if(isClassificato){
                    continue;
                }

                Titolario titolario = Titolario.findById(id);
                    if(titolario.getLeaf() != null && !titolario.getLeaf()){
                        String message = String.format("Non è possibile classificare il Protocollo: %s all'interno del fascicolo: %s",protocollo.getNProtocollo(),titolario.getNome());
                        CustomException.get(CustomException.ErrorCode.INTERNAL,message).boom();
                    }

                ProtocolliClassificazione.builder()
                        .protocollo(protocollo)
                        .idTitolario(id)
                        .tsCreation(Calendar.getInstance().getTime())
                        .idUtenteLastOperation(ssoManager.extractIdFromToken())
                        .build()
                        .persist();
                    
              String hierarchyString = titolarioService.buildHierarchyString(
                      titolarioService.getHierarchyForTitolarioId(id).getTitolario()
              );

              String storicoOperazione = StoricoOperazione
                      .Classificazione
                      .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                      .concat(hierarchyString).concat(" ").concat(titolario.getNome());

                storicoService.insertNewStoricoForNumeroProtocollo(
                        protocollo,
                        idUtente,
                        nomeUtente,
                        storicoOperazione,"");
            }

            if (protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Pec))
                pecOperationService.insertPecOperation(protocollo, selectedOffice, idUtente, nomeUtente, Operazione.classificazione);

        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.INTERNAL,e.getMessage()).boom();
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    @Transactional
    public boolean fascicolazioneMassiva(List<Long> idProtocolloList, List<Long> idTitolarioList, String selectedOffice){
        if(idProtocolloList == null || idProtocolloList.isEmpty()) {
            throw new IllegalArgumentException("idProtocolloList è obbligatorio");
        }

        for(Long protocollo :idProtocolloList){
            this.fascicolazioneProtocollo(protocollo,idTitolarioList, selectedOffice);
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    @Transactional
    public String saveProtocolloFromRestApi(RestProtocolloInput restInput) throws Exception {

        if (restInput.getObject() == null || restInput.getObject().isEmpty()) {
            throw new IllegalArgumentException("ERR_016: L'oggetto del protocollo è obbligatorio.");
        }
        if (restInput.getSender() == null || restInput.getSender().isEmpty()) {
            throw new IllegalArgumentException("ERR_003: Il mittente del protocollo è obbligatorio.");
        }

        if (restInput.getDocument() == null || restInput.getDocument().isEmpty()) {
            throw new IllegalArgumentException("ERR_003: Il documento principale è obbligatorio.");
        }

        if (restInput.getDocument_filename() == null || restInput.getDocument_filename().isEmpty()) {
            throw new IllegalArgumentException("ERR_003: Il nome del documento principale è obbligatorio.");
        }

        List<Configurazione> configurazioni = configurazioneService.getAllConfigurazioniByCategoria("global");
        String applicationId = configurazioneService.getApplicationId(configurazioni);

        String mittente = restInput.getSender().split(";")[0];
        List<String> destinatari = restInput.getAddresse() != null && !restInput.getAddresse().isEmpty() ? Arrays.asList(restInput.getAddresse().split(";")) : new ArrayList<>();
        List<Office> ufficiReferenti = new ArrayList<>();
        List<DatiUtenteSlimSSO> utentiReferenti;
        destinatari.forEach(d -> ufficiReferenti.addAll(ssoManager.getOffices(d)));
        List<DatiUtenteSlimSSO> utenti = ssoManager.getAllUtenti(applicationId);

        utentiReferenti = utenti.stream()
                .filter(utente -> destinatari.stream().anyMatch(searchFilter -> {
                    String searchFilterLower = searchFilter.toLowerCase();
                    return  (utente.firstName.toLowerCase() + " " + utente.lastName.toLowerCase()).contains(searchFilterLower) ||
                            (utente.lastName.toLowerCase() + " " + utente.firstName.toLowerCase()).contains(searchFilterLower);
                })).toList();

        String destinatariString = Stream.concat(
                        ufficiReferenti.stream().map(ur -> ur.name + " " + ur.description),
                        utentiReferenti.stream().map(u -> u.firstName + " " + u.lastName)
                ).collect(Collectors.joining(", "));


        String oggetto = restInput.getObject();
        MetodoSpedizione metodoSpedizione = mapper.getMetodoSpedizione(restInput.getDelivery_type());
        TipoRegistrazione tipoRegistrazione = mapper.getTipologiaRegistrazione(restInput.getDirection());
        Titolario titolario = new Titolario();
        int lastSlash = restInput.getTitolario().lastIndexOf("/");
        String inputNameTitolario = restInput.getTitolario().substring(lastSlash + 1);
        List<Titolario> titolari = em.createNamedQuery("getTitolarioFromNome", Titolario.class).setParameter("nome", inputNameTitolario).getResultList();
        if(titolari != null && !titolari.isEmpty()){
            for(Titolario t : titolari){
                StringBuilder classificazione = new StringBuilder();
                List<TitolarioOutputDTO> titolariDTO = titolarioService.getHierarchyForTitolarioId(t.getId()).getTitolario();
                titolariDTO.forEach(x -> classificazione.append(x.getLabel()).append("/"));
                classificazione.append(t.getNome());
                if(classificazione.toString().equalsIgnoreCase(restInput.getTitolario())){
                    titolario = t;
                    break;
                }
            }
        }

        if(titolario.getId() == null){
            throw new IllegalArgumentException("ERR_017: L’indice di classificazione non è corretta.");
        }

        if(titolario.getTsDeleted() != null || (titolario.getTsChiusura() != null && titolario.getTsChiusura().before(Calendar.getInstance().getTime()))){
            throw new IllegalArgumentException("ERR_018: Il fascicolo di destinazione è in uno stato di chiusura");
        }


        List<Allegato> allegati = new ArrayList<>();
        FileUploadForm formDocument = new FileUploadForm(restInput.getDocument(), restInput.getDocument_filename(), "1");
        Allegato document = allegatoService.saveAllegati(formDocument);
        allegati.add(document);

        if(restInput.getAttachment_1() != null && restInput.getAttachment_1().length() > 1){

            if (restInput.getAttachment_1_filename() == null || restInput.getAttachment_1_filename().isEmpty()) {
                throw new IllegalArgumentException("ERR_019: Il nome dell'allegato è necessario");
            }

            FileUploadForm formAllegato = new FileUploadForm(restInput.getAttachment_1(), restInput.getAttachment_1_filename() , "0");
            Allegato allegato = allegatoService.saveAllegati(formAllegato);
            allegati.add(allegato);
        }
        if(restInput.getAttachment_2() != null && restInput.getAttachment_2().length() > 1){

            if (restInput.getAttachment_2_filename() == null || restInput.getAttachment_2_filename().isEmpty()) {
                throw new IllegalArgumentException("ERR_019: Il nome dell'allegato è necessario");
            }

            FileUploadForm formAllegato = new FileUploadForm(restInput.getAttachment_2(), restInput.getAttachment_2_filename() , "0");
            Allegato allegato = allegatoService.saveAllegati(formAllegato);
            allegati.add(allegato);
        }
        if(restInput.getAttachment_3() != null && restInput.getAttachment_3().length() > 1){

            if (restInput.getAttachment_3_filename() == null || restInput.getAttachment_3_filename().isEmpty()) {
                throw new IllegalArgumentException("ERR_019: Il nome dell'allegato è necessario");
            }

            FileUploadForm formAllegato = new FileUploadForm(restInput.getAttachment_3(), restInput.getAttachment_3_filename(), "0");
            Allegato allegato = allegatoService.saveAllegati(formAllegato);
            allegati.add(allegato);
        }

        String numeroProtocollo = numeroProtocolloCircolareService.generateDistribuitedNumeroProtocollo();

        Protocollo protocollo = new Protocollo();
        protocollo.setMittente(mittente);
        if(restInput.getDocument_protocol() != null && !restInput.getDocument_protocol().isEmpty()) {
            protocollo.setProtocolloMittente(restInput.getDocument_protocol());
        }
        if(restInput.getDocument_protocol_date() != null && !restInput.getDocument_protocol_date().isEmpty()){
            protocollo.setDataProtocolloMittente(Utils.parseDate(restInput.getDocument_protocol_date()));
        }
        protocollo.setDestinatari(destinatariString);
        protocollo.setNProtocollo(numeroProtocollo);
        log.info(LogUtils.GENERAZIONE_NUM_PROTOCOLLO_FORMAT,protocollo.getNProtocollo());
        protocollo.setAllegati(allegati);
        protocollo.setOggetto(oggetto);
        protocollo.setTipoRegistrazione(tipoRegistrazione);
        protocollo.setMetodoSpedizione(metodoSpedizione);
        protocollo.setIdUtente("0");
        protocollo.setUtente("Sistema");
        protocollo.setTsCreation(Calendar.getInstance().getTime());
        protocollo.setTsStartVali(Calendar.getInstance().getTime());
        protocollo.setStato(StatoProtocollo.InCorso);

        String filigrana = String.format(ProtocolloUtils.formatoFiligrana,
                protocollo.getNProtocollo(),
                Utils.fromDateToString(protocollo.getTsCreation(), Utils.DateFormat.DMY_HM),
                protocollo.getTipoRegistrazione().toString().toUpperCase());

        for(Allegato allegato : protocollo.getAllegati()){
            String nomeAllegatoConNProtocollo = getNomeAllegatoConProtocollo(allegato.getNome(), protocollo.getNProtocollo());
            em.createNamedQuery("updateNameAllegatoById")
                    .setParameter("nome", nomeAllegatoConNProtocollo)
                    .setParameter("idAllegato", allegato.getId())
                    .executeUpdate();
            allegato.setNome(nomeAllegatoConNProtocollo);

            documentService.saveDocumentTimbrato(allegato, filigrana, "top", protocollo.getNProtocollo());
        }

        List<Configurazione> confGlobal = configurazioneService.getAllConfigurazioniByCategoria("global");
        SegnaturaInput segnaturaInput = new SegnaturaInput();
        segnaturaInput.setDenominazioneMittente(configurazioneService.getDenominazioneAmministrazione(confGlobal));
        segnaturaInput.setCfMittente(configurazioneService.getCfAmministrazione(confGlobal));
        segnaturaInput.setCodiceIpaMittente(configurazioneService.getCodiceIpa(confGlobal));
        segnaturaInput.setCodiceAooMittente(configurazioneService.getCodiceAoo(confGlobal));

        segnaturaInput.setNumeroRegistrazione(protocollo.getNumeroProgressivoForSignature());
        segnaturaInput.setDataRegistrazione(protocollo.getTsCreationFormatted());
        segnaturaInput.setOggetto(protocollo.getOggetto());

        String hierarchyString = titolarioService.buildHierarchyString(titolarioService.getHierarchyForTitolarioId(titolario.getId()).getTitolario());
        segnaturaInput.setFascicoloNome(titolario.getNome());
        segnaturaInput.setFascicoloCodiceFlat(hierarchyString);

        segnaturaInput.setNomeAllegato(document.getNome());
        segnaturaInput.setImprontaBytes(document.getImpronta().getBytes());
        segnaturaInput.setMimeTypeAllegato("none");
        AttachmentContentType attachmentContentType = attachmentContentTypeService.findByExtension(document.getEstensione());
        if (attachmentContentType != null) {
            segnaturaInput.setMimeTypeAllegato(attachmentContentType.getType());
        }

        for(Office office : ufficiReferenti) {
            SegnaturaDestinatarioInput dest = new SegnaturaDestinatarioInput();
            dest.tipoDestinatario = "ufficio";
            dest.isConoscenza = false;
            dest.denominazione = office.name + " - " + office.description;
            segnaturaInput.getDestinatari().add(dest);
        }
        for(DatiUtenteSlimSSO utente : utentiReferenti){
            SegnaturaDestinatarioInput dest = new SegnaturaDestinatarioInput();
            dest.tipoDestinatario = "utente";
            dest.isConoscenza = false;
            dest.nome = utente.firstName;
            dest.cognome = utente.lastName;
            segnaturaInput.getDestinatari().add(dest);
        }

        Allegato allegato = allegatoService.saveAllegati(buildSignatureXML("Segnatura "+protocollo.getNProtocollo(), segnaturaInput));
        protocollo.getAllegati().add(allegato);

        protocollo.persist();

        ProtocolliClassificazione.builder()
                .protocollo(protocollo)
                .idTitolario(titolario.getId())
                .tsCreation(Calendar.getInstance().getTime())
                .build()
                .persistAndFlush();

        for(Office office : ufficiReferenti){
            ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                    .idProtocollo(protocollo.getId())
                    .idDestinatario(office.code)
                    .nomeDestinatario(office.name + " " + office.description)
                    .attribuzione("competenza")
                    .tipoDestinatario("ufficio")
                    .isAssegnato(true)
                    .creationOption(true)
                    .statoProtocollo(StatoProtocollo.Assegnato)
                    .tsCreation(Calendar.getInstance().getTime())
                    .tsStartVali(Calendar.getInstance().getTime())
                    .tsStatoProtocollo(Calendar.getInstance().getTime())
                    .build();

            String storicoOperazione = StoricoOperazione.AssegnazioneProtocollo
                    .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                    .concat(referentiProtocollo.getNomeDestinatario())
                    .concat(".");

            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, "Sistema", "Sistema", storicoOperazione, null);

            referentiProtocollo.persist();
        }


        for(DatiUtenteSlimSSO utente : utentiReferenti){
            ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                    .idProtocollo(protocollo.getId())
                    .idDestinatario(utente.authId)
                    .nomeDestinatario(utente.firstName + " " + utente.lastName)
                    .attribuzione("competenza")
                    .tipoDestinatario("utente")
                    .isAssegnato(true)
                    .creationOption(true)
                    .statoProtocollo(StatoProtocollo.DaPrendereInCarico)
                    .tsCreation(Calendar.getInstance().getTime())
                    .tsStartVali(Calendar.getInstance().getTime())
                    .tsStatoProtocollo(Calendar.getInstance().getTime())
                    .build();

            String storicoOperazione = StoricoOperazione
                    .AssegnazioneProtocollo
                    .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                    .concat(referentiProtocollo.getNomeDestinatario())
                    .concat(".");

            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, "Sistema", "Sistema", storicoOperazione, null);

            referentiProtocollo.persist();
        }

        storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(protocollo, StoricoOperazione.CreazioneAutomaticaProtocollo.getStatoParameter("Protocollo"));

        return protocollo.getNProtocollo();
    }

// NB: SOSTITUITO CON IL MEOTODO 'isProtcolloClassificatoInFascicoloNonVisibile(List<ProtocolliClassificazione> classificazioneProtocolloList, String selectedCdrCode)'
//    /**
//     *  Verifica che il protocollo sia classificato in un fascicolo non visibile all'utente.
//     * @param idProtocollo - Id del protocollo selezionato
//     * @param selectedCdr - codice dell'ufficio selezionato
//     */
//    public boolean isProtcolloClassificatoInFascicoloNonVisibileOld(Long idProtocollo, String selectedCdr) {
//        List<Long> titolariAccessibili = titolarioService.getAllVisibleTitolarioIdByUserAndCdrCode(selectedCdr);
//
//        String query = "SELECT p FROM Protocollo p WHERE p.id = :idProtocollo "
//                .concat("")
//                .concat("AND ( ")
//                .concat("    NOT EXISTS ( ")
//                .concat("        SELECT pc FROM ProtocolliClassificazione pc ")
//                .concat("       WHERE pc.protocollo.id = p.id ")
//                .concat("    ) ")
//                .concat("    OR ")
//                .concat("    EXISTS ( ")
//                .concat("        SELECT pc FROM ProtocolliClassificazione pc ")
//                .concat("        WHERE pc.protocollo.id = p.id ")
//                .concat("       AND pc.idTitolario IN ("+StringUtils.join(titolariAccessibili, ", ")+") ")
//                .concat("   ) ")
//                .concat(")");
//
//        List<Protocollo> protocolliNonVisibili = em.createQuery(query, Protocollo.class)
//                .setParameter("idProtocollo", idProtocollo)
//                .getResultList();
//
//        /*
//        List<Protocollo> protocolliNonVisibili = em.createNamedQuery("findProtocolliByVisibility", Protocollo.class)
//                .setParameter("idProtocollo", idProtocollo)
//                .setParameter("titolariAccessibili", titolariAccessibili)
//                .getResultList();
//        */
//
//        return protocolliNonVisibili.isEmpty();
//    }

    /**
     * Tutti i protocolli assegnati ad un ufficio e già lavorati.
     * IMPORTANTE: la funzione è utilizzata nella query dei protocolli, sezione il mio ufficio e quindi esclude tutti i protocolli creati dall'ufficio passato come parametro
     * @param cdrCodes il codice cdr dell'ufficio
     * @return
     */
    public List<Long> getAllProtocolliLavoratiFromCdrCode(Set<String> cdrCodes) {
        String query = "SELECT DISTINCT rp.idProtocollo FROM ReferentiProtocollo rp WHERE rp.idProtocollo NOT IN (SELECT p.id from Protocollo p where p.cdrCode in :cdrCodes) AND rp.idDestinatario in :cdrCodes AND rp.tipoDestinatario = :tipoDestinatario";
        return em.createQuery(query, Long.class)
                .setParameter("cdrCodes", cdrCodes)
                .setParameter("tipoDestinatario", TipoDestinatarioReferente.UFFICIO.getNome())
                .getResultList();
    }
    /**
     *  Verifica che il protocollo sia classificato in un fascicolo non visibile all'utente.
     *  Il metodo si divide in fascicoli normali e quelli del dipendente perchè le visibilità sono gestite in modo differente
     * @param classificazioneProtocolloList - Lista contenente la classificazione del protocollo
     * @param selectedCdrCode - codice dell'ufficio selezionato
     */
    public boolean isProtocolloClassificatoInFascicoloNonVisibile(List<ProtocolliClassificazione> classificazioneProtocolloList, String selectedCdrCode, Set<String> cdrCodes) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        // Se la lista di classificazioni è nulla o vuota, consideriamo il protocollo come visibile
        if (classificazioneProtocolloList == null || classificazioneProtocolloList.isEmpty()) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return false;
        }

        List<Long> idTitolarioList = new ArrayList<>();
        List<Long> idTitolarioDipendenteList = new ArrayList<>();
        List<Long> idClassificazioneList = classificazioneProtocolloList.stream().map(ProtocolliClassificazione::getIdTitolario).toList();

        List<Titolario> titolarioList = em.createQuery(
                "SELECT t from Titolario t where id in (:idClassificazioneList)", Titolario.class)
                .setParameter("idClassificazioneList",idClassificazioneList)
                .getResultList();

        for(Titolario titolario : titolarioList){
            if(Boolean.TRUE.equals(titolario.getIsFascicoloDipendente())){
                idTitolarioDipendenteList.add(titolario.getId());
            }else{
                idTitolarioList.add(titolario.getId());
            }
        }

        // Si verificano i permessi sui fascicoli normali se presenti
        if(!idTitolarioList.isEmpty()){
            StringBuilder queryFascicoliSb = new StringBuilder();
            queryFascicoliSb.append("WITH RECURSIVE titolario_path AS")
                    .append("(")
                    .append("SELECT t.* FROM titolario t ")
                    .append("WHERE t.id in :idClassificazioneList AND t.ts_deleted IS NULL ")
                    .append("UNION ALL ")
                    .append("SELECT t.* FROM titolario t ")
                    .append("JOIN titolario_path p ON t.id = p.id_padre WHERE t.ts_deleted IS NULL ")
                    .append(") ")
                    .append("SELECT COUNT(tp.id) FROM titolario_path tp ")
                    .append("JOIN visibilita_titolario vt ON vt.id_titolario = tp.id ")
                    .append("WHERE tp.tipologia_titolario = :fascicoloLivello1 ")
                    .append("AND tp.ts_deleted IS null and tp.is_fascicolo_dipendente = false ")
                    .append("and (")
                    .append("(vt.id_utente = :authId and vt.cdr_code in :cdrCodes) or (vt.id_utente IS NULL AND vt.cdr_code in :cdrCodes)")
                    .append(")");

            long recordVisibili = (long) em.createNativeQuery(queryFascicoliSb.toString())
                    .setParameter("idClassificazioneList", idTitolarioList)
                    .setParameter("authId", ssoManager.extractIdFromToken())
                    .setParameter("cdrCodes", cdrCodes)
                    .setParameter("fascicoloLivello1", TipologiaTitolario.FascicoloLv1.getTipologiaTitolario())
                    .getSingleResult();

            if(recordVisibili > 0){
                return false;
            }
        }

        // Si verificano i permessi sui fascicoli del dipendente se presenti
        if(!idTitolarioDipendenteList.isEmpty()) {
            StringBuilder queryFascicoliDipendenteSb = new StringBuilder();
            queryFascicoliDipendenteSb.append("SELECT COUNT(pfd.titolario.id) FROM PermessiFascicoloDipendente pfd ")
                    .append("join pfd.uffici u  ")
                    .append("where pfd.titolario.id in :idTitolarioDipendenteList ")
                    .append("and u.cdrCode in :cdrCodes ")
                    .append("AND (").append(getFascicoloDipendenteQueryPermitBase(selectedCdrCode)).append(")");

            long recordVisibiliDipendente = (long) em.createQuery(queryFascicoliDipendenteSb.toString())
                    .setParameter("idTitolarioDipendenteList", idTitolarioDipendenteList)
                    .setParameter("authId", ssoManager.extractIdFromToken())
                    .setParameter("cdrCodes", cdrCodes)
                    .getSingleResult();

            if(recordVisibiliDipendente > 0){
                return false;
            }
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    /**
     *  Preparazione della query che verrà passata al metodo 'isProtcolloClassificatoInFascicoloNonVisibile'
     *  Si costruiscer in base ai permessi basati su sso
     * @param selectedCdrCode - codice dell'ufficio selezionato
     */
    public String getFascicoloDipendenteQueryPermitBase(String selectedCdrCode){
        DatiUtenteSSO datiUtenteSSO = ssoManager.getDatiUtente();
        boolean isDirigente = ssoManager.isUtenteDirigente();
        boolean isArchivista = ssoManager.hasMatchingRoleAndCdr(datiUtenteSSO, List.of("archivista"), selectedCdrCode);
        boolean isProtocollatore = ssoManager.hasMatchingRoleAndCdr(datiUtenteSSO, List.of("protocollatore"), selectedCdrCode);

        StringBuilder dipendenteQueryPermitBase = new StringBuilder("pfd.visibilitaUtente = 'visualizzazione' OR ");

        if (isDirigente) {
            dipendenteQueryPermitBase.append("(pfd.visibilitaDirigente = 'visualizzazione') OR (pfd.visibilitaArchivista = 'protocollazione') OR ");
        }

        if (isArchivista) {
            dipendenteQueryPermitBase.append("(pfd.visibilitaArchivista = 'visualizzazione') OR (pfd.visibilitaArchivista = 'protocollazione') OR ");
        }

        if (isProtocollatore) {
            dipendenteQueryPermitBase.append("(pfd.visibilitaProtocollatore = 'visualizzazione') OR (pfd.visibilitaProtocollatore = 'protocollazione') OR ");
        }

        dipendenteQueryPermitBase.append("( pfd.titolario.idUtenteCreatore = :authId and (pfd.visibilitaDipendente = 'visualizzazione' OR pfd.visibilitaDipendente = 'protocollazione')) ");

        return dipendenteQueryPermitBase.toString();
    }

    /***
     * Query nativa per recuperare una lista di Long che conterrà tutti i protocolli che l'utente può vedere
     * @param allTitolarioAccessibileArray - array di idTitolario per i quali l'utente ha la visibilità
     * @param selectedCdrCodes - Ufficio selezionato
     */
    public List<Long> getAllProtocolliClassificatiByCdrCodeAndVisibility(Long[] allTitolarioAccessibileArray, Set<String> selectedCdrCodes){
        List<Long> result = new ArrayList<>();
        int MAX_ARRAY_SIZE = 60000;
        int totalSize = allTitolarioAccessibileArray.length;
        for (int i = 0; i < allTitolarioAccessibileArray.length; i += MAX_ARRAY_SIZE) {
            int end = Math.min(i + MAX_ARRAY_SIZE, totalSize);
            Long[] chunk = Arrays.copyOfRange(allTitolarioAccessibileArray, i, end);

            List<Long> partialResult = em.createNativeQuery(
                            "SELECT DISTINCT p.id FROM protocolli p " +
                                    "LEFT JOIN protocolli_classificazione pc ON p.id = pc.id_protocollo " +
                                    "WHERE (pc.id IS NOT NULL AND pc.id_titolario = ANY(?1)) " +
                                    "OR (pc.id IS NULL AND p.cdr_code IN ?2)", Long.class)
                    .unwrap(NativeQuery.class)
                    .setParameter(1, chunk)
                    .setParameter(2, selectedCdrCodes)
                    .getResultList();

            result.addAll(partialResult);
        }
        return result;

        /*
        @SuppressWarnings("unchecked")
        List<Long> idProtocolliClassificati = em.createNativeQuery(
                        "SELECT DISTINCT p.id FROM protocolli p " +
                                "LEFT JOIN protocolli_classificazione pc ON p.id = pc.id_protocollo " +
                                "WHERE (pc.id IS NOT NULL AND pc.id_titolario = ANY(?1)) " +
                                "OR (pc.id IS NULL AND p.cdr_code in ?2)", Long.class)
                .unwrap(NativeQuery.class)
                .setParameter(1,allTitolarioAccessibileArray)
                .setParameter(2, selectedCdrCodes)
                .getResultList();

        return idProtocolliClassificati;
        */
    }

    public String getProtocolliFromPecAddressesNative(List<String> pecAddressesToUse) {

        StringBuilder query = new StringBuilder();
        query.append("SELECT e.id_protocollo FROM email e ");
        query.append("WHERE ");
        query.append("e.tipo_email = :tipoEmailPEC AND e.email_direction = :emailDirectionEntrata ");

        query.append("AND (");

        for (int i = 0; i < pecAddressesToUse.size(); i++) {
            String pecAddress = pecAddressesToUse.get(i);
            query.append("lower(e.email_to) like concat('%', :pecAddress").append(i).append(", '%') OR ");
            query.append("lower(e.email_cc) like concat('%', :pecAddress").append(i).append(", '%')");
            if (i < pecAddressesToUse.size() - 1) {
                query.append(" OR ");
            }
        }

        query.append(")");

        return query.toString();
    }

    /***
     * NOTA: questa funzione viene usata nella query "IL MIO UFFICIO"
     * Query da usare come sottoquery per recuperare tutti i protocolli di tipo PEC in ENTRATA.
     * @param pecAddressesToUse - Pec configurate per l'utente o l'ufficio selezionato
     */
    public String getProtocolliFromPecAddresses(List<String> pecAddressesToUse) {

        StringBuilder query = new StringBuilder();
        query.append("SELECT e.protocollo.id FROM Email e ");
        query.append("WHERE ");
        query.append("e.tipoEmail = :tipoEmailPEC AND e.emailDirection = :emailDirectionEntrata ");

        query.append("AND (");

        for (int i = 0; i < pecAddressesToUse.size(); i++) {
            String pecAddress = pecAddressesToUse.get(i);
            query.append("lower(e.to) like concat('%', :pecAddress").append(i).append(", '%') OR ");
            query.append("lower(e.cc) like concat('%', :pecAddress").append(i).append(", '%')");
            if (i < pecAddressesToUse.size() - 1) {
                query.append(" OR ");
            }
        }

        query.append(")");

        return query.toString();
    }

    private StatoProtocollo getStatoAssegnazione(String tipoDestinatario) {
        if (TipoDestinatarioReferente.UTENTE.toString().equalsIgnoreCase(tipoDestinatario)) {
            return StatoProtocollo.DaPrendereInCarico;
        }
        return StatoProtocollo.Assegnato;
    }

    @Transactional
    public boolean richiestaAssegnazioneProtocollo(Long idProtocollo, String note) {
        try {
            Protocollo protocollo = Protocollo.findById(idProtocollo);
            if(protocollo == null){
                throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante la richiesta di assegnazione: Protocollo non presente");
            }

            String idUtente = em.createNamedQuery("getUtenteFirtsClassificazioneProtocollo", String.class)
                    .setParameter("idProtocollo", idProtocollo)
                    .setMaxResults(1)
                    .getSingleResult();

            if(idUtente == null){
                throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Non è presente nessun fascicolo per il Protocollo: " + protocollo.getNProtocollo() );
            }

            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
            String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
            PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();
            String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
            DatiUtenteSSO recipientUser = ssoManager.getUserByAuthId(idUtente, Integer.parseInt(applicationId));
            EmailTemplate template = emailTemplateService.getTemplate(Operazione.richiestaAssegnazione, "notifica");
            String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
            String sbCorpoEmailNotifica = template.getCorpo()
                    .replace("{{headerCorpo}}", oggettoEmailNotifica)
                    .replace("{{cognomeUtenteTO}}", recipientUser.lastName)
                    .replace("{{nomeUtenteTO}}", recipientUser.firstName)
                    .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                    .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                    .replace("{{motivo}}", note != null ? note : "-")
                    .replace("{{numero}}", protocollo.getNProtocollo())
                    .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

            Long idNotifica = notificaService.newNotifica(
                    protocollo.getId(),
                    peoInvioNotifica.getIndirizzoEmail(),
                    recipientUser.email,
                    oggettoEmailNotifica,
                    sbCorpoEmailNotifica,
                    Operazione.richiestaAssegnazione.name());

            if(idNotifica == null){
                throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore invio notifica per il Protocollo: " + protocollo.getNProtocollo() );
            }

            sendNotificaClient.sendNotifica(idNotifica);

            if (note != null && note.length() > 255) {
                note = note.substring(0, 250);
            }
            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), StoricoOperazione.RichiestaAssegnazioneProtocollo.getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione())), note);

            return true;
        }catch (Exception e) {
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante la richiesta di assegnazione Protocollo: {}", e.getMessage());
        }
    }

    @Transactional
    public void attachRispostaAutomaticaToProtocollo(boolean isNProtocolloFromSegnatura, String nProtocolloInternoRiferimento, EmailContentDTO contentDTO, List<Allegato> attachmentList) {
        Protocollo protocolloFound = isNProtocolloFromSegnatura ? Protocollo.getProtocolloFromIdentificativoSignature(nProtocolloInternoRiferimento, "07") : (Protocollo) Protocollo.find("nProtocollo = ?1", nProtocolloInternoRiferimento).firstResultOptional().orElse(null);
        //TODO: trovare il protocollo interno ed allegare l'eml (allegato principale del DTO) al protocollo!
        if (protocolloFound != null) {
            for(Allegato a : attachmentList) {
                if (a.getIsMain()) {
                    Allegato allegato = Allegato.findById(a.getId());
                    allegato.setIsMain(false);
                    allegato.setNome(protocolloFound.getNProtocollo() + "_"+allegato.getNome());
                    allegato.setOggetto("Risposta automatica di protocollazione da "+ contentDTO.getFrom());
                    allegato.setProtocollo(protocolloFound);
                    allegato.persist();

                    String storicoOperazione = "Registrata risposta automatica di protocollazione proveniente da " + contentDTO.getFrom();
                    storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(protocolloFound, storicoOperazione.length() > 255 ? storicoOperazione.substring(0, 250) : storicoOperazione);

                    emailService.saveRecordEmail(contentDTO, protocolloFound, true);
                    break;
                }
            }
        }
    }

    @Transactional
    public ImportResult importProtocolliEmergenzaFromBase64(String fileBase64, String selectedOffice, String selectedOfficeName) {
        byte[] decodedBytes = Base64.decodeBase64(fileBase64);
        InputStream inputStream = new ByteArrayInputStream(decodedBytes);
        ImportResult result = documentService.validazioneExcelProtocolloEmergenza(inputStream);
        if (!result.getIdoneo()) {
            List<ErrorRecord> errors = result.getLista();
            String errorMessage = String.format("Errore nella riga %s: %s", errors.get(0).getRowNumber(), errors.get(0).getErrorMessage());
            CustomException.get(CustomException.ErrorCode.INTERNAL, errorMessage).boom();
        } else {
            log.info("Importazione protocolli di emergenza da file excel");

            List<Configurazione> configurazioni = configurazioneService.getAllConfigurazioniByCategoria("global");
            String applicationId = configurazioneService.getApplicationId(configurazioni);

            List<ProtocolloEmergenzaDTO> protocolliEmergenza = result.getLista();
            for(ProtocolloEmergenzaDTO protocolloEmergenza : protocolliEmergenza) {

                Calendar cal = Calendar.getInstance();
                cal.setTime(protocolloEmergenza.getDataProtocolloEmergenza());
                int yearProtocollo = cal.get(Calendar.YEAR);

                cal.clear();
                cal.set(Calendar.YEAR, yearProtocollo);
                cal.set(Calendar.MONTH, Calendar.JANUARY);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                Date dateProtocolloEmergenzaStart = cal.getTime();

                cal.clear();
                cal.set(Calendar.YEAR, yearProtocollo);
                cal.set(Calendar.MONTH, Calendar.DECEMBER);
                cal.set(Calendar.DAY_OF_MONTH, 31);
                cal.set(Calendar.HOUR_OF_DAY, 23);
                cal.set(Calendar.MINUTE, 59);
                cal.set(Calendar.SECOND, 59);
                Date dateProtocolloEmergenzaEnd = cal.getTime();

                Map<String, Object> params = new HashMap<>();
                params.put("nProtocolloEmergenza", protocolloEmergenza.getNumeroProtocolloEmergenza());
                params.put("start", dateProtocolloEmergenzaStart);
                params.put("end", dateProtocolloEmergenzaEnd);
                Optional<Protocollo> protocolloAlreadyInDb = Protocollo.find("dataProtocolloEmergenza >= :start AND dataProtocolloEmergenza <= :end AND nProtocolloEmergenza = :nProtocolloEmergenza", params).firstResultOptional();
                if (protocolloAlreadyInDb.isPresent()) {
                    protocolloEmergenza.setNProtocollo(protocolloAlreadyInDb.get().getNProtocollo());
                    protocolloEmergenza.setNProtocolloEmergenza(protocolloAlreadyInDb.get().getNProtocolloEmergenza());
                    protocolloEmergenza.setImported(true);
                    continue;
                }

                protocolloEmergenza.setImported(false);

                MetodoSpedizione metodoSpedizione = mapper.getMetodoSpedizioneWithNormalization(Normalizer.normalize(protocolloEmergenza.getMetodo(), Normalizer.Form.NFC));
                TipoRegistrazione tipoRegistrazione = mapper.getTipologiaRegistrazione(protocolloEmergenza.getTipologia());

                List<String> destinatari = protocolloEmergenza.getDestinatari() != null && !protocolloEmergenza.getDestinatari().isEmpty() ? Arrays.asList(protocolloEmergenza.getDestinatari().split(",")) : new ArrayList<>();

                List<Office> ufficiReferenti = new ArrayList<>();
                List<DatiUtenteSlimSSO> utentiReferenti = new ArrayList<>();
                List<Anagrafica> contattiDestinatari = new ArrayList<>();
                Office ufficioMittente = null;
                Anagrafica contattoMittente = null;

                //NOTA: protocollo in entrata -> cercare mittente in anagrafica
                if (tipoRegistrazione.equals(TipoRegistrazione.Entrata)) {
                    RicercaAnagraficaDTO dto = new RicercaAnagraficaDTO();
                    dto.setSize(1);
                    dto.setPage(0);
                    dto.setSearch(protocolloEmergenza.getMittente());
                    Anagrafica mittenteInAnagrafica = anagraficaService.getAnagraficaQuery(dto).firstResultOptional().orElse(null);
                    if (mittenteInAnagrafica != null) {
                        contattoMittente = mittenteInAnagrafica;
                    } else {
                        Anagrafica nuovaAnagrafica = Anagrafica.buildAnagraficaFromProtocolloEmergenza(protocolloEmergenza.getMittente(), "Creata durante importazione protocollo di emergenza n. " + protocolloEmergenza.getNProtocolloEmergenza());
                        nuovaAnagrafica.setImpronta(anagraficaService.generateImpronta(nuovaAnagrafica));
                        nuovaAnagrafica.persistAndFlush();
                        contattoMittente = nuovaAnagrafica;
                    }
                }
                else { // protocollo non in entrata -> mittente in organigramma
                    List<Office> ufficiMittenti = ssoManager.getOffices(protocolloEmergenza.getMittente());
                    if (ufficiMittenti != null && !ufficiMittenti.isEmpty()) {
                        ufficioMittente = ufficiMittenti.get(0);
                    }
                }

                //NOTA: cercare destinatari in anagrafica
                if (tipoRegistrazione.equals(TipoRegistrazione.Uscita)) {
                    RicercaAnagraficaDTO dto = new RicercaAnagraficaDTO();
                    dto.setSize(1);
                    dto.setPage(0);

                    for(String destinatario : destinatari) {
                        dto.setSearch(destinatario);
                        Anagrafica mittenteInAnagrafica = anagraficaService.getAnagraficaQuery(dto).firstResultOptional().orElse(null);
                        if (mittenteInAnagrafica != null) {
                            contattiDestinatari.add(mittenteInAnagrafica);
                        }
                        else {
                            Anagrafica nuovaAnagrafica = Anagrafica.buildAnagraficaFromProtocolloEmergenza(destinatario, "Creata durante importazione protocollo di emergenza n. "+protocolloEmergenza.getNProtocolloEmergenza());
                            nuovaAnagrafica.setImpronta(anagraficaService.generateImpronta(nuovaAnagrafica));
                            nuovaAnagrafica.persistAndFlush();
                            contattiDestinatari.add(nuovaAnagrafica);
                        }
                    }
                }
                else {
                    //NOTA: cercare destinatari in organigramma
                    destinatari.forEach(d -> ufficiReferenti.addAll(ssoManager.getOffices(d)));
                    List<DatiUtenteSlimSSO> utenti = ssoManager.getAllUtenti(applicationId);

                    utentiReferenti = utenti.stream()
                        .filter(utente -> destinatari.stream().anyMatch(searchFilter -> {
                            String searchFilterLower = searchFilter.toLowerCase();
                            return  (utente.firstName.toLowerCase() + " " + utente.lastName.toLowerCase()).contains(searchFilterLower) ||
                                    (utente.lastName.toLowerCase() + " " + utente.firstName.toLowerCase()).contains(searchFilterLower);
                        })).toList();
                }

                Titolario titolario = null;
                if (protocolloEmergenza.getTitolario() != null && protocolloEmergenza.getTitolario().contains("/")) {
                    int lastSlash = protocolloEmergenza.getTitolario().lastIndexOf("/");
                    String inputNameTitolario = protocolloEmergenza.getTitolario().substring(lastSlash + 1);
                    List<Titolario> titolari = em.createNamedQuery("getTitolarioFromNome", Titolario.class).setParameter("nome", inputNameTitolario).getResultList();
                    if(titolari != null && !titolari.isEmpty()){
                        for(Titolario t : titolari){
                            StringBuilder classificazione = new StringBuilder();
                            List<TitolarioOutputDTO> titolariDTO = titolarioService.getHierarchyForTitolarioId(t.getId()).getTitolario();
                            titolariDTO.forEach(x -> classificazione.append(x.getLabel()).append("/"));
                            classificazione.append(t.getNome());
                            if(classificazione.toString().equalsIgnoreCase(protocolloEmergenza.getTitolario())){
                                titolario = t;
                                break;
                            }
                        }
                    }
                }


                if( titolario != null && (titolario.getTsDeleted() != null || (titolario.getTsChiusura() != null && titolario.getTsChiusura().before(Calendar.getInstance().getTime()))) ) {
                    throw new IllegalArgumentException("Il fascicolo di destinazione è in uno stato di chiusura");
                }

                String numeroProtocollo = numeroProtocolloCircolareService.generateDistribuitedNumeroProtocollo();

                Protocollo protocollo = new Protocollo();
                protocollo.setMittente(protocolloEmergenza.getMittente());

                if (tipoRegistrazione.equals(TipoRegistrazione.Entrata)) {
                    protocollo.setIdMittente(contattoMittente != null ? contattoMittente.getId().toString() : "");
                }
                else {
                    protocollo.setIdMittente(ufficioMittente != null ? ufficioMittente.code : "");
                }

                if (tipoRegistrazione.equals(TipoRegistrazione.Uscita)) {
                    String destinatariString = contattiDestinatari.stream().map(ur -> ur.getRagioneSociale()).collect(Collectors.joining(", "));
                    protocollo.setDestinatari(destinatariString);
                }
                else {
                    String destinatariString = Stream.concat(
                            ufficiReferenti.stream().map(ur -> ur.name + " " + ur.description),
                            utentiReferenti.stream().map(u -> u.firstName + " " + u.lastName)
                    ).collect(Collectors.joining(", "));
                    protocollo.setDestinatari(destinatariString);
                }

                if(protocolloEmergenza.getNProtocolloMittente() != null && !protocolloEmergenza.getNProtocolloMittente().isEmpty()) {
                    protocollo.setProtocolloMittente(protocolloEmergenza.getNProtocolloMittente());
                }
                if(protocolloEmergenza.getDataProtocolloMittente() != null) {
                    protocollo.setDataProtocolloMittente(protocolloEmergenza.getDataProtocolloMittente());
                }
                protocollo.setNProtocollo(numeroProtocollo);
                log.info(LogUtils.GENERAZIONE_NUM_PROTOCOLLO_FORMAT,protocollo.getNProtocollo());
                protocollo.setOggetto(Normalizer.normalize(protocolloEmergenza.getOggetto(), Normalizer.Form.NFC));
                protocollo.setTipoRegistrazione(tipoRegistrazione);
                protocollo.setMetodoSpedizione(metodoSpedizione);
                protocollo.setIdUtente(ssoManager.extractIdFromToken());
                protocollo.setUtente(ssoManager.extractNameFromToken());
                protocollo.setCdr(selectedOfficeName);
                protocollo.setCdrCode(selectedOffice);
                protocollo.setTsCreation(Calendar.getInstance().getTime());
                protocollo.setTsStartVali(Calendar.getInstance().getTime());
                protocollo.setStato(StatoProtocollo.InCorso);
                protocollo.setNProtocolloEmergenza(protocolloEmergenza.getNumeroProtocolloEmergenza());
                protocollo.setDataProtocolloEmergenza(protocolloEmergenza.getDataProtocolloEmergenza());
                protocollo.persist();

                if (titolario != null) {
                    ProtocolliClassificazione.builder()
                            .protocollo(protocollo)
                            .idTitolario(titolario.getId())
                            .tsCreation(Calendar.getInstance().getTime())
                            .build()
                            .persistAndFlush();
                }

                for(Office office : ufficiReferenti) {
                    ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                            .idProtocollo(protocollo.getId())
                            .idDestinatario(office.code)
                            .nomeDestinatario(office.name + " " + office.short_description)
                            .attribuzione("competenza")
                            .tipoDestinatario("ufficio")
                            .isAssegnato(true)
                            .creationOption(true)
                            .statoProtocollo(StatoProtocollo.Assegnato)
                            .tsCreation(Calendar.getInstance().getTime())
                            .tsStartVali(Calendar.getInstance().getTime())
                            .tsStatoProtocollo(Calendar.getInstance().getTime())
                            .build();

                    String storicoOperazione = StoricoOperazione.AssegnazioneProtocollo
                            .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                            .concat(referentiProtocollo.getNomeDestinatario())
                            .concat(".");

                    storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), storicoOperazione, null);

                    referentiProtocollo.persist();
                }

                for(DatiUtenteSlimSSO utente : utentiReferenti){
                    ReferentiProtocollo referentiProtocollo = ReferentiProtocollo.builder()
                            .idProtocollo(protocollo.getId())
                            .idDestinatario(utente.authId)
                            .nomeDestinatario(utente.firstName + " " + utente.lastName)
                            .attribuzione("competenza")
                            .tipoDestinatario("utente")
                            .isAssegnato(true)
                            .creationOption(true)
                            .statoProtocollo(StatoProtocollo.DaPrendereInCarico)
                            .tsCreation(Calendar.getInstance().getTime())
                            .tsStartVali(Calendar.getInstance().getTime())
                            .tsStatoProtocollo(Calendar.getInstance().getTime())
                            .build();

                    String storicoOperazione = StoricoOperazione
                            .AssegnazioneProtocollo
                            .getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()))
                            .concat(referentiProtocollo.getNomeDestinatario())
                            .concat(".");

                    storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), storicoOperazione, null);

                    referentiProtocollo.persist();
                }

                storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), StoricoOperazione.CreazioneAutomaticaProtocollo.getStatoParameter("Protocollo"), null);

                protocolloEmergenza.setNProtocolloEmergenza(protocollo.getNProtocolloEmergenza());
                protocolloEmergenza.setNProtocollo(protocollo.getNProtocollo());
            }
        }
        return result;
    }
}

