package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.output.ReferentiProtocolloOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaReferentiProtocolloDTO;
import it.parsec326.pi.intranet.service.ReferentiProtocolloService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
//@Authenticated
public class ReferentiProtocolloResource {

    @Inject
    ReferentiProtocolloService referentiProtocolloService;

    @Query(value = "getReferenti")
    public ReferentiProtocolloOutputDTO getReferenti(@Name("ricercaReferentiProtocollo") RicercaReferentiProtocolloDTO ricercaDTO){
        return referentiProtocolloService.getReferentiDto(ricercaDTO);
    }

    @Query(value = "getReferentiDto")
    public ReferentiProtocolloOutputDTO getReferentiDto(@Name("ricercaReferentiProtocollo") RicercaReferentiProtocolloDTO ricercaDTO){
        return referentiProtocolloService.getReferentiDto(ricercaDTO);
    }
}
