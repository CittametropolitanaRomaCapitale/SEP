package it.parsec326.pi.email.resource;

import it.parsec326.pi.email.pec_queue.NotificaQueue;
import it.parsec326.pi.email.service.NotificaProcessorService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/notifica")
public class NotificaProcessorResource {

    @Inject
    NotificaProcessorService notificaProcessorService;

    @POST
    @Path("/notificheNonInviate")
    @Consumes(MediaType.APPLICATION_JSON)
    public void sendAllNotificheNonInviate() {
        notificaProcessorService.sendAllNotificheNonInviate();
    }

    @POST
    @Path("/send")
    @Consumes(MediaType.APPLICATION_JSON)
    public void sendEmail(Long notificaId) {
        NotificaQueue.enqueue(notificaId);
    }

    @POST
    @Path("/send/list")
    @Consumes(MediaType.APPLICATION_JSON)
    public void sendEmail(List<Long> notificaIds) {
        notificaIds.forEach(NotificaQueue::enqueue);
    }
}
