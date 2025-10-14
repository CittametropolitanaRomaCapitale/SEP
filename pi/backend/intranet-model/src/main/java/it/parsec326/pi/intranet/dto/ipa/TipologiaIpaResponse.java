package it.parsec326.pi.intranet.dto.ipa;

import lombok.Getter;

@Getter
public enum TipologiaIpaResponse {

    ENTE("ENTE"),
    AOO("AOO"),
    UO("UO");

    private final String tipologiaIpaResponse;

    TipologiaIpaResponse(String tipologiaIpaResponse){
        this.tipologiaIpaResponse = tipologiaIpaResponse;
    }
}
