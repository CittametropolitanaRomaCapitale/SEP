package it.parsec326.pi.intranet.dto.input.segnatura;

public class SegnaturaDestinatarioInput {
    public String tipoDestinatario;
    public String denominazione;
    public String nome;
    public String cognome;
    public boolean isConoscenza;

    public boolean isTipoEnte() { return tipoDestinatario.equals("ipa_ente") || tipoDestinatario.equals("ipa_aoo"); }
    public boolean isTipoUfficio() { return tipoDestinatario.equals("ufficio"); }
    public boolean isTipoUtente() { return tipoDestinatario.equals("utente"); }
}
