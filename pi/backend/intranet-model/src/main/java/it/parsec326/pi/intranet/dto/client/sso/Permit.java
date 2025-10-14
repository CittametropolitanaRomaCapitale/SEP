package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.client.sso.common.PermitType;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Permit {

   public Role role;

   public Date delegation_start;

   public Date delegation_end;

   public PermitType type;

   public String officeName;

   public Long office_id;



}
