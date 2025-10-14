package it.parsec326.pi.intranet.client;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

@Slf4j
@ApplicationScoped
public class SendEmailClient {

    @ConfigProperty(name = "email-engine-client.url")
    String clientUrl;

    Client client;

    @PostConstruct
    public void init() {
        client = ClientBuilder.newClient();
    }

    public void sendEmail(Long id) {
        try {
            client.target(clientUrl)
                    .path("/pecpeo/send")
                    .request(MediaType.APPLICATION_JSON)
//                    .async()
                    .post(Entity.entity(id, MediaType.APPLICATION_JSON));
            log.info("Richiesta async invio email ID {} inviata.", id);
        } catch (Exception e) {
            log.error("Errore durante la preparazione invio email: {}", e.getMessage(), e);
        }
    }

    public void sendEmails(List<Long> ids) {
        try {
            client.target(clientUrl)
                    .path("/pecpeo/send/list")
                    .request(MediaType.APPLICATION_JSON)
//                    .async()
                    .post(Entity.entity(ids, MediaType.APPLICATION_JSON));
            log.info("Richiesta async invio email lista inviata.");
        } catch (Exception e) {
            log.error("Errore durante la preparazione invio email lista: {}", e.getMessage(), e);
        }
    }
}
