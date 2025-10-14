package it.parsec326.pi.intranet.dto.common;

import java.util.*;

public class ProtocolloForRegistroDTO {
    public Long id;
    public String nProtocollo;
    public Date dataCreazione;
    public String oggetto;
    public String mittente;
    public List<String> destinatari;
    public Map<Long, String> idFascicoli;

    public ProtocolloForRegistroDTO() {
        id = null;
        nProtocollo = null;
        dataCreazione = null;
        oggetto = null;
        mittente = null;
        destinatari = new ArrayList<>();
        idFascicoli = new HashMap<>();
    }
    public void addDestinatario(String destinatario) {
        if (destinatario == null || destinatario.isEmpty()) return;
        if (destinatari.contains(destinatario))
            return;
        destinatari.add(destinatario);
    }
    public void addFascicolo(Long id, String nome) {
        if (id == null) return;
        if (idFascicoli.containsKey(id))
            return;
        idFascicoli.put(id, nome);
    }

    public String getStringDestinatari() {
        StringBuilder result = new StringBuilder();
        for(String destinatario : destinatari) {
            result.append(destinatario).append(", ");
        }
        return !result.isEmpty() ? result.substring(0, result.length() - 2) : "";
    }

    public String toString() {
        return "<" + id + ", " + nProtocollo + ">";
    }
}
