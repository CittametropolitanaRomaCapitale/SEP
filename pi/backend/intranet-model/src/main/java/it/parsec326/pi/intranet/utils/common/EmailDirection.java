package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum EmailDirection {

    USCITA("USCITA"),
    ENTRATA("ENTRATA");

    private final String direction;

    EmailDirection(String direction) {
        this.direction = direction;
    }
}
