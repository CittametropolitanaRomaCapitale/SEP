package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

import java.util.Date;

@Data
public class TitolarioInput {
    public Long id;
    public Long idPadre;
    public String cdr;
    public String cdrCode;
    public String tipologia;
    public String nome;
    public boolean leaf;
    public String note;
    public Date tsChiusura;
    private boolean isFascicoloDipendente;
}
