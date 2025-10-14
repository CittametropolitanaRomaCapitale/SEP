package it.parsec326.pi.intranet.dto.output;

import it.parsec326.pi.intranet.utils.common.StatoProtocollo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReferentiProtocolloDTO {
    private Long id;
    private Long idProtocollo;
    private String idMittente;
    private String nomeMittente;
    private String idDestinatario;
    private String nomeDestinatario;
    private String attribuzione;
    private boolean isAssegnato;
    private String tipoDestinatario;
    private Date tsCreation;
    private Date tsStartVali;
    private StatoProtocollo statoProtocollo;
    private Date tsStatoProtocollo;
    private boolean creationOption;
    private boolean revocabile;
    private String noteAssegnazione;
}