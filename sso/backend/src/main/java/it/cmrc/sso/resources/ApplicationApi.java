package it.cmrc.sso.resources;

import io.quarkus.narayana.jta.runtime.TransactionConfiguration;
import it.cmrc.sso.beans.*;
import it.cmrc.sso.entity.*;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.entity.common.RecordType;
import it.cmrc.sso.entity.common.UserDTO;
import it.cmrc.sso.mapper.PermitMapper;
import it.cmrc.sso.provider.KeycloakProvider;
import it.cmrc.sso.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.UserRepresentation;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.spi.CDI;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/api/application")
@Slf4j
public class ApplicationApi {

    @Inject
    KeycloakProvider kcProvider;

    @Inject
    UserService userService;

    @Inject
    PermitMapper permitMpper;

    @Inject
    EntityManager em;

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get_application(@PathParam("id") Long id) {
        return Response.ok(Application.findById(id)).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get_applications(@PathParam("id") Long id) {
        return Response.ok(Application.findAll().list()).build();
    }


    @GET
    @Path("/{application_id}/free_roles_for_user/{user_id}/by_office/{office_id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public List<Role> get_free_user_roles(@PathParam("user_id") Long userId, @PathParam("application_id") Long applicationId, @PathParam("office_id") Long office_id) {
        Application application = Application.findById(applicationId);

        List<Long> activeRoles = Permit.find("user_id = :uid and office_id = :oid and type in ('PERSISTENT', 'TRANSIENT')", Map.of("uid", userId, "oid", office_id)).list()
                .stream()
                .map(p -> (Permit) p)
                .map(p -> p.role_id)
                .collect(Collectors.toList());

        return Role.find("id in :ids", Map.of("ids",
                application.getApplicationRoles().stream()
                        .map(ApplicationRole::getRole_id)
                        .filter(r -> !activeRoles.contains(r))
                        .collect(Collectors.toList()))).list();
    }

    @GET
    @Path("{application_id}/get_admins")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public List<User> get_admins_for_application(@PathParam("application_id") Long application_id) {
        Map<String, Object> param = new HashMap<>();
        param.put("application_id", application_id);
        List<AdminApplicationRole> adminRoles = AdminApplicationRole.find("application_id = :application_id", param).list();

        RealmResource realmResource = CDI.current().select(RealmResource.class).get();

        List<String> adminAuthIds = new ArrayList<>();
        for(AdminApplicationRole aar : adminRoles) {
            Set<UserRepresentation> kcAdminUsers = realmResource.roles().get(aar.complete_role).getRoleUserMembers();

            for(UserRepresentation ur : kcAdminUsers) {
                adminAuthIds.add(ur.getId());
            }
        }

        param.clear();
        param.put("auth_ids", adminAuthIds);
        return User.find("auth_id IN :auth_ids", param).list();
    }

    @GET
    @Path("{application_id}/get_admins_slim")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public List<UserDTO> get_admins_for_application_slim(@PathParam("application_id") Long application_id) {
        List<User> admins = get_admins_for_application(application_id);
        List<UserDTO> adminsDto = new ArrayList<>();
        for(User admin : admins) {
            adminsDto.add(UserDTO.fromUser(admin));
        }
        return adminsDto;
    }

    /**
     * La funzione sincronizza gli utenti da Keycloak,
     * impostando al più un permesso di tipo "TRANSIENT" per utente,
     * eliminando tutti gli altri presenti
     */
    @POST
    @Path("/{application_id}/sync_users_with_permissions")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @TransactionConfiguration(timeout = 180)
    public SynchBean synchUsersWithPermissions(@PathParam("application_id") Long applicationId){
        List<User> localUsers = User.find("auth_id is not null").list();
        List<Office> localOffices = Office.find("deleted_permanent = false").list();
        Map<String, Long> localOfficesMap = new HashMap<>();
        for(Office localOffice : localOffices) {
            localOfficesMap.put(localOffice.name, localOffice.id);
        }
        localOffices.clear();

        SynchBean synchBean = new SynchBean();

        Application application = Application.findById(applicationId);
        if (application == null || ( !application.getName().equalsIgnoreCase("pi") && !application.getName().equalsIgnoreCase("sid")) ) {
            log.error("Application id richiesto non valido oppure non supportato dal servizio: {}", applicationId);
            synchBean.setSuccess(false);
            return synchBean;
        }
        List<Role> applicationRoles = Role.find("id in :ids", Map.of("ids",
                application.getApplicationRoles().stream()
                        .map(ApplicationRole::getRole_id)
                        .collect(Collectors.toList()))).list();



        RealmResource realmResource = null;
        try {
            realmResource = kcProvider.provide();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (KeyStoreException e) {
            throw new RuntimeException(e);
        } catch (KeyManagementException e) {
            throw new RuntimeException(e);
        }


        boolean isSyncrhonizingSid = application.getName().equalsIgnoreCase("sid");

        List<UserRepresentation> kcUsers = realmResource.users().list(0, 3000);
        for (UserRepresentation ku : kcUsers) {
            //log.info("Sync utente {}", ku.getUsername());
            Map<String, List<String>> kuAttributesMap = ku.getAttributes();
            if (kuAttributesMap == null) {
                log.error("Nessun attributo trovato per utente {}", ku.getUsername());
                continue;
            }

            /*
            if (Boolean.FALSE.equals(ku.isEnabled())) {
                log.info("Utente non abilitato {}", ku.getUsername());
                continue;
            }
            */

            String userUseAttributeForOfficeMapping = kuAttributesMap.containsKey("attribute_for_sso_office_mapping") && !kuAttributesMap.get("attribute_for_sso_office_mapping").isEmpty() ? kuAttributesMap.get("attribute_for_sso_office_mapping").get(0) : null;
            String userCdrFromKeycloak = kuAttributesMap.containsKey("cdr") && !kuAttributesMap.get("cdr").isEmpty() ? kuAttributesMap.get("cdr").get(0) : null;
            String userDepartmentFromKeycloak = kuAttributesMap.containsKey("department") && !kuAttributesMap.get("department").isEmpty() ? kuAttributesMap.get("department").get(0) : null;
            //String userQualificaFromKeycloak = kuAttributesMap.containsKey("qualifica") && !kuAttributesMap.get("qualifica").isEmpty() ? kuAttributesMap.get("qualifica").get(0) : null;
            //String userLDAPDNFromKeycloak = kuAttributesMap.containsKey("LDAP_ENTRY_DN") && !kuAttributesMap.get("LDAP_ENTRY_DN").isEmpty() ? kuAttributesMap.get("LDAP_ENTRY_DN").get(0) : null;
            //String userMatricolaFromKeycloak = kuAttributesMap.containsKey("matricola") && !kuAttributesMap.get("matricola").isEmpty() ? kuAttributesMap.get("matricola").get(0) : null;
            String userRoleFromKeycloak = kuAttributesMap.containsKey("role_for_protocollo") && !kuAttributesMap.get("role_for_protocollo").isEmpty() ? kuAttributesMap.get("role_for_protocollo").get(0) : null;
            String userSidRoleFromKeycloak = kuAttributesMap.containsKey("role_for_sid") && !kuAttributesMap.get("role_for_sid").isEmpty() ? kuAttributesMap.get("role_for_sid").get(0) : null;

            String[] userSidRolesFromKeycloak;
            if (userSidRoleFromKeycloak != null && userSidRoleFromKeycloak.contains("-")) {
                userSidRolesFromKeycloak = userSidRoleFromKeycloak.split("-");
            }
            else if (userSidRoleFromKeycloak != null && userSidRoleFromKeycloak.contains(";")) {
                userSidRolesFromKeycloak = userSidRoleFromKeycloak.split(";");
            }
            else if (userSidRoleFromKeycloak != null) {
                userSidRolesFromKeycloak = new String[] {userSidRoleFromKeycloak};
            } else {
                userSidRolesFromKeycloak = null;
            }

            int NEW_ROLES_LENGTH = 2;
            List<String> PI_OLD_ROLES = List.of("protocollatore", "archivista", "contributore", "coordinatore", "vicecoordinatore");

            boolean isOldPermissionsManagement = userRoleFromKeycloak == null || userRoleFromKeycloak.isEmpty() || PI_OLD_ROLES.contains(userRoleFromKeycloak.toLowerCase());

            /**
             * NOTA: keycloak effettua il trim dell'attributo,
             * per cui si possono perdere i primi due caratteri per il protocollo che dovrebbero essere due spazi vuoti
             */
            if (!isOldPermissionsManagement) {
                if (!userRoleFromKeycloak.startsWith("P")) {
                    userRoleFromKeycloak = "  " + userRoleFromKeycloak;
                }
            }

            String rolePIFromAd = userRoleFromKeycloak != null && userRoleFromKeycloak.length() >= NEW_ROLES_LENGTH ? userRoleFromKeycloak.substring(0, NEW_ROLES_LENGTH) : null;
            String roleSIDFromAd = userRoleFromKeycloak != null && userRoleFromKeycloak.length() >= NEW_ROLES_LENGTH * 2 ? userRoleFromKeycloak.substring(NEW_ROLES_LENGTH, 2*NEW_ROLES_LENGTH) : null;

            String cdrFromSSO = userUseAttributeForOfficeMapping != null && userUseAttributeForOfficeMapping.equalsIgnoreCase("department") ? userService.getCdrFromKeycloakDepartment(userDepartmentFromKeycloak) : userService.getCdrFromKeylcoakCdr(userCdrFromKeycloak);

            if (cdrFromSSO == null) {
                //nessun cdr trovato in SSO
                log.error("NESSUN CDR REGISTRATO IN DATABASE PER IL CDR FORNITO {} - utente: {}", userCdrFromKeycloak, ku.getUsername());
                continue;
            }

            Long localOfficeId = localOfficesMap.getOrDefault(cdrFromSSO, null);
            if (localOfficeId == null) {
                //nessun cdr di SSO corrisponde a quelli in db
                log.error("NESSUN CDR REGISTRATO IN MAPPING SSO TROVATO {}", cdrFromSSO);
                continue;
            }

            String finalUserRoleFromKeycloak = userRoleFromKeycloak;
            List<Role> existingApplicationRolesFromKeycloakRole = applicationRoles.stream().filter(ar -> {
                if (isSyncrhonizingSid) {
                    if (!isOldPermissionsManagement) {
                        if (roleSIDFromAd == null || roleSIDFromAd.isBlank()) return false;
                        if (roleSIDFromAd.equalsIgnoreCase(ar.name)) return true;
                        if (ar.name.equalsIgnoreCase("redattore") && roleSIDFromAd.equalsIgnoreCase("s1")) return true;
                        if (ar.name.equalsIgnoreCase("redattore") && roleSIDFromAd.equalsIgnoreCase("s3")) return true;
                        if (ar.name.equalsIgnoreCase("responsabileprocedimento") && roleSIDFromAd.equalsIgnoreCase("s2")) return true;
                        if (ar.name.equalsIgnoreCase("responsabileprocedimento") && roleSIDFromAd.equalsIgnoreCase("s3")) return true;
                        return false;
                    }

                    if (userSidRoleFromKeycloak == null || userSidRoleFromKeycloak.isEmpty() ) return false;
                    if (userSidRoleFromKeycloak.equalsIgnoreCase(ar.name)) return true;
                    if (ar.name.equalsIgnoreCase("responsabileprocedimento") && userSidRoleFromKeycloak.equalsIgnoreCase("responsabile")) return true;

                    if (userSidRolesFromKeycloak != null) {
                        for(int i=0;i<userSidRolesFromKeycloak.length;i++) {
                            if (userSidRolesFromKeycloak[i].equalsIgnoreCase(ar.name)) return true;
                            if (ar.name.equalsIgnoreCase("responsabileprocedimento") && userSidRolesFromKeycloak[i].equalsIgnoreCase("responsabile")) return true;
                        }
                    }

                    return false;
                }

                if (!isOldPermissionsManagement) {
                    if (rolePIFromAd == null || rolePIFromAd.isBlank()) {
                        return ar.name.equalsIgnoreCase("utente");
                    }
                    if (rolePIFromAd.equalsIgnoreCase(ar.name)) return true;
                    if (ar.name.equalsIgnoreCase("archivista") && rolePIFromAd.equalsIgnoreCase("p1")) return true;
                    if (ar.name.equalsIgnoreCase("archivista") && rolePIFromAd.equalsIgnoreCase("p2")) return true;
                    if (ar.name.equalsIgnoreCase("protocollatore") && rolePIFromAd.equalsIgnoreCase("p3")) return true;
                    return false;
                }

                //1. ruolo utente
                if ( (finalUserRoleFromKeycloak == null || finalUserRoleFromKeycloak.isEmpty() ) && (ar.name.equalsIgnoreCase("utente")) ) return true;
                if (finalUserRoleFromKeycloak == null || finalUserRoleFromKeycloak.isEmpty()) return false;
                //2. ruolo che combacia
                if (finalUserRoleFromKeycloak.equalsIgnoreCase(ar.name)) return true;
                if (ar.name.equalsIgnoreCase("protocollatore")) {
                    if (finalUserRoleFromKeycloak.equalsIgnoreCase("CONTRIBUTORE"))
                        return true;
                }
                if (ar.name.equalsIgnoreCase("archivista")) {
                    if (finalUserRoleFromKeycloak.equalsIgnoreCase("COORDINATORE") ||
                            finalUserRoleFromKeycloak.equalsIgnoreCase("VICECOORDINATORE")
                    )
                        return true;
                }

                return false;
            }).collect(Collectors.toList());

            //if (existingApplicationRolesFromKeycloakRole.isEmpty()) {
            //    log.info(ku.getFederationLink()+" - " + ku.getUsername()+" : " + userRoleFromKeycloak + " - " + userSidRoleFromKeycloak);
            //}
            //if (1 == 1) continue;

            if(localUsers.stream().noneMatch(lu -> ku.getUsername().equals(lu.username))) {

                //1. nuovo utente aggiunto a DB
                User newUser = new User(ku.getUsername(), ku.getFirstName(), ku.getLastName(), ku.getId(), ku.getEmail());
                newUser.setEnabled(ku.isEnabled());
                newUser.persist();

                //2. associazione utente -> ufficio
                userService.addUserToOffice(newUser.id, localOfficeId);

                //3. associazione utente -> ruolo

                //se non esiste il permesso tornato da keycloak, non si aggiunge il permesso all'utente
                for(Role existingApplicationRoleFromKeycloakRole : existingApplicationRolesFromKeycloakRole) {
                    // c'è il ruolo tornato da keycloak per quell'utente --> si aggiunge il permesso al nuovo utente
                    Permit permit = permitMpper.createPermission(new CreatePermissionBean(newUser.id, localOfficeId, existingApplicationRoleFromKeycloakRole.id));
                    permit.application_id = applicationId;
                    permit.type = PermitType.TRANSIENT; //tipo transient
                    permit.persist();

                    UserHistory userHistory = new UserHistory();
                    userHistory.record_type = RecordType.PERM;
                    userHistory.office_id = permit.office_id;
                    userHistory.user_id = permit.user_id;
                    userHistory.role_id = permit.role_id;
                    userHistory.type = permit.type;
                    userHistory.permit_id = permit.id;
                    userHistory.persist();
                }
            }
            else {
                User user = User.find("auth_id", ku.getId()).firstResult();

                if (user == null) {
                    log.info("Nuovo utente inserito per username e auth id: {} - {}", ku.getUsername(), ku.getId());
                    user = new User(ku.getUsername(), ku.getFirstName(), ku.getLastName(), ku.getId(), ku.getEmail());
                    user.setEnabled(ku.isEnabled());
                    user.persistAndFlush();
                }
                else if (user.getEmail() == null || user.getEmail().isEmpty()) {
                    user.setEmail(ku.getEmail());
                    user.setEnabled(ku.isEnabled());
                    user.persistAndFlush();
                }
                else if (user.getEnabled() != ku.isEnabled()) {
                    user.setEnabled(ku.isEnabled());
                    user.persistAndFlush();
                }
                List<UserOffice> localUserOffices = user.getUserOffices();

                UserOffice userOffice = user.getUserOffices().stream().filter(luo -> Objects.equals(localOfficeId, luo.office_id) )
                        .findFirst().orElse(null);

                if (userOffice == null) {
                    //1. utente non inserito nell'ufficio -> aggiungere!
                    userService.addUserToOffice(user.id, localOfficeId);

                    //IMPORTANTE: si rimuovono tutti i permessi transienti dell'utente per l'applicazione desiderata!
                    List<Permit> transientPermitsToRemove = Permit.findByUserIdAndApplicationIdAndType(user.id, applicationId, PermitType.TRANSIENT);
                    for(Permit transientPermit : transientPermitsToRemove) {
                        transientPermit.delete();
                    }

                    //2. associazione utente -> ruolo
                    for (Role existingApplicationRoleFromKeycloakRole : existingApplicationRolesFromKeycloakRole) {
                        // c'è il ruolo tornato da keycloak per quell'utente --> si aggiunge il permesso al nuovo utente
                        Permit permit = permitMpper.createPermission(new CreatePermissionBean(user.id, localOfficeId, existingApplicationRoleFromKeycloakRole.id));
                        permit.application_id = applicationId;
                        permit.type = PermitType.TRANSIENT;
                        permit.persist();

                        UserHistory userHistory = new UserHistory();
                        userHistory.record_type = RecordType.PERM;
                        userHistory.office_id = permit.office_id;
                        userHistory.user_id = permit.user_id;
                        userHistory.role_id = permit.role_id;
                        userHistory.type = permit.type;
                        userHistory.permit_id = permit.id;
                        userHistory.persist();
                    }
                }
                else {

                    //utente associato all'ufficio



                    //si prendono tutti i permessi dell'utente per l'applicazione desiderata!
                    List<Permit> permitsToRemove = Permit.findByUserIdAndApplicationId(user.id, applicationId);

                    for(Permit transientPermit : permitsToRemove) {
                        if (!transientPermit.type.equals(PermitType.TRANSIENT))
                            continue;

                        boolean canRemoveRole = true;
                            for(Role existingRole : existingApplicationRolesFromKeycloakRole) {
                            if (transientPermit.office_id.equals(localOfficeId) && transientPermit.role_id.equals(existingRole.id)) {
                                canRemoveRole = false;
                                    break;
                                }
                            }
                        if (canRemoveRole) {
                            transientPermit.delete();
                        }
                    }

                    Set<Long> roleIdsToAdd = new HashSet<>();
                    for(Role existingRole : existingApplicationRolesFromKeycloakRole) {
                        boolean addNewRole = true;
                        for(Permit transientPermit : permitsToRemove) {
                            if (transientPermit.office_id.equals(localOfficeId) && transientPermit.role_id.equals(existingRole.id)) {
                                addNewRole = false;
                                break;
                            }
                        }
                        if (addNewRole) roleIdsToAdd.add(existingRole.id);
                    }

                    for (Long roleIdToAdd : roleIdsToAdd) {
                        //utente non ha il permesso richiesto per la coppia <ufficio, application>
                        Permit permit = permitMpper.createPermission(new CreatePermissionBean(user.id, localOfficeId, roleIdToAdd));
                        permit.application_id = applicationId;
                        permit.type = PermitType.TRANSIENT;
                        permit.persist();

                        UserHistory userHistory = new UserHistory();
                        userHistory.record_type = RecordType.PERM;
                        userHistory.office_id = permit.office_id;
                        userHistory.user_id = permit.user_id;
                        userHistory.role_id = permit.role_id;
                        userHistory.type = permit.type;
                        userHistory.permit_id = permit.id;
                        userHistory.persist();
                    }
                }
            }
        }

        synchBean.setSuccess(true);
        return synchBean;
    }


    /**
     * Metodo che ritorna una lista di utenti che hanno almeno un ruolo per l'applicazione scelta
     * @param applicationId
     * @param user_filter
     * @param office_filter
     * @return
     */
    @GET
    @Path("/{application_id}/search_users")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserApplicationOfficesDTO> collectUsersByApplication(@PathParam("application_id") Long applicationId,
                                                                     @QueryParam("code") @DefaultValue("") String code,
                                                                     @QueryParam("user_filter") @DefaultValue("") String user_filter,
                                                                     @QueryParam("office_filter") @DefaultValue("") String office_filter) {

        String query = "SELECT o.code as cdr_code, o.\"name\" as cdr, o.short_description, ua.username, ua.firstname, ua.lastname, ua.auth_id, ua.email, r.\"name\" as role from user_account ua";
        query += " inner join user_office uo on (ua.id = uo.user_id) inner join office o on (uo.office_id = o.id)";
        query += " inner join permit p on (p.user_id  = ua.id AND p.office_id = uo.office_id) inner join \"role\" r on (r.id = p.role_id)";

        query += " where";
        query += " p.application_id = :application_id and ua.id in (select distinct p.user_id from permit p where p.application_id = :application_id)";

        if (office_filter != null && !office_filter.isEmpty()) {
            query += " and ( lower(o.short_description) like :office_filter or lower(o.name) like :office_filter )";
        }

        if (code != null && !code.isEmpty()) {
            query += " and o.code = :code ";
        }

        if (user_filter != null && !user_filter.isEmpty()) {
            query += " and ( lower(ua.username) like :user_filter or lower(ua.lastname) like :user_filter or lower(ua.firstname) like :user_filter )";
        }

        query += " ORDER BY ua.lastName, ua.firstName";
        Query nativeQuery = em.createNativeQuery(query);
        nativeQuery.setParameter("application_id", applicationId);
        if (user_filter != null && !user_filter.isEmpty()) {
            nativeQuery.setParameter("user_filter", "%"+user_filter.toLowerCase()+"%");
        }
        if (code != null && !code.isEmpty()) {
            nativeQuery.setParameter("code", code);
        }
        if (office_filter != null && !office_filter.isEmpty()) {
            nativeQuery.setParameter("office_filter", "%"+office_filter.toLowerCase()+"%");
        }
        List<Object[]> results = nativeQuery.getResultList();

        List<UserApplicationOfficesDTO> userApplicationOfficesDTOList = new ArrayList<>();
        for(Object[] result : results) {
            String cdrCode = result[0] != null ? result[0].toString() : null;
            String username = result[3] != null ? result[3].toString() : null;
            String firstName = result[4] != null ? result[4].toString() : null;
            String lastName = result[5] != null ? result[5].toString() : null;
            String authId = result[6] != null ? result[6].toString() : null;
            String email = result[7] != null ? result[7].toString() : null;
            String role = result[8] != null ? result[8].toString() : null;

            if (userApplicationOfficesDTOList.isEmpty()) {
                UserApplicationOfficesDTO uaDto = new UserApplicationOfficesDTO();
                uaDto.addCdrCode(cdrCode, role);
                uaDto.authId = authId;
                uaDto.username = username;
                uaDto.firstName = firstName;
                uaDto.lastName = lastName;
                uaDto.email = email;
                userApplicationOfficesDTOList.add(uaDto);
            }
            else {
                UserApplicationOfficesDTO ua = userApplicationOfficesDTOList.get(userApplicationOfficesDTOList.size() - 1);
                if (ua.authId.equalsIgnoreCase(authId)) {
                    ua.addCdrCode(cdrCode, role);
                }
                else {
                    UserApplicationOfficesDTO uaDto = new UserApplicationOfficesDTO();
                    uaDto.addCdrCode(cdrCode, role);
                    uaDto.authId = authId;
                    uaDto.username = username;
                    uaDto.firstName = firstName;
                    uaDto.lastName = lastName;
                    uaDto.email = email;
                    userApplicationOfficesDTOList.add(uaDto);
                }
            }
        }

        return userApplicationOfficesDTOList;
    }

    /**
     * La funzione prende gli admin dell'applicazione e associa loro tutti gli uffici,
     * assegnando per ogni ufficio il ruolo passato come parametro
     */
    @POST
    @Path("/{application_id}/{role_id}/sync_admins_with_offices")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @TransactionConfiguration(timeout = 180)
    public boolean syncAdminsForApplications(@PathParam("application_id") Long applicationId, @PathParam("role_id") Long role_id) {

        List<User> admins = get_admins_for_application(applicationId);
        List<Office> localOffices = Office.find("deleted_permanent = false").list();
        Role role_to_add = Role.findById(role_id);
        if (role_to_add == null) {
            return false;
        }
        log.info("Inizio sincronizzazione permessi e uffici per utenti admin per applicazione {}", applicationId);
        for(User admin : admins) {
            List<UserOffice> uos = admin.getUserOffices();

            log.info("Sincronizzazione permesso per utente admin {}", admin.getUsername());
            for(Office o : localOffices) {
                boolean officeFound = false;
                boolean roleFound = false;
                for(UserOffice uo : uos) {
                    if (Objects.equals(uo.office_id, o.id)) {
                        officeFound = true;
                        roleFound = uo.getRoles(applicationId).stream().anyMatch(r -> Objects.equals(r.id, role_id));
                    }
                }

                //ufficio non trovato -> si aggiunge l'ufficio all'utente ed il ruolo
                if (!officeFound) {
                    log.info("Aggiunta ufficio {} ad utente admin {}", o.name, admin.getUsername());

                    userService.addUserToOffice(admin.id, o.id);

                    log.info("Aggiunta ruolo {} per ufficio {} ad utente admin {}", role_to_add.name, o.name, admin.getUsername());
                    Permit permit = permitMpper.createPermission(new CreatePermissionBean(admin.id, o.id, role_id));
                    permit.application_id = applicationId;
                    permit.type = PermitType.PERSISTENT;
                    permit.persist();

                    UserHistory userHistory = new UserHistory();
                    userHistory.record_type = RecordType.PERM;
                    userHistory.office_id = permit.office_id;
                    userHistory.user_id = permit.user_id;
                    userHistory.role_id = permit.role_id;
                    userHistory.type = permit.type;
                    userHistory.permit_id = permit.id;
                    userHistory.persist();
                }
                else if (!roleFound) {

                    log.info("Aggiunta ruolo {} per ufficio {} ad utente admin {}", role_to_add.name, o.name, admin.getUsername());


                    Permit permit = permitMpper.createPermission(new CreatePermissionBean(admin.id, o.id, role_id));
                    permit.application_id = applicationId;
                    permit.type = PermitType.PERSISTENT;
                    permit.persist();

                    UserHistory userHistory = new UserHistory();
                    userHistory.record_type = RecordType.PERM;
                    userHistory.office_id = permit.office_id;
                    userHistory.user_id = permit.user_id;
                    userHistory.role_id = permit.role_id;
                    userHistory.type = permit.type;
                    userHistory.permit_id = permit.id;
                    userHistory.persist();
                }
            }
        }
        log.info("Fine sincronizzazione permessi e uffici per utenti admin per applicazione {}", applicationId);
        return true;
    }
}

