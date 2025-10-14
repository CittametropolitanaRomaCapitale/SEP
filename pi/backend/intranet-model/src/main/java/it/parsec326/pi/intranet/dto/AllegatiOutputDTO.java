package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.output.AllegatoDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AllegatiOutputDTO {
    private List<AllegatoDTO> allegati;
    private long pageCount;
    private long totalResults;
}
