package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.EmailDirection;
import it.parsec326.pi.intranet.utils.common.StatoInvio;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Table(name = "email")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Builder
@NamedQuery(
        name = "updatemessageId",
        query = "UPDATE Email e SET e.messageId = :messageId WHERE e.id = :id"
)

@NamedQuery(
        name = "getFrommessageId",
        query = "SELECT e FROM Email e WHERE lower(e.messageId) = lower(:messageId)"
)

@NamedQuery(
        name = "getFromProtocolloId",
        query = "SELECT e FROM Email e WHERE protocollo.id = :idProtocollo ORDER BY e.id ASC"
)

@NamedQuery(
        name = "findDaInviareOlderThan",
        query = "SELECT e FROM Email e " +
                "WHERE e.statoInvio IN :stati " +
                "  AND e.tsCreation < :timestampLimite"
)

@NamedQuery(
        name = "updateEmailSetDeletedTrue",
        query = "UPDATE Email e SET e.deletedFromInbox = true WHERE e.messageId = :messageId"
)

@NamedQuery(
        name = "updateEmailSetDeletedFalse",
        query = "UPDATE Email e SET e.deletedFromInbox = false WHERE e.messageId = :messageId"
)

@NamedQuery(
        name = "findEmailToDeleteFromInbox",
        query = "SELECT e.messageId FROM Email e " +
                "WHERE e.tipoEmail != 'PEO' " +
                "AND (e.to LIKE CONCAT('%', :address, '%') OR e.cc LIKE CONCAT('%', :address, '%')) " +
                "AND (e.deletedFromInbox is null OR e.deletedFromInbox = false) " +
                "AND e.messageId is not null " +
                "AND e.emailDirection = :emailDirection " +
                "AND e.tsCreation > :timestampLimite"
)

@NamedQuery(
        name = "findOldEmailToDeleteFromInbox",
        query = "SELECT e.messageId FROM Email e " +
                "WHERE e.tipoEmail != 'PEO' " +
                "AND (e.to LIKE CONCAT('%', :address, '%') OR e.cc LIKE CONCAT('%', :address, '%')) " +
                "AND (e.deletedFromInbox is null OR e.deletedFromInbox = false) " +
                "AND e.messageId is not null " +
                "AND e.emailDirection = :emailDirection " +
                "AND e.tsCreation > :timestampMax " +
                "AND e.tsCreation < :timestampLimite"
)

@NamedQuery(
        name = "findEmailToCheckIfDeletedFromInbox",
        query = "SELECT e.messageId FROM Email e " +
                "WHERE e.tipoEmail != 'PEO' " +
                "AND (e.to LIKE CONCAT('%', :address, '%') OR e.cc LIKE CONCAT('%', :address, '%')) " +
                "AND e.deletedFromInbox = true " +
                "AND e.messageId is not null " +
                "AND e.emailDirection = :emailDirection " +
                "AND e.tsCreation > :timestampLimite"
)

@NamedQuery(
        name = "findEmailDaInviareDaAlmeno15Minuti",
        query = "SELECT e.id FROM Email e " +
                "WHERE e.statoInvio = 'DA_INVIARE' " +
                "AND e.tsCreation <= :timestampLimite"
)

public class Email extends PanacheCustomEntity {

    @ManyToOne
    @JoinColumn(name = "id_protocollo")
    private Protocollo protocollo;

    @Column(name = "tipo_email")
    private String tipoEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_direction")
    private EmailDirection emailDirection;

    @Column(name = "email_from")
    private String from;

    @Column(name = "email_to")
    private String to;

    @Column(name = "email_cc")
    private String cc;

    @Column(name = "oggetto")
    private String oggetto;

    @Column(name = "corpo")
    private String corpo;

    @Column(name = "ts_invio")
    private Timestamp tsInvio;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato_invio")
    private StatoInvio statoInvio;

    @Column(name = "classificazione")
    private String classificazione;

    @Column(name = "id_utente")
    private String idUtente;

    @Column(name = "nome_utente")
    private String nomeUtente;

    @Column(name = "ts_creation")
    private Timestamp tsCreation;

    @Column(name = "ts_ricezione")
    private Timestamp tsRicezione;

    @Column(name = "ts_start_vali")
    private Timestamp tsStartVali;

    @Column(name = "impronta")
    private String impronta;

    @Column(name = "message_id")
    private String messageId;

    @ManyToMany
    @JoinTable(
            name = "EMAIL_ALLEGATI",
            joinColumns = @JoinColumn(name = "ID_EMAIL"),
            inverseJoinColumns = @JoinColumn(name = "ID_ALLEGATO")
    )
    private List<Allegato> allegati;

    @Column(name = "notifica_protocollo")
    private boolean notificaProtocollo;

    @Column(name = "deleted_from_inbox")
    private Boolean deletedFromInbox;

    @Column(name = "is_hidden")
    private Boolean isHidden;

