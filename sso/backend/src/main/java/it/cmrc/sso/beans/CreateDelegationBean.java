package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDelegationBean {

    public String note;

    public Long user_id;

    public Long to_user_id;

    public String delegation_start;

    public String delegation_end;

    public List<Long> cdr_code_list;

    public Long applicationId;

}
