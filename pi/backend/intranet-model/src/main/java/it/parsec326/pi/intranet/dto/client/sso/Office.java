package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.ToString;

@JsonIgnoreProperties(ignoreUnknown = true)
@ToString
public class Office {

   public String name;

   public String code;

   public String description;

   public String short_description;

   public String service;

}
