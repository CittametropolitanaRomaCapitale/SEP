package it.parsec326.pi.email.pec_queue.worker;

import io.quarkus.narayana.jta.QuarkusTransaction;
import it.parsec326.pi.email.model.PecContentDTO;
import it.parsec326.pi.email.model.PecToRead;
import it.parsec326.pi.email.model.RicevutaPecContentDTO;
import it.parsec326.pi.email.pec_queue.PecEmailFetcher;
import it.parsec326.pi.intranet.dto.input.segnatura.RiferimentoProtocolloSegnaturaDTO;
import it.parsec326.pi.intranet.dto.mail.AttachmentDTO;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import it.parsec326.pi.intranet.dto.mail.RicevutaPECDTO;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.*;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.mail.*;
import jakarta.mail.search.ComparisonTerm;
import jakarta.mail.search.SearchTerm;
import jakarta.mail.search.SentDateTerm;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.eclipse.angus.mail.imap.IMAPFolder;

import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Stream;

@Slf4j
@ApplicationScoped
public class EmailReaderWorker extends EmailWorkerNotifyingThread {

    private EmailService emailService;
    private AllegatoService allegatoService;
    private ProtocolloService protocolloService;
    private StoricoService storicoService;
    private EntityManager em;

    private boolean stopExecution;

    private PecToRead pecPeoConfiguration;
    private PecMessageConverterService pecMessageConverterService;

    private Folder inbox;

    private String logPrefix;

    @Getter
    @Setter
    private AtomicBoolean running = new AtomicBoolean(true);
    public EmailReaderWorker(EmailService emailService,
                             AllegatoService allegatoService,
                             ProtocolloService protocolloService,
                             StoricoService storicoService,
                             EntityManager em,
                             PecToRead pecPeoConfiguration,
                             PecMessageConverterService pecMessageConverterService) {
        this.emailService = emailService;
        this.allegatoService = allegatoService;
        this.protocolloService = protocolloService;
        this.storicoService = storicoService;
        this.em = em;
        this.pecPeoConfiguration = pecPeoConfiguration;
        this.pecMessageConverterService = pecMessageConverterService;
    }

    public Message[] getMessagesToRead(Date from, Date to) throws Exception {
        Date lastDayToRead = from == null ? pecPeoConfiguration.getLastTsInvio() : from;

        Properties properties = new Properties();
        properties.put("mail.store.protocol", "imaps");
        properties.put("mail.imap.host", pecPeoConfiguration.getConfigurazione().getImapHost());
        properties.put("mail.imap.port", pecPeoConfiguration.getConfigurazione().getImapPort());

        if (pecPeoConfiguration.getConfigurazione().getTipologiaPosta().isPec()) properties.put("mail.imap.ssl.enable", "true");

        String username = pecPeoConfiguration.getIndirizzoEmail();
        String password = pecPeoConfiguration.getPasswordDecrypted();

        Session session = Session.getDefaultInstance(properties);
        Store store = session.getStore("imaps");
        store.connect(pecPeoConfiguration.getConfigurazione().getImapHost(), username, password);

        inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);

        // NOTA: il protocollo IMAP permette soltanto una ricerca per data. Si filtrano pertanto soltanto i messaggi arrivati in giornata
        SearchTerm sTerm = new SentDateTerm(ComparisonTerm.GE, lastDayToRead);
        Message[] messagesInDay = inbox.search(sTerm);

