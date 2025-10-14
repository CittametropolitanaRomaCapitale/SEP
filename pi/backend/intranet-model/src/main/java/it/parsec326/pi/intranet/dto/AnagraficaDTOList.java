package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.output.AnagraficaDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnagraficaDTOList {
  private List<AnagraficaDTO> anagraficaList;
  private long pageCount;
  private long totalResults;
}
