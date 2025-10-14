package it.parsec326.pi.email.pec_queue;

import it.parsec326.pi.email.model.PecToRead;
import it.parsec326.pi.email.pec_queue.worker.EmailReaderWorker;
import it.parsec326.pi.intranet.model.Email;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.service.*;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.common.TipologiaPosta;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@ApplicationScoped
@Slf4j
public class EmailProducer implements ThreadManagerListenerInterface {

  @Inject
  PecPeoService pecPeoService;

  @Inject
  EmailService emailService;

  @Inject
  AllegatoService allegatoService;

  @Inject
  ProtocolloService protocolloService;

  @Inject
  StoricoService storicoService;

  @Inject
  EntityManager em;

  @Inject
  PecMessageConverterService pecMessageConverterService;

  public EmailProducer() {
    ThreadManagerSingleton.getInstance().setProducerListener(this);
  }

  private void scheduleProducers(List<PecPeo> pecDaLeggere) {
    ThreadManagerSingleton instanceThreadManager = ThreadManagerSingleton.getInstance();
    for(PecPeo pecPeo : pecDaLeggere) {
      Email lastEmailRead = emailService.getLastEmailRead("PEC", pecPeo.getIndirizzoEmail());

      Date lastDayToRead = null;
      if (lastEmailRead != null) {
        Timestamp lastEmailTsInvio = lastEmailRead.getTsInvio();
        Calendar cal = Calendar.getInstance();
        cal.setTime(lastEmailTsInvio);
        cal.add(Calendar.MINUTE, -5); // Sottrae 5 minuti
        lastEmailTsInvio = new Timestamp(cal.getTimeInMillis());

        if (lastEmailTsInvio != null) {
          lastDayToRead = Date.from(lastEmailTsInvio.toInstant());
        }
      }
      if (lastDayToRead == null) {
        // se non esiste nessuna mail a db ancora letta, si leggono tutte le mail del giorno corrente (a partire dalla mezzanotte)
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.set(Calendar.YEAR, 2024);
        cal.set(Calendar.DAY_OF_MONTH, 30);
        cal.set(Calendar.MONTH, Calendar.DECEMBER);
        cal.set(Calendar.HOUR_OF_DAY, 17);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        lastDayToRead = cal.getTime();
      }

      log.info("Lettura casella email {} dalla data del {}", pecPeo.getIndirizzoEmail(), lastDayToRead.toString());

      PecToRead pecToRead = PecToRead.mapFromPecPeo(pecPeo);
      pecToRead.setLastTsInvio(lastDayToRead);

      EmailReaderWorker reader = new EmailReaderWorker(emailService, allegatoService, protocolloService, storicoService, em, pecToRead, pecMessageConverterService);
      reader.addListener(ThreadManagerSingleton.getInstance());

      List<String> identifiersForPecDaLegger = reader.getIdentifiers();

      //for (String identifierForPecDaLegger : identifiersForPecDaLegger) {
        //if (!instanceThreadManager.hasProducerInQueue(identifierForPecDaLegger)) {
          try {
            instanceThreadManager.enqueue(reader, ThreadManagerSingleton.WaitingThreadType.PRODUCER_PEC, pecToRead.getIndirizzoEmail());
            //break;
          } catch (InterruptedException e) {
            log.error(ExceptionUtils.getRootCauseMessage(e),e);
            log.error("Errore nella lettura della casella :{}", pecPeo.getIndirizzoEmail());
          }
        //}
      //}
    }
  }

  /**
   * Legge tutte le PEC
   * @return
   */
  public int produce() {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    // Leggo tutte le PEC configurate abilitate alla lettura (attiva = true)
    List<PecPeo> pecDaLeggere = pecPeoService.getAllActivePecConfigurations();
    scheduleProducers(pecDaLeggere);
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return pecDaLeggere.size();
  }

  /**
   * Legge tutte le PEC associate ad un utente
   * @param idUtente
   * @return
   */
  public int producePecForUtente(String idUtente) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    // Leggo tutte le PEC dell'utente
    List<PecPeo> pecDaLeggere = pecPeoService.getPecPeoByIdUtente(idUtente, TipologiaPosta.PEC);
    scheduleProducers(pecDaLeggere);
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return pecDaLeggere.size();
  }

  /**
   * Legge la pec dall'indirizzo email
   * @param idUtente
   * @param email
   * @return
   */
  public int producePecForEmail(String idUtente, String email) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    PecPeo pecDaLeggere = pecPeoService.getPecPeoByEmail(email);

    //NOTA: settiamo l'id utente che arriva come parametro al posto di quello definito nell'oggetto in modo che il processo di producer - consumer funzioni
    // e venga poi notificato tramite web socket il corretto utente che ha richiesto la sincronizzazione
    pecDaLeggere.setIdUtente(idUtente);
    scheduleProducers(List.of(pecDaLeggere));
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return 1;
  }

  @Setter
  private EmailManagerNotificationsListener listener;

  @Override
  public void notifyOnThreadComplete(Runnable thread) {
      if (listener != null)
        listener.notifyOnThreadCompleted(thread);
  }
}
