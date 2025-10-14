package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.model.RegistroGiornaliero;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Setter
@Getter
@Builder
public class RegistroGiornalieroOutputDTO  {
    private List<RegistroGiornaliero> registri;
    private long pageCount;
    private long totalResults;
}
