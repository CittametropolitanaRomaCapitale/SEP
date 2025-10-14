package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

@Data
public class ReferenteProtocolloInput {
    public String idAssegnatario;
    public String nomeAssegnatario;
    public String attribuzione;
    public String tipoDestinatario;
    public Boolean isAssegnato;
    public String cdrAssegnatario;

    public String tipologiaIpa;
    public String codAmm;
    public String codAoo;
    public String codUniOu;
    public Boolean isIpa;

    public Boolean usePeoForSendEmail;
}
