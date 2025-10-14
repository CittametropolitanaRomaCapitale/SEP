package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

import java.util.List;

@Data
public class VisibilitaTitolarioInput {
    public Long idTitolario;
    public List <UtenteVisibilitaInput> utenti;
    public List <String> utenteAuthIdList;
    public String cdr;
    public String cdrCode;
    public String permesso;
    public String note;
}
