package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DatiUtenteSSO {
    public String firstName;
    public String lastName;

    public String username;
    public String auth_id;

    public String email;
    public List<UserOffice> userOffices;
    public List<Delegation> delegations;


}
