package it.parsec326.pi.intranet.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.*;
import it.parsec326.pi.intranet.exception.CustomException;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Slf4j
@ApplicationScoped
public class IpaClient {

    private String baseUrl = "https://www.indicepa.gov.it:443/ws";
    @ConfigProperty(name = "ipa-key.authId")
    private String authId;
    private Client client;

    @PostConstruct
    public void init(){
        client = ClientBuilder.newClient();
    }

    public ApiResponseIpa<DataResponseIpaSearch> ricercaDescEnte(String desc){
        try {
            WebTarget target = client.target(baseUrl).path("/WS16DESAMMServices/api/WS16_DES_AMM");
            String jsonRequest = String.format("{\"descr\": \"%s\"}", desc);

            Response response = target.request(MediaType.APPLICATION_JSON)
                    .header("AUTH_ID", authId)
                    .post(Entity.json(jsonRequest));

            if (response.getStatus() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                String responseBody = response.readEntity(String.class);
                log.info("Response body: {}", responseBody);
                return mapper.readValue(responseBody, new TypeReference<ApiResponseIpa<DataResponseIpaSearch>>() {});
            } else {
                log.error(String.format("Impossibile recuperare i dati: codice di errore HTTP: %d, messaggio di errore: %s", response.getStatus(), response.readEntity(String.class)));
                throw new RuntimeException("Errore durante la ricerca IPA per ENTE");
            }
        } catch (Exception e) {
            log.error("L'eccezione si è verificata durante il recupero della ricerca IPA per ENTE", e);
            throw new CustomException(CustomException.ErrorCode.INTERNAL, e);
        }
    }

    public ApiResponseIpa<DataResponseIpaAOO> ricercaAreaOrganizzativaOmogenea(String codAmm, String codAoo){
        log.info("Richiesta domicili digitali {}", codAmm);
        try {
            WebTarget target = client.target(baseUrl).path("/WS02AOOServices/api/WS02_AOO");
            String jsonRequest = "";
            if(codAoo != null && !codAoo.equals("")){
                jsonRequest = String.format("{\"cod_aoo\": \"%s\", \"cod_amm\": \"%s\"}", codAoo, codAmm);
            }else {
                jsonRequest = String.format("{\"cod_aoo\": null, \"cod_amm\": \"%s\"}", codAmm);
            }

            Response response = target.request(MediaType.APPLICATION_JSON)
                    .header("AUTH_ID", authId)
                    .post(Entity.json(jsonRequest));

            if (response.getStatus() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                String responseBody = response.readEntity(String.class);
                log.info("Response body: {}", responseBody);
                return mapper.readValue(responseBody, new TypeReference<ApiResponseIpa<DataResponseIpaAOO>>() {});
            } else {
                log.error(String.format("Impossibile recuperare i dati: codice di errore HTTP: %d, messaggio di errore: %s", response.getStatus(), response.readEntity(String.class)));
                throw new RuntimeException("Errore durante la ricerca IPA per AOO");
            }
        } catch (Exception e) {
            log.error("L'eccezione si è verificata durante il recupero della ricerca IPA per AOO", e);
            throw new CustomException(CustomException.ErrorCode.INTERNAL, e);
        }
    }

    public ApiResponseIpa<DataResponseIpaUO> ricercaUnitaOrganizzative(String codAmm){
        log.info("Richiesta domicili digitali {}", codAmm);
        try {
            WebTarget target = client.target(baseUrl).path("/WS04SFEServices/api/WS04_SFE");
            String jsonRequest = String.format("{\"cod_amm\": \"%s\"}", codAmm);

            Response response = target.request(MediaType.APPLICATION_JSON)
                    .header("AUTH_ID", authId)
                    .post(Entity.json(jsonRequest));

            if (response.getStatus() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                String responseBody = response.readEntity(String.class);
                log.info("Response body: {}", responseBody);
                return mapper.readValue(responseBody, new TypeReference<ApiResponseIpa<DataResponseIpaUO>>() {});
            } else {
                log.error(String.format("Impossibile recuperare i dati: codice di errore HTTP: %d, messaggio di errore: %s", response.getStatus(), response.readEntity(String.class)));
                throw new RuntimeException("Errore durante la ricerca IPA per UO");
            }
        } catch (Exception e) {
            log.error("L'eccezione si è verificata durante il recupero della ricerca IPA per UO", e);
            throw new CustomException(CustomException.ErrorCode.INTERNAL, e);
        }
    }

    public ApiResponseIpaInfo<DataResponseIpaInfo> infoEnteIpa(String codAmm){
        log.info("Richiesta domicili digitali {}", codAmm);
        try {
            WebTarget target = client.target(baseUrl).path("/WS05AMMServices/api/WS05_AMM");
            String jsonRequest = String.format("{\"cod_amm\": \"%s\"}", codAmm);

           Response response = target.request(MediaType.APPLICATION_JSON)
                    .header("AUTH_ID", authId)
                    .post(Entity.json(jsonRequest));

            if (response.getStatus() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                String responseBody = response.readEntity(String.class);
                log.info("Response body: {}", responseBody);
                return mapper.readValue(responseBody, new TypeReference<ApiResponseIpaInfo<DataResponseIpaInfo>>() {});
            } else {
                log.error(String.format("Impossibile recuperare i dati: codice di errore HTTP: %d, messaggio di errore: %s", response.getStatus(), response.readEntity(String.class)));
                throw new RuntimeException("Errore durante la ricerca IPA per INFO");
            }
        } catch (Exception e) {
            log.error("L'eccezione si è verificata durante il recupero delle Info IPA per ENTE", e);
            throw new CustomException(CustomException.ErrorCode.INTERNAL, e);
        }
    }

    public ApiResponseIpaInfo<DataResponseIpaUOInfo> infoUnitaOrganizzative(String codUniOu){
        try {
            WebTarget target = client.target(baseUrl).path("/WS06OUCODUNIServices/api/WS06_OU_COD_UNI");
            String jsonRequest = String.format("{\"cod_uni_ou\": \"%s\"}", codUniOu);

           Response response = target.request(MediaType.APPLICATION_JSON)
                    .header("AUTH_ID", authId)
                    .post(Entity.json(jsonRequest));

            if (response.getStatus() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                String responseBody = response.readEntity(String.class);
                log.info("Response body: {}", responseBody);
                return mapper.readValue(responseBody, new TypeReference<ApiResponseIpaInfo<DataResponseIpaUOInfo>>() {});
            } else {
                log.error(String.format("Impossibile recuperare i dati: codice di errore HTTP: %d, messaggio di errore: %s", response.getStatus(), response.readEntity(String.class)));
                throw new RuntimeException("Errore durante la ricerca IPA per INFO");
            }
        } catch (Exception e) {
            log.error("L'eccezione si è verificata durante il recupero delle Info IPA per ENTE", e);
            throw new CustomException(CustomException.ErrorCode.INTERNAL, e);
        }
    }
}
