package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.AnagraficaInput;
import it.parsec326.pi.intranet.model.Anagrafica;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "jakarta")
public interface AnagraficaMapper {
  @Mapping(target ="ragioneSociale")
  @Mapping(target ="nome")
  @Mapping(target ="cognome")
  @Mapping(target ="cfPiva")
  @Mapping(target ="indirizzo")
  @Mapping(target ="citta")
  @Mapping(target ="cap")
  @Mapping(target ="provincia", qualifiedByName = "toUpperCase")
  @Mapping(target ="email")
  @Mapping(target ="pec")
  @Mapping(target ="telefono")
  @Mapping(target ="fax")
  @Mapping(target ="note")
  @Mapping(target ="tsCreation", ignore = true)
  @Mapping(target ="tsStartVali", ignore = true)
  @Mapping(target ="cancellato", ignore = true)
  @Mapping(target ="certificato")
  @Mapping(target ="impronta" ,ignore = true)
  @Mapping(target ="idIpaInad" ,ignore = true)
  @Mapping(target ="dirty", ignore = true)
  Anagrafica toEntity(AnagraficaInput anagraficaInput);

  @Named("toUpperCase")
  default String toUpperCase(String value) {
    return value != null ? value.toUpperCase() : null;
  }
}
