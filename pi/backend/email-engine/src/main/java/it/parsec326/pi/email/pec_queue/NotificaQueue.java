package it.parsec326.pi.email.pec_queue;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;

@Slf4j
public class NotificaQueue {

    private static final int MAX_CAPACITY = 10000;
    private static final int MAX_RETRY = 5;
    private static final int MAX_ESITO_RETRY = 3;

    private static final BlockingQueue<Long> QUEUE = new LinkedBlockingQueue<>(MAX_CAPACITY);
    private static final Set<Long> ID_SET = ConcurrentHashMap.newKeySet();
    private static final Map<Long, Integer> RETRY_COUNT = new ConcurrentHashMap<>();
    private static final Map<Long, Integer> ESITO_RETRY_COUNT = new ConcurrentHashMap<>();

    private NotificaQueue() {}

    public static boolean enqueue(Long id) {
        if (!ID_SET.add(id)) {
            log.debug("ID già presente in coda: {}", id);
            return false;
        }

        boolean offered = QUEUE.offer(id);
        if (!offered) {
            log.warn("Coda piena. ID rifiutato: {}", id);
            ID_SET.remove(id);
        } else {
            log.info("ID Notifica: {} aggiunto alla coda", id);
        }

        return offered;
    }

    public static Long poll() {
        return QUEUE.poll();
    }

    public static void remove(Long id) {
        ID_SET.remove(id);
        RETRY_COUNT.remove(id);
        ESITO_RETRY_COUNT.remove(id);
    }

    public static boolean shouldRetry(Long id) {
        int retry = RETRY_COUNT.getOrDefault(id, 0);
        return retry < MAX_RETRY;
    }

    public static void incrementRetry(Long id) {
        int retry = RETRY_COUNT.getOrDefault(id, 0) + 1;
        RETRY_COUNT.put(id, retry);
        log.debug("Incremento retry per ID {} (not found): tentativo #{}", id, retry);
    }

    public static boolean shouldRetryEsito(Long id) {
        int retry = ESITO_RETRY_COUNT.getOrDefault(id, 0);
        return retry < MAX_ESITO_RETRY;
    }

    public static void incrementEsitoRetry(Long id) {
        int retry = ESITO_RETRY_COUNT.getOrDefault(id, 0) + 1;
        ESITO_RETRY_COUNT.put(id, retry);
        log.debug("Incremento retry per esito=false ID {}: tentativo #{}", id, retry);
    }

    public static boolean contains(Long id) {
        return ID_SET.contains(id);
    }

    public static void clear() {
        QUEUE.clear();
        ID_SET.clear();
        RETRY_COUNT.clear();
        ESITO_RETRY_COUNT.clear();
    }
}
