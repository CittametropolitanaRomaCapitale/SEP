package it.parsec326.pi.intranet.dto.output;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnagraficaDTO {
    private Long id;
    private String ragioneSociale;
    private String nome;
    private String cognome;
    private String cfPiva;
    private String indirizzo;
    private String citta;
    private String cap;
    private String provincia;
    private String email;
    private String pec;
    private String telefono;
    private String fax;
    private String note;
    private Date tsCreation;
    private Date tsStartVali;
    private boolean cancellato;
    private boolean certificato;
    private String impronta;
    private String idIpaInad;
    private List<GruppoDTO> gruppi;
}
