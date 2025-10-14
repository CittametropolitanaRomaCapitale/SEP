package it.parsec326.pi.intranet.client;

import it.parsec326.pi.intranet.service.NotificaService;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@ApplicationScoped
public class SendNotificaClient {

    @ConfigProperty(name = "email-engine-client.url")
    String clientUrl;

    Client client;

    @PostConstruct
    public void init() {
        client = ClientBuilder.newClient();
    }

    public void sendNotifica(Long id) {
        try {
            client.target(clientUrl)
                    .path("/notifica/send")
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(id, MediaType.APPLICATION_JSON));
            log.info("Richiesta async invio notifica ID {} inviata.", id);
        } catch (Exception e) {
            log.error("Errore durante la preparazione invio notifica: {}", e.getMessage(), e);
        }
    }

    public void sendNotifiche(List<Long> ids) {
        try {
            client.target(clientUrl)
                    .path("/notifica/send/list")
                    .request(MediaType.APPLICATION_JSON)
//                    .async()
                    .post(Entity.entity(ids, MediaType.APPLICATION_JSON));
            log.info("Richiesta async invio notifiche lista inviata.");
        } catch (Exception e) {
            log.error("Errore durante la preparazione invio notifiche lista: {}", e.getMessage(), e);
        }
    }

    private boolean attemptSendWithRetry(NotificaService notificaService, Long id, int maxAttempts) {
        int attempt = 1;
        while (attempt <= maxAttempts) {
            try {
                boolean esito = notificaService.sendNotifica(id);
                if (esito) {
                    if (attempt > 1) {
                        log.info("Notifica ID {} inviata con successo al tentativo {}", id, attempt);
                    }
                    return true;
                } else {
                    log.warn("Tentativo {} fallito per notifica ID {}", attempt, id);
                }
            } catch (Exception e) {
                log.error("Tentativo {} con errore per notifica ID {}: {}", attempt, id, e.getMessage());
            }

            attempt++;
            try {
                TimeUnit.MILLISECONDS.sleep(500); // breve pausa tra i tentativi
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                return false;
            }
        }
        log.error("Tutti i tentativi falliti per notifica ID {}", id);
        return false;
    }
}
