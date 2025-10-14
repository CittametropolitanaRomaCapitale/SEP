package it.parsec326.pi.intranet.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "protocollo_numero")
@EqualsAndHashCode(callSuper=false)
public class ProtocolloNumero extends PanacheCustomEntity {

  @Column(name = "anno")
  public Integer anno;

  @Column(name = "count", nullable = false)
  public Long count;
}
