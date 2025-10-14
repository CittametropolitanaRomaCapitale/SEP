package it.cmrc.sso.resources;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.cmrc.sso.beans.*;
import it.cmrc.sso.entity.*;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.entity.common.RecordState;
import it.cmrc.sso.entity.common.RecordType;
import it.cmrc.sso.mapper.OfficeMapper;
import it.cmrc.sso.service.OfficeApiService;
import it.cmrc.sso.util.SortInput;
import it.cmrc.sso.util.Util;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.common.util.Time;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/api/office")
@Slf4j
public class OfficeApi {

    @Inject
    RealmResource realmResource;

    @Inject
    OfficeMapper mapper;

    @Inject
    EntityManager em;

    @Inject
    OfficeApiService officeApiService;


    @GET
    @Path("/{application_id}/users/{cdr}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserDTO> getUsersByCDR(@PathParam("cdr") String cdr, @PathParam("application_id") Long appId, @QueryParam("nodeleg") @DefaultValue("false") Boolean nodeleg) {
        Office o = Office.find("code = :cdr", Sort.descending("id"), Map.of("cdr", cdr)).firstResult();
        List<Long> applicationRoles = ApplicationRole.find("application_id = :appId", Map.of("appId", appId)).list()
                .stream()
                .map(ar -> (ApplicationRole) ar)
                .map(ar -> ar.role_id)
                .collect(Collectors.toList());
        List<Role> roles = Role.find("name in :names and id in :ids", Map.of("ids", applicationRoles, "names", List.of("dirigente", "dirigenteentrata", "dirigentespesa1", "dirigentespesa2", "ragionieregenerale"))).list();
        String permitQuery = "type in (:t1, :t2) and office_id = :oid and role_id in :rs";
        if(nodeleg){
            permitQuery = "delegation_id is null and " + permitQuery;
        }
        List<Permit> permits = Permit.find(permitQuery, Map.of("t1", PermitType.PERSISTENT, "t2", PermitType.TRANSIENT, "oid", o.id, "rs", roles.stream().map(r -> r.id).collect(Collectors.toList()))).list();
        log.info("Delegation option is set to {} so query is : [ {} ]\n\npermit result are : {}", nodeleg, permitQuery, permits);
        List<User> users = User.find("id in :ids", Map.of("ids", permits.stream().map(p -> p.user_id).collect(Collectors.toList()))).list();
        List<UserDTO> userDTOList = new ArrayList<>();
        for(User user : users){
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(user.getUsername());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            List<UserOffice> offices = UserOffice.find("user_id = :uid and deleted = false", Map.of("uid", user.id)).list()
                    .stream()
                    .map(uo -> (UserOffice)uo)
                    .filter(uo -> !uo.getOfficeById().deleted_permanent && !uo.getOfficeById().blocked)
                    .collect(Collectors.toList());
            userDTO.setUserOffices(offices);
            userDTO.setRoles(user.getRoles());
            userDTOList.add(userDTO);
        }

        return userDTOList;

    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Office createOffice(OfficeInput officeInput) {

        Office office = mapper.toEntity(officeInput);
        office.office_start_date = new Date();
        office.persistAndFlush();

        OfficeHistory officeHistory = new OfficeHistory(null, office.id, null, null, null, RecordType.CREATE_OFFICE, new Date());
        officeHistory.persistAndFlush();

        if (officeInput.belonging_offices != null && officeInput.belonging_offices.size() > 0) {

            List<OfficeHistory> histories = new ArrayList<>();

            for (Long of : officeInput.belonging_offices) {
                histories.add(new OfficeHistory(of, office.id, null, null, RecordState.OTHER, RecordType.INHERIT, new Date()));
            }

            OfficeHistory.persist(histories);
        }

        return office;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/multi")
    @Transactional
    public Response createOffices(List<OfficeInput> officeInputs) {
        List<OfficeHistory> histories = new ArrayList<>();

        for (OfficeInput officeInput : officeInputs) {
            Office office = mapper.toEntity(officeInput);
            office.office_start_date = new Date();
            office.persistAndFlush();

            histories.add(new OfficeHistory(null, office.id, null, null, null, RecordType.CREATE_OFFICE, new Date()));

            if (officeInput.belonging_offices != null && officeInput.belonging_offices.size() > 0) {
                for (Long of : officeInput.belonging_offices) {
                    histories.add(new OfficeHistory(of, office.id, null, null, RecordState.OTHER, RecordType.INHERIT, new Date()));
                }
            }
        }

        OfficeHistory.persist(histories);

        return Response.ok().build();
    }

    @PUT
    @Path("/{office_id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Office updateOffice(@PathParam("office_id") Long officeId, OfficeInput officeInput) {

        Office office = Office.find("id = :oid and deleted = false and deleted_permanent = false", Map.of("oid", officeId)).firstResult();

        if (officeInput.belonging_offices != null) {

            OfficeHistory.delete("office_id = :oid and record_type = :type", Map.of("oid", office.id, "type", RecordType.INHERIT));

            if (officeInput.belonging_offices.size() > 0) {
                List<OfficeHistory> histories = new ArrayList<>();

                for (Long of : officeInput.belonging_offices) {
                    histories.add(new OfficeHistory(of, office.id, null, null, RecordState.OTHER, RecordType.INHERIT, new Date()));
                }

                OfficeHistory.persist(histories);
            }
        }

        office.nullAvoidUpdate(mapper.toEntity(officeInput));

        return office;
    }

    @POST
    @Path("/{office_id}/{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public UserOffice addUserToOffice(@PathParam("user_id") Long userId, @PathParam("office_id") Long office_id) {
        UserOffice userOffice = new UserOffice();
        userOffice.setOffice_id(office_id);
        userOffice.setUser_id(userId);
        userOffice.persistAndFlush();

        String uuid = UUID.randomUUID().toString();

        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.OFFICE;
        userHistory.correlation = uuid;
        userHistory.office_id = office_id;
        userHistory.user_id = userId;
        userHistory.state = RecordState.IN;
        userHistory.persistAndFlush();

        OfficeHistory officeHistory = new OfficeHistory();
        officeHistory.record_type = RecordType.OFFICE;
        officeHistory.correlation = uuid;
        officeHistory.office_id = office_id;
        officeHistory.user_id = userId;
        officeHistory.state = RecordState.IN;
        officeHistory.persistAndFlush();

        return userOffice;
    }

    @POST
    @Path("/{user_id}/offices")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addOfficesToUser(@PathParam("user_id") Long user_id, OfficeIdListBean officeIdListBean) {

        List<UserOffice> userOfficesToPersist = new ArrayList<>();
        List<UserHistory> userHistoriesToPersist = new ArrayList<>();
        List<OfficeHistory> officeHistoriesToPersist = new ArrayList<>();

        String uuid = UUID.randomUUID().toString();


        for (Long office_id : officeIdListBean.office_ids) {

            UserOffice actualUserOffice = UserOffice.find("office_id = ?1 and user_id = ?2", office_id, user_id).firstResult();
            if (actualUserOffice != null) {
                actualUserOffice.setDeleted(false);
                actualUserOffice.persistAndFlush();
            } else {
                UserOffice userOffice = new UserOffice();
                userOffice.setOffice_id(office_id);
                userOffice.setUser_id(user_id);
                userOfficesToPersist.add(userOffice);
            }

            UserHistory userHistory = new UserHistory();
            userHistory.record_type = RecordType.OFFICE;
            userHistory.correlation = uuid;
            userHistory.office_id = office_id;
            userHistory.user_id = user_id;
            userHistory.state = RecordState.IN;
            userHistoriesToPersist.add(userHistory);

            OfficeHistory officeHistory = new OfficeHistory();
            officeHistory.record_type = RecordType.OFFICE;
            officeHistory.correlation = uuid;
            officeHistory.office_id = office_id;
            officeHistory.user_id = user_id;
            officeHistory.state = RecordState.IN;
            officeHistoriesToPersist.add(officeHistory);
        }

        UserOffice.persist(userOfficesToPersist);
        UserHistory.persist(userHistoriesToPersist);
        OfficeHistory.persist(officeHistoriesToPersist);

        return Response.ok().build();
    }

    @POST
    @Path("/{office_id}/users")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addUserToOffice(@PathParam("office_id") Long office_id, UserIdListBean userIdListBean) {

        List<UserOffice> userOfficesToPersist = new ArrayList<>();
        List<UserHistory> userHistoriesToPersist = new ArrayList<>();
        List<OfficeHistory> officeHistoriesToPersist = new ArrayList<>();

        String uuid = UUID.randomUUID().toString();


        for (Long userId : userIdListBean.user_ids) {

            UserOffice userOffice = new UserOffice();
            userOffice.setOffice_id(office_id);
            userOffice.setUser_id(userId);
            userOfficesToPersist.add(userOffice);

            UserHistory userHistory = new UserHistory();
            userHistory.record_type = RecordType.OFFICE;
            userHistory.correlation = uuid;
            userHistory.office_id = office_id;
            userHistory.user_id = userId;
            userHistory.state = RecordState.IN;
            userHistoriesToPersist.add(userHistory);

            OfficeHistory officeHistory = new OfficeHistory();
            officeHistory.record_type = RecordType.OFFICE;
            officeHistory.correlation = uuid;
            officeHistory.office_id = office_id;
            officeHistory.user_id = userId;
            officeHistory.state = RecordState.IN;
            officeHistoriesToPersist.add(officeHistory);
        }

        UserOffice.persist(userOfficesToPersist);
        UserHistory.persist(userHistoriesToPersist);
        OfficeHistory.persist(officeHistoriesToPersist);

        return Response.ok().build();
    }

    @DELETE
    @Path("/{office_id}/{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public UserOffice removeUserFromOffice(@PathParam("user_id") Long userId, @PathParam("office_id") Long officeId, RemoveUserFromOfficeInput input) {
        UserOffice userOffice = UserOffice.find("user_id = :uid and office_id = :oid and deleted = false", Map.of("uid", userId, "oid", officeId)).firstResult();

        if (input.deletePermits) {
            Permit.removePermitFromKeycloak(userOffice.getUserOfficeRoles());
            Permit.delete("id in :ids", Map.of("ids", userOffice.getUserOfficeRoles().stream().map(p -> p.id).collect(Collectors.toList())));
        }

        userOffice.deleted = true;
        userOffice.persistAndFlush();

        String uuid = UUID.randomUUID().toString();


        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.OFFICE;
        userHistory.correlation = uuid;
        userHistory.office_id = officeId;
        userHistory.user_id = userId;
        userHistory.state = RecordState.OUT;
        userHistory.persistAndFlush();

        OfficeHistory officeHistory = new OfficeHistory();
        officeHistory.record_type = RecordType.OFFICE;
        officeHistory.correlation = uuid;
        officeHistory.office_id = officeId;
        officeHistory.user_id = userId;
        officeHistory.state = RecordState.OUT;
        officeHistory.persistAndFlush();

        return userOffice;
    }

    @DELETE
    @Path("/{office_id}/users")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeUsersFromOffice(@PathParam("office_id") Long officeId, UserIdListBean userIdListBean) {
        List<UserOffice> userOffices = UserOffice.find("user_id in :uid and office_id = :oid", Map.of("uid", userIdListBean.user_ids, "oid", officeId)).list()
                .stream()
                .map(uo -> (UserOffice) uo)
                .peek(uo -> uo.deleted = true)
                .collect(Collectors.toList());

        if (userIdListBean.deletePermits) {
            Permit.removePermitFromKeycloak(userOffices.stream().flatMap(uo -> uo.getUserOfficeRoles().stream()).collect(Collectors.toList()));
            Permit.delete("id in :ids", Map.of("ids", userOffices.stream().flatMap(uo -> uo.getUserOfficeRoles().stream()).map(p -> p.id).collect(Collectors.toList())));
        }

        UserOffice.persist(userOffices);

        String uuid = UUID.randomUUID().toString();

        for (UserOffice uo : userOffices) {

            UserHistory userHistory = new UserHistory();
            userHistory.record_type = RecordType.OFFICE;
            userHistory.correlation = uuid;
            userHistory.office_id = officeId;
            userHistory.user_id = uo.user_id;
            userHistory.state = RecordState.OUT;
            userHistory.persistAndFlush();

            OfficeHistory officeHistory = new OfficeHistory();
            officeHistory.record_type = RecordType.OFFICE;
            officeHistory.correlation = uuid;
            officeHistory.office_id = officeId;
            officeHistory.user_id = uo.user_id;
            officeHistory.state = RecordState.OUT;
            officeHistory.persistAndFlush();
        }

        return Response.ok().build();
    }

    @DELETE
    @Path("/{office_id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Office deleteOffice(@PathParam("office_id") Long officeId) {

        Office office = Office.find("id = :oid and deleted = false", Map.of("oid", officeId)).firstResult();
        if (office == null) {
            throw new NotFoundException("The office doesn't exist");
        }
        OfficeHistory officeHistory = new OfficeHistory();
        officeHistory.record_type = RecordType.DELETE_OFFICE;
        officeHistory.office_id = officeId;
        officeHistory.persist();

        office.deleted = true;
        office.office_end_date = new Date();
        office.persist();

        return office;
    }

    @PUT
    @Path("/open/{office_id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Office reopenOffice(@PathParam("office_id") Long officeId) {

        Office office = Office.find("id = :oid and deleted = true and deleted_permanent = false", Map.of("oid", officeId)).firstResult();
        if (office == null) {
            throw new NotFoundException("The office doesn't exist");
        }
        OfficeHistory officeHistory = new OfficeHistory();
        officeHistory.record_type = RecordType.REOPEN_OFFICE;
        officeHistory.office_id = officeId;
        officeHistory.persist();

        office.deleted = false;
        office.office_end_date = null;
        office.persist();

        return office;
    }


    @DELETE
    @Path("/delete/{office_id}/permanent")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Office deletePermanentOffice(@PathParam("office_id") Long officeId) {

        Office office = Office.find("id = :oid", Map.of("oid", officeId)).firstResult();
        if (office == null) {
            throw new NotFoundException("The office doesn't exist");
        }
        OfficeHistory officeHistory = new OfficeHistory();
        officeHistory.record_type = RecordType.PERMANENT_DELETE_OFFICE;
        officeHistory.office_id = officeId;
        officeHistory.persist();

        office.deleted = true;
        office.deleted_permanent = true;
        office.persist();

        return office;
    }


    @PUT
    @Path("/{office_id}/split")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response splitOffice(@PathParam("office_id") Long officeId, MoveUsersToOfficeInput data) {

        Office office = Office.find("id = :oid and deleted = false", Map.of("oid", officeId)).firstResult();
        if (office == null) {
            throw new NotFoundException("The office doesn't exist");
        }

        List<Long> users = data.userUpdates.stream()
                .map(UserOffices::getUserId)
                .collect(Collectors.toList());


        if (users.stream()
                .flatMap(u -> Delegation.find("from_user_id = :uid and delegation_end > :date", Map.of("uid", u, "date", new Date())).stream())
                .map(d -> (Delegation) d)
                .flatMap(d -> d.getPermits().stream())
                .anyMatch(p -> p.office_id.equals(officeId))) {
            return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("error", "Active delegations are present for users to move")).build();
        } else {

            Set<Long> expiredDels = users.stream()
                    .flatMap(u -> Delegation.find("from_user_id = :uid and delegation_end < :date", Map.of("uid", u, "date", new Date())).stream())
                    .map(d -> (Delegation) d)
                    .flatMap(d -> d.getPermits().stream())
                    .filter(p -> p.office_id.equals(officeId))
                    .map(p -> p.delegation_id)
                    .collect(Collectors.toSet());

            if (expiredDels.size() > 0) {

                List<Permit> delsToDelete = Permit.find("delegation_id in :dids", Map.of("dids", expiredDels)).list();

                if (delsToDelete.size() > 0) {
                    Permit.removePermitFromKeycloak(delsToDelete);
                    Permit.delete("id in :pids", Map.of("pids", delsToDelete.stream().map(p -> p.id).collect(Collectors.toList())));
                    Delegation.delete("id in :dids", Map.of("dids", expiredDels));
                }
            }
        }

        for (UserOffices entry : data.userUpdates) {
            if (data.deleteOffice) {
                UserOffice userOffice = UserOffice.find("user_id = :uid and office_id = :oid", Map.of("uid", entry.userId, "oid", officeId)).firstResult();
                userOffice.deleted = true;
                userOffice.persistAndFlush();
            }
            List<Permit> permitToDuplicate = Permit.find("user_id = :uid and office_id = :oid", Map.of("uid", entry.getUserId(), "oid", officeId)).list();
            List<Permit> permitToSave = new ArrayList<>();
            Map<Long, UserOffice> newUserOffices = new HashMap<>();
            List<UserHistory> newUserOHistory = new ArrayList<>();
            List<OfficeHistory> newOfficeUHistory = new ArrayList<>();

            User user = User.findById(entry.userId);
            List<Long> regOffices = user.getUserOffices().stream().map(UserOffice::getOffice_id).collect(Collectors.toList());

            List<PermitCheckerBean> livingPermits = Permit.find("user_id = :uid and office_id in :oids", Map.of("uid", entry.userId, "oids", entry.getOffices())).list()
                    .stream()
                    .map(p -> (Permit) p)
                    .map(p -> new PermitCheckerBean(p.user_id, p.office_id, p.role_id))
                    .collect(Collectors.toList());

            String uuid = UUID.randomUUID().toString();

            for (Permit p : permitToDuplicate) {
                for (Long noid : entry.getOffices()) {
                    if (livingPermits.stream().noneMatch(lp -> lp.permitCheck(p.user_id, p.office_id, p.role_id))) {
                        Permit pp = new Permit();
                        pp.localNullNullAvoidCopy(p, List.of("id"));
                        pp.office_id = noid;
                        permitToSave.add(pp);
                    }
                    //Checking if the userOffice isn't already been created for another permit or in past
                    if (!newUserOffices.containsKey(noid) && !regOffices.contains(noid)) {
                        newUserOffices.put(noid, new UserOffice(p.user_id, noid, false));
                        newUserOHistory.add(new UserHistory(null, null, null, uuid, p.user_id, noid, null, null, null, null, RecordState.IN, RecordType.OFFICE, new Date()));
                        newOfficeUHistory.add(new OfficeHistory(null, noid, p.user_id, uuid, RecordState.IN, RecordType.OFFICE, new Date()));
                    }
                }
            }

            if (permitToSave.size() > 0) {
                Permit.persist(permitToSave);
                Permit.flush();
                Permit.addPermitsToRealm(permitToSave);
            }

            if (newUserOffices.size() > 0) {
                UserOffice.persist(newUserOffices.values());
                UserHistory.persist(newUserOHistory);
                OfficeHistory.persist(newOfficeUHistory);
            }

            if (data.deleteOffice) {
                for (Permit pd : permitToDuplicate) {
                    pd.delete();
                }
            }
        }

//        if (data.deleteOffice) {
//            OfficeHistory officeHistory = new OfficeHistory();
//            officeHistory.record_type = RecordType.DELETE_OFFICE;
//            officeHistory.office_id = officeId;
//            officeHistory.persist();
//
//            office.deleted = true;
//            office.office_end_date = new Date();
//            office.persist();
//        }

        return Response.ok(office).build();
    }

    @PUT
    @Path("/merge")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response mergeOffice(List<OfficeUserUpdates> data) {

        for (OfficeUserUpdates ofu : data) {

            Office office = Office.find("id = :oid and deleted = false", Map.of("oid", ofu.officeId)).firstResult();
            if (office == null) {
                log.warn("Office input {} in merge has not been found, skipping!", ofu.officeId);
                continue;
            }

            List<Long> users = ofu.getUserOffices().stream()
                    .map(UserOffices::getUserId)
                    .collect(Collectors.toList());

            if (users.stream()
                    .flatMap(u -> Delegation.find("from_user_id = :uid and delegation_end > :date", Map.of("uid", u, "date", new Date())).stream())
                    .map(d -> (Delegation) d)
                    .flatMap(d -> d.getPermits().stream())
                    .anyMatch(p -> p.office_id.equals(ofu.officeId))) {
                return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("error", "Active delegations are present for users to move")).build();
            } else {

                Set<Long> expiredDels = users.stream()
                        .flatMap(u -> Delegation.find("from_user_id = :uid and delegation_end < :date", Map.of("uid", u, "date", new Date())).stream())
                        .map(d -> (Delegation) d)
                        .flatMap(d -> d.getPermits().stream())
                        .filter(p -> p.office_id.equals(ofu.officeId))
                        .map(p -> p.delegation_id)
                        .collect(Collectors.toSet());

                if (expiredDels.size() > 0) {

                    List<Permit> delsToDelete = Permit.find("delegation_id in :dids", Map.of("dids", expiredDels)).list();

                    if (delsToDelete.size() > 0) {
                        Permit.removePermitFromKeycloak(delsToDelete);
                        Permit.delete("id in :pids", Map.of("pids", delsToDelete.stream().map(p -> p.id).collect(Collectors.toList())));
                        Delegation.delete("id in :dids", Map.of("dids", expiredDels));
                    }
                }
            }

            Set<Permit> permitToDelete = new HashSet<>();

            for (UserOffices entry : ofu.getUserOffices()) {

                if (ofu.deleteOffice) {
                    UserOffice userOffice = UserOffice.find("user_id = :uid and office_id = :oid", Map.of("uid", entry.userId, "oid", ofu.officeId)).firstResult();
                    userOffice.deleted = true;
                    userOffice.persistAndFlush();
                }

                List<Permit> permitToDuplicate = Permit.find("user_id = :uid and office_id = :oid", Map.of("uid", entry.getUserId(), "oid", ofu.officeId)).list();
                permitToDelete.addAll(permitToDuplicate);
                List<Permit> permitToSave = new ArrayList<>();
                Map<Long, UserOffice> newUserOffices = new HashMap<>();
                List<UserHistory> newUserOHistory = new ArrayList<>();
                List<OfficeHistory> newOfficeUHistory = new ArrayList<>();

                User user = User.findById(entry.userId);
                List<Long> regOffices = user.getUserOffices().stream().map(UserOffice::getOffice_id).collect(Collectors.toList());

                List<PermitCheckerBean> livingPermits = Permit.find("user_id = :uid and office_id in :oids", Map.of("uid", entry.userId, "oids", entry.getOffices())).list()
                        .stream()
                        .map(p -> (Permit) p)
                        .map(p -> new PermitCheckerBean(p.user_id, p.office_id, p.role_id))
                        .collect(Collectors.toList());

                String uuid = UUID.randomUUID().toString();

                for (Permit p : permitToDuplicate) {
                    for (Long noid : entry.getOffices()) {
                        if (livingPermits.stream().noneMatch(lp -> lp.permitCheck(p.user_id, p.office_id, p.role_id))) {
                            Permit pp = new Permit();
                            pp.localNullNullAvoidCopy(p, List.of("id"));
                            pp.office_id = noid;
                            permitToSave.add(pp);
                        }
                        //Checking if the userOffice isn't already been created for another permit or in past
                        if (!newUserOffices.containsKey(noid) && !regOffices.contains(noid)) {
                            newUserOffices.put(noid, new UserOffice(p.user_id, noid, false));
                            newUserOHistory.add(new UserHistory(null, null, null, uuid, p.user_id, noid, null, null, null, null, RecordState.IN, RecordType.OFFICE, new Date()));
                            newOfficeUHistory.add(new OfficeHistory(null, noid, p.user_id, uuid, RecordState.IN, RecordType.OFFICE, new Date()));
                        }
                    }
                }

                if (permitToSave.size() > 0) {
                    Permit.persist(permitToSave);
                    Permit.flush();
                    Permit.addPermitsToRealm(permitToSave);
                }

                if (newUserOffices.size() > 0) {
                    UserOffice.persist(newUserOffices.values());
                    UserHistory.persist(newUserOHistory);
                    OfficeHistory.persist(newOfficeUHistory);
                }
            }

            if (ofu.deleteOffice) {

//                OfficeHistory officeHistory = new OfficeHistory();
//                officeHistory.record_type = RecordType.DELETE_OFFICE;
//                officeHistory.office_id = ofu.officeId;
//                officeHistory.persist();
//
//                office.deleted = true;
//                office.office_end_date = new Date();
//                office.persist();

                for (Permit pd : permitToDelete) {
                    pd.delete();
                }
            }
        }
        return Response.ok().build();
    }

