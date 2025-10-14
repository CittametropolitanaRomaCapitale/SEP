package it.cmrc.sso.resources;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import it.cmrc.sso.beans.MeBean;
import it.cmrc.sso.beans.SynchBean;
import it.cmrc.sso.entity.*;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.entity.common.UserWithAttributeDTO;
import it.cmrc.sso.mapper.UserMapper;
import it.cmrc.sso.service.DocumentService;
import it.cmrc.sso.service.UserService;
import it.cmrc.sso.util.AuthUtil;
import it.cmrc.sso.util.SortInput;
import it.cmrc.sso.util.Util;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.UserRepresentation;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Type;
import java.math.BigInteger;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/api/auth")
public class AuthApi {

    @Inject
    RealmResource realmResource;

    @Inject
    AuthUtil authUtil;

    @Inject
    UserService userService;

    @Inject
    EntityManager em;

    @Inject
    DocumentService documentService;

    @POST
    @Path("/synch_users")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public SynchBean synchUsers(){
        List<User> localUsers = User.find("auth_id is not null").list();
        List<User> usersToSave = new ArrayList<>();
        List<User> usersToUpdate = new ArrayList<>();
        SynchBean synchBean = new SynchBean();

        for (UserRepresentation ku : realmResource.users().list(0,3000)) {
            if(localUsers.stream().noneMatch(lu -> ku.getUsername().equals(lu.username))){
                usersToSave.add(new User(ku.getUsername(), ku.getFirstName(), ku.getLastName(), ku.getId(), ku.getEmail()));
            } else {
                User user = User.find("auth_id", ku.getId()).firstResult();
                //user.username = ku.getUsername();
                user.firstName = ku.getFirstName();
                user.lastName = ku.getLastName();
                user.email = ku.getEmail();
            }
        }

        if(usersToSave.size() > 0){
            User.persist(usersToSave);

            synchBean.setSuccess(true);
            return synchBean;
        }

        synchBean.setSuccess(false);
        return synchBean;
    }

    @GET
    @Path("/users")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> listUsers(@QueryParam("search") @DefaultValue("") String search,
                                         @QueryParam("size") @DefaultValue("10") int size,
                                         @QueryParam("page") @DefaultValue("0") int page,
                                         @QueryParam("by") @DefaultValue("id") String by,
                                         @QueryParam("desc") @DefaultValue("false") boolean desc,
                                         @QueryParam("appId") Long applicationId,
                                         @QueryParam("roles") List<Long> roles,
                                         @QueryParam("types") List<String> types,
                                         @QueryParam("officeIds") List<Long> officeIds,
                                         @QueryParam("enabledFlag") @DefaultValue("0") int enabledUsers) {

        StringBuilder queryString = new StringBuilder("(:search = '' " +
                "or lower(username) like LOWER(:search) " +
                "or lower(email) like LOWER(:search))");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("search", search.isBlank() ? "" : "%" + search + "%");

        if (enabledUsers > 0) {
            queryString.append(" and ").append(enabledUsers == 1 ? "(enabled is null or enabled = true)" : "enabled = false");
        }

        // Nel caso di ricerca avanzata
        if (applicationId != null && roles != null && !roles.isEmpty()) {

            List<PermitType> permitTypes = (types != null && !types.isEmpty())
                    ? types.stream()
                    .map(String::trim)
                    .filter(type -> !type.isEmpty())
                    .map(type -> PermitType.valueOf(type.toUpperCase()))
                    .collect(Collectors.toList())
                    : Collections.emptyList();

            // Costruzione dinamica della query
            String permitQuery = "application_id = :aid and role_id in :rid";
            Map<String, Object> permitParams = new HashMap<>();
            permitParams.put("aid", applicationId);
            permitParams.put("rid", roles);

            if (!permitTypes.isEmpty()) {
                permitQuery += " and type in :types";
                permitParams.put("types", permitTypes);
            }
            if (officeIds != null && !officeIds.isEmpty()) {
                permitQuery += " and office_id in :office_ids";
                permitParams.put("office_ids", officeIds);
            }

            // Recupero dei permessi
            List<Permit> permanentPermits = Permit.find(permitQuery, permitParams).list();

            // Recupero degli utenti associati ai permessi
            Set<Long> userIds = permanentPermits.stream().map(p -> p.user_id).collect(Collectors.toSet());

            if (!userIds.isEmpty()) {
                queryString.append(" and id in :userIds");
                parameters.put("userIds", userIds);
            } else {
                return Map.of("data", new ArrayList<>(), "pages", 0);
            }

            /*
            if (officeIds != null && !officeIds.isEmpty()) {
                queryString.append(" and id IN (SELECT user_id FROM user_office WHERE office_id IN :officeIds AND deleted = false) ");
                parameters.put("officeIds", officeIds);
            }
            */
        }

        PanacheQuery<User> query = User.find(queryString.toString(),
                SortInput.getSortOrDefault(by, desc),
                parameters);

        List<User> userResult = query.page(Page.of(page, size)).list();
        List<it.cmrc.sso.entity.common.UserWithAttributeDTO> slimUsersList = new ArrayList<>();
        for(User user : userResult) {
            slimUsersList.add(it.cmrc.sso.entity.common.UserWithAttributeDTO.fromUser(user));
        }
        return Map.of(
                "data", slimUsersList,
                "pages", Util.getPagesCount(query.count(), size)
        );
    }


