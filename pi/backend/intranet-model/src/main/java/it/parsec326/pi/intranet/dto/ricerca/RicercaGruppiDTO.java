package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RicercaGruppiDTO extends BaseSearchDTO {
  private String nome;

  public SortInput getDefaultSort() {
    SortInput sortInput = new SortInput();
    sortInput.by = "nome";
    sortInput.desc = true;
    return sortInput;
  }

  public boolean hasNome() {
    return nome != null && !nome.isBlank();
  }

}
