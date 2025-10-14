package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum TipoAttribuzione {
    COMPETENZA("competenza"),
    CONOSCENZA("conoscenza");

    private final String nome;
    TipoAttribuzione(String nome) { this.nome = nome; }
}
