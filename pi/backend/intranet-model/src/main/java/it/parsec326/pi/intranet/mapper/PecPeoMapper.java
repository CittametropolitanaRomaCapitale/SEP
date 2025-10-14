package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.PecPeoDTOInput;
import it.parsec326.pi.intranet.model.PeConfigurazione;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.service.PecPeoService;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.common.TipologiaPosta;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;

@ApplicationScoped
@Slf4j
public class PecPeoMapper {

    @Inject
    PecPeoService pecPeoService;

    public PecPeo toEntity(PecPeoDTOInput input) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try {
            PecPeo config = new PecPeo();

            config.setIdUtente(input.idUtente);
            config.setIndirizzoEmail(input.indirizzoEmail);
            config.setUtente(input.utente);
            config.setUsername(input.username);
            if(input.password.isEmpty()){
                config.setPassword(null);
            }else{
                config.setPasswordCrypted(input.password);
            }
            config.setAttiva(input.attiva);
            config.setDeleteMessages(input.deleteMessages);
            config.setSaveToSent(input.saveToSent);
            config.setReadPec(input.readPec);
            config.setMustSendRispostaAutomatica(input.sendRispostaAutomatica);
            config.setUffici(input.getCdrList() != null ? input.getCdrList() : new ArrayList<>());

            try {
                PeConfigurazione configurazione;
                if(config.getPassword() == null || config.getPassword().isEmpty()){
                    configurazione = PeConfigurazione.find("imapHost", "outlook.office365.com").firstResult();
                }else {
                    configurazione = pecPeoService.getPeConfigurazione(TipologiaPosta.valueOf(input.tipologiaPosta.toUpperCase()));
                }
                config.setConfigurazione(configurazione);
            } catch (Exception e) {
                String error = "Environment di connessione non recuperato:" + e.getMessage();
                log.error(error);
                throw new IllegalArgumentException(error);
            }

            return config;

        } catch (Exception e) {
            LogUtils.entering(LogUtils.LogLevel.ERROR);
            log.error("Errore nel mapping PecPeo: " + e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