    @GET
    @Path("/users/export")
    @Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public Response listUsersExport(@QueryParam("search") @DefaultValue("") String search,
                                    @QueryParam("size") @DefaultValue("10") int size,
                                    @QueryParam("page") @DefaultValue("0") int page,
                                    @QueryParam("by") @DefaultValue("id") String by,
                                    @QueryParam("desc") @DefaultValue("false") boolean desc,
                                    @QueryParam("appId") Long applicationId,
                                    @QueryParam("roles") List<Long> roles,
                                    @QueryParam("types") List<String> types,
                                    @QueryParam("officeIds") List<Long> officeIds,
                                    @QueryParam("enabledFlag") @DefaultValue("0") int enabledUsers) {
        try {
            // Costruzione query e parametri
            StringBuilder queryString = new StringBuilder("(:search = '' " +
                    "or lower(username) like LOWER(:search) " +
                    "or lower(email) like LOWER(:search))");

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("search", search.isBlank() ? "" : "%" + search + "%");

            if (enabledUsers > 0) {
                queryString.append(" and ").append(enabledUsers == 1 ? "(enabled is null or enabled = true)" : "enabled = false");
            }

            if (applicationId != null && roles != null && !roles.isEmpty()) {
                List<PermitType> permitTypes = (types != null && !types.isEmpty())
                        ? types.stream()
                        .map(String::trim)
                        .filter(type -> !type.isEmpty())
                        .map(type -> PermitType.valueOf(type.toUpperCase()))
                        .collect(Collectors.toList())
                        : Collections.emptyList();

                String permitQuery = "application_id = :aid and role_id in :rid";
                Map<String, Object> permitParams = new HashMap<>();
                permitParams.put("aid", applicationId);
                permitParams.put("rid", roles);

                if (!permitTypes.isEmpty()) {
                    permitQuery += " and type in :types";
                    permitParams.put("types", permitTypes);
                }

                List<Permit> permanentPermits = Permit.find(permitQuery, permitParams).list();
                Set<Long> userIds = permanentPermits.stream().map(p -> p.user_id).collect(Collectors.toSet());

                if (userIds.isEmpty()) {
                    return Response.status(Response.Status.NOT_FOUND)
                            .entity("Nessun utente associato ai permessi selezionati").build();
                }

                queryString.append(" and id in :userIds");
                parameters.put("userIds", userIds);

                if (officeIds != null && !officeIds.isEmpty()) {
                    queryString.append(" and id IN (SELECT user_id FROM user_office WHERE office_id IN :officeIds AND deleted = false)");
                    parameters.put("officeIds", officeIds);
                }
            }

            PanacheQuery<User> query = User.find(queryString.toString(),
                    SortInput.getSortOrDefault(by, desc), parameters);

            List<User> userResult = query.page(Page.of(page, size)).list();

            if (userResult.isEmpty()) {
                return Response.status(Response.Status.NO_CONTENT)
                        .entity("Nessun utente trovato").build();
            }

//            List<it.cmrc.sso.entity.common.UserWithAttributeDTO> slimUsersList = new ArrayList<>();
//            for(User user : userResult) {
//                slimUsersList.add(it.cmrc.sso.entity.common.UserWithAttributeDTO.fromUser(user));
//            }

            ByteArrayOutputStream outputStream = documentService.generateExcelFromUsers(userResult, applicationId, roles, types, officeIds);

            return Response.ok(outputStream.toByteArray())
                    .header("Content-Disposition", "attachment; filename=\"utenti.xls\"")
                    .build();

        } catch (Exception e) {
            return Response.serverError()
                    .entity("Errore durante l'esportazione utenti: " + e.getMessage())
                    .build();
        }
    }


