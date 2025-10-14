package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.model.Anagrafica;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnagraficaOutputDTO {
  private List<Anagrafica> anagraficaList;
  private long pageCount;
  private long totalResults;
}
