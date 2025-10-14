package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

@Data
public class MittenteProtocolloInput {
    public String idMittente;
    public String descMittente;
    public String tipoMittente;
    public String tipologiaIpa;
    public String codAmm;
    public String codAoo;
    public String codUniOu;
    public Boolean isIpa;
}

