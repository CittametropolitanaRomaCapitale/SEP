package it.parsec326.pi.intranet.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;

@Slf4j
public class LogUtils {

    private static final String ENTERING = "Entering";
    private static final String EXITING = "Exiting";

    public static final String GENERAZIONE_NUM_PROTOCOLLO_FORMAT = "Generato il numero protocollo: {}";

    public enum LogLevel {
        INFO, DEBUG, TRACE, ERROR, WARN
    }

    private LogUtils() {}

    public static String getCallerInfo() {
        return getCallerInfoInternalForIndex(5);
    }

    private static String getCallerInfoInternal() {
        return getCallerInfoInternalForIndex(4);
    }

    private static String getCallerInfoInternalForIndex(int indexCaller) {
        StackTraceElement stack = Thread.currentThread().getStackTrace()[indexCaller];
        return stack.getClassName() + "." + stack.getMethodName() + "[" + stack.getLineNumber() + "]";
    }

    public static int entering(LogLevel level) {
        if (level.equals(LogLevel.INFO))
            log.info(ENTERING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.DEBUG))
            log.debug(ENTERING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.TRACE))
            log.trace(ENTERING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.ERROR))
            log.error(ENTERING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.WARN))
            log.warn(ENTERING + " " + getCallerInfoInternal());
        return 0;
    }

    public static int exiting(LogLevel level) {
        if (level.equals(LogLevel.INFO))
            log.info(EXITING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.DEBUG))
            log.debug(EXITING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.TRACE))
            log.trace(EXITING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.ERROR))
            log.error(EXITING + " " + getCallerInfoInternal());
        if (level.equals(LogLevel.WARN))
            log.warn(EXITING + " " + getCallerInfoInternal());
        return 0;
    }

    public static int exiting(LogLevel level, Exception e) {
        if (level.equals(LogLevel.INFO))
            log.info(EXITING + " " + getCallerInfoInternal() + ": " + ExceptionUtils.getRootCauseMessage(e), e);
        if (level.equals(LogLevel.DEBUG))
            log.debug(EXITING + " " + getCallerInfoInternal() + ": " + ExceptionUtils.getRootCauseMessage(e), e);
        if (level.equals(LogLevel.TRACE))
            log.trace(EXITING + " " + getCallerInfoInternal() + ": " + ExceptionUtils.getRootCauseMessage(e), e);
        if (level.equals(LogLevel.ERROR))
            log.error(EXITING + " " + getCallerInfoInternal() + ": " + ExceptionUtils.getRootCauseMessage(e), e);
        if (level.equals(LogLevel.WARN))
            log.warn(EXITING + " " + getCallerInfoInternal() + ": " + ExceptionUtils.getRootCauseMessage(e), e);
        return 0;
    }

}
