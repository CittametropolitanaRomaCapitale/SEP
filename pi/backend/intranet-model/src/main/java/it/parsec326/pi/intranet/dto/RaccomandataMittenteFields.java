package it.parsec326.pi.intranet.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RaccomandataMittenteFields {
    private String mittente;
    private String dipartimentoServizio;
    private String indirizzo;
    private String civico;
    private String presso;
    private String citta;
    private String cap;
    private String provincia;
}
