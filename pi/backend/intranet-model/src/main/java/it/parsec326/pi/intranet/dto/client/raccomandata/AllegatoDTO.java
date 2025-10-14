package it.parsec326.pi.intranet.dto.client.raccomandata;


import lombok.Data;

@Data
public class AllegatoDTO {
    private byte[] file;
    private String nomeFile;
    private String estensione;
    private boolean isFileFirmato;
    private boolean isRicevutaDiRitorno;
}