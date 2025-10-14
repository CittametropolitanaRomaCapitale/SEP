package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserOffice {

   public Office office;

   public List<Role> roles;

   public List<Role> rolesNodeleg;

   public List<Permit> userOfficeRoles;

}
