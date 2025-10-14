package it.parsec326.pi.email.service;

import io.quarkus.arc.Unremovable;
import io.quarkus.runtime.annotations.RegisterForReflection;
import it.parsec326.pi.intranet.service.EmailService;
import it.parsec326.pi.intranet.service.PecRegoleService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.control.ActivateRequestContext;
import jakarta.enterprise.inject.Default;
import jakarta.inject.Inject;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jobrunr.jobs.annotations.Job;
import org.jobrunr.jobs.annotations.Recurring;

import java.util.List;

@Slf4j
@Default
@Unremovable
@RegisterForReflection
@ApplicationScoped
@ActivateRequestContext
@Data
public class ScheduledTaskService {

  @Inject
  PecProcessService pecProcessService;

  @Inject
  NotificaProcessorService notificaProcessorService;

  @Inject
  PecPeoProcessorService pecPeoProcessorService;

  @Inject
  PecRegoleProcessorService pecRegoleProcessorService;

  @Inject
  EmailService emailService;

  @ConfigProperty(name = "producer.enabled")
  private boolean producerEnabled;

  @ConfigProperty(name = "notifiche.enabled")
  private boolean notificheEnabled;

  @ConfigProperty(name = "pec_peo.enabled")
  private boolean pecPeoEnabled;

  static final String PRODUCER_PEC = "Producer PEC";
  static final String PROCESSOR_NOTIFICHE = "Process Notifiche";
  static final String PROCESSOR_PEC_PEO = "Process Pec/Peo";
  static final String PROCESSOR_REGOLE_PEC = "Process Regole Pec";
  static final String DELETE_ALL_INBOX = "Delete All Inbox";
  static final String DELETE_ALL_INBOX_OLD = "Delete All Inbox Old";
  static final String CHECK_DELETED_ALL_INBOX = "Check Deleted All Inbox";
  static final String SEND_EMAIL_AFTER_15_MINUTES = "Send Email After 15 Minutes";

  @Recurring(id = "produce-pec", interval = "PT5M")
  @Job(name = PRODUCER_PEC)
  public void producePecTasks() {
    if(producerEnabled){
      pecProcessService.startProcessFromScheduledTask();
    }
  }

  @Recurring(id = "check-pec-regole", interval = "PT18M")
  @Job(name = PROCESSOR_REGOLE_PEC)
  public void checkPecRules() {
    if (producerEnabled) {
      pecRegoleProcessorService.startProcessForPecs();
    }
  }

  @Recurring(id = "delete-all-inbox", cron = "0 1 * * *")
  @Job(name = DELETE_ALL_INBOX)
  public void deleteAllInboxTasks() {
      pecPeoProcessorService.deleteAllFromInbox();
  }

  @Recurring(id = "delete-all-inbox-old", cron = "0 4 * * *")
  @Job(name = DELETE_ALL_INBOX_OLD)
  public void deleteAllInboxOldTasks() {
    pecPeoProcessorService.deleteAllOldFromInbox();
  }

  @Recurring(id = "check-deleted-all-inbox", cron = "0 2 * * *")
  @Job(name = CHECK_DELETED_ALL_INBOX)
  public void checkDeletedAllInboxTasks() {
    pecPeoProcessorService.checkDeletedAllFromInbox();
  }

  @Recurring(id = "send-email-after-15-minutes", cron = "0 */15 * * *")
  @Job(name = SEND_EMAIL_AFTER_15_MINUTES)
  public void sendEmailAfter15MinutesTasks() {
    List<Long> ids = emailService.getIdEmailsAfter15Minutes();
    if(!ids.isEmpty()){
      for(Long id : ids){
        try{
          emailService.sendEmail(id);
        }catch (Exception e) {
          log.error(e.getMessage());
        }
      }
    }
  }
}
