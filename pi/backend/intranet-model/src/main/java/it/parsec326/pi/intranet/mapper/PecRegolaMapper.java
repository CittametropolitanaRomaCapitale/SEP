package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.PecRegolaInputDTO;
import it.parsec326.pi.intranet.model.PecRegola;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta", uses = { PecRegolaFinestraMapper.class })
public interface PecRegolaMapper {
    @Mapping(target = "tsCreation", expression = "java(new java.util.Date())")
    @Mapping(target = "finestre", ignore = true)
    PecRegola toEntity(PecRegolaInputDTO dto);

    @Mapping(target = "finestre", source = "finestre") // Usa il resolver
    PecRegolaInputDTO toDto(PecRegola entity);
}
