package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMultiPermissionBean {


    public Long user_id;

    public Long office_id;

    public List<Long> role_ids;

}
