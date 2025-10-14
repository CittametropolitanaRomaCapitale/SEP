package it.parsec326.pi.intranet.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ProtocolloEmergenzaDTO {
    public String nProtocollo;
    public String nAutorizzazione;
    public String nProtocolloEmergenza;
    public Date dataProtocolloEmergenza;
    public String oggetto;
    public String mittente;
    public String destinatari;
    public String tipologia;
    public String metodo;
    public String titolario;
    public String nProtocolloMittente;
    public Date dataProtocolloMittente;

    public boolean isImported;

    public boolean isEmpty() {
        return (
                (nProtocollo == null || nProtocollo.isEmpty())
                && (nAutorizzazione == null || nAutorizzazione.isEmpty())
                //&& (nProtocolloEmergenza == null || nProtocolloEmergenza.isEmpty())
                && dataProtocolloEmergenza == null
                && (oggetto == null || oggetto.isEmpty())
                && (mittente == null || mittente.isEmpty())
                && (destinatari == null || destinatari.isEmpty())
                && (tipologia == null || tipologia.isEmpty())
                && (metodo == null || metodo.isEmpty())
                && (titolario == null || titolario.isEmpty())
                && (nProtocolloMittente == null || nProtocolloMittente.isEmpty())
                && dataProtocolloMittente == null
        );
    }

    public boolean isValid() {
        return (
            nProtocolloEmergenza != null && !nProtocolloEmergenza.isEmpty()
         && nAutorizzazione != null && !nAutorizzazione.isEmpty()
         && dataProtocolloEmergenza != null
         && tipologia != null && !tipologia.isEmpty()
         && metodo != null && !metodo.isEmpty()
         && mittente != null && !mittente.isEmpty()
         && destinatari != null && !destinatari.isEmpty()
         && oggetto != null && !oggetto.isEmpty()
        );
    }

    public String getNumeroProtocolloEmergenza() {
        return "Aut Em " + nAutorizzazione + " / Prot " + nProtocolloEmergenza;
    }
}
