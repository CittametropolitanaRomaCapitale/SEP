package it.cmrc.sso.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfficeInput {

    public String name;

    public String code;

    public Long dirigente_user_id;

    public String service;

    public String description;

    public List<Long> belonging_offices;

    public boolean blocked;
}
