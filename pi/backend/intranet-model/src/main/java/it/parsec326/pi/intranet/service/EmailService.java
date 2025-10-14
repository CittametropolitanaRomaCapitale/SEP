package it.parsec326.pi.intranet.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.fabric8.kubernetes.client.utils.Utils;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.narayana.jta.runtime.TransactionConfiguration;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.client.SendEmailClient;
import it.parsec326.pi.intranet.dto.EmailOutputDTO;
import it.parsec326.pi.intranet.dto.NotificaProtocolloPecPeoInput;
import it.parsec326.pi.intranet.dto.ricerca.RicercaEmailDTO;
import it.parsec326.pi.intranet.dto.ipa.IpaResponseDTO;
import it.parsec326.pi.intranet.dto.mail.AttachmentDTO;
import it.parsec326.pi.intranet.dto.mail.EmailConfigurationDTO;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import it.parsec326.pi.intranet.dto.mail.InoltraRispondi;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.*;
import it.parsec326.pi.intranet.utils.common.*;
import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Stream;

import static it.parsec326.pi.intranet.service.AllegatoService.calculateImpronta;
import static it.parsec326.pi.intranet.utils.Utils.updateAppendInClauseByLong;

@Slf4j
@ApplicationScoped
public class EmailService implements PanacheCustomEntityServiceInterface<Email> {

    @ConfigProperty(name = "azure.tenant-id")
    String tenantId;

    @ConfigProperty(name = "azure.client-id")
    String clientId;

    @ConfigProperty(name = "azure.client-secret")
    String clientSecret;

    @ConfigProperty(name ="azure.scope")
    String scope;

    @Inject
    @Getter
    UserTransaction transaction;

    @Inject
    ProtocolloService protocolloService;

    @Inject
    PecPeoService pecPeoService;

    @Inject
    AllegatoService allegatoService;

    @Inject
    MinioConnectionFactory minioFactory;

    @Inject
    StoricoService storicoService;

    @Inject
    EntityManager em;

    @Inject
    SSOClient ssoManager;

    @Inject
    SendEmailClient sendEmailClient;

    @Inject
    TitolarioService titolarioService;

    private static final String protcoloBucketPath = "docs/protocolli";

