package it.parsec326.pi.intranet.utils.common;

public enum ErrorContext {
    PEC_ENTRATA("PEC ENTRATA"),
    RICEVUTE_PEC_USCITA("PEC_USCITA"),
    ALLEGATO("ALLEGATO"),
    ALLEGATO_RICEVUTA_PEC("ALLEGATO_RICEVUTA_PEC"),
    TIMBRATURA("TIMBRATURA"),
    PROTOCOLLO("PROTOCOLLO"),
    ASSEGNAZIONE("ASSEGNAZIONE"),
    EMAIL_USCITA("EMAIL USCITA"),
    TITOLARIO("TITOLARIO"),
    LETTURA_EML("LETTURA EML"),
    DOCUMENT("DOCUMENT"),
    NOTIFICHE("NOTIFICHE");

    final String error;

    ErrorContext(String error) {
        this.error = error;
    }
}
