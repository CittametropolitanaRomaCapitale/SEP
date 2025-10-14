package it.parsec326.pi.intranet.dto.ipa.json_mapper;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataResponseIpaAOO {
    @JsonProperty("domicilio_digitale")
    private String domicilioDigitale;

    @JsonProperty("tipo")
    private String tipo;

    @JsonProperty("data_pubblicazione")
    private String dataPubblicazione;

    @JsonProperty("cod_amm")
    private String codAmm;

    @JsonProperty("des_amm")
    private String desAmm;

    @JsonProperty("cod_aoo")
    private String codAoo;

    @JsonProperty("des_aoo")
    private String desAoo;

    @JsonProperty("regione")
    private String regione;

    @JsonProperty("provincia")
    private String provincia;

    @JsonProperty("comune")
    private String comune;

    @JsonProperty("cap")
    private String cap;

    @JsonProperty("indirizzo")
    private String indirizzo;

    @JsonProperty("tel")
    private String tel;

    @JsonProperty("fax")
    private String fax;

    @JsonProperty("mail1")
    private String mail1;

    @JsonProperty("mail2")
    private String mail2;

    @JsonProperty("mail3")
    private String mail3;

    @JsonProperty("nome_resp")
    private String nomeResp;

    @JsonProperty("cogn_resp")
    private String cognResp;

    @JsonProperty("mail_resp")
    private String mailResp;

    @JsonProperty("tel_resp")
    private String telResp;

}
