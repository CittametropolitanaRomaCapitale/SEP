package it.parsec326.pi.email.resource;

import it.parsec326.pi.email.service.PecRegoleProcessorService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("PecRegole")
public class PecRegoleProcessorResource {

    @Inject
    PecRegoleProcessorService pecRegoleProcessorService;

    @GET
    @Path("start")
    public Response triggerProducerThread() {
        pecRegoleProcessorService.startProcessForPecs();
        return Response.status(Response.Status.OK)
                .entity("Regole analizzate").build();
    }
}
