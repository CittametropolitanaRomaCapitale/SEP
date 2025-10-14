package it.parsec326.pi.intranet.dto.input;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnagraficaShaBuilder {
    String ragioneSociale;
    String cf_piva;
    String indirizzo;
    String citta;
    String cap;
    String pec;

    public String getImpronta(){
       return DigestUtils.sha256Hex(new StringBuilder()
                        .append(ragioneSociale)
                        .append(cf_piva)
                        .append(indirizzo)
                        .append(citta)
                        .append(cap)
                        .append(pec)
                        .toString());
    }

}
