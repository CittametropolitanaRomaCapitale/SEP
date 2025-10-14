package it.cmrc.pi.backend.resource.rest;

import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.service.ProtocolloService;
import it.parsec326.pi.intranet.service.TitolarioService;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("/cmrc/s/fascicolazione/external/{siteId}")
public class FascicolazioneRestController extends RestAuthenticatedResource {

    @Inject
    ProtocolloService protocolloService;

    @Inject
    TitolarioService titolarioService;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response fascicolazioneProtocollo(@PathParam("siteId") String siteId,
                                             @NotNull @FormParam(value = "nProtocollo") String nProtocollo,
                                             @NotNull @FormParam(value = "fascicolo") String fascicolo,
                                             @FormParam(value = "replace") Boolean replace) {
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
            protocolloService.fascicolazioneProtocolloFromRestApi(nProtocollo, fascicolo, replace != null && replace);
            return Response.ok()
                    .entity(Map.of(
                            "error_code", "",
                            "status", "success",
                            "message", "Protocollo fascicolato con successo"
                    ))
                    .build();
        }
        catch (IllegalArgumentException ex) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of(
                            "error_code", "ERR_001",
                            "status", "error",
                            "message", ex.getMessage()
                    ))
                    .build();
        }
        catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of(
                            "error_code", "ERR_002",
                            "status", "error",
                            "message", ex.getMessage()
                    ))
                    .build();
        }
    }

    @GET
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFascicoliProtocollo(@PathParam("siteId") String siteId, @NotNull @QueryParam(value = "nProtocollo") String nProtocollo) {
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
            Protocollo p = protocolloService.getProtocolloByNumero(nProtocollo);
            List<TitolarioOutputDTO> fascicoli = titolarioService.getTitolarioByProtocollo(p.getProtocolliClassificazioneList(), null, null, true, false, false, false);

            List<String> fascicoliHierarchies = new ArrayList<>();
            for(TitolarioOutputDTO t : fascicoli) {
                String fascicoloHierarchy = t.getHierarchyString().replace("TITOLI / ", "") + t.getLabel();
                fascicoliHierarchies.add(fascicoloHierarchy.replace(" / ", "/").replace(" /", "/"));
            }

            return Response.ok()
                    .entity(Map.of(
                            "error_code", "",
                            "status", "success",
                            "message", "Lista fascicoli",
                            "fascicoli", fascicoliHierarchies
                    ))
                    .build();
        }
        catch (IllegalArgumentException ex) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of(
                            "error_code", "ERR_001",
                            "status", "error",
                            "message", ex.getMessage()
                    ))
                    .build();
        }
        catch (NoResultException ex) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of(
                            "error_code", "ERR_002",
                            "status", "error",
                            "message", ex.getMessage()
                    ))
                    .build();
        }
        catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of(
                            "error_code", "ERR_003",
                            "status", "error",
                            "message", ex.getMessage()
                    ))
                    .build();
        }
    }
}
