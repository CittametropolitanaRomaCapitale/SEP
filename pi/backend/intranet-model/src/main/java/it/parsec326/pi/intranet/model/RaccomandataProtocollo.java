package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.StatoRaccomandataProtocollo;
import it.parsec326.pi.intranet.utils.common.TipoRaccomandata;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Table(name = "protocolli_raccomandate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@NamedQuery(
        name = "getRaccomandateProtocollo",
        query = "SELECT rp FROM RaccomandataProtocollo rp WHERE rp.protocollo.id = :idProtocollo and rp.stato not in('annullato', 'inCoda')"
)
public class RaccomandataProtocollo extends PanacheCustomEntity {

    @ManyToOne
    @JoinColumn(name = "ID_PROTOCOLLO")
    private Protocollo protocollo;

    @OneToOne
    @JoinColumn(name = "ID_ALLEGATO")
    private Allegato allegato;

    @Column(name = "TS_CREATION")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsCreation;

    @Column(name = "TS_UPDATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsUpdate;

    @Column(name = "ID_RACCOMANDATA")
    private String idRaccomandata;

    @Column(name = "NUMERO_RACCOMANDATA")
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATO_RACCOMANDATA")
    private StatoRaccomandataProtocollo stato;

    @Column(name = "COSTO_RACCOMANDATA")
    private String costo;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_RACCOMANDATA")
    private TipoRaccomandata tipo;

    @Column(name = "MITTENTE")
    private String mittente;

    @Column(name = "ULTERIORE_DATO_MITTENTE")
    private String ulterioreDatoMittente;

    @Column(name = "MITTENTE_INDIRIZZO")
    private String mittenteIndirizzo;

    @Column(name = "MITTENTE_NR_CIVICO")
    private String mittenteCivico;

    @Column(name = "MITTENTE_PRESSO")
    private String mittentePresso;

    @Column(name = "MITTENTE_CAP")
    private String mittenteCap;

    @Column(name = "MITTENTE_PROVINCIA")
    private String mittenteProvincia;

    @Column(name = "MITTENTE_CITTA")
    private String mittenteCitta;

    @Column(name = "DESTINATARIO")
    private String destinatario;

    @Column(name = "DESTINATARIO_CITTA")
    private String destinatarioCitta;

    @Column(name = "DESTINATARIO_PROVINCIA")
    private String destinatarioProvincia;

    @Column(name = "DESTINATARIO_CAP")
    private String destinatarioCap;

    @Column(name = "DESTINATARIO_INDIRIZZO")
    private String destinatarioIndirizzo;

    @Column(name = "DESTINATARIO_INDIRIZZO_2")
    private String destinatarioIndirizzo2;

    @Column(name = "DESTINATARIO_NR_CIVICO")
    private String destinatarioCivico;

    @Column(name = "ts_inserimento")
    private Date tsInserimento;

    @Column(name = "ts_inoltro")
    private Date tsInoltro;

    @Column(name = "ts_consegna")
    private Date tsConsegna;

    @Column(name = "stato_consegna")
    private String statoConsegna;

    @Column(name = "nome_utente")
    private String nomeUtente;

    @Column(name = "id_utente")
    private String idUtente;

    public boolean canBeDeleted() {
        return (stato == null || (stato.equals(StatoRaccomandataProtocollo.inCoda)) );
    }

    //TODO: capire quali sono le condizioni per cui NON deve essere inviata al client di raccomandate online per essere spedita!
    public boolean hasCompletedLifetime() {
        if(stato != null && stato.equals(StatoRaccomandataProtocollo.errore) && idRaccomandata == null)
            return true;
        else
            return stato != null && statoConsegna != null && (stato.equals(StatoRaccomandataProtocollo.errore) || statoConsegna.equalsIgnoreCase("consegnato")) ;
    }
}

