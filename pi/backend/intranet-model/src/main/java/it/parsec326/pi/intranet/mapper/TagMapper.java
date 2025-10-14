package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.TagInput;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import it.parsec326.pi.intranet.model.Tag;

@Mapper(componentModel = "jakarta")
public interface TagMapper {
    @Mapping(target = "nome")
    Tag toEntity(TagInput input);
}
