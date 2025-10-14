package it.parsec326.pi.intranet.model;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "pec_escluse_risposta_automatica")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ApplicationScoped
public class PecEscluseRispostaAutomatica extends PanacheCustomEntity  {
    @Column(name = "indirizzo", nullable = false, unique = true)
    private String indirizzo;

    @CreationTimestamp
    @Column(name = "ts_creation")
    private Date tsCreation;
}
