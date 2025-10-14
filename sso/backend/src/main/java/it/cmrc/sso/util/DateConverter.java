package it.cmrc.sso.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;


public class DateConverter implements LoggingUtilInterface{

    private String pattern = "yyyy-MM-dd'T'HH:mm:ss";

    public DateConverter() {
    }

    public DateConverter(String pattern) {
        this.pattern = pattern;
    }

    public Date toDateOrNull(String date){
        if(date == null)
            return null;
        try {
            return new SimpleDateFormat(pattern).parse(date);
        } catch (ParseException e) {
            warn("Impossible to parse date {} to Date.. Returning null.", date);
        }
        return null;
    }

    public String toStringOrNull(Date date){
        if(date == null)
            return null;
        return new SimpleDateFormat(pattern).format(date);
    }

    public static String getDates(Date date){
        if(date == null)
            return null;
        return new SimpleDateFormat("dd/MM/yyyy").format(date);
    }

    public static String getHours(Date date){
        if(date == null)
            return null;
        return new SimpleDateFormat("HH:mm").format(date);
    }

    public static int placeNullToMinCompareTo(Date date, Date anotherDate) {
        long thisTime = (date == null) ? 0 : date.getTime();
        long anotherTime = (anotherDate == null) ? 0 : anotherDate.getTime();
        return thisTime < anotherTime ? -1 : (thisTime == anotherTime ? 0 : 1);
    }

    public static int placeNullToMaxCompareTo(Date date, Date anotherDate) {
        long thisTime = (date == null) ? Long.MAX_VALUE : date.getTime();
        long anotherTime = (anotherDate == null) ? Long.MAX_VALUE : anotherDate.getTime();
        return thisTime < anotherTime ? -1 : (thisTime == anotherTime ? 0 : 1);
    }

}
