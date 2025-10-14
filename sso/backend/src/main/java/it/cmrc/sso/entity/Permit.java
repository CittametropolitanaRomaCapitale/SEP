package it.cmrc.sso.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.cmrc.sso.entity.common.PanacheCustomEntity;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.entity.common.RecordType;
import it.cmrc.sso.util.DateConverter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;

import javax.enterprise.inject.spi.CDI;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.transaction.UserTransaction;
import java.util.*;
import java.util.stream.Collectors;

@EqualsAndHashCode(callSuper = true)
@Entity(name = "permit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permit extends PanacheCustomEntity {

    public Long father_permit_id;

    public Long application_id;

    public Long delegation_id;

    public Long user_id;

    public Long office_id;

    public Long role_id;

    @Enumerated(EnumType.STRING)
    public PermitType type;

    public Permit getFather(){
        if(father_permit_id == null)
            return null;
        return Permit.findById(father_permit_id);
    }

    public String getOfficeName(){
        Office office = Office.findById(office_id);
        return office.name;
    }

    public void post_persist(Date delegation_start, Date delegation_end) {
        ObjectMapper objectMapper = new ObjectMapper();

        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        User u = User.findById(user_id);
        UserResource userResource = realmResource.users().get(u.auth_id);
        UserRepresentation user = userResource.toRepresentation();
        Map<String, List<String>> attr = Optional.ofNullable(user.getAttributes()).orElse(new HashMap<>());


        Role role = Role.findById(role_id);
        Office office = Office.find("id = :oid and deleted = false and deleted_permanent = false", Map.of("oid", office_id)).firstResult();

        if(type.equals(PermitType.PERSISTENT)){
            List<String> roles = Optional.ofNullable(attr.get("roles")).orElse(new ArrayList<>());
            Map<String, String> pers_data = new HashMap<>();
            pers_data.put("id", id.toString());
            pers_data.put("role", role.getFull_name());
            pers_data.put("office", office.name);
            try {
                List<String> finalRoles = roles.stream().filter(r -> !getIdFromStringedPermit(objectMapper, r).equals(id)).collect(Collectors.toList());
                finalRoles.add(objectMapper.writeValueAsString(pers_data));

                attr.put("roles", finalRoles);
                userResource.roles().realmLevel().add(realmResource.roles().list().parallelStream()
                        .filter(r -> role.getFull_name().equals(r.getName()))
                        .collect(Collectors.toList()));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        } else if(type.equals(PermitType.DELEGATION)){
            if(office != null){
                List<String> delegations = Optional.ofNullable(attr.get("delegations")).orElse(new ArrayList<>());
                Map<String, String> del_data = new HashMap<>();
                del_data.put("id", id.toString());
                del_data.put("role", role.getFull_name());
                del_data.put("office", office.name);
                DateConverter dateConverter = new DateConverter("dd MMM yyyy HH:mm:ss z");
                del_data.put("start", dateConverter.toStringOrNull(delegation_start));
                del_data.put("expire", dateConverter.toStringOrNull(delegation_end));
                try {
                    List<String> finalDelegations = delegations.stream().filter(d -> !id.equals(getIdFromStringedPermit(objectMapper, d))).collect(Collectors.toList());
                    finalDelegations.add(objectMapper.writeValueAsString(del_data));
                    attr.put("delegations", finalDelegations);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }

        user.setAttributes(attr);
        //userResource.update(user);
//        super.persist();
    }

    private Long getIdFromStringedPermit(ObjectMapper objectMapper, String permit){
        try{
            return Optional.ofNullable(objectMapper.readValue(permit, Map.class).get("id"))
                    .map(Object::toString)
                    .map(Long::parseLong)
                    .orElse(null);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public void persistAndFlush(Date delegation_start, Date delegation_end) {
        if(!type.equals(PermitType.DELEGATION)){
            throw new RuntimeException("Cannot perform delegation persist on persistent type permit");
        }
        persist();
        flush();
        post_persist(delegation_start, delegation_end);
    }

    public void persistAndFlush() {
        if ( (!type.equals(PermitType.PERSISTENT)) && (!type.equals(PermitType.TRANSIENT)) ) {
            throw new RuntimeException("Cannot perform classic persist on delegation type permit");
        }
        persist();
        flush();
        post_persist(null, null);
    }

    public static void addPermitsToRealm(List<Permit> permits){
        ObjectMapper objectMapper = new ObjectMapper();

        permits.forEach(p -> {
            RealmResource realmResource = CDI.current().select(RealmResource.class).get();
            User u = User.findById(p.user_id);
            UserResource userResource = realmResource.users().get(u.auth_id);
            UserRepresentation user = userResource.toRepresentation();
            Map<String, List<String>> attr = Optional.ofNullable(user.getAttributes()).orElse(new HashMap<>());
            if(attr == null){
                attr = new HashMap<>();
            }

            Role role = Role.findById(p.role_id);
            Office office = Office.find("id = :oid and deleted = false", Map.of("oid", p.office_id)).firstResult();

            if(p.type.equals(PermitType.PERSISTENT)){
                List<String> roles = Optional.ofNullable(attr.get("roles")).orElse(new ArrayList<>());
                Map<String, String> pers_data = new HashMap<>();
                pers_data.put("id", p.id.toString());
                pers_data.put("role", role.getFull_name());
                pers_data.put("office", office.name);
                try {
                    roles.add(objectMapper.writeValueAsString(pers_data));
                    attr.put("roles", roles);
                    userResource.roles().realmLevel().add(realmResource.roles().list().parallelStream()
                            .filter(r -> role.getFull_name().equals(r.getName()))
                            .collect(Collectors.toList()));
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            } else if (p.type.equals(PermitType.DELEGATION)) {
                Delegation delegation = Delegation.findById(p.delegation_id);
                List<String> delegations = Optional.ofNullable(attr.get("delegations")).orElse(new ArrayList<>());
                Map<String, String> del_data = new HashMap<>();
                del_data.put("id", p.id.toString());
                del_data.put("role", role.getFull_name());
                del_data.put("office", office.name);
                DateConverter dateConverter = new DateConverter("dd MMM yyyy HH:mm:ss z");
                del_data.put("start", dateConverter.toStringOrNull(delegation.delegation_start));
                del_data.put("expire", dateConverter.toStringOrNull(delegation.delegation_end));
                try {
                    delegations.add(objectMapper.writeValueAsString(del_data));
                    attr.put("delegations", delegations);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }

            user.setAttributes(attr);
            //userResource.update(user);
        });
    }

    @Override
    public void delete() {
        ObjectMapper objectMapper = new ObjectMapper();
        RealmResource realmResource = CDI.current().select(RealmResource.class).get();
        User u = User.findById(user_id);
        UserResource userResource = realmResource.users().get(u.auth_id);
        UserRepresentation user = userResource.toRepresentation();
        Map<String, List<String>> attr = Optional.ofNullable(user.getAttributes()).orElse(new HashMap<>());
        if(attr == null){
            attr = new HashMap<>();
        }

        if(type.equals(PermitType.PERSISTENT)){
            List<String> roles = Optional.ofNullable(attr.get("roles")).orElse(new ArrayList<>());
            List<String> updatedRoles = new ArrayList<>();
            List<String> deleteRoles = new ArrayList<>();

            for (String r : roles) {
                try {
                    Map<String, Object> p = objectMapper.readValue(r, Map.class);
                    if (!p.get("id").equals(id.toString())) {
                        updatedRoles.add(r);
                    } else {
                        deleteRoles.add(p.get("role").toString());
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
            attr.put("roles", updatedRoles);

            userResource.roles().realmLevel().remove(realmResource.roles().list().parallelStream()
                    .filter(r -> deleteRoles.contains(r.getName()))
                    .collect(Collectors.toList()));

        } else if(type.equals(PermitType.DELEGATION)) {
            List<String> delegations = Optional.ofNullable(attr.get("delegations")).orElse(new ArrayList<>());
            List<String> updatedDelegations = new ArrayList<>();

            for (String r : delegations) {
                try {
                    Map<String, Object> p = objectMapper.readValue(r, Map.class);
                    if (!p.get("id").equals(id.toString())) {
                        updatedDelegations.add(r);
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
            attr.put("delegations", updatedDelegations);
        }

        user.setAttributes(attr);
        //userResource.update(user);

        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.INVALIDATE_PERMIT;
        userHistory.permit_id = id;
        userHistory.user_id = user_id;
        userHistory.office_id = office_id;
        userHistory.role_id = role_id;
        userHistory.persist();

        super.delete();
    }

    public static void removePermitFromKeycloak(List<Permit> permits){
        for (Permit permit : permits) {
            ObjectMapper objectMapper = new ObjectMapper();
            RealmResource realmResource = CDI.current().select(RealmResource.class).get();
            User u = User.findById(permit.user_id);
            System.out.println("Searching user for authid " + u.auth_id);
            UserResource userResource = realmResource.users().get(u.auth_id);
            UserRepresentation user = userResource.toRepresentation();
            Map<String, List<String>> attr = Optional.ofNullable(user.getAttributes()).orElse(new HashMap<>());
            if(attr == null){
                attr = new HashMap<>();
            }

            if(permit.type.equals(PermitType.PERSISTENT)){
                List<String> roles = Optional.ofNullable(attr.get("roles")).orElse(new ArrayList<>());
                List<String> updatedRoles = new ArrayList<>();
                List<String> deleteRoles = new ArrayList<>();

                for (String r : roles) {
                    try {
                        Map<String, Object> p = objectMapper.readValue(r, Map.class);
                        if (!p.get("id").equals(permit.id.toString())) {
                            updatedRoles.add(r);
                        } else {
                            deleteRoles.add(p.get("role").toString());
                        }
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
                attr.put("roles", updatedRoles);

                userResource.roles().realmLevel().remove(realmResource.roles().list().parallelStream()
                        .filter(r -> deleteRoles.contains(r.getName()))
                        .collect(Collectors.toList()));

            } else if(permit.type.equals(PermitType.DELEGATION)) {
                List<String> delegations = Optional.ofNullable(attr.get("delegations")).orElse(new ArrayList<>());
                List<String> updatedDelegations = new ArrayList<>();

                for (String r : delegations) {
                    try {
                        Map<String, Object> p = objectMapper.readValue(r, Map.class);
                        if (!p.get("id").equals(permit.id.toString())) {
                            updatedDelegations.add(r);
                        }
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
                attr.put("delegations", updatedDelegations);
            }

            user.setAttributes(attr);
            //userResource.update(user);
        }
    }

    public Role getRole(){
        return Role.findById(role_id);
    }

    @JsonIgnore
    public User getUser(){
        return User.findById(user_id);
    }

    public static Permit findByUserIdAndOfficeIdAndRoleId(Long user_id, Long office_id, Long role_id){
        return Permit.find("user_id = ?1 and office_id = ?2 and role_id = ?3", user_id, office_id, role_id).firstResult();
    }

    public static Permit findByUserIdAndOfficeIdAndRoleIdAndApplicationId(Long user_id, Long office_id, Long role_id, Long application_id){
        return Permit.find("user_id = ?1 and office_id = ?2 and role_id = ?3 and application_id = ?4", user_id, office_id, role_id, application_id).firstResult();
    }

    public static List<Permit> findByUserIdAndApplicationId(Long user_id, Long application_id){
        return Permit.find("user_id = ?1 and application_id = ?2", user_id, application_id).list();
    }

    public static List<Permit> findByUserIdAndApplicationIdAndType(Long user_id, Long application_id, PermitType type){
        return Permit.find("user_id = ?1 and application_id = ?2 and type = ?3", user_id, application_id, type).list();
    }

}
