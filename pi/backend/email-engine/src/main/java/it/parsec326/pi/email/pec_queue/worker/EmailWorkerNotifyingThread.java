package it.parsec326.pi.email.pec_queue.worker;

import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public abstract class  EmailWorkerNotifyingThread extends Thread {

    private final Set<EmailWorkerNotificationsListener> listeners = new CopyOnWriteArraySet<>();
    public final void addListener(final EmailWorkerNotificationsListener listener) {
        listeners.add(listener);
    }
    public final void removeListener(final EmailWorkerNotificationsListener listener) {
        listeners.remove(listener);
    }
    private final void notifyListeners() {
        for (EmailWorkerNotificationsListener listener : listeners) {
            listener.notifyOfThreadComplete(this);
        }
    }

    protected boolean workDone;

    public boolean isWorkDone() {
        return workDone;
    }

    @Override
    public final void run() {
        try {
            doRun();
        } finally {
            notifyListeners();
        }
    }
    public abstract void doRun();
    public abstract List<String> getIdentifiers();
}
