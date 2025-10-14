package it.cmrc.sso.entity.common;

import it.cmrc.sso.entity.User;
import it.cmrc.sso.entity.UserOffice;

import java.util.List;

public class UserWithAttributeDTO extends UserDTO {
    public String matricola;
    public String department;
    public String role;
    public String qualifica;
    public boolean isDirigente;
    public String cdrCode;
    public boolean mustBeImportedInTitolario;
    public boolean enabled;

    public UserWithAttributeDTO() {
        super(0L, "", "", "", "", "");
    }
    public UserWithAttributeDTO(Long id, String username, String firstName, String lastName, String auth_id, String email) {
        super(id, username, firstName, lastName, auth_id, email);
    }

    public static UserWithAttributeDTO fromUser(User user) {
        UserWithAttributeDTO uwa = new UserWithAttributeDTO(user.id, user.username, user.firstName, user.lastName, user.auth_id, user.email);
        List<UserOffice> uos = user.getUserOffices();
        StringBuilder userOfficesString = new StringBuilder();
        for(UserOffice uo : uos) {
            userOfficesString.append(uo.getOffice().name).append(", ");
        }
        uwa.department = userOfficesString.length() > 0 ? userOfficesString.substring(0, userOfficesString.toString().lastIndexOf(',')) : "";
        uwa.enabled = user.getEnabled() != null ? user.getEnabled() : true;
        return uwa;
    }
}
