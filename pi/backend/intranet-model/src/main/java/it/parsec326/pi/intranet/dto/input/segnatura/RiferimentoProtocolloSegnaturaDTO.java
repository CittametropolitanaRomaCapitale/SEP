package it.parsec326.pi.intranet.dto.input.segnatura;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RiferimentoProtocolloSegnaturaDTO {
    private String codiceIpa;
    private String codiceAOO;
    private String codiceRegistro;
    private String dataRegistrazione;
    private String oraRegistrazione;
    private String numero;
    private String oggetto;
    private String classificazione;

    public RiferimentoProtocolloSegnaturaDTO(String codIpa, String codAOO, String codRegistro, String dataRegistrazione, String oraRegistrazione, String numero, String oggetto, String classificazione) {
        this.codiceIpa = codIpa;
        this.codiceAOO = codAOO;
        this.codiceRegistro = codRegistro;
        this.dataRegistrazione = dataRegistrazione;
        this.oraRegistrazione = oraRegistrazione;
        this.numero = numero;
        this.oggetto = oggetto;
        this.classificazione = classificazione;
    }
}