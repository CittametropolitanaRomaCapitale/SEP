package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.ConfigurazioneDTO;
import it.parsec326.pi.intranet.model.Configurazione;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta")
public interface ConfigurazioneMapper {
    ConfigurazioneDTO toDto(Configurazione configurazione);

    @Mapping(target = "tsUpdate", ignore = true)
    @Mapping(target = "tsCreation", ignore = true)
    Configurazione toEntity(ConfigurazioneDTO dto);
}
