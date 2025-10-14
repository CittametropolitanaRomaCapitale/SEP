package it.parsec326.pi.intranet.dto.common;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TitolarioOutputDTO {
    private long id;
    private long idPadre;
    private String label;
    private String tipologia;
    private String note;
    private boolean leaf;
    private List<TitolarioOutputDTO> hierarchy;
    private String hierarchyString;
    private Date tsCreation;
    private Date tsChiusura;
    private Date tsDeleted;
    private String nomeUtenteCreatore;
    private String cdr;
    private boolean write;
    private boolean immutable; //variabile che indica se il fascicolo può essere usato per classificare
    private boolean isFascicoloDipendente;
    private int numProtocolli;
    private int numDocumenti;

    private boolean isVisible; //variabile che indica se l'utente ha visibilità sul fascicolo

    // campi che vengono popolati automaticamente tramite il mapper
    private boolean deleted;
    private boolean closed;
}
