package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.ricerca.RicercaStoricoDTO;
import it.parsec326.pi.intranet.dto.StoricoOutputDTO;
import it.parsec326.pi.intranet.service.DocumentService;
import it.parsec326.pi.intranet.service.StoricoService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
//@Authenticated
public class StoricoResource {

  @Inject
  StoricoService storicoService;

  @Inject
  DocumentService documentService;

  @Query(value="getStoricoProtocollo")
  public StoricoOutputDTO getStoricoProtocollo(@Name("ricerca_storico") RicercaStoricoDTO ricercaStoricoDTO){
    return storicoService.getLogStorici(ricercaStoricoDTO, "");
  }

  @Query(value="getStoricoTitolario")
  public StoricoOutputDTO getStoricoTitolario(@Name("ricerca_storico") RicercaStoricoDTO ricercaStoricoDTO){
    return storicoService.getLogStorici(ricercaStoricoDTO, "");
  }

  @Query(value="getStoricoRegistroGiornaliero")
  public StoricoOutputDTO getStoricoRegistroGiornaliero(@Name("ricerca_storico") RicercaStoricoDTO ricercaStoricoDTO){
    return storicoService.getLogStorici(ricercaStoricoDTO, "");
  }

  @Mutation(value = "exportStorico")
  public String exportStorico(@Name("dto") RicercaStoricoDTO dto, @Name("formato") String formato) {
    return documentService.exportStorico(dto, formato);
  }
}