package it.parsec326.pi.intranet.dto;

import lombok.Data;

@Data
public class ModelloAutomaticoInputDTO {
    private String nomeModello;
    private String oggettoProtocollo;
    private String metodoSpedizione;
    private String tipoRegistrazione;
    private String cdrCode;
    private Long idTitolario;
}
