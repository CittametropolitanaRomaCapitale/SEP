package it.cmrc.sso.resources;

import io.quarkus.panache.common.Parameters;
import io.quarkus.panache.common.Sort;
import it.cmrc.sso.beans.CreateDelegationBean;
import it.cmrc.sso.beans.CreateMultiPermissionBean;
import it.cmrc.sso.beans.CreatePermissionBean;
import it.cmrc.sso.beans.UpdateDelegationDatesBean;
import it.cmrc.sso.entity.*;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.entity.common.RecordType;
import it.cmrc.sso.exception.CustomExceptionMapper;
import it.cmrc.sso.mapper.PermitMapper;
import it.cmrc.sso.util.DateConverter;
import lombok.extern.slf4j.Slf4j;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/api/permit")
@Slf4j
public class PermissionApi {

    @Inject
    PermitMapper mapper;

    @POST
    @Path("/add_permission")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Permit add_permission(CreatePermissionBean createPermissionBean) {

        Permit permit = mapper.createPermission(createPermissionBean);
        ApplicationRole applicationRole = ApplicationRole.find("role_id = :rid", Map.of("rid", permit.role_id)).firstResult();
        permit.application_id = applicationRole.application_id;
        permit.persistAndFlush();

        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.PERM;
        userHistory.office_id = permit.office_id;
        userHistory.user_id = permit.user_id;
        userHistory.role_id = permit.role_id;
        userHistory.type = PermitType.PERSISTENT;
        userHistory.permit_id = permit.id;
        userHistory.persistAndFlush();

        return permit;
    }


    @POST
    @Path("/multi_add_permission")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response multi_add_permission(CreateMultiPermissionBean createPermissionBean) {
        
        List<Permit> permitsToPersist = new ArrayList<>();
        List<UserHistory> userHistoryToPersist = new ArrayList<>();

        for(Long roleId : createPermissionBean.role_ids) {

            Permit permit = mapper.createPermission(new CreatePermissionBean(createPermissionBean.getUser_id(), createPermissionBean.getOffice_id(), roleId));
            ApplicationRole applicationRole = ApplicationRole.find("role_id = :rid", Map.of("rid", permit.role_id)).firstResult();
            permit.application_id = applicationRole.application_id;
            permitsToPersist.add(permit);

            UserHistory userHistory = new UserHistory();
            userHistory.record_type = RecordType.PERM;
            userHistory.office_id = permit.office_id;
            userHistory.user_id = permit.user_id;
            userHistory.role_id = permit.role_id;
            userHistory.type = PermitType.PERSISTENT;
            userHistory.permit_id = permit.id;
            userHistoryToPersist.add(userHistory);
        }

        Permit.persist(permitsToPersist);
        UserHistory.persist(userHistoryToPersist);

        return Response.ok().build();
    }

    @POST
    @Path("/add_delegation")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response add_delegation(CreateDelegationBean createDelegationBean) {

        User user = User.findById(createDelegationBean.user_id);
        List<UserOffice> uofficeFiltered = new ArrayList<>();
        List<UserOffice> uoffice = user.getUserOfficesForDelegation();
        if(uoffice.isEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).entity("No offices found for user " + createDelegationBean.user_id).build();
        } else {
            uofficeFiltered = uoffice.stream().filter(userOffice -> createDelegationBean.cdr_code_list.contains(userOffice.getOffice_id())).collect(Collectors.toList());
        }

        log.info("Found {} user offices", uofficeFiltered.size());

        DateConverter dtc = new DateConverter();
        
        Date delegation_start = dtc.toDateOrNull(createDelegationBean.delegation_start);
        Date delegation_end = dtc.toDateOrNull(createDelegationBean.delegation_end);

        if(delegation_start == null || delegation_end == null){
            return Response.status(Response.Status.BAD_REQUEST).entity("Start or end date for delegation are null or in an invalid format").build();
        }

        List<Delegation> delegations = new ArrayList<>();

