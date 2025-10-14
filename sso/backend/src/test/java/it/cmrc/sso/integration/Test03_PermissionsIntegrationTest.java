package it.cmrc.sso.integration;

import io.quarkus.test.junit.QuarkusTest;
import it.cmrc.sso.beans.CreateDelegationBean;
import it.cmrc.sso.beans.CreatePermissionBean;
import it.cmrc.sso.entity.Office;
import it.cmrc.sso.entity.Permit;
import it.cmrc.sso.entity.Role;
import it.cmrc.sso.entity.User;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.util.Request;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import javax.transaction.Transactional;

import java.util.ArrayList;
import java.util.Map;

import static org.hamcrest.Matchers.*;


@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class Test03_PermissionsIntegrationTest {

    @Test
    @Order(1)
    public void synchUsers() {

        Request.post("auth/synch_users", null)
                .then()
                .assertThat()
                .statusCode(anyOf(is(200), is(304)));
    }

    @Test
    @Order(2)
    public void savePermit() {

        User user = User.findAll().firstResult();
        Office office = Office.findAll().firstResult();
        Role role = Role.findAll().firstResult();

        Request.post("permit/add_permission", new CreatePermissionBean(user.id, office.id, role.id))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("type", is(PermitType.PERSISTENT.toString()))
                .body("delegation_start", nullValue())
                .body("delegation_start", nullValue());
    }

    @Test
    @Order(3)
    public void saveDelegation() {

        User user = User.findAll().firstResult();
        Office office = Office.findAll().firstResult();
        Role role = Role.findAll().firstResult();

        Request.post("permit/add_delegation", new CreateDelegationBean(null, null, user.id, "2020-11-11T11:11:11", "2021-11-11T11:11:11", new ArrayList<>(), 1L))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("type", is(PermitType.DELEGATION.toString()))
                .body("delegation_start", notNullValue())
                .body("delegation_start", notNullValue());
    }

    @Test
    @Order(4)
    public void fetchPermit() {
        Permit permit = Permit.findAll().firstResult();

        Request.get("permit/{}", permit.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("type", is(permit.type.toString()))
                .body("user_id", is(permit.user_id.intValue()))
                .body("role_id", is(permit.role_id.intValue()))
                .body("office_id", is(permit.office_id.intValue()));
    }
//
//
//
//
//    @Test
//    @Order(5)
//    public void updatePermit() {
//
//        Permit permit = Permit.findAll().firstResult();
//
//        Request.put("permit/{}", new PermitInput("test2", null), permit.id.toString())
//                .then()
//                .assertThat()
//                .statusCode(200)
//                .and()
//                .body("name", is("test2"))
//                .body("description", is(permit.description));
//
//    }
//
//
    @Test
    @Order(6)
    public void deletePermit() {
        Permit permit = Permit.find("type = :tp", Map.of("tp", PermitType.PERSISTENT)).firstResult();

        Request.delete("permit/{}", permit.id.toString())
                .then()
                .assertThat()
                .statusCode(200);

    }


}
