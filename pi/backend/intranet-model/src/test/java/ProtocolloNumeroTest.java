import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.service.NumeroProtocolloCircolareService;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Slf4j
@QuarkusTest
public class ProtocolloNumeroTest {

    @Inject
    NumeroProtocolloCircolareService numeroProtocolloService;

    @Test
    //TODO: capire come passare la transaction al metodo di generazione
    public void should_generate_async_protocollo_number(){
        int numberOfThreads = 30;

        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        String sequenceName = "generate_n_protocollo_sequence";

        for (int i = 0; i < numberOfThreads; i++) {
            executor.submit(() -> {
                try{
                    String nProtocollo = numeroProtocolloService.generateDistribuitedNumeroProtocollo();
                    log.info("Numero protocollo:{} - salvato con successo",nProtocollo);
                }catch (Exception e){
                    CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
                }

            });
        }

        executor.shutdown();
        try {
            executor.awaitTermination(1, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }
}
