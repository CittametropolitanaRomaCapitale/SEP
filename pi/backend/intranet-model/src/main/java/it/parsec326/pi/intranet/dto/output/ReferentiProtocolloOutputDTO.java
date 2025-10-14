package it.parsec326.pi.intranet.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReferentiProtocolloOutputDTO {
    private List<ReferentiProtocolloDTO> referenti;
    private long pageCount;
    private long totalResults;
}
