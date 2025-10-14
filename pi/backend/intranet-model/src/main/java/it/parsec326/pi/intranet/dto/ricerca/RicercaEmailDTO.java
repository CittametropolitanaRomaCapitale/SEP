package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.StatoProtocollazioneEmail;
import lombok.*;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper=false)
public class RicercaEmailDTO  extends BaseSearchDTO {
    private Date dataInvioFrom;
    private Date dataInvioTo;
    private List<String> tipoEmail;
    private List<String> statoProtocollazione;
    private List<String> statoInvio;
    private List<String> emailDirection;
    private Boolean isAssegnato;
    private Boolean isClassificato;
    private List<String> indirizziEmail;
    private String selectedCdr;
    private Boolean mostraNonLavorate;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "tsInvio";
        sortInput.desc = true;
        return sortInput;
    }

    public boolean isEmpty() {
        return (
                (!hasStatoProtocollazione())
                && (!hasStatoInvio())
                && (!hasEmailDirection())
                && (!hasTIpoEmail())
                && dataInvioFrom == null
                && dataInvioTo == null
                && indirizziEmail == null
        );
    }

    public boolean hasIndirizzoEmail() {
        return indirizziEmail != null && !indirizziEmail.isEmpty();
    }
    public boolean hasDataInvioIntervallo() {
        return dataInvioFrom != null && dataInvioTo != null;
    }
    public boolean hasStatoProtocollazione(){
        return statoProtocollazione != null && (!statoProtocollazione.isEmpty());
    }

    public boolean hasBothFiltriStatoProtocollazione() {
        return statoProtocollazione.contains(StatoProtocollazioneEmail.PROTOCOLLATO.getStato()) &&
                statoProtocollazione.contains(StatoProtocollazioneEmail.NON_PROTOCOLLATO.getStato());
    }

    public boolean hasStatoInvio(){ return statoInvio != null && (!statoInvio.isEmpty());}
    public boolean hasEmailDirection(){ return emailDirection != null && (!emailDirection.isEmpty());}
    public boolean hasTIpoEmail(){ return tipoEmail != null && (!tipoEmail.isEmpty());}

    public Date getDataInvioTo() {
        if (dataInvioTo == null)
            return null;

        Instant instantTo = dataInvioTo.toInstant();
        int hourTo = instantTo.atZone(ZoneId.systemDefault()).getHour();
        int minuteTo = instantTo.atZone(ZoneId.systemDefault()).getMinute();
        int secondTo = instantTo.atZone(ZoneId.systemDefault()).getSecond();

        //se l'ora non è stata settata, setto l'orario alle 23:59:59 in modo che la data scelta sia inclusiva.
        if (hourTo == 0 && minuteTo == 0 && secondTo == 0) {
            return Date.from(instantTo.plusSeconds((60 * 60 * 24) - 1 ));
        }
        return dataInvioTo;
    }
}
