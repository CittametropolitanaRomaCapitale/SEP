package it.parsec326.pi.intranet.model;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalTime;
import java.util.Set;

@Table(name = "pec_regole_finestra_temporale")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@ApplicationScoped
public class PecRegolaFinestraTemporale   extends PanacheCustomEntity {

    @Column(name = "day_of_week", nullable = false)
    public short dayOfWeek;

    @Column(name = "start_time", nullable = false)
    public LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    public LocalTime endTime;
}
