package it.cmrc.sso.service;

import it.cmrc.sso.beans.UserRoleDTO;

import javax.enterprise.context.ApplicationScoped;
import java.util.Arrays;
import java.util.List;

@ApplicationScoped
public class OfficeApiService {

    public UserRoleDTO mapToUserRoleDTO(Object[] result) {
        String username = result[0] != null ? result[0].toString() : null;
        String firstName = result[1] != null ? result[1].toString() : null;
        String lastName = result[2] != null ? result[2].toString() : null;
        String authId = result[3] != null ? result[3].toString() : null;
        String email = result[4] != null ? result[4].toString() : null;
        List<String> roles = Arrays.asList(((String) result[5]).split(", "));

        return new UserRoleDTO(authId, username, firstName, lastName, email, roles);
    }
}
