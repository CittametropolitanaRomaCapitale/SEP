package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.ModelloAutomaticoDTO;
import it.parsec326.pi.intranet.dto.ModelloAutomaticoInputDTO;
import it.parsec326.pi.intranet.dto.ModelloAutomaticoOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaModelloAutomaticoDTO;
import it.parsec326.pi.intranet.service.ModelloAutomaticoService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
public class ModelloAutomaticoResource {

    @Inject
    ModelloAutomaticoService modelloAutomaticoService;

    @Query(value="getModelliAutomaticiByCdrCode")
    public List<ModelloAutomaticoDTO> getModelliAutomaticiByCdrCode(@Name("selectedOffice") String selectedOffice){
        return modelloAutomaticoService.getModelliAutomaticiByCdrCode(selectedOffice);
    }

    @Query(value = "searchModelliAutomatici")
    public ModelloAutomaticoOutputDTO searchModelliAutomatici(@Name("input") RicercaModelloAutomaticoDTO input){
        return modelloAutomaticoService.getModelliAutomatici(input);
    }

    @Mutation("createModelloAutomatico")
    public ModelloAutomaticoDTO createModelloAutomatico(@Name("input") ModelloAutomaticoInputDTO input){
        return modelloAutomaticoService.createModelloAutomatico(input);
    }

    @Mutation("updateModelloAutomatico")
    public ModelloAutomaticoDTO updateModelloAutomatico(@Name("id") Long id, @Name("input") ModelloAutomaticoInputDTO input) {
        return modelloAutomaticoService.updateModelloAutomatico(id, input);
    }

    @Mutation("deleteModelloAutomatico")
    public boolean deleteModelloAutomatico(@Name("id") Long id){
        modelloAutomaticoService.deleteModelloAutomatico(id);
        return true;
    }

    @Mutation(value = "importModelliAutomaticiFromBase64")
    public boolean importModelliAutomaticiFromBase64(@Name("fileBase64") String fileBase64) {
        modelloAutomaticoService.saveModelliAutomaticiFromExcel(fileBase64);
        return true;
    }
}
