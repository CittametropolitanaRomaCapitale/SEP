package it.parsec326.pi.intranet.dto.ipa.json_mapper;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataResponseIpaUOInfo {

    @JsonProperty("cod_amm")
    private String codAmm;

    @JsonProperty("cod_uni_ou")
    private String codUniOu;

    @JsonProperty("cod_aoo")
    private String codAoo;

    @JsonProperty("des_ou")
    private String desOu;

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

    @JsonProperty("stato_canale")
    private String statoCanale;

    @JsonProperty("cf")
    private String cf;

    @JsonProperty("dt_verifica_cf")
    private String dtVerificaCf;

    @JsonProperty("dat_val_canale_trasm_sfe")
    private String datValCanaleTrasmSfe;

    @JsonProperty("stato_canale_nso")
    private String statoCanaleNso;

    @JsonProperty("cf_nso")
    private String cfNso;

    @JsonProperty("dt_verifica_cf_nso")
    private String dtVerificaCfNso;

    @JsonProperty("dat_val_canale_trasm_nso")
    private String datValCanaleTrasmNso;

}
