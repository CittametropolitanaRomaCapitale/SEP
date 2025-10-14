package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.ConfigurazioniPEOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaConfigPEDTO;
import it.parsec326.pi.intranet.dto.input.PecPeoDTOInput;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.mapper.PecPeoMapper;
import it.parsec326.pi.intranet.model.PeConfigurazione;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.model.Ufficio;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.MockUtils;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.TipologiaPosta;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import jakarta.ws.rs.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;

import java.util.*;

import static jakarta.transaction.Transactional.TxType.REQUIRES_NEW;

@ApplicationScoped
@Slf4j
public class PecPeoService implements PanacheCustomEntityServiceInterface<PecPeo> {

    @Inject
    EntityManager em;

    @Inject
    PecPeoMapper mapper;

    @Inject
    UfficioService ufficioService;

    @Inject
    SSOClient ssoManager;

    @Override
    public PecPeo findById(Long id) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (id == null)
            throw new IllegalArgumentException("Il parametro id è obbligatorio in " + LogUtils.getCallerInfo());

        PecPeo pecPeo = PecPeo.findById(id);
        if (pecPeo == null) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new NotFoundException("Configurazione pec/peo non trovata per id:{} " + id);
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return pecPeo;
    }

    public List<PecPeo> getAllPecConfigurations(){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        List<PecPeo> pecPeoList = PecPeo.find("where configurazione.tipologiaPosta = :tipologia ",Map.of("tipologia",TipologiaPosta.PEC)).list();
        if(pecPeoList.isEmpty()){
            log.debug("Nessuna configurazione Pec presente");
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return pecPeoList;
    }

    public List<PecPeo> getAllActivePecConfigurations(){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        List<PecPeo> pecPeoList = PecPeo.find("where configurazione.tipologiaPosta = :tipologia and attiva is true and readPec is true",Map.of("tipologia",TipologiaPosta.PEC)).list();
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return pecPeoList;
    }



    public List<PecPeo> getAllPecPeo(String idUtente, String cdr){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        List<PecPeo> result = em.createNamedQuery("findAllPecPeo", PecPeo.class)
                                        .setParameter("idUtente", idUtente)
                                        .setParameter("cdrCode", cdr)
                                        .getResultList();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return result;
    }

    public List<PecPeo> getPecPeoByIdUtente(String idUtente, TipologiaPosta tipologiaPosta) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        List<PecPeo> result = null;
        if (tipologiaPosta == null) {
            result = em.createNamedQuery("findAllPecPeoByIdUtente", PecPeo.class)
                    .setParameter("idUtente", idUtente)
                    .getResultList();
        }
        else {
            result = PecPeo.find("WHERE utente.id = :idUtente AND configurazione.tipologiaPosta = :tipologia ", Map.of("idUtente", idUtente, "tipologia", tipologiaPosta)).list();
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return result;

    }

    public List<PecPeo> getPecPeoByCdr(String cdr) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        List<PecPeo> result = em.createNamedQuery("findAllPecPeoByCdr", PecPeo.class)
                .setParameter("cdrCode", cdr)
                .getResultList();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return result;
    }

    public PecPeo getPecPeoByEmail(String email) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Optional<PecPeo> result = PecPeo.find("lower(indirizzoEmail)", email.toLowerCase()).firstResultOptional();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return result.orElse(null);
    }

    public List<PecPeo> getPecPeoFromEmails(List<String> email) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Map<String, Object> params = new HashMap<>();
        String query = "indirizzoEmail IN :mailList";
        params.put("mailList", email);
        List<PecPeo> result = PecPeo.find(query, params).list();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return result;
    }

    /**
     * Restituisce la configurazione di posta per la tipologia di posta passata in input.
     * La ricerca della tipologia di posta avviene per environment.
     * @param tipologiaPosta
     * @return
     */
    // TODO: bisogna trovare un modo per differenziare le configurazioni in base al provider.
    public PeConfigurazione getPeConfigurazione(TipologiaPosta tipologiaPosta) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (tipologiaPosta == null)
            throw new IllegalArgumentException("Parametro tipologiaPosta obbligatorio in " + LogUtils.getCallerInfo());

        PeConfigurazione configurazione = em.createNamedQuery("getConfByTipologiaPostaAndEnv", PeConfigurazione.class)
                .setParameter("tipologiaPosta", TipologiaPosta.valueOf(tipologiaPosta.getTipologiaPosta().toUpperCase()))
                .setParameter("env", Utils.getEnv())
                .getSingleResult();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return configurazione;
    }

    /**
     * Servizio che restituisce una lista di configurazioni PEC/PEO paginata
     * accetta la ricerca globale, sort, paginazione e filtri ritorna
     * @param dto - conterrà tutti i parametri in input che vengono dai filtri
     * @return
     */
    public ConfigurazioniPEOutputDTO getConfigurations(RicercaConfigPEDTO dto) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

        PanacheQuery<PecPeo> query = getConfigurazioniPecPeoQuery(dto);
        List<PecPeo> pecPeoList = query.page(Page.of(dto.getPage(), dto.getSize())).list();

        pecPeoList.stream().filter(p -> p.getPassword() != null).forEach(pecPeo -> {
            try {
                pecPeo.setPassword(pecPeo.getPasswordDecrypted());
            } catch (Exception e) {
                log.error("Exception : {}", e.getMessage());
                CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            }
        });

        long totalResults = query.count();
        ConfigurazioniPEOutputDTO outputDTO = new ConfigurazioniPEOutputDTO(pecPeoList, getPagesCount(totalResults, dto.getSize()), totalResults);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return outputDTO;
    }

    /**
     * Servizio che costruisce la query di ricerca per le configurazioni PEC / PEO e ritorna la lista
     * accetta i parametri passati dai filtri, ritornando una lista configurazioni PEC / PEO
     * Se tutti i parametri di ricerca sono null ritorna tutte le configurazioni per quell'ufficio
     * Se parametri di ricerca sono tutti null, tranne l'ufficio, ritornerà la lista di config per l'ufficio selezionato
     * @param ricercaConfigPEDTO - conterrà tutti i parametri in input che vengono dai filtri, incluse (ricerca globale, sort, paginazione)
     * @return
     */
    private PanacheQuery<PecPeo> getConfigurazioniPecPeoQuery(RicercaConfigPEDTO ricercaConfigPEDTO){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Sort sortCriteria = SortInput.getSortOrDefault(ricercaConfigPEDTO.hasSort() ? ricercaConfigPEDTO.getSort() : ricercaConfigPEDTO.getDefaultSort());

        if (ricercaConfigPEDTO.isEmpty()){
            return PecPeo.findAll(sortCriteria);
        }

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("SELECT p FROM PecPeo p ");

        if (ricercaConfigPEDTO.hasCdr()) {
            query.append("JOIN p.uffici u ");
            query.append("WHERE u.cdrCode IN :cdrCodeList ");
            params.put("cdrCodeList", ricercaConfigPEDTO.getCdr());
        } else {
            query.append("WHERE 1=1 ");
        }

        if(ricercaConfigPEDTO.hasSearch()){
            query.append("and (:search = '' ")
                    .append("or lower(indirizzoEmail) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(username) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(utente) like LOWER(concat('%', :search, '%')) )");
            params.put("search", ricercaConfigPEDTO.getSearch().trim());
        }

        if (ricercaConfigPEDTO.hasIndirizzo()) {
            query.append("and lower(indirizzoEmail) like LOWER(concat('%', :indirizzo, '%')) ");
            params.put("indirizzo", ricercaConfigPEDTO.getIndirizzo());
        }

        if (ricercaConfigPEDTO.hasTipologiaPosta()) {
            List<String> tipologiePostaString = ricercaConfigPEDTO.getTipologiaPosta();
            List<TipologiaPosta> tipologiePostaEnum = tipologiePostaString.stream()
                    .map(TipologiaPosta::valueOf).toList();

            query.append("and configurazione.tipologiaPosta IN :tipologia_posta ");
            params.put("tipologia_posta", tipologiePostaEnum);
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return PecPeo.find(query.toString(),sortCriteria, params);
    }

    @Transactional
    public boolean savePecPeoConfiguration(PecPeoDTOInput input) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if (input == null) throw new IllegalArgumentException("Input non può essere nullo");

        boolean result = true;
        try {
            result = saveConfiguration(input);
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return result;
        } catch (Exception e) {
            String message = String.format("Errore nel salvataggio della configurazione di tipo: %s, %s", input.tipologiaPosta, e.getMessage());
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
            return false;
        }
    }

    @Transactional
    @ExceptionChecked
    public boolean saveConfiguration(PecPeoDTOInput input) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        boolean isPecPeoUnique;
        PecPeo config = mapper.toEntity(input);
