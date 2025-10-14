package it.parsec326.pi.intranet.service;

import it.parsec326.pi.intranet.model.Configurazione;
import it.parsec326.pi.intranet.model.Notifica;
import it.parsec326.pi.intranet.model.PeConfigurazione;
import it.parsec326.pi.intranet.model.PecPeo;
import it.parsec326.pi.intranet.utils.CryptoUtil;
import it.parsec326.pi.intranet.utils.EmailUtils;
import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
@Slf4j
public class NotificaService {

    @Inject
    private EntityManager em;

    @Inject
    private ConfigurazioneService configurazioneService;

    @Transactional
    public Long newNotifica(Long idProtocollo, String from, String to, String subject, String content, String type) {

        if (from == null || to == null || subject == null || from.isEmpty() || to.isEmpty() || subject.isEmpty()) {
            log.error("Richiesta di notifica per id protocollo {} non salvata perché mancante di campi necessari", idProtocollo);
            return null;
        }

        Notifica notifica = Notifica.builder()
                .idProtocollo(idProtocollo)
                .state(null)
                .to(to)
                .from(from)
                .subject(subject)
                .content(content)
                .type(type)
                .tsCreation(Timestamp.from(Instant.now()))
                .build();

        notifica.persistAndFlush();
        return notifica.getId();
    }

    public PecPeo getConfigurazioneForInvioNotifiche(List<Configurazione> configurazioni) {
        PeConfigurazione peConfigurazione = new PeConfigurazione();
        PecPeo peoFrom = new PecPeo();

        try {
            for (Configurazione conf : configurazioni) {
                if (conf.getNome().equalsIgnoreCase("emailAddressFromNotifiche")) {
                    peoFrom.setIndirizzoEmail(conf.getValore());
                    peoFrom.setUsername(conf.getValore());
                }
                else if (conf.getNome().equalsIgnoreCase("emailPasswordFromNotifiche")) {
                    peoFrom.setPassword(CryptoUtil.decrypt(conf.getValore()));
                }
                else if (conf.getNome().equalsIgnoreCase("smtpHostFromNotifiche")) {
                    peConfigurazione.setSmtpHost(conf.getValore());
                }
                else if (conf.getNome().equalsIgnoreCase("smtpPortFromNotifiche")) {
                    peConfigurazione.setSmtpPort(Integer.valueOf(conf.getValore()));
                }
            }
            peoFrom.setConfigurazione(peConfigurazione);
        }
        catch (Exception ex) {
            log.error("Errore nella configurazione della casella di posta per l'invio delle notifiche");
            return null;
        }
        return peoFrom;
    }
    public PecPeo getConfigurazioneForInvioNotifiche() {
        List<Configurazione> configurazioni = configurazioneService.getAllConfigurazioniByCategoria("notifiche");
        return getConfigurazioneForInvioNotifiche(configurazioni);
    }

    public String getCcForNotifiche() {
        return null;
    }
    public String getBccForNotifiche() {
        Map<String, Object> params = new HashMap<>();
        params.put("nome", "bccRichiestaAssegnazione");
        params.put("categoria", "notifiche");
        Configurazione bccConf = (Configurazione) Configurazione.find("nome = :nome and categoria = :categoria", params).firstResultOptional().orElse(null);
        if (bccConf != null)
            return bccConf.getValore();
        return null;
    }

    @Transactional
    public boolean sendNotifica(Long idNotifica, PecPeo peoFrom, String ccForNotifiche, String bccForNotifiche) {
        Notifica notifica = Notifica.findById(idNotifica);
        return sendNotifica(notifica, peoFrom, ccForNotifiche, bccForNotifiche);
    }
    @Transactional
    public boolean sendNotifica(Notifica notifica, PecPeo peoFrom, String ccForNotifiche, String bccForNotifiche) {
        if (notifica == null || peoFrom == null) {
            if (notifica == null) log.error("Notifica da inviare è null");
            if (peoFrom == null) log.error("peoFrom è null");
            return false;
        }

        if (notifica.isInviata()){
            log.info("La notifica e' stata gia' inviata con successo in precedenza");
            return true;
        }

        String cc = null;
        String bcc = null;
        if (notifica.getType().equalsIgnoreCase(Operazione.richiestaAssegnazione.toString())) {
            if (bccForNotifiche == null) {
                bcc = getBccForNotifiche();
            }
            else {
                bcc = bccForNotifiche;
            }
        }

        boolean esito = EmailUtils.sendHtmlEmail(peoFrom, notifica.getTo(), notifica.getSubject(), notifica.getContent(), cc, bcc);
        if (esito) {
            notifica.setStateInviato();
        }
        else {
            notifica.setStateInErrore();
            log.error("Notifica con id {} NON inviata", notifica.getId());
        }

        notifica.setTsUpdate(Timestamp.from(Instant.now()));
        notifica.persist();
        return esito;
    }

    @Transactional
    public boolean sendNotifica(Long idNotifica) {
        Notifica notifica = Notifica.findById(idNotifica);
        PecPeo peoFrom = getConfigurazioneForInvioNotifiche();
        return sendNotifica(notifica, peoFrom, null, null);
    }
}
