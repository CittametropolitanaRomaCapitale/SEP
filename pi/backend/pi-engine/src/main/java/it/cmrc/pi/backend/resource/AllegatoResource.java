package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.AllegatiOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaAllegatiDTO;
import it.parsec326.pi.intranet.service.AllegatoService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
public class AllegatoResource {

    @Inject
    AllegatoService allegatoService;

    @Query(value="deleteAllegatiNonUtilizzati")
    public boolean deleteAllegatiNonUtilizzati() {
        allegatoService.deleteAllegatiNonUtilizzati();
        return true;
    }

    @Query(value = "getAllegati")
    public AllegatiOutputDTO getAllegati(@Name("ricercaAllegatiDTO") RicercaAllegatiDTO ricercaAllegatiDTO) {
        return allegatoService.getAllegati(ricercaAllegatiDTO);
    }

    @Query(value = "getAllegatiDiscarded")
    public AllegatiOutputDTO getAllegatiDiscarded(@Name("ricercaAllegatiDTO") RicercaAllegatiDTO ricercaAllegatiDTO) {
        return allegatoService.getAllegatiDiscarded(ricercaAllegatiDTO);
    }

    @Mutation(value = "discardAllegato")
    public boolean discardAllegato(@Name("idAllegato") Long idAllegato) {
        return allegatoService.discardAllegato(idAllegato);
    }

    @Mutation(value = "resumeAllegato")
    public boolean resumeAllegato(@Name("idAllegato") Long idAllegato) {
        return allegatoService.resumeAllegato(idAllegato);
    }

}
