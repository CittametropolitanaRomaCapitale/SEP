package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.Objects;


@NamedQuery(
        name = "findAllAnagrafica",
        query = "select a from Anagrafica a WHERE a.id IN :id"
)

@NamedQuery(
        name = "findAnagraficaByRagioneSociale",
        query = "select a from Anagrafica a WHERE a.ragioneSociale = :ragioneSociale"
)
@NamedQuery(
        name = "deleteAllContattiNonCertificati",
        query = "update Anagrafica a set cancellato = true where a.certificato != true or a.certificato  is null"
)
@NamedQuery(
        name = "updateCancellatoById",
        query = "update Anagrafica a set a.cancellato = :cancellato where a.id = :id"
)

@Data
@Entity
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "anagrafica")
@EqualsAndHashCode(callSuper=false)
public class Anagrafica extends PanacheCustomEntity {

  @Column(name = "ragione_sociale")
  private String ragioneSociale;

  @Column(name = "nome")
  private String nome;

  @Column(name = "cognome")
  private String cognome;

  @Column(name = "cf_piva")
  private String cfPiva;

  @Column(name = "indirizzo")
  private String indirizzo;

  @Column(name = "citta")
  private String citta;

  @Column(name = "cap")
  private String cap;

  @Column(name = "provincia")
  private String provincia;

  @Column(name = "email")
  private String email;

  @Column(name = "pec")
  private String pec;

  @Column(name = "telefono")
  private String telefono;

  @Column(name = "fax")
  private String fax;

  @Column(name = "note")
  private String note;

  @CreationTimestamp
  @Column(name = "ts_creation")
  private Date tsCreation;

  @CreationTimestamp
  @Column(name = "ts_start_vali")
  private Date tsStartVali;

  @Column(name = "cancellato")
  private boolean cancellato;

  @Column(name = "certificato")
  private boolean certificato;

  @Column(name = "impronta")
  private String impronta;

  @Column(name = "id_ipa_inad")
  private String idIpaInad;

  @Getter
  @Transient
  private boolean dirty;


  //la funzione ritorna una pec oppure una peo se non esiste
  public String getPecToUseForRecipient() {
    return pec != null && !pec.isEmpty() ? pec : email;
  }


  public boolean isPersonaFisica() {
    if (nome == null || cognome == null || nome.isBlank() || cognome.isBlank())
      return false;
    return (cfPiva != null && (!cfPiva.isBlank()) && cfPiva.length() == 16);
  }

  public boolean isPersonaGiuridica() {
    if (ragioneSociale == null || ragioneSociale.isBlank())
      return false;
    return (cfPiva != null && (!cfPiva.isBlank()) && (cfPiva.length() == 11));
  }

  private String updateStringField(String thisField, String otherField, boolean isRequired) {
    if (isRequired && (otherField == null || otherField.isBlank())) {
      return thisField;
    }
    if ((thisField == null && otherField != null) || (otherField != null && !Objects.equals(thisField, otherField))) {
      dirty = true;
      return otherField;
    }
    return thisField;
  }

  public void updateFieldsIfNeeded(Anagrafica other) {
    dirty = false;
    this.setRagioneSociale(updateStringField(ragioneSociale, other.getRagioneSociale(),true));
    this.setNome(updateStringField(nome, other.getNome(),false));
    this.setCognome(updateStringField(cognome, other.getCognome(),false));
    this.setCfPiva(updateStringField(cfPiva, other.getCfPiva(),false));
    this.setIndirizzo(updateStringField(indirizzo, other.getIndirizzo(),false));
    this.setCitta(updateStringField(citta, other.getCitta(),false));
    this.setCap(updateStringField(cap, other.getCap(),false));
    this.setProvincia(updateStringField(provincia, other.getProvincia(),false));
    this.setEmail(updateStringField(email, other.getEmail(),false));
    this.setPec(updateStringField(pec, other.getPec(),false));
    this.setTelefono(updateStringField(telefono, other.getTelefono(),false));
    this.setFax(updateStringField(fax, other.getFax(),false));
    this.setNote(updateStringField(note, other.getNote(),false));
  }

  public static Anagrafica buildAnagraficaFromPec(String pec, String note) {
    AnagraficaBuilder builder = new AnagraficaBuilder();
    return builder
            .ragioneSociale(pec)
            .pec(pec)
            .cap("")
            .indirizzo("")
            .certificato(false)
            .cfPiva("")
            .citta("")
            .note(note)
            .build();
  }

  public static Anagrafica buildAnagraficaFromProtocolloEmergenza(String ragioneSociale, String note) {
    AnagraficaBuilder builder = new AnagraficaBuilder();
    return builder
            .ragioneSociale(ragioneSociale)
            .pec("")
            .cap("")
            .indirizzo("")
            .certificato(false)
            .cfPiva("")
            .citta("")
            .note(note)
            .build();
  }

}
