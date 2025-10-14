package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Operazione {

    assegnazione,
    richiestaAssegnazione,
    classificazione,
    assegnazioneAutomatica,
    presaInCarico,
    rifiuto,
    richiestaAnnullamento,
    rifiutoAnnullamento,
    annullamento,
    erroreGenerazioneRegistroGiornaliero,
    erroreInvioPecPeo,
    revoca,
    protocollazioneAutomatica,
    regolaPecNonValida;

    public static Operazione getOperazione(String operazione) {
        return Arrays.stream(Operazione.values())
                .filter(e -> e.name().equalsIgnoreCase(operazione))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Operazione non supportata: " + operazione));
    }
}