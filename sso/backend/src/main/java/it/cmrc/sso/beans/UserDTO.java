package it.cmrc.sso.beans;

import it.cmrc.sso.entity.UserOffice;

import java.util.List;

public class UserDTO {

    public String username;

    public String firstName;

    public String lastName;
    public String email;

    public List<String> roles;

    public List<UserOffice> userOffices;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<UserOffice> getUserOffices() {
        return userOffices;
    }

    public void setUserOffices(List<UserOffice> userOffices) {
        this.userOffices = userOffices;
    }


}
