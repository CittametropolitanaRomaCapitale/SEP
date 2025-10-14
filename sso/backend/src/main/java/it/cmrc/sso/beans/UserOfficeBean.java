package it.cmrc.sso.beans;

import it.cmrc.sso.entity.*;
import it.cmrc.sso.entity.common.PermitType;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class UserOfficeBean {

    public Long user_id;

    public Long office_id;

    public boolean deleted;

    public Office office;

    public List<Permit> userOfficeRoles;

    public List<Permit> userOfficeDelegheInviate;

    public List<Role> roles;

    public List<Role> rolesNodeleg;


}
