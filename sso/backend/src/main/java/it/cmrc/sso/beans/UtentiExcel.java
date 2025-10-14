package it.cmrc.sso.beans;

import lombok.Data;

@Data
public class UtentiExcel {

    public String username;

    public String ncdr;

    public UtentiExcel(String username, String ncdr) {
        this.username = username;
        this.ncdr = ncdr;
    }
}
