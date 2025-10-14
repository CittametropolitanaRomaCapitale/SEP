import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.dto.ricerca.RicercaStoricoDTO;
import it.parsec326.pi.intranet.dto.StoricoOutputDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.RegistroGiornaliero;
import it.parsec326.pi.intranet.model.Titolario;
import it.parsec326.pi.intranet.service.StoricoService;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class StoricoTest {

    @Inject
    StoricoService storicoService;

    @Test
    @TestTransaction
    public void insertStorico_insertsSuccessfully() {

        String utente_ok = "Utente string";
        String operazione_ok = "Operazione test";
        String notaOk = "Nota test";

        Protocollo p = Protocollo.findById(1L);
        storicoService.insertNewStoricoForNumeroProtocollo(p, "1", utente_ok, operazione_ok, notaOk);
        storicoService.insertNewStoricoForNumeroProtocollo(null, "1", utente_ok, operazione_ok, notaOk);
    }

    @Test
    public void insertStorico_insertsThrowsException() {

        String utente_ok = "Utente string";
        String utente_max_255 = "Mauris vitae arcu lectus. Suspendisse vulputate mi ut lorem faucibus elementum. Duis convallis nibh dui, et auctor arcu mollis a. Maecenas in massa dictum, venenatis nunc malesuada, ornare dui. Nunc dictum, metus non vestibulum auctor, orci felis suscipit purus, ac mattis mauris augue ac ligula. Duis sit amet semper justo. Suspendisse convallis vehicula mauris eu pretium. Vivamus sed sem ac felis imperdiet hendrerit. Morbi aliquet tellus id nibh gravida, convallis commodo est varius. Quisque a tristique tortor, mattis vestibulum urna. Morbi semper scelerisque nibh at efficitur. Phasellus ac porta ante. Nunc malesuada nisi id euismod faucibus. Maecenas id mattis erat.";
        String operazione_ok = "Operazione test";
        String operazione_max_255 = "Mauris vitae arcu lectus. Suspendisse vulputate mi ut lorem faucibus elementum. Duis convallis nibh dui, et auctor arcu mollis a. Maecenas in massa dictum, venenatis nunc malesuada, ornare dui. Nunc dictum, metus non vestibulum auctor, orci felis suscipit purus, ac mattis mauris augue ac ligula. Duis sit amet semper justo. Suspendisse convallis vehicula mauris eu pretium. Vivamus sed sem ac felis imperdiet hendrerit. Morbi aliquet tellus id nibh gravida, convallis commodo est varius. Quisque a tristique tortor, mattis vestibulum urna. Morbi semper scelerisque nibh at efficitur. Phasellus ac porta ante. Nunc malesuada nisi id euismod faucibus. Maecenas id mattis erat.";
        String nota_max_500 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus.\n";
        Protocollo p = Protocollo.findById(1L);

        assertThrows(RuntimeException.class, () -> storicoService.insertNewStoricoForNumeroProtocollo(p,"1", utente_ok, operazione_max_255, nota_max_500));
        assertThrows(RuntimeException.class, () -> storicoService.insertNewStoricoForNumeroProtocollo(p,null, utente_max_255, operazione_ok, nota_max_500));
    }

    @Test
    public void ricercaStorico_searchSuccessfully() {

        assertThrows(CustomException.class, () -> storicoService.getLogStorici(null, ""));

        RicercaStoricoDTO ricercaDto = new RicercaStoricoDTO();
        ricercaDto.setSize(10);
        ricercaDto.setPage(1);
        StoricoOutputDTO output = storicoService.getLogStorici(ricercaDto, "");
        assertTrue(output.getLogStorici().size() >= 0);

        ricercaDto.setIdProtocollo(-10000L);
        output = storicoService.getLogStorici(ricercaDto, "");
        assertTrue(output.getLogStorici().isEmpty());

        ricercaDto.setIdProtocollo(1L);
        output = storicoService.getLogStorici(ricercaDto, "");
        assertTrue(output.getLogStorici().isEmpty());
    }


    @Test
    @TestTransaction
    public void ricercaStoricoTitolario_searchSuccessfully() {

        String utente_ok = "Utente string";
        String operazione_ok = "Operazione test";
        String notaOk = "Nota test";

        Titolario p = Titolario.findById(1L);
        storicoService.insertNewStoricoForIdTitolario(p, "1", utente_ok, operazione_ok, notaOk);


        RicercaStoricoDTO ricercaDto = new RicercaStoricoDTO();
        ricercaDto.setSize(10);
        ricercaDto.setPage(0);
        ricercaDto.setIdTitolario(1L);

        StoricoOutputDTO output = storicoService.getLogStorici(ricercaDto, "");
        assertTrue(output.getLogStorici().size() > 0);
    }

    @Test
    @TestTransaction
    public void ricercaStoricoRegistroGiornaliero_searchSuccessfully() {

        String operazione_ok = "Operazione test";
        String nota = "nota test";
        RegistroGiornaliero rg = RegistroGiornaliero.findById(95552L);
        storicoService.insertNewStoricoForIdRegistroGiornalieroWithUtenteSistema(rg, operazione_ok, nota);


        RicercaStoricoDTO ricercaDto = new RicercaStoricoDTO();
        ricercaDto.setSize(10);
        ricercaDto.setPage(0);
        ricercaDto.setIdRegistroGiornaliero(95552L);

        StoricoOutputDTO output = storicoService.getLogStorici(ricercaDto, "");
        assertTrue(output.getLogStorici().size() > 0);
    }
}
