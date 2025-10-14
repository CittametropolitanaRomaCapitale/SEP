package it.cmrc.sso.mapper;

import it.cmrc.sso.beans.OfficeInput;
import it.cmrc.sso.entity.Office;
import it.cmrc.sso.mapper.common.DateStringConverterInterface;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface OfficeMapper extends DateStringConverterInterface {


    @Mapping(target = "office_start_date", ignore = true)
    @Mapping(target = "office_end_date", ignore = true)
    @Mapping(target = "last_update", ignore = true)
    @Mapping(target = "deleted", constant = "false")
    @Mapping(target = "deleted_permanent", constant = "false")
    @Mapping(target = "id", ignore = true)
    Office toEntity(OfficeInput officeInput);

}
