package it.parsec326.pi.email;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.email.resource.PecWorkerResource;
import org.junit.jupiter.api.Test;

import java.net.URI;

import static io.restassured.RestAssured.when;

@QuarkusTest
@TestHTTPEndpoint(PecWorkerResource.class)
class PecWorkerResourceTest {

    @Test
    void produceQueueEndpoint_AnswersCorrectly() {
        when().get(URI.create("ProduceQueue")).then()
                .statusCode(200);
    }
    @Test
    void produceQueueEndpointForUtente_AnswersCorrectly() {
        when().get(URI.create("ProduceQueue/1")).then()
                .statusCode(200);
    }
    @Test
    void consumeQueueEndpoint_AnswersCorrectly() {
        when().get(URI.create("ConsumeQueue")).then()
                .statusCode(204);
    }
    @Test
    void consumeRicevuteQueueEndpoint_AnswersCorrectly() {
        when().get(URI.create("ConsumeRicevuteQueue")).then()
                .statusCode(204);
    }
    @Test
    void startProcessEndpoint_AnswersCorrectly() {
        when().get(URI.create("StartProcess")).then()
                .statusCode(204);
    }
}