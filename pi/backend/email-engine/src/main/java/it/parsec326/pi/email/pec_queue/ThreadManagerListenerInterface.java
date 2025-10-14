package it.parsec326.pi.email.pec_queue;

public interface ThreadManagerListenerInterface {
    void notifyOnThreadComplete(Runnable t);
}
