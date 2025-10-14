package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Table(name = "visibilita_titolario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Builder
@Entity

@NamedQuery(
        name = "getTitolarioFromVisibilitaTitolario",
        query = "SELECT vt FROM VisibilitaTitolario vt WHERE vt.cdrCode = :cdrCode and (vt.idUtente is null or vt.idUtente = :idUtente)"
)
public class VisibilitaTitolario extends PanacheCustomEntity{

    @ManyToOne
    @JoinColumn(name = "ID_TITOLARIO")
    private Titolario titolario;

    @Column(name = "ID_UTENTE")
    private String idUtente;

    @Column(name = "CDR")
    private String cdr;

    @Column(name = "CDR_CODE")
    private String cdrCode;

    @CreationTimestamp
    @Column(name = "TS_CREATION")
    private Date tsCreation;

    @Column(name = "WRITE_MODE")
    private Boolean write;

    @Column(name = "TS_UPDATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsUpdate;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "ID_UTENTE_LAST_OPERATION")
    private String idUtenteLastOperation;

    @Column(name = "USERNAME_UTENTE")
    private String usernameUtente;

    @Column(name = "NOME_UTENTE")
    private String nomeUtente;

    @Override
    public String toString() {
        return "VisibilitaTitolario{" +
                "titolario=" + titolario +
                ", idUtente='" + idUtente + '\'' +
                ", cdr='" + cdr + '\'' +
                ", cdrCode='" + cdrCode + '\'' +
                ", tsCreation=" + tsCreation +
                ", write=" + write +
                ", tsUpdate=" + tsUpdate +
                ", note='" + note + '\'' +
                ", idUtenteLastOperation='" + idUtenteLastOperation + '\'' +
                ", usernameUtente='" + usernameUtente + '\'' +
                ", nomeUtente='" + nomeUtente + '\'' +
                '}';
    }
}
