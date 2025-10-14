package it.parsec326.pi.intranet.dto.input;

import lombok.Data;
import java.util.List;

@Data
public class PecEscluseRispostaAutomaticaInput {
    public List<Long> id;
    public String indirizzo;
}
