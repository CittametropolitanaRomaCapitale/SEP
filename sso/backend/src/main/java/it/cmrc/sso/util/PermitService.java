package it.cmrc.sso.util;

import it.cmrc.sso.entity.Permit;
import it.cmrc.sso.entity.UserHistory;
import it.cmrc.sso.entity.UserOffice;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.entity.common.RecordType;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
public class PermitService {

    @Transactional
    public void save(Permit permit){
        permit.persist();

        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.PERM;
        userHistory.office_id = permit.office_id;
        userHistory.user_id = permit.user_id;
        userHistory.role_id = permit.role_id;
        userHistory.type = permit.type; //PermitType.PERSISTENT;
        userHistory.permit_id = permit.id;
        userHistory.persistAndFlush();
    }
}
