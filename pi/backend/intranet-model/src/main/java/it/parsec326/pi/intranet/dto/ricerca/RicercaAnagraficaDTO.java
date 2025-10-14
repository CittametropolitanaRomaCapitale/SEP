package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RicercaAnagraficaDTO extends BaseSearchDTO {
  private String ragioneSociale;
  private String nome;
  private String cognome;
  private String cfPiva;
  private String mail;
  private String pec;
  public Long gruppoId;

  public Boolean onlyCertified;

  public SortInput getDefaultSort() {
    SortInput sortInput = new SortInput();
    sortInput.by = "ragioneSociale";
    sortInput.desc = true;
    return sortInput;
  }

  public boolean hasRagioneSociale() {
    return ragioneSociale != null && !ragioneSociale.isBlank();
  }

  public boolean hasNome() {
    return nome != null && !nome.isBlank();
  }

  public boolean hasCognome() {
    return cognome != null && !cognome.isBlank();
  }

  public boolean hasCfPiva() {
    return cfPiva != null && !cfPiva.isBlank();
  }

  public boolean hasMail() {
    return mail != null && !mail.isBlank();
  }

  public boolean hasPec() {
    return pec != null && !pec.isBlank();
  }

  public boolean hasGruppoId() {
    return gruppoId != null && gruppoId > 0;
  }

  public boolean hasOnlyCertified() {
    return onlyCertified != null && onlyCertified != false;
  }
}
