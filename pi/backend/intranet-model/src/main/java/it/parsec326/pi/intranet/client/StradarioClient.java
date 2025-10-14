package it.parsec326.pi.intranet.client;

import it.parsec326.pi.intranet.dto.client.raccomandata.LoginRaccomandataDTO;
import it.parsec326.pi.intranet.dto.client.stradario.SimpleResponse;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Collections;
import java.util.List;

@Slf4j
@ApplicationScoped
public class StradarioClient {

    @ConfigProperty(name = "raccomandata-client.url")
    String clientUrl;

    Client client;

    @PostConstruct
    public void init(){
        client = ClientBuilder.newClient();
    }

    public boolean login(LoginRaccomandataDTO dto) {
        try {
            SimpleResponse response = client.target(clientUrl)
                    .path("/stradario/login")
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(dto, MediaType.APPLICATION_JSON), SimpleResponse.class);

            return response != null && response.success;
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return false;
        }
    }

    public boolean sessionCheck() {
        try {
            SimpleResponse response = client.target(clientUrl)
                    .path("/stradario/session-check")
                    .request(MediaType.APPLICATION_JSON)
                    .get(SimpleResponse.class);

            return response != null && response.success;
        } catch (Exception e) {
            log.error("Errore session-check: {}", e.getMessage());
            return false;
        }
    }

    public List<String> listaCAP(String prefix) {
        try {
            return client.target(clientUrl)
                    .path("/stradario/cap")
                    .queryParam("prefix", prefix)
                    .request(MediaType.APPLICATION_JSON)
                    .get(new GenericType<List<String>>() {});
        } catch (Exception e) {
            log.error("Errore listaCAP: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<String> cittaDaCap(String cap, String prefix) {
        try {
            return client.target(clientUrl)
                    .path("/stradario/citta-da-cap")
                    .queryParam("cap", cap)
                    .queryParam("prefix", prefix)
                    .request(MediaType.APPLICATION_JSON)
                    .get(new GenericType<List<String>>() {});
        } catch (Exception e) {
            log.error("Errore cittaDaCap: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<String[]> listaCAPDaCittaEstesa(String prefix, String citta, String tipoRicerca) {
        try {
            return client.target(clientUrl)
                    .path("/stradario/cap-esteso")
                    .queryParam("prefix", prefix)
                    .queryParam("citta", citta)
                    .queryParam("tipoRicerca", tipoRicerca)
                    .request(MediaType.APPLICATION_JSON)
                    .get(new GenericType<List<String[]>>() {});
        } catch (Exception e) {
            log.error("Errore listaCAPDaCittaEstesa: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<String> listaVieDaCAP(String cap) {
        try {
            return client.target(clientUrl)
                    .path("/stradario/vie-da-cap")
                    .queryParam("cap", cap)
                    .request(MediaType.APPLICATION_JSON)
                    .get(new GenericType<List<String>>() {});
        } catch (Exception e) {
            log.error("Errore listaVieDaCAP: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<String> listaVieDaCitta(String citta) {
        try {
            return client.target(clientUrl)
                    .path("/stradario/vie-da-citta")
                    .queryParam("citta", citta)
                    .request(MediaType.APPLICATION_JSON)
                    .get(new GenericType<List<String>>() {});
        } catch (Exception e) {
            log.error("Errore listaVieDaCitta: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

}