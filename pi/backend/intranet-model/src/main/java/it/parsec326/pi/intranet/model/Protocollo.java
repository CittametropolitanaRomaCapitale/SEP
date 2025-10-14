package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.StatoProtocollo;
import it.parsec326.pi.intranet.utils.common.TipoDestinatarioReferente;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Table(name = "protocolli")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity

@NamedQuery(
        name = "findProtocolloByNumeroAndAnnoAndOggetto",
        query = "SELECT p FROM Protocollo p " +
                "WHERE p.nProtocollo = :numero " +
                "AND EXTRACT(YEAR FROM p.tsCreation) = :anno " +
                "AND p.oggetto LIKE :oggetto"
)
@NamedQuery(
        name = "findProtocolloByNumero",
        query = "SELECT p FROM Protocollo p " +
                "WHERE p.nProtocollo = :numero"
)
@NamedQuery(
            name = "findProtocolloByAnno",
        query = "SELECT p FROM Protocollo p " +
                "WHERE EXTRACT(YEAR FROM p.tsCreation) = :anno "
)
@NamedQuery(
        name = "findProtocolloByOggetto",
        query = "SELECT p FROM Protocollo p " +
                "WHERE p.oggetto LIKE :oggetto"
)
@NamedQuery(
        name = "findProtocolloByNumeroAndAnno",
        query = "SELECT p FROM Protocollo p " +
                "where p.nProtocollo like CONCAT('%', :numero, '%') OR :numero = '' " +
                "AND EXTRACT(YEAR FROM p.tsCreation) = :anno"
)
@NamedQuery(
        name = "findProtocolloByNumeroAndOggetto",
        query = "SELECT p FROM Protocollo p " +
                "WHERE p.nProtocollo = :numero " +
                "AND p.oggetto LIKE :oggetto"
)
@NamedQuery(
        name = "findProtocolloByAnnoAndOggetto",
        query = "SELECT p FROM Protocollo p " +
                "WHERE EXTRACT(YEAR FROM p.tsCreation) = :anno " +
                "AND p.oggetto LIKE :oggetto"
)
@NamedQuery(
        name = "findProtocolloCompletoById",
        query = "SELECT p FROM Protocollo p JOIN FETCH p.allegati WHERE p.id = :id"
)
@NamedQuery(
        name = "findProtocolliTitolariByRangeData",
        query = "SELECT p FROM Protocollo p JOIN ProtocolliClassificazione pc ON p.id = pc.protocollo.id " +
                "JOIN Titolario t ON pc.idTitolario = t.id " +
                "WHERE p.tsCreation >= :tsCreation_DA AND p.tsCreation < :tsCreation_A " +
                "AND p.tipoRegistrazione != 'Circolare'"
)
@NamedQuery(
        name = "findProtocolliByRangeData",
        query = "SELECT p FROM Protocollo p " +
                "WHERE p.tsCreation >= :tsCreation_DA AND p.tsCreation < :tsCreation_A " +
                "AND p.tipoRegistrazione != 'Circolare'"
)
@NamedQuery(
        name = "findProtocolliByVisibility",
        query = """
        SELECT p FROM Protocollo p
        WHERE p.id = :idProtocollo
        AND (
            NOT EXISTS (
                SELECT pc FROM ProtocolliClassificazione pc
                WHERE pc.protocollo.id = p.id
            )
            OR
            EXISTS (
                SELECT pc FROM ProtocolliClassificazione pc
                WHERE pc.protocollo.id = p.id
                AND pc.idTitolario IN :titolariAccessibili
            )
        )
        """
)


public class Protocollo extends PanacheCustomEntity {

    @Column(name = "N_PROTOCOLLO", unique = true)
    private String nProtocollo;

    @Column(name = "ID_MITTENTE")
    private String idMittente;

    @Column(name = "MITTENTE")
    private String mittente;

    @Column(name = "DESTINATARI")
    private String destinatari;

    @Column(name = "ASSEGNATARI")
    private String assegnatari;

    @Column(name = "ID_UTENTE")
    private String idUtente;

    @Column(name = "UTENTE")
    private String utente;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_REGISTRAZIONE")
    private TipoRegistrazione tipoRegistrazione;

