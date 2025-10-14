package it.cmrc.pi.backend.resource.rest;

import it.parsec326.pi.intranet.dto.RestProtocolloInput;
import it.parsec326.pi.intranet.service.ProtocolloService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;


@Path("/cmrc/s/protocollazione/external/{siteId}")
public class ProtocolloRestController extends RestAuthenticatedResource {

    @Inject
    ProtocolloService protocolloService;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveProtocollo(@PathParam("siteId") String siteId, RestProtocolloInput input) {

        if (!isAuthenticated()) {
            return Response.status(Response.Status.FORBIDDEN)
                .entity(Map.of(
                        "error_code", "ERR001",
                        "status", "error",
                        "message", "Please provide a valid JWT by using the Bearer authentication mechanism"
                ))
                .build();
        }

        try {
            String numeroProtocollo = protocolloService.saveProtocolloFromRestApi(input);

            return Response.ok()
                    .entity(Map.of(
                            "error_code", "",
                            "status", "success",
                            "protocol_number", numeroProtocollo
                    ))
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of(
                            "error_code", "ERR002",
                            "status", "error",
                            "message", e.getMessage()
                    ))
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of(
                            "error_code", "ERR003",
                            "status", "error",
                            "message", "ERR_099: Errore interno durante la protocollazione"
                    ))
                    .build();
        }
    }
}
