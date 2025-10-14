package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleBean {

    private String name;

    private Long applicationId;

    private String keycloak_ref;

    private int hierarchy_level;

}
