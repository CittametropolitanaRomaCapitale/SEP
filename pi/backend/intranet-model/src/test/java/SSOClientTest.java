import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSlimSSO;
import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class SSOClientTest {

    @Inject
    SSOClient ssoManager;

    @Inject
    ConfigurazioneService configurazioneService;

    @Test
    public void getUtentiPerUfficio_returnsUtenti() {
        assertFalse(ssoManager.getUtentiPerUfficio("3", "7500", "").isEmpty());
        assertTrue(ssoManager.getUtentiPerUfficio("3", "NONEXISTENTCODENONONO", "").isEmpty());
    }

    @Test
    public void getAllUtenti_returnsUtenti() {
        List<DatiUtenteSlimSSO> utenti = ssoManager.getAllUtenti("3");
        assertTrue(utenti != null);
    }

    @Test
    public void syncAllUsers_triggersSyncWithAttibutes() {
        List<Configurazione> conf = configurazioneService.getAllConfigurazioniByCategoria("global");
        String resp = ssoManager.syncUsersWithAttributes(configurazioneService.getApplicationId(conf));
        assertNotNull(resp);
    }
}
