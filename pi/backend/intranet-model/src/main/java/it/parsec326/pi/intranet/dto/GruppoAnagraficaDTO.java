package it.parsec326.pi.intranet.dto;

import lombok.Data;

import java.util.List;

@Data
public class GruppoAnagraficaDTO {
    private String nome;
    private String note;
    private List<Long> anagraficaIds;
}
