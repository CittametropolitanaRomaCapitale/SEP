package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum StatoInvio {
    INVIATO("INVIATO"),
    INVIO_FALLITO("INVIO_FALLITO"),
    DA_INVIARE("DA_INVIARE"),
    SALVARE_IN_INBOX("SALVARE_IN_INBOX"),
    SALVARE_COME_ALLEGATO("SALVARE_COME_ALLEGATO");

    private final String stato;

    StatoInvio(String stato) {
        this.stato = stato;
    }
}