        // Filtri i messaggi del giorno secondo l'offset rispetto all'orario stabilito
        Stream<Message> messagesToReadStream = Arrays.stream(messagesInDay).filter(message ->
        {
            try {
                long sentTime = message.getSentDate().getTime();
                if (to != null && from != null) return sentTime > from.getTime() && sentTime < to.getTime();
                if (to != null) return sentTime < to.getTime();
                if (from != null) return sentTime > from.getTime();
                //System.currentTimeMillis() - 60 * 1000 * 5;
                return sentTime > lastDayToRead.getTime();
            } catch (MessagingException e) {
                log.error("[EmailReaderWorker] - Errore durante la lettura della data di invio del messaggio: ", e);
                return false;
            }
        });
        return messagesToReadStream.toArray(Message[]::new);
    }

    @Override
    public void doRun() {
        doForceRun(null, null, true, true);
    }

    /**
     * Ritorna la lista di identificativi associati alla PEC che è stata letta
     * @return
     */
    @Override
    public List<String> getIdentifiers() {
        String idUtente = pecPeoConfiguration.getIdUtente();
        List<String> list = new ArrayList<>();
        if (idUtente != null) list.add(idUtente);
        for(Ufficio cdr : pecPeoConfiguration.getUffici()){
            list.add(cdr.getCdr());
        }
        return list;
    }


    public boolean processPec(PecContentDTO contentDTO) {
        if (contentDTO == null) return true;
        try {
            if ((emailService.getFromMessageId(contentDTO.getMessageId()) == null) && (!emailService.checkImprontaEmailOnDB(contentDTO))) {
                if (!contentDTO.isToBeProtocolled()) {
                    if (contentDTO.isRispostaAutomatica() && contentDTO.getNProtocolloInternoRiferimento() != null) {
                        log.info("{} Email considerata risposta automatica {} - OGGETTO: {} - FROM: {}", logPrefix, contentDTO.getMessageId(), contentDTO.getSubject(), contentDTO.getFrom());
                        log.info("{} In corso collegamento come allegato al protocollo {}", logPrefix, contentDTO.getNProtocolloInternoRiferimento());
                        List<Allegato> attachmentList = allegatoService.generateAllegatiFromEmailContentDTO(contentDTO, true);
                        protocolloService.attachRispostaAutomaticaToProtocollo(contentDTO.isNProtocolloFromSegnatura(), contentDTO.getNProtocolloInternoRiferimento(), contentDTO, attachmentList);
                    }
                    else {
                        log.info("{} Email da non protocollare {} - OGGETTO: {} - FROM: {}", logPrefix, contentDTO.getMessageId(), contentDTO.getSubject(), contentDTO.getFrom());
                        List<Allegato> attachmentList = allegatoService.generateAllegatiFromEmailContentDTO(contentDTO, false);
                        emailService.saveRecordEmail(contentDTO, attachmentList, null);
                    }
                    workDone = true;
                } else {
                    log.info("{} Protocollazione Email {} - OGGETTO: {} - FROM: {}", logPrefix, contentDTO.getMessageId(), contentDTO.getSubject(), contentDTO.getFrom());
                    List<Allegato> attachmentList = allegatoService.generateAllegatiFromEmailContentDTO(contentDTO, false);
                    Protocollo protocollo = protocolloService.saveProtocolloFromPec(contentDTO, attachmentList, contentDTO.getRiferimentoProtocolloSegnaturaDTO());
                    if (!protocollo.getNProtocollo().isEmpty()) {
                        log.info("{} Protocollazione Email con messageId: {} - N.Protocollo: {} ", logPrefix, contentDTO.getMessageId(), protocollo.getNProtocollo());
                        workDone = true;
                    }
                }
            }
            else {
                log.info("{} Email con messageId {} già protocollata", logPrefix, contentDTO.getMessageId());
            }
            return true;
        } catch (Exception e) {
            stopExecution = true;
            log.error("{} Errore durante l'elaborazione della Email con id: {} - {}", logPrefix, contentDTO.getMessageId(), ExceptionUtils.getRootCauseMessage(e));
        }
        return false;
    }

    public void processRicevuta(RicevutaPECDTO ricevutaPEC) {
        QuarkusTransaction.requiringNew().run(() -> {

            try {
                if (ricevutaPEC == null) return;

                //Ricevuta già presente in db e quindi processata correttamente
                if (emailService.getFromMessageId(ricevutaPEC.getMessageId()) != null) {
                    log.info("{} Ricevuta già processata {}", logPrefix, ricevutaPEC.getMessageId());
                    return;
                }

                Email email = emailService.getFromMessageId(ricevutaPEC.getRiferimentoMessageId());
                if (email == null) {
                    log.info("{} Nessuna email di riferimento {}", logPrefix, ricevutaPEC.getRiferimentoMessageId());
                    return;
                }

                //Se la ricevuta è di avvenuta consegna, si salva la data di ricezione della PEC
                //coincidente con la data di avvenuta consegna della ricevuta
                if (ricevutaPEC.isRicevutaDiConsegna()) {
                    email.setTsRicezione(ricevutaPEC.getTsInvio());
                    Email.persist(email);
                }

                //Get protocollo
                Protocollo protocollo = email.getProtocollo();
                if (protocollo == null) {
                    log.info("{} Nessun protocollo per email {}", logPrefix, email.getId());
                    return;
                }

                //Check impronta dell'allegato se è già stato aggiunto al protocollo
                String improntaAllegato = AllegatoService.calculateImpronta(ricevutaPEC.getMessaggioEml().getContent());
                if (protocollo.getAllegatoByImpronta(improntaAllegato) != null) {
                    log.info("{} Ricevuta già allegata al protocollo {}", logPrefix, protocollo.getId());
                    return;
                }

                String nomeAllegatoConNProtocollo = protocollo.getNProtocollo();

                if (ricevutaPEC.getTo() != null && !ricevutaPEC.getTo().isBlank()) {
                    String[] destinatari = ricevutaPEC.getTo().split(",");
                    List<String> destinatariList = Arrays.stream(destinatari)
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .toList();

                    String emails = String.join("_", destinatariList);
                    String emailsDesc = String.join(", ", destinatariList);

                    if (!emails.isBlank()) {
                        nomeAllegatoConNProtocollo = nomeAllegatoConNProtocollo.concat("_").concat(emails);
                        String displayName = ricevutaPEC.getDisplayName() + " per: ";
                        displayName = displayName.concat(emailsDesc);
                        ricevutaPEC.setDisplayName(displayName);
                    }
                }


                nomeAllegatoConNProtocollo = nomeAllegatoConNProtocollo.concat("_").concat( ricevutaPEC.getMessaggioEml().getName());
                ricevutaPEC.getMessaggioEml().setName(nomeAllegatoConNProtocollo);

                //Genera allegato dalla ricevuta e associa al protocollo
                Allegato allegato = allegatoService.generateAllegatoFromRicevutaPECDTO(ricevutaPEC, false);
                if (allegato == null) {
                    log.error("{} Impossibile allegare ricevuta al protocollo {}", logPrefix, protocollo.getId());
                    stopExecution = true;
                    return;
                }

                protocollo.addAllegato(allegato);
                protocollo.persistAndFlush();

                StringBuilder sb = new StringBuilder();
                sb.append(StoricoOperazione.SalvataggioRicevuta.getStatoParameter(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()) ? "Circolare" : "Protocollo"));
                sb.append(": ");
                sb.append(ricevutaPEC.getDisplayName());
                String operazione = Utils.truncatetringToSize(sb.toString(), 255, "...");
                storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(protocollo, operazione);

                Date date = new Date();
                Timestamp timesStamp = new Timestamp(date.getTime());

                Email ricevuta = new Email();
                ricevuta.setIdUtente(email.getIdUtente());
                ricevuta.setProtocollo(protocollo);
                ricevuta.setFrom(ricevutaPEC.getFrom());
                ricevuta.setTo(ricevutaPEC.getTo());
                ricevuta.setOggetto(ricevutaPEC.getSubject());
                ricevuta.setTsInvio(ricevutaPEC.getTsInvio());
                ricevuta.setTsCreation(timesStamp);
                ricevuta.setTsStartVali(timesStamp);
                ricevuta.setStatoInvio(StatoInvio.INVIATO);
                ricevuta.setEmailDirection(EmailDirection.ENTRATA);
                ricevuta.setTipoEmail("Ricevuta");
                ricevuta.setMessageId(ricevutaPEC.getMessageId());
                if (Boolean.TRUE.equals(email.getIsHidden())) {
                    ricevuta.setIsHidden(true);
                }

                ricevuta.persistAndFlush();

                Allegato emlRicevuta = allegatoService.generateAllegatoFromRicevutaPECDTO(ricevutaPEC, true);
                em.createNamedQuery("updateIdEmailById")
                        .setParameter("idEmail", ricevuta.getId())
                        .setParameter("idAllegato", emlRicevuta.getId())
                        .executeUpdate();

                workDone = true;
            }
            catch(Exception ex) {
                log.error("{} - Errore in lettura ricevuta: {}", logPrefix, ex.getMessage()) ;
                stopExecution = true;
            }
        });
    }


    @Transactional
    public void doForceRun(Date from, Date to, boolean readPecs, boolean readRicevute) {
        workDone = false;
        stopExecution = false;
        if (pecPeoConfiguration == null) {
            log.error("[ERW] - pecPeoConfiguration non può essere null");
            return;
        }

        logPrefix = "[ERW - " + pecPeoConfiguration.getIndirizzoEmail() + "]: ";
        log.info("{} INIZIO LETTURA", logPrefix);
        try{
            Message[] messagesToRead = getMessagesToRead(from, to);
            List<String> cdrList = pecPeoConfiguration.getUffici().stream().map(Ufficio::getCdr).toList();
            PecEmailFetcher fetcher = new PecEmailFetcher();
            for (Message message : messagesToRead) {
                String[] dispositionHeaders = message.getHeader("X-Ricevuta");
                boolean isRicevuta = dispositionHeaders != null && dispositionHeaders.length > 0;
                if (isRicevuta && readRicevute) {
                    RicevutaPECDTO content = pecMessageConverterService.convertToRicevutaDTO(message);
                    RicevutaPecContentDTO ricevutaToRead = RicevutaPecContentDTO.mapFromRicevutaPECDTO(pecPeoConfiguration.getIdUtente(), cdrList, content);
                    processRicevuta(ricevutaToRead);
                }
                else if (readPecs) {
                    fetcher.setMsgNumber(message.getMessageNumber());
                    ((IMAPFolder)inbox).doCommand(fetcher);
                    byte[] bytesEmlContent = fetcher.getEmlContent();
                    EmailContentDTO content = pecMessageConverterService.convertToEmailContentDTO(message, bytesEmlContent);

                    boolean isRispostaAutomatica = false;
                    boolean isNProtocolloFromSegnatura = false;
                    String nProtocolloInternoRiferimento = null;
                    RiferimentoProtocolloSegnaturaDTO rifProtocolloEsterno = null;
                    for(AttachmentDTO attachment : content.getAttachments()) {
                        if (attachment.getName().equalsIgnoreCase("segnatura.xml")) {
                            //NOTA: leggere il file e capire se è una risposta automatica
                            Map<String, RiferimentoProtocolloSegnaturaDTO> mapRiferimentiFromSegnatura = pecMessageConverterService.readInputSegnaturaXml(attachment.getContent());
                            if (mapRiferimentiFromSegnatura != null) {
                                if (mapRiferimentiFromSegnatura.containsKey("rifInterno")) {
                                    RiferimentoProtocolloSegnaturaDTO rifInterno = mapRiferimentiFromSegnatura.get("rifInterno");
                                    if (rifInterno.getNumero() != null) {
                                        nProtocolloInternoRiferimento = rifInterno.getNumero();
                                        isRispostaAutomatica = true;
                                        isNProtocolloFromSegnatura = true;
                                    }
                                }
                                if (mapRiferimentiFromSegnatura.containsKey("rifEsterno")) {
                                    rifProtocolloEsterno = mapRiferimentiFromSegnatura.get("rifEsterno");
                                }
                            }
                        }
                    }
                    if (!isRispostaAutomatica) {
                        //IMPORTANTE: controllo su messaggio
                        nProtocolloInternoRiferimento = pecMessageConverterService.getNProtocolloInternoFromPecWithoutSignature(message, content.getFrom(), content.getSubject());
                        isRispostaAutomatica = nProtocolloInternoRiferimento != null;
                    }

                    content.setToBeProtocolled(!isRispostaAutomatica);
                    PecContentDTO pecToRead = PecContentDTO.mapFromEmailContentDTO(pecPeoConfiguration.getIdUtente(), cdrList, content, isRispostaAutomatica, isNProtocolloFromSegnatura, nProtocolloInternoRiferimento, rifProtocolloEsterno);
                    if (!processPec(pecToRead)) {
                        String exceptionMessage = logPrefix + "Errore lettura Email con oggetto: " + pecToRead.getSubject();
                        log.error(exceptionMessage);
                        LogException logException = new LogException();
                        logException.setIdUtente("");
                        logException.setTsCreation(new Date());
                        logException.setErrorContext(ErrorContext.PEC_ENTRATA);
                        logException.setErrorCode("000");
                        logException.setNote(exceptionMessage);
                        LogException.persist(logException);
                        break;
                    }
                }
                if (stopExecution) {
                    log.error("{} STOP ESECUZIONE PER ERRORE IN LETTURA", logPrefix);
                    break;
                }
            }
            log.info("{} FINE LETTURA", logPrefix);
        }
        catch (Exception e) {
            String exceptionMessage = logPrefix + "Errore lettura Email - Motivazione: " + e.getMessage();
            log.error(exceptionMessage);
            LogException logException = new LogException();
            logException.setIdUtente("");
            logException.setTsCreation(new Date());
            logException.setErrorContext(ErrorContext.PEC_ENTRATA);
            logException.setErrorCode("000");
            logException.setNote(exceptionMessage);

            logException.persistAndFlush();
        }
    }
}

