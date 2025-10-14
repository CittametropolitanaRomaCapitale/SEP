package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import it.cmrc.sso.entity.common.PermitType;
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
@Entity(name = "user_history")
public class UserHistory extends PanacheCustomEntity {

    public Long father_permit_id;

    public String note;

    public Long permit_id;

    public String correlation;

    public Long user_id;

    public Long office_id;

    public Long role_id;

    public Date delegation_start;

    public Date delegation_end;

    @Enumerated(EnumType.STRING)
    public PermitType type;

    @Enumerated(EnumType.STRING)
    public RecordState state;

    @Enumerated(EnumType.STRING)
    public RecordType record_type;

    @CreationTimestamp
    public Date created_at;

    public Long cdr_code;

    public String cdr;

    public Long application_id;

    public String getUserName(){
        if(user_id == null)
            return null;
        return ((User)User.findById(user_id)).username;
    }

    public String getSentUserName(){
        if(father_permit_id == null)
            return null;
        Permit fatherPermit = Permit.findById(father_permit_id);
        if(fatherPermit == null)
            return "DELETED";
        return fatherPermit.getUser().username;
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

    public UserHistory(Long father_permit_id, String note, Long permit_id, String correlation, Long user_id, Long office_id, Long role_id, Date delegation_start, Date delegation_end, PermitType type, RecordState state, RecordType record_type, Date created_at) {
        this.father_permit_id = father_permit_id;
        this.note = note;
        this.permit_id = permit_id;
        this.correlation = correlation;
        this.user_id = user_id;
        this.office_id = office_id;
        this.role_id = role_id;
        this.delegation_start = delegation_start;
        this.delegation_end = delegation_end;
        this.type = type;
        this.state = state;
        this.record_type = record_type;
        this.created_at = created_at;
    }
}
