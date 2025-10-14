package it.cmrc.sso.mapper;

import it.cmrc.sso.beans.DelegationDTO;
import it.cmrc.sso.beans.UserBean;
import it.cmrc.sso.beans.UserOfficeBean;
import it.cmrc.sso.entity.Delegation;
import it.cmrc.sso.entity.User;
import it.cmrc.sso.entity.UserOffice;
import it.cmrc.sso.mapper.common.DateStringConverterInterface;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "cdi")
public interface UserMapper extends DateStringConverterInterface {



    @Mapping(target = "delegations", expression = "java(toDTO(user.getDelegations(), applicationId))")
    @Mapping(target = "delegationsSent", expression = "java(toDTO(user.getDelegationsSent(), applicationId))")
    @Mapping(target = "userOffices", expression = "java(toBean((applicationId == null) ? user.getUserOffices() : user.getUserOffices(applicationId), applicationId))")
    @Mapping(target = "storicUserOffices", expression = "java(toBean((applicationId == null) ? user.getStoricUserOffices() : user.getStoricUserOffices(applicationId), applicationId))")
    UserBean toDTO(User user, Long applicationId);

    default List<DelegationDTO> toDTO(List<Delegation> delegations, Long applicationId){
        return delegations.stream()
                .map(d -> toDTO(d, applicationId))
                .collect(Collectors.toList());
    }

    @Mapping(target = "applicationId", source = "applicationId")
    DelegationDTO toDTO(Delegation delegation, Long applicationId);


    default List<UserOfficeBean> toBean(List<UserOffice> input, Long applicationId){
        return input.stream()
                .map(d -> toBean(d, applicationId))
                .collect(Collectors.toList());
    }


    @Mapping(target = "roles",  expression = "java(applicationId == null ? officeInput.getRoles() : officeInput.getRoles(applicationId))")
    @Mapping(target = "rolesNodeleg",  expression = "java(applicationId == null ? officeInput.getRolesNodeleg() : officeInput.getRolesNodeleg(applicationId))")
    @Mapping(target = "userOfficeRoles",  expression = "java(applicationId == null ? officeInput.getUserOfficeRoles() : officeInput.getUserOfficeRoles(applicationId))")
    @Mapping(target = "userOfficeDelegheInviate",  expression = "java(applicationId == null ? officeInput.getUserOfficeDelegheInviate() : officeInput.getUserOfficeDelegheInviate(applicationId))")
    UserOfficeBean toBean(UserOffice officeInput, Long applicationId);

}
