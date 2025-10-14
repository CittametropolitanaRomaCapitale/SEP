package it.parsec326.pi.intranet.dto.client.raccomandata;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DettaglioRaccomandataDTO {
    public String idPro;
    public String idAccettazione;
    public String stato;
    public String costo;
    public Date dataInserimento;
    public Date dataInoltro;
    public Date dataConsegna;
    public String statoConsegna;

    public boolean hasIdPro(){
        return idPro != null && !idPro.trim().isEmpty();
    }
    public boolean isEmpty() {
        return (idPro == null || idPro.trim().isEmpty()) &&
                (idAccettazione == null || idAccettazione.trim().isEmpty()) &&
                (stato == null || stato.trim().isEmpty()) &&
                (statoConsegna == null || statoConsegna.trim().isEmpty()) &&
                (costo == null || costo.trim().isEmpty()) &&
                dataConsegna == null &&
                dataInserimento == null;

    }
}