    // Builder interno
    public static class Builder {
        private Protocollo protocollo;
        private String tipoEmail;
        private EmailDirection emailDirection;
        private String from;
        private String to;
        private String cc;
        private String oggetto;
        private String corpo;
        private Timestamp tsInvio;
        private StatoInvio statoInvio;
        private String classificazione;
        private String idUtente;
        private String nomeUtente;
        private Timestamp tsCreation;
        private Timestamp tsRicezione;
        private Timestamp tsStartVali;
        private String impronta;
        private String messageId;
        private List<Allegato> allegati;  // Aggiungi allegati
        private boolean notificaProtocollo;  // Aggiungi notificaProtocollo
        private Boolean deletedFromInbox;
        private Boolean isHidden;

        public Builder protocollo(Protocollo protocollo) {
            this.protocollo = protocollo;
            return this;
        }

        public Builder tipoEmail(String tipoEmail) {
            this.tipoEmail = tipoEmail;
            return this;
        }

        public Builder emailDirection(EmailDirection emailDirection) {
            this.emailDirection = emailDirection;
            return this;
        }

        public Builder from(String from) {
            this.from = from;
            return this;
        }

        public Builder to(String to) {
            this.to = to;
            return this;
        }

        public Builder cc(String cc) {
            this.cc = cc;
            return this;
        }

        public Builder oggetto(String oggetto) {
            this.oggetto = oggetto;
            return this;
        }

        public Builder corpo(String corpo) {
            this.corpo = corpo;
            return this;
        }

        public Builder tsInvio(Timestamp tsInvio) {
            this.tsInvio = tsInvio;
            return this;
        }

        public Builder statoInvio(StatoInvio statoInvio) {
            this.statoInvio = statoInvio;
            return this;
        }

        public Builder classificazione(String classificazione) {
            this.classificazione = classificazione;
            return this;
        }

        public Builder idUtente(String idUtente) {
            this.idUtente = idUtente;
            return this;
        }

        public Builder nomeUtente(String nomeUtente) {
            this.nomeUtente = nomeUtente;
            return this;
        }

        public Builder tsCreation(Timestamp tsCreation) {
            this.tsCreation = tsCreation;
            return this;
        }

        public Builder tsRicezione(Timestamp tsRicezione) {
            this.tsRicezione = tsRicezione;
            return this;
        }

        public Builder tsStartVali(Timestamp tsStartVali) {
            this.tsStartVali = tsStartVali;
            return this;
        }

        public Builder impronta(String impronta) {
            this.impronta = impronta;
            return this;
        }

        public Builder messageId(String messageId) {
            this.messageId = messageId;
            return this;
        }

        public Builder allegati(List<Allegato> allegati) {
            this.allegati = allegati;
            return this;
        }

        public Builder notificaProtocollo(boolean notificaProtocollo) {
            this.notificaProtocollo = notificaProtocollo;
            return this;
        }

        public Builder deletedFromInbox(Boolean deletedFromInbox) {
            this.deletedFromInbox = deletedFromInbox;
            return this;
        }

        public Builder isHidden(Boolean isHidden) {
            this.isHidden = isHidden;
            return this;
        }

        public Email build() {
            Email email = new Email();
            email.protocollo = this.protocollo;
            email.tipoEmail = this.tipoEmail;
            email.emailDirection = this.emailDirection;
            email.from = this.from;
            email.to = this.to;
            email.cc = this.cc;
            email.oggetto = this.oggetto;
            email.corpo = this.corpo;
            email.tsInvio = this.tsInvio;
            email.statoInvio = this.statoInvio;
            email.classificazione = this.classificazione;
            email.idUtente = this.idUtente;
            email.nomeUtente = this.nomeUtente;
            email.tsCreation = this.tsCreation;
            email.tsRicezione = this.tsRicezione;
            email.tsStartVali = this.tsStartVali;
            email.impronta = this.impronta;
            email.messageId = this.messageId;
            email.allegati = this.allegati;  // Aggiungi allegati
            email.notificaProtocollo = this.notificaProtocollo;  // Aggiungi notificaProtocollo
            email.deletedFromInbox = this.deletedFromInbox;
            email.isHidden = this.isHidden;
            return email;
        }
    }

    @Override
    public String toString() {
        return "Email{" +
                "protocollo=" + protocollo +
                ", tipoEmail='" + tipoEmail + '\'' +
                ", emailDirection=" + emailDirection +
                ", from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", cc='" + cc + '\'' +
                ", oggetto='" + oggetto + '\'' +
                ", corpo='" + corpo + '\'' +
                ", tsInvio=" + tsInvio +
                ", statoInvio=" + statoInvio +
                ", classificazione='" + classificazione + '\'' +
                ", idUtente=" + idUtente +
                ", nomeUtente=" + nomeUtente +
                ", tsCreation=" + tsCreation +
                ", tsRicezione=" + tsRicezione +
                ", tsStartVali=" + tsStartVali +
                ", impronta='" + impronta + '\'' +
                ", messageId='" + messageId + '\'' +
                ", allegati=" + allegati +
                ", notificaProtocollo=" + notificaProtocollo +
                ", deletedFromInbox=" + deletedFromInbox +
                ", isHidden=" + isHidden +
                '}';
    }
}