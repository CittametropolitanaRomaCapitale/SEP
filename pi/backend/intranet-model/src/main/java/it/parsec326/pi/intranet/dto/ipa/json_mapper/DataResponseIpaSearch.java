package it.parsec326.pi.intranet.dto.ipa.json_mapper;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataResponseIpaSearch {

    @JsonProperty("cod_amm")
    private String codAmm;

    @JsonProperty("des_amm")
    private String descAmm;

    @JsonProperty("acronimo")
    private String acronimo;

}
