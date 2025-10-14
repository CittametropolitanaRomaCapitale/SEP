package it.cmrc.sso.resources;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.panache.common.Page;
import it.cmrc.sso.beans.PermitOutBean;
import it.cmrc.sso.entity.*;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.entity.common.RecordType;
import it.cmrc.sso.mapper.PermitMapper;
import it.cmrc.sso.util.SortInput;
import it.cmrc.sso.util.Util;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/api/user")
public class UserQueryApi {

    @Inject
    PermitMapper permitMapper;

    @GET
    @Path("/{user_id}/permissions")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getUserPermissions(@PathParam("user_id") Long userId, @QueryParam("applicationId") Long applicationId, @QueryParam("cdrs") final List<String> cdrs, @QueryParam("roleIds") final List<Long> roleIds, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("by") @DefaultValue("id") String by, @QueryParam("desc") @DefaultValue("false") boolean desc) {

        List<Permit> permits;

        if(roleIds != null && !roleIds.isEmpty()){
            permits = Permit.find("user_id = :uid and type in ('PERSISTENT', 'TRANSIENT') and role_id in :rids",
                            SortInput.getSortOrDefault(by, desc),
                            Map.of("uid", userId, "rids", roleIds)).list();
            permits.addAll(Delegation.find(
                                    "(user_id = :uid or from_user_id = :uid) and delegation_end > :date",
                                    SortInput.getSortOrDefault(by, desc),
                                    Map.of("uid", userId, "date", new Date())
                            ).list().stream()
                            .map(d -> (Delegation)d)
                            .flatMap(d -> d.getPermits().stream())
                            .filter(p -> roleIds.contains(p.role_id))
                            .collect(Collectors.toList())
            );
        } else if(applicationId != null){
            Application application = Application.findById(applicationId);
            List<Long> roleIdsApp = application.getApplicationRoles().stream().map(ApplicationRole::getRole).map(r -> r.id).collect(Collectors.toList());
            permits = Permit.find("user_id = :uid and type in ('PERSISTENT', 'TRANSIENT') and role_id in :rids",
                    SortInput.getSortOrDefault(by, desc),
                    Map.of("uid", userId, "rids", roleIdsApp)).list();
            permits.addAll(Delegation.find(
                                    "(user_id = :uid or from_user_id = :uid) and delegation_end > :date",
                                    SortInput.getSortOrDefault(by, desc),
                                    Map.of("uid", userId, "date", new Date())
                            ).list().stream()
                            .map(d -> (Delegation)d)
                            .flatMap(d -> d.getPermits().stream())
                            .filter(p -> roleIdsApp.contains(p.role_id))
                            .collect(Collectors.toList())
            );
        } else {
            permits = Permit.find("user_id = :uid and type in ('PERSISTENT', 'TRANSIENT')",
                            SortInput.getSortOrDefault(by, desc),
                            Map.of("uid", userId)).list();
            permits.addAll(Delegation.find(
                        "(user_id = :uid or from_user_id = :uid) and delegation_end > :date",
                        SortInput.getSortOrDefault(by, desc),
                        Map.of("uid", userId, "date", new Date())
                    ).list().stream()
                    .map(d -> (Delegation)d)
                    .flatMap(d -> d.getPermits().stream())
                    .collect(Collectors.toList())
            );
        }

        if(cdrs != null && !cdrs.isEmpty()) {
            List<Permit> res = permits.stream().filter(p -> {
                Office office = Office.findById(p.office_id);
                return cdrs.contains(office.name);
            }).collect(Collectors.toList());
            return Map.of("data", res.stream().map(p -> permitMapper.toDTO(userId, p)).skip(size*page).limit(size).collect(Collectors.toList()),
                    "pages",
                    Util.getPagesCount(res.size(), size));
        } else {
            return Map.of("data",
                    permits.stream().map(p -> permitMapper.toDTO(userId, p)).skip(size*page).limit(size).collect(Collectors.toList()),
                    "pages",
                    Util.getPagesCount(permits.size(), size));
        }
    }

    @GET
    @Path("/{user_id}/permissions/pages")
    @Produces(MediaType.APPLICATION_JSON)
    public int getUserPermissionsPages(@PathParam("user_id") Long userId, @QueryParam("applicationId") Long applicationId, @QueryParam("cdrs") final List<String> cdrs, @QueryParam("roleIds") final List<Long> roleIds, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size) {
        List<Permit> permits;

        if(roleIds != null && !roleIds.isEmpty()){
            permits = Permit.find("user_id = :uid and type in ('PERSISTENT', 'TRANSIENT') and role_id in :rids",
                    Map.of("uid", userId, "rids", roleIds)).list();
        } else if(applicationId != null){
            Application application = Application.findById(applicationId);
            List<Long> roleIdsApp = application.getApplicationRoles().stream().map(ApplicationRole::getRole).map(r -> r.id).collect(Collectors.toList());
            permits = Permit.find("user_id = :uid and type in ('PERSISTENT', 'TRANSIENT') and role_id in :rids",
                    Map.of("uid", userId, "rids", roleIdsApp)).list();
        } else {
            permits = Permit.find("user_id = :uid and type in ('PERSISTENT', 'TRANSIENT')",
                    Map.of("uid", userId)).list();
        }

        if(cdrs != null && !cdrs.isEmpty()) {
            return Util.getPagesCount(permits.stream().filter(p -> {
                Office office = Office.findById(p.office_id);
                return cdrs.contains(office.code);
            }).count(), size);
        } else {
            return Util.getPagesCount(permits.size(), size);
        }
    }


