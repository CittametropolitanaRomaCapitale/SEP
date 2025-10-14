package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;

import java.util.Date;
import java.util.StringJoiner;


@Data
@Builder
@Entity
@Table(name = "allegati")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)

@NamedQuery(
        name = "findByImpronta",
        query = "SELECT a FROM Allegato a " +
                "WHERE a.impronta = :impronta "
)
@NamedQuery(
        name = "updateIdEmailById",
        query = "UPDATE Allegato a SET a.idEmail = :idEmail WHERE a.id = :idAllegato"
)
@NamedQuery(
        name = "updateNameAllegatoById",
        query = "UPDATE Allegato a SET a.nome = :nome WHERE a.id = :idAllegato"
)
@NamedQuery(
        name = "findAllegatiByIdEmail",
        query = "SELECT a FROM Allegato a WHERE a.idEmail = :idEmail"
)
@NamedQuery(
        name = "findAllegatiByIdAndIdProtocollo",
        query = "SELECT a FROM Allegato a WHERE a.id IN :ids AND a.protocollo.id = :idProtocollo"
)
@NamedQuery(
        name = "findEmlUscita",
        query = "SELECT a FROM Allegato a WHERE a.idEmail = :idEmail AND a.tipoDocumento = 'eml_protocollo' AND a.estensione = '.eml'"
)
@NamedQuery(
        name = "findMainEmlEntrata",
        query = "SELECT a FROM Allegato a WHERE a.idEmail = :idEmail AND a.isMain = true AND a.estensione = '.eml'"
)
@NamedQuery(
        name = "spostaAllegatiTitolario",
        query = "UPDATE Allegato a SET a.titolario.id = :newTitolario WHERE a.titolario.id = :oldTitolario AND a.id IN :allegatiIds"
)
@NamedQuery(
        name = "getAllAllegatiByFascicolo",
        query = "SELECT a.id FROM Allegato a WHERE a.titolario.id = :idFascicolo"
)

@NamedQuery(
        name = "updateRiferimentoMinioAndImprontaById",
        query = "UPDATE Allegato a SET a.riferimentoMinio = :riferimentoMinio, a.impronta = :impronta WHERE a.id = :id"
)


@NamedQuery(
        name = "updateTipoDocumentoFirmato",
        query = "UPDATE Allegato a SET a.tipoDocumento = :tipoDocumento WHERE a.id = :id"
)

public class Allegato extends PanacheCustomEntity {

    @ManyToOne
    @JoinColumn(name = "ID_PROTOCOLLO")
    private Protocollo protocollo;

    @ManyToOne
    @JoinColumn(name = "ID_TITOLARIO")
    private Titolario titolario;

    @Column(name = "ID_UTENTE")
    private String idUtente;

    @Column(name = "TIPO_DOCUMENTO")
    private String tipoDocumento;

    @Column(name = "OGGETTO")
    private String oggetto;

    @Column(name = "COLLOCAZIONE_TELEMATICA")
    private String collocazioneTelematica;

    @Column(name = "ID_UTENTE_LAST_OPERATION")
    private String idUtenteLastOperation;

    @Column(name = "TS_CREATION")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsCreation;

    @Column(name = "TS_START_VALI")
    private Date tsStartVali;

    @Column(name = "RIFERIMENTO_MINIO")
    private String riferimentoMinio;

    @Column(name = "IS_MAIN")
    private Boolean isMain;

    @Column(name = "nome")
    private String nome;

    @Column(name = "dimensione")
    private Long dimensione;

    @Column(name = "estensione")
    private String estensione;

    @Column(name = "id_email")
    private Long idEmail;

    @Column(name = "impronta")
    private String impronta;

    @Column(name = "discarded")
    private Boolean discarded;

    @Column(name = "id_original")
    private Long idOriginal;


    @Override
    public String toString() {
        return new StringJoiner(", ", Allegato.class.getSimpleName() + "[", "]")
                .add("protocollo=" + (protocollo != null ? protocollo.getNProtocollo() : ""))
                .add("titolario=" + (titolario != null ? titolario.getId() : "'"))
                .add("idUtente=" + idUtente)
                .add("tipoDocumento='" + tipoDocumento + "'")
                .add("oggetto='" + oggetto + "'")
                .add("collocazioneTelematica='" + collocazioneTelematica + "'")
                .add("idUtenteLastOperation=" + idUtenteLastOperation)
                .add("tsCreation=" + tsCreation)
                .add("tsStartVali=" + tsStartVali)
                .add("riferimentoMinio='" + riferimentoMinio + "'")
                .add("isMain=" + isMain)
                .add("nome='" + nome + "'")
                .add("dimensione=" + dimensione)
                .add("estensione='" + estensione + "'")
                .add("idEmail=" + idEmail)
                .add("impronta=" + impronta)
                .add("discarded=" + discarded)
                .toString();
    }
}
