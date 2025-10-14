package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;

@EqualsAndHashCode(callSuper = true)
@Entity(name = "application_role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRole extends PanacheCustomEntity {

    public Long application_id;

    public Long role_id;

    public Role getRole(){
        return Role.findById(role_id);
    }
}
