package it.parsec326.pi.intranet.model;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Timestamp;


@NamedQuery(
        name = "getAllNotificheNonInviate",
        query = "SELECT n FROM Notifica n WHERE n.state is null"
)

@Table(name = "PROTOCOLLO_NOTIFICHE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Builder
@ApplicationScoped
public class Notifica extends PanacheCustomEntity {

    @Column(name = "ID_PROTOCOLLO")
    private Long idProtocollo;

    @Column(name = "notifica_type")
    private String type;

    @Column(name = "notifica_to")
    private String to;

    @Column(name = "notifica_from")
    private String from;

    @Column(name = "subject")
    private String subject;

    @Column(name = "content")
    private String content;

    @Column(name = "state")
    private String state;

    @Column(name = "ts_creation")
    private Timestamp tsCreation;

    @Column(name = "ts_update")
    private Timestamp tsUpdate;

    @Column(name = "ts_sent")
    private Timestamp tsSent;

    @Column(name = "notifica_read")
    private boolean read;

    public void setStateInviato() { state = "inviata"; }
    public void setStateInCoda() { state = "inCoda"; }
    public void setStateInErrore() { state = "errore"; }
    public boolean isInviata() { return state != null && state.equalsIgnoreCase("inviata"); }
    public boolean isInCoda() { return state != null && state.equalsIgnoreCase("inCoda"); }
    public boolean isInErrore() { return !isInCoda() && !isInviata(); }

}

