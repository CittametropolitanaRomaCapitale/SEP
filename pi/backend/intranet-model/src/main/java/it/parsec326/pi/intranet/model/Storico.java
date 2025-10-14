package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;

import java.util.Date;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "storico")
@EqualsAndHashCode(callSuper=false)
public class Storico extends PanacheCustomEntity {

  @Column(name = "id_utente")
  private String idUtente;

  @Column(name = "utente")
  private String utente;

  @Column(name = "operazione")
  private String operazione;

  @Column(name = "note")
  private String note;

  @CreationTimestamp
  @Column(name = "ts_creation")
  private Date tsCreation;

  @Column(name = "id_protocollo")
  private Long idProtocollo;

  @Column(name = "id_titolario")
  private Long idTitolario;

  @Column(name = "id_registro_giornaliero")
  private Long idRegistroGiornaliero;
}
