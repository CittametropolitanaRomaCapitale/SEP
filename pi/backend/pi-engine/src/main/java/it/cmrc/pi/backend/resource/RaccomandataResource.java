package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.RaccomandataMittenteFields;
import it.parsec326.pi.intranet.dto.RaccomandataProtocolloDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaRaccomandataDTO;
import it.parsec326.pi.intranet.dto.client.raccomandata.LoginRaccomandataDTO;
import it.parsec326.pi.intranet.dto.input.RaccomandataProtocolloInput;
import it.parsec326.pi.intranet.model.RaccomandataProtocollo;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import it.cmrc.pi.backend.service.RaccomandataProtocolloService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
public class RaccomandataResource {

    @Inject
    RaccomandataProtocolloService raccomandataService;

    @Inject
    ConfigurazioneService configurazioneService;

    @Query(value="cercaRaccomandate")
    public RaccomandataProtocolloDTO cercaRaccomandate(@Name("ricercaRaccomandate") RicercaRaccomandataDTO input) {
        return raccomandataService.getRaccomandate(input);
    }

    @Mutation(value="insertRaccomandata")
    public RaccomandataProtocollo insertRaccomandata(@Name("input") RaccomandataProtocolloInput input) {
        return raccomandataService.insertNewRaccomandata(input);
    }

    @Mutation(value="annullaRaccomandata")
    public boolean annullaRaccomandata(@Name("id") Long idRaccomandata, @Name("motivazione") String motivazione) {
        return raccomandataService.annullaRaccomandata(idRaccomandata, motivazione);
    }

    @Mutation(value="inviaRaccomandateInCoda")
    public void inviaRaccomandateInCoda() {
        raccomandataService.inviaRaccomandateInCoda();
    }

    @Mutation(value="updateStatoRaccomandateForProtocollo")
    public boolean updateStatoRaccomandateForProtocollo(@Name("id")Long idProtocollo) {
        return raccomandataService.updateStatoRaccomandateForProtocollo(idProtocollo);
    }

    @Mutation(value="saveLoginRaccomandata")
    public boolean saveLoginRaccomandata(@Name("loginInput") LoginRaccomandataDTO loginInput) throws Exception {
        return configurazioneService.saveLoginRaccomandata(loginInput);
    }

    @Mutation(value="updateLoginRaccomandata")
    public boolean updateLoginRaccomandata(@Name("loginInput") LoginRaccomandataDTO loginInput){
        return configurazioneService.updateLoginRaccomandata(loginInput);
    }

    @Query(value="getLoginRaccomandata")
    public LoginRaccomandataDTO getLoginRaccomandata() throws Exception {
        return configurazioneService.getLoginRaccomandataDecrypted();
    }

    @Query(value="getMittenteFileds")
    public RaccomandataMittenteFields getMittenteFileds() throws Exception {
        return raccomandataService.getMittenteFileds();
    }
}
