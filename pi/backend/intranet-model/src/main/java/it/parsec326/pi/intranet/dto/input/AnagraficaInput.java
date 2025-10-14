package it.parsec326.pi.intranet.dto.input;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AnagraficaInput {
  public List<Long> gruppiIds;
  public String ragioneSociale;
  public String nome;
  public String cognome;
  public String cfPiva;
  public String indirizzo;
  public String citta;
  public String cap;
  public String provincia;
  public String email;
  public String pec;
  public String telefono;
  public String fax;
  public String note;
  public Boolean certificato;
}
