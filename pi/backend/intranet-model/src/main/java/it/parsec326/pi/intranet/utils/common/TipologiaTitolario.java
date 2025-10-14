package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum TipologiaTitolario {

    Titolo("Titolo"),
    Sezione("Sezione"),
    SottoSezione("SottoSezione"),
    FascicoloLv1("FascicoloLv1"),
    //FascicoloLv2("FascicoloLv2"),
    //FascicoloLv3("FascicoloLv3"),
    FascicoloLvN("FascicoloLvN");

    final String tipologiaTitolario;

    TipologiaTitolario(String tipologiaTitolario) {
        this.tipologiaTitolario = tipologiaTitolario;
    }

    public static TipologiaTitolario getTipologiaCorrente(TipologiaTitolario titolario){
        switch (titolario){
            case Titolo:
                return Sezione;
            case Sezione:
                return SottoSezione;
            case SottoSezione:
                return FascicoloLv1;
            case FascicoloLv1:
            case FascicoloLvN:
                //return FascicoloLv2;
            //case FascicoloLv2:
                return FascicoloLvN;
            default:
                throw new IllegalArgumentException("Tipologia Titolario non consentita");
        }
    }

    public static TipologiaTitolario fromString(String tipologia) {
        if (tipologia.equalsIgnoreCase(Titolo.name())) return Titolo;
        if (tipologia.equalsIgnoreCase(Sezione.name())) return Sezione;
        if (tipologia.equalsIgnoreCase(SottoSezione.name())) return SottoSezione;
        if (tipologia.equalsIgnoreCase(FascicoloLv1.name())) return FascicoloLv1;
        if (tipologia.equalsIgnoreCase(FascicoloLvN.name())) return FascicoloLvN;
        //if (tipologia.equalsIgnoreCase(FascicoloLv2.name())) return FascicoloLv2;
        //if (tipologia.equalsIgnoreCase(FascicoloLv3.name())) return FascicoloLv3;
        return Titolo;
    }

    public static String getNomeFascicoloFromLivello(int livelloFascicolo) {
        if(livelloFascicolo == 1) return "FascicoloLv1";
        return "FascicoloLvN";
    }
}
