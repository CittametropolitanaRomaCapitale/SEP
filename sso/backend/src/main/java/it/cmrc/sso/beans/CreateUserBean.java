package it.cmrc.sso.beans;

import org.keycloak.representations.idm.RoleRepresentation;

import java.util.List;

public class CreateUserBean {

    private String email;

    private List<RoleRepresentation> roles;

    private List<RoleRepresentation> removeRoles;

    private String password;

    private boolean passwordFinal;


    public CreateUserBean() {
    }

    public CreateUserBean(String email) {
        this.email = email;
    }

    public CreateUserBean(String email, List<RoleRepresentation> roles) {
        this.email = email;
        this.roles = roles;
    }

    public CreateUserBean(String email, List<RoleRepresentation> roles, String password, boolean passwordFinal) {
        this.email = email;
        this.roles = roles;
        this.password = password;
        this.passwordFinal = passwordFinal;
    }

    public boolean checkValid(){
        return (email != null && !email.isBlank());
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<RoleRepresentation> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleRepresentation> roles) {
        this.roles = roles;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isPasswordFinal() {
        return passwordFinal;
    }

    public void setPasswordFinal(boolean passwordFinal) {
        this.passwordFinal = passwordFinal;
    }

    public List<RoleRepresentation> getRemoveRoles() {
        return removeRoles;
    }

    public void setRemoveRoles(List<RoleRepresentation> removeRoles) {
        this.removeRoles = removeRoles;
    }
}
