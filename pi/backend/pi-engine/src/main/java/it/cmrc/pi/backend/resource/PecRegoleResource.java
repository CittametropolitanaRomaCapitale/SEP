package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.PecRegoleDTO;
import it.parsec326.pi.intranet.dto.input.PecRegolaInputDTO;
import it.parsec326.pi.intranet.service.PecRegoleService;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
@Slf4j
public class PecRegoleResource {

    @Inject
    PecRegoleService service;

    @Query(value = "getPecRegole")
    public PecRegoleDTO getPecRegole(@Name("idEmail") Long idEmail) {
        return service.getForEmail(idEmail);
    }

    @Mutation(value = "deletePecRegola")
    public boolean deletePecRegola(@Name("idEmail") Long idEmail, @Name("idCategoria") Long idCategoria) {
        return service.deleteRegola(idEmail, idCategoria);
    }

    @Mutation(value = "savePecRegola")
    public PecRegolaInputDTO savePecRegola(@Name("input") PecRegolaInputDTO input) {
        return service.saveRegola(input);
    }
}
