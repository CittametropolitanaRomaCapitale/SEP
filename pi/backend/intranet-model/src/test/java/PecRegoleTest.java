import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.dto.PecRegoleDTO;
import it.parsec326.pi.intranet.dto.input.PecRegolaFinestraTemporaleInput;
import it.parsec326.pi.intranet.dto.input.PecRegolaInputDTO;
import it.parsec326.pi.intranet.model.PecRegola;
import it.parsec326.pi.intranet.service.PecRegoleService;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class PecRegoleTest {

    @Inject
    PecRegoleService service;

    @Test
    @TestTransaction
    public void saveRegola_savesSuccessfully() {
        PecRegolaInputDTO dto = new PecRegolaInputDTO();
        dto.idEmail = 1L;
        dto.durationMinutes = 60L;
        dto.enabled = true;
        dto.idCategoriaRegola = 1L;
        dto.threshold = 20L;
        dto.finestre = new ArrayList<>();
        PecRegolaFinestraTemporaleInput finestra = new PecRegolaFinestraTemporaleInput();
        finestra.dayOfWeek = 1L;
        finestra.start = LocalTime.of(8, 0).toString();
        finestra.end = LocalTime.of(16, 0).toString();
        PecRegolaFinestraTemporaleInput finestra2 = new PecRegolaFinestraTemporaleInput();
        finestra2.dayOfWeek = 2L;
        finestra2.start = LocalTime.of(8, 0).toString();
        finestra2.end = LocalTime.of(16, 0).toString();
        dto.finestre.add(finestra);
        dto.finestre.add(finestra2);

        assertNotNull(service.saveRegola(dto));
    }

    @Test
    @TestTransaction
    public void deleteRegola_deletesSuccessfully() {
        PecRegolaInputDTO dto = new PecRegolaInputDTO();
        dto.idEmail = 1L;
        dto.durationMinutes = 60L;
        dto.enabled = true;
        dto.idCategoriaRegola = 1L;
        dto.threshold = 20L;
        dto.finestre = new ArrayList<>();
        PecRegolaFinestraTemporaleInput finestra = new PecRegolaFinestraTemporaleInput();
        finestra.dayOfWeek = 1L;
        finestra.start = LocalTime.of(8, 0).toString();
        finestra.end = LocalTime.of(16, 0).toString();
        PecRegolaFinestraTemporaleInput finestra2 = new PecRegolaFinestraTemporaleInput();
        finestra2.dayOfWeek = 2L;
        finestra2.start = LocalTime.of(8, 0).toString();
        finestra2.end = LocalTime.of(16, 0).toString();
        dto.finestre.add(finestra);
        dto.finestre.add(finestra2);

        service.saveRegola(dto);

        assertTrue(service.deleteRegola(dto.idEmail, dto.idCategoriaRegola));
    }

    @Test
    @TestTransaction
    public void searchRegole_returnsSuccessfully() {

        PecRegolaInputDTO dto = new PecRegolaInputDTO();
        dto.idEmail = 1L;
        dto.durationMinutes = 60L;
        dto.enabled = true;
        dto.idCategoriaRegola = 1L;
        dto.threshold = 20L;
        dto.finestre = new ArrayList<>();
        PecRegolaFinestraTemporaleInput finestra = new PecRegolaFinestraTemporaleInput();
        finestra.dayOfWeek = 1L;
        finestra.start = LocalTime.of(8, 0).toString();
        finestra.end = LocalTime.of(16, 0).toString();
        PecRegolaFinestraTemporaleInput finestra2 = new PecRegolaFinestraTemporaleInput();
        finestra2.dayOfWeek = 2L;
        finestra2.start = LocalTime.of(8, 0).toString();
        finestra2.end = LocalTime.of(16, 0).toString();
        dto.finestre.add(finestra);
        dto.finestre.add(finestra2);

        service.saveRegola(dto);

        PecRegola output = service.getForEmailAndCategory(dto.idEmail, dto.idCategoriaRegola);
        assertNotNull(output);
    }
}
