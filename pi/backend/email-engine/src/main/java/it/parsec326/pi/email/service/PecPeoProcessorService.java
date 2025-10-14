package it.parsec326.pi.email.service;

import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.Email;
import it.parsec326.pi.intranet.model.PeConfigurazione;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.service.EmailService;
import it.parsec326.pi.intranet.service.PecPeoService;
import it.parsec326.pi.intranet.utils.common.EmailDirection;
import it.parsec326.pi.intranet.utils.common.StatoInvio;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.mail.*;
import jakarta.mail.search.SearchTerm;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@ApplicationScoped
public class PecPeoProcessorService {

    @Inject
    EntityManager em;

    @Inject
    EmailService emailService;

    @Inject
    PecPeoService pecPeoService;

    int rangeHours = -48;

    public List<Email> getPecPeoNonInviateWithMaxResult(int maxResult){
        Instant nowMinusXMin = Instant.now().minus(2, ChronoUnit.MINUTES);
        Timestamp timestampLimite = Timestamp.from(nowMinusXMin);
        return em.createNamedQuery("findDaInviareOlderThan", Email.class)
                .setParameter("stati", List.of(StatoInvio.DA_INVIARE, StatoInvio.INVIO_FALLITO))
                .setParameter("timestampLimite", timestampLimite)
                .setMaxResults(maxResult)
                .getResultList();
    }

    public List<Email> getPecPeoNonInviate(){
        Instant nowMinusXMin = Instant.now().minus(2, ChronoUnit.MINUTES);
        Timestamp timestampLimite = Timestamp.from(nowMinusXMin);
        return em.createNamedQuery("findDaInviareOlderThan", Email.class)
                .setParameter("stati", List.of(StatoInvio.DA_INVIARE, StatoInvio.INVIO_FALLITO))
                .setParameter("timestampLimite", timestampLimite)
                .getResultList();
    }

    public void sendAllPecPeoNonInviate() throws Exception {
        List<Email> pecPeoNonInviate = getPecPeoNonInviateWithMaxResult(10);

        if(pecPeoNonInviate.isEmpty()){
            log.info("[PecPeoProcessorService] - Non ci sono Pec/Peo da inviare");
            return;
        }

        int pecPeoProcessate = 0;
        log.info("[PecPeoProcessorService] - Start Process delle notifiche Pec/Peo: {}", pecPeoNonInviate.size());
        for(Email email : pecPeoNonInviate){
            if(emailService.sendEmail(email.getId()) == null){
                pecPeoProcessate++;
            }
        }

        log.info("[PecPeoProcessorService] - End process delle Pec/Peo, inviate: {} di {}}", pecPeoProcessate, pecPeoNonInviate.size());

        List<Email> pecPeoNonInviatePostProcess = getPecPeoNonInviate();

        if(pecPeoNonInviatePostProcess.isEmpty()){
            log.info("[PecPeoProcessorService] - Tutte le Pec/Peo sono state inviate");
        }else{
            log.info("[PecPeoProcessorService] - Ci sono ancora: {} Pec/Peo da inviare", pecPeoNonInviatePostProcess.size());
        }
    }

    public void deleteAllFromInbox() {
        log.info("[PecPeoProcessorService] - Avvio del processo di eliminazione per tutte le caselle PEC con delete messages a true.");

        List<PecPeo> pecPeoList = em.createNamedQuery("findAllPecPeoToDelete", PecPeo.class).getResultList();
        if (pecPeoList.isEmpty()) {
            log.info("[PecPeoProcessorService] - Nessuna PEC trovata con delete messages a true.");
            return;
        }

        for (PecPeo pecPeo : pecPeoList) {
            try {
                log.info("[PecPeoProcessorService] - Inizio elaborazione per l'indirizzo PEC: {}", pecPeo.getIndirizzoEmail());
                deleteFromInboxByPecPeo(pecPeo);
                log.info("[PecPeoProcessorService] - Elaborazione completata per l'indirizzo PEC: {}", pecPeo.getIndirizzoEmail());
            } catch (Exception e) {
                log.error("[PecPeoProcessorService] - Errore durante l'elaborazione dell'indirizzo PEC {}: {}", pecPeo.getIndirizzoEmail(), e.getMessage());
            }
        }

        log.info("[PecPeoProcessorService] - Processo di eliminazione completato per tutte le caselle PEC.");
    }

