package it.parsec326.pi.email.pec_queue;

import io.quarkus.scheduler.Scheduled;
import it.parsec326.pi.email.service.NotificaProcessorService;
import it.parsec326.pi.intranet.model.Email;
import it.parsec326.pi.intranet.service.EmailService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ApplicationScoped
public class EmailQueueProcessor {

    @Inject
    EmailService emailService;

    @Inject
    NotificaProcessorService notificaProcessorService;

    @Inject
    EntityManager em;

    @Scheduled(every = "5s", concurrentExecution = Scheduled.ConcurrentExecution.SKIP)
    void processQueue() {
        Long id = EmailQueue.poll();
        if (id == null) return;

        try {
            if (!exists(id)) {
                if (EmailQueue.shouldRetry(id)) {
                    EmailQueue.incrementRetry(id);
                    EmailQueue.enqueue(id);
                    log.debug("Email ID {} non trovata, riprovo più tardi", id);
                } else {
                    log.warn("Email ID {} non trovata dopo tentativi multipli. Rimozione.", id);
                    EmailQueue.remove(id);
                }
                return;
            }

            String msgErrore = emailService.sendEmail(id);
            if (msgErrore != null) {
                if (EmailQueue.shouldRetryEsito(id)) {
                    EmailQueue.incrementEsitoRetry(id);
                    EmailQueue.enqueue(id);
                    log.warn("Esito falso per Email ID {}. Riprovo più tardi.", id);
                } else {
                    log.error("Email ID {} fallita dopo troppi tentativi di esito=false. Rimozione e invio notifica di errore.", id);
                    EmailQueue.remove(id);
                    notificaProcessorService.sendNotificaForInvioMailErrore(id, msgErrore);
                }
                return;
            }

            log.info("PEC/PEO inviata con successo per ID: {}", id);
            EmailQueue.remove(id);

        } catch (Exception e) {
            log.error("Errore durante l'elaborazione della coda per Email ID {}: {}", id, e.getMessage());
            if (EmailQueue.shouldRetryEsito(id)) {
                EmailQueue.incrementEsitoRetry(id);
                EmailQueue.enqueue(id);
            } else {
                log.error("Email ID {} rimossa dopo troppi errori in catch. Invio notifica di errore.", id);
                EmailQueue.remove(id);
                notificaProcessorService.sendNotificaForInvioMailErrore(id, e.getMessage());
            }
        }
    }

    @Transactional
    public boolean exists(Long id) {
        return em.find(Email.class, id) != null;
    }
}
