package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DatiUtenteDTO {

    public DatiUtenteSSO user_data;

    public List<UserHistory> history;

    public List<Office> storic_offices;
}
