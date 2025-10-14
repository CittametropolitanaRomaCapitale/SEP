package it.parsec326.pi.intranet.model;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;

@Table(name = "GRUPPI")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity

@NamedQuery(
        name = "findGruppoByIds",
        query = "SELECT g FROM Gruppo g WHERE g.id IN :ids"
)
@NamedQuery(
        name = "findGruppiByAnagraficaId",
        query = "SELECT g FROM Gruppo g JOIN g.contatti a WHERE a.id = :anagraficaId"
)


@ApplicationScoped
public class Gruppo extends PanacheCustomEntity{

    @Column(name = "NOME")
    private String nome;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "ID_UTENTE_LAST_OPERATION")
    private String idUtenteLastOperation;

    @CreationTimestamp
    @Column(name = "TS_CREATION")
    private Date tsCreation;

    @Column(name = "TS_UPDATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsUpdate;

    @Column(name = "TS_DELETED")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsDeleted;

    @ManyToMany
    @JoinTable(
            name = "GRUPPI_ANAGRAFICA",
            joinColumns = @JoinColumn(name = "GRUPPO_ID"),
            inverseJoinColumns = @JoinColumn(name = "ANAGRAFICA_ID")
    )
    private List<Anagrafica> contatti;

}
