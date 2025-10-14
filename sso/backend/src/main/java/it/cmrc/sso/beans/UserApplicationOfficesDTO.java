package it.cmrc.sso.beans;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserApplicationOfficesDTO {
    public String authId;
    public String username;
    public String firstName;
    public String lastName;
    public String email;
    public Map<String, List<String>> cdrCodes;

    public UserApplicationOfficesDTO() {
        cdrCodes = new HashMap<>();
    }

    public void addCdrCode(String cdrCode, String role) {
        if (cdrCodes.containsKey(cdrCode)) {
            List<String> rolesForCdr = new ArrayList<>(cdrCodes.get(cdrCode));
            if (!rolesForCdr.contains(role)) {
                rolesForCdr.add(role);
                cdrCodes.replace(cdrCode, rolesForCdr);
            }
        }
        else {
            cdrCodes.put(cdrCode, List.of(role));
        }
    }
}
