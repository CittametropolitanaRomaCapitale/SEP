import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.client.IpaClient;
import it.parsec326.pi.intranet.dto.ReferentiOutputDTO;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.*;
import it.parsec326.pi.intranet.service.IpaService;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.Invocation;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Collections;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
 class ClientIpaInadTest {

    @Inject
    IpaClient ipaClientInject;
    IpaClient ipaClient;
    IpaService ipaService;
    Client client = mock(Client.class);
    WebTarget webTarget = mock(WebTarget.class);
    Invocation.Builder invocationBuilder = mock(Invocation.Builder.class);
    Response response = mock(Response.class);
    IpaClient ipaClientMock = mock(IpaClient.class);

    @BeforeEach
    public void setup() throws Exception {
        ipaClient = new IpaClient();
        this.setField(ipaClient, "authId", "123456");
        this.setField(ipaClient, "client", client);
        ipaService = new IpaService();
        this.setField(ipaService, "ipaClient", ipaClientMock);
    }

    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    @Test
    void testRicercaDesc(){
        ApiResponseIpa<DataResponseIpaSearch> responseEnte = ipaClientInject.ricercaDescEnte("Roma");
        assertNotNull(responseEnte);
    }

    @Test
     void testRicercaOrganizzativaOmogenea() {
        String codAmm = "test_codAmm";
        String codAoo = "test_codAoo";
        String jsonRequest = String.format("{\"cod_aoo\": \"%s\", \"cod_amm\": \"%s\"}", codAoo, codAmm);

        when(client.target(any(String.class))).thenReturn(webTarget);
        when(webTarget.path(any(String.class))).thenReturn(webTarget);
        when(webTarget.request(MediaType.APPLICATION_JSON)).thenReturn(invocationBuilder);
        when(invocationBuilder.header(any(String.class), any(String.class))).thenReturn(invocationBuilder);
        when(invocationBuilder.post(any(Entity.class))).thenReturn(response);
        when(response.getStatus()).thenReturn(200);
        when(response.readEntity(String.class)).thenReturn("{\"result\":{}, \"data\":[]}");

        ApiResponseIpa<DataResponseIpaAOO> result = ipaClient.ricercaAreaOrganizzativaOmogenea(codAmm, codAoo);

        assertNotNull(result);
        assertEquals(200, response.getStatus());
    }

    @Test
     void testRicercaUnitaOrganizzative() {

        when(client.target(any(String.class))).thenReturn(webTarget);
        when(webTarget.path(any(String.class))).thenReturn(webTarget);
        when(webTarget.request(MediaType.APPLICATION_JSON)).thenReturn(invocationBuilder);
        when(invocationBuilder.header(any(String.class), any(String.class))).thenReturn(invocationBuilder);
        when(invocationBuilder.post(any(Entity.class))).thenReturn(response);
        when(response.getStatus()).thenReturn(200);
        when(response.readEntity(String.class)).thenReturn("{\"result\":{}, \"data\":[]}");

        ApiResponseIpa<DataResponseIpaUO> result = ipaClient.ricercaUnitaOrganizzative("codAmm");

        assertNotNull(result);
        assertEquals(200, response.getStatus());
    }

    @Test
    void testInfoEnteIpa() {

        when(client.target(any(String.class))).thenReturn(webTarget);
        when(webTarget.path(any(String.class))).thenReturn(webTarget);
        when(webTarget.request(MediaType.APPLICATION_JSON)).thenReturn(invocationBuilder);
        when(invocationBuilder.header(any(String.class), any(String.class))).thenReturn(invocationBuilder);
        when(invocationBuilder.post(any(Entity.class))).thenReturn(response);
        when(response.getStatus()).thenReturn(200);
        when(response.readEntity(String.class)).thenReturn("{\"result\":{}, \"data\":{}}");

        ApiResponseIpaInfo<DataResponseIpaInfo> result = ipaClient.infoEnteIpa("codAmm");

        assertNotNull(result);
        assertEquals(200, response.getStatus());
    }

    @Test
    void testGetOutputDTOFromIpa() {
        String codAmm = "test_codAmm";
        String codAoo = "test_codAoo";

        ApiResponseIpaInfo<DataResponseIpaInfo> apiResponseIpaInfo = new ApiResponseIpaInfo();
        DataResponseIpaInfo dataResponseIpaInfo = new DataResponseIpaInfo();
        dataResponseIpaInfo.setCfPiva("DIXDPZ44E08F367A");
        apiResponseIpaInfo.setData(dataResponseIpaInfo);

        DataResponseIpaAOO dataResponseIpa = new DataResponseIpaAOO();
        dataResponseIpa.setMail1("test@example.com");
        dataResponseIpa.setDesAoo("Test AOO");
        dataResponseIpa.setIndirizzo("Test Address");
        dataResponseIpa.setComune("Test City");
        dataResponseIpa.setProvincia("Test Province");
        dataResponseIpa.setCap("12345");
        dataResponseIpa.setTel("1234567890");
        dataResponseIpa.setFax("0987654321");

        ApiResponseIpa<DataResponseIpaAOO> apiResponseIpa = new ApiResponseIpa<>();
        apiResponseIpa.setData(Collections.singletonList(dataResponseIpa));

        doReturn(apiResponseIpaInfo).when(ipaClientMock).infoEnteIpa(anyString());
        doReturn(apiResponseIpa).when(ipaClientMock).ricercaAreaOrganizzativaOmogenea(anyString(), anyString());
        ReferentiOutputDTO result = ipaService.getOutputDTOFromIpaAOO(codAmm, codAoo, null, 5, 0);

        assertNotNull(result);
    }

    @Test
    void testGetOutputDTOFromIpaUO() {
        String codAmm = "test_codAmm";

        DataResponseIpaUO dataResponseIpaUO = new DataResponseIpaUO();
        dataResponseIpaUO.setCodAmm(codAmm);
        dataResponseIpaUO.setCodUniOu("09IT1Y");
        dataResponseIpaUO.setCodAoo("001");
        dataResponseIpaUO.setCf("04733471009");
        dataResponseIpaUO.setStatoCanale("A");
        dataResponseIpaUO.setDatValCanaleTrasmSfe("2015-03-31");
        dataResponseIpaUO.setDtVerificaCf("2015-03-12");

        ApiResponseIpa<DataResponseIpaUO> apiResponseIpaUO = new ApiResponseIpa<>();
        apiResponseIpaUO.setData(Collections.singletonList(dataResponseIpaUO));

        when(ipaClientMock.ricercaUnitaOrganizzative(anyString())).thenReturn(apiResponseIpaUO);
        ReferentiOutputDTO result = ipaService.getOutputDTOFromIpaUO(codAmm, null, 5, 0);

        assertNotNull(result);
    }

    @Test
    public void testGetOutputDTOFromIpaEnte() {
        String desc = "Ministero dell'Istruzione";

        DataResponseIpaSearch dataResponseIpaSearch = new DataResponseIpaSearch();
        dataResponseIpaSearch.setCodAmm("058");
        dataResponseIpaSearch.setDescAmm("Ministero dell'Istruzione");
        dataResponseIpaSearch.setAcronimo("MI");

        ApiResponseIpa<DataResponseIpaSearch> apiResponseIpaSearch = new ApiResponseIpa<>();
        apiResponseIpaSearch.setData(Collections.singletonList(dataResponseIpaSearch));

        when(ipaClientMock.ricercaDescEnte(anyString())).thenReturn(apiResponseIpaSearch);
        ReferentiOutputDTO result = ipaService.getOutputDTOFromIpaEnte(desc, 5, 0);

        assertNotNull(result);
    }
}
