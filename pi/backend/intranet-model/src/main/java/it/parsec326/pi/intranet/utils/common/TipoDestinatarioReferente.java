package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum TipoDestinatarioReferente {

    ANAGRAFICA_INTERNA("anagrafica_interna"),
    UFFICIO("ufficio"),
    UTENTE("utente");

    private final String nome;

    TipoDestinatarioReferente(String assegnazione){
        this.nome = assegnazione;
    }
}
