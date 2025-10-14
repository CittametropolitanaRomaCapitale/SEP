package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.ConservazioneClient;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.client.SendNotificaClient;
import it.parsec326.pi.intranet.dto.RegistroGiornalieroOutputDTO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSlimSSO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaRegistiGiornalieriDTO;
import it.parsec326.pi.intranet.dto.client.conservazione.DettaglioParErDTO;
import it.parsec326.pi.intranet.dto.client.conservazione.RegistroGiornalieroDTO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.model.EmailTemplate;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.model.RegistroGiornaliero;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.*;
import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.NotImplementedException;

import java.io.ByteArrayInputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

@ApplicationScoped
@Slf4j
public class RegistroGiornalieroService implements PanacheCustomEntityServiceInterface<RegistroGiornaliero> {
    @Inject
    @Getter
    UserTransaction transaction;

    @Inject
    DocumentService documentService;

    @Inject
    StoricoService storicoService;

    @Inject
    EntityManager em;

    @Inject
    ConservazioneClient conservazioneClient;

    @Inject
    SSOClient ssoManager;

    @Inject
    NotificaService notificaService;

    @Inject
    SendNotificaClient sendNotificaClient;

    @Inject
    MinioConnectionFactory minioFactory;

    @Inject
    ConfigurazioneService configurazioneService;

    @Inject
    EmailTemplateService emailTemplateService;
    private final String bucketName = "pi-docs";
    private final String docsBucketPath = "docs";
    private final String registroBucketPath = "registrogiornaliero";

