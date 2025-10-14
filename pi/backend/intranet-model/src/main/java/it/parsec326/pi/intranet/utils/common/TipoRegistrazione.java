package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
@Getter
public enum TipoRegistrazione {
    Entrata("Entrata"),
    Interno("Interno"),
    Uscita("Uscita"),
    Circolare("Circolare");

    final String tipoRegistrazione;

    TipoRegistrazione(String tipoRegistrazione) {
        this.tipoRegistrazione = tipoRegistrazione;
    }

    public static List<String> getAll() {
        return Arrays.stream(TipoRegistrazione.values())
                .map(TipoRegistrazione::getTipoRegistrazione)
                .collect(Collectors.toList());
    }

    public static TipoRegistrazione valueOfString(String input) {
        return Arrays.stream(TipoRegistrazione.values())
                .filter(t -> t.getTipoRegistrazione().equalsIgnoreCase(input.trim()))
                .findFirst()
                .orElse(null);
    }

}
