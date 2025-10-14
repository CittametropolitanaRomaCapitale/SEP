package it.parsec326.pi.intranet.client;

import it.parsec326.pi.intranet.dto.client.raccomandata.DatiRaccomandataDTO;
import it.parsec326.pi.intranet.dto.client.raccomandata.DettaglioRaccomandataDTO;
import it.parsec326.pi.intranet.dto.client.raccomandata.StatoRaccomandataInputDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

@Slf4j
@ApplicationScoped
public class RaccomandataWebClient {

    @ConfigProperty(name = "raccomandata-client.url")
    String clientUrl;

    Client client;

    @PostConstruct
    public void init(){
        client = ClientBuilder.newClient();
    }

    public DettaglioRaccomandataDTO invioRaccomandata(DatiRaccomandataDTO dati){
        try {
           return client.target(clientUrl)
                    .path("/raccomandata/invia")
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(dati, MediaType.APPLICATION_JSON))
                    .readEntity(DettaglioRaccomandataDTO.class);
        }catch (Exception e){
            log.error(e.getMessage());
            return null;
        }
    }

    public List<DettaglioRaccomandataDTO> ricercaStatoRaccomandataList(StatoRaccomandataInputDTO statoRaccomandata){
        try {
            return client.target(clientUrl)
                    .path("/raccomandata/ricercaStatoRaccomandataList")
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(statoRaccomandata, MediaType.APPLICATION_JSON))
                    .readEntity(new GenericType<>() {});
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }
}