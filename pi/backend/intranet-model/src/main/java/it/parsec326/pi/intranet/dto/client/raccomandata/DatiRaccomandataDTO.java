package it.parsec326.pi.intranet.dto.client.raccomandata;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DatiRaccomandataDTO{
    public String servizio;
    public LoginRaccomandataDTO login;
    public AllegatoDTO allegato;
    public CorrispondentiDTO mittente;
    public CorrispondentiDTO destinatario;
    public String nProtocollo;
}
