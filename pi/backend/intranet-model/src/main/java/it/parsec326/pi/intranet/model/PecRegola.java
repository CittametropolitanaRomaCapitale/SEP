package it.parsec326.pi.intranet.model;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Table(name = "pec_regole")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@ApplicationScoped
public class PecRegola  extends PanacheCustomEntity {

    @Column(name = "id_email")
    private Long idEmail;

    @Column(name = "id_categoria")
    private short idCategoriaRegola;

    @Column(name = "threshold")
    private Long threshold;

    @Column(name = "duration_minutes")
    private Long durationMinutes;

    @Column(name = "is_enabled")
    private boolean enabled;

    @Column(name = "description")
    private String description;

    @Column(name = "ts_creation")
    private Date tsCreation;

    @Column(name = "ts_last_invio_notifica")
    private Date tsLastInvioNotifica;

    @ManyToMany
    @JoinTable(
            name = "pec_regole_finestre_temporali",
            joinColumns = @JoinColumn(name = "id_regola"),
            inverseJoinColumns = @JoinColumn(name = "id_finestra")
    )
    public Set<PecRegolaFinestraTemporale> finestre;


    public static final int CATEGORIA_REGOLA_PEC_ENTRATA_MIN = 1;
    public final static int CATEGORIA_REGOLA_PEC_ENTRATA_MAX = 2;
    public final static int CATEGORIA_REGOLA_PEC_USCITA_MIN = 3;
    public final static int CATEGORIA_REGOLA_PEC_USCITA_MAX = 4;
    public boolean isError(long count) {
        return idCategoriaRegola == CATEGORIA_REGOLA_PEC_ENTRATA_MIN || idCategoriaRegola == CATEGORIA_REGOLA_PEC_USCITA_MIN ? count < threshold : count > threshold;
    }

    @Transient
    private long countToVerify;

    public String getErrorFullDescription() {
        String format = null;
        switch (idCategoriaRegola) {
            case CATEGORIA_REGOLA_PEC_ENTRATA_MIN :
                format = "Minimo numero di PEC in entrata per l'intervallo di tempo: %d PEC in entrata in %d minuti (limite imposto %d)";
                break;
            case CATEGORIA_REGOLA_PEC_ENTRATA_MAX :
                format = "Massimo numero di PEC in entrata per l'intervallo di tempo: %d PEC in entrata in %d minuti (limite imposto %d)";
                break;
            case CATEGORIA_REGOLA_PEC_USCITA_MIN :
                format = "Minimo numero di PEC in uscita per l'intervallo di tempo: %d PEC in entrata in %d minuti (limite imposto %d)";
                break;
            case CATEGORIA_REGOLA_PEC_USCITA_MAX :
                format = "Massimo numero di PEC in uscita per l'intervallo di tempo: %d PEC in entrata in %d minuti (limite imposto %d)";
                break;
            default:
                break;
        }
        return format != null ? String.format(format, countToVerify, durationMinutes, threshold) : "N.D.";
    }
}
