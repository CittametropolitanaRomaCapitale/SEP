package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.model.Storico;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StoricoOutputDTO {
  private List<Storico> logStorici;
  private long pageCount;
  private long totalResults;
}
