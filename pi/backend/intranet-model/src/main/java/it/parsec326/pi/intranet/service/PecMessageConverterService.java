package it.parsec326.pi.intranet.service;

import io.quarkus.narayana.jta.runtime.TransactionConfiguration;
import it.parsec326.pi.intranet.dto.input.segnatura.RiferimentoProtocolloSegnaturaDTO;
import it.parsec326.pi.intranet.dto.mail.AttachmentDTO;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import it.parsec326.pi.intranet.dto.mail.RicevutaPECDTO;
import it.parsec326.pi.intranet.model.AttachmentContentType;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.email.FilenameParser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.mail.*;
import jakarta.mail.internet.*;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@ApplicationScoped
public class PecMessageConverterService {

    @Inject
    AttachmentContentTypeService attachmentContentTypeService;

    /**
     * Converte un'istanza di {@link Message} in un'istanza di {@link EmailContentDTO}.
     *
     * @param message Il messaggio da convertire
     * @return L'EmailContentDTO convertito
     * @throws MessagingException Se si verifica un errore durante l'elaborazione del messaggio
     * @throws IOException        Se si verifica un errore di I/O
     */
    @Transactional
    @TransactionConfiguration(timeout = 600)
    public EmailContentDTO convertToEmailContentDTO(Message message, byte[] emlContentBytes) throws MessagingException, IOException {
        String from = null;
        List<String> toList = new ArrayList<>();
        List<String> ccList = new ArrayList<>();
        List<AttachmentDTO> attachmentDTOList = new ArrayList<>();
        Date sentDate = message.getSentDate();

        String subject = message.getSubject();
        Timestamp tsInvio = Timestamp.valueOf(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(sentDate));
        String body = getTextFromMessage(message);
        String messageId = ((MimeMessage) message).getMessageID().toLowerCase();

//        log.info("Inizio lettura file EML completo {}", System.currentTimeMillis());
        AttachmentDTO emlFile = emlContentBytes != null ? generateEmlFromByteArray(emlContentBytes, sentDate, null) : generateEmlFromMessage(message, sentDate, null);
        attachmentDTOList.add(emlFile);
//        log.info("Fine lettura file EML completo {}", System.currentTimeMillis());

//        log.info("Inizio memorizzazione file EML {}", System.currentTimeMillis());
        ByteArrayInputStream inputStream = new ByteArrayInputStream(emlFile.getContent());
        Properties props = new Properties();
        Session session = Session.getInstance(props, null);
        MimeMessage mimeMessage = new MimeMessage(session, inputStream);
//        log.info("Inizio lettura allegati da EML completo {}", System.currentTimeMillis());
        addAllAttachmentsFromMessage(mimeMessage, attachmentDTOList);
//        log.info("Fine lettura allegati da EML completo {}", System.currentTimeMillis());

        try {
            // Get FROM sender
            Address[] fromSender = message.getFrom();
            if (fromSender != null && fromSender.length > 0) {
                InternetAddress fromAddress = (InternetAddress) fromSender[0];
                String encodedPersonal = MimeUtility.decodeText(fromAddress.getPersonal());

                String extractedAddress = Utils.extractEmail(encodedPersonal);
                if (extractedAddress == null || extractedAddress.isEmpty()) {
                    extractedAddress = Utils.extractEmail(fromAddress.getAddress());
                }
                from = extractedAddress;
            }

            // Get TO recipients
            Address[] toRecipients = message.getRecipients(Message.RecipientType.TO);
            if (toRecipients != null) {
                for (Address address : toRecipients) {
                    String toAdress = Utils.extractedAdress(address);
                    toList.add(toAdress.toLowerCase());
                }
            }

            // Get CC recipients
            Address[] ccRecipients = message.getRecipients(Message.RecipientType.CC);
            if (ccRecipients != null) {
                for (Address address : ccRecipients) {
                    String ccAdress = Utils.extractedAdress(address);
                    ccList.add(ccAdress.toLowerCase());
                }
            }
        } catch (MessagingException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR, e);
            throw e;
        }

