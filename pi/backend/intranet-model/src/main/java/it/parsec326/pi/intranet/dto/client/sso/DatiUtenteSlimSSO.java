package it.parsec326.pi.intranet.dto.client.sso;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
public class DatiUtenteSlimSSO {
    public String firstName;
    public String lastName;
    public String username;
    public String authId;
    public String email;
    public Map<String, List<String>> cdrCodes;

    public static DatiUtenteSlimSSO mapFromDatiUtenteSSO(DatiUtenteSSO utenteSSO) {
        DatiUtenteSlimSSO slimSSO = new DatiUtenteSlimSSO();
        slimSSO.firstName = utenteSSO.firstName;
        slimSSO.lastName = utenteSSO.lastName;
        slimSSO.username = utenteSSO.username;
        slimSSO.authId = utenteSSO.auth_id;
        slimSSO.email = utenteSSO.email;

        slimSSO.cdrCodes = new HashMap<>();
        for (UserOffice uo : utenteSSO.userOffices) {
            List<String> roles = uo.roles.stream()
                    .map(r -> r.name)
                    .toList();
            slimSSO.cdrCodes.put(uo.office.code, roles);
        }
        return slimSSO;
    }

    public String getLabelForOffice(String cdrCode) {
        String roles = "";
        if (cdrCodes.containsKey(cdrCode)) {
            roles = String.join(", ", cdrCodes.get(cdrCode));
        }
        return lastName + " " + firstName + " (" + roles + ")";
    }

    @Override
    public String toString() {
        return lastName + " " + firstName + ": " + cdrCodes.toString();
    }
}
