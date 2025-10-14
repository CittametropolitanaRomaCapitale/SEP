package it.cmrc.sso.util;

import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.JsonArray;
import java.util.ArrayList;

@ApplicationScoped
public class AuthUtil {

    @Inject
    JsonWebToken jwt;

    public String extractNameFromToken() {
        return jwt.getClaim("name");
    }

    public String extractIdFromToken() {
        return jwt.getClaim("sub");
    }

    public ArrayList<String> extractRolesFromToken() {
        JsonArray array = jwt.getClaim("roles");
        ArrayList<String> listdata = new ArrayList<String>();
        if (array != null) {
            for (int i=0;i<array.size();i++){
                listdata.add(array.getString(i));
            }
        }
        return listdata;
    }
}
