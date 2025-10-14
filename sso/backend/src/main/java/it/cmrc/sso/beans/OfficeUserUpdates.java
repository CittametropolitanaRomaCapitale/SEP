package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfficeUserUpdates {

    public Long officeId;

    public List<UserOffices> userOffices;

    public boolean deleteOffice;

}
