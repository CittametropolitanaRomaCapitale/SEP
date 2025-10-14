package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.utils.common.AmbienteConservazione;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginConservazioneDTO {
    public String versione;
    public String username;
    public String password;
    public String xmlSip;
    public String ente;
    public String struttura;
    public AmbienteConservazione ambiente;
    public String url;
}
