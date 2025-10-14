package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum StoricoOperazione {
    SalvataggioRicevuta("Salvataggio ricevuta PEC"),
    GenerazioneBarCode("Generazione Codice a barre"),
    GenerazioneRicevuta("Generazione Ricevuta PDF"),
    InvioMail("Mail inviata con successo"),
    CreazioneProtocollo("Creazione %s"),
    CreazioneAutomaticaProtocollo("Creazione automatica %s"),
    AssegnazioneProtocollo("%s a"),
    RichiestaAssegnazioneProtocollo("%s"),
    Annullamento("Annullamento"),
    RichiestaDiAnnullamento("Richiesta di annullamento"),
    RifiutoRichiestaDiAnnullamento("Rifiuto richiesta di annullamento"),
    RimozioneAssegnatari("Rimossi tutti gli assegnatari"),
    DownloadAllegato("Download allegato"),
    Classificazione("Classificazione"),
    RimozioneClassificazione("Rimozione classificazione"),
    RevocaAssegnazione("Revoca assegnazione");

    private final String stato;

    StoricoOperazione(String stato) {
        this.stato = stato;
    }

    public String getStatoParameter(String parametroDinamico) {
        return String.format(this.stato, parametroDinamico);
    }

    public String getOperation(boolean isCircolare) {
        return switch (this) {
            case AssegnazioneProtocollo -> isCircolare ? "ha assegnato la Circolare a " : "ha assegnato il Protocollo a ";

            case RichiestaAssegnazioneProtocollo -> isCircolare ? "ha richiesto l'assegnazione per la Circolare" : "ha richiesto l'assegnazione per il Protocollo";

            case RichiestaDiAnnullamento -> isCircolare ? "ha richiesto l'annullamento della Circolare." : "ha richiesto l'annullamento del Protocollo." ;

            case RifiutoRichiestaDiAnnullamento -> isCircolare ? "ha rifiutato la richiesto di annullamento della Circolare." : "ha rifiutato la richiesto di annullamento del Protocollo.";

            case Annullamento -> isCircolare ? "ha annullato la Circolare." : "ha annullato il Protocollo.";

            case Classificazione -> isCircolare ? "ha classificato la circolare all'interno del fascicolo: " : "ha classificato il protocollo all'interno del fascicolo: ";

            case RimozioneClassificazione -> isCircolare ? "ha rimosso la circolare dal fascicolo: " : "ha rimosso il protocollo dal fascicolo: ";

            default -> "Stato sconosciuto.";
        };
    }
}
