package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.model.Gruppo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GruppiOutputDTO {
  private List<Gruppo> gruppiList;
  private long pageCount;
  private long totalResults;
}
