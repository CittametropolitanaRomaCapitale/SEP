package it.parsec326.pi.intranet.service.common;

public interface PecWebSocketResourceInterface {
    void notifyOnPecProcessCompleted(String identifier, String type, boolean workDone);
}
