package it.parsec326.pi.intranet.dto.ricerca;

import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode(callSuper=false)
public class RicercaRegistiGiornalieriDTO  extends BaseSearchDTO {
//    private Date dataRegistro;
    private String note;
    private Date dataRegistroFrom;
    private Date dataRegistroTo;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "dataRegistro";
        sortInput.desc = true;
        return sortInput;
    }

//    public boolean hasData() {
//        return dataRegistro != null;
//    }

    public boolean hasNote() {
        return note != null && (!note.isBlank());
    }

    public boolean hasDataRegistroIntervallo() {
        return dataRegistroFrom != null && dataRegistroTo != null;
    }
    public Date getDataRegistroTo() {
        if (dataRegistroTo == null)
            return null;

        Instant instantTo = dataRegistroTo.toInstant();
        int hourTo = instantTo.atZone(ZoneId.systemDefault()).getHour();
        int minuteTo = instantTo.atZone(ZoneId.systemDefault()).getMinute();
        int secondTo = instantTo.atZone(ZoneId.systemDefault()).getSecond();

        //se
        if (hourTo == 0 && minuteTo == 0 && secondTo == 0) {
            return Date.from(instantTo.plusSeconds((60 * 60 * 24) - 1 ));
        }
        return dataRegistroTo;
    }
}
