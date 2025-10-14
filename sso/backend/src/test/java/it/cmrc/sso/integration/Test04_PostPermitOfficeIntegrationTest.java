package it.cmrc.sso.integration;

import io.quarkus.panache.common.Sort;
import io.quarkus.test.junit.QuarkusTest;
import it.cmrc.sso.beans.*;
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
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.is;


@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class Test04_PostPermitOfficeIntegrationTest {


    @Test
    @Order(1)
    public void addUserToOffice() {

        User u = User.findAll(Sort.descending("id")).firstResult();
        Office o = Office.find("deleted = false", Sort.descending("id")).firstResult();

        Request.put("office/add_user_to_office/{}/{}", null, u.id, o.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("user_id", is(u.id.intValue()))
                .body("office_id", is(o.id.intValue()));
    }

    @Test
    @Order(2)
    public void splitOffice() {
        UserOffice office = UserOffice.findAll().firstResult();
        Office o = Office.find("id <> :oid", Map.of("oid", office.office_id)).firstResult();
        List<UserOffices> data = new ArrayList<>();
        data.add(new UserOffices(office.user_id, List.of(o.id)));
        Request.put("office/split_or_delete/{}", new MoveUsersToOfficeInput(data, false), office.office_id)
                .then()
                .assertThat()
                .statusCode(200);

    }


    @Test
    @Order(3)
    public void addUserToOffice2() {

        User u = User.findAll(Sort.ascending("id")).firstResult();
        Office o = Office.find("deleted = false", Sort.ascending("id")).firstResult();

        Request.put("office/add_user_to_office/{}/{}", null, u.id, o.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("user_id", is(u.id.intValue()))
                .body("office_id", is(o.id.intValue()));
    }

    @Test
    @Order(4)
    public void addUserToOffice3() {

        User u = User.findAll(Sort.descending("id")).firstResult();
        Office o = Office.find("deleted = false", Sort.descending("id")).firstResult();

        Request.put("office/add_user_to_office/{}/{}", null, u.id, o.id)
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("user_id", is(u.id.intValue()))
                .body("office_id", is(o.id.intValue()));
    }

    @Test
    @Order(5)
    public void saveOffice3() {

        Request.post("office", new OfficeInput("test4", "t04", null,null, "test decsription 4", null, false))
                .then()
                .assertThat()
                .statusCode(200)
                .and()
                .body("name", is("test4"))
                .body("code", is("t04"))
                .body("description", is("test decsription 4"));
    }

    @Test
    @Order(6)
    public void unifyOffice() {
        List<Long> offs = Office.find("deleted = false").stream().map(o -> ((Office)o).id).collect(Collectors.toList());
        System.out.println("Offices ids : ");
        offs.forEach(System.out::println);
        List<UserOffice> offices = UserOffice.find("office_id in :offs_id", Map.of("offs_id", offs)).list();
        System.out.println("UserOffices : ");
        offices.forEach(System.out::println);
        Office o = Office.find("id not in :oid and deleted = false", Map.of("oid", List.of(offices.get(0).office_id, offices.get(1).office_id))).firstResult();

        List<OfficeUserUpdates> data = new ArrayList<>();

        data.add(new OfficeUserUpdates(offices.get(0).office_id, List.of(new UserOffices(offices.get(0).user_id, List.of(o.id))), false));
        data.add(new OfficeUserUpdates(offices.get(1).office_id, List.of(new UserOffices(offices.get(1).user_id, List.of(o.id))), false));

        Request.put("office/unify", new UnifyOfficesInput(data, false))
                .then()
                .assertThat()
                .statusCode(200);

    }


}
