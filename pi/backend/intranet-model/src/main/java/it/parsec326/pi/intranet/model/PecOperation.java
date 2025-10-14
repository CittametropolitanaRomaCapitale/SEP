package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Table(name = "PEC_OPERATION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Builder
@ApplicationScoped
public class PecOperation extends PanacheCustomEntity {

    @ManyToOne
    @JoinColumn(name = "id_protocollo")
    private Protocollo protocollo;

    @ManyToOne
    @JoinColumn(name = "id_email")
    private Email email;

    @Column(name = "cdr_code")
    private String cdrCode;

    @Column(name = "id_utente")
    private String idUtente;

    @Column(name = "nome_utente")
    private String nomeUtente;

    @Enumerated(EnumType.STRING)
    @Column(name = "last_operation")
    private Operazione lastOperation;

    @Column(name = "ts_creation")
    private Date tsCreation;

    @Column(name = "ts_update")
    private Date tsUpdate;

}

