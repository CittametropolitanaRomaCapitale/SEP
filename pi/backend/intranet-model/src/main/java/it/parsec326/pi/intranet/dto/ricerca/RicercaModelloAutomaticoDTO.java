package it.parsec326.pi.intranet.dto.ricerca;

import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RicercaModelloAutomaticoDTO extends BaseSearchDTO {
    private String nomeModello;
    private String oggettoProtocollo;
    private String metodoSpedizione;
    private String tipoRegistrazione;
    private String cdrCode;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "nomeModello";
        sortInput.desc = false;
        return sortInput;
    }

}