    @GET
    @Path("/{cdr_code}/related_offices")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Office> getRelatedOffice(@PathParam("cdr_code") String cdr) {
        Office office = Office.find("code = :cdr", Map.of("cdr", cdr)).firstResult();
        if (office == null) {
            return new ArrayList<>();
        }

        String recursiveQueryForStoricOffices = "WITH RECURSIVE office_hierarchy_query AS ( " +
                "select e.old_office_id from office_history e where e.office_id = :userOfficeId AND e.record_type = 'INHERIT' " +
                "UNION ALL " +
                "select e.old_office_id from office_history e INNER JOIN office_hierarchy_query c ON e.office_id = c.old_office_id " +
                "where e.record_type = 'INHERIT' " +
                ") Select old_office_id from office_hierarchy_query ";

        List<BigInteger> officeHistoryIds = em.createNativeQuery(recursiveQueryForStoricOffices)
                .setParameter("userOfficeId", office.id)
                .getResultList();
        if (officeHistoryIds == null || officeHistoryIds.isEmpty()) {
            return new ArrayList<>();
        }

        Long[] ids = new Long[officeHistoryIds.size()];
        for(int i=0;i<officeHistoryIds.size();i++) {
            ids[i] = officeHistoryIds.get(i).longValue();
        }

        return em.createQuery("select o from office o where id in :ids", Office.class)
                .setParameter("ids", List.of(ids))
                .getResultList();


        //List<OfficeHistory> hists = OfficeHistory.find("office_id = :oid and record_type = :type", Map.of("oid", office.id, "type", RecordType.INHERIT)).list();
        //if (hists == null || hists.isEmpty()) {
        //    return new ArrayList<>();
        //}
        //return Office.find("id in :ids", Map.of("ids", hists.stream().map(OfficeHistory::getOld_office_id).collect(Collectors.toList()))).list();
    }

