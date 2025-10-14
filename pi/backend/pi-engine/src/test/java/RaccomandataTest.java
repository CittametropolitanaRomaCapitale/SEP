import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.cmrc.pi.backend.service.RaccomandataProtocolloService;
import it.parsec326.pi.intranet.client.RaccomandataWebClient;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.RaccomandataProtocolloDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaRaccomandataDTO;
import it.parsec326.pi.intranet.dto.client.raccomandata.*;
import it.parsec326.pi.intranet.dto.input.RaccomandataProtocolloInput;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.mapper.RaccomandataProtocolloMapper;
import it.parsec326.pi.intranet.model.RaccomandataProtocollo;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import it.parsec326.pi.intranet.service.StoricoService;
import it.parsec326.pi.intranet.utils.common.StatoRaccomandataProtocollo;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.UserTransaction;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.Invocation;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.Response;
import lombok.Getter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
public class RaccomandataTest {

    @Inject
    @Getter
    UserTransaction transaction;
    @Inject
    EntityManager em;
    @Inject
    RaccomandataProtocolloMapper mapper;
    @Inject
    RaccomandataWebClient raccomandataWebClient;
    @Inject
    private RaccomandataProtocolloService service;
    @Inject
    StoricoService storicoService;
    @Inject
    ConfigurazioneService configurazioneService;
    RaccomandataProtocolloService serviceInject;
    RaccomandataWebClient raccomandataWebClientInject;

    SSOClient ssoManagerMock = mock(SSOClient.class);
    Client clientMock = mock(Client.class);


    @BeforeEach
    void setUp() throws Exception {
        serviceInject = new RaccomandataProtocolloService();
        this.setField(serviceInject, "raccomandataMapper", mapper);
        this.setField(serviceInject, "ssoManager", ssoManagerMock);
        this.setField(serviceInject, "storicoService", storicoService);
        raccomandataWebClientInject = new RaccomandataWebClient();
        this.setField(raccomandataWebClientInject, "clientUrl", "url");
        this.setField(raccomandataWebClientInject, "client", clientMock);

    }

    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    @Test
    @TestTransaction
    void getConfiguration() throws Exception {
        LoginRaccomandataDTO login = configurazioneService.getLoginRaccomandata();
        assertNotNull(login);
        LoginRaccomandataDTO loginDecrypted = configurazioneService.getLoginRaccomandataDecrypted();
        assertNotNull(loginDecrypted);
        LoginRaccomandataDTO loginRaccomandata = service.getLoginRaccomandata();
        assertNotNull(loginRaccomandata);
    }


    @Test
    void testInvio() throws URISyntaxException, IOException {
        DatiRaccomandataDTO dati = new DatiRaccomandataDTO();

        CorrispondentiDTO mittente = new CorrispondentiDTO();
        mittente.setDenominazione1("Nome Cognome");
        mittente.setIndirizzo1("Via dei crediti recuperati 83");
        mittente.setIndirizzo2("Piano terra");
        mittente.setCap("00172");
        mittente.setCitta("ROMA");
        mittente.setProvincia("RM");

        CorrispondentiDTO destinatario = new CorrispondentiDTO();
        destinatario.setDenominazione1("Nome Cognome destinatario");
        destinatario.setIndirizzo1("Via dei test destinatari 100/a");
        destinatario.setIndirizzo2("Loft");
        destinatario.setCap("00172");
        destinatario.setCitta("ROMA");
        destinatario.setProvincia("RM");

        AllegatoDTO file = new AllegatoDTO();
        file.setNomeFile("Test 1");
        file.setEstensione("PDF");
        file.setFileFirmato(false);
        file.setRicevutaDiRitorno(false);
        file.setFile(Files.readAllBytes(Paths.get(getClass().getResource("/test.pdf").toURI())));

        dati.setServizio("raccomandata");
        dati.setMittente(mittente);
        dati.setDestinatario(destinatario);
        dati.setAllegato(file);
        WebTarget webTarget = spy(WebTarget.class);
        Invocation.Builder builder = spy(Invocation.Builder.class);
        Response response = spy(Response.class);
        when(clientMock.target(anyString())).thenReturn(webTarget);
        when(webTarget.path(anyString())).thenReturn(webTarget);
        when(webTarget.request(anyString())).thenReturn(builder);
        when(builder.post(any())).thenReturn(response);
        when(response.readEntity(DettaglioRaccomandataDTO.class)).thenReturn(new DettaglioRaccomandataDTO());
        assertNotNull(response);
    }

    @Test
    @TestTransaction
    public void insertNewRaccomandata_insertsSuccessfully() {

        RaccomandataProtocolloInput input = new RaccomandataProtocolloInput();
        input.setIdProtocollo(1038L);
        input.setIdAllegato(1004L);
        input.setTipo("Raccomandata");
        input.setMittente("Mittente");
        input.setMittenteIndirizzo("Via test");
        input.setMittentePresso("Scala 2 - INT 3");
        input.setMittenteCivico("12");
        input.setMittenteProvincia("RM");
        input.setMittenteCitta("Roma");
        input.setMittenteCap("06");
        input.setDestinatario("Destinatario");
        input.setDestinatarioIndirizzo("Via test dest");
        input.setDestinatarioIndirizzo2("Scala B - INT 99");
        input.setDestinatarioCivico("12");
        input.setDestinatarioCap("02");
        input.setDestinatarioCitta("Milano");
        input.setDestinatarioProvincia("MI");

        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_TEST");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("NAME UTENTE TEST");

        RaccomandataProtocollo r = serviceInject.insertNewRaccomandata(input);
        assertNotNull(r);
    }

