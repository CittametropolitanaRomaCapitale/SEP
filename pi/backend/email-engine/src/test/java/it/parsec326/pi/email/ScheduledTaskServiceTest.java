package it.parsec326.pi.email;

import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.email.pec_queue.EmailProducer;
import it.parsec326.pi.email.resource.PecWorkerResource;
import it.parsec326.pi.email.service.PecProcessService;
import it.parsec326.pi.email.service.ScheduledTaskService;
import it.parsec326.pi.intranet.exception.CustomException;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@QuarkusTest
class ScheduledTaskServiceTest {

    @Inject
    ScheduledTaskService scheduledTaskService;

    PecWorkerResource pecWorkerResource = spy(PecWorkerResource.class);
    EmailProducer producerMock = mock(EmailProducer.class);
    PecProcessService pecProcessServiceMock = mock(PecProcessService.class);

    @BeforeEach
    void setUp() throws Exception {
        when(producerMock.produce()).thenReturn(1);
        this.setField(pecWorkerResource, "producer", producerMock);
        this.setField(pecWorkerResource, "pecProcessService", pecProcessServiceMock);
        scheduledTaskService.setProducerEnabled(true);
        scheduledTaskService.setPecProcessService(pecProcessServiceMock);
    }

    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    @Test
    void pecWorkerResource_TriggersProducerThread() throws InterruptedException {
        scheduledTaskService.producePecTasks();
        verify(pecWorkerResource, times(1)).triggerProducerThread();
    }

    @Test
    void pecWorkerResource_TriggersException() throws InterruptedException {
        doThrow(new RuntimeException("Test Exception")).when(pecWorkerResource).triggerProducerThread();

        assertThrows(CustomException.class, () -> {
            scheduledTaskService.producePecTasks();
        });
    }
}
