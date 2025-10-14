package it.cmrc.sso.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.cmrc.sso.entity.common.PanacheCustomEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Entity;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity(name = "office")
@NoArgsConstructor
@AllArgsConstructor
public class Office extends PanacheCustomEntity {

    public String name;

    public String code;

    public String description;
    
    public String short_description;

    public String service;

    public Long dirigente_user_id;

    public Date office_start_date;

    public Date office_end_date;

    @UpdateTimestamp
    public Date last_update;

    public boolean deleted;

    public boolean deleted_permanent;

    public boolean blocked;

    @JsonIgnore
    public User getDirigente(){
        if(dirigente_user_id == null)
            return null;
        return User.findById(dirigente_user_id);
    }

    public static Office findByCode(String code){
        return Office.find("code", code).firstResult();
    }

}
