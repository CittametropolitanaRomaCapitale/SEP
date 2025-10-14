package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoveUsersToOfficeInput {

    //public Map<Long, List<Long>> userUpdates;

    public List<UserOffices> userUpdates;

    public boolean deleteOffice;
}
