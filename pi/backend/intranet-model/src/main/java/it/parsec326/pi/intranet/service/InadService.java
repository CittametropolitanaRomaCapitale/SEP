package it.parsec326.pi.intranet.service;

import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.Configurazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.io.StringReader;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.*;

@Slf4j
@ApplicationScoped
public class InadService {

    @Inject
    ConfigurazioneService configService;

    private static final String TOKEN_URL = "https://auth.interop.pagopa.it/token.oauth2";
    private static final String PRIVATE_KEY_PATH = "files/private_key.priv";

    public String generateInadJwt() {
        try {
            RSAPrivateKey privateKey = loadPrivateKey();
            Map<String, String> config = getInadConfig();

            String jwt = buildSignedJwt(config, privateKey);
            return requestAccessToken(jwt, config.get("issuer"));

        } catch (Exception e) {
            log.error("Errore durante la generazione del JWT INAD", e);
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante la generazione del JWT INAD");
        }
    }

    private RSAPrivateKey loadPrivateKey() {
        try (InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(PRIVATE_KEY_PATH)) {
            if (is == null) {
                throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Chiave privata non trovata in: " + PRIVATE_KEY_PATH);
            }
            String pem = new String(is.readAllBytes())
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s+", "");

            byte[] decoded = Base64.getDecoder().decode(pem);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
            return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(keySpec);
        } catch (Exception e) {
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante il parsing della chiave privata");
        }
    }

    private Map<String, String> getInadConfig() {
        List<Configurazione> configs = configService.getAllConfigurazioniByCategoria("inad");
        Map<String, String> configMap = new HashMap<>();
        configs.stream()
                .filter(c -> c.getNome() != null)
                .forEach(c -> configMap.put(c.getNome(), c.getValore()));

        List<String> requiredKeys = List.of("kid", "audience", "issuer", "purposeId", "subject");
        for (String key : requiredKeys) {
            if (!configMap.containsKey(key)) {
                throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Parametro di configurazione mancante: " + key);
            }
        }

        return configMap;
    }

    private String buildSignedJwt(Map<String, String> config, RSAPrivateKey privateKey) throws Exception {
        Instant now = Instant.now();
        Date iat = Date.from(now);
        Date exp = Date.from(now.plusSeconds(60 * 43200)); // 30 giorni

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .issuer(config.get("issuer"))
                .subject(config.get("subject"))
                .audience(config.get("audience"))
                .claim("purposeId", config.get("purposeId"))
                .jwtID(UUID.randomUUID().toString())
                .issueTime(iat)
                .expirationTime(exp)
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                .keyID(config.get("kid"))
                .type(JOSEObjectType.JWT)
                .build();

        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        signedJWT.sign(new RSASSASigner(privateKey));
        return signedJWT.serialize();
    }

    private String requestAccessToken(String jwt, String clientId) throws Exception {
        String form = "client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8) +
                "&client_assertion=" + URLEncoder.encode(jwt, StandardCharsets.UTF_8) +
                "&client_assertion_type=" + URLEncoder.encode("urn:ietf:params:oauth:client-assertion-type:jwt-bearer", StandardCharsets.UTF_8) +
                "&grant_type=" + URLEncoder.encode("client_credentials", StandardCharsets.UTF_8);

        HttpClient httpClient = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI(TOKEN_URL))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore risposta OAuth: " + response.statusCode());
        }

        try (JsonReader reader = Json.createReader(new StringReader(response.body()))) {
            JsonObject json = reader.readObject();
            String accessToken = json.getString("access_token", null);
            if (accessToken == null) {
                throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Access token mancante nella risposta OAuth");
            }
            return accessToken;
        }
    }
}
