package it.cmrc.sso.mapper.common;


import it.cmrc.sso.util.DateConverter;

import java.util.Date;

public interface DateStringConverterInterface {

    DateConverter dateConverter = new DateConverter();

    default Date toDateOrNull(String date){
        return dateConverter.toDateOrNull(date);
    }

    default Long toTimeOrNull(String date){
        return dateConverter.toDateOrNull(date).getTime();
    }

    default String toStringOrNull(Date date){
        return dateConverter.toStringOrNull(date);
    }

}
