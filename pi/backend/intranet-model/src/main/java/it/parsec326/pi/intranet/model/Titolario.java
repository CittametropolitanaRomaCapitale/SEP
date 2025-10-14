package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.TipologiaTitolario;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Table(name = "titolario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Builder
@NamedQuery(
        name = "getAllTitolarioTipologie",
        query = "SELECT DISTINCT t.tipologiaTitolario FROM Titolario t"
)
@NamedQuery(
        name = "getRootTipologie",
        query = "SELECT distinct t.tipologiaTitolario FROM Titolario t WHERE t.idPadre IS NULL"
)
@NamedQuery(
        name = "getRootTitolario",
        query = "SELECT t FROM Titolario t WHERE t.tipologiaTitolario IN (SELECT distinct t.tipologiaTitolario FROM Titolario t WHERE t.idPadre IS NULL)"
)

@NamedQuery(
        name = "getTipologieFiglieFromTipologia",
        query = "SELECT distinct t.tipologiaTitolario FROM Titolario t WHERE t.idPadre IN (SELECT t.id FROM Titolario t where lower(t.tipologiaTitolario) = lower(:tipologia))"
)
@NamedQuery(
        name = "getTitolarioFromTipologia",
        query = "SELECT t FROM Titolario t WHERE lower(t.tipologiaTitolario) = lower(:tipologia)"
)
@NamedQuery(
        name = "getTitolarioFromNome",
        query = "SELECT t FROM Titolario t WHERE t.nome = :nome AND t.leaf = TRUE"
)
@NamedQuery(
        name = "searchTitolarioByNome",
        query = "SELECT t FROM Titolario t " +
                "where lower(t.nome) like LOWER(concat('%', :nome, '%'))"
)

public class Titolario extends PanacheCustomEntity{

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPOLOGIA_TITOLARIO")
    private TipologiaTitolario tipologiaTitolario;

    @Column(name = "NOME")
    private String nome;

    @Column(name = "ID_PADRE")
    private Long idPadre;

    @Column(name = "IS_LEAF")
    private Boolean leaf;

    @Column(name = "TS_CREATION")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsCreation;

    @Column(name = "TS_UPDATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsUpdate;

    @Column(name = "TS_DELETED")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsDeleted;

    @Column(name = "TS_CHIUSURA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsChiusura;

    @Column(name = "ID_UTENTE_LAST_OPERATION")
    private String idUtenteLastOperation;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "ID_UTENTE_CREATORE")
    private String idUtenteCreatore;

    @Column(name = "NOME_UTENTE_CREATORE")
    private String nomeUtenteCreatore;

    @Column(name = "CDR")
    private String cdr;

    @Column(name = "CDR_CODE")
    private String cdrCode;

    @Column(name = "IS_FASCICOLO_DIPENDENTE")
    private Boolean isFascicoloDipendente;

    @OneToMany(mappedBy = "titolario")
    private List<PermessiFascicoloDipendente> permessiFascicoloDipendente;

    @Override
    public String toString() {
        return "Titolario{" +
                "tipologiaTitolario=" + tipologiaTitolario +
                ", nome='" + nome + '\'' +
                ", idPadre=" + idPadre +
                ", leaf=" + leaf +
                ", tsCreation=" + tsCreation +
                ", tsUpdate=" + tsUpdate +
                ", tsDeleted=" + tsDeleted +
                ", tsChiusura=" + tsChiusura +
                ", idUtenteLastOperation='" + idUtenteLastOperation + '\'' +
                ", note='" + note + '\'' +
                ", idUtenteCreatore='" + idUtenteCreatore + '\'' +
                ", nomeUtenteCreatore='" + nomeUtenteCreatore + '\'' +
                ", cdr='" + cdr + '\'' +
                ", cdrCode='" + cdrCode + '\'' +
                ", cdrCode='" + isFascicoloDipendente + '\'' +
                '}';
    }
}