    /**
     * Recupera un access token OAuth2 dal Microsoft Identity Platform (Azure AD)
     * usando il Client Credentials Flow.
     *
     * @param tenantId      ID del tenant (Directory ID) su Azure AD
     * @param clientId      Application (Client) ID registrato su Azure
     * @param clientSecret  Valore effettivo del client secret (non il secret ID!)
     * @param scope         Scope da richiedere, es: "https://outlook.office365.com/.default"
     * @return              L'access token (stringa Bearer) se la chiamata ha successo
     * @throws IOException, InterruptedException se la chiamata HTTP fallisce
     */
    public String getAccessToken(String tenantId, String clientId, String clientSecret, String scope) throws IOException, InterruptedException {

        // 1) Costruiamo l'endpoint di token
        String tokenEndpoint = "https://login.microsoftonline.com/"
                + tenantId
                + "/oauth2/v2.0/token";

        // 2) Prepariamo i parametri per il Client Credentials Flow
        //    client_id, client_secret, grant_type=client_credentials, scope, ...
        String formData = "client_id=" + encode(clientId)
                + "&client_secret=" + encode(clientSecret)
                + "&grant_type=client_credentials"
                + "&scope=" + encode(scope);

        // 3) Creiamo la richiesta HTTP con metodo POST e Content-Type form-urlencoded
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tokenEndpoint))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(formData))
                .build();

        // 4) Inviamo la richiesta col nuovo HttpClient (Java 11+)
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        // 5) Verifichiamo l'esito
        if (response.statusCode() != 200) {
            // Se c'è un errore, stampiamo o lanciamo eccezione con il corpo della risposta
            throw new RuntimeException("Errore nella richiesta di token. Codice HTTP: "
                    + response.statusCode() + ". Body: " + response.body());
        }

        // 6) Se tutto ok, il corpo della risposta è in JSON:
        //    { "token_type": "Bearer", "expires_in": 3599, "access_token": "eyJ0eXAiOiJKV1QiLC..." }
        //    Usando Jackson, parse e recuperiamo "access_token".
        String responseBody = response.body();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = mapper.readTree(responseBody);

        // 7) Recuperiamo la stringa "access_token" dal JSON
        String accessToken = json.get("access_token").asText();

        // 8) Ritorniamo la stringa del token
        return accessToken;
    }

    /**
     * Metodo di utility per URL-encodare le stringhe
     */
    private String encode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    @TransactionConfiguration(timeout = 120)
    public String sendEmail(Long idEmail) throws Exception {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Email email = Email.findById(idEmail);
        if(email == null) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Email da inviare con ID {} non trovata", idEmail).boom();
            return "Email non trovata";
        }

        // le email devo essere separate da ','
        if(email.getTo() != null && email.getTo().contains(";")){
            String oldValue = email.getTo();
            String newValue = oldValue.replaceAll(";", ",");
            email.setTo(newValue);
        }
        
        // se la mail è stata già inviata, ritorniamo true perchè non deve essere processato
        if (email.getStatoInvio() == StatoInvio.INVIATO){
            log.info("L'email con ID: {}, non sarà processata: già spedita al/ai destinatari", idEmail);
            return null;
        }

        Protocollo protocollo = email.getProtocollo();
        if (protocollo == null){
            log.error("L'email con ID: {}, non sarà processata: non risulta associata a nessun protocollo", idEmail);
            return null;
        }

        // per notifica in questo caso si intende l'invio del protocollo via pec/peo in un secondo momento
        boolean isNotifica = email.isNotificaProtocollo();
        if(!isNotifica && !validateEmailSendability(protocollo, idEmail.toString())){
            return "Email non associata ad un protocollo in uscita PEC / Email";
        }

        //Prepara gli input e verifica che sia tutto ok
        EmailConfigurationDTO emailConfiguration = isNotifica ? buildEmailConfiguration(email.getTipoEmail().equalsIgnoreCase("pec") ? MetodoSpedizione.Pec : MetodoSpedizione.Email, email.getFrom())
                                                              : buildEmailConfiguration(protocollo.getMetodoSpedizione(), protocollo.getIndirizzoPecPeo());
        EmailContentDTO emailContent = isNotifica ? buildEmailContentRispondiInoltra(email) : buildEmailContent(protocollo, null);

        boolean isOAuth = emailConfiguration.getPassword() == null || emailConfiguration.getPassword().isEmpty();
        if(isOAuth) {
            return sendEmailOAuth2(email, emailContent, protocollo);
        }

        checkEmailInputValidity(emailConfiguration, emailContent, isNotifica);

        // Costruisce la mail e la invia
        Properties props = getProperties(emailConfiguration);
        Session session = getSession(props, emailConfiguration);
        Message message = getMessage(session, emailConfiguration, emailContent);
        setAttachments(emailContent, message);
        setHeadersForPec(protocollo, message, emailConfiguration);

        List<String> assegnatari = new ArrayList<>();
        if(email.getTo().contains(",")){
            assegnatari = List.of(email.getTo().split(","));
        }else {
            assegnatari.add(email.getTo());
        }
        message.setRecipients(Message.RecipientType.TO, new InternetAddress[0]);
        for (String to : assegnatari) {
            message.addRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        }

        // Aggiungo i CC
        if (email.getCc() != null && !email.getCc().equals("")) {
            List<String> copia = new ArrayList<>();
            if(email.getCc().contains(",")){
                copia = List.of(email.getCc().split(","));
            }else {
                copia.add(email.getCc());
            }
            message.setRecipients(Message.RecipientType.CC, new InternetAddress[0]);
            for (String cc : copia) {
                message.addRecipients(Message.RecipientType.CC, InternetAddress.parse(cc));
            }
        }


        // NOTA: si prova ad inviare se la mail si trova nello stato iniziale (da inviare) oppure se l'invio è fallito.
        if (email.getStatoInvio() == StatoInvio.DA_INVIARE || email.getStatoInvio() == StatoInvio.INVIO_FALLITO){
            String messageId = "";
            try{

                if (email.getTipoEmail().equalsIgnoreCase(TipologiaPosta.PEC.getTipologiaPosta())) {
                    message.setHeader("X-TipoRicevuta", "breve");
                }

                Transport.send(message);
                messageId = ((MimeMessage) message).getMessageID().toLowerCase();
                if (messageId.isEmpty()) {
                    log.error("Invio effettuato per email con ID {} ma messageId nullo o vuoto", email.getId());
                }
            }catch (SendFailedException e) {
                // se la mail non si trova nello stato invio fallito, aggiorno il record con il nuovo stato
                if (email.getStatoInvio() != StatoInvio.INVIO_FALLITO) {
                    email.setStatoInvio(StatoInvio.INVIO_FALLITO);
                    Email.persist(email);
                }
                return e.getMessage();
            }catch (Exception e){
                log.error("Errore invio email con ID {}: ", e.getMessage());
                CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
                return e.getMessage();
            }

            // aggiorno il messageId e lo stato
            email.setStatoInvio(
                    emailConfiguration.isSaveToSent()
                            ? StatoInvio.SALVARE_IN_INBOX
                            : StatoInvio.SALVARE_COME_ALLEGATO
            );
            email.setMessageId(messageId);
            email.setTsInvio(Timestamp.from(message.getSentDate().toInstant()));
        }
        if (email.getStatoInvio() == StatoInvio.SALVARE_IN_INBOX) {
            try {
                // aggiungo il messaggio in "posta inviata"
                // NOTA: è possibile inserire message in inbox anche in un secondo momento
                Store store = session.getStore("imaps");
                store.connect(emailConfiguration.getImapHost(), Integer.valueOf(emailConfiguration.getImapPort()), emailConfiguration.getUsername(), emailConfiguration.getPassword());

//              TipologiaPosta tipologiaPosta = emailConfiguration.isPec() ? TipologiaPosta.PEC : TipologiaPosta.PEO;
//              PeConfigurazione peConfigurazione = pecPeoService.getPeConfigurazione(tipologiaPosta);
//              Folder sentFolder = store.getFolder(peConfigurazione.getSentFolder());

                List<String> possibleSentFolders = List.of("Sent", "Inviata");
                Folder sentFolder = it.parsec326.pi.intranet.utils.Utils.findSentFolder(store, possibleSentFolders);
                if(sentFolder == null){
                    log.error("INBOX Sent/Inviata non non trovata, mail id: {}", email.getId());
                }else {
                    sentFolder.open(Folder.READ_WRITE);
                    Message[] messages = new Message[]{message};
                    sentFolder.appendMessages(messages);
                    sentFolder.close(false);
                    store.close();
                }
                email.setStatoInvio(StatoInvio.SALVARE_COME_ALLEGATO);
            } catch (Exception e) {
                Email.persist(email);
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                log.error("Errore nel salvataggio della mail nella inbox, mail id: {}", email.getId());
                // torniamo true perchè l'eccezione è stata catturata dopo che la mail è stata inviata
                return null;
            }
        }

        if (email.getStatoInvio() == StatoInvio.SALVARE_COME_ALLEGATO){
            try {
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                message.writeTo(outputStream);
                byte[] content = outputStream.toByteArray();

                Date dateInvioMail = email.getTsInvio() != null ? new Date(email.getTsInvio().getTime()) : new Date();
                String dataInvio = Objects.requireNonNull(it.parsec326.pi.intranet.utils.Utils.fromDateToString(dateInvioMail, it.parsec326.pi.intranet.utils.Utils.DateFormat.DMY_HMS_COMPACT));

                Allegato allegato = new Allegato();
                allegato.setIdEmail(email.getId());
                allegato.setTipoDocumento("eml_protocollo");
                allegato.setOggetto(isNotifica ? email.getOggetto() : protocollo.getOggetto());
                allegato.setCollocazioneTelematica("");
                allegato.setIsMain(false);
                allegato.setNome("PEC-".concat(dataInvio).concat(".eml"));
                allegato.setEstensione(".eml");
                allegato.setDimensione((long) content.length);
                allegato.setImpronta(calculateImpronta(content));
                allegato.setTsCreation(Calendar.getInstance().getTime());

                File file = new File(String.format("%s", allegato.getEstensione()));
                String minioId = UUID.randomUUID().toString().replaceAll("-", "");
                String fileName = String.format("%s_%s%s", String.format("PEC-".concat(dataInvio)), minioId, allegato.getEstensione());
                String minioRef = String.format("%s/%s", protcoloBucketPath, InputUtils.normalizeFilenameInput(fileName));

                file.createNewFile();
                FileUtils.copyInputStreamToFile(new ByteArrayInputStream(content), file);

                minioFactory.uploadFileWithFilename("pi-docs", minioRef, file.getName());
                file.delete();
                allegato.setRiferimentoMinio(minioRef);
                allegato.persistAndFlush();

                email.setStatoInvio(StatoInvio.INVIATO);
            } catch (Exception e) {
                Email.persist(email);
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                CustomException.get(CustomException.ErrorCode.INTERNAL,
                        "Errore nel salvataggio della mail come allegato").boom();
                return null;
            }
        }

        if(isNotifica){
            if(email.getNomeUtente().equalsIgnoreCase("sistema")){
                storicoService.insertNewStoricoForNumeroProtocollo(protocollo, "Sistema", "Sistema", "Invio Pec di avvenuta protocollazione",  String.format("Destinatario/i: TO: %s; CC: %s", email.getTo(), email.getCc()));
            }else{
                storicoService.insertNewStoricoForNumeroProtocollo(protocollo, email.getIdUtente(), email.getNomeUtente(), String.format("Invio Protocollo tramite %s", email.getTipoEmail()),  String.format("Destinatario/i: TO: %s; CC: %s", email.getTo(), email.getCc()));
            }
        }else {
            storicoService.insertNewStoricoForNumeroProtocolloWithUtenteSistema(protocollo, StoricoOperazione.InvioMail.getStatoParameter(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()) ? "Circolare" : "Protocollo"));
        }

        Email.persist(email);
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return null;
    }

    @Transactional
    public String sendEmailOAuth2(Email email, EmailContentDTO emailContentDTO, Protocollo protocollo) throws IOException, InterruptedException {
        String accessToken = getAccessToken(tenantId, clientId, clientSecret, scope);

        // Crea il JSON per la POST a /sendMail
        // Struttura base
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode rootNode = mapper.createObjectNode();
        ObjectNode messageNode = rootNode.putObject("message");

        messageNode.put("subject", emailContentDTO.getSubject());
        ObjectNode bodyNode = messageNode.putObject("body");
        bodyNode.put("contentType", "HTML");
        bodyNode.put("content", emailContentDTO.getBody());

        // (Facoltativo) salvataggio email nei Sent Items
        // rootNode.put("saveToSentItems", "true");

        ArrayNode toRecipientsArray = messageNode.putArray("toRecipients");
        List<String> assegnatari = email.getTo().contains(",") ? List.of(email.getTo().split(",")) : List.of(email.getTo());
        assegnatari.forEach(a -> {
            toRecipientsArray.addObject().putObject("emailAddress").put("address", a);
        });

        if (email.getCc() != null && !email.getCc().isEmpty()) {
            ArrayNode ccRecipientsArray = messageNode.putArray("ccRecipients");
            List<String> copia = email.getCc().contains(",") ? List.of(email.getCc().split(",")) : List.of(email.getCc());
            copia.forEach(c -> {
                ccRecipientsArray.addObject().putObject("emailAddress").put("address", c);
            });
        }

        if (emailContentDTO.getAttachments() != null && !emailContentDTO.getAttachments().isEmpty()) {
            ArrayNode attachmentsArray = messageNode.putArray("attachments");
            emailContentDTO.getAttachments().forEach(allegato -> {
                ObjectNode pdfAttachment = attachmentsArray.addObject();
                pdfAttachment.put("@odata.type", "#microsoft.graph.fileAttachment");
                pdfAttachment.put("name", allegato.getName());
                pdfAttachment.put("contentType", allegato.getType());
                pdfAttachment.put("contentBytes",  Base64.getEncoder().encodeToString(allegato.getContent()));
            });

        }

        // richiesta HTTP
        String sendMailEndpoint = "https://graph.microsoft.com/v1.0/users/" + email.getFrom() + "/sendMail";
        HttpClient httpClient = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(sendMailEndpoint))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(rootNode.toString()))
                .build();

        // Invio e gestione della risposta
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        boolean result = response.statusCode() == 202;
        if (result) {
            email.setStatoInvio(StatoInvio.INVIATO);
            email.setTsInvio(new Timestamp(System.currentTimeMillis()));
            Email.persist(email);
            try {
                byte[] conteentEml = createEmlFile(email, emailContentDTO);
                Allegato allegato = new Allegato();
                allegato.setIdEmail(email.getId());
                allegato.setTipoDocumento("eml_protocollo");
                allegato.setOggetto(email.getOggetto());
                allegato.setCollocazioneTelematica("");
                allegato.setIsMain(false);
                allegato.setNome("PEC-".concat(email.getTsInvio().toString()).concat(".eml"));
                allegato.setEstensione(".eml");
                allegato.setDimensione((long) conteentEml.length);
                allegato.setImpronta(calculateImpronta(conteentEml));
                allegato.setTsCreation(Calendar.getInstance().getTime());

                File file = new File(String.format("%s", allegato.getEstensione()));
                String minioId = UUID.randomUUID().toString().replaceAll("-", "");
                String fileName = String.format("%s_%s%s", String.format("PEC-".concat(email.getTsInvio().toString())), minioId, allegato.getEstensione());
                String minioRef = String.format("%s/%s", protcoloBucketPath, InputUtils.normalizeFilenameInput(fileName));

                file.createNewFile();
                FileUtils.copyInputStreamToFile(new ByteArrayInputStream(conteentEml), file);

                minioFactory.uploadFileWithFilename("pi-docs", minioRef, file.getName());
                file.delete();
                allegato.setRiferimentoMinio(minioRef);
                allegato.persistAndFlush();
                
            } catch (Exception e) {
                Email.persist(email);
                log.error("Errore nel salvataggio della mail come allegato, id email: {}", email.getId());
                return e.getMessage();
            }

            String nomeUtente = email.getNomeUtente() != null ? email.getNomeUtente() : "Sistema";
            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, email.getIdUtente(), nomeUtente, String.format("Invio Protocollo tramite %s", email.getTipoEmail()), String.format("Destinatario/i: TO: %s; CC: %s", email.getTo(), email.getCc()));

        } else {
            log.error("Errore nell'invio della mail: {}", response.statusCode());
            email.setStatoInvio(StatoInvio.INVIO_FALLITO);
            Email.persist(email);
        }

        return result ? null : String.valueOf(response.statusCode());
    }

    private byte[] createEmlFile(Email email, EmailContentDTO emailContentDTO) throws MessagingException {

        // 1. Creazione Session "dummy"
        Properties props = new Properties();
        // Non serve alcun provider SMTP reale, è sufficiente per costruire il MimeMessage in memoria.
        Session session = Session.getInstance(props);

        // 2. Creazione di un MimeMessage
        MimeMessage mimeMessage = new MimeMessage(session);

        // Imposta l'header "From"
        mimeMessage.setFrom(new InternetAddress(email.getFrom()));

        // Imposta i destinatari "To"
        List<String> toRecipients = email.getTo().contains(",") ? List.of(email.getTo().split(",")) : List.of(email.getTo());
        for (String r : toRecipients) {
            mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(r.trim()));
        }

        // Imposta i destinatari "CC" se presenti
        if (email.getCc() != null && !email.getCc().isEmpty()) {
            List<String> ccRecipients = email.getCc().contains(",") ? List.of(email.getCc().split(",")) : List.of(email.getCc());
            for (String c : ccRecipients) {
                mimeMessage.addRecipient(Message.RecipientType.CC, new InternetAddress(c.trim()));
            }
        }

        // Imposta l'oggetto (Subject)
        mimeMessage.setSubject(emailContentDTO.getSubject(), StandardCharsets.UTF_8.name());

        // 3. Creazione del corpo e degli allegati
        Multipart multipart = new MimeMultipart();

        // -- 3.1: parte testuale HTML
        MimeBodyPart htmlPart = new MimeBodyPart();
        htmlPart.setContent(emailContentDTO.getBody(), "text/html; charset=UTF-8");
        multipart.addBodyPart(htmlPart);

        // -- 3.2: aggiunta allegati (se presenti)
        if (emailContentDTO.getAttachments() != null && !emailContentDTO.getAttachments().isEmpty()) {
            for (AttachmentDTO allegato : emailContentDTO.getAttachments()) {
                MimeBodyPart attachmentPart = new MimeBodyPart();
                DataSource ds = new ByteArrayDataSource(allegato.getContent(), allegato.getType());
                attachmentPart.setDataHandler(new DataHandler(ds));
                attachmentPart.setFileName(allegato.getName());
                multipart.addBodyPart(attachmentPart);
            }
        }

        // 4. Aggiungo il multipart al MimeMessage
        mimeMessage.setContent(multipart);

        // 5. Salvataggio su file .eml
        // Usa un nome di file coerente con le tue esigenze (timestamp, idEmail ecc.)
        String fileName = "email_" + email.getId() + ".eml";
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            mimeMessage.writeTo(outputStream);
        }catch (Exception e) {
            log.error("Errore nella creazione del file eml: {}", e.getMessage());
        }

        log.info("File EML creato con successo: {}", fileName);
        return outputStream.toByteArray();
    }


    @Transactional
    public boolean sendEmailRispondiInoltra(InoltraRispondi input){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try {
            MetodoSpedizione metodoSpedizione = input.tipologiaPosta.equalsIgnoreCase("PEC") ? MetodoSpedizione.Pec : MetodoSpedizione.Email;
            EmailConfigurationDTO emailConfiguration = buildEmailConfiguration(metodoSpedizione, input.from);
            List<Allegato> allegati = new ArrayList<>();
            if(input.idAttachments != null){
                for(Long id : input.idAttachments){
                    Allegato allegato = Allegato.findById(id);
                    allegati.add(allegato);
                }
            }

            EmailContentDTO emailContent = EmailContentDTO.builder()
                    .from(input.from)
                    .subject(input.subject)
                    .body(input.body)
                    .to(input.to)
                    .attachments(allegatoService.buildAttachmentsForEmail(allegati))
                    .direction(EmailDirection.USCITA.getDirection())
                    .build();

            if(input.cc != null){
                emailContent.setCc(input.cc);
            }

            checkEmailInputValidity(emailConfiguration, emailContent, false);
            Properties props = getProperties(emailConfiguration);
            Session session = getSession(props, emailConfiguration);
            Message message = getMessage(session, emailConfiguration, emailContent);
            setAttachments(emailContent, message);
            setHeader(message, emailConfiguration);

            message.setRecipients(Message.RecipientType.TO, new InternetAddress[0]);
            for (String to : emailContent.getTo()) {
                message.addRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            }

            // Aggiungo i CC
            if (emailContent.getCc() != null) {
                message.setRecipients(Message.RecipientType.CC, new InternetAddress[0]);
                for (String cc : emailContent.getCc()) {
                    message.addRecipients(Message.RecipientType.CC, InternetAddress.parse(cc));
                }
            }

            try {
                Transport.send(message);
                emailContent.setTsInvio(Timestamp.valueOf(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(message.getSentDate())));
                emailContent.setMessageId(((MimeMessage) message).getMessageID().toLowerCase());
                if (emailContent.getMessageId() == null || emailContent.getMessageId().equals("")) {
                    return false;
                }
            } catch (Exception e) {
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                log.error("Errore nell'invio della mail");
                return false;
            }

            saveRecordEmail(emailContent, allegati, message);


        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            log.error("Errore durante l'elaborazione della mail");
            CustomException.get(CustomException.ErrorCode.INTERNAL,e).boom();
            return false;
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    /**
     * Invia il messaggio.
     * Salva la email nella tabella email.
     * @param protocollo
     */

    @Transactional
    public List<Long> saveRecordEmail(Protocollo protocollo, String classificazioneFromProtocollo, Map<String, Boolean> setIdReferentiToUsePeo) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        EmailContentDTO emailContent = buildEmailContent(protocollo, setIdReferentiToUsePeo);
        List<Email> emails = new ArrayList<>();
        List<String> assegnatari = new ArrayList<>();
        boolean isMultiplo = protocollo.getInvioEmailMultiplo() == 1;

        if(isMultiplo){
            emailContent.getTo().stream().forEach(x -> assegnatari.add(x));
        }else {
            assegnatari.add(String.join(",", emailContent.getTo()));
        }

        for(String to : assegnatari){
            Email email = new Email.Builder()
                    .protocollo(protocollo)
                    .from(protocollo.getIndirizzoPecPeo())
                    .emailDirection(EmailDirection.USCITA)
                    .tipoEmail(ProtocolloUtils.getTipoEmail(protocollo.getMetodoSpedizione()))
                    .to(to)
                    .cc(String.join(",", emailContent.getCc()))
                    .oggetto(emailContent.getSubject())
                    .corpo(emailContent.getBody())
                    .tsInvio(null)
                    .statoInvio(StatoInvio.DA_INVIARE)
                    .idUtente(protocollo.getIdUtente())
                    .tsCreation(new Timestamp(System.currentTimeMillis()))
                    .tsStartVali(new Timestamp(System.currentTimeMillis()))
                    .impronta(this.generateImprontaEmail(emailContent, isMultiplo, Optional.of(to)))
                    .classificazione(classificazioneFromProtocollo)
                    .build();

            emails.add(email);
        }

        List<Long> idEmails = new ArrayList<Long>(emails.size());
        try {
            for(Email email : emails){
                email.persist();
                if(protocollo.getAllegati() != null && !protocollo.getAllegati().isEmpty() && email.getId() != null){
                    this.updateAllegatoSetIdEmail(protocollo.getAllegati(), email.getId());
                }
                idEmails.add(email.getId());
            }
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            log.error("Errore nel salvataggio del record Email");
            CustomException.get(CustomException.ErrorCode.INTERNAL,e).boom();
        }
        return idEmails;
    }

    @Transactional
    public Long saveRecordEmailAvvenutaProtocollazioneAutomatica(Protocollo protocollo, EmailContentDTO emailContent, String classificazioneFromProtocollo, Allegato allegato, String oggetto, String corpo) {
        try {
            String from = null;
            for (String to : emailContent.getTo()) {
                try {
                    //NOTA: la query ritorna l'indirizzo pec che ha abilitato l'opzione per inviare la risposta automatica!
                    from = em.createNamedQuery("findPecByEmailForRispostaAutomatica", String.class)
                            .setParameter("email", to)
                            .setParameter("tipologiaPosta", TipologiaPosta.PEC)
                            .getSingleResult();
                    if (from != null)
                        break;
                } catch (Exception e) {
                    log.info("Errore durante la query di selezione del mittente dal destinatario {} nell'invio email di protocollozione automatica: {}", to, e.getMessage());
                }
            }
            
            if (from == null)
                return null;

            //NOTA: si invia comunque la risposta automatica anche all'eventuale destinatario che coincide con il mittente
            //if(from.equalsIgnoreCase(emailContent.getFrom())) return null;

            Email email = new Email.Builder()
                    .protocollo(protocollo)
                    .from(from)
                    .emailDirection(EmailDirection.USCITA)
                    .tipoEmail("PEC")
                    .to(emailContent.getFrom())
                    .cc("")
                    .oggetto(oggetto)
                    .corpo(corpo)
                    .tsInvio(null)
                    .statoInvio(StatoInvio.DA_INVIARE)
                    .idUtente(protocollo.getIdUtente())
                    .tsCreation(new Timestamp(System.currentTimeMillis()))
                    .tsStartVali(new Timestamp(System.currentTimeMillis()))
                    .impronta(this.generateImprontaEmail(emailContent, false, Optional.of(emailContent.getFrom())))
                    .classificazione(classificazioneFromProtocollo)
                    .allegati(List.of(allegato))
                    .notificaProtocollo(true)
                    .nomeUtente("sistema")
                    .isHidden(true)
                    .build();

            email.persist();

            allegato.setIdEmail(email.getId());
            allegato.persist();

            return email.getId();

        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore durante il salvataggio della email per protocollo id {}: {}", protocollo.getId(), e.getMessage(), e).boom();
            return null;
        }
    }


    @Transactional
    public void saveRecordEmail(EmailContentDTO emailContent, List<Allegato> allegati, Message message) throws MessagingException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        EmailDirection emailDirection = emailContent.getDirection().equalsIgnoreCase(EmailDirection.USCITA.getDirection()) ? EmailDirection.USCITA : EmailDirection.ENTRATA;
        Email email = new Email.Builder()
                .from(emailContent.getFrom())
                .emailDirection(emailDirection)
                .tipoEmail(ProtocolloUtils.getTipoEmail(MetodoSpedizione.Pec))
                .to(String.join(",", emailContent.getTo()))
                .cc(String.join(",", emailContent.getCc()))
                .oggetto(emailContent.getSubject())
                .corpo(emailContent.getBody())
                //TODO gestione logica settaggio utente
                .idUtente("0")
                .nomeUtente("Sistema")
                .tsInvio(emailContent.getTsInvio())
                .statoInvio(StatoInvio.INVIATO)
                .tsCreation(new Timestamp(System.currentTimeMillis()))
                .tsStartVali(new Timestamp(System.currentTimeMillis()))
                .impronta(this.generateImprontaEmail(emailContent, false, Optional.empty()))
                .messageId(emailContent.getMessageId())
                .build();

        try {

            email.persistAndFlush();
            if(emailDirection.getDirection().equalsIgnoreCase(EmailDirection.USCITA.getDirection())){
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                message.writeTo(outputStream);
                byte[] content = outputStream.toByteArray();

                Date dateInvioMail = email.getTsInvio() != null ? new Date(email.getTsInvio().getTime()) : new Date();
                String dataInvio = Objects.requireNonNull(it.parsec326.pi.intranet.utils.Utils.fromDateToString(dateInvioMail, it.parsec326.pi.intranet.utils.Utils.DateFormat.DMY_HMS_COMPACT));

                Allegato allegato = new Allegato();
                allegato.setIdEmail(email.getId());
                allegato.setTipoDocumento("eml_protocollo");
                allegato.setOggetto(email.getOggetto());
                allegato.setCollocazioneTelematica("");
                allegato.setIsMain(false);
                allegato.setNome("PEC-".concat(dataInvio).concat(".eml"));
                allegato.setEstensione(".eml");
                allegato.setDimensione(Long.valueOf(content.length));
                allegato.setImpronta(calculateImpronta(content));
                allegato.setTsCreation(Calendar.getInstance().getTime());

                File file = new File(String.format("%s", allegato.getEstensione()));
                String minioId = UUID.randomUUID().toString().replaceAll("-", "");
                String fileName = String.format("%s_%s%s", String.format("PEC-".concat(dataInvio)), minioId, allegato.getEstensione());
                String minioRef = String.format("%s/%s", protcoloBucketPath, InputUtils.normalizeFilenameInput(fileName));

                file.createNewFile();
                FileUtils.copyInputStreamToFile(new ByteArrayInputStream(content), file);

                minioFactory.uploadFileWithFilename("pi-docs", minioRef, file.getName());
                file.delete();
                allegato.setRiferimentoMinio(minioRef);

                allegato.persistAndFlush();
            }

            if(allegati != null && !allegati.isEmpty() && email.getId() != null){
                Map<String, Object> params = new HashMap<>();
                StringBuilder query = new StringBuilder("idEmail = :idEmail ");
                List<Long> idAllegati = allegati.stream().map(Allegato::getId).toList();

                params.put("idEmail",email.getId());
                updateAppendInClauseByLong(query, params, "id", idAllegati,"idAllegato");

                Allegato.update(String.valueOf(query),params);
            }
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);

        } catch (Exception e) {
            email.persist();
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
        }
    }

    @Transactional
    public void saveRecordEmail(EmailContentDTO emailContent, Protocollo protocollo, Boolean isHidden) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Email email = new Email.Builder()
                .protocollo(protocollo)
                .from(protocollo.getIndirizzoPecPeo())
                .emailDirection(EmailDirection.ENTRATA)
                .tipoEmail(ProtocolloUtils.getTipoEmail(protocollo.getMetodoSpedizione()))
                .to(String.join(",", emailContent.getTo()))
                .cc(String.join(",", emailContent.getCc()))
                .oggetto(emailContent.getSubject())
                .corpo(emailContent.getBody())
                .tsInvio(emailContent.getTsInvio())
                .statoInvio(StatoInvio.INVIATO)
                .idUtente(protocollo.getIdUtente())
                .tsCreation(new Timestamp(System.currentTimeMillis()))
                .tsStartVali(new Timestamp(System.currentTimeMillis()))
                .impronta(this.generateImprontaEmail(emailContent, false, Optional.empty()))
                .messageId(emailContent.getMessageId())
                .isHidden(isHidden)
                .build();

        try {
            email.persist();
            if(protocollo.getAllegati() != null && !protocollo.getAllegati().isEmpty() && email.getId() != null){
                Map<String, Object> params = new HashMap<>();
                StringBuilder query = new StringBuilder("idEmail = :idEmail ");
                List<Long> idAllegati = protocollo.getAllegati().stream().map(Allegato::getId).toList();

                params.put("idEmail",email.getId());
                updateAppendInClauseByLong(query, params, "id", idAllegati,"idAllegato");

                Allegato.update(String.valueOf(query),params);
            }
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        } catch (Exception e) {
            email.persist();
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
        }
    }

    @Transactional
    public boolean sendNotificaProtocolloPecPeo(NotificaProtocolloPecPeoInput input){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if(input.getTipologia() == null){
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "La tipologia di inviop PEC/PEO non puo' essere null").boom();
        }

        Protocollo protocollo = Protocollo.findById(input.getIdProtocollo());
        log.info("[sendNotificaProtocolloPecPeo] - Invio del protocollo: {} tramite: {} ",protocollo.getNProtocollo(), input.getTipologia());

        List<Allegato> allegati = new ArrayList<>();
        if(input.getAllegati() != null && !input.getAllegati().isEmpty()){
            allegati = protocollo.getAllegati().stream().filter(a -> input.getAllegati().contains(a.getId())).toList();
        }
        /* allegati = em.createNamedQuery("findAllegatiByIdAndIdProtocollo", Allegato.class)
                .setParameter("ids", input.getAllegati())
                .setParameter("idProtocollo", protocollo.getId())
                .getResultList();*/

        List<Email> emails = new ArrayList<>();
        List<String> destinatari = new ArrayList<>();
        List<String> copia = new ArrayList<>();

        if(input.getDestinatariCompetenza() == null || input.getDestinatariCompetenza().isEmpty()){
            throw new IllegalArgumentException("La lista dei destinatari non puo' essere vuota");
        }

        input.getDestinatariCompetenza().forEach(dto -> {
            try {
                Anagrafica anagrafica;
                if(dto.getTipo().contains("anagrafica") || dto.getTipo().contains("interna")) {
                    anagrafica = Anagrafica.findById(dto.getIdDestinatario());
                }else {
                    IpaResponseDTO ipaResponseDTO = dto.getIpaResponseDTO();
                    anagrafica = protocolloService.maptoAnagrafica(ipaResponseDTO.getTipologiaIpaResponse().toString(), ipaResponseDTO.getCodAmm(), ipaResponseDTO.getCodAOO(), ipaResponseDTO.getCodUniOU());
                }
                if(input.getTipologia().equalsIgnoreCase("pec")){
                    String contatto = input.destinatariCompetenzaUsePeoInsteadOfPec != null && input.destinatariCompetenzaUsePeoInsteadOfPec.contains(dto.getIdDestinatario()) ? anagrafica.getEmail() : anagrafica.getPecToUseForRecipient();
                    if(contatto == null || contatto.isEmpty()){
                        CustomException.get(CustomException.ErrorCode.INTERNAL,
                                String.format("Non è presente nessun indirizzo(pec/peo) per il contatto: %s", anagrafica.getRagioneSociale())).boom();
                    }
                    destinatari.add(contatto);
                }else {
                    String peo = anagrafica.getEmail();
                    if(peo == null || peo.isEmpty()){
                        CustomException.get(CustomException.ErrorCode.INTERNAL,
                                String.format("Il contatto: %s, non presenta l'indirizzo email ", anagrafica.getRagioneSociale())).boom();
                    }
                    destinatari.add(peo);
                }
            }catch (Exception e){
                log.error("[sendNotificaProtocolloPecPeo] - Errore durante l'elaborazione dei destinatari per competenza nell'invio tramite PEC del protocollo: {}", protocollo.getNProtocollo(), e);
                CustomException.get(CustomException.ErrorCode.INTERNAL,
                        "Errore durante l'elaborazione dei destinatari (TO) in fase di invio. {}", e.getMessage()).boom();
            }
        });

        if(input.getDestinatariConoscenza() != null && !input.getDestinatariConoscenza().isEmpty()){
            input.getDestinatariConoscenza().forEach(dto -> {
                try {
                    Anagrafica anagrafica;
                    if(dto.getTipo().contains("anagrafica") || dto.getTipo().contains("interna")) {
                        anagrafica = Anagrafica.findById(dto.getIdDestinatario());
                    }else {
                        IpaResponseDTO ipaResponseDTO = dto.getIpaResponseDTO();
                        anagrafica = protocolloService.maptoAnagrafica(ipaResponseDTO.getTipologiaIpaResponse().toString(), ipaResponseDTO.getCodAmm(), ipaResponseDTO.getCodAOO(), ipaResponseDTO.getCodUniOU());
                    }
                    if(input.getTipologia().equalsIgnoreCase("pec")){
                        String contatto = input.destinatariConoscenzaUsePeoInsteadOfPec != null && input.destinatariConoscenzaUsePeoInsteadOfPec.contains(dto.getIdDestinatario()) ? anagrafica.getEmail() : anagrafica.getPecToUseForRecipient();
                        if(contatto == null || contatto.isEmpty()){
                            CustomException.get(CustomException.ErrorCode.INTERNAL,
                                    String.format("Non è presente nessun indirizzo(pec/peo) per il contatto: %s", anagrafica.getRagioneSociale())).boom();
                        }
                        copia.add(contatto);
                    }else {
                        String peo = anagrafica.getEmail();
                        if(peo == null || peo.isEmpty()){
                            CustomException.get(CustomException.ErrorCode.INTERNAL,
                                    String.format("Il contatto: %s, non presenta l'indirizzo email ", anagrafica.getRagioneSociale())).boom();
                        }
                        copia.add(peo);
                    }
                }catch (Exception e){
                    log.error("[sendNotificaProtocolloPecPeo] - Errore durante l'elaborazione dei destinatari per conoscenza nell'invio tramite PEO del protocollo: {}", protocollo.getNProtocollo(), e);
                    CustomException.get(CustomException.ErrorCode.INTERNAL,
                            "Errore durante l'elaborazione dei destinatari (TO) in fase di invio. {}", e.getMessage()).boom();
                }
            });
        }


        if(!input.getMultiplo()){
            String tempTo = String.join(",", destinatari);
            destinatari.clear();
            destinatari.add(tempTo);
        }


        String tipoEmail = ProtocolloUtils.getTipoEmail(input.getTipologia().equalsIgnoreCase("pec") ? MetodoSpedizione.Pec : MetodoSpedizione.Email);
        for(String to : destinatari){
            Email email = new Email.Builder()
                    .protocollo(protocollo)
                    .from(input.getFrom())
                    .emailDirection(EmailDirection.USCITA)
                    .tipoEmail(tipoEmail)
                    .to(to)
                    .cc(String.join(",", copia))
                    .oggetto(input.getOggetto())
                    .corpo(input.getCorpo() != null ? input.getCorpo() : " ")
                    .allegati(!allegati.isEmpty() ? allegati : null)
                    .notificaProtocollo(true)
                    .statoInvio(StatoInvio.DA_INVIARE)
                    .tsCreation(new Timestamp(System.currentTimeMillis()))
                    .tsStartVali(new Timestamp(System.currentTimeMillis()))
                    .idUtente(ssoManager.extractIdFromToken())
                    .nomeUtente(ssoManager.extractNameFromToken())
                    .build();

            emails.add(email);
        }

        List<Long> emailIds = emails.stream()
                .map(email -> {
                    try {
                        email.persistAndFlush();
                        return email.getId();
                    } catch (Exception e) {
                        LogUtils.exiting(LogUtils.LogLevel.ERROR);
                        throw new RuntimeException("Errore durante il processo di notifica Protocollo", e);
                    }
                })
                .toList();

        // si inviano in blocco tutte le pec/peo per garantire il contesto delle transactions
        sendEmailClient.sendEmails(emailIds);

        log.info("[sendNotificaProtocolloPecPeo] - L 'invio del protocollo: {} tramite: {} e' stato processato con successo ed i messaggi sono stati mandti sul topic [EMAIL]'",protocollo.getNProtocollo(), input.getTipologia());

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }

    public void updateAllegatoSetIdEmail(List<Allegato> allegati, Long idEmail) {
        try {
            for (Allegato allegato : allegati) {
                em.createNamedQuery("updateIdEmailById")
                        .setParameter("idEmail", idEmail)
                        .setParameter("idAllegato", allegato.getId())
                        .executeUpdate();
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore durante l'aggiornamento degli allegati", e);
        }
    }

    @ExceptionChecked
    public EmailOutputDTO getEmail(RicercaEmailDTO dto) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        Objects.requireNonNull(dto, "Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

        PanacheQuery<Email> query = getEmailQuery(dto);
        List<Email> email = query.page(Page.of(dto.getPage(), dto.getSize())).list();
        long totalResults = query.count();
        EmailOutputDTO outputDTO = new EmailOutputDTO(email, getPagesCount(totalResults, dto.getSize()), totalResults);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return outputDTO;
    }
    /**
     * Servizio che costruisce la query di ricerca per le email e ritorna la lista
     * accetta i parametri passati dai filtri, ritornando una lista di email
     * Il metodo ritorna una lista con tutte le email o meno in base ai parametri valorizzati
     * @param ricercaEmailDTO - conterrà tutti i parametri in input che vengono dai filtri, incluse (ricerca globale, sort, paginazione)
     * @return
     */
    public PanacheQuery<Email> getEmailQuery(RicercaEmailDTO ricercaEmailDTO){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        // SORT
        Sort sortCriteria = SortInput.getSortOrDefault(ricercaEmailDTO.hasSort() ? ricercaEmailDTO.getSort() : ricercaEmailDTO.getDefaultSort());
        Map<String, Object> params = new HashMap<>();

        StringBuilder query = new StringBuilder("FROM Email e ");
        query.append("LEFT JOIN e.protocollo p LEFT JOIN ProtocolliClassificazione pc ON p.id = pc.protocollo.id ");
        if (ssoManager.isUtenteAdmin()){
            query.append("WHERE e.isHidden IS NOT TRUE ");
        }else{
            List<Long> allTitolarioAccessibileIdList = titolarioService.getAllVisibleTitolarioIdByUserAndCdrCode(ricercaEmailDTO.getSelectedCdr());
            query.append("WHERE e.isHidden IS NOT TRUE ")
                    .append("AND ( (pc.id IS NOT NULL AND pc.idTitolario IN ("+StringUtils.join(allTitolarioAccessibileIdList, ", ")+")) ")
                    .append("OR (pc.id IS NULL)) ");

            //params.put("titolariAccessibili", allTitolarioAccessibileIdList);
        }

        if(ricercaEmailDTO.hasSearch()){
            query.append("and (:search = '' ")
                    .append("or lower(e.from) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(e.to) like LOWER(concat('%', :search, '%')) ")
                    //.append("or lower(cc) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(p.nProtocollo) like LOWER(concat('%', :search, '%')) ")
                    .append("or lower(e.oggetto) like LOWER(concat('%', :search, '%')) )");
            params.put("search", ricercaEmailDTO.getSearch().trim());
        }

        if (ricercaEmailDTO.hasIndirizzoEmail()) {
            query.append("and (");
            for (int i = 0; i < ricercaEmailDTO.getIndirizziEmail().size(); i++) {
                String indirizzoEmail = ricercaEmailDTO.getIndirizziEmail().get(i).trim();
                String paramName = "indirizzoMail" + i;

                if (ricercaEmailDTO.getMostraNonLavorate()!= null && ricercaEmailDTO.getMostraNonLavorate() && ricercaEmailDTO.getSelectedCdr() != null && (!ricercaEmailDTO.getSelectedCdr().isEmpty())) {
                    query.append("e.id NOT IN (SELECT po.email.id FROM PecOperation po WHERE po.cdrCode in :cdrCodes AND (")
                            .append("lower(po.email.from) LIKE LOWER(concat('%', :").append(paramName).append(", '%')) ").append(" OR ")
                            .append("lower(po.email.to) LIKE LOWER(concat('%', :").append(paramName).append(", '%')) ").append(" OR ")
                            .append("lower(po.email.cc) LIKE LOWER(concat('%', :").append(paramName).append(", '%')) ").append(") ) AND ");
                    params.put("cdrCodes", ssoManager.getRelatedCdrCodes(ricercaEmailDTO.getSelectedCdr()));
                }

                query.append("(lower(e.from) LIKE LOWER(concat('%', :").append(paramName).append(", '%')) ")
                        .append("OR lower(e.to) LIKE LOWER(concat('%', :").append(paramName).append(", '%')) ")
                        .append("OR lower(e.cc) LIKE LOWER(concat('%', :").append(paramName).append(", '%'))) ");

                params.put(paramName, indirizzoEmail);

                if (i < ricercaEmailDTO.getIndirizziEmail().size() - 1) {
                    query.append(" OR ");
                }
            }
            query.append(") ");
        }
        else {
            query.append("and 1=0 ");
            return Email.find(query.toString(), sortCriteria, params);
        }

        if (ricercaEmailDTO.hasStatoProtocollazione() && !ricercaEmailDTO.hasBothFiltriStatoProtocollazione()){
            if(ricercaEmailDTO.getStatoProtocollazione().contains(StatoProtocollazioneEmail.PROTOCOLLATO.getStato())){
                query.append("and p IS NOT NULL ");
            }
            if(ricercaEmailDTO.getStatoProtocollazione().contains(StatoProtocollazioneEmail.NON_PROTOCOLLATO.getStato())){
                query.append("and p IS NULL ");
            }
        }

        if (ricercaEmailDTO.hasStatoInvio()){
            query.append("and e.statoInvio in :statoInvioList ");
            params.put("statoInvioList", ricercaEmailDTO.getStatoInvio());
        }

        if (ricercaEmailDTO.hasEmailDirection()){
            query.append("and e.emailDirection in :emailDirectionList ");
            params.put("emailDirectionList", ricercaEmailDTO.getEmailDirection());
        }

        if (ricercaEmailDTO.hasTIpoEmail()){
            query.append("and e.tipoEmail in :tipoEmailList ");
            params.put("tipoEmailList", ricercaEmailDTO.getTipoEmail());
        }

        if (ricercaEmailDTO.getIsAssegnato() != null) {
            if (Boolean.TRUE.equals(ricercaEmailDTO.getIsAssegnato())){
                query.append("and p.assegnatari <> '' ");
            } else {
                query.append("and p.assegnatari = '' ");
            }
        }

        if (ricercaEmailDTO.getIsClassificato() != null) {
            if (Boolean.TRUE.equals(ricercaEmailDTO.getIsClassificato())){
                query.append("and (pc.id IS NOT NULL OR pc.id > 0) ");
                //query.append("and (e.classificazione IS NOT NULL OR e.classificazione <> '') ");
            } else {
                query.append("and (pc.id IS NULL OR pc.id <= 0) ");
                //query.append("and (e.classificazione IS NULL OR e.classificazione = '') ");
            }
        }

        // aggiunta filtro per intervallo temporale
        if (ricercaEmailDTO.hasDataInvioIntervallo()) {
            query.append("and e.tsInvio BETWEEN :dataCreazioneFrom AND :dataCreazioneTo ");
            params.put("dataCreazioneFrom", ricercaEmailDTO.getDataInvioFrom());
            params.put("dataCreazioneTo", ricercaEmailDTO.getDataInvioTo());
        }
        else if (ricercaEmailDTO.getDataInvioFrom() != null) {
            query.append("and e.tsInvio >= :dataCreazioneFrom ");
            params.put("dataCreazioneFrom", ricercaEmailDTO.getDataInvioFrom());
        }
        else if (ricercaEmailDTO.getDataInvioTo() != null) {
            query.append("and e.tsInvio <= :dataCreazioneTo ");
            params.put("dataCreazioneTo", ricercaEmailDTO.getDataInvioTo());
        }

        log.info("[getEmailQuery] - Params = {}", params);
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return Email.find(query.toString(), sortCriteria, params);
    }

    /**
     * Aggiunge gli header per la PEC, se si sta inviando una PEC.
     * @param protocollo
     * @param message
     * @param emailConfiguration
     * @throws MessagingException
     */
    public void setHeadersForPec(Protocollo protocollo, Message message, EmailConfigurationDTO emailConfiguration) throws MessagingException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if (ProtocolloUtils.isPec(protocollo.getMetodoSpedizione())) {
            setHeader(message, emailConfiguration);
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }

    public void setHeader(Message message, EmailConfigurationDTO emailConfigurationDTO) throws MessagingException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        message.setHeader("Disposition-Notification-To", "SMTP:" + emailConfigurationDTO.getUsername());
        message.setHeader("X-Priority", "1");
        message.setHeader("X-Mailer", "Microsoft Outlook Express 6.00.2900.2869");
        message.setHeader("Importance", "High");
        message.setHeader("X-MimeOLE", "Produced By Microsoft MimeOLE V6.00.2900.2869");
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }

    /**
     * Aggiunge gli allegati alla mail.
     * @param emailContent
     * @param message
     * @throws MessagingException
     */
    public void setAttachments(EmailContentDTO emailContent, Message message) throws MessagingException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        // Aggiungo gli allegati se presenti
        if (emailContent.getAttachments() != null && !emailContent.getAttachments().isEmpty()) {
            // Crea una parte multipart per contenere il corpo del messaggio e gli allegati
            Multipart multipart = new MimeMultipart();

            // Aggiungi la parte del testo del messaggio
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText(emailContent.getBody());
            multipart.addBodyPart(textPart);

            // Aggiungi gli allegati, se specificati
            for (AttachmentDTO attachment : emailContent.getAttachments()) {
                multipart.addBodyPart(createAttachment(attachment));
            }

            // Imposta la parte multipart come contenuto del messaggio
            message.setContent(multipart);
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }

    /**
     * Restituisce il messaggio da inviare data la sessione, la configurazione e il contenuto della mail.
     * @param session
     * @param emailConfiguration
     * @param emailContent
     * @return
     * @throws MessagingException
     */
    @NotNull
    public Message getMessage(Session session, EmailConfigurationDTO emailConfiguration, EmailContentDTO emailContent) throws MessagingException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(emailConfiguration.getUsername()));
        message.setSubject(emailContent.getSubject());
        message.setText(emailContent.getBody());
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return message;
    }

    /**
     * Restituisce la sessione per la mail date le props e la configurazione.
     * @param props
     * @param emailConfiguration
     * @return
     */
    @NotNull
    public Session getSession(Properties props, EmailConfigurationDTO emailConfiguration) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(emailConfiguration.getUsername(), emailConfiguration.getPassword());
            }
        });
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return session;
    }

    /**
     * Restituisce le properties della mail data la configurazione in innput.
     * @param emailConfiguration
     * @return
     */
    @NotNull
    public Properties getProperties(EmailConfigurationDTO emailConfiguration) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        Properties props = new Properties();
        props.put("mail.smtp.host", emailConfiguration.getHost());
        props.put("mail.smtp.port", emailConfiguration.getPort());
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        if(emailConfiguration.getHost().toLowerCase().contains("smtps")){
            props.put("mail.smtp.ssl.enable", "true");
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return props;
    }

    /**
     * Verifica se la configurazione e il contenuto della mail siano validi.
     * @param emailConfiguration
     * @param emailContent
     */
    public void checkEmailInputValidity(EmailConfigurationDTO emailConfiguration, EmailContentDTO emailContent, boolean isNotifica) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        List<String> errors = new ArrayList<>();
        collectConfigurationErrors(emailConfiguration, errors);
        collectContentErrors(emailContent, errors, isNotifica);
        if (!errors.isEmpty()) throw new IllegalArgumentException("Parametri obbligatori per l'invio PEC/PEOin " + LogUtils.getCallerInfo() + ": " + String.join(",", errors));
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }

    /**
     * Costruisce la lista degli errori eventuali presenti all'interno della configurazione della mail.
     * @param emailConfiguration
     * @param errors
     */
    public void collectConfigurationErrors(EmailConfigurationDTO emailConfiguration, List<String> errors) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if (emailConfiguration == null) {
            errors.add("emailConfiguration");
            return;
        }
        if (Utils.isNullOrEmpty(emailConfiguration.getHost())) errors.add("emailConfiguration.host");
        if (Utils.isNullOrEmpty(emailConfiguration.getPort())) errors.add("emailConfiguration.port");
        if (Utils.isNullOrEmpty(emailConfiguration.getUsername())) errors.add("emailConfiguration.username");
        //if (Utils.isNullOrEmpty(emailConfiguration.getPassword())) errors.add("emailConfiguration.password");
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }

    /**
     * Costruisce la lista degli errori eventuali presenti all'interno del contenuto della mail.
     * @param emailContent
     * @param errors
     */
    public void collectContentErrors(EmailContentDTO emailContent, List<String> errors, boolean isNotifica) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if (emailContent == null) {
            errors.add("emailContent");
            return;
        }
        if (emailContent.getTo() == null || emailContent.getTo().isEmpty()) errors.add("emailContent.to");
        if (Utils.isNullOrEmpty(emailContent.getSubject())) errors.add("emailContent.subject");
        if (!isNotifica && Utils.isNullOrEmpty(emailContent.getBody())) errors.add("emailContent.body");
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }

    /**
     * Costruisce la configurazione della mail a partire dal protocollo.
     * @param metodoSpedizione
     * @param from
     * @return
     * @throws Exception
     */
    public EmailConfigurationDTO buildEmailConfiguration(MetodoSpedizione metodoSpedizione, String from) throws Exception {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        String peTipo = ProtocolloUtils.getTipoEmail(metodoSpedizione);
        if (peTipo == null || peTipo.isEmpty())
            throw new IllegalArgumentException("Parametro peTipo non presente in " + LogUtils.getCallerInfo());

        PecPeo pecPeo = pecPeoService.getPecPeoByEmail(from);
        if (pecPeo == null)
            throw new IllegalArgumentException("Configurazione di posta non trovata per la mail: " + from);

        PeConfigurazione peConfigurazione = pecPeo.getConfigurazione();
        if (peConfigurazione == null)
            throw new IllegalArgumentException("Parametro peConfigurazione non presente in " + LogUtils.getCallerInfo());

        String pecPeoPassword = null;
        boolean isPec = peConfigurazione.getTipologiaPosta().equals(TipologiaPosta.PEC);

        // il sistema prevede l'utilizzo di PEO senza password, quindi si evita di lanciare 'getPasswordDecrypted' che lancerebbe una eccezione
        if (peConfigurazione.getTipologiaPosta().equals(TipologiaPosta.PEC) ||
                (pecPeo.getPassword() != null && !pecPeo.getPassword().isEmpty())) {
            pecPeoPassword = pecPeo.getPasswordDecrypted();
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return EmailConfigurationDTO.builder()
                .host(peConfigurazione.getSmtpHost())
                .port(String.valueOf(peConfigurazione.getSmtpPort()))
                .imapHost(peConfigurazione.getImapHost())
                .imapPort(String.valueOf(peConfigurazione.getImapPort()))
                .username(pecPeo.getIndirizzoEmail())
                .password(pecPeoPassword == null ? "" : pecPeoPassword)
                .isPec(isPec)
                .saveToSent(pecPeo.isSaveToSent())
                .build();
    }

    /**
     * Costruisce il contenuto della mail a partire dal protocollo.
     * @param protocollo
     * @return
     * @throws IOException
     */
    @Transactional
    public EmailContentDTO buildEmailContent(Protocollo protocollo, Map<String, Boolean> setReferentiToUsePeo) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (protocollo == null)
            throw new IllegalArgumentException("Parametro protocollo obbligatorio in " + LogUtils.getCallerInfo());

        EmailContentDTO.EmailContentDTOBuilder builder = EmailContentDTO.builder()
                .subject(protocollo.getNProtocollo() + " - " + protocollo.getOggetto())
                .body(protocollo.getCorpoPecPeo());

        List<ReferentiProtocollo> referenti = ReferentiProtocollo.find("idProtocollo", protocollo.getId()).list();

        List<String> assegnatari = new ArrayList<>();
        if (protocollo.getTipoRegistrazione() == TipoRegistrazione.Uscita) {

            List<String> idReferentiToAnagrafica = referenti.stream()
                    .filter(r -> r.getAttribuzione().equalsIgnoreCase("competenza") && (r.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.ANAGRAFICA_INTERNA.getNome())))
                    .map(ReferentiProtocollo::getIdDestinatario)
                    .toList();

            List<String> idReferentiCcAnagrafica = referenti.stream()
                    .filter(r -> r.getAttribuzione().equalsIgnoreCase("conoscenza") && (r.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.ANAGRAFICA_INTERNA.getNome())))
                    .map(ReferentiProtocollo::getIdDestinatario)
                    .toList();

            List<Anagrafica> listaEmail = em.createNamedQuery("findAllAnagrafica", Anagrafica.class)
                    .setParameter("id", Stream.concat(idReferentiToAnagrafica.stream(), idReferentiCcAnagrafica.stream()).toList())
                    .getResultList();

            boolean isEmail = protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Email);

            // Definisci come estrarre il contatto e il messaggio di errore in base al metodo di spedizione
            Function<Anagrafica, String> getContact = isEmail ? Anagrafica::getEmail : Anagrafica::getPecToUseForRecipient;

            for (Anagrafica pecPeo : listaEmail) {
                boolean mustUsePeo = setReferentiToUsePeo != null && Boolean.TRUE.equals(setReferentiToUsePeo.get(pecPeo.getId().toString()));

                String contact = mustUsePeo ? pecPeo.getEmail() : getContact.apply(pecPeo);
                if (contact != null && !contact.isEmpty()) {
                    String contactIdStr = pecPeo.getId().toString();
                    if (idReferentiToAnagrafica.contains(contactIdStr)) {
                        assegnatari.add(contact + ":TO");
                    }
                    if (idReferentiCcAnagrafica.contains(contactIdStr)) {
                        assegnatari.add(contact + ":CC");
                    }
                } else {
                    String errorMessage = String.format("%s%s non presenta %s",
                            "Errore nella selezione dei destinatari, contatto anagrafica: ",
                            pecPeo.getRagioneSociale(),
                            isEmail ? "email" : "pec");
                    CustomException.get(CustomException.ErrorCode.INTERNAL, errorMessage).boom();

                }
            }
        }
        else {
            List<String> idReferentiToOrganigrammaUtenti = referenti.stream()
                    .filter(r -> r.getAttribuzione().equalsIgnoreCase("competenza") && (r.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UTENTE.getNome()) ))
                    .map(ReferentiProtocollo::getIdDestinatario)
                    .toList();

            List<String> idReferentiCcOrganigrammaUtenti = referenti.stream()
                    .filter(r -> r.getAttribuzione().equalsIgnoreCase("conoscenza") && (r.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UTENTE.getNome()) ))
                    .map(ReferentiProtocollo::getIdDestinatario)
                    .toList();

            List<String> idReferentiToOrganigrammaUffici = referenti.stream()
                    .filter(r -> r.getAttribuzione().equalsIgnoreCase("competenza") && (r.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome()) ))
                    .map(ReferentiProtocollo::getIdDestinatario)
                    .toList();

            List<String> idReferentiCcOrganigrammaUffici = referenti.stream()
                    .filter(r -> r.getAttribuzione().equalsIgnoreCase("conoscenza") && (r.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome()) ))
                    .map(ReferentiProtocollo::getIdDestinatario)
                    .toList();

            List<PecPeo> listaEmail = em.createNamedQuery("findAllPecPeoForUsers", PecPeo.class)
                    .setParameter("idUtente", Stream.concat(idReferentiToOrganigrammaUtenti.stream(), idReferentiCcOrganigrammaUtenti.stream()).toList())
                    .setParameter("cdrCode", Stream.concat(idReferentiToOrganigrammaUffici.stream(), idReferentiCcOrganigrammaUffici.stream()).toList())
                    .getResultList();
            //TODO: controllare se peconfigurazione è stato correttamente caricato dalla query
            for(PecPeo pecPeo : listaEmail) {
                String mailToUse = null;
                if (
                        (protocollo.getMetodoSpedizione() == MetodoSpedizione.Pec && pecPeo.getConfigurazione().getTipologiaPosta() == TipologiaPosta.PEC)
                    ||  (protocollo.getMetodoSpedizione() == MetodoSpedizione.Email && pecPeo.getConfigurazione().getTipologiaPosta() == TipologiaPosta.PEO)
                ) {
                    mailToUse = pecPeo.getIndirizzoEmail();
                }
                if (mailToUse == null)
                    continue;

                if (pecPeo.getIdUtente() != null) {
                    if (idReferentiToOrganigrammaUtenti.contains(pecPeo.getIdUtente()))
                        assegnatari.add(pecPeo.getIndirizzoEmail().concat(":TO"));
                    if (idReferentiCcOrganigrammaUtenti.contains(pecPeo.getIdUtente()))
                        assegnatari.add(pecPeo.getIndirizzoEmail().concat(":CC"));
                }
                else {
                    for(Ufficio cdr : pecPeo.getUffici()){
                        if (idReferentiToOrganigrammaUffici.contains(cdr.getCdrCode()))
                            assegnatari.add(pecPeo.getIndirizzoEmail().concat(":TO"));
                        if (idReferentiCcOrganigrammaUffici.contains(cdr.getCdrCode()))
                            assegnatari.add(pecPeo.getIndirizzoEmail().concat(":CC"));
                    }

                }
            }
        }

        // Aggiungi i TO e i CC
        //List<String> assegnatari = Arrays.asList(protocollo.getIdAssegnatari().split(","));

        if(assegnatari.isEmpty())
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella selezione dei destinatari").boom();

        assegnatari.stream().forEach(ass -> {
            if (ass == null)
                throw new IllegalArgumentException("Assegnatario non presente in " + LogUtils.getCallerInfo());

            String email = ass.split(":")[0];
            if (email == null)
                throw new IllegalArgumentException("Email assegnatario non presente in " + LogUtils.getCallerInfo());

            String tipoDestinazione = ass.split(":")[1];
            if (tipoDestinazione == null)
                throw new IllegalArgumentException("Tipo destinazione non presente in " + LogUtils.getCallerInfo());

            if (tipoDestinazione.equals("TO"))
                builder.to(email);
            else if (tipoDestinazione.equals("CC"))
                builder.cc(email);
            else
                throw new IllegalArgumentException("Tipo destinazione non ricosciuto in " + LogUtils.getCallerInfo());
        });

        // Aggiunge gli allegati
        if (protocollo.getAllegati() != null) {
            List<Allegato> allegatiDaInviare = new ArrayList<>();
            for (Allegato allegatoProtocollo : protocollo.getAllegati()) {

                // se discarded -> continue
                if (allegatoProtocollo.getDiscarded())
                    continue;

                // se eml ed è stato allegato dal sistema -> continue
                if ( allegatoProtocollo.getEstensione().equalsIgnoreCase(".eml") && (allegatoProtocollo.getIdUtente() == null || allegatoProtocollo.getIdUtente().isEmpty()) ) {
                    continue;
                }

                allegatiDaInviare.add(allegatoProtocollo);
            }

            List<AttachmentDTO> allegati = allegatoService.buildAttachmentsForEmail(allegatiDaInviare);
            for (AttachmentDTO allegato : allegati) {
                builder.attachment(allegato);
            }
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return builder.build();
    }


    @Transactional
    public EmailContentDTO buildEmailContentRispondiInoltra(Email email) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        EmailContentDTO.EmailContentDTOBuilder builder = EmailContentDTO.builder()
                .subject(email.getProtocollo().getNProtocollo() + " - " + email.getOggetto())
                .body(email.getCorpo());

        Arrays.stream(email.getTo().split(",")).forEach(to -> builder.to(to));
        if(email.getCc() != null && !email.getCc().isEmpty()) {
            Arrays.stream(email.getCc().split(",")).forEach(cc -> builder.cc(cc));
        }

        if (email.getAllegati() != null) {
            List<AttachmentDTO> allegati = allegatoService.buildAttachmentsForEmail(email.getAllegati());
            allegati.forEach(builder::attachment);
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return builder.build();
    }


    public String generateImprontaEmail(EmailContentDTO emailContentDTO, boolean isMultiplo, Optional<String> to) {
        if (emailContentDTO == null) {
            throw new IllegalArgumentException("EmailContentDTO cannot be null.");
        }
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        StringBuilder shaBuilder = new StringBuilder();
        shaBuilder.append(emailContentDTO.getFrom());

        try {
            String joinedTO = "";
            String joinedCC = "";

            if (emailContentDTO.getTo() != null) {
                if(isMultiplo && to.isPresent()){
                    joinedTO = to.get();
                }else {
                    if(emailContentDTO.getTo().size() > 1){
                        Collections.sort(emailContentDTO.getTo());
                    }
                    joinedTO = String.join(",", emailContentDTO.getTo());
                }

            }
            shaBuilder.append(joinedTO);

            if (emailContentDTO.getCc() != null && !emailContentDTO.getCc().isEmpty()) {
                if(emailContentDTO.getCc().size() > 1){
                    Collections.sort(emailContentDTO.getCc());
                }
                joinedCC = String.join(",", emailContentDTO.getCc());
                shaBuilder.append(joinedCC);
            }

            shaBuilder.append(emailContentDTO.getSubject());
            shaBuilder.append(emailContentDTO.getBody());

            if (emailContentDTO.getAttachments() != null && !emailContentDTO.getAttachments().isEmpty()) {
                for (AttachmentDTO attachmentDTO : emailContentDTO.getAttachments()) {
                    if (!attachmentDTO.isExcludeFromImpronta()) {
                        shaBuilder.append(DigestUtils.sha256Hex(attachmentDTO.getContent()));
                    }
                }
            }

            String sha256Result = DigestUtils.sha256Hex(shaBuilder.toString());
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return sha256Result;

        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            throw new RuntimeException("Errore nella gererazione dell'impronta dell'email", e);
        }
    }

    @Transactional
    public boolean checkImprontaEmailOnDB(EmailContentDTO emailContentDTO){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try {
            String impronta = generateImprontaEmail(emailContentDTO, false, Optional.empty());
            return Email.find("impronta", impronta).firstResult() != null;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            log.error("Errore nel controllo dell'impronta nel database", e);
            return false;
        }
    }

    public MimeBodyPart createAttachment(AttachmentDTO attachment) throws MessagingException {
        MimeBodyPart attachmentPart = new MimeBodyPart();
        attachmentPart.setDataHandler(new DataHandler(new ByteArrayDataSource(attachment.getContent(),attachment.getType())));
        attachmentPart.setFileName(attachment.getName());
        return attachmentPart;
    }

    @Transactional
    public Email getFromMessageId(String messageId) {
            return  em.createNamedQuery("getFrommessageId", Email.class)
                    .setParameter("messageId", messageId)
                    .getResultList().stream().findFirst().orElse(null);
    }


    public Email getLastEmailRead(String tipo, String from) {

        Sort sort = Sort.by("tsInvio").descending();
        Map<String, Object> params = new HashMap<>();
        params.put("tipoEmail", tipo);
        params.put("direction", EmailDirection.ENTRATA);
        params.put("to", "%"+from+"%");

        return (Email)Email.find("where tipoEmail = :tipoEmail AND emailDirection = :direction AND to LIKE :to", sort, params)
                .page(0, 1)
                .firstResultOptional()
                .orElse(null);
    }

    public List<Long> getIdEmailsAfter15Minutes(){
        Timestamp timestampLimite = Timestamp.from(Instant.now().minus(Duration.ofMinutes(15)));
        return em.createNamedQuery("findEmailDaInviareDaAlmeno15Minuti", Long.class)
                .setParameter("timestampLimite", timestampLimite)
                .setMaxResults(20)
                .getResultList();
    }

    @Transactional
    public void setClassificazioneEmail(Long protocolloId){
        try{
            List<Email> emailListFromProtocollo = Email.find("protocollo.id",protocolloId).list();
            for(Email emailFromProtcollo : emailListFromProtocollo) {
                emailFromProtcollo.setClassificazione("Sì");
                emailFromProtcollo.persist();
            }
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore imprevisto durante la classificazione").boom();
        }
    }

    private boolean validateEmailSendability(Protocollo protocollo, String idEmail) {
        Set<MetodoSpedizione> METODI_SPEDIZIONE_VALIDI = EnumSet.of(MetodoSpedizione.Pec, MetodoSpedizione.Email);

        if (protocollo.getTipoRegistrazione() != TipoRegistrazione.Uscita) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Email con ID {} non può essere inviata: il tipo di registrazione non è 'USCITA'", idEmail).boom();

            return false;
        }

        if (!METODI_SPEDIZIONE_VALIDI.contains(protocollo.getMetodoSpedizione())) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Email con ID {} non può essere inviata: metodo di spedizione: {} - non supportato",
                    idEmail, protocollo.getMetodoSpedizione()).boom();

            return false;
        }

        return true;

    }
    
    @Override
    public PanacheQuery<Email> getFindAllQuery(String search, SortInput sort) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }

    @Override
    public PanacheQuery<Email> getFindByIdQuery(Long id) {
        throw new NotImplementedException("Funzione " + LogUtils.getCallerInfo() + " non implementata!");
    }

    public void sendEmailToQueue(Long idEmail) {
        sendEmailClient.sendEmail(idEmail);
    }

    public long countPecs(String indirizzoEmail, LocalDateTime from, LocalDateTime to, boolean checkMittente) {

        Map<String, Object> params = new HashMap<>();
        params.put("tipoEmail", TipologiaPosta.PEC.getTipologiaPosta());
        params.put("statoInvio", StatoInvio.INVIATO);
        params.put("indirizzoMail", "%"+indirizzoEmail.toLowerCase()+"%");
        params.put("emailDirection", checkMittente ? EmailDirection.USCITA : EmailDirection.ENTRATA);
        params.put("dataCreazioneFrom", from);
        params.put("dataCreazioneTo", to);

        StringBuilder query = new StringBuilder("FROM Email e WHERE e.tipoEmail = :tipoEmail ");
        query.append("AND e.statoInvio = :statoInvio ");
        query.append("AND e.emailDirection = :emailDirection ");

        if (checkMittente) {
            query.append("AND lower(e.from) LIKE :indirizzoMail ");
        }
        else {
            query.append("AND ( lower(e.to) LIKE :indirizzoMail OR lower(e.cc) LIKE :indirizzoMail) ");
        }

        query.append("AND e.tsInvio BETWEEN :dataCreazioneFrom AND :dataCreazioneTo");


        log.info("[countPecs] - Params = {}", params);
        return Email.find(query.toString(), params).count();
    }
}