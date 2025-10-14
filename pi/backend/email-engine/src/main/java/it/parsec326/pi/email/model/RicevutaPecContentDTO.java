package it.parsec326.pi.email.model;

import it.parsec326.pi.intranet.dto.mail.RicevutaPECDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RicevutaPecContentDTO extends RicevutaPECDTO {
    private String idUtenteAssociato;
    private List<String> cdrAssociati;

    public static RicevutaPecContentDTO mapFromRicevutaPECDTO(String idUtenteAssociato, List<String> cdrAssociati, RicevutaPECDTO dto) {
        RicevutaPecContentDTO ricevutaPecContentDTO = new RicevutaPecContentDTO();
        ricevutaPecContentDTO.setFrom(dto.getFrom());
        ricevutaPecContentDTO.setTo(dto.getTo());
        ricevutaPecContentDTO.setSubject(dto.getSubject());
        ricevutaPecContentDTO.setTsInvio(dto.getTsInvio());
        ricevutaPecContentDTO.setMessageId(dto.getMessageId());
        ricevutaPecContentDTO.setRiferimentoMessageId(dto.getRiferimentoMessageId());
        ricevutaPecContentDTO.setTipoRicevuta(dto.getTipoRicevuta());
        ricevutaPecContentDTO.setMessaggioEml(dto.getMessaggioEml());
        ricevutaPecContentDTO.setDisplayName(dto.getDisplayName());
        ricevutaPecContentDTO.setIdUtenteAssociato(idUtenteAssociato);
        ricevutaPecContentDTO.setCdrAssociati(cdrAssociati);
        return ricevutaPecContentDTO;
    }
}
