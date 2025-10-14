package it.cmrc.sso.resources;

import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;
import it.cmrc.sso.entity.User;

@ResourceProperties(path = "api/user")
public interface UserApi extends PanacheEntityResource<User, Long> {
}