    private final static String STORICO_CREAZIONE_REGISTRO = "Creazione registro giornaliero";
    private final static String STORICO_CONSERVAZIONE_REGISTRO = "Conservazione registro giornaliero";

    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    @Transactional
    public void scheduleCreateRegistroGiornaliero() {
        boolean creationSuccessfull = createRegistroGiornaliero();
        if (!creationSuccessfull) {
            //TODO: inviare una mail di notifica a tutti gli admin di errore
            List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
            String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
            PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();
            if (peoInvioNotifica != null) {
                log.info("Estrazione peoInvioNotifica: {}, per l'elaborazione delle notifiche.", peoInvioNotifica.getIndirizzoEmail());
                List<DatiUtenteSlimSSO> adminsRecipients = ssoManager.getAdminsForApplicationSlim(Integer.valueOf(applicationId));
                EmailTemplate template = emailTemplateService.getTemplate(Operazione.erroreGenerazioneRegistroGiornaliero, "notifica");
                if (template == null) {
                    CustomException.get(CustomException.ErrorCode.NOT_FOUND,"Template non trovato per l'operazione: ERRORE GENERAZIONE REGISTRO GIORNALIERO").boom();
                }
                for(DatiUtenteSlimSSO adminRecipient : adminsRecipients) {
                    String oggettoEmailNotifica = template.getOggetto();
                    String sbCorpoEmailNotifica = template.getCorpo()
                            .replace("{{headerCorpo}}", oggettoEmailNotifica)
                            .replace("{{cognomeUtenteTO}}", adminRecipient.lastName)
                            .replace("{{nomeUtenteTO}}", adminRecipient.firstName)
                            .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM));
                    Long idNotifica = notificaService.newNotifica(
                            null,
                            peoInvioNotifica.getIndirizzoEmail(),
                            adminRecipient.email,
                            oggettoEmailNotifica,
                            sbCorpoEmailNotifica, Operazione.erroreGenerazioneRegistroGiornaliero.toString());
                    if (idNotifica != null) {
                        sendNotificaClient.sendNotifica(idNotifica);
                    }
                }
            }
        }
    }

    @Transactional
    public boolean createRegistroGiornalieroForDay(Date day) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        RegistroGiornaliero registro = new RegistroGiornaliero();
        try {
            LocalDate localDate = day.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            String dataNomeFile = localDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

            // Controlla se esiste già un registro per la data di ieri
            if (RegistroGiornaliero.find("file = ?1 or dataRegistro = ?2", dataNomeFile + ".pdf", day).count() > 0) {
                LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                return false; // Non creare un duplicato
            }

            String base64Registro = documentService.getPdfRegistroGiornaliero(day);
            if (base64Registro == null) {
                LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                return false;
            }

            byte[] decodedBytes = Base64.getDecoder().decode(base64Registro);
            String sha256 = DigestUtils.sha256Hex(decodedBytes);
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(decodedBytes);

            Date now = Calendar.getInstance().getTime();
            registro.setDataRegistro(day);
            registro.setFile(dataNomeFile + ".pdf");
            registro.setTsCreation(now);

            String minioId = UUID.randomUUID().toString().replaceAll("-", "");
            String fileName = String.format("%s_%s.pdf", dataNomeFile, minioId);
            String filePath = String.format("%s/%s/%s", docsBucketPath, registroBucketPath, InputUtils.normalizeFilenameInput(fileName));

            long fileSize = decodedBytes.length;
            long partSize = Math.min(Math.max(fileSize / 10000, 5242880), 104857600);
            boolean success = minioFactory.uploadFileByBais(bucketName, filePath, byteArrayInputStream, fileSize, partSize);
            if (!success)
                throw new RuntimeException("Errore durante il caricamento file: " + fileName);

            registro.setRiferimentoMinio(filePath);
            registro.persistAndFlush();
            storicoService.insertNewStoricoForIdRegistroGiornalieroWithUtenteSistema(registro, STORICO_CREAZIONE_REGISTRO, null);

            RegistroGiornalieroDTO dto = new RegistroGiornalieroDTO();
            dto.setIdRegistro(registro.getId().toString());
            dto.setAnno(LocalDate.now().getYear());
            dto.setNomeFile(dataNomeFile);
            dto.setBase64Pdf(base64Registro);
            dto.setSha256(sha256);
            dto.setLogin(configurazioneService.getLoginConservazione());
            DettaglioParErDTO dettaglioParErDTO = conservazioneClient.invioConservazione(dto);
            log.info("Result Conservazione ParEr:" + dettaglioParErDTO.message);
            String noteConservazione = "";
            if(dettaglioParErDTO.done){
                noteConservazione = String.format("CONSERVATO - URN: %s", dettaglioParErDTO.urn);
            }else {
                noteConservazione = String.format("NON CONSERVATO - ERROR: %s", dettaglioParErDTO.message);
            }
            storicoService.insertNewStoricoForIdRegistroGiornalieroWithUtenteSistema(registro, STORICO_CONSERVAZIONE_REGISTRO, noteConservazione);


            if(registro.getEsitoVersamento() == null || registro.getEsitoVersamento().isEmpty() ||
                    (registro.getEsitoVersamento() != null && !registro.getEsitoVersamento().equals("CONSERVATO"))){
                em.createNamedQuery("updateNoteAndUrn")
                        .setParameter("id", registro.getId())
                        .setParameter("note", dettaglioParErDTO.message)
                        .setParameter("esitoVersamento", dettaglioParErDTO.done ? "CONSERVATO" : "NON CONSERVATO")
                        .setParameter("urn", dettaglioParErDTO.urn)
                        .executeUpdate();
            }


            LogUtils.exiting(LogUtils.LogLevel.DEBUG);

            log.info("Creazione del registro giornaliero esito: POSITIVO");
            return true;
        } catch (Exception e) {
            registro.setNote("Errore: " + e.getMessage());
            log.error("Errore durante la creazione del registro giornaliero: ", e.getMessage());
            registro.persistAndFlush();
            LogUtils.exiting(LogUtils.LogLevel.ERROR);

            return false;
        }
    }

    @Transactional
    public boolean createRegistroGiornaliero() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Date yesterdayDate = Date.from(yesterday.atStartOfDay(ZoneId.systemDefault()).toInstant());
        return createRegistroGiornalieroForDay(yesterdayDate);
    }

    @ExceptionChecked
    public RegistroGiornalieroOutputDTO getRegistroGiornaliero(RicercaRegistiGiornalieriDTO dto) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try {
            if (dto == null)
                throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());
            // SORT
            Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());
            Map<String, Object> params = new HashMap<>();
            StringBuilder query = new StringBuilder("id is not null ");

            if (dto.hasSearch()) {
                query.append("and (:search = '' ")
                        .append("or lower(file) like LOWER(concat('%', :search, '%')) ")
                        .append("or lower(note) like LOWER(concat('%', :search, '%')) )");
                params.put("search", dto.getSearch().trim());
            }

            // aggiunta filtro per intervallo temporale
            if (dto.hasDataRegistroIntervallo()) {
                query.append("and dataRegistro BETWEEN :dataRegistroFrom AND :dataRegistroTo ");
                params.put("dataRegistroFrom", dto.getDataRegistroFrom());
                params.put("dataRegistroTo", dto.getDataRegistroTo());
            } else if (dto.getDataRegistroFrom() != null) {
                query.append("and dataRegistro >= :dataRegistroFrom ");
                params.put("dataRegistroFrom", dto.getDataRegistroFrom());
            } else if (dto.getDataRegistroTo() != null) {
                query.append("and dataRegistro <= :dataRegistroTo ");
                params.put("dataRegistroTo", dto.getDataRegistroTo());
            }

            if (dto.hasNote()) {
                query.append("and lower(note) like LOWER(concat('%', :note, '%')) ");
                params.put("note", dto.getNote().trim());
            }
            PanacheQuery<RegistroGiornaliero> registriQuery = RegistroGiornaliero.find(query.toString(), sortCriteria, params);
            List<RegistroGiornaliero> registri = registriQuery.page(Page.of(dto.getPage(), dto.getSize())).list();

            long totalResults = registriQuery.count();
            RegistroGiornalieroOutputDTO outputDTO = new RegistroGiornalieroOutputDTO(registri, getPagesCount(totalResults, dto.getSize()), totalResults);

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return outputDTO;

        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public PanacheQuery<RegistroGiornaliero> getFindAllQuery(String search, SortInput sort) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }

    @Override
    public PanacheQuery<RegistroGiornaliero> getFindByIdQuery(Long id) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }
}
