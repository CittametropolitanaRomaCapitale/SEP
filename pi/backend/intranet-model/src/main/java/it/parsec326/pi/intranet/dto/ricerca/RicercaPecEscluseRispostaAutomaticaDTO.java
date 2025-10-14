package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RicercaPecEscluseRispostaAutomaticaDTO extends BaseSearchDTO{
    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "indirizzo";
        sortInput.desc = false;
        return sortInput;
    }
}
