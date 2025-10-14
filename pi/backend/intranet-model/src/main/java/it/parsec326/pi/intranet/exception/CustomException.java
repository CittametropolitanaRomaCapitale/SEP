package it.parsec326.pi.intranet.exception;

import graphql.ErrorType;
import graphql.GraphQLError;
import graphql.language.SourceLocation;
import jakarta.ws.rs.core.Response;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CustomException extends RuntimeException implements GraphQLError {

    private final static Logger log = LoggerFactory.getLogger(CustomException.class);

    private final ErrorCode errorCode;

    private final int errorCodeNumber;

    @Getter
    private final Object[] data;

    public CustomException(ErrorCode errorCode, String errorMessage, Object[] data) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorCodeNumber = errorCode.code;
        this.data = data;
    }

    public CustomException(int errorCode, String errorMessage, Object[] data) {
        super(errorMessage);
        this.errorCode = ErrorCode.OTHER;
        this.errorCodeNumber = errorCode;
        this.data = data;
    }

    public CustomException(ErrorCode errorCode, Throwable t) {
        super(t);
        if(t instanceof CustomException){
            this.data = ((CustomException)t).getData();
        } else {
            this.data = null;
        }
        this.errorCode = errorCode;
        this.errorCodeNumber = errorCode.code;
    }

    @Override
    public Map<String, Object> getExtensions() {
        Map<String, Object> customAttributes = new LinkedHashMap<>();
        String parsedErrorMessage = parseErrorMessage(this.getMessage(), this.data);
        String stackTrace = getCauseStackTrace();

        customAttributes.put("errorCode", this.errorCodeNumber);
        customAttributes.put("classification", this.errorCode.toString());
        customAttributes.put("errorMessage", parsedErrorMessage);
        customAttributes.put("verboseErrorMessage", this.toString());
        customAttributes.put("causedBy", stackTrace);

        log.error(parsedErrorMessage + ": " + stackTrace, this);

        return customAttributes;
    }

    private String getCauseStackTrace(){
        StringBuilder causedBy = new StringBuilder("");
        Throwable t = this.getCause();
        while (t != null){
            causedBy.append(t);
            t = t.getCause();
        }
        return causedBy.toString().isBlank() ? "No Cause!" : causedBy.toString();
    }

    @Override
    public List<SourceLocation> getLocations() {
        return null;
    }

    @Override
    public ErrorType getErrorType() {
        return null;
    }

    public static CustomException get(ErrorCode errorCode, Throwable e){
        return new CustomException(errorCode, e);
    }

    public static CustomException get(ErrorCode errorCode, String errorMessage){
        return new CustomException(errorCode, errorMessage, null);
    }

    public static CustomException get(ErrorCode errorCode, String errorMessage, Object... data){
        return new CustomException(errorCode, errorMessage, data);
    }

    public static CustomException get(int errorCode, String errorMessage){
        return new CustomException(errorCode, errorMessage, null);
    }

    public static CustomException get(int errorCode, String errorMessage, Object... data){
        return new CustomException(errorCode, errorMessage, data);
    }


    private String parseErrorMessage(String errorMessage, Object... data){
        String finalErrMessage = errorMessage;
        if(data != null && data.length > 0){
            for (Object d : data) {
                finalErrMessage = finalErrMessage.replaceFirst("\\{}", ((d == null) ? "null" : d.toString()));
            }
        }
        return finalErrMessage;
    }

    public void boom() throws CustomException{
        throw this;
    }

    public Response restResponse(){
        return Response.status(errorCode.code).entity(getExtensions()).build();
    }

    public enum ErrorCode {

        NOT_FOUND(404),
        UNVAILABLE(503),
        FORBIDDEN(403),
        UNAUTHORIZED(401),
        SQL(999),
        SQL_DDL(998),

        INTERNAL(500),
        BAD_REQUEST(400),
        VALIDATION(505),
        OTHER(000),
        DELETE(506);

        public final int code;

        ErrorCode(int label) {
            this.code = label;
        }
    }

    public static CustomException unimplemented(){
        return CustomException.get(ErrorCode.UNVAILABLE, "Unimplemented method or service invoked!");
    }

    public static String extractPsError(String message){

        // Definisci la regex
        String regex = "\\[(.*?)\\]";

        // Compila il pattern
        Pattern pattern = Pattern.compile(regex);

        // Crea un matcher per la stringa di input
        Matcher matcher = pattern.matcher(message);

        // Trova e stampa il contenuto tra le prime parentesi quadre
        if (matcher.find()) {
           return matcher.group(1);
        } else {
            return message;
        }
    }
}
