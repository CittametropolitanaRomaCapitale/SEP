package it.cmrc.sso.integration;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.cmrc.sso.beans.MoveUsersToOfficeInput;
import it.cmrc.sso.beans.OfficeInput;
import it.cmrc.sso.entity.Application;
import it.cmrc.sso.entity.Office;
import it.cmrc.sso.entity.User;
import it.cmrc.sso.entity.UserOffice;
import it.cmrc.sso.util.Request;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;


@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class Test02_OfficeIntegrationTest {


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
    public void saveOffice() {

        Request.post("office", new OfficeInput("test", "t01",null,null,"test decsription",null, false))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("name", is("test"))
                .body("code", is("t01"))
                .body("description", is("test decsription"));
    }

    @Test
    @Order(3)
    public void fetchOffice() {
        Office office = Office.findAll().firstResult();

        Request.get("office/{}", office.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("name", is(office.name))
                .body("description", is(office.description));
    }




    @Test
    @Order(4)
    public void updateOffice() {

        Office office = Office.findAll().firstResult();

        Request.put("office/{}", new OfficeInput("test2", null,null,null,null,null, false), office.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("name", is("test2"))
                .body("description", is(office.description));

    }


    @Test
    @Order(5)
    public void deleteOffice() {
        Office office = Office.findAll().firstResult();

        Request.put("office/split_or_delete/{}", new MoveUsersToOfficeInput(new ArrayList<>(), true), office.id)
                .then()
                .assertThat()
                .statusCode(200);

    }

    @Test
    @Order(6)
    public void saveOffice2() {

        Request.post("office", new OfficeInput("test2", "t01", null,null, "test decsription 2", null, false))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("name", is("test2"))
                .body("code", is("t02"))
                .body("description", is("test decsription 2"));
    }

    @Test
    @Order(7)
    public void saveOffice3() {

        Request.post("office", new OfficeInput("test3", "t03", null,null, "test decsription 3", null, false))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("name", is("test3"))
                .body("code", is("t03"))
                .body("description", is("test decsription 3"));
    }


}
