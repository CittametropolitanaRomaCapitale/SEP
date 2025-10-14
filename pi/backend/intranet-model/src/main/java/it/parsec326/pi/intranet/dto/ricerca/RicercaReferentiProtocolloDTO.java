package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.StatoProtocollo;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RicercaReferentiProtocolloDTO extends BaseSearchDTO {
    private String numero;
    private String nomeDestinatario;
    private List<String> attribuzioneList;
    private List<StatoProtocollo> statoProtocollo;
    private List<String> tipoUtenteList;
    private boolean excludeStatoRifiutato;

    public boolean hasNumero() {
        return numero != null && !numero.isBlank();
    }
    public boolean hasAttribuzioneList() {
        return attribuzioneList != null && !attribuzioneList.isEmpty();
    }
    public boolean hasNomeDestinatario() {
        return nomeDestinatario != null && !nomeDestinatario.isBlank();
    }
    public boolean hasStatoProtocollo() {
        return statoProtocollo != null && (!statoProtocollo.isEmpty());
    }
    public boolean hasTipoUtenteList() {
        return tipoUtenteList != null && (!tipoUtenteList.isEmpty());
    }
    public boolean isEmpty() {
        return ((!hasNomeDestinatario())
                && (!hasStatoProtocollo())
                && (!hasAttribuzioneList())
                && (!hasNumero())
                && (!hasTipoUtenteList()));
    }

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "tsCreation";
        sortInput.desc = true;
        return sortInput;
    }
}
