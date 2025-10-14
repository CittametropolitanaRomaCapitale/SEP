package it.cmrc.pi.backend.service;

import io.quarkus.scheduler.Scheduled;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.service.*;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

public class ScheduledTaskService {

    @Inject
    ConfigurazioneService configurazioneService;

    @Inject
    TitolarioService titolarioService;

    @Inject
    RegistroGiornalieroService registroGiornalieroService;

    @Inject
    AnagraficaService anagraficaService;

    @Inject
    SSOClient client;

    @ConfigProperty(name = "sync.fascicoli-dipendente.enabled")
    private boolean syncFascicoliDipendenteEnabled;

    @ConfigProperty(name = "sync.users.enabled")
    private boolean syncUsersEnabled;

    @ConfigProperty(name = "sync.registro-giornaliero.enabled")
    private boolean syncRegistroGiornaliero;

    @ConfigProperty(name = "sync.anagrafica-non-certificati.enabled")
    private boolean syncDeleteAnagraficaNonCertificati;

    //Schedulato alle 20:30
    @Scheduled(cron = "0 30 20 * * ?")
    public void callUsersSynchronizationWithSSO() {
        if (!syncUsersEnabled) return;
        List<Configurazione> conf = configurazioneService.getAllConfigurazioniByCategoria("global");
        client.syncUsersWithAttributes(configurazioneService.getApplicationId(conf));
    }

    //Schedulato alle 21:00
    @Scheduled(cron = "0 00 21 * * ?")
    public void callFascicoliDipendenti() {
        if (!syncFascicoliDipendenteEnabled) return;
        titolarioService.createFascicoliDipendenti(false, false, -1L, -1L, null);
    }

    // Esegui ogni giorno alle 5:00 del mattino
    @Scheduled(cron = "0 0 5 * * ?")
    public void scheduleCreateRegistroGiornaliero() {
        if (!syncRegistroGiornaliero) return;
        registroGiornalieroService.scheduleCreateRegistroGiornaliero();
    }

    // Esegui ogni giorno alle 0:00
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteAnagraficaWithoutCertificazione (){
        if (!syncDeleteAnagraficaNonCertificati) return;
        anagraficaService.deleteAnagraficaWithoutCertificazione();
    }

    /*
    // Ogni giorno alle 3 del mattino
    @Scheduled(cron = "0 0 3 * * ?")
    public void scheduleDeleteAllegatiNonUtilizzati() {
        if (!syncAllegatiNonUtilizzati) return;
        allegatoService.deleteAllegatiNonUtilizzati();
    }
    */
}
