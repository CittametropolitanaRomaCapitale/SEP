package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import java.util.List;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity(name = "application")
@NoArgsConstructor
@AllArgsConstructor
public class Application extends PanacheCustomEntity {

    public String name;

    public List<ApplicationRole> getApplicationRoles(){
        return ApplicationRole.find("application_id = :aid", Map.of("aid", id)).list();
    }

}
