package it.cmrc.sso.resources;

import io.sentry.protocol.App;
import it.cmrc.sso.beans.CreateRoleBean;
import it.cmrc.sso.entity.Application;
import it.cmrc.sso.entity.ApplicationRole;
import it.cmrc.sso.entity.Role;
import it.cmrc.sso.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.spi.CDI;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/api/role")
@Slf4j
public class RoleApi {

    @Inject
    RealmResource realmResource;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Role create_role(CreateRoleBean createRoleBean) {

        Application application = Application.findById(createRoleBean.getApplicationId());

        Role role = new Role();
        role.setName(createRoleBean.getName());
        role.setFull_name(application.getName() + "_" + createRoleBean.getName());
        role.setHierarchy_level(createRoleBean.getHierarchy_level());
        role.saveAndFlush();

        ApplicationRole applicationRole = new ApplicationRole();
        applicationRole.application_id = application.id;
        applicationRole.role_id = role.id;
        applicationRole.persistAndFlush();

        return role;
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Role update_role(@PathParam("id") Long id, int hierarchy_level) {
        Role role = Role.findById(id);
        role.setHierarchy_level(hierarchy_level);
        role.persistAndFlush();
        return role;
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Role delete_role(@PathParam("id") Long id) {
        ApplicationRole applicationRole = ApplicationRole.find("role_id = :rid", Map.of("rid", id)).firstResult();
        applicationRole.delete();
        Role role = Role.findById(id);
        role.delete();
        return role;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Role get_role(@PathParam("id") Long id) {
        return Role.findById(id);
    }


    @PUT
    @Path("/application/{application_id}/user/{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response switch_role_to_user(@PathParam("user_id") Long userId, @PathParam("application_id") Long applicationId, @QueryParam("anac") @DefaultValue("false") boolean anac, @QueryParam("gpp") @DefaultValue("false") boolean gpp) {
        Application application = Application.findById(applicationId);
        User user = User.findById(userId);
        String roleCompositeName = application.name + ((anac) ? "_anac" : "") + ((gpp) ? "_gpp" : "") + "_admin";
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        UserResource userResource = realmResource.users().get(user.auth_id);
        if(userResource.roles().realmLevel().listAll().stream().anyMatch(r -> r.getName().equalsIgnoreCase(roleCompositeName))) {
            userResource.roles().realmLevel().remove(realmResource.roles().list().stream().filter(r -> r.getName().equalsIgnoreCase(roleCompositeName)).collect(Collectors.toList()));
        } else {
            userResource.roles().realmLevel().add(realmResource.roles().list().stream().filter(r -> r.getName().equalsIgnoreCase(roleCompositeName)).collect(Collectors.toList()));
        }
        return Response.ok().build();
    }

    @GET
    @Path("/app/{application_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Role> get_role_for_application(@PathParam("application_id") Long applicationId) {
        Application application = Application.findById(applicationId);
        String appName = application.name;

        // Recupera la lista di ruoli con full_name che inizia per 'appName_'
        List<Role> roles = Role.find("full_name like (:appName)", Map.of("appName", (appName + "_%"))).list();
        return roles;
    }
}

