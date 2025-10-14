package it.cmrc.sso.entity;

import it.cmrc.sso.entity.common.PanacheCustomEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Entity;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity(name = "attachment")
@NoArgsConstructor
@AllArgsConstructor
public class Attachment extends PanacheCustomEntity {

    public String url;

    public Long delegation_id;

}
