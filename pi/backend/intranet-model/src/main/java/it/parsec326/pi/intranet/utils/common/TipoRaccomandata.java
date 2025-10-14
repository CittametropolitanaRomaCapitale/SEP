package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public enum TipoRaccomandata {
    Raccomandata("Raccomandata"),
    RaccomandataAR("RaccomandataAR"),
    Lettera("Lettera");

    private final String tipoRaccomandata;

    TipoRaccomandata(String tipoRaccomandata) {
        this.tipoRaccomandata = tipoRaccomandata;
    }

    public static boolean isSupported(String tipo) {
        return Arrays.stream(TipoRaccomandata.values()).anyMatch((e) -> {return e.tipoRaccomandata.equals(tipo);});
    }
    public static List<String> getAll() {
        return Arrays.stream(TipoRaccomandata.values())
                .map(TipoRaccomandata::getTipoRaccomandata)
                .collect(Collectors.toList());
    }

}
