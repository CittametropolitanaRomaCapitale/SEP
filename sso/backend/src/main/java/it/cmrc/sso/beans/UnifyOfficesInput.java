package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnifyOfficesInput {

    //public Map<Long, Map<Long, List<Long>>> officeUserUpdates;

    public List<OfficeUserUpdates> officeUserUpdates;

    public boolean mantainOfficeActive;
}
