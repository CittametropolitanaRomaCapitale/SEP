package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.CryptoUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;
import java.util.StringJoiner;

@Table(name = "PEC_PEO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity

@NamedQuery(
        name = "findAllPecPeo",
        query = "SELECT p FROM PecPeo p " +
                "JOIN p.uffici u " +
                "WHERE p.idUtente = :idUtente OR u.cdrCode = :cdrCode"
)

@NamedQuery(
        name = "findAllPecPeoForUsers",
        query = "SELECT p FROM PecPeo p " +
                "JOIN p.uffici u " +
                "WHERE p.idUtente IN :idUtente OR u.cdrCode IN :cdrCode"
)

@NamedQuery(
        name = "findAllPecPeoByIdUtente",
        query = "SELECT p FROM PecPeo p " +
                "WHERE p.idUtente = :idUtente"
)

@NamedQuery(
        name = "findAllPecPeoByCdr",
        query = "SELECT p FROM PecPeo p " +
                "JOIN p.uffici u " +
                "WHERE u.cdrCode = :cdrCode"
)

@NamedQuery(
        name = "findAllPecPeoByTipologiaPostaAndCdrCode",
        query = "SELECT p.indirizzoEmail FROM PecPeo p " +
                "JOIN p.configurazione c " +
                "LEFT JOIN p.uffici u " +
                "WHERE (p.idUtente = :idUtente OR u.cdrCode = :cdrCode) " +
                "AND c.tipologiaPosta = :tipologiaPosta"
)

@NamedQuery(
        name = "findAllPecPeoByUtenteAndCdrCode",
        query = "SELECT p.indirizzoEmail FROM PecPeo p " +
                "JOIN p.configurazione c " +
                "LEFT JOIN p.uffici u " +
                "WHERE (p.idUtente = :idUtente OR u.cdrCode = :cdrCode) "
)

@NamedQuery(
        name = "findAllPecPeoIdByEmail",
        query = "SELECT p.id FROM PecPeo p WHERE p.indirizzoEmail = :email AND p.id != :id"
)

@NamedQuery(
        name = "findPecByEmailForRispostaAutomatica",
        query = "SELECT p.indirizzoEmail FROM PecPeo p WHERE p.mustSendRispostaAutomatica = true AND p.indirizzoEmail = :email AND p.configurazione.tipologiaPosta = :tipologiaPosta"
)

@NamedQuery(
        name = "findAllPecPeoToDelete",
        query = "SELECT p FROM PecPeo p WHERE p.deleteMessages is not null AND p.deleteMessages = true"
)
@ApplicationScoped
public class PecPeo extends PanacheCustomEntity{

    @Column(name = "ID_UTENTE")
    private String idUtente;

    @Column(name = "INDIRIZZO_EMAIL")
    private String indirizzoEmail;

    @CreationTimestamp
    @Column(name = "TS_CREATION")
    private Date tsCreation;

    @Column(name = "utente")
    private String utente;

    @Column(name = "USERNAME")
    private String username;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "attiva")
    private boolean attiva;

    @Column(name = "delete_messages")
    private boolean deleteMessages;

    @Column(name = "save_to_sent")
    private boolean saveToSent;

    @Column(name = "read_pec")
    private boolean readPec;

    @Column(name = "risposta_automatica")
    private boolean mustSendRispostaAutomatica;

    @ManyToOne
    @JoinColumn(name = "ID_CONFIGURAZIONE")
    private PeConfigurazione configurazione;

    @ManyToMany
    @JoinTable(
            name = "PEC_PEO_UFFICIO",
            joinColumns = @JoinColumn(name = "PEC_PEO_ID"),
            inverseJoinColumns = @JoinColumn(name = "UFFICIO_ID")
    )
    private List<Ufficio> uffici;

    public void setPasswordCrypted(String password) throws Exception {
        this.password = CryptoUtil.encrypt(password);
    }

    public String getPasswordDecrypted() throws Exception {
        return CryptoUtil.decrypt(this.password);
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", PecPeo.class.getSimpleName() + "[", "]")
                .add("idUtente=" + idUtente)
                .add("indirizzoEmail='" + indirizzoEmail + "'")
//                .add("cdrCode='" + cdrCode + "'")
                .add("tsCreation=" + tsCreation)
                .add("username='" + username + "'")
                .add("password='" + password + "'")
                .add("configurazione=" + configurazione)
                .toString();
    }
}
