package it.cmrc.sso.beans;


import it.cmrc.sso.entity.Office;
import it.cmrc.sso.entity.User;
import it.cmrc.sso.entity.UserHistory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeBean {

    private UserBean user_data;
    private List<UserHistory> history;
    private List<Office> storic_offices;

}
