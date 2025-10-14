package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RoleResource;
import org.keycloak.representations.idm.RoleRepresentation;

import javax.enterprise.inject.spi.CDI;
import javax.persistence.Entity;
import java.util.Optional;

@EqualsAndHashCode(callSuper = true)
@Entity(name = "role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role extends PanacheCustomEntity {

    public String name;

    public String full_name;

    public String keycloak_ref;

    public int hierarchy_level;


    public void save() {
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        RoleRepresentation roleRepresentation = new RoleRepresentation();
        roleRepresentation.setName(name);
        realmResource.roles().create(roleRepresentation);
        super.persist();
    }

    public void saveAndFlush() {
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();

        Optional<RoleRepresentation> role = realmResource.roles().list().stream().filter(r -> r.getName().equals(full_name)).findFirst();
        if(role.isEmpty()) {
            RoleRepresentation roleRepresentation = new RoleRepresentation();
            roleRepresentation.setName(full_name);
            realmResource.roles().create(roleRepresentation);
            keycloak_ref = realmResource.roles().list().stream().filter(r -> r.getName().equals(full_name)).findFirst().get().getId();
        } else {
            keycloak_ref = role.get().getId();
        }
        super.persistAndFlush();
    }

    @Override
    public void delete() {
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        realmResource.rolesById().deleteRole(keycloak_ref);
        super.delete();
    }
}
