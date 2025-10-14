package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.PecEscluseRispostaAutomaticaDTOList;
import it.parsec326.pi.intranet.dto.input.PecEscluseRispostaAutomaticaInput;
import it.parsec326.pi.intranet.dto.ricerca.RicercaPecEscluseRispostaAutomaticaDTO;
import it.parsec326.pi.intranet.model.PecEscluseRispostaAutomatica;
import it.parsec326.pi.intranet.service.PecEscluseRispostaAutomaticaService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
public class PecEscluseRispostaAutomaticaResource {
    @Inject
    PecEscluseRispostaAutomaticaService pecEscluseRispostaAutomaticaService;

    @Query(value = "getAllPecEscluse")
    public List<PecEscluseRispostaAutomatica> getAllPecEscluse(@Name("search") String search){
        return pecEscluseRispostaAutomaticaService.findAllPecEscluse(search);
    }

    @Query(value = "getPecEscluseList")
    public PecEscluseRispostaAutomaticaDTOList getPecEscluseList(@Name("searchPecEscluse") RicercaPecEscluseRispostaAutomaticaDTO searchPecEscluseDTO) {
        return pecEscluseRispostaAutomaticaService.getPecEscluseListDTO(searchPecEscluseDTO);
    }

    @Mutation(value = "savePecEsclusa")
    public PecEscluseRispostaAutomatica savePecEsclusa(@Name("pecInput") PecEscluseRispostaAutomaticaInput input) {
        return pecEscluseRispostaAutomaticaService.savePecEsclusaInput(input);
    }

    @Mutation(value = "updatePecEsclusa")
    public PecEscluseRispostaAutomatica updatePecEsclusa(@Name("id") Long id, @Name("pecInput") PecEscluseRispostaAutomaticaInput input) {
        return pecEscluseRispostaAutomaticaService.updatePecEsclusaInput(id, input);
    }

    @Mutation(value = "deletePecEsclusa")
    public boolean deletePecEsclusa(@Name("id") Long id) {
        return pecEscluseRispostaAutomaticaService.deletePecEsclusa(id);
    }
}
