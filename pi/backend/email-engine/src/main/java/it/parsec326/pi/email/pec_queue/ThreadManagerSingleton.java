package it.parsec326.pi.email.pec_queue;

import it.parsec326.pi.email.pec_queue.worker.*;
import it.parsec326.pi.intranet.utils.LogUtils;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;
@ApplicationScoped
@Slf4j
public class ThreadManagerSingleton implements EmailWorkerNotificationsListener {

  @Getter private static final ThreadManagerSingleton instance = new ThreadManagerSingleton();
  private final ExecutorService executorService = Executors.newCachedThreadPool();
  private static final int MAX_ACTIVE_THREADS = 1;
  private final BlockingQueue<Runnable> producerPecThreadWaitingQueue = new LinkedBlockingQueue<>();
  private final Deque<Future<?>> producerPecActiveThreads = new ArrayDeque<>();
  private final Map<WaitingThreadType, BlockingQueue<Runnable>> mapWaitingQueue = new HashMap<>();
  private final Map<WaitingThreadType, Deque<Future<?>>> mapActiveThreads = new HashMap<>();
  @Setter private ThreadManagerListenerInterface producerListener;

  public enum WaitingThreadType {
    PRODUCER_PEC,
  }

  private ThreadManagerSingleton() {
    mapWaitingQueue.put(WaitingThreadType.PRODUCER_PEC, producerPecThreadWaitingQueue);
    mapActiveThreads.put(WaitingThreadType.PRODUCER_PEC, producerPecActiveThreads);
  }

  public boolean hasProducerInQueue(String identifier) {
    synchronized (producerPecThreadWaitingQueue) {
      for(Runnable producerPecThread : producerPecThreadWaitingQueue ) {
        EmailWorkerNotifyingThread reader = (EmailWorkerNotifyingThread) producerPecThread;
        if (reader.getIdentifiers().contains(identifier))
          return true;
      }
    }
    return false;
  }

  /**
   * Questo servizio schedula un nuovo runnable nella coda producerPecThreadWaitingQueue.
   * @param runnable
   * @throws InterruptedException
   */
  public void enqueue(Runnable runnable, WaitingThreadType waitingThreadType, String nameThread) throws InterruptedException {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    BlockingQueue<Runnable> currentThreadWaitingQueue = mapWaitingQueue.get(waitingThreadType);
    synchronized (currentThreadWaitingQueue) {
      currentThreadWaitingQueue.put(runnable);
      log.info("Aggiunto thread {} in coda. Size coda in attesa {}", nameThread, currentThreadWaitingQueue.size());
    }
    startNext(waitingThreadType);
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
  }

  /**
   * Questo servizio avvia un nuovo thread se la coda dei thread attivi ha dei posti liberi.
   */
  private void startNext(WaitingThreadType waitingThreadType) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    BlockingQueue<Runnable> currentThreadWaitingQueue = mapWaitingQueue.get(waitingThreadType);
    Deque<Future<?>> currentActiveThreads = mapActiveThreads.get(waitingThreadType);
    synchronized (currentActiveThreads) {
      boolean thereAreWaitingThreads = !currentThreadWaitingQueue.isEmpty();
      boolean thereAreEmptyActiveQueue = currentActiveThreads.size() <= MAX_ACTIVE_THREADS;

      // Cicla fin quando ci sono posti nella coda dei thread attivi e ci sono thread in attesa di essere eseguiti.
      while (thereAreEmptyActiveQueue && thereAreWaitingThreads) {
        Runnable nextThread;
        try {
          nextThread = currentThreadWaitingQueue.take();
        } catch (InterruptedException e) {
          log.error("Interrupted exception: {}", ExceptionUtils.getRootCauseMessage(e));
          Thread.currentThread().interrupt();
          LogUtils.exiting(LogUtils.LogLevel.ERROR);
          return;
        }

        if (nextThread != null) {
          Future<?> future = executorService.submit(() -> {
            try {
              nextThread.run();
            } finally {
              finisher(waitingThreadType);
            }
          });
          currentActiveThreads.add(future);

          log.info("Nuovo thread in esecuzione - [attivi: {}, max attivi: {}, in coda: {}]", currentActiveThreads.size(), MAX_ACTIVE_THREADS, currentThreadWaitingQueue.size());
        }

        thereAreWaitingThreads = !currentThreadWaitingQueue.isEmpty();
        thereAreEmptyActiveQueue = currentActiveThreads.size() <= MAX_ACTIVE_THREADS;
      }
    }
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
  }

  /**
   * Questo servizio rimuove i thread attivi finiti.
   */
  private void finisher(WaitingThreadType waitingThreadType) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    BlockingQueue<Runnable> currentThreadWaitingQueue = mapWaitingQueue.get(waitingThreadType);
    Deque<Future<?>> currentActiveThreads = mapActiveThreads.get(waitingThreadType);
    synchronized (currentActiveThreads) {
      currentActiveThreads.removeIf(Future::isDone);
      log.info("Rimozione thread terminati - [attivi: {}, max attivi: {}, in coda: {}]", currentActiveThreads.size(), MAX_ACTIVE_THREADS, currentThreadWaitingQueue.size());
      if (!currentThreadWaitingQueue.isEmpty()) {
        startNext(waitingThreadType);
      }
    }
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
  }

  @Override
  public void notifyOfThreadComplete(Runnable thread) {
    if ((producerListener != null) && (thread instanceof EmailReaderWorker)) {
      producerListener.notifyOnThreadComplete(thread);
    }
  }
}