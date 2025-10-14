package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Table(name = "REGISTRO_GIORNALIERO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Builder
@Entity

@NamedQuery(
        name = "updateNoteAndUrn",
        query = "UPDATE RegistroGiornaliero rg SET rg.note = :note, rg.esitoVersamento = :esitoVersamento, rg.urn = :urn WHERE rg.id = :id"
)
public class RegistroGiornaliero extends PanacheCustomEntity{

    @Column(name = "FILE")
    private String file;

    @Column(name = "DATA_REGISTRO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataRegistro;

    @Column(name = "RIFERIMENTO_MINIO")
    private String riferimentoMinio;

    @Column(name = "TS_CREATION")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsCreation;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "URN")
    private String urn;

    @Column(name = "ESITO_VERSAMENTO")
    private String esitoVersamento;

    @Override
    public String toString() {
        return "RegistroGiornaliero{" +
                "file='" + file + '\'' +
                ", dataRegistro=" + dataRegistro +
                ", riferimentoMinio='" + riferimentoMinio + '\'' +
                ", tsCreation=" + tsCreation +
                ", note='" + note + '\'' +
                ", urn='" + urn + '\'' +
                ", esitoVersamento='" + esitoVersamento + '\'' +
                '}';
    }
}
