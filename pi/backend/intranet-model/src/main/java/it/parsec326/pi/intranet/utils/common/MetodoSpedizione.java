package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public enum MetodoSpedizione {

    AMano("A mano"),
    AccreditamentoWeb("Accreditamento web"),
    Corriere("Corriere"),
    Email("Email"),
    Mepa("Mepa"),
    NotificaAtti("Notifica Atti"),
    Pec("PEC"),
    Raccomandata("Raccomandata"),
    RaccomandataSemplice("Raccomandata Semplice"),
    PostaPrioritaria("Posta Prioritaria"),
    Sportello("Sportello"),
    Tracciabilita("Tracciabilità");

    final String metodo;

    MetodoSpedizione(String metodo) {
        this.metodo = metodo;
    }

    public static List<String> getAll() {
        return Arrays.stream(MetodoSpedizione.values())
                .map(MetodoSpedizione::getMetodo)
                .collect(Collectors.toList());
    }

    public static MetodoSpedizione valueOfString(String input) {
        return Arrays.stream(MetodoSpedizione.values())
                .filter(m -> m.getMetodo().equalsIgnoreCase(input.trim()))
                .findFirst()
                .orElse(null);
    }

    public static MetodoSpedizione valueFromStringName(String input) {
        return Arrays.stream(MetodoSpedizione.values())
                .filter(m -> m.toString().equalsIgnoreCase(input.trim()))
                .findFirst()
                .orElse(null);
    }

}
