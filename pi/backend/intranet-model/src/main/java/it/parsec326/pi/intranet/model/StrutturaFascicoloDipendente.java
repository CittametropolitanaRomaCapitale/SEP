package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.TipologiaTitolario;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "struttura_fascicolo_dipendente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
public class StrutturaFascicoloDipendente extends PanacheCustomEntity{

    public static final String nomeSezioneDipendenti = "00 - DIPENDENTI";
    public static final String nomeSottosezioneExDipendenti = "EX-DIPENDENTI";
    public static final String nomeSottosezioneComandati = "COMANDATI";

    @Column(name = "NOME")
    private String nome;

    @Column(name = "ID_PADRE")
    private Long idPadre;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPOLOGIA")
    private TipologiaTitolario tipologia;

    @Column(name = "IS_LEAF")
    private Boolean leaf;

    @Override
    public String toString() {
        return "StrutturaFascicoloDipendente{" +
                "tipologia=" + tipologia +
                ", nome='" + nome + '\'' +
                ", idPadre=" + idPadre +
                ", leaf=" + leaf +
                '}';
    }
}
