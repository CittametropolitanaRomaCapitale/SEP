package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class RicercaRaccomandataDTO extends BaseSearchDTO {
    private Long idProtocollo;
    private String stato;
    private Date tsCreationTo;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "tsCreation";
        sortInput.desc = true;
        return sortInput;
    }

    public boolean hasTsCreationTo() { return tsCreationTo != null; }
    public boolean hasIdProtocollo() {
        return idProtocollo != null;
    }
    public boolean hasStato() {
        return stato != null;
    }
}
