package it.cmrc.sso.entity.common;

import it.cmrc.sso.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {

    public Long id;

    public String username;

    public String firstName;

    public String lastName;

    public String auth_id;

    public String email;

    public static UserDTO fromUser(User u) {
        return new UserDTO(u.id, u.username, u.firstName, u.lastName, u.auth_id, u.email);
    }
}
