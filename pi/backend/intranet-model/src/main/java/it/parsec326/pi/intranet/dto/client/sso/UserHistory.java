package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.parsec326.pi.intranet.dto.client.sso.common.PermitType;
import it.parsec326.pi.intranet.dto.client.sso.common.RecordState;
import it.parsec326.pi.intranet.dto.client.sso.common.RecordType;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserHistory {

   public Date delegation_start;

   public Date delegation_end;

   public PermitType type;

   public RecordState state;

   public RecordType record_type;

   public Date created_at;

}
