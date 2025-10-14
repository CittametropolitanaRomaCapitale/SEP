package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.ConfigurazioniPEOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaConfigPEDTO;
import it.parsec326.pi.intranet.dto.input.PecPeoDTOInput;
import it.parsec326.pi.intranet.mapper.PecPeoMapper;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.service.PecPeoService;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
//@Authenticated
@Slf4j
public class PecPeoResource {

    @Inject
    PecPeoMapper mapper;
    @Inject
    PecPeoService pecPeoService;

    @Query(value = "getPecPeoByTipologiaPosta")
    public List<String> getPecPeoQuery(
            @Name("idUtente") String idUtente,
            @Name("tipologiaPosta") String tipologiaPosta,
            @Name("selectedCdrCode") String selectedCdrCode) {
        return pecPeoService.getPecPeoQuery(idUtente, tipologiaPosta, selectedCdrCode);
    }

    @Query(value = "getPecPeoByUtenteAndCdr")
    public List<String> getPecPeoByUtenteAndCdr(
            @Name("idUtente") String idUtente,
            @Name("selectedCdrCode") String selectedCdrCode) {
        return pecPeoService.getPecPeoByUtenteAndCdr(idUtente, selectedCdrCode);
    }

    @Query(value = "getAllPecConfigurations")
    public List<PecPeo> getAllPecConfigurations(){
        return pecPeoService.getAllPecConfigurations();
    }

    @Query(value = "getConfigurations")
    public ConfigurazioniPEOutputDTO getConfigurations(@Name("ricerca") RicercaConfigPEDTO ricercaConfigurazioniPEDTO) {
        return pecPeoService.getConfigurations(ricercaConfigurazioniPEDTO);
    }

    @Mutation(value = "saveConfiguration")
    public boolean saveConfiguration(@Name("pecPeoDTOInput") PecPeoDTOInput input ){
        return pecPeoService.savePecPeoConfiguration(input);
    }

    @Mutation(value = "updateConfigurations")
    public boolean updateConfigurations(@Name("id") Long id, @Name("input") PecPeoDTOInput input) {
        return pecPeoService.updateConfiguration(id, input);
    }

    @Mutation(value = "deleteConfiguration")
    public boolean deleteConfiguration(@Name("id") Long id ){
        return pecPeoService.deleteConfiguration(id);
    }

    @Query(value = "configById")
    public PecPeo getConfig(@Name("id") Long id ){
        return PecPeo.findById(id);
    }

    @Query(value = "getConfiguredUsers")
    public List<PecPeo> getConfiguredUsers(){
        return pecPeoService.getConfiguredUsers();
    }

    @Query(value = "findAllPecPeoIdByEmail")
    public List<Long> findAllPecPeoIdByEmail(@Name("id") Long id ,@Name("indirizzoEmail") String indirizzoEmail){
        return pecPeoService.findAllPecPeoIdByEmail(id, indirizzoEmail);
    }

    @Query(value = "getAllPecPeoFromEmails")
    public List<PecPeo> getAllPecPeoFromEmails(){
        List<String> emailList = List.of("sviluppo@pec.parsec326.it", "info@a.it");
        return pecPeoService.getPecPeoFromEmails(emailList);
    }
    @Query(value = "getAllPecPeoByCdrCode")
    public List<PecPeo> listCdrPeo(){
        return pecPeoService.getPecPeoByCdr("7510");
    }
}

