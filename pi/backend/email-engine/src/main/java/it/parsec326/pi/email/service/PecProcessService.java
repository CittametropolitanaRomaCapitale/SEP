package it.parsec326.pi.email.service;

import it.parsec326.pi.email.pec_queue.EmailManagerNotificationsListener;
import it.parsec326.pi.email.pec_queue.EmailProducer;
import it.parsec326.pi.email.pec_queue.worker.EmailReaderWorker;
import it.parsec326.pi.email.pec_queue.worker.EmailWorkerNotifyingThread;
import it.parsec326.pi.intranet.service.common.PecWebSocketResourceInterface;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@ApplicationScoped
public class PecProcessService implements EmailManagerNotificationsListener {

    @Inject
    EmailProducer producer;

    private PecWebSocketResourceInterface listener;

    public int startProcessFromScheduledTask() {
        log.info("Starting producer process from scheduled task, listener settato: " + (listener != null ? "Sì" : "No"));
        return producer.produce();
    }
    public int startProcessForEmailAddress(String idUtente, String emailAddress, PecWebSocketResourceInterface listener) {
        this.listener = listener;
        producer.setListener(this);
        return producer.producePecForEmail(idUtente, emailAddress);
    }
    public int startProcess(PecWebSocketResourceInterface listener) {
        this.listener = listener;
        producer.setListener(this);
        return producer.produce();
    }

    @Override
    public void notifyOnThreadCompleted(Runnable thread) {
        EmailWorkerNotifyingThread notifyingThread = (EmailWorkerNotifyingThread)thread;
        boolean workDone = notifyingThread.isWorkDone();
        if (thread instanceof EmailReaderWorker) {
            log.info("One worker completed");
            if (listener != null) {
                List<String> identifiers = notifyingThread.getIdentifiers();
                for(String identifier : identifiers)
                    listener.notifyOnPecProcessCompleted(identifier, "producer", workDone);
            }
        }
    }
}
