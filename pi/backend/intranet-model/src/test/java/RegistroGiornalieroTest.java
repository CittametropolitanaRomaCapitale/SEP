import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.client.ConservazioneClient;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.RegistroGiornalieroOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaRegistiGiornalieriDTO;
import it.parsec326.pi.intranet.model.RegistroGiornaliero;
import it.parsec326.pi.intranet.service.*;
import it.parsec326.pi.intranet.utils.MinioConnectionFactory;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@Transactional
public class RegistroGiornalieroTest {
    @Inject
    @Getter
    UserTransaction transaction;
    @Inject
    EntityManager em;
    @Inject
    SSOClient ssoManagerMock;
    @Inject
    DocumentService documentService;
    @Inject
    RegistroGiornalieroService registroGiornalieroService;
    @Inject
    ConservazioneClient conservazioneClient;

    @Mock
    private MinioConnectionFactory minioFactoryMock;
    @Mock
    private DocumentService documentServiceMock;
    @Mock
    private StoricoService storicoServiceMock;
    @Inject
    private ConfigurazioneService configurazioneService;
    @InjectMocks
    private RegistroGiornalieroService registroGiornalieroServiceInject;

    RegistroGiornalieroService registroServiceMock;
    EntityManager emMock = mock(EntityManager.class);
    TitolarioService titolarioServiceMock = mock(TitolarioService.class);

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        titolarioServiceMock = new TitolarioService();
        this.setField(titolarioServiceMock, "em", emMock);
        registroServiceMock = new RegistroGiornalieroService();
        this.setField(registroServiceMock, "em", em);
        this.setField(registroServiceMock, "documentService", documentService);
        this.setField(registroServiceMock, "configurazioneService", configurazioneService);
        this.setField(registroServiceMock, "minioFactory", minioFactoryMock);
        this.setField(registroServiceMock, "storicoService", storicoServiceMock);
        this.setField(registroServiceMock, "conservazioneClient", conservazioneClient);
    }

    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    @Test
    public void testCreateRegistroGiornalieroSuccess() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        String base64Registro = Base64.getEncoder().encodeToString("dummy data".getBytes());
        when(documentServiceMock.getPdfRegistroGiornaliero(any(Date.class))).thenReturn(base64Registro);

        when(minioFactoryMock.uploadFileByBais(anyString(), anyString(), any(), anyLong(), anyLong())).thenReturn(true);

        RegistroGiornaliero mockRegistro = mock(RegistroGiornaliero.class);
        doNothing().when(mockRegistro).persist();

        boolean result = registroGiornalieroServiceInject.createRegistroGiornaliero();
    }

    @Test
    @Transactional
    public void testCreateRegistroGiornalieroWithParErClientSuccess() {
        PanacheMock.mock(RegistroGiornaliero.class);
        @SuppressWarnings("unchecked")
        PanacheQuery<RegistroGiornaliero> queryMock = mock(PanacheQuery.class);
        when(RegistroGiornaliero.find(anyString(), any(Object[].class))).thenReturn((PanacheQuery) queryMock);
        when(queryMock.count()).thenReturn(0L);
        when(minioFactoryMock.uploadFileByBais(anyString(), anyString(), any(), anyLong(), anyLong())).thenReturn(true);
        doNothing().when(storicoServiceMock).insertNewStoricoForIdRegistroGiornalieroWithUtenteSistema(any(), anyString(), anyString());

        registroServiceMock.createRegistroGiornaliero();
    }

    @Test
    public void testGetRegistroGiornaliero() {
        // Costruire il DTO di input con i criteri di ricerca
        RicercaRegistiGiornalieriDTO dto = new RicercaRegistiGiornalieriDTO();
        dto.setSearch("file1");
        dto.setPage(0);
        dto.setSize(10);

        RegistroGiornalieroOutputDTO output = registroGiornalieroService.getRegistroGiornaliero(dto);

        assertNotNull(output);
        assertEquals("file1.pdf", output.getRegistri().get(0).getFile());
    }

    @Test
    @TestTransaction
    public void testGetRegistroGiornaliero_ConFiltri() {
        RicercaRegistiGiornalieriDTO dto = new RicercaRegistiGiornalieriDTO();
        dto.setPage(0);
        dto.setSize(10);
        Calendar cal = Calendar.getInstance();
        cal.set(2024, Calendar.OCTOBER, 24, 0, 0, 0);
        Date testDate = cal.getTime();
        dto.setDataRegistroFrom(testDate); // Ensure this method exists

        RegistroGiornalieroOutputDTO output = registroGiornalieroService.getRegistroGiornaliero(dto);

        assertNotNull(output);
    }

    @Test
    @TestTransaction
    public void testGetRegistroGiornaliero_ThrowsException_WhenDtoIsNull() {
        assertThrows(RuntimeException.class, () -> {
            registroServiceMock.getRegistroGiornaliero(null);
        });
    }

}