package it.cmrc.sso.beans;

import it.cmrc.sso.entity.UserOffice;
import lombok.Data;

import java.util.List;

@Data
public class UserBean {

    public String username;

    public String firstName;

    public String lastName;

    public String auth_id;

    public String email;

    public List<String> roles;

    public List<DelegationDTO> delegations;

    public List<DelegationDTO> delegationsSent;

    public List<UserOfficeBean> userOffices;

    public List<UserOfficeBean> storicUserOffices;

}
