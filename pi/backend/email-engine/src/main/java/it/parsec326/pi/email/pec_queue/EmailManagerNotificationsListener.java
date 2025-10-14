package it.parsec326.pi.email.pec_queue;

public interface EmailManagerNotificationsListener {
    void notifyOnThreadCompleted(Runnable thread);
}
