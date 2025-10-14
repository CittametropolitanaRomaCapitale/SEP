package it.parsec326.pi.intranet.dto.input;

import it.parsec326.pi.intranet.model.Tag;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ProtocolloInput {

    public String nProtocollo;
    public String old_idMittente;
    public String old_mittente;
    public String idUtente;
    public String utente;
    public String tipoRegistrazione;
    public String oggetto;
    public String idUtenteLastOperation;
    public Date tsCreation;
    public Date tsStartVali;
    public String metodoSpedizione;
    public String protocolloMittente;
    public Date dataProtocolloMittente;
    public String note;
    public String stato;
    public List<AllegatoInput> allegati;
    public String nProtocolloCircolare;
    public String indirizzoPecPeo;
    public String corpoPecPeo;
    public Integer invioEmailMultiplo;
    public String cdr;
    public String cdrCode;
    public List<Tag> tagList;
    public MittenteProtocolloInput mittente;
    public List<ReferenteProtocolloInput> referenti;
    public List<Long> idTitolario;
}
