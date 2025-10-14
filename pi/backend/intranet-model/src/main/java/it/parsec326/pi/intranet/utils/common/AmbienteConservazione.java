package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public enum AmbienteConservazione {

    PARER("PARER"),
    PARER_TEST("PARER_TEST");

    final String ambiente;

    AmbienteConservazione(String ambiente) {
        this.ambiente = ambiente;
    }

    public static List<String> getAll() {
        return Arrays.stream(AmbienteConservazione.values())
                .map(AmbienteConservazione::getAmbiente)
                .collect(Collectors.toList());
    }

}
