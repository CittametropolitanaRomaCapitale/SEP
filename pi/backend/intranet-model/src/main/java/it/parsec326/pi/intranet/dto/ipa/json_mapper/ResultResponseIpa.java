package it.parsec326.pi.intranet.dto.ipa.json_mapper;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ResultResponseIpa {
    @JsonProperty("cod_err")
    private int codErr;

    @JsonProperty("desc_err")
    private String descErr;

    @JsonProperty("num_items")
    private int numItems;
}
