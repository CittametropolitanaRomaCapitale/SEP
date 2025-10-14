package it.parsec326.pi.intranet.dto.client.inad;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InadError {
    private String status;
    private String type;
    private String detail;
}

