package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Delegation {

    public Date delegation_start;

    public Date delegation_end;

    public DatiUtenteSSO fromUserData;

    public List<Permit> permits;
}
