package it.parsec326.pi.intranet.dto;

import lombok.Data;

@Data
public class ConfigurazioneDTO {
    private Long id;
    private String nome;
    private String valore;
    private String tipo;
    private String categoria;
}
