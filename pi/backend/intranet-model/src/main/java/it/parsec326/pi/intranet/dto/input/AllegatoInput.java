package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

@Data
public class AllegatoInput {
    public Long idAllegato;
    public String collocazioneTelematica;
    public String oggetto;
    public boolean main;
    public String position;
    public String nome;
    public Long dimensione;
    public String estensione;
    public boolean inoltro;
}
