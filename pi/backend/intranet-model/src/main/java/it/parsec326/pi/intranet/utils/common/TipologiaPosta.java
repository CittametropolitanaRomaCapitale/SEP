package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum TipologiaPosta {

    PEC("PEC"),
    PEO("PEO"),
    RICEVUTA("RICEVUTA");

    final String tipologiaPosta;

    TipologiaPosta(String tipologiaPosta){
        this.tipologiaPosta = tipologiaPosta;
    }

    public boolean isPec() {
        return tipologiaPosta.equals("PEC");
    }

    public boolean isPeo() {
        return tipologiaPosta.equals("PEO");
    }

    public boolean isRicevuta() {
        return tipologiaPosta.equals("RICEVUTA");
    }

}
