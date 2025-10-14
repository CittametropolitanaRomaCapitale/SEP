package it.parsec326.pi.email.pec_queue;

import io.quarkus.scheduler.Scheduled;
import it.parsec326.pi.intranet.model.Notifica;
import it.parsec326.pi.intranet.service.NotificaService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ApplicationScoped
public class NotificaQueueProcessor {

    @Inject
    NotificaService notificaService;

    @Inject
    EntityManager em;

    @Scheduled(every = "5s", concurrentExecution = Scheduled.ConcurrentExecution.SKIP)
    void processQueue() {
        Long id = NotificaQueue.poll();
        if (id == null) return;

        try {
            if (!exists(id)) {
                if (NotificaQueue.shouldRetry(id)) {
                    NotificaQueue.incrementRetry(id);
                    NotificaQueue.enqueue(id);
                    log.debug("Notifica ID {} non trovata, ritento più tardi", id);
                } else {
                    log.warn("Notifica ID {} non trovata dopo troppi tentativi. Rimozione.", id);
                    NotificaQueue.remove(id);
                }
                return;
            }

            boolean esito = notificaService.sendNotifica(id);
            if (!esito) {
                if (NotificaQueue.shouldRetryEsito(id)) {
                    NotificaQueue.incrementEsitoRetry(id);
                    NotificaQueue.enqueue(id);
                    log.warn("Esito false per ID {}. Riprovo più tardi.", id);
                } else {
                    log.error("Esito false per ID {} dopo troppi tentativi. Rimozione.", id);
                    NotificaQueue.remove(id);
                }
                return;
            }

            log.info("Notifica inviata per ID: {}", id);
            NotificaQueue.remove(id);

        } catch (Exception e) {
            log.error("Errore durante l'elaborazione della coda per ID {}: {}", id, e.getMessage(), e);
            if (NotificaQueue.shouldRetryEsito(id)) {
                NotificaQueue.incrementEsitoRetry(id);
                NotificaQueue.enqueue(id);
            } else {
                log.error("ID {} rimosso dopo troppi errori in catch block.", id);
                NotificaQueue.remove(id);
            }
        }
    }


    @Transactional
    public boolean exists(Long id) {
        return em.find(Notifica.class, id) != null;
    }
}
