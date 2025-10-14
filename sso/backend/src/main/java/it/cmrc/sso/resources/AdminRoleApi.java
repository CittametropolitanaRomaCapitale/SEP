package it.cmrc.sso.resources;

import it.cmrc.sso.beans.CreateAdminRoleBean;
import it.cmrc.sso.beans.CreateRoleBean;
import it.cmrc.sso.entity.*;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/api/admin_role")
@Slf4j
public class AdminRoleApi {

    @Inject
    RealmResource realmResource;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public AdminApplicationRole create_role(CreateAdminRoleBean createRoleBean) {

        Application application = Application.findById(createRoleBean.getApplicationId());

        AdminApplicationRole applicationRole = new AdminApplicationRole();
        applicationRole.application_id = application.id;
        applicationRole.role = createRoleBean.getRole();
        applicationRole.complete_role = application.name + "_" + createRoleBean.getRole();
        applicationRole.persistAndFlush();

        RealmResource realmResource = CDI.current().select(RealmResource.class).get();

        Optional<RoleRepresentation> role = realmResource.roles().list().stream().filter(r -> r.getName().equals(applicationRole.complete_role)).findFirst();
        if(role.isEmpty()) {
            RoleRepresentation roleRepresentation = new RoleRepresentation();
            roleRepresentation.setName(applicationRole.complete_role);
            realmResource.roles().create(roleRepresentation);
        }

        return applicationRole;
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public AdminApplicationRole delete_role(@PathParam("id") Long id) {
        AdminApplicationRole applicationRole = AdminApplicationRole.findById(id);
        applicationRole.delete();

        RealmResource realmResource = CDI.current().select(RealmResource.class).get();

        Optional<RoleRepresentation> role = realmResource.roles().list().stream().filter(r -> r.getName().equals(applicationRole.complete_role)).findFirst();
        role.ifPresent(roleRepresentation -> realmResource.rolesById().deleteRole(roleRepresentation.getId()));

        return applicationRole;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public AdminApplicationRole get_role(@PathParam("id") Long id) {
        return AdminApplicationRole.findById(id);
    }

    @GET
    @Path("/user/{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<AdminApplicationRole> get_application_role_of_user(@PathParam("user_id") Long userId, @QueryParam("application_id") Long applicationId) {
        User user = User.findById(userId);
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        UserResource userResource = realmResource.users().get(user.auth_id);
        String query = "complete_role in :roles";
        Map<String, Object> data = new HashMap<>();
        data.put("roles", userResource.roles().realmLevel().listAll().stream().map(RoleRepresentation::getName).collect(Collectors.toList()));
        if(applicationId != null) {
            query = query + " and application_id = :appId";
            data.put("appId", applicationId);
        }
        return AdminApplicationRole.find(query, data).list();
    }

    @GET
    @Path("/application/{application_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<AdminApplicationRole> get_application_role_of_application(@PathParam("application_id") Long application_id) {
        return AdminApplicationRole.find("application_id = :appId", Map.of("appId", application_id)).list();
    }

    @PUT
    @Path("/{role_id}/user/{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addRoleToUser(@PathParam("user_id") Long userId, @PathParam("role_id") Long roleId){
        User user = User.findById(userId);
        AdminApplicationRole role = AdminApplicationRole.findById(roleId);
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        UserResource userResource = realmResource.users().get(user.auth_id);
        userResource.roles().realmLevel().add(realmResource.roles().list().stream().filter(r -> r.getName().equalsIgnoreCase(role.complete_role)).collect(Collectors.toList()));
        return Response.ok().build();
    }

    @DELETE
    @Path("/{role_id}/user/{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeRoleToUser(@PathParam("user_id") Long userId, @PathParam("role_id") Long roleId){
        User user = User.findById(userId);
        AdminApplicationRole role = AdminApplicationRole.findById(roleId);
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        UserResource userResource = realmResource.users().get(user.auth_id);
        userResource.roles().realmLevel().remove(realmResource.roles().list().stream().filter(r -> r.getName().equalsIgnoreCase(role.complete_role)).collect(Collectors.toList()));
        return Response.ok().build();
    }

}

