package it.parsec326.pi.intranet.dto.client.raccomandata;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CorrispondentiDTO {
    public String denominazione1;
    public String denominazione2;
    public String indirizzo1;
    public String indirizzo2;
    public String civico;
    public String cap;
    public String citta;
    public String provincia;
}
