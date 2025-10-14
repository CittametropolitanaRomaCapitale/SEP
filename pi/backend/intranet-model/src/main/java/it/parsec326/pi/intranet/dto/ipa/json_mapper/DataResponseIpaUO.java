package it.parsec326.pi.intranet.dto.ipa.json_mapper;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataResponseIpaUO {

    @JsonProperty("cod_amm")
    private String codAmm;

    @JsonProperty("stato_canale")
    private String statoCanale;

    @JsonProperty("cod_uni_ou")
    private String codUniOu;

    @JsonProperty("cod_aoo")
    private String codAoo;

    @JsonProperty("des_ou")
    private String desOu;

    @JsonProperty("cf")
    private String cf;

    @JsonProperty("dt_verifica_cf")
    private String dtVerificaCf;

    @JsonProperty("dat_val_canale_trasm_sfe")
    private String datValCanaleTrasmSfe;

}
