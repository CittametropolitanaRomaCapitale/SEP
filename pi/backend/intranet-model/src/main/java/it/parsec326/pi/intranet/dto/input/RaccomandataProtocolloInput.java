package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

@Data
public class RaccomandataProtocolloInput {

    public Long idProtocollo;
    public Long idAllegato;
    public String tipo;

    public String mittente;
    public String ulterioreDatoMittente;
    public String mittenteIndirizzo;
    public String mittentePresso;
    public String mittenteCivico;
    public String mittenteCap;
    public String mittenteProvincia;
    public String mittenteCitta;

    public String destinatario;
    public String destinatarioIndirizzo;
    public String destinatarioIndirizzo2;
    public String destinatarioCivico;
    public String destinatarioCap;
    public String destinatarioProvincia;
    public String destinatarioCitta;

    public boolean isValid() {
        return idProtocollo != null
                && idAllegato != null
                && tipo != null && !tipo.isEmpty()
                && mittente != null && !mittente.isEmpty()
                && mittenteIndirizzo != null && !mittenteIndirizzo.isEmpty()
                && mittenteCap != null && !mittenteCap.isEmpty()
                && mittenteProvincia != null && !mittenteProvincia.isEmpty()
                && mittenteCitta != null && !mittenteCitta.isEmpty()
                && destinatario != null && !destinatario.isEmpty()
                && destinatarioIndirizzo != null && !destinatarioIndirizzo.isEmpty()
                && destinatarioCap != null && !destinatarioCap.isEmpty()
                && destinatarioProvincia != null && !destinatarioProvincia.isEmpty()
                && destinatarioCitta != null && !destinatarioCitta.isEmpty();
    }
}
