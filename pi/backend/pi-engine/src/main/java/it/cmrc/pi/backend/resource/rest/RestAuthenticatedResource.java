package it.cmrc.pi.backend.resource.rest;

import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;

public class RestAuthenticatedResource {

    @Inject
    JsonWebToken jwt;

    protected boolean isAuthenticated() {
        if (jwt.getRawToken() != null) {
            if(jwt.getClaim("azp").equals("pi-api")) {
                return true;
            }
        }

        return false;
    }
}
