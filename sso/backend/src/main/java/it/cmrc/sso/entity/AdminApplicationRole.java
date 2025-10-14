package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.Entity;
import java.util.Objects;

@Entity(name = "admin_application_role")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AdminApplicationRole extends PanacheCustomEntity {

    public Long application_id;

    public String role;

    public String complete_role;

    public Application getApplication(){
        return Application.findById(application_id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        AdminApplicationRole that = (AdminApplicationRole) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
