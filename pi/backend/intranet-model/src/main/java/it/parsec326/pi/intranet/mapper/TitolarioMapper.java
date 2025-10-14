package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.model.Titolario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.util.Date;

@Mapper(componentModel = "jakarta")
public interface TitolarioMapper {

    @Mapping(target="label", source="nome")
    @Mapping(target="tipologia", source="tipologiaTitolario")
    @Mapping(target="leaf", source="leaf")
    @Mapping(target="idPadre", source="idPadre")
    @Mapping(target="note", source="note")
    @Mapping(target="tsCreation", source="tsCreation")
    @Mapping(target="tsChiusura", source="tsChiusura")
    @Mapping(target="tsDeleted", source="tsDeleted")
    @Mapping(target="nomeUtenteCreatore", source="nomeUtenteCreatore")
    @Mapping(target="cdr", source="cdr")
    @Mapping(target = "write", ignore = true)
    @Mapping(target = "hierarchy", ignore = true)
    @Mapping(target = "immutable", ignore = true)
    @Mapping(target = "hierarchyString", ignore = true)
    @Mapping(target = "fascicoloDipendente", source = "isFascicoloDipendente")
    @Mapping(target="deleted", source="tsDeleted", qualifiedByName = "mapTsDeletedToDeleted")
    @Mapping(target="closed", source="tsChiusura", qualifiedByName = "mapTsClosedToClosed")
    TitolarioOutputDTO toOutputDTO(Titolario entity);

    @Named("mapTsDeletedToDeleted")
    default boolean mapTsDeletedToDeleted(Date tsDeleted) {
        return tsDeleted != null && tsDeleted.before(Date.from(Instant.now()));
    }
    @Named("mapTsClosedToClosed")
    default boolean mapTsClosedToClosed(Date tsClosed) {
        return tsClosed != null && tsClosed.before(Date.from(Instant.now()));
    }
}
