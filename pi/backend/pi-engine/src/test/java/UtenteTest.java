import io.quarkus.test.junit.QuarkusTest;
import it.cmrc.pi.backend.service.UtenteService;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@QuarkusTest
public class UtenteTest {

    @Inject
    UtenteService utenteService;

    @Test
    void service_outputsSuccessfully() {
        assertNotNull(utenteService.forceGetAllUsers());
        assertNotNull(utenteService.forceGetAllOffices());
    }
}
