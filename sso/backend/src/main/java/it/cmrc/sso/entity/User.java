package it.cmrc.sso.entity;

import it.cmrc.sso.beans.DelegationDTO;
import it.cmrc.sso.entity.common.PanacheCustomEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.Entity;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "user_account")
@Slf4j
public class User extends PanacheCustomEntity {

    public String username;

    public String firstName;

    public String lastName;

    public String auth_id;

    public String email;

    public String note;

    public Boolean enabled;

    @Transient
    public List<String> roles;

    public User(String username, String auth_id) {
        this.username = username;
        this.auth_id = auth_id;
    }

    public User(String username, String firstName, String lastName, String auth_id, String email) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.auth_id = auth_id;
        this.email = email;
    }

    public List<Delegation> getDelegations(){
        return Delegation.find("user_id = :uid and delegation_end > :date and delegation_start < :date", Map.of("uid", id, "date", new Date())).list();
    }

    public List<Delegation> getDelegations(Long cdrCode){
        return Delegation.find("user_id = :uid and delegation_end > :date and delegation_start < :date and cdrCode = :cdrCode", Map.of("uid", id, "date", new Date(), "cdrCode", cdrCode)).list();
    }

    public List<Delegation> getDelegationsSent(){
        return Delegation.find("from_user_id = :uid and delegation_end > :date and delegation_start < :date", Map.of("uid", id, "date", new Date())).list();
    }

    public List<Delegation> getDelegationsSent(Long applicationId){
        return Delegation.find("from_user_id = :uid and delegation_end > :date and delegation_start < :date and applicationId = :applicationId", Map.of("uid", id, "date", new Date(), "applicationId", applicationId)).list();
    }

    public List<UserOffice> getUserOffices(){
        List<UserOffice> offices = UserOffice.find("user_id = :uid and deleted = false", Map.of("uid", id)).list()
                .stream()
                .map(uo -> (UserOffice)uo)
                .filter(uo -> !uo.getOfficeById().deleted_permanent && !uo.getOfficeById().blocked)
                .collect(Collectors.toList());

        getDelegations()
                .stream()
                .filter(p ->
                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
                .flatMap(d -> d.getPermits().stream().map(Permit::getOffice_id))
                .forEach(oid -> {
                    if(offices.stream().noneMatch(uo -> uo.office_id.equals(oid))){
                        offices.add(new UserOffice(id, oid, false));
                    }
                });

//        List<UserOffice> toBeRemoved = new ArrayList<>();
//        getDelegationsSent()
//                .stream()
//                .filter(p ->
//                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
//                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
//                .flatMap(d -> d.getPermits().stream().map(Permit::getOffice_id))
//                .forEach(oid -> {
//                    for(UserOffice uo : offices){
//                        if(uo.office_id.equals(oid)){
//                            toBeRemoved.add(uo);
//                        }
//                    }
//                });
//
//        if(!toBeRemoved.isEmpty())
//            offices.removeAll(toBeRemoved);

        //Se ha almeno una delega attiva, l'utente non deve poter entrare, quindi si resettano gli uffici connessi
//        if(!getDelegationsSent().isEmpty()){
//            log.info("Utente ha delegato i suoi accessi. Lista uffici resettata per impedire l'accesso");
//            return new ArrayList<>();
//        }

        getDelegationsSent()
                .stream()
                .filter(p ->
                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
                .flatMap(d -> d.getPermits().stream().map(Permit::getOffice_id))
                .forEach(oid -> {
                    offices.removeIf(office -> office.getOffice_id().equals(oid));
                });

        return offices;
    }

    public List<UserOffice> getUserOfficesForDelegation(){
        List<UserOffice> offices = UserOffice.find("user_id = :uid and deleted = false", Map.of("uid", id)).list()
                .stream()
                .map(uo -> (UserOffice)uo)
                .filter(uo -> !uo.getOfficeById().deleted_permanent && !uo.getOfficeById().blocked)
                .collect(Collectors.toList());

        return offices;
    }

    public List<UserOffice> getStoricUserOffices(){
        List<UserOffice> offices = UserOffice.find("user_id = :uid", Map.of("uid", id)).list();
        System.out.println("offices : " + offices);
        getDelegations()
                .stream()
                .filter(p ->
                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
                .flatMap(d -> d.getPermits().stream().map(Permit::getOffice_id))
                .forEach(oid -> {
                    if(offices.stream().noneMatch(uo -> uo.office_id.equals(oid))){
                        offices.add(new UserOffice(id, oid, false));
                    }
                });
        return offices;
    }

    public List<UserOffice> getUserOffices(Long applicationId){
        List<Permit> permanentPermits = Permit.find("user_id = :uid and application_id = :aid and type in ('PERSISTENT', 'TRANSIENT')", Map.of("uid", id, "aid", applicationId)).list();
        List<UserOffice> offices = UserOffice.find("user_id = :uid and office_id in :oids and deleted = false", Map.of("uid", id, "oids", permanentPermits.stream().map(Permit::getOffice_id).collect(Collectors.toList()))).list()
                .stream()
                .map(uo -> (UserOffice)uo)
                .filter(uo -> !uo.getOfficeById().deleted_permanent && !uo.getOfficeById().blocked)
                .collect(Collectors.toList());

        getDelegations()
                .stream()
                .filter(p ->
                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
                .flatMap(d -> d.getPermits().stream().filter(p -> applicationId.equals(p.application_id)).map(Permit::getOffice_id))
                .forEach(oid -> {
                    if(offices.stream().noneMatch(uo -> uo.office_id.equals(oid))){
                        offices.add(new UserOffice(id, oid, false));
                    }
                });

//        List<UserOffice> toBeRemoved = new ArrayList<>();
//        getDelegationsSent()
//                .stream()
//                .filter(p ->
//                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
//                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
//                .flatMap(d -> d.getPermits().stream().map(Permit::getOffice_id))
//                .forEach(oid -> {
//                    for(UserOffice uo : offices){
//                        if(uo.office_id.equals(oid)){
//                            toBeRemoved.add(uo);
//                        }
//                    }
//                });
//
//        if(!toBeRemoved.isEmpty())
//            offices.removeAll(toBeRemoved);

        getDelegationsSent()
                .stream()
                .filter(p ->
                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
                .flatMap(d -> d.getPermits().stream().filter(p -> applicationId.equals(p.application_id)).map(Permit::getOffice_id))
                .forEach(oid -> {
                    offices.removeIf(office -> office.getOffice_id().equals(oid));
                });

        return offices;
    }

    public List<UserOffice> getStoricUserOffices(Long applicationId){
        List<Permit> permanentPermits = Permit.find("user_id = :uid and application_id = :aid and type in ('PERSISTENT', 'TRANSIENT')", Map.of("uid", id, "aid", applicationId)).list();
        List<UserOffice> offices = UserOffice.find("user_id = :uid and office_id in :oids", Map.of("uid", id, "oids", permanentPermits.stream().map(Permit::getOffice_id).collect(Collectors.toList()))).list();
        //System.out.println("offices : " + offices);
        getDelegations()
                .stream()
                .filter(p ->
                        ((p.delegation_start == null || p.delegation_start.compareTo(new Date()) <= 0)
                                && (p.delegation_end == null || p.delegation_end.compareTo(new Date()) >= 0)))
                .flatMap(d -> d.getPermits().stream().filter(p -> applicationId.equals(p.application_id)).map(Permit::getOffice_id))
                .forEach(oid -> {
                    if(offices.stream().noneMatch(uo -> uo.office_id.equals(oid))){
                        offices.add(new UserOffice(id, oid, false));
                    }
                });
        return offices;
    }

    public static User findByUsername(String username){
        return User.find("username", username).firstResult();
    }

}