    @GET
    @Path("/users/pages")
    @Produces(MediaType.APPLICATION_JSON)
    public int listUsersPages(@QueryParam("search") @DefaultValue("") String search, @QueryParam("size") @DefaultValue("50") int size) {
        return Util.getPagesCount(User.count(":search = '' " +
                                "or lower(username) like LOWER(:search)",
                        Map.of("search", search.isBlank() ? "" : ("%" + search + "%"))), size);
    }

    @GET
    @Path("/user/{id}/history")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserHistory> getUserHistory(@PathParam("id") Long id) {
        return UserHistory.find("user_id = :uid", Map.of("uid", id)).list();
    }

    @Inject
    UserMapper userMapper;

//    @SneakyThrows
    @GET
    @Path("/me")
    @Produces(MediaType.APPLICATION_JSON)
    public MeBean me(@QueryParam("applicationId") Long applicationId) {
        User user = extractUserFromToken();
        if(user != null){
            MeBean data = new MeBean();
            data.setUser_data(userMapper.toDTO(user, applicationId));
            //data.setHistory(UserHistory.find("user_id = :uid", Map.of("uid", user.id)).list());

            //List<OfficeHistory> officeHistoryList = new ArrayList<>();

            String recursiveQueryForStoricOffices = "WITH RECURSIVE office_hierarchy_query AS ( " +
                    "select e.old_office_id from office_history e where e.office_id = :userOfficeId AND e.record_type = 'INHERIT' " +
                    "UNION ALL " +
                "select e.old_office_id from office_history e INNER JOIN office_hierarchy_query c ON e.office_id = c.old_office_id " +
                "where e.record_type = 'INHERIT' " +
                ") Select old_office_id from office_hierarchy_query ";


            Set<BigInteger> officeHistoryIdsSet = new HashSet<>();
            for(UserOffice userOffice : (applicationId == null ? user.getUserOffices() : user.getUserOffices(applicationId))){

                List<BigInteger> officeHistoryList = em.createNativeQuery(recursiveQueryForStoricOffices)
                        .setParameter("userOfficeId", userOffice.office_id)
                        .getResultList();
                officeHistoryIdsSet.addAll(officeHistoryList);

                /*
                officeHistoryList.addAll(OfficeHistory.find(
                        "record_type = 'INHERIT' and office_id = :oid",
                        Map.of("oid", userOffice.office_id)).list());
                 */
            }
            List<Office> officeList = new ArrayList<>();
            for (BigInteger officeHistoryId : officeHistoryIdsSet){
                officeList.add(Office.find("id in :id", Map.of("id", officeHistoryId.longValue())).firstResult());
            }
            data.setStoric_offices(officeList);

//            data.setStoric_offices(
//                    Office.find("id in :oids",
//                        Map.of("oids",
//                            OfficeHistory.find(
//                                        "record_type = 'INHERIT' and old_office_id in :oids",
//                                        Map.of("oids", user.getStoricUserOffices().stream()
//                                            .map(UserOffice::getOffice_id)
//                                            .collect(Collectors.toList()))
//                                    ).list().stream()
//                                    .map(ofh -> (OfficeHistory)ofh)
//                                    .map(ofh -> ofh.old_office_id)
//                                    .collect(Collectors.toList()))
//                    ).list()
//            );
            return data;
        } else
            throw new NotFoundException("User not found in token");
    }

    public User extractUserFromToken() {

        User user = User.find("auth_id = :aid", Map.of("aid", authUtil.extractIdFromToken())).firstResult();
        user.setRoles(authUtil.extractRolesFromToken());

        return user;
    }

    @GET
    @Path("/user/{authId}/application/{applicationId}")
    @Produces(MediaType.APPLICATION_JSON)
    public MeBean getUserByAuthId(@PathParam("authId") String authId, @PathParam("applicationId") Long applicationId) {
        User user = User.find("auth_id = :authId",Map.of("authId",authId)).firstResult();
        if(user != null){
            MeBean data = new MeBean();
            data.setUser_data(userMapper.toDTO(user, applicationId));

            List<OfficeHistory> officeHistoryList = new ArrayList<>();
            for(UserOffice userOffice : (applicationId == null ? user.getUserOffices() : user.getUserOffices(applicationId))){
                officeHistoryList.addAll(OfficeHistory.find(
                        "record_type = 'INHERIT' and office_id = :oid",
                        Map.of("oid", userOffice.office_id)).list());
            }
            List<Office> officeList = new ArrayList<>();
            for (OfficeHistory officeHistory : officeHistoryList){
                officeList.add(Office.find("id in :id", Map.of("id", officeHistory.getOld_office_id())).firstResult());
            }
            data.setStoric_offices(officeList);
            return data;
        } else
            throw new NotFoundException("User not found");
    }


