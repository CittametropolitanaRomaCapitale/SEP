package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import lombok.Data;

import java.util.List;

@Data
public class NotificaProtocolloPecPeoInput {
    public Long idProtocollo;
    public String nProtocollo;
    public String tipologia;
    public String from;
    public String oggetto;
    public String corpo;
    public List<ReferenteOutputDTO> destinatariCompetenza;
    public List<ReferenteOutputDTO> destinatariConoscenza;
    public List<Long> allegati;
    public Boolean multiplo;

    //NOTA: 01/09/2025
    /**
        sono state aggiunte le liste che definiscono quali sono i contatti di cui usare le PEO invece delle PEC
        perché in questo modo si è facilitata l'integrazione con il client, minimizzando le modifiche sia lato client
        sia lato backend
     */
    public List<String> destinatariCompetenzaUsePeoInsteadOfPec;
    public List<String> destinatariConoscenzaUsePeoInsteadOfPec;
}
