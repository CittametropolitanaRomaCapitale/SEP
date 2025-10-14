package it.parsec326.pi.intranet.dto.ricerca;

import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class RicercaTitolarioDTO   extends BaseSearchDTO {
    private Long idPadre;
    private boolean showFascicoliChiusi;
    private boolean showFascicoliDeleted;
    private boolean showFascicoliForProtocolli;
    private boolean showFascicoliWithProtocolli;
    private boolean showFascicoliWithDocumenti;
    private boolean hideFascicoliDeleted;
    private String cdrCode;
    private int startIndex;
    private int lastIdTitolario;

    //NOTA: si potrebbe ulteriormente filtrare la ricerca includendo solo le tipologie passate
    //private List<String> tipologie;

    //NOTA: si potrebbe filtrare la ricerca includendo solo i nodi foglia
    //private boolean isLeaf;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "id";
        sortInput.desc = false;
        return sortInput;
    }
}
