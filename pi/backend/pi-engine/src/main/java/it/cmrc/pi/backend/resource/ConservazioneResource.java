package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.LoginConservazioneDTO;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
public class ConservazioneResource {

    @Inject
    ConfigurazioneService configurazioneService;

    @Mutation(value="saveLoginConservazione")
    public boolean saveLoginConservazione(@Name("loginInput") LoginConservazioneDTO loginInput) throws Exception {
        return configurazioneService.saveLoginConservazione(loginInput);
    }

    @Query(value="getLoginConservazione")
    public LoginConservazioneDTO getLoginConservazione() throws Exception  {
        return configurazioneService.getLoginConservazioneDecrypted();
    }

    @Mutation(value="updateLoginConservazione")
    public boolean updateLoginConservazione(@Name("loginInput") LoginConservazioneDTO loginInput) throws Exception {
        return configurazioneService.updateLoginConservazione(loginInput);
    }
}
