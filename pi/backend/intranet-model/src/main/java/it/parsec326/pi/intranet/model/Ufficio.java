package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NamedQuery(
        name = "findOfficeByCodeAndCdrCode",
        query = "SELECT u FROM Ufficio u WHERE u.cdr = :cdr AND u.cdrCode = :cdrCode"
)
@NamedQuery(
        name = "findOfficeByCdrCode",
        query = "SELECT u FROM Ufficio u WHERE u.cdrCode = :cdrCode"
)

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "UFFICIO")
@EqualsAndHashCode(callSuper = false)
public class Ufficio extends PanacheCustomEntity {

    @Column(name = "CDR", nullable = false)
    private String cdr;

    @Column(name = "CDR_CODE", nullable = false)
    private String cdrCode;

    @ManyToMany(mappedBy = "uffici")
    private List<PecPeo> pecPeoList;
}

