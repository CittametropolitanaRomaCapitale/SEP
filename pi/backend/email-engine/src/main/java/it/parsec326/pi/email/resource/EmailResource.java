package it.parsec326.pi.email.resource;

import it.parsec326.pi.email.model.PecToRead;
import it.parsec326.pi.email.pec_queue.worker.EmailReaderWorker;
import it.parsec326.pi.intranet.model.Email;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.service.*;
import it.parsec326.pi.intranet.utils.common.EmailDirection;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Path("email")
@ApplicationScoped
public class EmailResource {

    @Inject
    PecPeoService pecPeoService;

    @Inject
    EmailService emailService;

    @Inject
    AllegatoService allegatoService;

    @Inject
    ProtocolloService protocolloService;

    @Inject
    StoricoService storicoService;

    @Inject
    EntityManager em;

    @Inject
    PecMessageConverterService pecMessageConverterService;

    @POST
    @Path("readPec")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void readPEC(@NotNull @FormParam(value = "emailAddress") String emailAddress,
                        @NotNull @FormParam(value = "from")String from,
                        @NotNull @FormParam(value = "to")String to) {

        PecPeo pecToRead = pecPeoService.getPecPeoByEmail(emailAddress);
        if (pecToRead == null) return;
        if (!pecToRead.isAttiva()) return;
        if (!pecToRead.getConfigurazione().getTipologiaPosta().isPec()) return;

        Date f = null;
        Date t = null;
        try {
            LocalDateTime lf = LocalDateTime.parse(from);
            LocalDateTime lt = LocalDateTime.parse(to);
            f = Date.from(lf.atZone(ZoneId.systemDefault()).toInstant());
            t = Date.from(lt.atZone(ZoneId.systemDefault()).toInstant());
        }
        catch (Exception ignored) {
            return;
        }

        PecToRead pecPeoConfiguration = PecToRead.mapFromPecPeo(pecToRead);
        EmailReaderWorker worker = new EmailReaderWorker(emailService, allegatoService, protocolloService, storicoService, em, pecPeoConfiguration, pecMessageConverterService);
        worker.doForceRun(f, t, true, true);
    }

    @POST
    @Path("readRicevutePec")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void readRicevutePEC(@NotNull @FormParam(value = "emailId") Long idEmail) {

        Email email = Email.findById(idEmail);
        if (email == null || email.getMessageId() == null || (!email.getEmailDirection().equals(EmailDirection.USCITA))) return;

        PecPeo pecToRead = pecPeoService.getPecPeoByEmail(email.getFrom());
        if (pecToRead == null) return;
        if (!pecToRead.isAttiva()) return;
        if (!pecToRead.getConfigurazione().getTipologiaPosta().isPec()) return;

        Date f = Date.from(email.getTsInvio().toInstant());
        Date t = Date.from(email.getTsInvio().toInstant().plus(Duration.ofMinutes(30)));

        PecToRead pecPeoConfiguration = PecToRead.mapFromPecPeo(pecToRead);
        EmailReaderWorker worker = new EmailReaderWorker(emailService, allegatoService, protocolloService, storicoService, em, pecPeoConfiguration, pecMessageConverterService);
        worker.doForceRun(f, t, false, true);
    }
}
