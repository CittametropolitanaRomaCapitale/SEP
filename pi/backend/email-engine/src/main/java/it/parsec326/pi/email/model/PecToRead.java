package it.parsec326.pi.email.model;

import it.parsec326.pi.intranet.model.PecPeo;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@ApplicationScoped
public class PecToRead extends PecPeo {

    @Getter
    @Setter
    private Date lastTsInvio;

    public static PecToRead mapFromPecPeo(PecPeo pecPeo) {
        PecToRead pecToRead = new PecToRead();
        pecToRead.setConfigurazione(pecPeo.getConfigurazione());
        pecToRead.setIdUtente(pecPeo.getIdUtente());
        pecToRead.setIndirizzoEmail(pecPeo.getIndirizzoEmail());
        pecToRead.setTsCreation(pecPeo.getTsCreation());
        pecToRead.setPassword(pecPeo.getPassword());
        pecToRead.setAttiva(pecPeo.isAttiva());
        pecToRead.setSaveToSent(pecPeo.isSaveToSent());
        pecToRead.setDeleteMessages(pecPeo.isDeleteMessages());
        pecToRead.setUffici(pecPeo.getUffici());
        return pecToRead;
    }
}
