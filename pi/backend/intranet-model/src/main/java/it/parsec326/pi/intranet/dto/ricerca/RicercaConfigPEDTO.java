package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class RicercaConfigPEDTO extends BaseSearchDTO {
    private String search;
    private String ufficio;
    private String utente;
    private String indirizzo;
    private List<String> tipologiaPosta;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "indirizzoEmail";
        sortInput.desc = true;
        return sortInput;
    }

    @Override
    public boolean hasSearch() {
        return search != null && !search.isEmpty();
    }

    public boolean hasUfficio() {
        return ufficio != null && !ufficio.isBlank();
    }
    public boolean hasUtente() {
        return utente != null && !utente.isBlank();
    }
    public boolean hasIndirizzo() {
        return indirizzo != null && !indirizzo.isBlank();
    }
    public boolean hasTipologiaPosta() {
        return tipologiaPosta != null && !tipologiaPosta.isEmpty();
    }

    public boolean isEmpty() {
        return ((!hasUfficio()) && (!hasCdr()) && (!hasUtente()) && (!hasIndirizzo()) && (!hasSearch()) && (!hasTipologiaPosta()));
    }
}
