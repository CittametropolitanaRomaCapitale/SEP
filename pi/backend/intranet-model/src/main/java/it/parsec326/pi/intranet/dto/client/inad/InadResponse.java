package it.parsec326.pi.intranet.dto.client.inad;

import lombok.Data;

import java.util.List;

@Data
public class InadResponse {
    private String codiceFiscale;
    private String since;
    private List<DigitalAddress> digitalAddress;

    @Data
    public static class DigitalAddress {
        private String digitalAddress;
    }
}
