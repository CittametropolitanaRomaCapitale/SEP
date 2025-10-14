package it.parsec326.pi.intranet.dto.output;

import it.parsec326.pi.intranet.model.Allegato;
import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import org.checkerframework.checker.units.qual.A;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AllegatoDTO {
    public long id;
    public String idUtente;
    public String tipoDocumento;
    public String oggetto;
    public String collocazioneTelematica;
    public String idUtenteLastOperation;
    public Date tsCreation;
    public Date tsStartVali;
    public String riferimentoMinio;
    public boolean isMain;
    public String nome;
    public long dimensione;
    public String estensione;
    public long idEmail;
    public String impronta;
    public boolean discarded;
    public long idOriginal;

    public static AllegatoDTO fromAllegato(Allegato a) {
        AllegatoDTO aDto = new AllegatoDTO();
        aDto.id = a.getId() != null ? a.getId() : -1;
        aDto.idUtente = a.getIdUtente();
        aDto.tipoDocumento = a.getTipoDocumento();
        aDto.oggetto = a.getOggetto();
        aDto.collocazioneTelematica = a.getCollocazioneTelematica();
        aDto.idUtenteLastOperation = a.getIdUtenteLastOperation();
        aDto.tsCreation = a.getTsCreation();
        aDto.tsStartVali = a.getTsStartVali();
        aDto.riferimentoMinio = a.getRiferimentoMinio();
        aDto.isMain = a.getIsMain() != null ? a.getIsMain() : false;
        aDto.nome = a.getNome();
        aDto.dimensione = a.getDimensione() != null ? a.getDimensione() : 0;
        aDto.estensione = a.getEstensione();
        aDto.idEmail = a.getIdEmail() != null ? a.getIdEmail() : -1;
        aDto.impronta = a.getImpronta();
        aDto.discarded = a.getDiscarded() != null ? a.getDiscarded() : false;
        aDto.idOriginal = a.getIdOriginal() != null ? a.getIdOriginal() : -1;
        return aDto;
    }
    public static List<AllegatoDTO> fromAllegatiList(List<Allegato> allegati) {
        if (allegati == null) return null;
        List<AllegatoDTO> dto = new ArrayList<>();
        for(Allegato allegato : allegati) {
            dto.add(AllegatoDTO.fromAllegato(allegato));
        }
        return dto;
    }
}