//      TipologiaPosta tipologiaPosta = TipologiaPosta.valueOf(input.tipologiaPosta.toUpperCase());

        if(input.getFormSwitch().equalsIgnoreCase("cdr")){
            if (input.cdrList == null || input.cdrList.isEmpty()) {
                CustomException.get(CustomException.ErrorCode.INTERNAL,
                        "Associare almeno un ufficio quando si seleziona cdr").boom();
            }

            List<Ufficio> ufficiAssociati = new ArrayList<>();
            for (Ufficio ufficio : input.cdrList) {
                isPecPeoUnique = checkPecPeoIsPresent(input.indirizzoEmail);
                if(isPecPeoUnique){
                    String message = String.format("Attenzione, è presente già una configurazione con l'indirizzo: %s", input.indirizzoEmail);
                    CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
                }

                Ufficio ufficioEsistente = ufficioService.findByCdrCode(ufficio.getCdrCode());
                if (ufficioEsistente != null) {
                    ufficiAssociati.add(ufficioEsistente);
                } else {
                    Ufficio nuovoUfficio = em.merge(ufficio);
                    ufficiAssociati.add(nuovoUfficio);
                }
            }
            config.setUffici(ufficiAssociati);
            config.setUsername(null);
            config.setIdUtente(null);
            config.setUtente(null);
            config.setDeleteMessages(input.getDeleteMessages());
            config.setSaveToSent(input.getSaveToSent());
            config.setMustSendRispostaAutomatica(input.getSendRispostaAutomatica());
        }else{
            // Verifica che non ci sia già una configurazione uguale
            isPecPeoUnique = checkPecPeoIsPresent(input.indirizzoEmail);
            if(isPecPeoUnique){
                String message = String.format("Attenzione, è presente già una configurazione con l'indirizzo: %s", input.indirizzoEmail);
                CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
            }
        }
        try {
            save(config);
        }catch (ConstraintViolationException e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Esiste già una configurazione tra quelle inserite").boom();

        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    @Transactional
    public boolean updateConfiguration(Long id, PecPeoDTOInput input) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (id == null) throw new IllegalArgumentException("id è un parametro obbligatorio in " + LogUtils.getCallerInfo());
        if (input == null) throw new IllegalArgumentException("input è un parametro obbligatorio in " + LogUtils.getCallerInfo());
        if(input.formSwitch == null  ) throw new IllegalArgumentException("formSwitch è un parametro obbligatorio in " + LogUtils.getCallerInfo());

        boolean isPecPeoUnique;
        PecPeo pecPeo = PecPeo.findById(id);
        TipologiaPosta tipologiaPosta = TipologiaPosta.valueOf(input.getTipologiaPosta().toUpperCase());

        //Si fa un update a null in base alla selezione dello switch del form
        if(input.getFormSwitch().equals("cdr")){
            List<Ufficio> ufficiAssociati = new ArrayList<>();
            for (Ufficio ufficio : input.getCdrList()) {
                // Verifica che non ci sia già una configurazione uguale
                isPecPeoUnique = checkPecPeoUpdate(id, input.indirizzoEmail);
                if(isPecPeoUnique){
                    String message = String.format("Attenzione, è presente già una configurazione con l'indirizzo: %s", input.indirizzoEmail);
                    CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
                }
                Ufficio ufficioEsistente = ufficioService.findByCdrCode(ufficio.getCdrCode());

                if (ufficioEsistente != null) {
                    ufficiAssociati.add(ufficioEsistente);
                } else {
                    Ufficio nuovoUfficio = em.merge(ufficio);
                    ufficiAssociati.add(nuovoUfficio);
                }
            }

            pecPeo.nullAvoidUpdateWithoutPersist(mapper.toEntity(input));
            pecPeo.setUsername(null);
            pecPeo.setIdUtente(null);
            pecPeo.setUtente(null);
            pecPeo.setUffici(ufficiAssociati);
        }

        if(input.getFormSwitch().equals("utente")) {
            // Verifica che non ci sia già una configurazione uguale
            isPecPeoUnique = checkPecPeoUpdate(id, input.indirizzoEmail);
            if(isPecPeoUnique){
                String message = String.format("Attenzione, è presente già una configurazione con l'indirizzo: %s", input.indirizzoEmail);
                CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
            }
            pecPeo.nullAvoidUpdateWithoutPersist(mapper.toEntity(input));
            pecPeo.setUffici(null);
        }


        if(tipologiaPosta.equals(TipologiaPosta.PEO) && input.password.isEmpty()){
            pecPeo.setPassword(null);
        }

        pecPeo.setDeleteMessages(input.getDeleteMessages());
        pecPeo.setSaveToSent(input.getSaveToSent());
        pecPeo.setReadPec(input.getReadPec());
        pecPeo.setMustSendRispostaAutomatica(input.getSendRispostaAutomatica());

        save(pecPeo);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    public boolean checkPecPeoIsPresent(String indirizzoEmail){
        Optional<PecPeo> result = PecPeo.find("indirizzoEmail", indirizzoEmail).firstResultOptional();
        return result.isPresent();
    }

    public boolean checkPecPeoUpdate(Long idPecPeo, String indirizzoEmail){
        Optional<PecPeo> result = PecPeo.find("indirizzoEmail", indirizzoEmail).firstResultOptional();
        return result.filter(pecPeo -> !pecPeo.getId().equals(idPecPeo)).isPresent();
    }

    public boolean checkSamePecPeo(TipologiaPosta tipologiaPosta, String indirizzoEmail, String idUtente, String cdrCode, String formSwitch, Long configId) {
        if(formSwitch.equals("utente")){
            return checkSameUserPecPeo(tipologiaPosta, indirizzoEmail, idUtente, configId);
        }else{
            return checkSameOfficePecPeo(tipologiaPosta, indirizzoEmail, cdrCode, configId);
        }
    }

    private boolean checkSameUserPecPeo(TipologiaPosta tipologiaPosta, String indirizzoEmail, String idUtente, Long configId) {
        StringBuilder query = new StringBuilder("SELECT COUNT(p) FROM PecPeo p ");

        query.append("WHERE p.configurazione.tipologiaPosta = :tipologiaPosta ")
                .append("AND p.indirizzoEmail = :indirizzoEmail ")
                .append("AND p.idUtente = :idUtente ");

        if(configId != null){
            query.append("AND p.id != :configId ");
        }

        Query namedQuery = em.createQuery(query.toString())
                .setParameter("tipologiaPosta", tipologiaPosta)
                .setParameter("indirizzoEmail", indirizzoEmail)
                .setParameter("idUtente", idUtente);

        if (configId != null) {
            namedQuery.setParameter("configId", configId);
        }

        Long count = (Long) namedQuery.getSingleResult();
        return count == 0;
    }

    private boolean checkSameOfficePecPeo(TipologiaPosta tipologiaPosta, String indirizzoEmail, String cdrCode, Long configId) {
        StringBuilder query = new StringBuilder("SELECT COUNT(p) FROM PecPeo p JOIN p.uffici u ");

        query.append("WHERE p.configurazione.tipologiaPosta = :tipologiaPosta ")
                .append("AND p.indirizzoEmail = :indirizzoEmail ")
                .append("AND u.cdrCode = :cdrCode ");

        if(configId != null){
            query.append("AND p.id != :configId ");
        }

        Query namedQuery = em.createQuery(query.toString())
                .setParameter("tipologiaPosta", tipologiaPosta)
                .setParameter("indirizzoEmail", indirizzoEmail)
                .setParameter("cdrCode", cdrCode);

        if (configId != null) {
            namedQuery.setParameter("configId", configId);
        }

        Long count = (Long) namedQuery.getSingleResult();

        return count == 0;
    }

    @ExceptionChecked
    @Transactional(REQUIRES_NEW)
    public boolean deleteConfiguration(Long id) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (id == null) throw new IllegalArgumentException("id è un parametro obbligatorio in " + LogUtils.getCallerInfo());
        try{
            PecPeo pecPeoConfig = findById(id);
            pecPeoConfig.delete();

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return true;
        }catch (Exception e){
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.INTERNAL,e.getMessage()).boom();
            return false;
        }
    }

    public List<String> getPecPeoQuery(String idUtente, String tipologiaPosta, String selectedCdrCode) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if(selectedCdrCode == null || selectedCdrCode.isEmpty())
            throw new IllegalArgumentException("selectedCdrCode è obbligatorio in " + LogUtils.getCallerInfo());

        if(tipologiaPosta == null || tipologiaPosta.isEmpty())
            throw new IllegalArgumentException("tipologiaPosta è obbligatorio in " + LogUtils.getCallerInfo());

        String idUtenteFromJwt = ssoManager.extractIdFromToken();

        TipologiaPosta tipologia = tipologiaPosta.equalsIgnoreCase("Pec") ? TipologiaPosta.PEC : TipologiaPosta.PEO;

        List<String> result = em.createNamedQuery("findAllPecPeoByTipologiaPostaAndCdrCode", String.class)
                .setParameter("cdrCode", selectedCdrCode)
                .setParameter("tipologiaPosta", tipologia)
                .setParameter("idUtente", idUtenteFromJwt)
                .getResultList();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return result;
    }

    public List<String> getPecPeoByUtenteAndCdr(String idUtente, String selectedCdrCode) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if(selectedCdrCode == null || selectedCdrCode.isEmpty())
            throw new IllegalArgumentException("selectedCdrCode è obbligatorio in " + LogUtils.getCallerInfo());

        String idUtenteFromJwt = ssoManager.extractIdFromToken();

        List<String> result = em.createNamedQuery("findAllPecPeoByUtenteAndCdrCode", String.class)
                .setParameter("cdrCode", selectedCdrCode)
                .setParameter("idUtente", idUtenteFromJwt)
                .getResultList();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return result;
    }

    public List<Long> findAllPecPeoIdByEmail(Long id, String indirizzoEmail) {
        return em.createNamedQuery("findAllPecPeoIdByEmail", Long.class)
                .setParameter("email", indirizzoEmail)
                .setParameter("id", id)
                .getResultList();
    }

    public List<PecPeo> getConfiguredUsers(){
        return MockUtils.buildDestinatariPecPeo();
    }

    @Override
    public PanacheQuery<PecPeo> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<PecPeo> getFindByIdQuery(Long id) {
        return null;
    }

    @Override
    public UserTransaction getTransaction() {
        return null;
    }

}
