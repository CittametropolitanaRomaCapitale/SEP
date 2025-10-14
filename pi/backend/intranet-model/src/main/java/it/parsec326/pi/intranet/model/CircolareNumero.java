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
@Table(name = "circolare_numero")
@EqualsAndHashCode(callSuper=false)
public class CircolareNumero extends PanacheCustomEntity {

  @Column(name = "anno")
  public Integer anno;

  @Column(name = "count", nullable = false)
  public Long count;
}
