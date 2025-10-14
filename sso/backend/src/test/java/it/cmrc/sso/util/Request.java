package it.cmrc.sso.util;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;


public class Request {

    private static final String URL = "http://localhost:8081/api/";


    public static Response post(String path, Object body, Object... pathParams){

        for (Object o : pathParams) {
            path = path.replaceFirst("\\{}", o == null ? "null" : o.toString());
        }

        RequestSpecification requestSpecification = RestAssured.given().
                contentType(ContentType.JSON);

        if(body != null){
            requestSpecification = requestSpecification.body(body);
        }

        return requestSpecification.
                when().
                post(URL + path);
    }

    public static Response put(String path, Object body, Object... pathParams){

        for (Object o : pathParams) {
            path = path.replaceFirst("\\{}", o == null ? "null" : o.toString());
        }
        RequestSpecification requestSpecification = RestAssured.given().
                contentType(ContentType.JSON);

        if(body != null){
            requestSpecification = requestSpecification.body(body);
        }

        return requestSpecification.
                when().
                put(URL + path);
    }

    public static Response get(String path, Object... pathParams){

        for (Object o : pathParams) {
            path = path.replaceFirst("\\{}", o == null ? "null" : o.toString());
        }

        return RestAssured.given().
                contentType(ContentType.JSON).
                when().
                get(URL + path);
    }

    public static Response delete(String path, Object... pathParams){

        for (Object o : pathParams) {
            path = path.replaceFirst("\\{}", o == null ? "null" : o.toString());
        }

        return RestAssured.given().
                contentType(ContentType.JSON).
                when().
                delete(URL + path);
    }

}
