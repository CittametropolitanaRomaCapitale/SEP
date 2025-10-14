package it.parsec326.pi.intranet.dto.common;

import java.util.*;

public class ListProtocolloDTOForRegistro {
    private Map<Long, ProtocolloForRegistroDTO> protocolli;
    private Map<Long, String> fascicoliHierarchies;

    public ListProtocolloDTOForRegistro() {
        protocolli = new HashMap<>();
        fascicoliHierarchies = new HashMap<>();
    }

    public void addProtocolloFromDbRow(Long id, String nProtocollo, Date data, String oggetto, String mittente, String destinatario, Long idFascicolo, String nomeFascicolo) {
        if (!protocolli.containsKey(id)) {
            ProtocolloForRegistroDTO newProtocollo = new ProtocolloForRegistroDTO();
            newProtocollo.id = id;
            newProtocollo.dataCreazione = data;
            newProtocollo.nProtocollo = nProtocollo;
            newProtocollo.oggetto = oggetto;
            newProtocollo.mittente = mittente;
            newProtocollo.addDestinatario(destinatario);
            newProtocollo.addFascicolo(idFascicolo, nomeFascicolo);
            protocolli.put(id, newProtocollo);
            addToFascicoliHierarchies(idFascicolo, nomeFascicolo);
            return;
        }
        ProtocolloForRegistroDTO protocollo = protocolli.get(id);
        protocollo.addDestinatario(destinatario);
        protocollo.addFascicolo(idFascicolo, nomeFascicolo);
        addToFascicoliHierarchies(idFascicolo, nomeFascicolo);
        protocolli.replace(id, protocollo);
    }

    private void addToFascicoliHierarchies(Long idFascicolo, String nomeFascicolo) {
        if (idFascicolo == null) return;
        if (fascicoliHierarchies.containsKey(idFascicolo)) return;
        fascicoliHierarchies.put(idFascicolo, nomeFascicolo);
    }

    public List<ProtocolloForRegistroDTO> getProtocolli() {
        List<ProtocolloForRegistroDTO> list = new ArrayList<>(protocolli.size());
        list.addAll(protocolli.values());
        Collections.sort(list, Comparator.comparing(a -> a.dataCreazione));
        return list;
    }
    public List<String> getHierarchiesForProtocollo(Long idProtocollo) {
        List<String> hiearchyForProtocollo = new ArrayList<>();
        ProtocolloForRegistroDTO p = protocolli.getOrDefault(idProtocollo, null);
        if (p == null) return hiearchyForProtocollo;
        for(Long idFascicolo : p.idFascicoli.keySet()) {
            String hierarchy = fascicoliHierarchies.getOrDefault(idFascicolo, null);
            if (hierarchy != null)
                hiearchyForProtocollo.add(hierarchy);
        }
        return hiearchyForProtocollo;
    }

    public Set<Long> getFascicoliId() {
        return fascicoliHierarchies.keySet();
    }
    public void setFascicoliHierachies(Map<Long, String> hierachies) {
        fascicoliHierarchies = hierachies;
    }


}
