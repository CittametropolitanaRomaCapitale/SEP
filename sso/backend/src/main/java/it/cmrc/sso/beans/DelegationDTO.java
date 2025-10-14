package it.cmrc.sso.beans;

import it.cmrc.sso.entity.Attachment;
import it.cmrc.sso.entity.Permit;
import it.cmrc.sso.entity.User;
import it.cmrc.sso.entity.common.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DelegationDTO {

    public Long id;

    public String note;

    public Long user_id;

    public Long applicationId;
    public Long from_user_id;

    public Date delegation_start;

    public Date delegation_end;

    public Attachment getAttachment(){
        return Attachment.find("delegation_id = :did", Map.of("did", id)).firstResult();
    }

    public List<Permit> getPermits(){
        if(applicationId != null) {
            return Permit.find("delegation_id = :did and application_id = :aid", Map.of("did", id, "aid", applicationId)).list();
        } else {
            return Permit.find("delegation_id = :did", Map.of("did", id)).list();
        }
    }

    public String getFromUser_UserName(){
        User user = User.findById(from_user_id);
        return user.username;
    }

    public UserDTO getFromUserData(){
        User user = User.findById(from_user_id);
        return new UserDTO(user.id, user.username, user.firstName, user.lastName, user.auth_id, user.email);
    }
}
