package it.cmrc.sso.util;

import it.cmrc.sso.entity.OfficeHistory;
import it.cmrc.sso.entity.UserHistory;
import it.cmrc.sso.entity.UserOffice;
import it.cmrc.sso.entity.common.RecordState;
import it.cmrc.sso.entity.common.RecordType;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import java.util.UUID;

@ApplicationScoped
public class UserOfficeService {

    @Transactional
    public void save(UserOffice userOffice){
        userOffice.persist();
        String uuid = UUID.randomUUID().toString();

        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.OFFICE;
        userHistory.correlation = uuid;
        userHistory.office_id = userOffice.office_id;
        userHistory.user_id = userOffice.user_id;
        userHistory.state = RecordState.IN;
        userHistory.persistAndFlush();

        OfficeHistory officeHistory = new OfficeHistory();
        officeHistory.record_type = RecordType.OFFICE;
        officeHistory.correlation = uuid;
        officeHistory.office_id = userOffice.office_id;
        officeHistory.user_id = userOffice.user_id;
        officeHistory.state = RecordState.IN;
        officeHistory.persistAndFlush();
    }
}
