package it.parsec326.pi.email.pec_queue.worker;

public interface EmailWorkerNotificationsListener {
    void notifyOfThreadComplete(final Runnable thread);
}
