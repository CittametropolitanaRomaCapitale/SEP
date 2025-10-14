package it.cmrc.sso.beans;

import lombok.Data;

import java.util.List;

@Data
public class UpdateDelegationDatesBean {

    public String delegation_start;

    public String delegation_end;

    public String note;

    public Long cdr_code;

    public Long applicationId;

}
