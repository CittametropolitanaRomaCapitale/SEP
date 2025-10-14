package it.cmrc.pi.backend.service;

import io.quarkus.cache.CacheInvalidate;
import io.quarkus.cache.CacheResult;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.UfficiOutputDTO;
import it.parsec326.pi.intranet.dto.UtenteDTO;
import it.parsec326.pi.intranet.dto.UtentiOutputDTO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSlimSSO;
import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
@Slf4j
public class UtenteService {

    @Inject
    SSOClient ssoManager;

    @Inject
    ConfigurazioneService configurazioneService;

    @CacheResult(cacheName = "utenteService_getAllUsers")
    public UtentiOutputDTO getAllUsers() {
        List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
        String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);

        List<DatiUtenteSlimSSO> utenti = ssoManager.getAllUtenti(applicationId);

        UtentiOutputDTO output = new UtentiOutputDTO();
        output.setPageCount(1L);

        List<UtenteDTO> utentiDto = new ArrayList<>();
        for(DatiUtenteSlimSSO utenteSso : utenti) {
            UtenteDTO utenteDto = new UtenteDTO();
            utenteDto.id = utenteSso.authId;
            utenteDto.nome = utenteSso.firstName;
            utenteDto.cognome = utenteSso.lastName;
            utentiDto.add(utenteDto);
        }
        output.setUtenti(utentiDto);
        output.setTotalResults(utentiDto.size());
        return output;
    }
    @CacheInvalidate(cacheName = "utenteService_getAllUsers")
    public UtentiOutputDTO forceGetAllUsers() { return getAllUsers(); }

    @CacheResult(cacheName = "utenteService_getAllOffices")
    public UfficiOutputDTO getAllOffices() {
        UfficiOutputDTO output = new UfficiOutputDTO();
        output.setPageCount(1);
        output.setUffici(ssoManager.getOffices(""));
        return output;
    }

    public boolean refreshGetAllUsersAndAdminsFromSSO() {
        List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
        String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);

        ssoManager.forceGetAdminsForApplication(Integer.valueOf(applicationId));
        ssoManager.forceGetAllUtenti(applicationId);
        ssoManager.forceGetOffices("");
        return true;
    }

    @CacheInvalidate(cacheName = "utenteService_getAllOffices")
    public UfficiOutputDTO forceGetAllOffices() { return getAllOffices(); }


    @CacheResult(cacheName = "utenteService_getAllUsersWithRolesAndCdr")
    public UtentiOutputDTO getAllUsersWithRolesAndCdr(List<String> roles, String cdr, String search, int size) {
        List<DatiUtenteSSO> utentiDto = new ArrayList<>();
        UtentiOutputDTO output = new UtentiOutputDTO();

        List<DatiUtenteSSO> utenti = ssoManager.getAllUsers(search, size);
        for(DatiUtenteSSO utenteSso : utenti) {
            boolean canAddUser = ssoManager.hasMatchingRoleAndCdr(utenteSso, roles, cdr);
            if (canAddUser) {
                utentiDto.add(utenteSso);
            }
        }
        output.setPageCount(1L);
        output.setDatiUtenteSSO(utentiDto);
        return output;
    }
    @CacheInvalidate(cacheName = "utenteService_getAllUsersWithRolesAndCdr")
    public UtentiOutputDTO forceGetAllUsersWithRoleAndCdr(List<String> roles, String cdr, String search, int size) {
        return getAllUsersWithRolesAndCdr(roles, cdr, search, size);
    }
}
