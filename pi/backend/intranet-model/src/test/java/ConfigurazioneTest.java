import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.dto.LoginConservazioneDTO;
import it.parsec326.pi.intranet.dto.client.raccomandata.LoginRaccomandataDTO;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import it.parsec326.pi.intranet.utils.common.AmbienteConservazione;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class ConfigurazioneTest {

    @Inject
    ConfigurazioneService configurazioneService;

    @Test
    @TestTransaction
    public void saveLoginRaccomandata_insertsSuccessfully() throws Exception {

        // Dati di test
        String username = "username test";
        String password = "password test";
        String gruppo = "gruppo test";

        LoginRaccomandataDTO loginInput = new LoginRaccomandataDTO();
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setGruppo(gruppo);

        boolean result = configurazioneService.saveLoginRaccomandata(loginInput);
        assertTrue(result);
    }

    @Test
    @TestTransaction
    public void saveLoginRaccomandata_throwsException() {

        // Dati di test
        String username = "username test";
        String password = "password test";
        String gruppo = "";

        LoginRaccomandataDTO loginInput = new LoginRaccomandataDTO();
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setGruppo(gruppo);

        assertThrows(RuntimeException.class, () -> configurazioneService.saveLoginRaccomandata(loginInput));
    }

    @Test
    @TestTransaction
    public void updateLoginRaccomandata_updatesSuccessfully() throws Exception {
        // Dati di test
        String username = "username test";
        String password = "password test";
        String gruppo = "gruppo test";

        LoginRaccomandataDTO loginInput = new LoginRaccomandataDTO();
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setGruppo(gruppo);

        boolean resultInsert = configurazioneService.saveLoginRaccomandata(loginInput);
        assertTrue(resultInsert);

        loginInput.setUsername("username modificato");
        loginInput.setPassword("password modificata");
        boolean resultUpdate = configurazioneService.updateLoginRaccomandata(loginInput);
        assertTrue(resultUpdate);
    }

    @Test
    @TestTransaction
    public void updateLoginConservazione_updatesSuccessfully() throws Exception {
        // Dati di test
        String url= "url test";
        String username = "username test";
        String password = "password test";
        String ambiente = "PARER_TEST";
        String ente = "ente test";
        String struttura = "struttura test";

        LoginConservazioneDTO loginInput = new LoginConservazioneDTO();
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setUrl(url);
        loginInput.setEnte(ente);
        loginInput.setAmbiente(AmbienteConservazione.valueOf(ambiente));
        loginInput.setStruttura(struttura);

        boolean resultInsert = configurazioneService.saveLoginConservazione(loginInput);
        assertTrue(resultInsert);

        loginInput.setAmbiente(AmbienteConservazione.valueOf("PARER"));
        loginInput.setPassword("password modificata");
        loginInput.setStruttura("cmrc");
        loginInput.setEnte("citta metropolitana di roma");
        boolean resultUpdate = configurazioneService.updateLoginConservazione(loginInput);
        assertTrue(resultUpdate);
    }

    @Test
    @TestTransaction
    public void getLoginRaccomandataDecrypted_successfully() throws Exception {

        // Dati di test
        String username = "username test";
        String password = "password test";
        String gruppo = "gruppo test";

        LoginRaccomandataDTO loginInput = new LoginRaccomandataDTO();
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setGruppo(gruppo);

        boolean resultInsert = configurazioneService.saveLoginRaccomandata(loginInput);
        assertTrue(resultInsert);

        LoginRaccomandataDTO login = configurazioneService.getLoginRaccomandataDecrypted();
        assertNotNull(login);

    }

    @Test
    @TestTransaction
    public void saveLoginConservazione_insertsSuccessfully() throws Exception {

        // Dati di test
        String url = "url test";
        String username = "username test";
        String password = "password test";
        String ambiente = "PARER_TEST";
        String ente = "ente test";
        String struttura = "struttura test";

        LoginConservazioneDTO loginInput = new LoginConservazioneDTO();
        loginInput.setUrl(url);
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setAmbiente(AmbienteConservazione.valueOf(ambiente));
        loginInput.setEnte(ente);
        loginInput.setStruttura(struttura);

        boolean result = configurazioneService.saveLoginConservazione(loginInput);
        assertTrue(result);
    }

    @Test
    @TestTransaction
    public void saveLoginConservazione_throwsException() {

        // Dati di test
        String url = "url test";
        String username = "username test";
        String password = "password test";
        String ambiente = "PARER_TEST";
        String ente = "ente test";
        String struttura = null;

        LoginConservazioneDTO loginInput = new LoginConservazioneDTO();
        loginInput.setUrl(url);
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setAmbiente(AmbienteConservazione.valueOf(ambiente));
        loginInput.setEnte(ente);
        loginInput.setStruttura(struttura);

        assertThrows(RuntimeException.class, () -> configurazioneService.saveLoginConservazione(loginInput));
    }

    @Test
    @TestTransaction
    public void getLoginConservazioneDecrypted_successfully() throws Exception {

        // Dati di test
        String url = "url test";
        String username = "username test";
        String password = "password test";
        String ambiente = "PARER_TEST";
        String ente = "ente test";
        String struttura = "struttura test";

        LoginConservazioneDTO loginInput = new LoginConservazioneDTO();
        loginInput.setUrl(url);
        loginInput.setUsername(username);
        loginInput.setPassword(password);
        loginInput.setAmbiente(AmbienteConservazione.valueOf(ambiente));
        loginInput.setEnte(ente);
        loginInput.setStruttura(struttura);

        boolean resultInsert = configurazioneService.saveLoginConservazione(loginInput);
        assertTrue(resultInsert);

        LoginConservazioneDTO login = configurazioneService.getLoginConservazioneDecrypted();
        assertNotNull(login);

    }
}
