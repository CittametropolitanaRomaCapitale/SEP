package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.VisibilitaTitolarioInput;
import it.parsec326.pi.intranet.model.Titolario;
import it.parsec326.pi.intranet.model.VisibilitaTitolario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta")
public interface VisibilitaTitolarioMapper {

  @Mapping(target = "titolario", source = "idTitolario")
  @Mapping(target = "cdr", source = "cdr")
  @Mapping(target = "cdrCode", source = "cdrCode")
  @Mapping(target = "note", source = "note")
  @Mapping(target = "write", ignore = true)
  @Mapping(target = "idUtente", ignore = true)
  @Mapping(target = "tsCreation", ignore = true)
  @Mapping(target = "tsUpdate", ignore = true)
  @Mapping(target = "idUtenteLastOperation", ignore = true)
  @Mapping(target = "usernameUtente", ignore = true)
  @Mapping(target = "nomeUtente", ignore = true)
  VisibilitaTitolario toEntityInsert(VisibilitaTitolarioInput input);

  default Titolario map(Long idTitolario) {
    if (idTitolario == null) {
      return null;
    }
    Titolario titolario = new Titolario();
    titolario.setId(idTitolario);
    return titolario;
  }

}
