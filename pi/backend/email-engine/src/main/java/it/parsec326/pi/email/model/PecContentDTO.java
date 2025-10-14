package it.parsec326.pi.email.model;

import it.parsec326.pi.intranet.dto.input.segnatura.RiferimentoProtocolloSegnaturaDTO;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PecContentDTO extends EmailContentDTO {
    private String idUtenteAssociato;
    private List<String> cdrAssociati;

    private boolean isRispostaAutomatica;
    private boolean isNProtocolloFromSegnatura;
    private String nProtocolloInternoRiferimento;
    private RiferimentoProtocolloSegnaturaDTO riferimentoProtocolloSegnaturaDTO;

    public static PecContentDTO mapFromEmailContentDTO(String idUtenteAssociato, List<String> cdrAssociati, EmailContentDTO dto, boolean isRispostaAutomatica, boolean isNProtocolloFromSegnatura, String nProtocolloInternoRiferimento, RiferimentoProtocolloSegnaturaDTO rifProtocolloEsterno) {
        PecContentDTO pecContentDTO = new PecContentDTO();
        pecContentDTO.setFrom(dto.getFrom());
        pecContentDTO.setTo(dto.getTo());
        pecContentDTO.setCc(dto.getCc());
        pecContentDTO.setSubject(dto.getSubject());
        pecContentDTO.setBody(dto.getBody());
        pecContentDTO.setTsInvio(dto.getTsInvio());
        pecContentDTO.setAttachments(dto.getAttachments());
        pecContentDTO.setDirection(dto.getDirection());
        pecContentDTO.setMessageId(dto.getMessageId());
        pecContentDTO.setToBeProtocolled(dto.isToBeProtocolled());
        pecContentDTO.setIdUtenteAssociato(idUtenteAssociato);
        pecContentDTO.setCdrAssociati(cdrAssociati);
        pecContentDTO.setRispostaAutomatica(isRispostaAutomatica);
        pecContentDTO.setNProtocolloFromSegnatura(isNProtocolloFromSegnatura);
        pecContentDTO.setNProtocolloInternoRiferimento(nProtocolloInternoRiferimento);
        pecContentDTO.setRiferimentoProtocolloSegnaturaDTO(rifProtocolloEsterno);
        return pecContentDTO;
    }
}
