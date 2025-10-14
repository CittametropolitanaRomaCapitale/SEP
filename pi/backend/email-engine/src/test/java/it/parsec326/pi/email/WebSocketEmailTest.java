package it.parsec326.pi.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.test.common.http.TestHTTPResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.websocket.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;


@QuarkusTest
public class WebSocketEmailTest {

    private static final LinkedBlockingDeque<String> MESSAGES = new LinkedBlockingDeque<>();

    @TestHTTPResource("/Pec/1")
    URI uri;

    @Test
    public void websocketResource_CommunicatesWithClient() throws Exception {
        try (Session session = ContainerProvider.getWebSocketContainer().connectToServer(Client.class, uri)) {
            Assertions.assertEquals("CONNECT", MESSAGES.poll(10, TimeUnit.SECONDS));

            List<String> expectedValues = new ArrayList<>();
            expectedValues.add("queued");
            expectedValues.add("producer");
            expectedValues.add("pec");
            expectedValues.add("ricevute");

            String msg = MESSAGES.poll(20, TimeUnit.SECONDS);
            if (msg != null) {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, String> map = mapper.readValue(msg, Map.class);

                Assertions.assertTrue(expectedValues.contains(map.get("message")));

                session.getAsyncRemote().sendText("{\"message\":\"consume\", \"email\":\"\"}");

                msg = MESSAGES.poll(20, TimeUnit.SECONDS);
                if (msg != null) {
                    map = mapper.readValue(msg, Map.class);
                    Assertions.assertTrue(expectedValues.contains(map.get("message")));
                }
            }
        }
    }

    @ClientEndpoint
    public static class Client {

        @OnOpen
        public void open(Session session) {
            MESSAGES.add("CONNECT");
            // Send a message to indicate that we are ready,
            // as the message handler may not be registered immediately after this callback.
            session.getAsyncRemote().sendText("{\"message\":\"produce\", \"email\":\"sviluppo@pec.parsec326.it\"}");
        }

        @OnMessage
        void message(String msg) {
            System.out.print("message received " + msg);
            MESSAGES.add(msg);
        }

    }
}
