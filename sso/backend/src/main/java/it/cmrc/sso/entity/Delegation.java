package it.cmrc.sso.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.cmrc.sso.beans.OfficeDTO;
import it.cmrc.sso.entity.common.PanacheCustomEntity;
import it.cmrc.sso.entity.common.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Transient;
import java.util.Date;
import java.util.List;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Entity(name = "delegation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delegation extends PanacheCustomEntity {

    public String note;

    public Long user_id;

    public Long from_user_id;

    public Date delegation_start;

    public Date delegation_end;

    public Long cdrCode;

    public String cdr;

    public Long applicationId;

    public Attachment getAttachment(){
        return Attachment.find("delegation_id = :did", Map.of("did", id)).firstResult();
    }

    public List<Permit> getPermits(){
        return Permit.find("delegation_id = :did", Map.of("did", id)).list();
    }

    @JsonIgnore
    public User getUser(){
        return User.findById(user_id);
    }

    public String getUser_UserName(){
        User user = User.findById(user_id);
        return user.username;
    }

    @JsonIgnore
    public User getFromUser(){
        return User.findById(from_user_id);
    }

    public String getFromUser_UserName(){
        User user = User.findById(from_user_id);
        return user.username;
    }

    public UserDTO getFromUserData(){
        User user = User.findById(from_user_id);
        return new UserDTO(user.id, user.username, user.firstName, user.lastName, user.auth_id, user.email);
    }

    public Office getCDR_Object(){
        if(cdrCode != null)
            return Office.findById(cdrCode);
        else
            return null;
//        return new OfficeDTO(office.name, office.code, office.description, office.service, office.dirigente_user_id,
//                office.office_start_date, office.office_end_date, office.last_update, office.deleted, office.deleted_permanent, office.blocked);
    }

    public String getCDR_Name(){
        if(cdrCode != null){
            Office office = Office.findById(cdrCode);
            return office.name;
        } else
            return null;
    }

    public Application getApplication_Object(){
        return Application.findById(applicationId);
//        return new OfficeDTO(office.name, office.code, office.description, office.service, office.dirigente_user_id,
//                office.office_start_date, office.office_end_date, office.last_update, office.deleted, office.deleted_permanent, office.blocked);
    }

    public String getApplication_Name(){
        Application application = Application.findById(applicationId);
        return application.name;
    }
}
