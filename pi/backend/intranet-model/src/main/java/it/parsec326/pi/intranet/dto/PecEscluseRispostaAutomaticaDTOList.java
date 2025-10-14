package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.output.PecEscluseRispostaAutomaticaDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PecEscluseRispostaAutomaticaDTOList {
    public List<PecEscluseRispostaAutomaticaDTO> pecEscluseRispostaAutomaticaList;
    public long pageCount;
    private long totalResults;
}
