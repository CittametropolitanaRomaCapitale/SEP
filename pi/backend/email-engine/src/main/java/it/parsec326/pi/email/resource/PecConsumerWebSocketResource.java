package it.parsec326.pi.email.resource;

import it.parsec326.pi.email.service.PecProcessService;
import it.parsec326.pi.intranet.service.common.PecWebSocketResourceInterface;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.StringReader;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/Pec/{idUtente}")
@ApplicationScoped
public class PecConsumerWebSocketResource implements PecWebSocketResourceInterface {

    @Inject
    PecProcessService pecProcessService;

    Map<String, Session> sessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("idUtente") String idUtente) {
        sessions.put(idUtente, session);
    }

    @OnClose
    public void onClose(Session session, @PathParam("idUtente") String idUtente) {
        sessions.remove(idUtente);
    }

    @OnError
    public void onError(Session session, @PathParam("idUtente") String idUtente, Throwable throwable) {
        sessions.remove(idUtente);
    }

    @OnMessage
    public void onMessage(String message, @PathParam("idUtente") String idUtente) {
        JsonReader reader = Json.createReader(new StringReader(message));
        JsonObject jsonObject = reader.readObject();

        String msg = jsonObject.getString("message");
        String email = jsonObject.getString("email");
        reader.close();

        if (msg.equalsIgnoreCase("produce")) {
            int numProducersCreated = pecProcessService.startProcessForEmailAddress(idUtente, email, this);
            sendMessage(idUtente, "queued", numProducersCreated > 0);
        }
    }

    private void sendMessage(String identifier, String message, boolean workDone) {
        String msgToSend = Json.createObjectBuilder()
                .add("message", message)
                .add("workDone", workDone)
                .build()
                .toString();

        if (identifier != null) {
            Session session = sessions.get(identifier);
            if (session != null) {
                session.getAsyncRemote().sendObject(msgToSend, result ->  {
                    if (result.getException() != null) {
                        System.out.println("Unable to send message: " + result.getException());
                    }
                });
            }
            return;
        }

        sessions.values().forEach(s -> {
            s.getAsyncRemote().sendObject(msgToSend, result ->  {
                if (result.getException() != null) {
                    System.out.println("Unable to send message: " + result.getException());
                }
            });
        });
    }

    @Override
    public void notifyOnPecProcessCompleted(String identifier, String message, boolean workDone) {
        sendMessage(identifier, message, workDone);
    }
}
