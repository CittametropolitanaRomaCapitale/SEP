package it.parsec326.pi.intranet.service;

import it.parsec326.pi.intranet.dto.LoginConservazioneDTO;
import it.parsec326.pi.intranet.dto.client.raccomandata.LoginRaccomandataDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.utils.CryptoUtil;
import it.parsec326.pi.intranet.utils.common.AmbienteConservazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.util.List;

@ApplicationScoped
@Slf4j
public class ConfigurazioneService {

    @Inject
    private EntityManager em;

    @Transactional
    public boolean saveConfigurazione(Configurazione configurazione) {
        try {
            configurazione.persist();
        } catch (Exception e) {
            log.error("Errore durante il salvataggio della configurazione: {}", configurazione.getNome(), e);
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante il salvataggio della configurazione: " + configurazione.getNome()).boom();
        }
        return true;
    }

    @Transactional
    public boolean saveLoginRaccomandata(LoginRaccomandataDTO login) throws Exception {
        validateLoginInput(login);
        saveConfigurazione(new Configurazione("usernameRaccomandata", "username", login.getUsername(), "raccomandataWeb"));
        saveConfigurazione(new Configurazione("passwordRaccomandata", "password", CryptoUtil.encrypt(login.getPassword()), "raccomandataWeb"));
        saveConfigurazione(new Configurazione("gruppoRaccomandata", "gruppo", login.getGruppo(), "raccomandataWeb"));
        return true;
    }

    @Transactional
    public boolean updateLoginRaccomandata(LoginRaccomandataDTO login) {
        validateLoginInput(login);
        List<Configurazione> configurazioni = getAllConfigurazioniByCategoria("raccomandataWeb");

        for(Configurazione configurazione : configurazioni)
        {
            String tipo = configurazione.getTipo();
            String newValue = getLoginRaccomandataFieldValue(login, tipo);

            if (newValue != null && !newValue.equals(configurazione.getValore())) {
                try {
                    configurazione.setValore(tipo.equals("password") ? CryptoUtil.encrypt(newValue) : newValue);
                } catch (Exception e) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante la modifica della password").boom();
                }
                configurazione.setTsUpdate(new Timestamp(System.currentTimeMillis()));
                configurazione.persist();
            }
        }

