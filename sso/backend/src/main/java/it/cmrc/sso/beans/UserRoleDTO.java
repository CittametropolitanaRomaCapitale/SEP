package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleDTO {
    public String auth_id;
    public String username;
    public String firstName;
    public String lastName;
    public String email;
    public List<String> roles;
}
