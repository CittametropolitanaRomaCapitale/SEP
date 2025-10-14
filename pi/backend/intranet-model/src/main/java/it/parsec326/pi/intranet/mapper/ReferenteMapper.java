package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import it.parsec326.pi.intranet.model.Gruppo;
import it.parsec326.pi.intranet.model.ReferentiProtocollo;
import it.parsec326.pi.intranet.utils.common.TipologiaRubrica;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta")
public interface ReferenteMapper {
  @Mapping(target = "idDestinatario", source = "idDestinatario")
  @Mapping(target = "label", source = "nomeDestinatario")
  @Mapping(target = "tipo", source = "tipoDestinatario")
  @Mapping(target = "statoProtocollo")
  @Mapping(target = "ragioneSociale", ignore = true)
  @Mapping(target = "nome", ignore = true)
  @Mapping(target = "cognome", ignore = true)
  @Mapping(target = "cfPiva", ignore = true)
  @Mapping(target = "pec", ignore = true)
  @Mapping(target = "ipaResponseDTO", ignore = true)
  @Mapping(target = "children", ignore = true)
  @Mapping(target = "email", ignore = true)
  @Mapping(target = "descrizione", ignore = true)
  ReferenteOutputDTO toDtoDettaglio(ReferentiProtocollo referentiProtocollo);

  @Mapping(target = "idDestinatario", source = "id")
  @Mapping(target = "label", source = "nome")
  @Mapping(target = "tipo", expression = "java(mapTipo())")
  @Mapping(target = "descrizione", source = "note")
  @Mapping(target = "statoProtocollo", ignore = true)
  @Mapping(target = "ragioneSociale", ignore = true)
  @Mapping(target = "nome", source = "nome")
  @Mapping(target = "cognome", ignore = true)
  @Mapping(target = "cfPiva", ignore = true)
  @Mapping(target = "pec", ignore = true)
  @Mapping(target = "ipaResponseDTO", ignore = true)
  @Mapping(target = "children", ignore = true)
  @Mapping(target = "email", ignore = true)
  ReferenteOutputDTO gruppoToReferentOutputDTO(Gruppo gruppo);

  default String mapTipo() {
    return TipologiaRubrica.GRUPPI.toString();
  }

}
