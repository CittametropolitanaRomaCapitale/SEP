package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class PermitCheckerBean {


    public Long userId;
    public Long officeId;
    public Long roleId;



    public boolean permitCheck(Long userId, Long officeId, Long roleId){
        return this.userId.equals(userId) && this.officeId.equals(officeId) && this.roleId.equals(roleId);
    }

}
