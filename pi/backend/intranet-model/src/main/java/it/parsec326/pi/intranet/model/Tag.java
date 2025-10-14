package it.parsec326.pi.intranet.model;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "TAG")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)

@ApplicationScoped
public class Tag extends PanacheCustomEntity {

    @Column(name = "NOME", nullable = false, unique = true)
    private String nome;

}
