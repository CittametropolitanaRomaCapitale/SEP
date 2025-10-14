package it.parsec326.pi.intranet.dto.output;

import lombok.Builder;
import lombok.Data;
import java.util.Date;

@Data
@Builder
public class PecEscluseRispostaAutomaticaDTO {
    public Long id;
    public String indirizzo;
    public Date tsCreation;
}
