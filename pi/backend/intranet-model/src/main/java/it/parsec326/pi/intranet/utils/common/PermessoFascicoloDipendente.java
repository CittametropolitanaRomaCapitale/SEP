package it.parsec326.pi.intranet.utils.common;

import java.util.Arrays;

public enum PermessoFascicoloDipendente {
    protocollazione,
    visualizzazione,
    no;

    public static short getOrder(PermessoFascicoloDipendente permesso) {
        if (permesso == PermessoFascicoloDipendente.no) return 0;
        if (permesso == PermessoFascicoloDipendente.visualizzazione) return 1;
        if (permesso == PermessoFascicoloDipendente.protocollazione) return 2;
        return 0;
    }

    public static PermessoFascicoloDipendente getPermesso(String permesso) {
        return Arrays.stream(PermessoFascicoloDipendente.values())
                .filter(e -> e.name().equalsIgnoreCase(permesso))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("permesso non supportato: " + permesso));
    }
}
