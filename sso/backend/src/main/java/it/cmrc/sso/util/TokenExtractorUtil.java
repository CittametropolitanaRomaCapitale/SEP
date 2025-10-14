package it.cmrc.sso.util;

import it.cmrc.sso.entity.User;
import io.quarkus.arc.Unremovable;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.jwt.auth.principal.DefaultJWTCallerPrincipal;
import io.smallrye.mutiny.tuples.Tuple2;
//import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.security.Principal;
import java.util.Map;

@ApplicationScoped
@Unremovable
public class TokenExtractorUtil implements LoggingUtilInterface{

    @Inject
    SecurityIdentity securityIdentity;

//    @Inject
//    JsonWebToken jwt;

    public String extractUserFromToken() {

        String userKeycloakId = null;
        String username = null;

        Principal principal = securityIdentity.getPrincipal();
        if (principal instanceof DefaultJWTCallerPrincipal) {
            userKeycloakId = ((DefaultJWTCallerPrincipal) principal).getSubject();
            User user = User.find("auth_id = :authId", Map.of("authId", userKeycloakId)).firstResult();
            if (user != null) {
                username = user.username;
            } else {
                username = "KEYCLOAK USER";
            }
        } else {
            username = "SYSTEM";
        }

        return username;
    }

    public Tuple2<String, String> extractLoggingUserFromToken() {

        String userKeycloakId = null;
        String username = null;

        Principal principal = securityIdentity.getPrincipal();
        if (principal instanceof DefaultJWTCallerPrincipal) {
            userKeycloakId = ((DefaultJWTCallerPrincipal) principal).getSubject();
            User user = User.find("auth_id = :authId", Map.of("authId", userKeycloakId)).firstResult();
            if (user != null) {
                username = user.username;
            } else {
                username = "KEYCLOAK USER";
            }
        } else {
            username = "SYSTEM";
        }

        return Tuple2.of("[ User : {} ] ", username);
    }

}
