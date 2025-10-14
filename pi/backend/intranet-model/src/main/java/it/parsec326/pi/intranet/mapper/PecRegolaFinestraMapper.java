package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.PecRegolaFinestraTemporaleInput;
import it.parsec326.pi.intranet.model.PecRegolaFinestraTemporale;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class PecRegolaFinestraMapper {

    public PecRegolaFinestraTemporaleInput toDto(PecRegolaFinestraTemporale entity) {
        PecRegolaFinestraTemporaleInput dto = new PecRegolaFinestraTemporaleInput();
        dto.start = entity.startTime.toString();
        dto.end = entity.endTime.toString();
        dto.dayOfWeek = (long) entity.dayOfWeek;
        return dto;
    }
}
