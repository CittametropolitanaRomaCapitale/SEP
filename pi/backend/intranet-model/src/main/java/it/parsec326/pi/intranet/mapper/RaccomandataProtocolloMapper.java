package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.client.raccomandata.DatiRaccomandataDTO;
import it.parsec326.pi.intranet.dto.input.RaccomandataProtocolloInput;
import it.parsec326.pi.intranet.model.Allegato;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.RaccomandataProtocollo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta")
public interface RaccomandataProtocolloMapper {

    @Mapping(target = "protocollo", source = "idProtocollo")
    @Mapping(target = "allegato", source = "idAllegato")
    @Mapping(target = "tipo", source = "tipo")
    @Mapping(target = "mittente", source = "mittente")
    @Mapping(target = "ulterioreDatoMittente", source = "ulterioreDatoMittente")
    @Mapping(target = "mittenteIndirizzo", source = "mittenteIndirizzo")
    @Mapping(target = "mittentePresso", source = "mittentePresso")
    @Mapping(target = "mittenteCivico", source = "mittenteCivico")
    @Mapping(target = "mittenteCap", source = "mittenteCap")
    @Mapping(target = "mittenteProvincia", source = "mittenteProvincia")
    @Mapping(target = "mittenteCitta", source = "mittenteCitta")
    @Mapping(target = "destinatario", source = "destinatario")
    @Mapping(target = "destinatarioIndirizzo", source = "destinatarioIndirizzo")
    @Mapping(target = "destinatarioIndirizzo2", source = "destinatarioIndirizzo2")
    @Mapping(target = "destinatarioCivico", source = "destinatarioCivico")
    @Mapping(target = "destinatarioCap", source = "destinatarioCap")
    @Mapping(target = "destinatarioProvincia", source = "destinatarioProvincia")
    @Mapping(target = "destinatarioCitta", source = "destinatarioCitta")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tsCreation", ignore = true)
    @Mapping(target = "tsUpdate", ignore = true)
    @Mapping(target = "idRaccomandata", ignore = true)
    @Mapping(target = "numero", ignore = true)
    @Mapping(target = "stato", ignore = true)
    @Mapping(target = "costo", ignore = true)
    @Mapping(target = "tsInserimento", ignore = true)
    @Mapping(target = "tsInoltro", ignore = true)
    @Mapping(target = "tsConsegna", ignore = true)
    @Mapping(target = "statoConsegna", ignore = true)
    @Mapping(target = "nomeUtente", ignore = true)
    @Mapping(target = "idUtente", ignore = true)
    RaccomandataProtocollo toEntity(RaccomandataProtocolloInput input);

    @Mapping(source = "mittente", target = "mittente.denominazione1")
    @Mapping(source = "ulterioreDatoMittente", target = "mittente.denominazione2")
    @Mapping(source = "mittenteIndirizzo", target = "mittente.indirizzo1")
    @Mapping(source = "mittenteCivico", target = "mittente.civico")
    @Mapping(source = "mittenteCap", target = "mittente.cap")
    @Mapping(source = "mittenteCitta", target = "mittente.citta")
    @Mapping(source = "mittenteProvincia", target = "mittente.provincia")
    @Mapping(source = "destinatario", target = "destinatario.denominazione1")
    @Mapping(source = "destinatarioIndirizzo", target = "destinatario.indirizzo1")
    @Mapping(source = "destinatarioCivico", target = "destinatario.civico")
    @Mapping(source = "destinatarioCap", target = "destinatario.cap")
    @Mapping(source = "destinatarioCitta", target = "destinatario.citta")
    @Mapping(source = "destinatarioProvincia", target = "destinatario.provincia")
    @Mapping(source = "tipo", target = "servizio")
    @Mapping(target = "allegato", ignore = true)
    @Mapping(target = "allegato.file", ignore = true)
    @Mapping(target = "allegato.nomeFile", ignore = true)
    @Mapping(target = "allegato.fileFirmato", ignore = true)
    @Mapping(target = "allegato.ricevutaDiRitorno", ignore = true)
    @Mapping(target = "login", ignore = true)
    @Mapping(source = "protocollo.NProtocollo", target = "nProtocollo")
    DatiRaccomandataDTO toDatiRaccomandataDTO(RaccomandataProtocollo raccomandata);

    default Protocollo mapProtocollo(Long idProtocollo) {
        if (idProtocollo == null) {
            return null;
        }
        Protocollo protocollo = new Protocollo();
        protocollo.setId(idProtocollo);
        return protocollo;
    }

    default Allegato mapAllegato(Long idAllegato) {
        if (idAllegato == null) {
            return null;
        }
        Allegato allegato = new Allegato();
        allegato.setId(idAllegato);
        return allegato;
    }
}