        // Costruisci e restituisci EmailContentDTO
        return EmailContentDTO.builder()
                .from(from)
                .to(toList)
                .cc(ccList)
                .subject(subject)
                .body(body)
                .tsInvio(tsInvio)
                .attachments(attachmentDTOList)
                .messageId(messageId)
                .direction("ENTRATA")
                .build();
    }

    public RicevutaPECDTO convertToRicevutaDTO(Message message) throws MessagingException, IOException {
        String from = "";
        String to = "";
        String subject = message.getSubject();
        String messageId = ((MimeMessage) message).getMessageID().toLowerCase();
        String[] tipoRicevutaHeader = message.getHeader("X-Ricevuta");
        String[] riferimentoMessageIdHeader = message.getHeader("X-Riferimento-Message-ID");
        AttachmentDTO emlFile = generateEmlFromMessage(message, null, StringUtils.capitalize(tipoRicevutaHeader[0].concat(".eml")));

        Address[] fromSender = message.getFrom();
        if (fromSender != null && fromSender.length > 0) {
            InternetAddress fromAddress = (InternetAddress) fromSender[0];
            from = fromAddress.getAddress();
        }

        //get del destinatario principale della ricevuta
        Address[] toRecipients = message.getRecipients(Message.RecipientType.TO);
        if (toRecipients != null && toRecipients.length > 0) {
           to = Utils.extractedAdress(toRecipients[0]);
        }
        // Prova a estrarre anche da daticert.xml
        String toFromDaticert = extractRecipientFromDaticert(message);
        if (toFromDaticert != null && !toFromDaticert.isEmpty()) {
            to = to != null ? to.concat(", ").concat(toFromDaticert) : toFromDaticert;
        }


        Date sentDate = message.getSentDate();
        Timestamp tsInvio = Timestamp.valueOf(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(sentDate));

        return RicevutaPECDTO.builder()
                .from(from)
                .to(to)
                .subject(subject)
                .tipoRicevuta(tipoRicevutaHeader[0])
                .riferimentoMessageId(riferimentoMessageIdHeader[0])
                .displayNameFromTipoRicevuta(tipoRicevutaHeader[0])
                .messaggioEml(emlFile)
                .tsInvio(tsInvio)
                .messageId(messageId)
                .build();
    }

    private String extractRecipientFromDaticert(Message message) {
        try {
            Object content = message.getContent();
            if (content instanceof Multipart multipart) {
                return scanMultipartForDaticert(multipart);
            }
        } catch (Exception e) {
            log.error("Errore durante l'estrazione del daticert.xml: {}", e.getMessage(), e);
        }
        return null;
    }

    private String scanMultipartForDaticert(Multipart multipart) throws Exception {
        for (int i = 0; i < multipart.getCount(); i++) {
            BodyPart part = multipart.getBodyPart(i);
            Object partContent = part.getContent();

            if (partContent instanceof Multipart nestedMultipart) {
                // Ricorsione
                String result = scanMultipartForDaticert(nestedMultipart);
                if (result != null) return result;
            } else {
                String filename = part.getFileName() != null ? MimeUtility.decodeText(part.getFileName()) : "";
                String contentType = part.getContentType().toLowerCase();

                if (!filename.toLowerCase().endsWith(".p7s") &&
                        (filename.toLowerCase().contains("daticert") || contentType.contains("xml"))) {

                    try (InputStream isTipo = part.getInputStream();
                         InputStream isData = part.getInputStream()) {

                        String tipoRicevuta = extractTipoRicevutaFromDaticert(isTipo);
                        return switch (tipoRicevuta) {
                            case "avvenuta-consegna", "errore-consegna" -> extractConsegnaAddress(isData);
                            case "accettazione"      -> extractDestinatariAddresses(isData);
                            default                  -> null;
                        };
                    }
                }
            }
        }
        return null;
    }
    
    private String extractTipoRicevutaFromDaticert(InputStream xmlInputStream) {
        try {
            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(xmlInputStream);
            return doc.getDocumentElement().getAttribute("tipo");
        } catch (Exception e) {
            log.warn("Impossibile determinare tipo ricevuta: {}", e.getMessage());
            return null;
        }
    }

    private String extractDestinatariAddresses(InputStream xmlInputStream) {
        try {
            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(xmlInputStream);
            NodeList nodes = doc.getElementsByTagName("destinatari");

            List<String> addresses = new ArrayList<>();
            for (int i = 0; i < nodes.getLength(); i++) {
                addresses.add(nodes.item(i).getTextContent().trim());
            }
            return String.join(",", addresses);
        } catch (Exception e) {
            log.error("Errore nel parsing tag <destinatari>: {}", e.getMessage());
            return null;
        }
    }

    private String extractConsegnaAddress(InputStream xmlInputStream) {
        try {
            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(xmlInputStream);
            NodeList nodes = doc.getElementsByTagName("consegna");
            if (nodes.getLength() > 0) {
                return nodes.item(0).getTextContent().trim();
            }
        } catch (Exception e) {
            log.error("Errore nel parsing del tag <consegna>: {}", e.getMessage());
        }
        return null;
    }

    public static AttachmentDTO generateEmlFromByteArray(byte[] content, Date data, String nomeFile) throws MessagingException, IOException {
        String pecFileName = null;
        if (data != null) {
            String dataInvio = Objects.requireNonNull(Utils.fromDateToString(data, Utils.DateFormat.DMY_HMS))
                    .replace(" ", "-")
                    .replace(":", "");
            pecFileName = "PEC-".concat(dataInvio).concat(".eml");
        } else {
            pecFileName = nomeFile;
        }

//        log.info("generate: Generato file eml di lunghezza: {}", content.length);
        AttachmentDTO emlGeneratedFromMail = AttachmentDTO.builder().name(pecFileName).content(content).type("EMAIL").build();
        emlGeneratedFromMail.setExcludeFromImpronta(true);
        return emlGeneratedFromMail;
    }

    public static AttachmentDTO generateEmlFromMessage(Message message, Date data, String nomeFile) throws MessagingException, IOException {
        if (message instanceof MimeMessage mimeMessage) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            try {
                mimeMessage.writeTo(outputStream);
            } catch (IOException | MessagingException e) {
                LogUtils.exiting(LogUtils.LogLevel.ERROR, e);
                throw e;
            }
            byte[] content = outputStream.toByteArray();
            return generateEmlFromByteArray(content, data, nomeFile);
        } else {
            throw new IllegalArgumentException("Il messaggio non è un MimeMessage.");
        }
    }

    /**
     * Metodo che aggiunge ricorsivamente tutti gli allegati presenti nel messaggio alla lista di allegati
     *
     * @param part              parte del messaggio da analizzare
     * @param attachmentsToFill lista di allegati da aggiornare
     * @throws MessagingException
     * @throws IOException
     */
    public void addAllAttachmentsFromMessage(Part part, List<AttachmentDTO> attachmentsToFill) throws MessagingException, IOException {

        // NOTA: siccome filename può essere null, escludiamo l'allegato
        String filenameToOutput = null;
        try {
            if (part.getFileName() != null) {
                filenameToOutput = MimeUtility.decodeText(part.getFileName());
            }
        } catch (Exception e) {
            filenameToOutput = extractFileNameFormMessage(part);
        }

        // oggetto è di tipo text/plain --> aggiungere allegato
        if (part.isMimeType("text/plain")) {
            if (filenameToOutput != null) {
                AttachmentDTO plainTextAttachment = AttachmentDTO.builder()
                        .name(filenameToOutput)
                        .content(((String) part.getContent()).getBytes())
                        .type(MediaType.TEXT_PLAIN).build();

                attachmentsToFill.add(plainTextAttachment);
            }
        }
        // oggetto è di tipo multipart --> per ogni sua parte chiamare la funzione
        else if (part.isMimeType("multipart/*")) {
            Multipart mp = (Multipart) part.getContent();
            int count = mp.getCount();
            for (int i = 0; i < count; i++) {
                addAllAttachmentsFromMessage(mp.getBodyPart(i), attachmentsToFill);
            }
        }
        // oggetto è di tipo EML --> chiamare la funzione per analizzare
        else if (part.isMimeType("message/rfc822")) {
            addAllAttachmentsFromMessage((Part) part.getContent(), attachmentsToFill);
        } else {
            //NOTA: aggiungiamo agli allegati solo se hanno un nome!
            if (filenameToOutput != null) {
                Object o = part.getContent();

                // parte è una stringa --> aggiungere agli allegati
                if (o instanceof String) {
                    AttachmentDTO plainTextAttachment = AttachmentDTO.builder()
                            .name(filenameToOutput)
                            .content(((String) o).getBytes())
                            .type(MediaType.TEXT_PLAIN).build();
                    attachmentsToFill.add(plainTextAttachment);
                }
                // parte è un inputstream / file --> aggiungere agli allegati
                else if (o instanceof InputStream is) {
                    String[] contentTypeParts = part.getContentType().split(";");

                    AttachmentDTO isAttachment = null;

                    if (contentTypeParts.length > 1) {

                        AttachmentContentType attachmentContentType = attachmentContentTypeService.findByContentType(contentTypeParts[0]);
                        String contentType = attachmentContentType != null ? attachmentContentType.getType() : contentTypeParts[0];
                        isAttachment = AttachmentDTO.builder()
                                .name(filenameToOutput)
                                .content(IOUtils.toByteArray(is))
                                .type(contentType).build();
                    }
                    if (isAttachment != null)
                        attachmentsToFill.add(isAttachment);
                }
            }
        }
    }

    public String extractFileNameFormMessage(Part part) {
        try {
            // Prova con Content-Disposition per primo
            String[] cdHeaders = part.getHeader("Content-Disposition");
            if (cdHeaders != null) {
                for (String header : cdHeaders) {
                    String candidate = FilenameParser.pulisciHeader(header);
                    String filename = FilenameParser.estraiFilenameDaHeader(candidate);
                    if (filename != null) {
                        return filename;
                    }
                }
            }
            // Se non trovato in Content-Disposition, prova con Content-Type
            String[] ctHeaders = part.getHeader("Content-Type");
            if (ctHeaders != null) {
                for (String header : ctHeaders) {
                    String candidate = FilenameParser.pulisciHeader(header);
                    String filename = FilenameParser.estraiFilenameDaHeader(candidate);
                    if (filename != null) {
                        return filename;
                    }
                }
            }
        } catch (MessagingException e) {
            log.error("Impossibile recuperare il nome dell'allegato: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Estrae il testo da un'istanza di {@link Message}.
     *
     * @param message Il messaggio da cui estrarre il testo
     * @return Il testo estratto dal messaggio
     * @throws MessagingException Se si verifica un errore durante l'elaborazione del messaggio
     * @throws IOException        Se si verifica un errore di I/O
     */
    public String getTextFromMessage(Message message) throws MessagingException, IOException {
        Object content = message.getContent();
        if (content instanceof String) {
            return (String) content;
        } else if (content instanceof MimeMultipart multipart) {
            return getTextFromMultipart(multipart);
        }
        return "";
    }

    /**
     * Estrae il testo da un'istanza di {@link MimeMultipart}.
     *
     * @param multipart Il multipart da cui estrarre il testo
     * @return Il testo estratto dal multipart
     * @throws MessagingException Se si verifica un errore durante l'elaborazione del multipart
     * @throws IOException        Se si verifica un errore di I/O
     */
    public String getTextFromMultipart(MimeMultipart multipart) throws MessagingException, IOException {
        StringBuilder text = new StringBuilder();
        try {
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart bodyPart = multipart.getBodyPart(i);
                if (bodyPart.getContent() instanceof String) {
                    text.append(bodyPart.getContent());
                }
            }
        } catch (MessagingException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR, e);
            throw e;
        }
        return text.toString();
    }

    /**
     * Crea un'istanza di {@link AttachmentDTO} da un oggetto {@link BodyPart}.
     *
     * @param bodyPart Il BodyPart da cui creare l'AttachmentDTO
     * @return Un'istanza di AttachmentDTO rappresentante l'allegato
     * @throws MessagingException Se si verifica un errore durante l'elaborazione del BodyPart
     * @throws IOException        Se si verifica un errore di I/O
     */
    public AttachmentDTO createAttachmentDTO(BodyPart bodyPart) throws MessagingException, IOException {
        String fileName = bodyPart.getFileName();
        byte[] content = IOUtils.toByteArray(bodyPart.getInputStream());
        String contentType = bodyPart.getContentType();

        try {
            if (attachmentContentTypeService.isValidContentType(contentType)) {
                return AttachmentDTO.builder()
                        .name(fileName)
                        .content(content)
                        .type(attachmentContentTypeService.findByContentType(contentType).getType()).build();

            } else if (contentType.contains(";")) {
                String[] parts = contentType.split(";");
                String type = parts[0].trim(); // Prendi il primo pezzo e rimuovi eventuali spazi aggiuntivi
                // Ora puoi utilizzare il tipo di contenuto estratto per ottenere il corrispondente AttachmentContentType
                if (attachmentContentTypeService.isValidContentType(type)) {
                    AttachmentContentType attachmentContentType = attachmentContentTypeService.findByContentType(type);
                    return AttachmentDTO.builder()
                            .name(fileName)
                            .content(content)
                            .type(attachmentContentType.getType()).build();
                }
            }
        } catch (IllegalArgumentException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR, e);
            throw e;
        }
        // Se il tipo di contenuto non è riconosciuto, lanciare un'eccezione IllegalStateException
        throw new IllegalStateException("Content type non riconosciuto " + contentType);
    }




    // Metodo helper per parsare IdentificatoreType
    private RiferimentoProtocolloSegnaturaDTO parseIdentificatore(Element element, String PROTOCOLLO_NAMESPACE, boolean hasNamespace) {

        String codIpaName = hasNamespace ? "ns1:CodiceAmministrazione" : "CodiceAmministrazione";
        String codAooName = hasNamespace ? "ns1:CodiceAOO" : "CodiceAOO";
        String codRegistroName = hasNamespace ? "ns1:CodiceRegistro" : "CodiceRegistro";
        String numProtocolloName = hasNamespace ? "ns1:NumeroRegistrazione" : "NumeroRegistrazione";
        String dataRegName = hasNamespace ? "ns1:DataRegistrazione" : "DataRegistrazione";
        String oraRegName = hasNamespace ? "ns1:OraRegistrazione" : "OraRegistrazione";


        String codIpa = getElementTextContent(element, codIpaName, PROTOCOLLO_NAMESPACE);
        String codAoo = getElementTextContent(element, codAooName, PROTOCOLLO_NAMESPACE);
        String codRegistro = getElementTextContent(element, codRegistroName, PROTOCOLLO_NAMESPACE);
        String numProtocollo = getElementTextContent(element, numProtocolloName, PROTOCOLLO_NAMESPACE);
        String dataRegistrazione = getElementTextContent(element, dataRegName, PROTOCOLLO_NAMESPACE);
        String oraRegistrazione = getElementTextContent(element, oraRegName, PROTOCOLLO_NAMESPACE);

        return new RiferimentoProtocolloSegnaturaDTO(codIpa, codAoo, codRegistro, dataRegistrazione, oraRegistrazione, numProtocollo, null, null);
    }

    // Metodo helper per estrarre il testo di un elemento figlio dato il nome e il namespace
    private String getElementTextContent(Element parentElement, String childTagName, String namespace) {
        NodeList nodeList = parentElement.hasAttributeNS(namespace, childTagName) ? parentElement.getElementsByTagNameNS(namespace, childTagName) : parentElement.getElementsByTagName(childTagName);
        if (nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return null;
    }
    public Map<String, RiferimentoProtocolloSegnaturaDTO> readInputSegnaturaXml(byte[] bytes) {
        String PROTOCOLLO_NAMESPACE = "http://www.agid.gov.it/protocollo/";

        boolean hasNamespace = true;
        String riferimentiName = "ns1:Riferimenti";
        String identificatoreName = "ns1:Identificatore";
        String intestazioneName = "ns1:Intestazione";
        String oggettoName = "ns1:Oggetto";
        String classificaName = "ns1:Classifica";
        String denominazioneName = "ns1:Denominazione";

        //oggetto che è contenuto nell'eventuale tag "Riferimenti" che viene usato per capire se il file proviene da una PEC che è una risposta automatica
        RiferimentoProtocolloSegnaturaDTO rifProtocolloInterno = null;
        //oggetto che è letto per ottenere le informazioni sul protocollo esterno per poter creare il file di segnatura xml in fase di protocollazione automatica
        RiferimentoProtocolloSegnaturaDTO rifProtocolloEsterno = null;
        try {
            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(bytes));
            doc.getDocumentElement().normalize();

            // Cerca il tag SegnaturaInformatica, che è l'elemento radice nel nostro contesto
            Element segnaturaInformaticaElement = doc.getDocumentElement();
            if (!segnaturaInformaticaElement.getTagName().contains("segnaturaInformaticaType") && !segnaturaInformaticaElement.getTagName().contains("segnaturaInformatica")) {
                return null;
            }

            // Cerca il tag Riferimenti
            NodeList riferimentiList = segnaturaInformaticaElement.hasAttributeNS(PROTOCOLLO_NAMESPACE, riferimentiName) ? segnaturaInformaticaElement.getElementsByTagNameNS(PROTOCOLLO_NAMESPACE, riferimentiName) : segnaturaInformaticaElement.getElementsByTagName(riferimentiName);
            if (riferimentiList.getLength() > 0) {
                Element riferimentiElement = (Element) riferimentiList.item(0);

                NodeList identificatoreList = riferimentiElement.hasAttributeNS(PROTOCOLLO_NAMESPACE, identificatoreName) ? riferimentiElement.getElementsByTagNameNS(PROTOCOLLO_NAMESPACE, identificatoreName) : riferimentiElement.getElementsByTagName(identificatoreName);
                if (identificatoreList.getLength() > 0) {
                    // Estrai Identificatore
                    Element identificatoreElement = (Element) identificatoreList.item(0);
                    if (identificatoreElement != null) {
                        rifProtocolloInterno = parseIdentificatore(identificatoreElement, PROTOCOLLO_NAMESPACE, hasNamespace);
                    }
                }
            }

            NodeList intestazioniList = segnaturaInformaticaElement.hasAttributeNS(PROTOCOLLO_NAMESPACE, intestazioneName) ? segnaturaInformaticaElement.getElementsByTagNameNS(PROTOCOLLO_NAMESPACE, intestazioneName) : segnaturaInformaticaElement.getElementsByTagName(intestazioneName);
            if (intestazioniList.getLength() > 0) {
                Element intestazioniElement = (Element) intestazioniList.item(0);

                // Estrai Identificatore
                NodeList identificatoreList = intestazioniElement.hasAttributeNS(PROTOCOLLO_NAMESPACE, identificatoreName) ? intestazioniElement.getElementsByTagNameNS(PROTOCOLLO_NAMESPACE, identificatoreName) : intestazioniElement.getElementsByTagName(identificatoreName);
                Element identificatoreElement = (Element) identificatoreList.item(0);
                if (identificatoreElement != null) {
                    rifProtocolloEsterno = parseIdentificatore(identificatoreElement, PROTOCOLLO_NAMESPACE, hasNamespace);
                }

                // Estrai Oggetto
                NodeList oggettoList = intestazioniElement.hasAttributeNS(PROTOCOLLO_NAMESPACE, oggettoName) ? intestazioniElement.getElementsByTagNameNS(PROTOCOLLO_NAMESPACE, oggettoName) : intestazioniElement.getElementsByTagName(oggettoName);
                if (oggettoList.getLength() > 0 && rifProtocolloEsterno != null) {
                    rifProtocolloEsterno.setOggetto(oggettoList.item(0).getTextContent());
                }

                // Estrai Classifica
                NodeList classificaList = intestazioniElement.hasAttributeNS(PROTOCOLLO_NAMESPACE, classificaName) ? intestazioniElement.getElementsByTagNameNS(PROTOCOLLO_NAMESPACE, classificaName) : intestazioniElement.getElementsByTagName(classificaName);
                if (classificaList.getLength() > 0) {
                    Element classificaElement = (Element) classificaList.item(0);
                    if (classificaElement != null && rifProtocolloEsterno != null) {
                        rifProtocolloEsterno.setClassificazione(getElementTextContent(classificaElement, denominazioneName, PROTOCOLLO_NAMESPACE));
                    }
                }
            }
            Map<String, RiferimentoProtocolloSegnaturaDTO> set = new HashMap<>();
            if (rifProtocolloInterno != null) set.put("rifInterno", rifProtocolloInterno);
            if (rifProtocolloEsterno != null) set.put("rifEsterno", rifProtocolloEsterno);
            return set;
        } catch (Exception e) {
            return null;
        }
    }


    public String getNProtocolloInternoFromPecWithoutSignature(Message message, String from, String subject) {
        Map<String, String[]> datiMittente = new HashMap<>();
        datiMittente.put("collaudo@pec.parsec326.it", new String[]{"Non rispondete a questo messaggio automatico R:CMRC", "body"});
        datiMittente.put("...@pec.comune.roma.it", new String[]{"Non rispondete a questo messaggio automatico R:CMRC", "subject"});
        datiMittente.put("protocollo@pec.aslroma1.it", new String[]{"ASL Roma 1 - Ricevuta di avvenuta protocollazione", "body"});
        datiMittente.put("...@pec.comune.pomezia.rm.it", new String[]{"Avvenuta registrazione della PEC nel protocollo dell''Ente.", "body"});
        datiMittente.put("...@pec.comunediariccia.it", new String[]{"Ricevuta di protocollazione della PEC", "body"});
        datiMittente.put("...@pec.aslroma5.it", new String[]{"RICEVUTA DI PROTOCOLLO: POSTA CERTIFICATA: CMRC", "subject"});

        Pattern pattern = Pattern.compile("CMRC-\\d{4}-\\d{7}");

        for(Map.Entry<String, String[]> entry : datiMittente.entrySet()) {
            String key = entry.getKey();
            String[] value = entry.getValue();
            String subjectType = value[0];
            String strategy = value[1];

            boolean isWildcard = key.startsWith("...");
            String target = isWildcard ? key.substring(3).toLowerCase() : key.toLowerCase();

            boolean match = isWildcard ? from.toLowerCase().contains(target) : from.toLowerCase().equalsIgnoreCase(target);

            if (match) {
                if (strategy.equalsIgnoreCase("subject")) {
                    return getNProtocolloInternoFromSubject(subjectType, subject, pattern);
                } else if (strategy.equalsIgnoreCase("body")) {
                    return getNProtocolloInternoFromBody(subjectType, subject, message, pattern);
                }
            }
        }
        return null;
    }

    private String getNProtocolloInternoFromBody(String subjectType, String subject, Message message, Pattern pattern) {
        if (!subject.contains(subjectType)) {
            return null;
        }

        try {
            String text = getTextFromPecMessage(message);
            //log.info("Testo della PEC letto: {}", text);
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                return matcher.group();
            }
        } catch (Exception e) {
            return null;
        }

        return null;
    }

    private String getTextFromPecMessage(Part part) throws MessagingException, IOException {
        StringBuilder t = new StringBuilder();
        if (part.isMimeType("multipart/*")) {
            Multipart mp = (Multipart) part.getContent();
            for (int i = 0; i < mp.getCount(); i++) {
                t.append(getTextFromPecMessage(mp.getBodyPart(i)));
            }
        }
        else if (part.isMimeType("message/rfc822")) {
            Object content = part.getContent();
            if (content instanceof Message) {
                Message nested = (Message) content;
                t.append(getTextFromPecMessage(nested));
            }
        }
        else if (part.isMimeType("text/*")) {
            return (String) part.getContent();
        }
        return t.toString();
    }

    private String getNProtocolloInternoFromSubject(String subjectType, String subject, Pattern pattern) {
        if (!subject.contains(subjectType)) {
            return null;
        }

        Matcher matcher = pattern.matcher(subject);
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }
}