package it.parsec326.pi.intranet.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.parsec326.pi.intranet.dto.client.inad.InadError;
import it.parsec326.pi.intranet.dto.client.inad.InadResponse;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.service.InadService;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@ApplicationScoped
public class InadClient {

    @Inject
    InadService inadService;

    private Client client;
    private String baseUrl = "https://api.inad.gov.it/rest/inad/v1/domiciliodigitale/";

    @PostConstruct
    public void init(){
        client = ClientBuilder.newClient();
    }

    public List<String> getContattiInad(String codiceFiscale, String practicalReference){
        List<String> contattiInad = new ArrayList<>();
        InadResponse response = getDomicilioDigitale(codiceFiscale, practicalReference);
        for(InadResponse.DigitalAddress contatto : response.getDigitalAddress()){
            contattiInad.add(contatto.getDigitalAddress());
        }
        return contattiInad;
    }

    public String getContattoInad(String codiceFiscale, String practicalReference){
        InadResponse response = getDomicilioDigitale(codiceFiscale, practicalReference);
        return response.getDigitalAddress().get(0).getDigitalAddress();
    }

    public InadResponse getDomicilioDigitale(String codiceFiscale, String practicalReference) {
        log.info("Invocazione INAD per CF: {}", codiceFiscale);
        try {
            String bearerToken = inadService.generateInadJwt();

            WebTarget target = client.target(baseUrl)
                    .path("extract/" + codiceFiscale)
                    .queryParam("practicalReference", practicalReference);

            Response response = target
                    .request(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + bearerToken)
                    .header("Content-Type", MediaType.APPLICATION_JSON)
                    .get();

            String responseBody = response.readEntity(String.class);
            ObjectMapper mapper = new ObjectMapper();

            if (response.getStatus() == 200) {
                log.info("INAD response body: {}", responseBody);
                return mapper.readValue(responseBody, InadResponse.class);
            } else {
                log.error("Errore HTTP {} dalla chiamata INAD: {}", response.getStatus(), responseBody);

                InadError error = mapper.readValue(responseBody, InadError.class);
                throw CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                        "Errore INAD: " + error.getDetail());
            }

        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            log.error("Eccezione durante la chiamata INAD", e);
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Eccezione generica INAD", e);
        }
    }


}
