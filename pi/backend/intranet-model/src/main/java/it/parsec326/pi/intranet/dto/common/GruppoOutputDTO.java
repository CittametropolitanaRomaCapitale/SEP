package it.parsec326.pi.intranet.dto.common;

import lombok.Data;

import java.util.Date;

@Data
public class GruppoOutputDTO {
    private long id;
    private String nome;
    private String note;
    private Date creation;
    private Date update;
    private Date deleted;
}
