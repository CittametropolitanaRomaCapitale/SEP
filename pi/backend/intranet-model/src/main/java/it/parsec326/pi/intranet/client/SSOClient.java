package it.parsec326.pi.intranet.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import io.quarkus.cache.CacheInvalidate;
import io.quarkus.cache.CacheResult;
import io.vertx.core.json.JsonArray;
import it.parsec326.pi.intranet.dto.client.sso.*;
import it.parsec326.pi.intranet.exception.CustomException;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.*;

@Slf4j
@ApplicationScoped
public class SSOClient {

    @ConfigProperty(name = "sso.url")
    String ssoUrl;

    @Inject
    JsonWebToken jwt;

    Client client;

    @PostConstruct
    public void init(){
        client = ClientBuilder.newClient();
    }

    public boolean hasJwtToken() {
        return jwt != null && jwt.getRawToken() != null && !jwt.getRawToken().isEmpty();
    }

    public List<DatiUtenteSSO> getDirigentiByCdr(String applicationId, String cdrCode){
        log.info("Richiesta dirigenti per cdr {}", cdrCode);
        try {
            return client.target(ssoUrl)
                    .path("/api/office/"+applicationId+"/users/"+cdrCode)
                    .request(MediaType.APPLICATION_JSON)
                    .get()
                    .readEntity(new GenericType<List<DatiUtenteSSO>>() {});
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    public DatiUtenteDTO getUserInfo(String token){
        try {
            return client.target(ssoUrl)
                    .path("/api/auth/me")
                    .request(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .get()
                    .readEntity(DatiUtenteDTO.class);

        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    public List<String> extractOfficesByRoles(DatiUtenteSSO currentUser) {
        return currentUser.userOffices.stream()
                .filter(userOffice -> userOffice.roles.stream()
                        .anyMatch(role -> role.name.equals("archivista") || role.name.equals("protocollatore")))
                .map(userOffice -> userOffice.office.code)
                .toList();
    }

    public List<String> extractOfficesByRoles(DatiUtenteSlimSSO currentUser, List<String> rolesToFilter) {
        List<String> cdrCodes = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : currentUser.cdrCodes.entrySet()) {
            for(String roleToCheck : rolesToFilter) {
                if (entry.getValue().contains(roleToCheck)) {
                    cdrCodes.add(entry.getKey());
                    break;
                }
            }
        }
        return cdrCodes;
    }

    /**
     * Questa funzione verifica che l'utenteSSO abbia il permesso per quell'ufficio selezionato.
     * Se selectedOffice viene passato come ALL o arriva null, verrà saltato il controllo sull'ufficio.
     * @param currentUser - utente SSO
     * @param rolesToFilter - I ruoli che si vogliono confrontare con quelli dell'utente
     * @param selectedCdrCode - Ufficio selezionato dall'utente
     * @return
     */
    public boolean hasMatchingRoleAndCdr(DatiUtenteSSO currentUser, List<String> rolesToFilter, String selectedCdrCode) {
        return currentUser.userOffices.stream()
                .filter(userOffice -> userOffice.office != null && userOffice.office.code != null)
                .anyMatch(userOffice ->
                        (selectedCdrCode == null || "ALL".equalsIgnoreCase(selectedCdrCode) || userOffice.office.code.equals(selectedCdrCode)) &&
                                userOffice.roles.stream()
                                        .anyMatch(role -> rolesToFilter.contains(role.name))
                );
    }

    public DatiUtenteSSO getDatiUtente(){
        return getUserInfo(jwt.getRawToken()).user_data;
    }

    public String extractNameFromToken() {
        return jwt.getClaim("name");
    }

    public String extractIdFromToken() {
        return jwt.getClaim("sub");
    }

    public String extractUserEmailFormToken() {
        return jwt.getClaim("email").toString();
    }

    // i valori che può assumere il claim
    /*
        CAPO DI GABINETTO
        DIRIGENTE AREA  AMMINISTRATIVA
        DIRIGENTE AREA ECONOM.FINANZIARIA
        DIRIGENTE AREA TECNICA
        SEGRETARIO GENERALE
     */
    public boolean isUtenteDirigente() {
        if (jwt.getClaim("qualifica") == null)
            return false;
        String qualifica = jwt.getClaim("qualifica").toString().toLowerCase();
        return qualifica.contains("dirigente") || qualifica.equals("capo di gabinetto") || qualifica.equals("segretario generale");
    }
    public boolean isUtenteAdmin(){
        return extractRolesFromToken().stream().anyMatch(role -> role.equalsIgnoreCase("pi_admin"));
    }

    public List<String> extractRolesFromToken() {
        JsonArray array = new JsonArray(jwt.getClaim("roles").toString());
        List<String> listData = new ArrayList<>();
        if (!array.isEmpty()) {
            for (int i = 0; i < array.size(); i++) {
                listData.add(array.getString(i));
            }
        }
        return listData;
    }

    @CacheResult(cacheName = "getAllOffices_from_sso")
    public List<Office> getOffices(String search) {
        log.info("Richiesta uffici con filtro {}", search);
        try {
            Response resp = client.target(ssoUrl)
                    .path("/api/office")
                    .queryParam("search", search)
                    .queryParam("size", "1000")
                    .queryParam("by", "short_description")
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            Map<String, Object> map = resp.readEntity(new GenericType<Map<String, Object>>() {});
            ObjectMapper mapper = new ObjectMapper();
            return mapper.convertValue(map.get("data"), new TypeReference<List<Office>>() {});
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    public Set<String> getRelatedCdrCodes(String cdrCode) {
        Set<String> setCdrCode = new HashSet<>();
        if (cdrCode == null || cdrCode.isEmpty()) {
            return setCdrCode;
        }
        List<Office> officeList = getRelatedOffices(cdrCode);
        setCdrCode.add(cdrCode);
        if(officeList == null || officeList.isEmpty()){
            return setCdrCode;
        }
        officeList.stream().map(o -> o.code).forEach(setCdrCode::add);
        return setCdrCode;
    }

    public Set<String> getRelatedCdrCodes(List<String> cdrCodes) {
        Set<String> result = new HashSet<>();
        if (cdrCodes == null) {
            return result;
        }
        for(String cdrCode : cdrCodes) {
            List<Office> officeList = getRelatedOffices(cdrCode);
            Set<String> setCdrCode = new HashSet<>();
            setCdrCode.add(cdrCode);
            if(officeList == null || officeList.isEmpty()){
                continue;
            }
            officeList.stream().map(o -> o.code).forEach(setCdrCode::add);
            result.addAll(setCdrCode);
        }
        return result;
    }
    @CacheResult(cacheName = "getRelatedOffices_from_sso")
    public List<Office> getRelatedOffices(String cdrCode) {
        log.info("Richiesta uffici per il cdrCode: {}", cdrCode);
        if (cdrCode == null) {
            return null;
        }
        try {
            Response resp = client.target(ssoUrl)
                    .path("/api/office/"+cdrCode+"/related_offices")
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            return resp.readEntity(new GenericType<List<Office>>() {});
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }
    @CacheInvalidate(cacheName = "getRelatedOffices_from_sso")
    public List<Office> forceGetRelatedOffices(String cdrCode) { return getRelatedOffices(cdrCode); }



    @CacheInvalidate(cacheName = "getAllOffices_from_sso")
    public List<Office> forceGetOffices(String search) {
        return getOffices(search);
    }

    @CacheResult(cacheName = "getAllUtenti_from_sso")
    public List<DatiUtenteSlimSSO> getAllUtenti(String applicationId) {
        log.info("Richiesta di tutti gli utenti");
        try {
            Response resp = client.target(ssoUrl)
                    .path("/api/application/"+applicationId+"/search_users")
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            Object map = resp.readEntity(new GenericType<Object>() {});
            ObjectMapper mapper = new ObjectMapper();
            return mapper.convertValue(map, new TypeReference<List<DatiUtenteSlimSSO>>() {});
            /*
            Response resp = client.target(ssoUrl)
                    .path("/api/user")
                    .queryParam("page", 0)
                    .queryParam("size", 10000)
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            Object map = resp.readEntity(new GenericType<Object>() {});
            ObjectMapper mapper = new ObjectMapper();
            return mapper.convertValue(map, new TypeReference<List<DatiUtenteSSO>>() {});
            */
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    public List<DatiUtenteSlimSSO> getUsersByCdrCode(String applicationId, String cdrCode) {
        log.info("Richiesta di tutti gli utenti per l'ufficio con code: {}", cdrCode);
        try {
            Response resp = client.target(ssoUrl)
                    .path("/api/application/"+applicationId+"/search_users")
                    .queryParam("code", cdrCode)
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            Object map = resp.readEntity(new GenericType<Object>() {});
            ObjectMapper mapper = new ObjectMapper();
            return mapper.convertValue(map, new TypeReference<List<DatiUtenteSlimSSO>>() {});
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return Collections.emptyList();
        }
    }

    @CacheInvalidate(cacheName = "getAllUtenti_from_sso")
    public List<DatiUtenteSlimSSO> forceGetAllUtenti(String applicationId) {
        return getAllUtenti(applicationId);
    }

    @CacheResult(cacheName = "getUtentiPerUfficio_from_sso")
    public List<DatiUtenteSlimSSO> getUtentiPerUfficio(String applicationId, String code, String search) {
        List<DatiUtenteSlimSSO> allUtenti = getAllUtenti(applicationId);

        List<DatiUtenteSlimSSO> filteredUtenti = new ArrayList<>();
        for(DatiUtenteSlimSSO utenteSSO : allUtenti) {
            if (utenteSSO.cdrCodes.containsKey(code)) {
                filteredUtenti.add(utenteSSO);
                break;
            }
        }
        return filteredUtenti;
    }

    public List<DatiUtenteSSO> getAllUsers(String search, int size) {
        try {
            String jsonResponse = client.target(ssoUrl)
                    .path("/api/auth/users")
                    .queryParam("search", search)
                    .queryParam("by", "username")
                    .queryParam("size", size)
                    .request(MediaType.APPLICATION_JSON)
                    .get(String.class);

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> apiResponse = mapper.readValue(jsonResponse, new TypeReference<Map<String, Object>>() {});
            return mapper.convertValue(apiResponse.get("data"), new TypeReference<List<DatiUtenteSSO>>() {});
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    @CacheResult(cacheName = "getAdminsForApplication_from_sso")
    public List<DatiUtenteSSO> getAdminsForApplication(Integer applicationID) {
        try {
            String jsonResponse = client.target(ssoUrl)
                    .path("/api/application/"+applicationID+"/get_admins")
                    .request(MediaType.APPLICATION_JSON)
                    .get(String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonResponse, new TypeReference<List<DatiUtenteSSO>>() {});
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    @CacheResult(cacheName = "getAdminsForApplicationSlim_from_sso")
    public List<DatiUtenteSlimSSO> getAdminsForApplicationSlim(Integer applicationID) {
        try {
            String jsonResponse = client.target(ssoUrl)
                    .path("/api/application/"+applicationID+"/get_admins_slim")
                    .request(MediaType.APPLICATION_JSON)
                    .get(String.class);

            ObjectMapper mapper = new ObjectMapper();
            SimpleModule module = new SimpleModule();
            module.addDeserializer(DatiUtenteSlimSSO.class, new UserDTODeserializer());
            mapper.registerModule(module);
            return mapper.readValue(jsonResponse, new TypeReference<List<DatiUtenteSlimSSO>>() {});
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    @CacheInvalidate(cacheName = "getAdminsForApplication_from_sso")
    public List<DatiUtenteSSO> forceGetAdminsForApplication(Integer applicationId) {
        return getAdminsForApplication(applicationId);
    }

    public DatiUtenteSSO getUserByAuthId(String authId, Integer applicationId){
        if (authId == null || authId.isEmpty() || authId.equalsIgnoreCase("0"))
            return null;
        return userByAuthId(authId, applicationId).user_data;
    }

    public DatiUtenteDTO userByAuthId(String authId, Integer applicationId){
        log.info("Richiesta utente per authId: {}", authId);

        try {
            return client.target(ssoUrl)
                    .path("/api/auth/user/" + authId + "/application/"+ applicationId)
                    .request(MediaType.APPLICATION_JSON)
                    .get()
                    .readEntity(DatiUtenteDTO.class);

        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    public List<DatiUtenteFullSSO> fullUsersWithAttributes() {
        log.info("Richiesta dati con attributi per utenti");

        try {
            String jsonResponse = client.target(ssoUrl)
                    .path("/api/auth/getFullUsersInfos")
                    .request(MediaType.APPLICATION_JSON)
                    .get(String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonResponse, new TypeReference<List<DatiUtenteFullSSO>>() {});
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }

    public String syncUsersWithAttributes(String applicationId) {
        log.info("Richiesta per sync utenti da Keycloak ad SSO");

        try {
                String resp = client.target(ssoUrl)
                    .path("/api/application/"+applicationId+"/sync_users_with_permissions")
                    .request(MediaType.APPLICATION_JSON)
                    .post(null, String.class);
                log.info("Risposta per sync utenti da Keycloak ad SSO: {}", resp);
                return resp;
        }catch (Exception e){
            log.error("Risposta per sync utenti da Keycloak ad SSO: {}", e.getMessage());
            return null;
        }
    }
}