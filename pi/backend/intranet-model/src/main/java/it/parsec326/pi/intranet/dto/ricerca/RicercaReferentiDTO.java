package it.parsec326.pi.intranet.dto.ricerca;

import it.parsec326.pi.intranet.dto.input.BaseSearchDTO;
import it.parsec326.pi.intranet.utils.common.TipologiaRubrica;
import lombok.*;

/*
NOTA:
    - l'annotazione equalsandhashcode deve rimanere e deve anche chiamare la classe base perché la classe è utilizzata come chiave per la cache delle risposte
    - il parametro noCache è escluso dal computo di equalsandhashcode perché così la chiave di cache rimane inalterata
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class RicercaReferentiDTO  extends BaseSearchDTO {
    private String tipoRicercaIPA;
    private String ipaCodAoo;
    private String ipaCodAmm;

    private boolean isRicercaINAD;
    @EqualsAndHashCode.Exclude private boolean noCache;
    private String tipoRegistrazione;
    private String metodoSpedizione;
    private boolean isMittente;

    private TipologiaRubrica tipologiaRubrica;
}
