package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Role {

   public String name;

   public String full_name;

   public int hierarchy_level;

}
