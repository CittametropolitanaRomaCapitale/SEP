package it.parsec326.pi.intranet.dto.client.conservazione;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DettaglioParErDTO {
    public boolean done;
    public String urn;
    public String message;
}
