package it.parsec326.pi.intranet.dto.output;

import it.parsec326.pi.intranet.model.Allegato;
import it.parsec326.pi.intranet.model.ProtocolliClassificazione;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.RaccomandataProtocollo;
import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.StatoProtocollo;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.persistence.*;
import org.checkerframework.checker.units.qual.A;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProtocolloDTO {
    public long id;
    public String nProtocollo;
    public String idMittente;
    public String mittente;
    public String destinatari;
    public String assegnatari;
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
    public String nProtocolloCircolare;
    public String indirizzoPecPeo;
    public String corpoPecPeo;
    public Integer invioEmailMultiplo;
    public String cdr;
    public String cdrCode;
    public List<AllegatoDTO> allegati;
    public List<Long> protocolliClassificazioneList;

    public static ProtocolloDTO fromProtocollo(Protocollo p) {
        ProtocolloDTO pDto = new ProtocolloDTO();
        pDto.id = p.getId();
        pDto.nProtocollo = p.getNProtocollo();
        pDto.idMittente = p.getIdMittente();
        pDto.mittente = p.getMittente();
        pDto.destinatari = p.getDestinatari();
        pDto.assegnatari = p.getAssegnatari();
        pDto.idUtente = p.getIdUtente();
        pDto.utente = p.getUtente();
        pDto.tipoRegistrazione = p.getTipoRegistrazione().getTipoRegistrazione();
        pDto.oggetto = p.getOggetto();
        pDto.idUtenteLastOperation = p.getIdUtenteLastOperation();
        pDto.tsCreation = p.getTsCreation();
        pDto.tsStartVali = p.getTsStartVali();
        pDto.metodoSpedizione = p.getMetodoSpedizione().getMetodo();
        pDto.protocolloMittente = p.getProtocolloMittente();
        pDto.dataProtocolloMittente = p.getDataProtocolloMittente();
        pDto.note = p.getNote();
        pDto.stato = p.getStato().getStato();
        pDto.nProtocolloCircolare = p.getNProtocolloCircolare();
        pDto.indirizzoPecPeo = p.getIndirizzoPecPeo();
        pDto.corpoPecPeo = p.getCorpoPecPeo();
        pDto.invioEmailMultiplo = p.getInvioEmailMultiplo();
        pDto.cdr = p.getCdr();
        pDto.cdrCode = p.getCdrCode();

        pDto.protocolliClassificazioneList = new ArrayList<>();
        if (p.getProtocolliClassificazioneList() != null) {
            for(ProtocolliClassificazione pc : p.getProtocolliClassificazioneList()) {
                pDto.protocolliClassificazioneList.add(pc.getIdTitolario());
            }
        }

        pDto.allegati = new ArrayList<>();
        if (p.getAllegati() != null) {
            for(Allegato a : p.getAllegati()) {
                pDto.allegati.add(AllegatoDTO.fromAllegato(a));
            }
        }
        return pDto;
    }
}