    public void deleteAllOldFromInbox() {
        log.info("[PecPeoProcessorService] - Avvio del processo di eliminazione per tutte le caselle PEC con delete messages a true.");

        List<PecPeo> pecPeoList = em.createNamedQuery("findAllPecPeoToDelete", PecPeo.class).getResultList();
        if (pecPeoList.isEmpty()) {
            log.info("[PecPeoProcessorService] - Nessuna PEC trovata con delete messages a true.");
            return;
        }

        for (PecPeo pecPeo : pecPeoList) {
            try {
                log.info("[PecPeoProcessorService] - Inizio elaborazione per l'indirizzo PEC: {}", pecPeo.getIndirizzoEmail());
                deleteFromInboxByOldPecPeo(pecPeo, null, false);
                log.info("[PecPeoProcessorService] - Elaborazione completata per l'indirizzo PEC: {}", pecPeo.getIndirizzoEmail());
            } catch (Exception e) {
                log.error("[PecPeoProcessorService] - Errore durante l'elaborazione dell'indirizzo PEC {}: {}", pecPeo.getIndirizzoEmail(), e.getMessage());
            }
        }

        log.info("[PecPeoProcessorService] - Processo di eliminazione completato per tutte le caselle PEC.");
    }

    public void deleteFromInboxByPecPeoId(Long pecPeoId) {
        deleteFromInboxByPecPeo(PecPeo.findById(pecPeoId));
    }

