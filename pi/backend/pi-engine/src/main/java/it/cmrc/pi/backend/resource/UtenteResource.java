package it.cmrc.pi.backend.resource;

import it.cmrc.pi.backend.service.UtenteService;
import it.parsec326.pi.intranet.dto.ReferentiOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaReferentiDTO;
import it.parsec326.pi.intranet.dto.UfficiOutputDTO;
import it.parsec326.pi.intranet.dto.UtentiOutputDTO;
import it.parsec326.pi.intranet.service.ProtocolloService;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
//@Authenticated
@Slf4j
public class UtenteResource {

    @Inject
    UtenteService utenteService;

    @Inject
    ProtocolloService protocolloService;

    @Query(value = "getAllUsers")
    public UtentiOutputDTO getAllUsers() {
        return utenteService.getAllUsers();
    }

    @Query(value = "getAllOffices")
    public UfficiOutputDTO getAllOffices() {
        return utenteService.getAllOffices();
    }

    @Query(value = "forceGetAllUsers")
    public UtentiOutputDTO forceGetAllUsers() {
        return utenteService.forceGetAllUsers();
    }

    @Query(value = "forceGetAllOffices")
    public UfficiOutputDTO forceGetAllOffices() {
        return utenteService.forceGetAllOffices();
    }

    @Query(value = "findReferenti")
    public ReferentiOutputDTO findReferenti(@Name("ricerca_referenti")RicercaReferentiDTO dto) {
        return dto.isNoCache() ? protocolloService.forceFindReferenti(dto) : protocolloService.findReferenti(dto);
    }

    @Query(value = "forceGetAllUsersWithRoleAndCdr")
    public UtentiOutputDTO forceGetAllUsersWithRoleAndCdr(
            @Name("roles")List<String> roles,
            @Name("cdr")String cdr,
            @Name("search") String search,
            @Name("size")int size) {
        return utenteService.forceGetAllUsersWithRoleAndCdr(roles, cdr, search, size);
    }

    @Query(value = "refreshGetAllUsersAndAdminsFromSSO")
    public boolean refreshGetAllUsersAndAdminsFromSSO() {
        return utenteService.refreshGetAllUsersAndAdminsFromSSO();
    }
}
