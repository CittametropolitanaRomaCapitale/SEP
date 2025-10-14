package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.model.RaccomandataProtocollo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class RaccomandataProtocolloDTO {
    private List<RaccomandataProtocollo> raccomandate;
    private long pageCount;
    private long totalResults;
}
