package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class RicercaStoricoDTO extends BaseSearchDTO {
  private Boolean isFilteredByCdr;
  public String cdrCode;
  private Long idTitolario;
  private Long idRegistroGiornaliero;
  private Long idProtocollo;

  public SortInput getDefaultSort() {
    SortInput sortInput = new SortInput();
    sortInput.by = "tsCreation";
    sortInput.desc = true;
    return sortInput;
  }

  public boolean hasProtocollo() {
    return idProtocollo != null;
  }
  public boolean hasCdrFilter(){ return isFilteredByCdr != null;}
  public boolean hasCdrCode(){ return cdrCode != null && !cdrCode.isBlank();}
  public boolean hasTitolario() { return idTitolario != null; }
  public boolean hasRegistroGiornaliero() { return idRegistroGiornaliero != null; }
}


