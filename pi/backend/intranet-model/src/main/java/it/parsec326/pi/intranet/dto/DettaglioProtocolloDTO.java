package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.Tag;
import lombok.Data;

import java.util.List;

@Data
public class DettaglioProtocolloDTO {
  private Protocollo protocollo;
  private List<ReferenteOutputDTO> destinatariCompetenza;
  private List<ReferenteOutputDTO> destinatariConoscenza;
  private List<Tag> tagList;
  private List<TitolarioOutputDTO> titolario;
  private String statoProtocollo;
  private boolean isAssegna;
  private boolean isRifiuta;
  private boolean isAnnulla;
  private boolean isRichiestaAnnullamento;
  private boolean isGestioneAnnullamento;
  private boolean isProtocolAuthor;
  private boolean authorized;

  //true se il protocollo può essere preso in carico perché viene da una pec in entrata
  private boolean canPrendereInCaricoFromPec;

  //true se il protocollo può essere visualizzato perché viene da una pec in entrata
  private boolean canViewFromPec;
}
