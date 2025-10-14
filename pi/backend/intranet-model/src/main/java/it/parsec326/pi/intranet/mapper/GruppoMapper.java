package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.common.GruppoOutputDTO;
import it.parsec326.pi.intranet.model.Gruppo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta")
public interface GruppoMapper {

    @Mapping(target="nome", source="nome")
    @Mapping(target="note", source="note")
    @Mapping(target="creation", source="tsCreation")
    @Mapping(target="update", source="tsUpdate")
    @Mapping(target="deleted", ignore = true)
    GruppoOutputDTO toDto(Gruppo gruppo);
}
