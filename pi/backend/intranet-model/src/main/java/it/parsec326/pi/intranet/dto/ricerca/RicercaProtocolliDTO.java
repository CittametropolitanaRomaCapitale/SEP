package it.parsec326.pi.intranet.dto.ricerca;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class RicercaProtocolliDTO extends BaseSearchDTO {
    private String numero;
    private String numeroEmergenza;
    private Integer anno;
    private String oggetto;
    private Date dataCreazioneFrom;
    private Date dataCreazioneTo;
    private String mittente;
    private String assegnatari;
    private String destinatari;
    private String selectedOffice;
    private List<String> stato;
    private List<String> tagList;
    private List<String> tipoRegistrazione;
    private List<String> metodoSpedizione;
    private String note;
    private boolean isRicercaAvanzata;
    private boolean isFiltroUfficio;
    private boolean isFiltroAll;
    private Long idFascicolo;
    private String nomeTitolario;
    private List<Long> idFascicoli;
    private String cdrCode;
    private Date dataCreazioneEmergenzaFrom;
    private Date dataCreazioneEmergenzaTo;

    public SortInput getDefaultSort() {
        SortInput sortInput = new SortInput();
        sortInput.by = "tsCreation";
        sortInput.desc = true;
        return sortInput;
    }

    public boolean isEmpty() {
        return (
                        (!hasNumero())
                        && (!hasNumeroEmergenza())
                        && (!hasOggetto())
                        && anno == null
                        && dataCreazioneFrom == null
                        && dataCreazioneTo == null
                        && dataCreazioneEmergenzaFrom == null
                        && dataCreazioneEmergenzaTo == null
                        && (!hasIdFascicolo())
                        && (!hasMittente())
                        && (!hasAssegnatari())
                        && (!hasDestinatari())
                        && (!hasStato())
                        && (!hasCdr())
                        && (!hasMetodoSpedizione())
                        && (!hasTipoRegistrazione())
                        && (!hasNote()
                        && (!hasNomeTitolario()
                        && (!hasLagList())
                        && (!hasIdFascicoli())
                ))
        );
    }

    public boolean hasNumero() {
        return numero != null && !numero.isBlank();
    }
    public boolean hasNumeroEmergenza(){ return numeroEmergenza != null && !numeroEmergenza.isBlank(); }
    public boolean hasOggetto() {
        return oggetto != null && (!oggetto.isBlank());
    }
    public boolean hasDataCreazioneIntervallo() {
        return dataCreazioneFrom != null && dataCreazioneTo != null;
    }
    public boolean hasDataCreazioneEmergenzaIntervallo() {
        return dataCreazioneEmergenzaFrom != null && dataCreazioneEmergenzaTo != null;
    }
    public boolean hasMittente() {
        return mittente != null && (!mittente.isBlank());
    }
    public boolean hasAssegnatari() {
        return assegnatari != null && (!assegnatari.isBlank());
    }
    public boolean hasDestinatari() {
        return destinatari != null && (!destinatari.isBlank());
    }
    public boolean hasStato() {
        return stato != null && (!stato.isEmpty());
    }
    public boolean hasTipoRegistrazione() {
        return tipoRegistrazione != null && (!tipoRegistrazione.isEmpty());
    }
    public boolean hasMetodoSpedizione() {
        return metodoSpedizione != null && (!metodoSpedizione.isEmpty());
    }
    public boolean hasNote() {
        return note != null && (!note.isBlank());
    }
    public boolean hasNomeTitolario() {
        return nomeTitolario != null && (!nomeTitolario.isBlank());
    }
    public boolean hasIdFascicolo() {
        return idFascicolo != null;
    }
    public boolean hasLagList(){
        return tagList != null && (!tagList.isEmpty());
    }
    public boolean hasIdFascicoli() { return idFascicoli != null && (!idFascicoli.isEmpty()); }

    public Date getDataCreazioneTo() {
        if (dataCreazioneTo == null)
            return null;

        Instant instantTo = dataCreazioneTo.toInstant();
        int hourTo = instantTo.atZone(ZoneId.systemDefault()).getHour();
        int minuteTo = instantTo.atZone(ZoneId.systemDefault()).getMinute();
        int secondTo = instantTo.atZone(ZoneId.systemDefault()).getSecond();

        //se
        if (hourTo == 0 && minuteTo == 0 && secondTo == 0) {
            return Date.from(instantTo.plusSeconds((60 * 60 * 24) - 1 ));
        }
        return dataCreazioneTo;
    }

    public Date getDataCreazioneEmergenzaTo() {
        if (dataCreazioneEmergenzaTo == null)
            return null;

        Instant instantTo = dataCreazioneEmergenzaTo.toInstant();
        int hourTo = instantTo.atZone(ZoneId.systemDefault()).getHour();
        int minuteTo = instantTo.atZone(ZoneId.systemDefault()).getMinute();
        int secondTo = instantTo.atZone(ZoneId.systemDefault()).getSecond();

        //se
        if (hourTo == 0 && minuteTo == 0 && secondTo == 0) {
            return Date.from(instantTo.plusSeconds((60 * 60 * 24) - 1 ));
        }
        return dataCreazioneEmergenzaTo;
    }

    public String getSortColumnNative(String by) {
        if (by.equals("nProtocollo")) return "n_protocollo";
        if (by.equals("tipoRegistrazione")) return "tipo_registrazione";
        if (by.equals("tsCreation")) return "ts_creation";
        if (by.equals("metodoSpedizione")) return "metodo_spedizione";
        return by;
    }
}