    @GET
    @Path("/{user_id}/delegations_sent")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getUserDelegationsSent(@PathParam("user_id") Long userId, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("by") @DefaultValue("id") String by, @QueryParam("desc") @DefaultValue("false") boolean desc) {
        PanacheQuery<Delegation> query = Delegation.find(
                "from_user_id = :uid",
                SortInput.getSortOrDefault(by, desc),
                Map.of("uid", userId));
        return Map.of("data", query.page(Page.of(page, size)).list(), "pages", Util.getPagesCount(query.count(), size));
    }

    @GET
    @Path("/{user_id}/delegations_sent/pages")
    @Produces(MediaType.APPLICATION_JSON)
    public int getUserDelegationsSentPages(@PathParam("user_id") Long userId, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size) {
        return Util.getPagesCount(Delegation.count(
                "from_user_id = :uid",
                Map.of("uid", userId)
        ), size);
    }



    @GET
    @Path("/{user_id}/delegations")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getUserDelegations(@PathParam("user_id") Long userId, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("by") @DefaultValue("id") String by, @QueryParam("desc") @DefaultValue("false") boolean desc) {
        PanacheQuery<Delegation> query = Delegation.find(
                "user_id = :uid",
                SortInput.getSortOrDefault(by, desc),
                Map.of("uid", userId));
        return Map.of("data", query.page(Page.of(page, size)).list(), "pages", Util.getPagesCount(query.count(), size));
    }

    @GET
    @Path("/{user_id}/delegations/pages")
    @Produces(MediaType.APPLICATION_JSON)
    public int getUserDelegationsPages(@PathParam("user_id") Long userId, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size) {
        return Util.getPagesCount(Delegation.count(
                "user_id = :uid",
                Map.of("uid", userId)
        ), size);
    }


    @GET
    @Path("/{id}/offices")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getOfficeUsers(@PathParam("id") Long id, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("by") @DefaultValue("id") String by, @QueryParam("desc") @DefaultValue("false") boolean desc) {

        List<Long> offices = Office.find(":search = '' " +
                                "or lower(name) like LOWER(:search) " +
                                "or lower(description) like LOWER(:search) ",
                        Map.of("search", search.isBlank() ? "" : ("%" + search + "%"))).stream()
                .map(o -> (Office) o)
                .map(o -> o.id)
                .collect(Collectors.toList());

        PanacheQuery<UserOffice> query = UserOffice.find("office_id in :oids and user_id = :uid and deleted = false", SortInput.getSortOrDefault(by, desc), Map.of("oids", offices, "uid", id));

        return Map.of("data", query.page(Page.of(page, size)).list(), "pages", Util.getPagesCount(query.count(), size));
    }

    @GET
    @Path("/{id}/offices/pages")
    @Produces(MediaType.APPLICATION_JSON)
    public int getOfficeUsersPages(@PathParam("id") Long id, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size) {

        List<Long> offices = Office.find(":search = '' " +
                                "or lower(name) like LOWER(:search) " +
                                "or lower(description) like LOWER(:search) ",
                        Map.of("search", search.isBlank() ? "" : ("%" + search + "%"))).stream()
                .map(o -> (Office) o)
                .map(o -> o.id)
                .collect(Collectors.toList());

        return Util.getPagesCount(UserOffice.count("office_id in :oids and user_id = :uid", Map.of("oids", offices, "uid", id)), size);
    }

    @Inject
    JsonWebToken jwt;

    @POST
    @Path("/{id}/note")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public boolean setUserNote(@PathParam("id") Long id, @QueryParam("note")String note) {

        String userSourceId = jwt != null ? jwt.getClaim("sub") : null;

        User user = User.findById(id);
        if (user == null) {
            return false;
        }

        String oldNote = user.getNote();

        user.setNote(note);
        user.persistAndFlush();


        String noteHistory = "";
        if (userSourceId != null) {
            User userSource = (User)User.find("auth_id", userSourceId).firstResultOptional().orElse(null);
            if (userSource != null) {
                noteHistory += "L'utente " + userSource.getLastName() + " " + userSource.getFirstName() + " ha modificato le note. ";
            }
        }
        noteHistory += "Note precedenti: " + (oldNote == null || oldNote.isEmpty() ? "N.D." : oldNote);

        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.UPDATE_ROW;
        userHistory.user_id = id;
        userHistory.note = noteHistory;
        userHistory.persistAndFlush();

        return true;
    }

}
