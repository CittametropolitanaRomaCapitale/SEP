package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.StatoProtocollo;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=false)
@Table(name = "referenti_protocollo")

@NamedQuery(
        name = "getReferentiByIdProtocollo",
        query = "SELECT rp FROM ReferentiProtocollo rp WHERE rp.idProtocollo = :idProtocollo AND rp.isAssegnato = true"
)
@NamedQuery(
        name = "getDestinatariInizialiByIdProtocollo",
        query = "SELECT rp FROM ReferentiProtocollo rp WHERE rp.idProtocollo = :idProtocollo AND rp.creationOption = true"
)
@NamedQuery(
        name = "getReferenteByIdProtocolloAndDestinatario",
        query = "SELECT rp FROM ReferentiProtocollo rp WHERE rp.idProtocollo = :idProtocollo AND rp.idDestinatario = :idDestinatario"
)
@NamedQuery(
        name = "updateStatoProtocollo",
        query = "UPDATE ReferentiProtocollo rp SET rp.statoProtocollo = :statoProtocollo, rp.tsStatoProtocollo = :tsStatoProtocollo WHERE rp.idProtocollo = :idProtocollo AND rp.idDestinatario = :idDestinatario"
)
@NamedQuery(
        name = "updateStatoProtocolloAnnullato",
        query = "UPDATE ReferentiProtocollo rp SET rp.statoProtocollo = 'Annullato', rp.tsStatoProtocollo = :tsStatoProtocollo, rp.isAssegnato = false WHERE rp.idProtocollo = :idProtocollo"
)
@NamedQuery(
        name = "updateReferenteAssegnatario",
        query = "UPDATE ReferentiProtocollo rp SET rp.idDestinatario = :idDestinatario, rp.tipoDestinatario = 'utente', rp.nomeDestinatario = :nomeDestinatario WHERE rp.idProtocollo = :idProtocollo AND rp.idDestinatario = :selectedOffice"
)

@NamedQuery(
        name = "updateIsAssegnatoFalse",
        query = "UPDATE ReferentiProtocollo rp SET rp.isAssegnato = false WHERE rp.id = :id"
)

@NamedQuery(
        name = "getReferentiProtocolloByIdProtocolloAndCdr",
        query = "SELECT rp FROM ReferentiProtocollo rp WHERE rp.idProtocollo = :idProtocollo AND rp.isAssegnato = true AND rp.idDestinatario = :selectedOffice"
)

public class ReferentiProtocollo extends PanacheCustomEntity {

  @Column(name = "id_protocollo")
  private Long idProtocollo;

  @Column(name = "id_mittente")
  private String idMittente;

  @Column(name = "nome_mittente")
  private String nomeMittente;

  @Column(name = "id_destinatario")
  private String idDestinatario;

  @Column(name = "nome_destinatario")
  private String nomeDestinatario;

  @Column(name = "attribuzione")
  private String attribuzione;

  @Column(name = "assegnato")
  private boolean isAssegnato;

  @Column(name = "tipo_destinatario")
  private String tipoDestinatario;

  @Column(name = "ts_creation")
  @Temporal(TemporalType.TIMESTAMP)
  private Date tsCreation;

  @Column(name = "ts_start_vali")
  @Temporal(TemporalType.TIMESTAMP)
  private Date tsStartVali;

  @Enumerated(EnumType.STRING)
  @Column(name = "stato_protocollo")
  private StatoProtocollo statoProtocollo;

  @Column(name = "ts_stato_protocollo")
  @Temporal(TemporalType.TIMESTAMP)
  private Date tsStatoProtocollo;

  @Column(name = "creation_option")
  private boolean creationOption;

  @Column(name = "ufficio_lavorazione")
  private String ufficioLavorazione;

  @Column(name = "note_assegnazione")
  private String noteAssegnazione;

}
