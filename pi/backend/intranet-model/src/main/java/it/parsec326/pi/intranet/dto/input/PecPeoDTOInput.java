package it.parsec326.pi.intranet.dto.input;

import it.parsec326.pi.intranet.model.Ufficio;
import lombok.Data;

import java.util.List;

@Data
public class PecPeoDTOInput {
    public String tipologiaPosta;
    public String indirizzoEmail;
    public List<Ufficio> cdrList;
    public String formSwitch;
    public String idUtente;
    public String utente;
    public String username;
    public String password;
    public Boolean attiva;
    public Boolean saveToSent;
    public Boolean readPec;
    public Boolean deleteMessages;
    public Boolean sendRispostaAutomatica;
}
