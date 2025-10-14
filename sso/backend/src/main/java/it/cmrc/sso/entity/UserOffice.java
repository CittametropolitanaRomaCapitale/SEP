package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import it.cmrc.sso.entity.common.PermitType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@EqualsAndHashCode(callSuper = true)
@Entity(name = "user_office")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOffice extends PanacheCustomEntity {

    public Long user_id;

    public Long office_id;

    public boolean deleted;

    public Office getOffice(){
        return Office.find("id = :oid and deleted_permanent = false", Map.of("oid", office_id)).firstResult();
    }

    public Office getOfficeById(){
        return Office.find("id = :oid", Map.of("oid", office_id)).firstResult();
    }

    public List<Permit> getUserOfficeRoles(){
        return Permit.find("office_id = :oid and user_id = :uid", Map.of("oid", office_id, "uid", user_id)).list();
    }

    public List<Permit> getUserOfficeDelegheInviate(){
        Set<Long> delegations = Permit.find("office_id = :oid and user_id = :uid and type in ('PERSISTENT', 'TRANSIENT')", Map.of("oid", office_id, "uid", user_id)).list().stream()
                .map(p -> (Permit)p)
                .map(p -> p.id)
                .collect(Collectors.toSet());
        return Permit.find("office_id = :oid and father_permit_id in :fdids", Map.of("oid", office_id, "fdids", delegations)).list();
    }

    public List<Permit> getUserOfficeRoles(Long applicationId){
        return Permit.find("office_id = :oid and user_id = :uid and application_id = :aid", Map.of("aid", applicationId, "oid", office_id, "uid", user_id)).list();
    }

    public List<Permit> getUserOfficeDelegheInviate(Long applicationId){
        Set<Long> delegations = Permit.find("office_id = :oid and user_id = :uid and type in ('PERSISTENT', 'TRANSIENT')", Map.of("oid", office_id, "uid", user_id)).list().stream()
                .map(p -> (Permit)p)
                .map(p -> p.id)
                .collect(Collectors.toSet());
        return Permit.find("office_id = :oid and father_permit_id in :fdids and application_id = :aid", Map.of("aid", applicationId, "oid", office_id, "fdids", delegations)).list();
    }


    public List<Role> getRoles(){
        return Role.find(
                "id in :ids",
                Map.of(
                        "ids",
                        Permit.find("office_id = :oid and user_id = :uid", Map.of("oid", office_id, "uid", user_id))
                                .list()
                                .stream()
                                .map(p -> (Permit) p)
                                .filter(p -> {
                                    boolean res = PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type);
                                    if(res){
                                        return true;
                                    } else {
                                        Delegation delegation = Delegation.findById(p.delegation_id);
                                        return ((delegation.delegation_start == null || delegation.delegation_start.compareTo(new Date()) <= 0)
                                                && (delegation.delegation_end == null || delegation.delegation_end.compareTo(new Date()) >= 0));
                                    }
                                })
                                .map(Permit::getRole_id)
                                .collect(Collectors.toList())
                )).list();
    }

    public List<Role> getRoles(Long applicationId){
        return Role.find(
                "id in :ids",
                Map.of(
                        "ids",
                        Permit.find("office_id = :oid and user_id = :uid and application_id = :aid", Map.of("oid", office_id, "uid", user_id, "aid", applicationId))
                                .list()
                                .stream()
                                .map(p -> (Permit) p)
                                .filter(p -> {
                                    boolean res = PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type);
                                    if(res){
                                        return true;
                                    } else {
                                        Delegation delegation = Delegation.findById(p.delegation_id);
                                        return ((delegation.delegation_start == null || delegation.delegation_start.compareTo(new Date()) <= 0)
                                                && (delegation.delegation_end == null || delegation.delegation_end.compareTo(new Date()) >= 0));
                                    }
                                })
                                .map(Permit::getRole_id)
                                .collect(Collectors.toList())
                )).list();
    }

    public List<Role> getRolesNodeleg(){
        return Role.find(
                "id in :ids",
                Map.of(
                        "ids",
                        Permit.find("office_id = :oid and user_id = :uid", Map.of("oid", office_id, "uid", user_id))
                                .list()
                                .stream()
                                .map(p -> (Permit) p)
                                .filter(p -> PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type))
                                .map(Permit::getRole_id)
                                .collect(Collectors.toList())
                )).list();
    }

    public List<Role> getRolesNodeleg(Long applicationId){
        return Role.find(
                "id in :ids",
                Map.of(
                        "ids",
                        Permit.find("office_id = :oid and user_id = :uid and application_id = :aid", Map.of("oid", office_id, "uid", user_id, "aid", applicationId))
                                .list()
                                .stream()
                                .map(p -> (Permit) p)
                                .filter(p -> PermitType.PERSISTENT.equals(p.type) || PermitType.TRANSIENT.equals(p.type))
                                .map(Permit::getRole_id)
                                .collect(Collectors.toList())
                )).list();
    }

    public static UserOffice findByUserIdAndOfficeId(Long user_id, Long office_id){
        return UserOffice.find("user_id = ?1 and office_id = ?2 and deleted = false", user_id, office_id).firstResult();
    }

}
