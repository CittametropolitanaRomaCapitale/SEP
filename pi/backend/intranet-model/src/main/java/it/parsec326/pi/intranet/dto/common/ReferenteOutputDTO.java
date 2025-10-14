package it.parsec326.pi.intranet.dto.common;

import it.parsec326.pi.intranet.dto.ipa.IpaResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReferenteOutputDTO {
    private String id;
    private String idDestinatario;
    private String label;
    private String tipo;
    private String statoProtocollo;
    private String descrizione;

    private String ragioneSociale;
    private String nome;
    private String cognome;
    private String cfPiva;
    private String pec;
    private String email;
    private String citta;
    private String indirizzo;
    private String cap;
    private IpaResponseDTO ipaResponseDTO;
    private List<ReferenteOutputDTO> children;
}
