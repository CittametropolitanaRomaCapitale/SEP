package it.parsec326.pi.intranet.dto.client.conservazione;

import it.parsec326.pi.intranet.dto.LoginConservazioneDTO;
import lombok.Data;

@Data
public class RegistroGiornalieroDTO {
    public String idRegistro;
    public Integer anno;
    public String nomeFile;
    public String base64Pdf;
    public String sha256;
    public LoginConservazioneDTO login;
}
