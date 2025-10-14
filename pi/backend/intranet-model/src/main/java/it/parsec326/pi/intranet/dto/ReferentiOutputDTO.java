package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReferentiOutputDTO {
    private List<ReferenteOutputDTO> referenti;
    private long pageCount;
    private long totalResults;
}
