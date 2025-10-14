package it.parsec326.pi.intranet.utils.common;

import java.util.Arrays;

public enum StatoRaccomandataProtocollo {
    accettato,
    verificato,
    normalizzazione,
    inviato,
    elaborato,
    attesaStampa,
    confermato,
    consegnato,
    rimandato,
    errore,
    nonConsegnato,
    consegnaParziale,
    eliminato,
    nessuno,
    inCoda;

    public static StatoRaccomandataProtocollo getStato(String tipo) {
        return Arrays.stream(StatoRaccomandataProtocollo.values())
                .filter(e -> e.name().equalsIgnoreCase(tipo))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo non supportato: " + tipo));
    }

    public static boolean isSupported(String tipo) {
        return Arrays.stream(StatoRaccomandataProtocollo.values())
                .anyMatch(e -> e.name().equalsIgnoreCase(tipo));
    }
}
