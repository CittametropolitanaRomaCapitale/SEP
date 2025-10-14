package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum StatoProtocollo {

    // stati che può assumere un protocollo
    Completato("Completato"),
    DaAssegnare("DaAssegnare"),
    InCorso("InCorso"),
    RichiestaDiAnnullamento("RichiestaDiAnnullamento"),
    Annullato("Annullato"),

    // stati che può assumere un'assegnazione
    DaPrendereInCarico("DaPrendereInCarico"),
    Rifiutato("Rifiutato"),
    PresoInCarico("PresoInCarico"),

    //Stato dell'ufficio assegnato per competenza
    Assegnato("Assegnato");

    private final String stato;

    StatoProtocollo(String stato) {
        this.stato = stato;
    }

    public String getOperation(boolean isCircolare) {
        return switch (this) {
            case DaAssegnare -> "Protocollo da assegnare.";
            case InCorso -> "Protocollazione in corso.";
            case RichiestaDiAnnullamento -> "È stato richiesto l'annullamento.";
            case Annullato -> isCircolare ? "La circolare è stata annullata." : "Il protocollo è stato annullato.";
            case DaPrendereInCarico ->
                    isCircolare ? "La circolare è in attesa di essere presa in carico" : "Il protocollo è in attesa di essere preso in carico.";
            case PresoInCarico ->
                    isCircolare ? "ha preso in carico la Circolare" : "ha preso in carico il Protocollo";
            case Rifiutato ->
                    isCircolare ? "ha rifiutato la lavorazione della Circolare" : "ha rifiutato la lavorazione del Protocollo";

            default -> "Stato sconosciuto.";
        };
    }

    @Override
    public String toString() {
        return this.stato; // Restituisce la descrizione associata allo stato
    }
}
