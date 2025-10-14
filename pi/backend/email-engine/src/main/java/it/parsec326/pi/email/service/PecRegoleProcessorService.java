package it.parsec326.pi.email.service;

import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.client.SendNotificaClient;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSlimSSO;
import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.model.EmailTemplate;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.model.PecRegola;
import it.parsec326.pi.intranet.service.*;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Slf4j
@ApplicationScoped
public class PecRegoleProcessorService {

    @Inject
    PecRegoleService pecRegoleService;

    @Inject
    PecPeoService pecPeoService;

    @Inject
    NotificaService notificaService;

    @Inject
    EmailTemplateService emailTemplateService;


    @Inject
    ConfigurazioneService configurazioneService;

    @Inject
    SendNotificaClient sendNotificaClient;

    @Inject
    SSOClient ssoClient;

    @Transactional
    public void startProcessForPecs() {

        List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
        String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);

        //NOTA: send notifica di errore a tutti gli admin
        List<DatiUtenteSlimSSO> admins = ssoClient.getAdminsForApplicationSlim(Integer.valueOf(applicationId));
        List<String> adminEmails = admins.stream()
                .filter(a -> a.email != null && !a.email.isEmpty())
                .map(a -> a.email)
                .toList();

        PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();
        EmailTemplate template = emailTemplateService.getTemplate(Operazione.regolaPecNonValida, "notifica");

        LocalDateTime now = LocalDateTime.now();
        List<PecPeo> pecToProcess = pecPeoService.getAllActivePecConfigurations();
        for(PecPeo pec : pecToProcess) {

            String logPrefix = "[PRW - Analisi regole su indirizzo " + pec.getIndirizzoEmail() + "]";
            log.info("{}: START", logPrefix);
            PecRegola regolaNotVerified = pecRegoleService.getFirstNonVerified(pec, now);

            if (regolaNotVerified == null) {
                log.info("{}: END", logPrefix);
                continue;
            }

            log.error("{}: Regola non verificata: {}", logPrefix, regolaNotVerified.getErrorFullDescription());

            boolean mustSendNotifica = regolaNotVerified.getTsLastInvioNotifica() == null || (!regolaNotVerified.getTsLastInvioNotifica().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().equals(now.toLocalDate()));
            if (template != null && mustSendNotifica && !adminEmails.isEmpty()) {
                log.info("{}: Invio notifiche per regola non verificata", logPrefix);

                String oggettoEmailNotifica = template.getOggetto().replace("{{regola}}", regolaNotVerified.getErrorFullDescription());
                String sbCorpoEmailNotifica = template.getCorpo()
                        .replace("{{headerCorpo}}", oggettoEmailNotifica)
                        .replace("{{data}}", Utils.fromDateToString(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()), Utils.DateFormat.DMY_HM))
                        .replace("{{emailAddress}}", pec.getIndirizzoEmail());

                for(String adminEmail : adminEmails) {
                    Long idNotifica = notificaService.newNotifica(
                            null,
                            peoInvioNotifica.getIndirizzoEmail(),
                            adminEmail,
                            oggettoEmailNotifica,
                            sbCorpoEmailNotifica,
                            Operazione.regolaPecNonValida.name());

                    if(idNotifica != null){
                        log.info("{}: Invio notifica per regola non verificata a {}", logPrefix, adminEmail);
                        sendNotificaClient.sendNotifica(idNotifica);
                    }
                }

                regolaNotVerified.setTsLastInvioNotifica(Date.from(Instant.now()));
                regolaNotVerified.persistAndFlush();
            }

            log.info("{}: END", logPrefix);
        }
    }
}
