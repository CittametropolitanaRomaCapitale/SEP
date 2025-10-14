package it.parsec326.pi.intranet.dto.client.sso;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;

public class UserDTODeserializer extends JsonDeserializer<DatiUtenteSlimSSO> {

    @Override
    public DatiUtenteSlimSSO deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);

        DatiUtenteSlimSSO u = new DatiUtenteSlimSSO();
        u.authId = node.get("auth_id").asText();
        u.email = node.get("email").asText();
        if (u.email != null && u.email.equalsIgnoreCase("null")) {
            u.email = null;
        }
        u.firstName = node.get("firstName").asText();
        u.lastName = node.get("lastName").asText();
        u.username = node.get("username").asText();
        return u;
    }
}