        return true;
    }

    @Transactional
    public boolean updateLoginConservazione(LoginConservazioneDTO login) {
        validateLoginConservazioneInput(login);
        List<Configurazione> configurazioni = getAllConfigurazioniByCategoria("conservazione");

        for(Configurazione configurazione : configurazioni)
        {
            String tipo = configurazione.getTipo();

            String newValue = getLoginConservazioneFieldValue(login, tipo);

            if (newValue != null && !newValue.equals(configurazione.getValore())) {
                try {
                    configurazione.setValore(tipo.equals("password") ? CryptoUtil.encrypt(newValue) : newValue);
                } catch (Exception e) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante la modifica della password").boom();
                }
                configurazione.setTsUpdate(new Timestamp(System.currentTimeMillis()));
                configurazione.persist();
            }
        }

        return true;
    }

    public List<Configurazione> getAllConfigurazioniByCategoria(String categoria) {
        return em.createNamedQuery("getConfigurazioniByCategoria", Configurazione.class)
                .setParameter("categoria", categoria)
                .getResultList();
    }
    @Transactional
    public LoginRaccomandataDTO getLoginRaccomandata() {
        LoginRaccomandataDTO login = new LoginRaccomandataDTO();
        List<Configurazione> configurazioneList = getAllConfigurazioniByCategoria("raccomandataWeb");
        configurazioneList.forEach(configurazione -> {
            String tipo = configurazione.getTipo();
            switch (tipo) {
                case "username":
                    login.setUsername(configurazione.getValore());
                    break;
                case "password":
                    login.setPassword(configurazione.getValore());
                    break;
                case "gruppo":
                    login.setGruppo(configurazione.getValore());
                    break;
                default:
                    log.warn("Configurazione non riconosciuta: " + tipo);
            }
        });
        return login;
    }

    @Transactional
    public LoginConservazioneDTO getLoginConservazione() {
        LoginConservazioneDTO login = new LoginConservazioneDTO();
        List<Configurazione> configurazioneList = getAllConfigurazioniByCategoria("conservazione");
        configurazioneList.forEach(configurazione -> {
            String tipo = configurazione.getTipo();
            switch (tipo) {
                case "username":
                    login.setUsername(configurazione.getValore());
                    break;
                case "password":
                    login.setPassword(configurazione.getValore());
                    break;
                case "ambiente":
                    login.setAmbiente(AmbienteConservazione.valueOf(configurazione.getValore()));
                    break;
                case "ente":
                    login.setEnte(configurazione.getValore());
                    break;
                case "struttura":
                    login.setStruttura(configurazione.getValore());
                    break;
                case "url":
                    login.setUrl(configurazione.getValore());
                    break;
                case "versione":
                    login.setVersione(configurazione.getValore());
                    break;
                default:
                    log.warn("Configurazione non riconosciuta: " + tipo);
            }
        });
        return login;
    }

    public LoginRaccomandataDTO getLoginRaccomandataDecrypted() throws Exception {
        LoginRaccomandataDTO login = getLoginRaccomandata();
        if (!isNullOrEmpty(login.getPassword())) {
            login.setPassword(CryptoUtil.decrypt(login.getPassword()));
        }
        return login;
    }

    public LoginConservazioneDTO getLoginConservazioneDecrypted() throws Exception {
        LoginConservazioneDTO login = getLoginConservazione();
        if (!isNullOrEmpty(login.getPassword())) {
            login.setPassword(CryptoUtil.decrypt(login.getPassword()));
        }
        return login;
    }

    public String getLoginRaccomandataFieldValue(LoginRaccomandataDTO login, String tipo) {
        switch (tipo) {
            case "username":
                return login.getUsername();
            case "password":
                return login.getPassword();
            case "gruppo":
                return login.getGruppo();
            default:
                log.warn("Configurazione non riconosciuta: " + tipo);
                return null;
        }
    }

    public String getLoginConservazioneFieldValue(LoginConservazioneDTO login, String tipo) {
        switch (tipo) {
            case "url":
                return login.getUrl();
            case "username":
                return login.getUsername();
            case "password":
                return login.getPassword();
            case "ambiente":
                return login.getAmbiente().getAmbiente();
            case "ente":
                return login.getEnte();
            case "struttura":
                return login.getStruttura();
            default:
                log.warn("Configurazione non riconosciuta: " + tipo);
                return null;
        }
    }

    @Transactional
    public boolean saveLoginConservazione(LoginConservazioneDTO login) throws Exception {
        validateLoginConservazioneInput(login);
        saveConfigurazione(new Configurazione("usernameConservazione", "username", login.getUsername(), "conservazione"));
        saveConfigurazione(new Configurazione("passwordConservazione", "password", CryptoUtil.encrypt(login.getPassword()), "conservazione"));
        saveConfigurazione(new Configurazione("ambienteConservazione", "ambiente", login.getAmbiente().getAmbiente(), "conservazione"));
        saveConfigurazione(new Configurazione("enteConservazione", "ente", login.getEnte(), "conservazione"));
        saveConfigurazione(new Configurazione("strutturaConservazione", "struttura", login.getStruttura(), "conservazione"));
        saveConfigurazione(new Configurazione("urlConservazione", "url", login.getUrl(), "conservazione"));

        return true;
    }

    public void validateLoginInput(LoginRaccomandataDTO login) {
        if (isNullOrEmpty(login.getUsername())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: username mancante").boom();
        }
        if (isNullOrEmpty(login.getPassword())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: password mancante").boom();
        }
        if (isNullOrEmpty(login.getGruppo())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: gruppo mancante").boom();
        }
    }

    public void validateLoginConservazioneInput(LoginConservazioneDTO login) {
        if (isNullOrEmpty(login.getUrl())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: url mancante").boom();
        }
        if (isNullOrEmpty(login.getUsername())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: username mancante").boom();
        }
        if (isNullOrEmpty(login.getPassword())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: password mancante").boom();
        }
        if (isNullOrEmpty(login.getAmbiente().getAmbiente())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: ambiente mancante").boom();
        }
        if (isNullOrEmpty(login.getEnte())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: ente mancante").boom();
        }
        if (isNullOrEmpty(login.getStruttura())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore: struttura mancante").boom();
        }
    }

    public String getConfigurazioneValueByName(List<Configurazione> configurazioni, String nome) {
        for(Configurazione conf : configurazioni) {
            if (conf.getNome().equalsIgnoreCase(nome)) {
                return conf.getValore();
            }
        }
        return null;
    }
    public String getBasePublicUrl(List<Configurazione> configurazioni) { return getConfigurazioneValueByName(configurazioni, "basePublicUrl"); }
    public String getApplicationId(List<Configurazione> configurazioni) { return getConfigurazioneValueByName(configurazioni, "applicationId"); }

    public String getBccRichiestaAssegnazione(List<Configurazione> configurazioni) { return getConfigurazioneValueByName(configurazioni, "bccRichiestaAssegnazione"); }

    public boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public String getCodiceIpa(List<Configurazione> configurazioni) { return getConfigurazioneValueByName(configurazioni, "codiceIPA"); }
    public String getCodiceAoo(List<Configurazione> configurazioni) { return getConfigurazioneValueByName(configurazioni, "codiceAOO"); }
    public String getDenominazioneAmministrazione(List<Configurazione> configurazioni) { return getConfigurazioneValueByName(configurazioni, "denominazioneAmministrazione"); }
    public String getCfAmministrazione(List<Configurazione> configurazioni) { return getConfigurazioneValueByName(configurazioni, "cfAmministrazione"); }

    public int getMaxLivelloFascicolazioneTitolario(List<Configurazione> configurazioni) {
        String value = getConfigurazioneValueByName(configurazioni, "maxLivelloFascicolazione");
        if (isNullOrEmpty(value)) return 3;
        try {
            return Integer.parseInt(value);
        }
        catch (NumberFormatException ex) {
            return 3;
        }
    }

    public boolean saveMaxLivelloFascicolazione(String s) {
        Configurazione configurazione = Configurazione.find("nome = ?1 AND categoria = ?2", "maxLivelloFascicolazione", "titolario").firstResult();

        if(configurazione != null){
            try{
                configurazione.setValore(s);
                configurazione.persistAndFlush();
                return true;
            }
            catch(Exception error){
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nel salvataggio del livello massimo di fascicolazione ").boom();
            }
        }

        return saveConfigurazione(new Configurazione("maxLivelloFascicolazione", "integer", s, "titolario"));
    }
}
