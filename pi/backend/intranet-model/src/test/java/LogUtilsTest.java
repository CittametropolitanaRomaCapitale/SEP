import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.utils.LogUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
class LogUtilsTest {

    @Test
    public void entering_ReturnsSuccessfully() {
        assertEquals(LogUtils.entering(LogUtils.LogLevel.INFO), 0);
        assertEquals(LogUtils.entering(LogUtils.LogLevel.DEBUG), 0);
        assertEquals(LogUtils.entering(LogUtils.LogLevel.TRACE), 0);
        assertEquals(LogUtils.entering(LogUtils.LogLevel.ERROR), 0);
        assertEquals(LogUtils.entering(LogUtils.LogLevel.WARN), 0);
    }

    @Test
    public void exiting_ReturnsSuccessfully() {
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.INFO), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.DEBUG), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.TRACE), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.ERROR), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.WARN), 0);
    }

    @Test
    public void exiting_ReturnsSuccessfullyWithException() {
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.INFO, new Exception("Test")), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.DEBUG, new Exception("Test")), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.TRACE, new Exception("Test")), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.ERROR, new Exception("Test")), 0);
        assertEquals(LogUtils.exiting(LogUtils.LogLevel.WARN, new Exception("Test")), 0);
    }

}