    @Column(name = "OGGETTO")
    private String oggetto;

    @Column(name = "ID_UTENTE_LAST_OPERATION")
    private String idUtenteLastOperation;

    @Column(name = "TS_CREATION")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tsCreation;

    @Column(name = "TS_START_VALI")
    private Date tsStartVali;

    @Enumerated(EnumType.STRING)
    @Column(name = "METODO_SPEDIZIONE")
    private MetodoSpedizione metodoSpedizione;

    @Column(name = "PROTOCOLLO_MITTENTE")
    private String protocolloMittente;

    @Column(name = "DATA_PROTOCOLLO_MITTENTE")
    private Date dataProtocolloMittente;

    @Column(name = "NOTE")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false)
    private StatoProtocollo stato;

    @Column(name = "N_PROTOCOLLO_CIRCOLARE")
    private String nProtocolloCircolare;

    @Column(name = "INDIRIZZO_PEC_PEO")
    private String indirizzoPecPeo;

    @Column(name = "CORPO_PEC_PEO")
    private String corpoPecPeo;

    @Column(name = "invio_email_multiplo")
    private Integer invioEmailMultiplo;

    @Column(name = "cdr")
    private String cdr;

    @Column(name = "cdr_code")
    private String cdrCode;

    @Column(name = "n_protocollo_emergenza")
    private String nProtocolloEmergenza;

    @Column(name = "data_protocollo_emergenza")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataProtocolloEmergenza;

    @OneToMany
    @JoinColumn(name = "ID_PROTOCOLLO")
    private List<Allegato> allegati;

    @OneToMany
    @JoinColumn(name = "ID_PROTOCOLLO")
    private List<RaccomandataProtocollo> raccomandate;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROTOCOLLO")
    private List<ProtocolliClassificazione> protocolliClassificazioneList;

    @Override
    public String toString() {
        return "Protocollo{" +
                "id='" + id + '\'' +
                ", nProtocollo=" + nProtocollo + '\'' +
                ", idMittente=" + idMittente + '\'' +
                ", mittente=" + mittente + '\'' +
                ", destinatari=" + destinatari + '\'' +
                ", assegnatari=" + assegnatari + '\'' +
                ", idUtente=" + idUtente + '\'' +
                ", utente=" + utente + '\'' +
                ", tipoRegistrazione=" + tipoRegistrazione + '\'' +
                ", oggetto='" + oggetto + '\'' +
                ", idUtenteLastOperation=" + idUtenteLastOperation + '\'' +
                ", tsCreation=" + tsCreation + '\'' +
                ", tsStartVali=" + tsStartVali + '\'' +
                ", metodoSpedizione=" + metodoSpedizione + '\'' +
                ", protocolloMittente='" + protocolloMittente + '\'' +
                ", dataProtocolloMittente=" + dataProtocolloMittente + '\'' +
                ", note='" + note + '\'' +
                ", stato='" + stato + '\'' +
                ", allegati='" + allegati + '\'' +
                ", indirizzoPecPeo='" + indirizzoPecPeo + '\'' +
                ", corpoPecPeo='" + corpoPecPeo + '\'' +
                ", nProtocolloCircolare=" + nProtocolloCircolare +
                ", invioEmailMultiplo=" + invioEmailMultiplo +
                ", cdr=" + cdr +
                '}';
    }

    public Allegato getAllegatoByImpronta(String impronta) {
        for(Allegato allegato : allegati) {
            if (allegato.getImpronta().equals(impronta)) {
                return allegato;
            }
        }
        return null;
    }

    /**
     * Il metodo aggiunge un nuovo allegato, se ne trova uno con lo stesso ID, aggiorna soltanto collocazione telematica e oggetto
     *
     * @param allegato
     * @return true se aggiunge un nuovo allegato
     * false se l'allegato è stato aggiornato
     */
    public boolean addAllegato(Allegato allegato) {
        for (int i = 0; i < this.allegati.size(); i++) {
            Allegato a = this.allegati.get(i);
            if (Objects.equals(a.getId(), allegato.getId())) {
                a.setCollocazioneTelematica(allegato.getCollocazioneTelematica());
                a.setOggetto(allegato.getOggetto());
                return false;
            }
        }
        return this.allegati.add(allegato);
    }

    /**
     * Funzione che calcola lo stato del protocollo a partire da un protocollo e dalla lista degli assegnatari correnti
     * 1. richiesta di annullamento o annullato -> stato associato
     * 2. nessun assegnatario -> da assegnare
     * 3. se uno fra gli assegnatari non ha preso in carico -> in corso
     * 4. se tutti hanno preso in carico -> Preso in carico
     *
     * @param assegnatari
     * @return
     */
    public StatoProtocollo computeStatoProtocollo(List<ReferentiProtocollo> assegnatari, boolean isTag) {
        if (this.getStato() == StatoProtocollo.RichiestaDiAnnullamento || this.getStato() == StatoProtocollo.Annullato)
            return this.getStato();
        boolean isUscita = TipoRegistrazione.Uscita.toString().equalsIgnoreCase(this.getTipoRegistrazione().toString());

        boolean isAssegnatariEmpty = assegnatari == null || assegnatari.isEmpty();
        if((isTag || isUscita) && isAssegnatariEmpty)
            return StatoProtocollo.Completato;

        boolean isAllNotValid = isAssegnatariEmpty || assegnatari.stream()
                .allMatch( a -> !a.isAssegnato());

        if (isAllNotValid){
            return StatoProtocollo.DaAssegnare;
        }

        boolean allRifiutato = false;
        boolean allPresoInCarico = false;
        if (assegnatari != null) {

            boolean completely = assegnatari.stream()
                    .filter(ReferentiProtocollo::isAssegnato)
                    .allMatch(a -> StatoProtocollo.PresoInCarico.toString().equalsIgnoreCase(a.getStatoProtocollo().toString()) ||
                                                             StatoProtocollo.Rifiutato.toString().equalsIgnoreCase(a.getStatoProtocollo().toString()));
            if(completely)
                return StatoProtocollo.Completato;

            int numRifiutato = 0;
            int numPresoInCarico = 0;
            int sizeUtentiReferenti = 0;
            int sizeUfficiReferenti = 0;

            for (ReferentiProtocollo assegnatario : assegnatari) {
                if(!assegnatario.isAssegnato()){
                    if (assegnatario.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome()))
                        sizeUfficiReferenti += 1;
                    else
                        sizeUtentiReferenti += 1;

                    if (assegnatario.getStatoProtocollo() == StatoProtocollo.Rifiutato) {
                        numRifiutato += 1;
                    }
                    if (assegnatario.getStatoProtocollo() == StatoProtocollo.PresoInCarico) {
                        numPresoInCarico += 1;
                    }
                }
            }

            allRifiutato = sizeUfficiReferenti == 0 && sizeUtentiReferenti > 0 && sizeUtentiReferenti == numRifiutato;
            allPresoInCarico = sizeUfficiReferenti == 0 && sizeUtentiReferenti > 0 && sizeUtentiReferenti == numPresoInCarico;
        }

        if (allRifiutato || allPresoInCarico) return StatoProtocollo.Completato;
        return StatoProtocollo.InCorso;
    }

    public String getTsCreationFormatted() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        return dateFormat.format(tsCreation);
    }

    public String getNumeroProgressivoForSignature() {
        return nProtocollo.replaceAll("[^0-9]", "");
    }

    @Transactional
    public static Protocollo getProtocolloFromIdentificativoSignature(String nProtocolloSignature, String pad) {
        if (nProtocolloSignature == null || nProtocolloSignature.length() < 5) return null;
        String year = nProtocolloSignature.substring(0, 4);
        int number = Integer.parseInt(nProtocolloSignature.substring(4));
        String numberPadded = String.format("%"+pad+"d", number);

        return (Protocollo) Protocollo.find("nProtocollo = ?1", "CMRC-"+year+"-"+numberPadded).firstResultOptional().orElse(null);
    }

    public void removeDiscardedAllegati() {
        this.allegati = this.allegati.stream()
                .filter(allegato -> allegato.getDiscarded() != null && !allegato.getDiscarded())
                .collect(Collectors.toList());
    }
}