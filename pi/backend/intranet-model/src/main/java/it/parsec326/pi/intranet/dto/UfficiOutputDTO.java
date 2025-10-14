package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.client.sso.Office;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UfficiOutputDTO {
    private List<Office> uffici;
    private long pageCount;
    private long totalResults;
}
