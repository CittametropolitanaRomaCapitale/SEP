package it.parsec326.pi.intranet.utils;

import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.PeConfigurazione;
import it.parsec326.pi.intranet.model.PecPeo;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

import java.util.Properties;

@Slf4j
public class EmailUtils {

    /**
     * Restituisce le properties della mail data la configurazione in innput.
     * @param emailConfiguration
     * @return
     */
    public static Properties getProperties(PeConfigurazione emailConfiguration) {
        if (emailConfiguration == null) {
            throw new IllegalArgumentException("Parametro emailConfiguration non può essere nullo");
        }
        Properties props = new Properties();
        props.put("mail.smtp.host", emailConfiguration.getSmtpHost());
        props.put("mail.smtp.port", emailConfiguration.getSmtpPort());
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        if(emailConfiguration.getSmtpHost().toLowerCase().contains("smtps")){
            props.put("mail.smtp.ssl.enable", "true");
        }
        return props;
    }

    /**
     * Restituisce la sessione per la mail date le props e la configurazione.
     * @param props
     * @param pecPeo
     * @return
     */
    public static Session getSession(Properties props, PecPeo pecPeo) {
        if (props == null) {
            throw new IllegalArgumentException("L'oggetto Properties non può essere nullo");
        }
        if (pecPeo == null) {
            throw new IllegalArgumentException("L'oggetto PecPeo non può essere nullo");
        }
        return Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                try {
                    return new PasswordAuthentication(pecPeo.getIndirizzoEmail(), pecPeo.getPassword());
                } catch (Exception ignored) {}
                return null;
            }
        });
    }

    /**
     * Restituisce il messaggio da inviare data la sessione, la configurazione e il contenuto della mail.
     * @param session
     * @param from
     * @param to
     * @param subject
     * @param body
     * @return
     * @throws MessagingException
     */
    public static Message getMessage(Session session, String from, String to, String subject, String body, String cc, String bcc, boolean isHtml) throws MessagingException {
        if (session == null) {
            throw new IllegalArgumentException("La sessione non può essere nulla");
        }
        if (from == null || from.isEmpty()) {
            throw new IllegalArgumentException("Il campo 'from' non può essere nullo o vuoto");
        }
        if (to == null || to.isEmpty()) {
            throw new IllegalArgumentException("Il campo 'to' non può essere nullo o vuoto");
        }
        if (subject == null || subject.isEmpty()) {
            throw new IllegalArgumentException("Il campo 'subject' non può essere nullo o vuoto");
        }
        if (body == null || body.isEmpty()) {
            throw new IllegalArgumentException("Il campo 'body' non può essere nullo o vuoto");
        }
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(from));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        message.setSubject(subject);
        if (!isHtml)
            message.setText(body);
        else
            message.setContent(body, "text/html; charset=utf-8");

        if (cc != null && !cc.isEmpty())
            message.addRecipient(Message.RecipientType.CC, new InternetAddress(cc));
        if (bcc != null && !bcc.isEmpty())
            message.addRecipient(Message.RecipientType.BCC, new InternetAddress(bcc));

        return message;
    }

    private static boolean setEmail(PecPeo sender, String toEmailAddress, String oggetto, String corpo, String cc, String bcc, boolean isHtml) {
        try {
            LogUtils.entering(LogUtils.LogLevel.DEBUG);
            Properties props = getProperties(sender.getConfigurazione());
            Session session = getSession(props, sender);
            Message message = getMessage(session, sender.getIndirizzoEmail(), toEmailAddress, oggetto, corpo, cc, bcc, isHtml);
            Transport.send(message);
            LogUtils.entering(LogUtils.LogLevel.DEBUG);
            return true;

        }catch (SendFailedException e){
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return false;

        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore in fase di connessione con il server di posta").boom();
            log.error("Errore in fase di connessione con il server di posta ", e);
            return false;
        }
    }
    public static boolean sendTextEmail(PecPeo sender, String toEmailAddress, String oggetto, String corpo, String cc, String bcc) {
        return setEmail(sender, toEmailAddress, oggetto, corpo, cc, bcc, false);
    }
    public static boolean sendHtmlEmail(PecPeo sender, String toEmailAddress, String oggetto, String corpo, String cc, String bcc) {
        return setEmail(sender, toEmailAddress, oggetto, corpo, cc, bcc, true);
    }
}
