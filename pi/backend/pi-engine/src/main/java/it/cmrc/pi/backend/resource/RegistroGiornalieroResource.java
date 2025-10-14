package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.RegistroGiornalieroOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaRegistiGiornalieriDTO;
import it.parsec326.pi.intranet.service.RegistroGiornalieroService;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.Date;

@GraphQLApi
//@Authenticated
@Slf4j
public class RegistroGiornalieroResource {

    @Inject
    RegistroGiornalieroService registroService;

    @Mutation(value = "createRegistroGiornaliero")
    public boolean createRegistroGiornaliero() throws Exception {
        return registroService.createRegistroGiornaliero();
    }

    @Query("getRegistroGiornaliero")
    public RegistroGiornalieroOutputDTO getRegistroGiornaliero(@Name("ricercaRegistroDTO") RicercaRegistiGiornalieriDTO ricercaRegistroDTO) {
        return registroService.getRegistroGiornaliero(ricercaRegistroDTO);
    }

    @Query(value="inviaConservazioneForDay")
    public boolean inviaConservazioneForDay(@Name("date") Date day) {
        return registroService.createRegistroGiornalieroForDay(day);
    }
 }
