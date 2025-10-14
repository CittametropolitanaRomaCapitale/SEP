package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UtentiOutputDTO {
    private List<UtenteDTO> utenti;
    private List<DatiUtenteSSO> datiUtenteSSO;
    private long pageCount;
    private long totalResults;
}
