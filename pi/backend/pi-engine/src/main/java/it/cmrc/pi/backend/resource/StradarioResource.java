package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.service.StradarioService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.Set;

@GraphQLApi
public class StradarioResource {

    @Inject
    StradarioService service;

    @Query("listaCap")
    public Set<String> listaCap(@Name("prefix") String prefix) {
        return service.listaCAP(prefix);
    }

    @Query("cittaDaCap")
    public Set<String> cittaDaCap(@Name("cap") String cap, @Name("prefix") String prefix) {
        return service.cittaDaCap(cap, prefix);
    }

    @Query("listaCapEsteso")
    public Set<String[]> listaCapDaCittaEstesa(@Name("prefix") String prefix,
                                               @Name("citta") String citta,
                                               @Name("tipoRicerca") String tipoRicerca) {
        return service.listaCAPDaCittaEstesa(prefix, citta, tipoRicerca);
    }

    @Query("vieDaCap")
    public Set<String> vieDaCap(@Name("cap") String cap, @Name("prefix") String prefix) {
        return service.listaVieDaCAP(cap, prefix);
    }

    @Query("vieDaCitta")
    public Set<String> vieDaCitta(@Name("citta") String citta) {
        return service.listaVieDaCitta(citta);
    }
}
