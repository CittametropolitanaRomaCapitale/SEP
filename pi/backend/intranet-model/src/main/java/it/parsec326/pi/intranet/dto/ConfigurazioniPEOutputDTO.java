package it.parsec326.pi.intranet.dto;
import it.parsec326.pi.intranet.model.PecPeo;
import lombok.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ConfigurazioniPEOutputDTO{
    private List<PecPeo> configurazioniPostaElettronica;
    private long pageCount;
    private long totalResults;
}
