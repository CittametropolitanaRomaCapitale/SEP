package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.PermessoFascicoloDipendente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Table(name = "PERMESSI_FASCICOLO_DIPENDENTE")
public class PermessiFascicoloDipendente extends PanacheCustomEntity {

    @ManyToOne
    @JoinColumn(name = "ID_TITOLARIO")
    private Titolario titolario;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_utente")
    private PermessoFascicoloDipendente visibilitaUtente;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_dirigente")
    private PermessoFascicoloDipendente visibilitaDirigente;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_archivista")
    private PermessoFascicoloDipendente visibilitaArchivista;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_protocollatore")
    private PermessoFascicoloDipendente visibilitaProtocollatore;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_dipendente")
    private PermessoFascicoloDipendente visibilitaDipendente;

    @Column(name = "ts_creation")
    @CreationTimestamp
    private Date tsCreation;

    @ManyToMany
    @JoinTable(
            name = "PERMESSI_FASCICOLO_DIPENDENTE_CDR",
            joinColumns = @JoinColumn(name = "id_permessi_fascicolo_dipendente"),
            inverseJoinColumns = @JoinColumn(name = "id_ufficio")
    )

    private Set<Ufficio> uffici;

    public static PermessoFascicoloDipendente computeOverallPermesso(List<PermessoFascicoloDipendente> permessi) {
        PermessoFascicoloDipendente overall = PermessoFascicoloDipendente.no;
        for(PermessoFascicoloDipendente p : permessi) {
            if (PermessoFascicoloDipendente.getOrder(overall) < PermessoFascicoloDipendente.getOrder(p)) {
                overall = p;
            }
        }
        return overall;
    }
    public boolean hasUfficio(String cdrCode) {
        return uffici.stream().anyMatch(u -> u.getCdrCode().equalsIgnoreCase(cdrCode));
    }
}