        List<String> officeEmpty = new ArrayList<>();
        for(UserOffice userOffice : uofficeFiltered){
            List<Permit> permissionsToDelegate = userOffice.getUserOfficeRoles().stream().filter(p -> (PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type)) &&
                    Objects.equals(p.application_id, createDelegationBean.applicationId)).collect(Collectors.toList());
            if(permissionsToDelegate.isEmpty()){
                Office office = Office.findById(userOffice.getOffice_id());
                officeEmpty.add(office.getName());
            }
        }

        if(officeEmpty.size() > 0){
            StringBuilder message = new StringBuilder();
            for (String office : officeEmpty){
                if(message.toString().equals("")){
                    message = new StringBuilder(office);
                } else
                    message.append(", ").append(office);
            }
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new CustomExceptionMapper.ErrorResponseBody("Non è stato possibile creare una delega in quanto l'utente non ha permessi associati ai CDR "+message.toString())
                    ).build();
        }

        for(UserOffice userOffice : uofficeFiltered){
            List<Permit> permissionsToDelegate = userOffice.getUserOfficeRoles().stream().filter(p -> (PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type)) &&
                    Objects.equals(p.application_id, createDelegationBean.applicationId)).collect(Collectors.toList());

            if(permissionsToDelegate.size() > 0){
                if(checkExistingDelegation(null, createDelegationBean.applicationId, userOffice.office_id, createDelegationBean.delegation_start, createDelegationBean.delegation_end, createDelegationBean.user_id)){
                    Office office = Office.findById(userOffice.office_id);
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new CustomExceptionMapper.ErrorResponseBody("Esiste già un delega per il cdr "+ office.getName() +" nel range temporale richiesto")
                            ).build();
                }

                Delegation delegation = new Delegation();
                delegation.delegation_end = delegation_end;
                delegation.delegation_start = delegation_start;
                delegation.note = createDelegationBean.note;
                delegation.user_id = createDelegationBean.to_user_id;
                delegation.from_user_id = createDelegationBean.user_id;
                delegation.cdrCode = userOffice.office_id;
                delegation.cdr = userOffice.getOfficeById().name;
                delegation.applicationId = createDelegationBean.applicationId;
                delegation.persistAndFlush();

                delegations.add(delegation);

                List<UserHistory> historyToSave = new ArrayList<>();

                for (Permit p : permissionsToDelegate) {
                    Permit permit = new Permit();
                    permit.father_permit_id = p.id;
                    permit.delegation_id = delegation.id;
                    permit.type = PermitType.DELEGATION;
                    permit.office_id = p.office_id;
                    permit.user_id = createDelegationBean.to_user_id;
                    permit.role_id = p.role_id;
                    permit.application_id = p.application_id;
                    permit.persistAndFlush(delegation_start, delegation_end);


                    UserHistory userHistory = new UserHistory();
                    userHistory.note = createDelegationBean.note;
                    userHistory.father_permit_id = p.id;
                    userHistory.record_type = RecordType.PERM;
                    userHistory.office_id = p.office_id;
                    userHistory.user_id = createDelegationBean.to_user_id;
                    userHistory.role_id = p.role_id;
                    userHistory.delegation_start = delegation_start;
                    userHistory.delegation_end = delegation_end;
                    userHistory.type = PermitType.DELEGATION;
                    userHistory.permit_id = permit.id;
                    historyToSave.add(userHistory);
                }

                UserHistory.persist(historyToSave);
            } else {
                Office office = Office.findById(userOffice.getOffice_id());
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new CustomExceptionMapper.ErrorResponseBody("Non è stato possibile creare una delega in quanto " +
                                "l'utente non ha permessi associati al CDR "+office.getName())
                        ).build();
            }
        }

        return Response.ok(delegations).build();
    }


    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Permit get_permit(@PathParam("id") Long id){
        return Permit.findById(id);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public List<Permit> get_permits(@QueryParam("sort_by") String by, @QueryParam("sort_desc") @DefaultValue("true") boolean desc){
        return Permit.findAll(desc ? Sort.descending(by) : Sort.ascending(by)).list();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response remove_permit(@PathParam("id") Long id){
        if(Permit.count("father_permit_id = :pid", Map.of("pid", id)) > 0){
            return Response.status(Response.Status.BAD_REQUEST).entity("Permit cannot be removed because is related to a delegation").build();
        }
        Permit permit = Permit.findById(id);
        permit.delete();
        return Response.ok(permit).build();
    }

    @PUT
    @Path("update_delegation/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response update_delegation(@PathParam("id") Long id, UpdateDelegationDatesBean input){
        Delegation delegation = Delegation.findById(id);
        Date date_start = mapper.parseStartDate(input);
        Date date_end = mapper.parseEndDate(input);
        UserHistory userHistory = new UserHistory();
        userHistory.permit_id = id;
        userHistory.record_type = RecordType.UPDATE_ROW;
        boolean update = false;
        boolean update_dates = false;

        if(input.applicationId != null && input.cdr_code != null){
            User user = User.findById(delegation.from_user_id);
            List<UserOffice> uofficeFiltered;
            List<UserOffice> uoffice = user.getUserOfficesForDelegation();
            if(uoffice.isEmpty()){
                return Response.status(Response.Status.BAD_REQUEST).entity("No offices found for user " + delegation.user_id).build();
            } else {
                log.info("input {}", input.cdr_code);
                uofficeFiltered = uoffice.stream().filter(userOffice -> {
                    log.info("office_id {}", userOffice.getOffice_id());
                    return input.cdr_code.compareTo(userOffice.getOffice_id()) == 0;
                }).collect(Collectors.toList());
            }

            log.info("Found {} user offices", uofficeFiltered.size());

            for(UserOffice userOffice : uofficeFiltered){
                List<Permit> permissionsToDelegate = userOffice.getUserOfficeRoles().stream().filter(p -> (PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type)) &&
                        Objects.equals(p.application_id, input.applicationId)).collect(Collectors.toList());

                if(permissionsToDelegate.size() > 0){
                    if(checkExistingDelegation(id, input.applicationId, userOffice.office_id, input.delegation_start, input.delegation_end, delegation.from_user_id)){
                        Office o = Office.findById(userOffice.office_id);
                        return Response.status(Response.Status.BAD_REQUEST)
                                .entity(new CustomExceptionMapper.ErrorResponseBody("Esiste già un delega per il cdr "+ o.getName() +" nel range temporale richiesto")
                                ).build();
                    }

                    List<Permit> permitsToDelete = Permit.find("delegation_id = :did", Map.of("did", id)).list();
                    int quantity = permitsToDelete.size();
                    log.info("Found {} permit to be deleted", quantity);
                    Permit.removePermitFromKeycloak(permitsToDelete);
                    long result = Permit.delete("delegation_id = :did", Map.of("did", id));
                    log.info("Deleted {} permits", result);

                    for (Permit p : permissionsToDelegate) {
                        Permit permit = new Permit();
                        permit.father_permit_id = p.id;
                        permit.delegation_id = delegation.id;
                        permit.type = PermitType.DELEGATION;
                        permit.office_id = p.office_id;
                        permit.user_id = delegation.user_id;
                        permit.role_id = p.role_id;
                        permit.application_id = p.application_id;
                        permit.persistAndFlush(delegation.delegation_start, delegation.delegation_end);
                    }
                }
            }
            delegation.applicationId = input.applicationId;
            delegation.cdrCode = input.cdr_code;
            Office office = Office.findById(input.cdr_code);
            delegation.cdr = office.name;
        }

        else if(input.applicationId != null){
            delegation.applicationId = input.applicationId;
            userHistory.application_id = input.applicationId;

            List<Permit> permitsToDelete = Permit.find("delegation_id = :did", Map.of("did", id)).list();
            int quantity = permitsToDelete.size();
            log.info("Found {} permit to be deleted", quantity);
            Permit.removePermitFromKeycloak(permitsToDelete);
            long result = Permit.delete("delegation_id = :did", Map.of("did", id));
            log.info("Deleted {} permits", result);

            User user = User.findById(delegation.from_user_id);
            List<UserOffice> uofficeFiltered;
            List<UserOffice> uoffice = user.getUserOfficesForDelegation();
            if(uoffice.isEmpty()){
                return Response.status(Response.Status.BAD_REQUEST).entity("No offices found for user " + delegation.user_id).build();
            } else {
                uofficeFiltered = uoffice.stream().filter(userOffice -> Objects.equals(delegation.cdrCode, userOffice.getOffice_id())).collect(Collectors.toList());
            }

            log.info("Found {} user offices", uofficeFiltered.size());

            for(UserOffice userOffice : uofficeFiltered){
                List<Permit> permissionsToDelegate = userOffice.getUserOfficeRoles().stream().filter(p -> (PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type)) &&
                        Objects.equals(p.application_id, input.applicationId)).collect(Collectors.toList());

                if(permissionsToDelegate.size() > 0){
                    if(checkExistingDelegation(id, input.applicationId, userOffice.office_id, input.delegation_start, input.delegation_end, delegation.from_user_id)){
                        Office office = Office.findById(userOffice.office_id);
                        return Response.status(Response.Status.BAD_REQUEST)
                                .entity(new CustomExceptionMapper.ErrorResponseBody("Esiste già un delega per il cdr "+ office.getName() +" nel range temporale richiesto")
                                ).build();
                    }

                    List<Permit> permitsToDelete2 = Permit.find("delegation_id = :did", Map.of("did", id)).list();
                    int quantity2 = permitsToDelete2.size();
                    log.info("Found {} permit to be deleted", quantity2);
                    Permit.removePermitFromKeycloak(permitsToDelete2);
                    long result2 = Permit.delete("delegation_id = :did", Map.of("did", id));
                    log.info("Deleted {} permits", result2);

                    for (Permit p : permissionsToDelegate) {
                        Permit permit = new Permit();
                        permit.father_permit_id = p.id;
                        permit.delegation_id = delegation.id;
                        permit.type = PermitType.DELEGATION;
                        permit.office_id = p.office_id;
                        permit.user_id = delegation.user_id;
                        permit.role_id = p.role_id;
                        permit.application_id = p.application_id;
                        permit.persistAndFlush(delegation.delegation_start, delegation.delegation_end);
                    }
                }
            }
        }

        else if(input.cdr_code != null){
            userHistory.cdr_code = input.cdr_code;

            List<Permit> permitsToDelete = Permit.find("delegation_id = :did", Map.of("did", id)).list();
            int quantity = permitsToDelete.size();
            log.info("Found {} permit to be deleted", quantity);
            Permit.removePermitFromKeycloak(permitsToDelete);
            long result = Permit.delete("delegation_id = :did", Map.of("did", id));
            log.info("Deleted {} permits", result);

            User user = User.findById(delegation.from_user_id);
            List<UserOffice> uofficeFiltered = new ArrayList<>();
            List<UserOffice> uoffice = user.getUserOfficesForDelegation();
            if(uoffice.isEmpty()){
                return Response.status(Response.Status.BAD_REQUEST).entity("No offices found for user " + delegation.user_id).build();
            } else {
                uofficeFiltered = uoffice.stream().filter(userOffice -> Objects.equals(input.cdr_code, userOffice.getOffice_id())).collect(Collectors.toList());
            }

            log.info("Found {} user offices", uofficeFiltered.size());

            for(UserOffice userOffice : uofficeFiltered){
                List<Permit> permissionsToDelegate = userOffice.getUserOfficeRoles().stream().filter(p -> (PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type)) &&
                        Objects.equals(p.application_id, delegation.applicationId)).collect(Collectors.toList());

                if(permissionsToDelegate.size() > 0){
                    if(checkExistingDelegation(id, input.applicationId, userOffice.office_id, input.delegation_start, input.delegation_end, delegation.from_user_id)){
                        Office office = Office.findById(userOffice.office_id);
                        return Response.status(Response.Status.BAD_REQUEST)
                                .entity(new CustomExceptionMapper.ErrorResponseBody("Esiste già un delega per il cdr "+ office.getName() +" nel range temporale richiesto")
                                ).build();
                    }

                    List<Permit> permitsToDelete3 = Permit.find("delegation_id = :did", Map.of("did", id)).list();
                    int quantity3 = permitsToDelete.size();
                    log.info("Found {} permit to be deleted", quantity3);
                    Permit.removePermitFromKeycloak(permitsToDelete3);
                    long result3 = Permit.delete("delegation_id = :did", Map.of("did", id));
                    log.info("Deleted {} permits", result3);

                    for (Permit p : permissionsToDelegate) {
                        Permit permit = new Permit();
                        permit.father_permit_id = p.id;
                        permit.delegation_id = delegation.id;
                        permit.type = PermitType.DELEGATION;
                        permit.office_id = p.office_id;
                        permit.user_id = delegation.user_id;
                        permit.role_id = p.role_id;
                        permit.application_id = p.application_id;
                        permit.persistAndFlush(delegation.delegation_start, delegation.delegation_end);
                    }
                }
            }
            delegation.cdrCode = input.cdr_code;
            Office o = Office.findById(input.cdr_code);
            delegation.cdr = o.name;
        }

        if(date_end != null){
            delegation.delegation_end = date_end;
            userHistory.delegation_end = date_end;
            update = true;
            update_dates = true;
        }

        if(date_start != null){
            delegation.delegation_start = date_start;
            userHistory.delegation_start = date_start;
            update = true;
            update_dates = true;
        }

        if(input.note != null){
            delegation.note = input.note;
            userHistory.note = input.note;
            update = true;
        }

        if(update){
            delegation.persistAndFlush();
            userHistory.persistAndFlush();
        }

        if(update_dates) {
            List<Permit> permits = Permit.find("delegation_id = :did", Map.of("did", id)).list();
            for (Permit p : permits) {
                p.post_persist(date_start, date_end);
            }
        }

        return Response.ok(delegation).build();
    }

    @DELETE
    @Path("delete_delegation/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public boolean delete_delegation(@PathParam("id") Long id){
        Delegation delegation = Delegation.findById(id);

        UserHistory userHistory = new UserHistory();
        userHistory.permit_id = id;
        userHistory.record_type = RecordType.INVALIDATE_PERMIT;

        List<Permit> permitsToDelete = Permit.find("delegation_id = :did", Map.of("did", id)).list();
        int quantity = permitsToDelete.size();
        log.info("Found {} permit to be deleted", quantity);
        Permit.removePermitFromKeycloak(permitsToDelete);
        long result = Permit.delete("delegation_id = :did", Map.of("did", id));
        log.info("Deleted {} permits", result);
        long resultAtt = Attachment.delete("delegation_id = :did", Map.of("did", id));
        log.info("Deleted {} attachments", resultAtt);
        return Delegation.deleteById(id);
    }

    private boolean checkExistingDelegation(Long delegationId, Long applicationId, Long officeId, String start, String end, Long fromUserId){
        List<Delegation> actualDelegations;
        if(delegationId != null){
            actualDelegations = Delegation.find("applicationId = :applicationId and cdrCode = :cdrCode and id != :id and from_user_id = :fromUserId",
                    Parameters.with("applicationId", applicationId)
                            .and("cdrCode",officeId).and("id", delegationId).and("fromUserId", fromUserId)).list();
        } else {
            actualDelegations = Delegation.find("applicationId = :applicationId and cdrCode = :cdrCode and from_user_id = :fromUserId",
                    Parameters.with("applicationId", applicationId)
                            .and("cdrCode",officeId).and("fromUserId", fromUserId)).list();
        }

        DateConverter dtc = new DateConverter();

        Date delegation_start = dtc.toDateOrNull(start);
        Date delegation_end = dtc.toDateOrNull(end);

        for(Delegation actualDelegation : actualDelegations){
            log.info("delegation_start: {}", delegation_start);
            log.info("delegation_end: {}", delegation_end);
            log.info("actual delegation_start: {}", actualDelegation.delegation_start);
            log.info("actual delegation_end: {}", actualDelegation.delegation_end);

            if(actualDelegation.delegation_start.compareTo(delegation_start) <= 0 &&
                    actualDelegation.delegation_end.compareTo(delegation_end) >= 0) {
                log.info("1");
                return true;
            } else if (actualDelegation.delegation_start.compareTo(delegation_start) <= 0 &&
                            actualDelegation.delegation_end.compareTo(delegation_start) >= 0){
                log.info("2");
                return true;
            } else if (actualDelegation.delegation_start.compareTo(delegation_end) <= 0 &&
                            actualDelegation.delegation_end.compareTo(delegation_end) >= 0){
                log.info("3");
                return true;
            } else if (actualDelegation.delegation_start.compareTo(delegation_start) >= 0 &&
                            actualDelegation.delegation_end.compareTo(delegation_end) <= 0) {
                log.info("4");
                return true;
            } else if (actualDelegation.delegation_start.compareTo(delegation_start) >= 0 &&
                            actualDelegation.delegation_start.compareTo(delegation_end) <= 0) {
                log.info("5");
                return true;
            } else if (actualDelegation.delegation_end.compareTo(delegation_start) >= 0 &&
                            actualDelegation.delegation_end.compareTo(delegation_end) <= 0) {
                log.info("6");
                return true;
            }
        }
        return false;
    }

}

