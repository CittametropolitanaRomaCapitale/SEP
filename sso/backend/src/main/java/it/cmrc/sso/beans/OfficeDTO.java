package it.cmrc.sso.beans;

import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

public class OfficeDTO {

    public OfficeDTO(String name, String code, String description, String service, Long dirigente_user_id, Date office_start_date, Date office_end_date, Date last_update, boolean deleted, boolean deleted_permanent, boolean blocked) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.service = service;
        this.dirigente_user_id = dirigente_user_id;
        this.office_start_date = office_start_date;
        this.office_end_date = office_end_date;
        this.last_update = last_update;
        this.deleted = deleted;
        this.deleted_permanent = deleted_permanent;
        this.blocked = blocked;
    }

    public String name;

    public String code;

    public String description;

    public String service;

    public Long dirigente_user_id;

    public Date office_start_date;

    public Date office_end_date;

    @UpdateTimestamp
    public Date last_update;

    public boolean deleted;

    public boolean deleted_permanent;

    public boolean blocked;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public Long getDirigente_user_id() {
        return dirigente_user_id;
    }

    public void setDirigente_user_id(Long dirigente_user_id) {
        this.dirigente_user_id = dirigente_user_id;
    }

    public Date getOffice_start_date() {
        return office_start_date;
    }

    public void setOffice_start_date(Date office_start_date) {
        this.office_start_date = office_start_date;
    }

    public Date getOffice_end_date() {
        return office_end_date;
    }

    public void setOffice_end_date(Date office_end_date) {
        this.office_end_date = office_end_date;
    }

    public Date getLast_update() {
        return last_update;
    }

    public void setLast_update(Date last_update) {
        this.last_update = last_update;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public boolean isDeleted_permanent() {
        return deleted_permanent;
    }

    public void setDeleted_permanent(boolean deleted_permanent) {
        this.deleted_permanent = deleted_permanent;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }
}
