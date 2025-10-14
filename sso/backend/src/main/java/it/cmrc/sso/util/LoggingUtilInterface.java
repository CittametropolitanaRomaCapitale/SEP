package it.cmrc.sso.util;

import io.smallrye.mutiny.tuples.Tuple2;
import org.slf4j.LoggerFactory;

import javax.enterprise.inject.spi.CDI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public interface LoggingUtilInterface {

    default void info(String message, Object... data){
        Tuple2<String, Object[]> logData = getLogParamList(message, data);
        LoggerFactory.getLogger(this.getClass()).info(logData.getItem1(), logData.getItem2());
    }

    default void warn(String message, Object... data){
        Tuple2<String, Object[]> logData = getLogParamList(message, data);
        LoggerFactory.getLogger(this.getClass()).warn(logData.getItem1(), logData.getItem2());
    }

    default void err(Throwable err, String... message){
        TokenExtractorUtil tokenUtil = CDI.current().select(TokenExtractorUtil.class).get();

        if(message.length > 0) {
            LoggerFactory.getLogger(this.getClass()).error("[ User : " + tokenUtil.extractUserFromToken() + " ] " + message[0], err);
        } else {
            LoggerFactory.getLogger(this.getClass()).error("[ User : " + tokenUtil.extractUserFromToken() + " ] " + err.getMessage(), err);
        }
    }

    default Tuple2<String, Object[]> getLogParamList(String message, Object[] data){
        TokenExtractorUtil tokenUtil = CDI.current().select(TokenExtractorUtil.class).get();
        Tuple2<String, String> userLog = tokenUtil.extractLoggingUserFromToken();
        List<Object> params = new ArrayList<>();
        params.add(userLog.getItem2());
        params.addAll(Arrays.asList(data));
        return Tuple2.of(userLog.getItem1() + message, params.toArray());
    }

}
