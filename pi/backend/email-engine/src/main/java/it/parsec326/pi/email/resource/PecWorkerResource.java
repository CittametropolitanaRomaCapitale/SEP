package it.parsec326.pi.email.resource;

import it.parsec326.pi.email.pec_queue.EmailProducer;
import it.parsec326.pi.email.service.PecProcessService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("Pec")
public class PecWorkerResource {

    @Inject
    EmailProducer producer;

    @Inject
    PecProcessService pecProcessService;

    @GET
    @Path("ProduceQueue")
    @Produces(MediaType.APPLICATION_JSON)
    public Response triggerProducerThread() throws InterruptedException {
        producer.produce();
        return Response.status(Response.Status.OK)
                .entity("Producer inseriti in coda").build();
    }

    @GET
    @Path("ProduceQueue/{idUtente}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response triggerProducerThreadForUtente(@PathParam("idUtente") String idUtente) {
        producer.producePecForUtente(idUtente);
        return Response.status(Response.Status.OK)
                .entity("Producer inserito nella coda").build();
    }

    @GET
    @Path("StartProcess")
    @Produces(MediaType.APPLICATION_JSON)
    public void startProcess() throws InterruptedException {
        pecProcessService.startProcess(null);
    }
}
