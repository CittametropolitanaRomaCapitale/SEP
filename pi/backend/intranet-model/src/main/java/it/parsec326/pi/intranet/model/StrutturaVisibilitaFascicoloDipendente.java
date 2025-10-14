package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.PermessoFascicoloDipendente;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "struttura_visibilita_fascicolo_dipendente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
public class StrutturaVisibilitaFascicoloDipendente extends PanacheCustomEntity {

    @Column(name = "id_struttura_fascicolo_dipendente")
    private Long idStrutturaFascicoloDipendente;

    @Column(name = "id_ufficio")
    private Long idUfficio;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_utenti")
    private PermessoFascicoloDipendente visibilitaUtenti;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_archivisti")
    private PermessoFascicoloDipendente visibilitaArchivisti;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_protocollatori")
    private PermessoFascicoloDipendente visibilitaProtocollatori;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_dirigenti")
    private PermessoFascicoloDipendente visibilitaDirigenti;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibilita_dipendente")
    private PermessoFascicoloDipendente visibilitaDipendente;
}
