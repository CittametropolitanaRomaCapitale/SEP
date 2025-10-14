package it.parsec326.pi.intranet.client;

import it.parsec326.pi.intranet.dto.client.conservazione.DettaglioParErDTO;
import it.parsec326.pi.intranet.dto.client.conservazione.RegistroGiornalieroDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Slf4j
@ApplicationScoped
public class ConservazioneClient {

    @ConfigProperty(name = "conservazione-client.url")
    String clientUrl;

    private Client client;

    @PostConstruct
    public void init() {
        client = ClientBuilder.newClient();
    }

    public DettaglioParErDTO invioConservazione(RegistroGiornalieroDTO dto) {
        try {
            return client.target(clientUrl)
                    .path("/conservazione/sacer")
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(dto, MediaType.APPLICATION_JSON))
                    .readEntity(DettaglioParErDTO.class);

        } catch (Exception e) {
            log.error("Errore durante la chiamata a invioConservazione", e);
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }
}
