package it.cmrc.sso.mapper;

import it.cmrc.sso.beans.CreatePermissionBean;
import it.cmrc.sso.beans.PermitOutBean;
import it.cmrc.sso.beans.UpdateDelegationDatesBean;
import it.cmrc.sso.entity.Permit;
import it.cmrc.sso.mapper.common.DateStringConverterInterface;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Date;

@Mapper(componentModel = "cdi")
public interface PermitMapper extends DateStringConverterInterface {


    @Mapping(target = "delegation_id", ignore = true)
    @Mapping(target = "father_permit_id", ignore = true)
    @Mapping(target = "type", constant = "PERSISTENT")
    @Mapping(target = "id", ignore = true)
    Permit createPermission(CreatePermissionBean input);

    @Mapping(target = "year", ignore = true)
    @Mapping(target = "seconds", ignore = true)
    @Mapping(target = "month", ignore = true)
    @Mapping(target = "minutes", ignore = true)
    @Mapping(target = "hours", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "time", source = "delegation_end")
    Date parseEndDate(UpdateDelegationDatesBean input);

    @Mapping(target = "year", ignore = true)
    @Mapping(target = "seconds", ignore = true)
    @Mapping(target = "month", ignore = true)
    @Mapping(target = "minutes", ignore = true)
    @Mapping(target = "hours", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "time", source = "delegation_start")
    Date parseStartDate(UpdateDelegationDatesBean input);


    @Mapping(target = "sent", expression = "java(getSentFlag(refUserId, permit))")
    PermitOutBean toDTO(Long refUserId, Permit permit);

    default boolean getSentFlag(Long refUserId, Permit permit){
        return !permit.user_id.equals(refUserId);
    }

}
