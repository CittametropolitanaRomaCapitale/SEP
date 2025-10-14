package it.parsec326.pi.intranet.dto.output;

import it.parsec326.pi.intranet.model.VisibilitaTitolario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PermessiVisibilitaOutputDTO {
    List<VisibilitaTitolario> permessi;
    private int pageCount;
    private long totalResults;
}
