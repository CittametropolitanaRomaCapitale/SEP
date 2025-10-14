package it.parsec326.pi.intranet.dto.input;

import java.util.List;

public class PecRegolaInputDTO {
    public Long idEmail;
    public Long idCategoriaRegola;
    public Long threshold;
    public Long durationMinutes;
    public Boolean enabled;
    public String description;

    public List<PecRegolaFinestraTemporaleInput> finestre;

}