    @Test
    @TestTransaction
    public void insertNewRaccomandata_tipoNotFound_throws_Exception() {

        RaccomandataProtocolloInput input = new RaccomandataProtocolloInput();
        input.setIdProtocollo(1038L);
        input.setIdAllegato(1004L);
        input.setTipo("TIPO NON SUPPORTATO");
        assertThrows(CustomException.class, () -> {service.insertNewRaccomandata(input);});
    }


    @Test
    @TestTransaction
    public void insertNewRaccomandata_inputIsNull_throws_Exception() {
        assertThrows(CustomException.class, () -> {service.insertNewRaccomandata(null);});
    }

    @Test
    @TestTransaction
    public void insertNewRaccomandata_protocolloNotFound_throws_Exception() {
        RaccomandataProtocolloInput input = new RaccomandataProtocolloInput();
        input.setIdProtocollo(2211211038L);
        assertThrows(CustomException.class, () -> {service.insertNewRaccomandata(input);});
    }
    @Test
    @TestTransaction
    public void insertNewRaccomandata_allegatoNotFound_throws_Exception() {
        RaccomandataProtocolloInput input = new RaccomandataProtocolloInput();
        input.setIdProtocollo(1038L);
        input.setIdAllegato(9991004L);
        assertThrows(CustomException.class, () -> {service.insertNewRaccomandata(input);});
    }

    @Test
    @TestTransaction
    public void insertNewRaccomandata_inputNotValid_throws_Exception() {
        RaccomandataProtocolloInput input = new RaccomandataProtocolloInput();
        input.setIdProtocollo(1038L);
        input.setIdAllegato(1004L);
        assertThrows(CustomException.class, () -> {service.insertNewRaccomandata(input);});
    }



    @Test
    @TestTransaction
    public void getRaccomandate_throwsException_when_invalidProtocollo() {
        RicercaRaccomandataDTO dto = new RicercaRaccomandataDTO();
        dto.setPage(0);
        dto.setSize(100);
        dto.setIdProtocollo(939391038L);
        assertThrows(CustomException.class, () -> {service.getRaccomandate(dto);});

        dto.setIdProtocollo(1038L);
        dto.setStato("STATO NON ESISTENTENTENTETNE");
        assertThrows(CustomException.class, () -> {service.getRaccomandate(dto);});
    }

    @Test
    @TestTransaction
    public void getRaccomandate_searchesSuccessfully() {
        assertThrows(IllegalArgumentException.class, () -> {service.getRaccomandate(null);});

        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_TEST");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("NAME UTENTE TEST");

        RaccomandataProtocolloInput input = new RaccomandataProtocolloInput();
        input.setIdProtocollo(1038L);
        input.setIdAllegato(1004L);
        input.setTipo("Raccomandata");
        input.setMittente("Mittente");
        input.setMittenteIndirizzo("Via test");
        input.setMittentePresso("Scala 2 - INT 3");
        input.setMittenteCivico("12");
        input.setMittenteProvincia("RM");
        input.setMittenteCitta("Roma");
        input.setMittenteCap("06");
        input.setDestinatario("Destinatario");
        input.setDestinatarioIndirizzo("Via test dest");
        input.setDestinatarioIndirizzo2("Scala B - INT 99");
        input.setDestinatarioCivico("12");
        input.setDestinatarioCap("02");
        input.setDestinatarioCitta("Milano");
        input.setDestinatarioProvincia("MI");

        RaccomandataProtocollo r = serviceInject.insertNewRaccomandata(input);
        assertNotNull(r);

        RicercaRaccomandataDTO dto = new RicercaRaccomandataDTO();
        dto.setPage(0);
        dto.setSize(100);
        dto.setIdProtocollo(1038L);
        dto.setSearch("milan");
        RaccomandataProtocolloDTO output = serviceInject.getRaccomandate(dto);
        assertTrue(output.getRaccomandate().isEmpty());

        dto.setSearch("DASDASDASDSADSADSADSADSASa");
        output = serviceInject.getRaccomandate(dto);
        assertTrue(output.getRaccomandate().isEmpty());
    }

    @Test
    @TestTransaction
    public void annullaRaccomandata_annullaSuccessfully() {

        RaccomandataProtocolloInput input = new RaccomandataProtocolloInput();
        input.setIdProtocollo(1038L);
        input.setIdAllegato(1004L);
        input.setTipo("Raccomandata");
        input.setMittente("Mittente");
        input.setMittenteIndirizzo("Via test");
        input.setMittentePresso("Scala 2 - INT 3");
        input.setMittenteCivico("12");
        input.setMittenteProvincia("RM");
        input.setMittenteCitta("Roma");
        input.setMittenteCap("06");
        input.setDestinatario("Destinatario");
        input.setDestinatarioIndirizzo("Via test dest");
        input.setDestinatarioIndirizzo2("Scala B - INT 99");
        input.setDestinatarioCivico("12");
        input.setDestinatarioCap("02");
        input.setDestinatarioCitta("Milano");
        input.setDestinatarioProvincia("MI");

        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_TEST");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("NAME UTENTE TEST");

        RaccomandataProtocollo r = serviceInject.insertNewRaccomandata(input);
        assertNotNull(r);
        assertTrue(serviceInject.annullaRaccomandata(r.getId(), "Motivazione"));

        r.setStato(StatoRaccomandataProtocollo.accettato);
        r.persist();
        assertThrows(CustomException.class, () -> {serviceInject.annullaRaccomandata(r.getId(), "Motivazione");});

        assertThrows(CustomException.class, () -> {serviceInject.annullaRaccomandata(321323213L, "Motivazione");});
    }
}
