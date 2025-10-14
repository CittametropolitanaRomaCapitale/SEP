package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.model.PermessiFascicoloDipendente;
import it.parsec326.pi.intranet.service.PermessiFascicoloDipendenteService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
public class PermessiFascicoloDipendenteResource {

    @Inject
    PermessiFascicoloDipendenteService service;

    // TODO: da implementare la restante logica
    @Query(value = "getAllPermessiFascicoloDipendente")
    public List<PermessiFascicoloDipendente> getAll(){
        return service.getAll();
    }

    //T ODO: utilizzato per testare una insert
    @Mutation(value = "insertPermessoFascicoloDipendente")
    public void savePermesso(){
        service.addNew();
    }
}
