package it.parsec326.pi.email.resource;

import it.parsec326.pi.email.pec_queue.EmailQueue;
import it.parsec326.pi.email.service.PecPeoProcessorService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/pecpeo")
public class PecPeoProcessorResource {

    @Inject
    PecPeoProcessorService pecPeoProcessorService;

    @POST
    @Path("/nonInviate")
    public void sendAllPecPeoNonInviate() throws Exception {
        pecPeoProcessorService.sendAllPecPeoNonInviate();
    }

    @POST
    @Path("/deleteAllInbox")
    public void deleteAllInboxTasks() {
        pecPeoProcessorService.deleteAllFromInbox();
    }

    @GET
    @Path("/deleteByPecPeoId/{pecPeoId}")
    public void deleteFromInboxByPecPeoId(@PathParam("pecPeoId") Long pecPeoId) {
        pecPeoProcessorService.deleteFromInboxByPecPeoId(pecPeoId);
    }

    @GET
    @Path("/deleteOldPecByAddress/{pecAddress}/{numMonths}/{checkAllEmails}")
    public void deleteOldPecByAddress(@PathParam("pecAddress") String pecAddress, @PathParam("numMonths") Integer numMonths, @PathParam("checkAllEmails") Boolean checkAllEmails) {
        pecPeoProcessorService.deleteFromInboxByPecPeoAddress(pecAddress, numMonths, checkAllEmails);
    }

    @GET
    @Path("/deleteByPecPeoId/{pecPeoId}/{emailId}")
    public void deleteFromInboxByPecPeoIdAndMessageId(@PathParam("pecPeoId") Long pecPeoId, @PathParam("emailId") Long emailId) {
        pecPeoProcessorService.deleteFromInboxByPecPeoIdAndMessgeId(pecPeoId, emailId);
    }

    @POST
    @Path("/checkDeletedAllInbox")
    public void checkDeletedAllInboxTasks() {
        pecPeoProcessorService.checkDeletedAllFromInbox();
    }

    @GET
    @Path("/checkDeletedByPecPeoId/{pecPeoId}")
    public void checkDeletedFromInboxByPecPeoId(@PathParam("pecPeoId") Long pecPeoId) {
        pecPeoProcessorService.checkDeletedFromInboxByPecPeoId(pecPeoId);
    }

    @POST
    @Path("/send")
    @Consumes(MediaType.APPLICATION_JSON)
    public void sendEmail(Long emailId){
        EmailQueue.enqueue(emailId);
    }

    @POST
    @Path("/send/list")
    @Consumes(MediaType.APPLICATION_JSON)
    public void sendEmail(List<Long> emailIds) {
        emailIds.forEach(EmailQueue::enqueue);
    }

}
