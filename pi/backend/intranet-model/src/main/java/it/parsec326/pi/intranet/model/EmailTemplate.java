package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "EMAIL_TEMPLATES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Builder
@ApplicationScoped
@NamedQuery(
        name = "findTemplateByOperazioneAndTipologia",
        query = "SELECT t FROM EmailTemplate t WHERE t.operazione = :operazione and t.tipologia = :tipologia"
)
public class EmailTemplate extends PanacheCustomEntity {

    @Column(name = "tipologia")
    private String tipologia;

    @Enumerated(EnumType.STRING)
    @Column(name = "operazione")
    private Operazione operazione;

    @Column(name = "oggetto")
    private String oggetto;

    @Column(name = "corpo")
    private String corpo;

}

