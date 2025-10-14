package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Table(name = "protocolli_classificazione")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Builder
@Entity
@NamedQuery(
        name = "findProtocolloClassificato",
        query = "SELECT pc FROM ProtocolliClassificazione pc " +
                "WHERE pc.protocollo.id = :idProtocollo " +
                "AND pc.idTitolario = :idTitolario"
)
@NamedQuery(
        name = "findAllProtocolloClassificatoByIdProtocollo",
        query = "SELECT pc FROM ProtocolliClassificazione pc " +
                "WHERE pc.protocollo.id = :idProtocollo"
)
@NamedQuery(
        name = "setDeleteTime",
        query = "UPDATE ProtocolliClassificazione pc SET pc.tsDeleted = :tsDeleted WHERE pc.protocollo.id = :idProtocollo AND pc.idTitolario = :idTitolario"
)
@NamedQuery(
        name = "getAllIdProtocolloByFascicolo",
        query = "SELECT pc.protocollo.id FROM ProtocolliClassificazione pc WHERE pc.idTitolario = :idFascicolo"
)
@NamedQuery(
        name = "getUtenteFirtsClassificazioneProtocollo",
        query = "SELECT pc.idUtenteLastOperation FROM ProtocolliClassificazione pc " +
                "WHERE pc.protocollo.id = :idProtocollo " +
                "ORDER BY pc.tsCreation ASC"
)
@NamedQuery(
        name = "spostaProtocollo",
        query = "UPDATE ProtocolliClassificazione pc SET pc.idTitolario = :idFascicoloNew WHERE pc.protocollo.id IN (:idProtocolli) AND pc.idTitolario = :idFascicoloOld"
)
@NamedQuery(
        name = "deleteClassificazioneById",
        query = "DELETE FROM ProtocolliClassificazione p WHERE p.id = :id"
)
public class ProtocolliClassificazione extends PanacheCustomEntity{

    @ManyToOne
    @JoinColumn(name = "ID_PROTOCOLLO")
    private Protocollo protocollo;

    @Column(name = "ID_TITOLARIO")
    private Long idTitolario;

    @CreationTimestamp
    @Column(name = "TS_CREATION")
    private Date tsCreation;

    @Column(name = "TS_UPDATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsUpdate;

    @Column(name = "TS_DELETED")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsDeleted;

    @Column(name = "ID_UTENTE_LAST_OPERATION")
    private String idUtenteLastOperation;
}
