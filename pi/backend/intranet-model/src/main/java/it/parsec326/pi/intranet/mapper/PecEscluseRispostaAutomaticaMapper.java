package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.PecEscluseRispostaAutomaticaInput;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import it.parsec326.pi.intranet.model.PecEscluseRispostaAutomatica;

@Mapper(componentModel = "jakarta")
public interface PecEscluseRispostaAutomaticaMapper {
    @Mapping(target = "indirizzo")
    PecEscluseRispostaAutomatica toEntity(PecEscluseRispostaAutomaticaInput input);
}