    @GET
    @Path("/getFullUsersInfos")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserWithAttributeDTO> getAllUsersWithAttributes() {

        List<User> localUsers = User.find("auth_id is not null").list();
        List<Office> localOffices = Office.find("deleted_permanent = false").list();
        List<String> localAuthIds = new ArrayList<>();
        for(User lu : localUsers) {
            localAuthIds.add(lu.auth_id);
        }
        localUsers.clear();

        Map<String, String> localOfficesMap = new HashMap<>();
        for(Office localOffice : localOffices) {
            localOfficesMap.put(localOffice.name, localOffice.code);
        }
        localOffices.clear();

        List<UserWithAttributeDTO> responseUsers = new ArrayList<>();

        List<UserRepresentation> kcUsers = realmResource.users().list(0, 3000);
        for (UserRepresentation ku : kcUsers) {
            Map<String, List<String>> kuAttributesMap = ku.getAttributes();
            if (kuAttributesMap == null) {
                continue;
            }

            if (Boolean.FALSE.equals(ku.isEnabled())) {
                continue;
            }

            if (!localAuthIds.contains(ku.getId()))
                continue;

            String userMustBeImportedInTitolario = kuAttributesMap.containsKey("must_import_in_titolario") && !kuAttributesMap.get("must_import_in_titolario").isEmpty() ? kuAttributesMap.get("must_import_in_titolario").get(0) : null;
            String userUseAttributeForOfficeMapping = kuAttributesMap.containsKey("attribute_for_sso_office_mapping") && !kuAttributesMap.get("attribute_for_sso_office_mapping").isEmpty() ? kuAttributesMap.get("attribute_for_sso_office_mapping").get(0) : null;
            String userCdrFromKeycloak = kuAttributesMap.containsKey("cdr") && !kuAttributesMap.get("cdr").isEmpty() ? kuAttributesMap.get("cdr").get(0) : null;
            String userDepartmentFromKeycloak = kuAttributesMap.containsKey("department") && !kuAttributesMap.get("department").isEmpty() ? kuAttributesMap.get("department").get(0) : null;
            String userQualificaFromKeycloak = kuAttributesMap.containsKey("qualifica") && !kuAttributesMap.get("qualifica").isEmpty() ? kuAttributesMap.get("qualifica").get(0) : null;
            String userLDAPDNFromKeycloak = kuAttributesMap.containsKey("LDAP_ENTRY_DN") && !kuAttributesMap.get("LDAP_ENTRY_DN").isEmpty() ? kuAttributesMap.get("LDAP_ENTRY_DN").get(0) : null;
            String userMatricolaFromKeycloak = kuAttributesMap.containsKey("matricola") && !kuAttributesMap.get("matricola").isEmpty() ? kuAttributesMap.get("matricola").get(0) : null;
            String userRoleFromKeycloak = kuAttributesMap.containsKey("role_for_protocollo") && !kuAttributesMap.get("role_for_protocollo").isEmpty() ? kuAttributesMap.get("role_for_protocollo").get(0) : null;

            String cdrFromSSO = userUseAttributeForOfficeMapping != null && userUseAttributeForOfficeMapping.equalsIgnoreCase("department") ? userService.getCdrFromKeycloakDepartment(userDepartmentFromKeycloak) : userService.getCdrFromKeylcoakCdr(userCdrFromKeycloak);
            if (cdrFromSSO == null) {
                //nessun cdr trovato in SSO
                continue;
            }
            String localOfficeCdrCode = localOfficesMap.getOrDefault(cdrFromSSO, null);
            if (localOfficeCdrCode == null) {
                //nessun cdr di SSO corrisponde a quelli in db
                continue;
            }

            UserWithAttributeDTO uwa = new UserWithAttributeDTO();
            uwa.auth_id = ku.getId();
            uwa.firstName = ku.getFirstName();
            uwa.lastName = ku.getLastName();
            uwa.email = ku.getEmail();
            uwa.username = ku.getUsername();
            uwa.department = userDepartmentFromKeycloak;
            uwa.matricola = userMatricolaFromKeycloak;
            uwa.role = userRoleFromKeycloak;
            uwa.qualifica = userQualificaFromKeycloak;
            uwa.mustBeImportedInTitolario = userMustBeImportedInTitolario == null || userMustBeImportedInTitolario.equalsIgnoreCase("true");
            
            //TODO: trovare modo più robusto (leggere qualifica!)
            uwa.isDirigente = userLDAPDNFromKeycloak != null && userLDAPDNFromKeycloak.toLowerCase().contains("dirigenti");
            uwa.cdrCode = localOfficeCdrCode;
            responseUsers.add(uwa);
        }
        return responseUsers;
    }
}