    @GET
    @Path("/{cdr_code}/new_offices")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Office> getNewOffices(@PathParam("cdr_code") String cdr) {
        Office office = Office.find("code = :cdr", Map.of("cdr", cdr)).firstResult();
        if (office == null) {
            return new ArrayList<>();
        }
        List<OfficeHistory> hists = OfficeHistory.find("old_office_id = :oid and record_type = :type", Map.of("oid", office.id, "type", RecordType.INHERIT)).list();
        if (hists == null || hists.isEmpty()) {
            return new ArrayList<>();
        }
        return Office.find("id in :ids", Map.of("ids", hists.stream().map(OfficeHistory::getOffice_id).collect(Collectors.toList()))).list();
    }


    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Office getOffice(@PathParam("id") Long id) {
        return Office.findById(id);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getOffices(@QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("by") @DefaultValue("id") String by, @QueryParam("desc") @DefaultValue("false") boolean desc) {
        PanacheQuery<Office> query = Office.find("deleted_permanent = false and (:search = '' " +
                        "or lower(name) like LOWER(:search) " +
                        "or lower(description) like LOWER(:search)) ",
                SortInput.getSortOrDefault(by, desc),
                Map.of("search", search.isBlank() ? "" : ("%" + search + "%")));
        return Map.of("data", query.page(Page.of(page, size)).list(), "pages", Util.getPagesCount(query.count(), size));
    }

    @GET
    @Path("/pages")
    @Produces(MediaType.APPLICATION_JSON)
    public int getOfficesPages(@QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size) {
        return Util.getPagesCount(Office.find("deleted_permanent = false and (:search = '' " +
                                "or lower(name) like LOWER(:search) " +
                                "or lower(description) like LOWER(:search)) ",
                        Map.of("search", search.isBlank() ? "" : ("%" + search + "%")))
                .count(), size);
    }


    @GET
    @Path("/{id}/users")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getUsersByOffice(@PathParam("id") Long id, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("by") @DefaultValue("id") String by, @QueryParam("desc") @DefaultValue("false") boolean desc) {

        PanacheQuery<User> query = User.find("id in :uids and (" +
                ":search = '' " +
                "or lower(username) like LOWER(:search))", SortInput.getSortOrDefault(by, desc), Map.of("search", search.isBlank() ? "" : ("%" + search + "%"),
                "uids", UserOffice.find("office_id = :oid and deleted = false", Map.of("oid", id)).stream()
                        .map(uo -> (UserOffice) uo)
                        .map(UserOffice::getUser_id)
                        .collect(Collectors.toList())));

        List<User> users = query.page(Page.of(page, size)).list();

        /**/
        List<it.cmrc.sso.entity.common.UserDTO> slimUsersList = new ArrayList<>();
        for(User user : users) {
            slimUsersList.add(it.cmrc.sso.entity.common.UserDTO.fromUser(user));
        }

        return Map.of("data", slimUsersList, "pages", Util.getPagesCount(query.count(), size));
        /**/

        //return Map.of("data", users, "pages", Util.getPagesCount(query.count(), size));
    }

    private long countUsers(Long applicationId, String officeId, String search, boolean isAllOffices) {
        StringBuilder sqlBuilder = new StringBuilder();

        sqlBuilder.append("SELECT COUNT(DISTINCT ua.id) ")
                .append("FROM user_account ua ")
                .append("JOIN permit p ON ua.id = p.user_id ")
                .append("WHERE p.application_id = :applicationId ");

        if(!isAllOffices){
            sqlBuilder.append("AND p.office_id = :officeId ");
        }

        if (!search.isBlank()) {
            sqlBuilder.append("AND LOWER(ua.username) LIKE LOWER(:search) ");
        }

        Query countQuery = em.createNativeQuery(sqlBuilder.toString())
                .setParameter("applicationId", applicationId);

        if(!isAllOffices){
            countQuery.setParameter("officeId", officeId);
        }

        if (!search.isBlank()) {
            countQuery.setParameter("search", search.isBlank() ? "" : ("%" + search + "%"));
        }

        return ((Number) countQuery.getSingleResult()).longValue();
    }

    @GET
    @Path("/{officeId}/application/{applicationId}/users")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getUsersByOfficeAndApplication(
            @PathParam("officeId") @DefaultValue("all") String officeId,
            @PathParam("applicationId") Long applicationId,
            @QueryParam("search") @DefaultValue("") String search,
            @QueryParam("size") @DefaultValue("50") int size,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("by") @DefaultValue("id") String by,
            @QueryParam("desc") @DefaultValue("false") boolean desc){

        boolean isAllOffices = "all".equalsIgnoreCase(officeId);

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                .append("ua.username, ")
                .append("ua.firstname, ")
                .append("ua.lastname, ")
                .append("ua.auth_id, ")
                .append("ua.email, ")
                .append("STRING_AGG(DISTINCT r.name, ', ') AS roles ")
                .append("FROM user_account ua ")
                .append("JOIN permit p ON ua.id = p.user_id ")
                .append("JOIN role r ON p.role_id = r.id ")
                .append("WHERE p.application_id = :applicationId ");
        if (!isAllOffices) {
            sqlBuilder.append("AND p.office_id = :officeId ");
        }

        if (!search.isBlank()) {
            sqlBuilder.append("AND LOWER(ua.username) LIKE LOWER(:search) ");
        }

        int offset = page * size;
        String groupBy = "ua.".concat(by);
        sqlBuilder.append("GROUP BY ua.username, ua.firstname, ua.lastname, ua.auth_id, ua.email, ")
                .append(groupBy)
                .append(" ORDER BY ")
                .append(groupBy)
                .append(desc ? " DESC " : " ASC ")
                .append("LIMIT :size OFFSET :offset");

        String sql = sqlBuilder.toString();
        Query query = em.createNativeQuery(sql)
                .setParameter("applicationId", applicationId)
                .setParameter("size", size)
                .setParameter("offset", offset);

        if (!isAllOffices) {
            query.setParameter("officeId", officeId);
        }

        if (!search.isBlank()) {
            query.setParameter("search", search.isBlank() ? "" : ("%" + search + "%"));
        }

        List<Object[]> results = query.getResultList();

        List<UserRoleDTO> userRoleDTOs = results.stream()
                .map(officeApiService::mapToUserRoleDTO)
                .collect(Collectors.toList());

        long totalCount = countUsers(applicationId, officeId, search, isAllOffices);

        return Map.of("data", userRoleDTOs, "pages", Util.getPagesCount(totalCount, size));
    }


    @GET
    @Path("/{id}/users/pages")
    @Produces(MediaType.APPLICATION_JSON)
    public int getUsersByOfficePages(@PathParam("id") Long id, @QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size, @QueryParam("page") @DefaultValue("0") int page, @QueryParam("by") @DefaultValue("id") String by, @QueryParam("desc") @DefaultValue("false") boolean desc) {

        return Util.getPagesCount(User.count("id in :uids and (" +
                ":search = '' " +
                "or lower(username) like LOWER(:search))", Map.of("search", search.isBlank() ? "" : ("%" + search + "%"),
                "uids", UserOffice.find("office_id = :oid and deleted = false", Map.of("oid", id)).stream()
                        .map(uo -> (UserOffice) uo)
                        .map(UserOffice::getUser_id)
                        .collect(Collectors.toList()))
        ), size);
    }

    @GET
    @Path("/{id}/history")
    @Produces(MediaType.APPLICATION_JSON)
    public List<OfficeHistory> getOfficeHistory(@PathParam("id") Long id) {
        return OfficeHistory.find("office_id = :oid", Map.of("oid", id)).list();
    }

}

