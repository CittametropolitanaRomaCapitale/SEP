package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import it.cmrc.sso.entity.common.RecordState;
import it.cmrc.sso.entity.common.RecordType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "office_history")
public class OfficeHistory extends PanacheCustomEntity {

    public Long old_office_id;

    public Long office_id;

    public Long user_id;

    public String correlation;

    @Enumerated(EnumType.STRING)
    public RecordState state;

    @Enumerated(EnumType.STRING)
    public RecordType record_type;

    @CreationTimestamp
    public Date created_at;


    public String getUserName(){
        if(user_id == null)
            return null;
        return ((User)User.findById(user_id)).username;
    }

    public String getOfficeName(){
        if(office_id == null)
            return null;
        return ((Office)Office.findById(office_id)).name;
    }

    public String getOfficeCode(){
        if(office_id == null)
            return null;
        return ((Office)Office.findById(office_id)).code;
    }

    public String getOldOfficeName(){
        if(old_office_id == null)
            return null;
        return ((Office)Office.findById(old_office_id)).name;
    }

    public String getOldOfficeCode(){
        if(old_office_id == null)
            return null;
        return ((Office)Office.findById(old_office_id)).code;
    }

}
