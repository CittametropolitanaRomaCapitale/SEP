package it.cmrc.sso.beans;

import it.cmrc.sso.entity.Permit;
import it.cmrc.sso.entity.Role;
import it.cmrc.sso.entity.common.PermitType;

public class PermitOutBean {

    public Long id;

    public Long father_permit_id;

    public Long delegation_id;

    public Long user_id;

    public Long office_id;

    public Long role_id;

    public PermitType type;

    public boolean sent;

    public Permit father;

    public String officeName;

    public Role role;

}
