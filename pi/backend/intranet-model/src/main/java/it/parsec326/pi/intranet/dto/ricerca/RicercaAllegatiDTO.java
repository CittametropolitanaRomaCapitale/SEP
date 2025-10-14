package it.parsec326.pi.intranet.dto.ricerca;

import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class RicercaAllegatiDTO extends BaseSearchDTO {
    private Long idTitolario;
    private Long idProtocollo;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "nome";
        sortInput.desc = true;
        return sortInput;
    }
}
