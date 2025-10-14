package it.cmrc.sso.integration;

import io.quarkus.test.junit.QuarkusTest;
import it.cmrc.sso.beans.CreateRoleBean;
import it.cmrc.sso.entity.Application;
import it.cmrc.sso.entity.Role;
import it.cmrc.sso.util.Request;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;


@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class Test01_RoleIntegrationTest {


    @Test
    @Order(1)
    public void saveRole() {
        Application app = Application.findAll().firstResult();

        Request.post("role", new CreateRoleBean("test", app.id, null, 0))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("id", notNullValue())
                .body("keycloak_ref", notNullValue())
                .body("full_name", is("test_test"));
    }

    @Test
    @Order(2)
    public void fetchRole() {
        Role role = Role.findAll().firstResult();

        Request.get("role/{}", role.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("id", is(role.id.intValue()))
                .body("hierarchy_level", is(role.hierarchy_level))
                .body("full_name", is(role.full_name))
                .body("keycloak_ref", is(role.keycloak_ref))
                .body("name", is(role.name));
    }




    @Test
    @Order(3)
    public void updateRole() {

        Role role = Role.findAll().firstResult();

        Request.put("role/{}", 1, role.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("hierarchy_level", is(1));

    }


    @Test
    @Order(4)
    public void deleteRole() {
        Role role = Role.findAll().firstResult();

        Request.delete("role/{}", role.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("result", is(true));

    }

    @Test
    @Order(5)
    public void saveRole2() {
        Application app = Application.findAll().firstResult();

        Request.post("role", new CreateRoleBean("test2", app.id, null, 0))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("id", notNullValue())
                .body("keycloak_ref", notNullValue())
                .body("full_name", is("test_test2"));
    }


}
