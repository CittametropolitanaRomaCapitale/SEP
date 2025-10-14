package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.ErrorContext;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Table(name = "LOG_EXCEPTION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity

@NamedQuery(
        name = "findByErrorContextAndTimestampRange",
        query = "SELECT le FROM LogException le WHERE le.errorContext = :errorContext AND le.tsCreation BETWEEN :startDate AND :endDate"
)
public class LogException extends PanacheCustomEntity{

    @Column(name = "ID_UTENTE")
    private String idUtente;

    @Column(name = "ERROR_MESSAGE")
    private String errorMessage;

    @Column(name = "ERROR_CODE")
    private String errorCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "ERROR_CONTEXT")
    private ErrorContext errorContext;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "TS_CREATION")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsCreation;

}
