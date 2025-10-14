package it.parsec326.pi.email.service;

import it.parsec326.pi.email.pec_queue.NotificaQueue;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.ConfigurazioneService;
import it.parsec326.pi.intranet.service.EmailTemplateService;
import it.parsec326.pi.intranet.service.NotificaService;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Slf4j
@ApplicationScoped
public class NotificaProcessorService {

    @Inject
    EntityManager em;

    @Inject
    NotificaService notificaService;

    @Inject
    ConfigurazioneService configurazioneService;

    @Inject
    EmailTemplateService emailTemplateService;

    @Inject
    SSOClient ssoManager;

    public List<Notifica> getNotificheNonInviateWithMaxResult(int maxResult){
        return em.createNamedQuery("getAllNotificheNonInviate", Notifica.class)
                .setMaxResults(maxResult)
                .getResultList();
    }

    public List<Notifica> getAllNotificheNonInviate(){
        return em.createNamedQuery("getAllNotificheNonInviate", Notifica.class).getResultList();
    }


    public void sendAllNotificheNonInviate(){
        List<Notifica> notificheNonInviate = getNotificheNonInviateWithMaxResult(20);

        if(notificheNonInviate.isEmpty()){
            log.info("[NotificaProcessorService] - Non ci sono notifiche PEO da inviare");
            return;
        }

        PecPeo peoFrom = notificaService.getConfigurazioneForInvioNotifiche();
        if (peoFrom == null) {
            log.error("[NotificaProcessorService] - Non è stato possibile inviare le notifiche:  peoFrom è null ");
            return;
        }

        int notificheProcessate = 0;
        log.info("[NotificaProcessorService] - Start Process delle notifiche PEO: {}", notificheNonInviate.size());
        for(Notifica notifica : notificheNonInviate){
            if(notificaService.sendNotifica(notifica.getId(), peoFrom, notificaService.getCcForNotifiche(), notificaService.getBccForNotifiche())){
                notificheProcessate++;
            }
        }

        log.info("[NotificaProcessorService] - End process delle notifiche PEO, inviate: {} di {}}", notificheProcessate, notificheNonInviate.size());

        List<Notifica> notificheNonInviatePostProcess = getAllNotificheNonInviate();

        if(notificheNonInviatePostProcess.isEmpty()){
            log.info("[NotificaProcessorService] - Tutte le PEO sono state inviate");
        }else{
            log.info("[NotificaProcessorService] - Ci sono ancora: {} notifiche PEO da inviare", notificheNonInviatePostProcess.size());
        }
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void sendNotificaForInvioMailErrore(Long idEmail, String msgErrore) {

        Email email = Email.findById(idEmail);
        if (email == null || email.getProtocollo() == null) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Email non conforme (non trovata oppure non protocollata", idEmail).boom();
        }

        // recupera l'idUtente di chi ha mandato la mail
        String idUtente = email.getIdUtente();
        if (idUtente == null || idUtente.isEmpty()) {
            log.error("Utente ID {} non valido", idUtente);
            return;
        }

        List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
        String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
        String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
        PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();
        log.info("[InvioMailErrore] - Estrazione peoInvioNotifica: {}, per l'elaborazione della notifica di.", peoInvioNotifica.getIndirizzoEmail());

        DatiUtenteSSO recipientNotifica = ssoManager.getUserByAuthId(idUtente, Integer.valueOf(applicationId));
        if (recipientNotifica.email == null) {
            log.error("[InvioMailErrore] - Utente con ID {} non ha nessuna mail associata", idUtente);
            return;
        }

        EmailTemplate template = emailTemplateService.getTemplate(Operazione.erroreInvioPecPeo, "notifica");

        String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", email.getProtocollo().getNProtocollo());
        String sbCorpoEmailNotifica = template.getCorpo()
                .replace("{{headerCorpo}}", oggettoEmailNotifica)
                .replace("{{cognomeUtenteTO}}", recipientNotifica.lastName)
                .replace("{{nomeUtenteTO}}", recipientNotifica.firstName)
                .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                .replace("{{numero}}", email.getProtocollo().getNProtocollo())
                .replace("{{oggetto}}", email.getProtocollo().getOggetto())
                .replace("{{msgErrore}}", msgErrore != null ? msgErrore : "N.D.")
                .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + email.getProtocollo().getNProtocollo()));

        Long idNotifica = notificaService.newNotifica(
                email.getProtocollo().getId(),
                peoInvioNotifica.getIndirizzoEmail(),
                recipientNotifica.email,
                oggettoEmailNotifica,
                sbCorpoEmailNotifica,
                Operazione.erroreInvioPecPeo.toString());

        if (idNotifica != null) {
            NotificaQueue.enqueue(idNotifica);
        }
    }
}