    public void deleteFromInboxByPecPeoAddress(String pecAddress, Integer numMonths, Boolean checkAllEmails) {
        PecPeo pecPeo = pecPeoService.getPecPeoByEmail(pecAddress);
        if (!pecPeo.isDeleteMessages()) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile eliminare messaggi dalla casella").boom();
        }
        deleteFromInboxByOldPecPeo(pecPeo, numMonths, checkAllEmails);
    }

    @Transactional
    public void deleteFromInboxByPecPeoIdAndMessgeId(Long pecPeoId, Long emailId) {
        Email email = Email.findById(emailId);
        deleteEmailByMessageId(PecPeo.findById(pecPeoId), email.getMessageId());
    }

    @Transactional
    public void deleteEmailByMessageId(PecPeo pecPeo, String messageId) {
        PeConfigurazione peConfigurazione = pecPeo.getConfigurazione();
        Properties properties = createMailProperties(peConfigurazione);

        Store store = null;
        Folder inbox = null;

        try {
            // Crea una sessione email
            Session session = Session.getInstance(properties);
            store = session.getStore("imaps");
            store.connect(peConfigurazione.getImapHost(), pecPeo.getIndirizzoEmail(), pecPeo.getPasswordDecrypted());

            // Accedi alla cartella INBOX
            inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_WRITE);

            // Cerca il messaggio con il Message-ID specificato
            Message[] messagesToDelete = inbox.search(createMessageIdSearchTerm(messageId));

            if (messagesToDelete.length == 0) {
                log.info("[EmailDeletionService] - Nessun messaggio trovato con Message-ID: {}", messageId);
                return;
            }

            // Contrassegna i messaggi per l'eliminazione
            for (Message message : messagesToDelete) {
                message.setFlag(Flags.Flag.DELETED, true);
            }

            // Chiudi la cartella con salvataggio delle modifiche
            inbox.close(true);
            log.info("[EmailDeletionService] - Messaggio con Message-ID {} eliminato con successo.", messageId);

        } catch (Exception e) {
            log.error("[EmailDeletionService] - Errore durante l'eliminazione del messaggio con Message-ID {}: {}", messageId, e.getMessage());
        } finally {
            closeMailResources(store, inbox);
        }
    }

    @Transactional
    public void deleteFromInboxByPecPeo(PecPeo pecPeo) {
        Date rangeDate = getRangeDateToDelete(rangeHours);

        List<String> messageIds = em.createNamedQuery("findEmailToDeleteFromInbox", String.class)
                .setParameter("address", pecPeo.getIndirizzoEmail())
                .setParameter("emailDirection", EmailDirection.ENTRATA)
                .setParameter("timestampLimite", rangeDate)
                .getResultList();

        String queryRicevute = "SELECT e.messageId FROM Email e " +
                "WHERE e.tipoEmail = 'Ricevuta' ";
        queryRicevute += "AND e.protocollo.id IN (select distinct ee.protocollo.id from Email ee where ee.emailDirection = :directionRicevuta and statoInvio = :statoInvioRicevuta and from = :address) " +
                "AND e.emailDirection = :emailDirection " +
                "AND e.tsCreation > :timestampLimite";

        List<String> messageIdsRicevute = em.createQuery(queryRicevute, String.class)
                .setParameter("address", pecPeo.getIndirizzoEmail())
                .setParameter("directionRicevuta", EmailDirection.USCITA)
                .setParameter("statoInvioRicevuta", StatoInvio.INVIATO)
                .setParameter("emailDirection", EmailDirection.ENTRATA)
                .setParameter("timestampLimite", rangeDate)
                .getResultList();

        messageIds.addAll(messageIdsRicevute);

        if (messageIds.isEmpty()) {
            log.info("[PecPeoProcessorService] - Nessuna email da eliminare per l'indirizzo {}", pecPeo.getIndirizzoEmail());
            return;
        }

        // Configurazione della casella di posta
        PeConfigurazione peConfigurazione = pecPeo.getConfigurazione();
        Properties properties = createMailProperties(peConfigurazione);

        Store store = null;
        Folder inbox = null;

        try {
            // Creiamo una nuova Session ed otteniamo lo Store
            Session session = Session.getInstance(properties);
            store = session.getStore("imaps");
            store.connect(peConfigurazione.getImapHost(), pecPeo.getIndirizzoEmail(), pecPeo.getPasswordDecrypted());

            // Accesso alla cartella INBOX
            inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_WRITE);

            for (String messageId : messageIds) {
                try {

                    // Cerca e contrassegna i messaggi per l'eliminazione
                    Message[] messagesToDelete = inbox.search(createMessageIdSearchTerm(messageId));
                    if (messagesToDelete.length == 0) {
                        log.info("[PecPeoProcessorService] - Nessun messaggio trovato con Message-ID: {}", messageId);
                        continue;
                    }

                    for (Message msg : messagesToDelete) {
                        msg.setFlag(Flags.Flag.DELETED, true);
                    }

                    // Aggiorna lo stato dell'email nel database
                    updateEmailSetDeletedTrue(messageId);
                    log.info("[PecPeoProcessorService] - Messaggio con Message-ID {} contrassegnato per l'eliminazione.", messageId);

                } catch (Exception e) {
                    log.error("[PecPeoProcessorService] - Errore durante l'eliminazione del messaggio con Message-ID {}: {}", messageId, e.getMessage());
                }
            }

            // Elimina definitivamente i messaggi contrassegnati
            inbox.close(true);
            log.info("[PecPeoProcessorService] - Messaggi contrassegnati eliminati definitivamente per l'indirizzo {}.", pecPeo.getIndirizzoEmail());

        } catch (Exception e) {
            log.error("[PecPeoProcessorService] - Errore nella gestione della casella di posta per l'indirizzo {}: {}", pecPeo.getIndirizzoEmail(), e.getMessage());
        } finally {
            closeMailResources(store, inbox);
        }
    }

    @Transactional
    public void deleteFromInboxByOldPecPeo(PecPeo pecPeo, Integer numMonths, Boolean checkAllEmails){
        Date rangeDate = getRangeDateToDelete(rangeHours);
        // Calcola la data di un mese prima
        Calendar cal = Calendar.getInstance();
        cal.setTime(rangeDate);
        cal.add(Calendar.MONTH, numMonths == null ? -1 : -numMonths); // Sottrai un mese
        Date oneMonthBefore = cal.getTime();

        String query = "SELECT e.messageId FROM Email e " +
                "WHERE e.tipoEmail != 'PEO' " +
                "AND (e.to LIKE CONCAT('%', :address, '%') OR e.cc LIKE CONCAT('%', :address, '%')) ";
        if (!checkAllEmails)
            query += "AND (e.deletedFromInbox is null OR e.deletedFromInbox = false) ";

        query += "AND e.messageId is not null " +
                "AND e.emailDirection = :emailDirection " +
                "AND e.tsCreation > :timestampMax " +
                "AND e.tsCreation < :timestampLimite";


        String queryRicevute = "SELECT e.messageId FROM Email e " +
                "WHERE e.tipoEmail = 'Ricevuta' ";
        queryRicevute += "AND e.protocollo.id IN (select distinct ee.protocollo.id from Email ee where ee.emailDirection = :directionRicevuta and statoInvio = :statoInvioRicevuta and from = :address) " +
                "AND e.emailDirection = :emailDirection " +
                "AND e.tsCreation > :timestampMax " +
                "AND e.tsCreation < :timestampLimite";


        List<String> messageIds = em.createQuery(query, String.class) //em.createNamedQuery("findOldEmailToDeleteFromInbox", String.class)
                .setParameter("address", pecPeo.getIndirizzoEmail())
                .setParameter("emailDirection", EmailDirection.ENTRATA)
                .setParameter("timestampLimite", rangeDate)
                .setParameter("timestampMax", oneMonthBefore)
                .getResultList();

        List<String> messageIdsRicevute = em.createQuery(queryRicevute, String.class)
                .setParameter("address", pecPeo.getIndirizzoEmail())
                .setParameter("directionRicevuta", EmailDirection.USCITA)
                .setParameter("statoInvioRicevuta", StatoInvio.INVIATO)
                .setParameter("emailDirection", EmailDirection.ENTRATA)
                .setParameter("timestampLimite", rangeDate)
                .setParameter("timestampMax", oneMonthBefore)
                .getResultList();

        messageIds.addAll(messageIdsRicevute);

        if (messageIds.isEmpty()) {
            log.info("[PecPeoProcessorService] - Nessuna email da eliminare per l'indirizzo {}", pecPeo.getIndirizzoEmail());
            return;
        }

        // Configurazione della casella di posta
        PeConfigurazione peConfigurazione = pecPeo.getConfigurazione();
        Properties properties = createMailProperties(peConfigurazione);

        Store store = null;
        Folder inbox = null;

        try {
            // Creiamo una nuova Session ed otteniamo lo Store
            Session session = Session.getInstance(properties);
            store = session.getStore("imaps");
            store.connect(peConfigurazione.getImapHost(), pecPeo.getIndirizzoEmail(), pecPeo.getPasswordDecrypted());

            // Accesso alla cartella INBOX
            inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_WRITE);

            for (String messageId : messageIds) {
                try {

                    // Cerca e contrassegna i messaggi per l'eliminazione
                    Message[] messagesToDelete = inbox.search(createMessageIdSearchTerm(messageId));
                    if (messagesToDelete.length == 0) {
                        log.info("[PecPeoProcessorService] - Nessun messaggio trovato con Message-ID: {}", messageId);
                        continue;
                    }

                    for (Message msg : messagesToDelete) {
                        log.info("[PecPeoProcessorService] - Messaggio settato ad Eliminato: {}", msg.getSubject());
                        msg.setFlag(Flags.Flag.DELETED, true);
                    }

                } catch (Exception e) {
                    log.error("[PecPeoProcessorService] - Errore durante l'eliminazione del messaggio con Message-ID {}: {}", messageId, e.getMessage());
                }
            }

            // Elimina definitivamente i messaggi contrassegnati
            inbox.close(true);
            log.info("[PecPeoProcessorService] - Messaggi contrassegnati eliminati definitivamente per l'indirizzo {}.", pecPeo.getIndirizzoEmail());

        } catch (Exception e) {
            log.error("[PecPeoProcessorService] - Errore nella gestione della casella di posta per l'indirizzo {}: {}", pecPeo.getIndirizzoEmail(), e.getMessage());
        } finally {
            closeMailResources(store, inbox);
        }
    }

    public void checkDeletedAllFromInbox() {
        log.info("[PecPeoProcessorService] - Avvio del processo di controllo per tutte le caselle PEC con delete messages a true.");

        List<PecPeo> pecPeoList = em.createNamedQuery("findAllPecPeoToDelete", PecPeo.class).getResultList();
        if (pecPeoList.isEmpty()) {
            log.info("[PecPeoProcessorService] - Nessuna PEC trovata con delete messages a true da controllare.");
            return;
        }

        for (PecPeo pecPeo : pecPeoList) {
            try {
                log.info("[PecPeoProcessorService] - Inizio check per l'indirizzo PEC: {}", pecPeo.getIndirizzoEmail());
                checkDeletedFromInboxByPecPeo(pecPeo);
                log.info("[PecPeoProcessorService] - Check completato per l'indirizzo PEC: {}", pecPeo.getIndirizzoEmail());
            } catch (Exception e) {
                log.error("[PecPeoProcessorService] - Errore durante il check dell'indirizzo PEC {}: {}", pecPeo.getIndirizzoEmail(), e.getMessage());
            }
        }

        log.info("[PecPeoProcessorService] - Processo di controllo completato per tutte le caselle PEC.");
    }

    public void checkDeletedFromInboxByPecPeoId(Long pecPeoId) {
        checkDeletedFromInboxByPecPeo(PecPeo.findById(pecPeoId));
    }

    @Transactional
    public void checkDeletedFromInboxByPecPeo(PecPeo pecPeo) {
        Date rangeDate = getRangeDateToDelete(rangeHours);

        List<String> messageIds = em.createNamedQuery("findEmailToCheckIfDeletedFromInbox", String.class)
                .setParameter("address", pecPeo.getIndirizzoEmail())
                .setParameter("emailDirection", EmailDirection.ENTRATA)
                .setParameter("timestampLimite", rangeDate)
                .getResultList();

        String queryRicevute = "SELECT e.messageId FROM Email e " +
                "WHERE e.tipoEmail = 'Ricevuta' ";
        queryRicevute += "AND e.protocollo.id IN (select distinct ee.protocollo.id from Email ee where ee.emailDirection = :directionRicevuta and statoInvio = :statoInvioRicevuta and from = :address) " +
                "AND e.emailDirection = :emailDirection " +
                "AND e.deletedFromInbox = true " +
                "AND e.tsCreation > :timestampLimite";

        List<String> messageIdsRicevute = em.createQuery(queryRicevute, String.class)
                .setParameter("address", pecPeo.getIndirizzoEmail())
                .setParameter("directionRicevuta", EmailDirection.USCITA)
                .setParameter("statoInvioRicevuta", StatoInvio.INVIATO)
                .setParameter("emailDirection", EmailDirection.ENTRATA)
                .setParameter("timestampLimite", rangeDate)
                .getResultList();

        messageIds.addAll(messageIdsRicevute);

        if (messageIds.isEmpty()) {
            log.info("[PecPeoProcessorService] - Nessuna email da verificare per l'indirizzo {}", pecPeo.getIndirizzoEmail());
            return;
        }

        // Configurazione della casella di posta
        PeConfigurazione peConfigurazione = pecPeo.getConfigurazione();
        Properties properties = createMailProperties(peConfigurazione);

        Store store = null;
        Folder inbox = null;

        try {
            // Creiamo una nuova Session ed otteniamo lo Store
            Session session = Session.getInstance(properties);
            store = session.getStore("imaps");
            store.connect(peConfigurazione.getImapHost(), pecPeo.getIndirizzoEmail(), pecPeo.getPasswordDecrypted());

            // Accesso alla cartella INBOX
            inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            for (String messageId : messageIds) {
                try {
                    // Cerca e contrassegna i messaggi per l'eliminazione
                    Message[] messagesToDelete = inbox.search(createMessageIdSearchTerm(messageId));
                    if (messagesToDelete.length > 0) {
                        // Aggiorna lo stato dell'email nel database
                        updateEmailSetDeletedFalse(messageId);
                        log.error("[PecPeoProcessorService] - ripristino a false deleted_from_inbox - Mancata cancellazione della PEC con Message-ID {}", messageId);
                    }

                } catch (Exception e) {
                    log.error("[PecPeoProcessorService] - Errore durante il controllo del messaggio con Message-ID {}: {}", messageId, e.getMessage());
                }
            }

            inbox.close(true);

        } catch (Exception e) {
            log.error("[PecPeoProcessorService] - Errore nella verifica della casella di posta per l'indirizzo {}: {}", pecPeo.getIndirizzoEmail(), e.getMessage());
        } finally {
            closeMailResources(store, inbox);
        }
    }

    /**
     * Crea un SearchTerm per cercare messaggi con uno specifico Message-ID.
     */
    private SearchTerm createMessageIdSearchTerm(String messageId) {
        return new SearchTerm() {
            @Override
            public boolean match(Message message) {
                try {
                    String[] messageIdHeaders = message.getHeader("Message-ID");
                    return messageIdHeaders != null
                            && messageIdHeaders.length > 0
                            && messageIdHeaders[0].equalsIgnoreCase(messageId);
                } catch (MessagingException e) {
                    log.error("[PecPeoProcessorService] - Errore durante la lettura del Message-ID del messaggio: {}", e.getMessage());
                    return false;
                }
            }
        };
    }

    /**
     * Calcola una data relativa.
     */
    private Date getRangeDateToDelete(int hours) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, hours);
        return calendar.getTime();
    }
    private Properties createMailProperties(PeConfigurazione peConfigurazione) {
        Properties properties = new Properties();
        properties.put("mail.store.protocol", "imaps");
        properties.put("mail.imap.host", peConfigurazione.getImapHost());
        properties.put("mail.imap.port", peConfigurazione.getImapPort());
        if (peConfigurazione.getTipologiaPosta().isPec()) {
            properties.put("mail.imap.ssl.enable", "true");
        }
        return properties;
    }

    private void closeMailResources(Store store, Folder inbox) {
        if (inbox != null && inbox.isOpen()) {
            try {
                inbox.close(true);
            } catch (MessagingException e) {
                log.error("[PecPeoProcessorService] - Errore durante la chiusura del folder INBOX: {}", e.getMessage());
            }
        }
        if (store != null && store.isConnected()) {
            try {
                store.close();
            } catch (MessagingException e) {
                log.error("[PecPeoProcessorService] - Errore durante la chiusura dello store: {}", e.getMessage());
            }
        }
    }

    @Transactional
    public void updateEmailSetDeletedTrue(String messageId){
        em.createNamedQuery("updateEmailSetDeletedTrue")
                .setParameter("messageId", messageId)
                .executeUpdate();
    }

    @Transactional
    public void updateEmailSetDeletedFalse(String messageId){
        em.createNamedQuery("updateEmailSetDeletedFalse")
                .setParameter("messageId", messageId)
                .executeUpdate();
    }

}
