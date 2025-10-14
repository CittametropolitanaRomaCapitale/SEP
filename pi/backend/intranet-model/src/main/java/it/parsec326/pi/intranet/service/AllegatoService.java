package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.AllegatiOutputDTO;
import it.parsec326.pi.intranet.dto.output.AllegatoDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaAllegatiDTO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.dto.input.AllegatoInput;
import it.parsec326.pi.intranet.dto.input.FileUploadForm;
import it.parsec326.pi.intranet.dto.mail.AttachmentDTO;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import it.parsec326.pi.intranet.dto.mail.RicevutaPECDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.*;
import it.parsec326.pi.intranet.utils.common.EmailDirection;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.jetbrains.annotations.NotNull;
import org.keycloak.common.util.Time;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
@ApplicationScoped
@Slf4j
public class AllegatoService implements PanacheCustomEntityServiceInterface<Allegato> {

    @Inject
    @Getter
    UserTransaction transaction;

    @Inject
    EntityManager em;

    @Inject
    StoricoService storicoService;

    @Inject
    MinioConnectionFactory minioFactory;

    @Inject
    AttachmentContentTypeService attachmentContentTypeService;

    @Inject
    DocumentService documentService;


    private static final Tika tika = new Tika();


    @Inject
    SSOClient ssoManager;
    private final String bucketName = "pi-docs";

    private final String docsBucketPath = "docs";
    private final String protocolloBucketPath = "protocolli";
    private final String titolarioBucketPath = "titolario";

    private final static String STORICO_ELIMINAZIONE_DOCUMENTO = "Eliminazione documento";

    private final static String STORICO_INSERIMENTO_DOCUMENTO = "Inserimento documento";

    public static String calculateImpronta(byte[] data) {
        return DigestUtils.sha256Hex(data);
    }

    public static String calculateImpronta(String fileName, byte[] data) {
        try {
            byte[] fileNameBytes = fileName.getBytes(StandardCharsets.UTF_8);
            byte[] combinedData = new byte[fileNameBytes.length + data.length];
            System.arraycopy(fileNameBytes, 0, combinedData, 0, fileNameBytes.length);
            System.arraycopy(data, 0, combinedData, fileNameBytes.length, data.length);
            return DigestUtils.sha256Hex(combinedData);
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore durante il calcolo dell'impronta: " + e.getMessage()).boom();
            return null;
        }
    }

    public Allegato uploadAllegatiProtocollo(FileUploadForm input) {
        if (input.getFileName() == null) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Il nome del file e' assente").boom();
        }

        if(input.getFileStream() == null){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Il file non e'presente nella richiesta di salvataggio").boom();
        }

        String extension = "";
        String fileName = input.getFileName();
        long partSize = Math.min(Math.max(input.getDimensione()/ 10000, 5242880), 104857600);

        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex != -1) {
            fileName = fileName.substring(0, dotIndex);
            extension = input.getFileName().substring(dotIndex);
        }

        Allegato allegato = new Allegato();
        if(!input.protocollazioneAuto) {
            final String userId = ssoManager.extractIdFromToken();
            allegato.setIdUtente(userId);
            allegato.setIdUtenteLastOperation(userId);
        }
        allegato.setOggetto(input.getOggetto());
        allegato.setCollocazioneTelematica(input.getCollocazioneTelematica());
        allegato.setIsMain(input.getIsMain().equals("1"));
        allegato.setNome(fileName + extension);
        allegato.setEstensione(extension);
        allegato.setDimensione(input.getDimensione());
        allegato.setTsCreation(Calendar.getInstance().getTime());

        try {
            allegato = this.saveAllegatiUploadProtocollo(input.getFileStream(), allegato, fileName, extension, partSize, input.isInoltro);
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore in fase di salvataggio dell'allegato: {}", e).boom();
        }
        return allegato;
    }

    @Transactional
    public Allegato saveAllegati(FileUploadForm input) {

        if (input.getFileName() == null) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Il nome del file e' assente").boom();
        }

        if(input.getFileData() == null){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Il file non e'presente nella richiesta di salvataggio").boom();
        }

        String fileName = "";
        String extension = "";
        String fileNameInput = input.getFileName();
        long partSize = Math.min(Math.max(input.getDimensione()/ 10000, 5242880), 104857600);

        int dotIndex = fileNameInput.lastIndexOf('.');
        if (dotIndex != -1) {
            fileName = fileNameInput.substring(0, dotIndex);
            extension = fileNameInput.substring(dotIndex);
        }else{
            fileName = fileNameInput;
            String contentType = "";
            AutoDetectParser parser = new AutoDetectParser();
            Metadata metadata = new Metadata();
            try {
                InputStream fileInputStream = new ByteArrayInputStream(input.getFileData());
                parser.parse(fileInputStream, new BodyContentHandler(), metadata);
                contentType =  metadata.get("Content-Type");
            } catch (Exception e) {
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Estensione Allegato non valida").boom();
            }
            extension = attachmentContentTypeService.findByContentType(contentType).getExtension();
        }

        Allegato allegato = new Allegato();
        if(!input.protocollazioneAuto) {
            final String userId = ssoManager.extractIdFromToken();
            allegato.setIdUtente(userId);
            allegato.setIdUtenteLastOperation(userId);
        }
        allegato.setOggetto(input.getOggetto());
        allegato.setCollocazioneTelematica(input.getCollocazioneTelematica());
        allegato.setIsMain(input.getIsMain().equals("1"));
        allegato.setNome(fileName + extension);
        allegato.setEstensione(extension);
        allegato.setDimensione(input.getDimensione());
        allegato.setImpronta(calculateImpronta(fileName, input.getFileData()));
        allegato.setTsCreation(Calendar.getInstance().getTime());
        allegato.setDiscarded(false);

        try {
            allegato = this.saveAllegati(input.getFileData(), allegato, fileName, extension, partSize, input.isInoltro);
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore in fase di salvataggio dell'allegato: {}", e).boom();
        }
        return allegato;
    }

    public Response insertAllegatoTitolario(FileUploadForm fileUpload, Long idTitolario, String selectedOffice){
        try (InputStream inputStream = fileUpload.getFileStream()) {

            // TODO: aggiungere un controllo che verifichi anche i permessi associati al fascicolo,
            //  per evitare che utenti non autorizzati carichino dei documenti, eventualmente passare la lista di ruoli utente per velocizzare
            DatiUtenteSSO datiUtenteSSO = ssoManager.getDatiUtente();
            boolean canWorkProtocolAsProtocollatoreArchivista = ssoManager.extractOfficesByRoles(datiUtenteSSO).contains(selectedOffice);

            if (!canWorkProtocolAsProtocollatoreArchivista) {
                CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                        "Impossibile caricare il documento, non si dispone dei permessi necessari").boom();
            }

            List<String> inputErrors = checkFileUploadParams(fileUpload, idTitolario);
            if (!inputErrors.isEmpty()) {
                String errorMessage = String.join(" | ", inputErrors);
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(errorMessage)
                        .type(MediaType.TEXT_PLAIN)
                        .build();
            }

            String userId = ssoManager.extractIdFromToken();
            String nomeUtenteForStorico = ssoManager.extractNameFromToken();
            long fileSize = fileUpload.getDimensione();
            if (fileSize == 0) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("Errore imprevisto dal durante il salvataggio: ")
                        .type(MediaType.TEXT_PLAIN)
                        .build();
            }

            long partSize = Math.min(Math.max(fileSize/ 10000, 5242880), 104857600);

            String fileName = fileUpload.getFileName();
            int dotIndex = fileName.lastIndexOf('.');
            String fileNameNoExtension;
            String extension;

            if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
                fileNameNoExtension = fileName.substring(0, dotIndex);
                extension = fileName.substring(dotIndex);
            } else {
                fileNameNoExtension = fileName;
                extension = "";
            }

            String minioId = UUID.randomUUID().toString().replace("-", "");
            String minioFile = String.format("%s_%s%s", fileNameNoExtension, minioId,extension);
            String fileNameWithPath = String.format("/%s/%s/%s/%s", docsBucketPath, titolarioBucketPath, idTitolario, InputUtils.normalizeFilenameInput(minioFile));

            log.info("[Bucket: {}/{}/{}], In corso upload del file: {} da parte dell'utente: {}",bucketName, titolarioBucketPath, idTitolario, fileName, nomeUtenteForStorico);

            long uploadTimeStart = Time.currentTimeMillis();
            boolean success = minioFactory.uploadFileByBais(bucketName, fileNameWithPath, new ByteArrayInputStream(inputStream.readAllBytes()), fileSize, partSize);

            if (!success) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("Errore durante il caricamento file: " + fileName)
                        .type(MediaType.TEXT_PLAIN)
                        .build();
            }

            long uploadTimeEnd = System.currentTimeMillis();
            String formattedDuration = Utils.getOperationTime(uploadTimeStart, uploadTimeEnd);

            log.info("[Bucket: {}/{}/{}], L'utente: {} ha caricato con successo il file: {}. Durata dell'upload: {}", bucketName, titolarioBucketPath, idTitolario, nomeUtenteForStorico, fileName, formattedDuration);

            // preparazione dell'allegato per il salvataggio nel db
            Allegato allegatoToSave = new Allegato();
            allegatoToSave.setRiferimentoMinio(fileNameWithPath);
            allegatoToSave.setNome(fileName);
            allegatoToSave.setEstensione(extension);
            allegatoToSave.setDimensione(fileSize);
            allegatoToSave.setIdUtente(userId);
            allegatoToSave.setIdUtenteLastOperation(userId);
            allegatoToSave.setTsCreation(Timestamp.from(Instant.now()));
            allegatoToSave.setIsMain(false);
            allegatoToSave.setImpronta(calculateImpronta(fileName, inputStream.readAllBytes()));

            boolean saveAllegatoSuccess = saveAllegatoTitolario(allegatoToSave, idTitolario);
            if(!saveAllegatoSuccess){
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("Errore imprevisto dal durante il salvataggio: ")
                        .type(MediaType.TEXT_PLAIN)
                        .build();
            }

            return Response.ok("File caricato con successo nel bucket").build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Parametri non validi: " + e.getMessage())
                    .type(MediaType.TEXT_PLAIN)
                    .build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore imprevisto dal durante il salvataggio: " + e.getMessage())
                    .type(MediaType.TEXT_PLAIN)
                    .build();
        }
    }

    @Transactional
    public boolean saveAllegatoTitolario(Allegato allegatoToSave, Long idTitolario){
        try{
            Titolario titolario = Titolario.findById(idTitolario);
            allegatoToSave.setTitolario(titolario);
            allegatoToSave.persist();

            String userId = ssoManager.extractIdFromToken();
            String nomeUtenteForStorico = ssoManager.extractNameFromToken();
            storicoService.insertNewStoricoForIdTitolario(
                    allegatoToSave.getTitolario(),
                    userId,
                    nomeUtenteForStorico,
                    STORICO_INSERIMENTO_DOCUMENTO,
                    String.format("Nome del documento: \"%s\"", documentService.shortenFileName(allegatoToSave.getNome(), 15)));

            log.info("Salvataggio del file con id:{} | nome: {} avvenuto con successo!", allegatoToSave.getId(), allegatoToSave.getNome());
            return true;

        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Errore in fase di salvataggio del file del titolario nella base dati.", e.getMessage()).boom();
            return false;
        }
    }

    private @NotNull List<String> checkFileUploadParams(FileUploadForm fileUploadForm, Long idTitolario) {
        List<String> inputErrors = new ArrayList<>();

        if(fileUploadForm.fileStream == null){
            inputErrors.add("il file di input e' null");
        }

        if(fileUploadForm.getFileName() == null || fileUploadForm.getFileName().isEmpty()){
            inputErrors.add("il nome del file e' null");
        }

        if (idTitolario == null ) {
            inputErrors.add("il riferimento del titolario e' null");
        }
        return inputErrors;
    }

    /*
     Check se esistono già allegati con la stessa impronta.
     Se esistono, viene creato comunque un record nella tabella con lo stesso riferimento minio
     */
    @Transactional
    public Allegato checkSameAllegati(Allegato allegato){
        Allegato sameAllegato = findFirstByImpronta(allegato.getImpronta());
        if(sameAllegato == null){
            return null;
        }
        allegato.setRiferimentoMinio(sameAllegato.getRiferimentoMinio());
        allegato.persist();
        return sameAllegato;
    }

    public Allegato saveAllegati(byte[] fileContentInBytes, Allegato insert, String fileName, String extension, long partSize, Boolean isInoltro) {
        /*
         Check se esistono già allegati con la stessa impronta.
         Se esistono, viene creato comunque un record nella tabella con lo stesso riferimento minio
         */
        if(Boolean.FALSE.equals(isInoltro)) {
            Allegato sameAllegato = checkSameAllegati(insert);
            if(sameAllegato != null){
                insert.setRiferimentoMinio(sameAllegato.getRiferimentoMinio());
                log.info("[Bucket: {}/{}], File: {} già presente nel db, non verra' effettuato l'upload nell' objectStore.",bucketName, protocolloBucketPath, fileName);
                return insert;
            }
        }

        // Qui ci arriva se è un file che non esiste nel db
        String minioId = UUID.randomUUID().toString().replaceAll("-", "");
        fileName = String.format("%s_%s", fileName, minioId);
        String minioFileName = String.format("%s/%s/%s%s", docsBucketPath, protocolloBucketPath, InputUtils.normalizeFilenameInput(fileName), extension);
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(fileContentInBytes);
        try {

            log.info("[Bucket: {}/{}], In corso upload del file: {}",bucketName, protocolloBucketPath, fileName);
            long uploadTimeStart = Time.currentTimeMillis();
            boolean saveSuccess = minioFactory.uploadFileByBais(bucketName,minioFileName, byteArrayInputStream, insert.getDimensione(),partSize);
            if(!saveSuccess){
                CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore in fase di upload nell' objectStore").boom();
            }

            long uploadTimeEnd = Time.currentTimeMillis();
            String formattedDuration = Utils.getOperationTime(uploadTimeStart, uploadTimeEnd);
            log.info("[Bucket: {}/{}], Upload del file: {} avvenuta con successo. Durata dell' upload: {}",bucketName, protocolloBucketPath, fileName, formattedDuration);

            insert.setRiferimentoMinio(minioFileName);
            insert.persist();

        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
        }

        return insert;
    }

    public Allegato saveAllegatiUploadProtocollo(InputStream inputStream, Allegato insert, String fileName, String extension, long partSize, Boolean isInoltro) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try(InputStream stream = inputStream; ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192]; // 8KB buffer
            int bytesRead;
            while ((bytesRead = stream.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            byte[] fileBytes = baos.toByteArray();

            insert.setImpronta(calculateImpronta(fileName, fileBytes));
            if(Boolean.FALSE.equals(isInoltro)) {
                Allegato sameAllegato = checkSameAllegati(insert);
                if(sameAllegato != null){
                    insert.setRiferimentoMinio(sameAllegato.getRiferimentoMinio());
                    log.info("[Bucket: {}/{}], File: {} già presente nel db, non verra' effettuato l' upload nell' objectStore.",bucketName, protocolloBucketPath, fileName);
                    return insert;
                }
            }

            // Qui ci arriva se è un file che non esiste nel db
            String minioId = UUID.randomUUID().toString().replaceAll("-", "");
            fileName = String.format("%s_%s", fileName, minioId);
            String minioFileName = String.format("%s/%s/%s%s", docsBucketPath, protocolloBucketPath, InputUtils.normalizeFilenameInput(fileName), extension);

            log.info("[Bucket: {}/{}], In corso upload del file: {}",bucketName, protocolloBucketPath, fileName);
            long uploadTimeStart = Time.currentTimeMillis();

            boolean saveSuccess = minioFactory.uploadFileByBais(bucketName, minioFileName, new ByteArrayInputStream(fileBytes), insert.getDimensione(),partSize);
            if(!saveSuccess){
                CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore in fase di upload nell' objectStore").boom();
            }

            long uploadTimeEnd = Time.currentTimeMillis();
            String formattedDuration = Utils.getOperationTime(uploadTimeStart, uploadTimeEnd);
            log.info("[Bucket: {}/{}], Upload del file: {} avvenuta con successo. Durata dell' upload: {}",bucketName, protocolloBucketPath, fileName, formattedDuration);

            insert.setRiferimentoMinio(minioFileName);
            boolean saveAllegatoSucess = persistAllegatoProtocllo(insert);
            if(!saveAllegatoSucess){
                CustomException.get(CustomException.ErrorCode.INTERNAL,
                        "Errore nel salvataggio dell'allegato nel database.").boom();
            }

            return insert;

        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
            return null;
        }
    }

    @Transactional
    public boolean persistAllegatoProtocllo(Allegato allegato){
        try{
            allegato.persist();
            return true;
        }catch (Exception e){
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Errore in fase di salvataggio del file del protocollo nella base dati.", e.getMessage()).boom();
            return false;
        }
    }

    @Transactional
    @ExceptionChecked
    public void saveAllegati(InputStream stream, String minioRef, String extension, Long idAllegato, String nProtocollo) {

        Allegato allegato = Allegato.findById(idAllegato);

        if(allegato == null){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Allegato null").boom();
        }

        Allegato original = saveAllegatoOriginal(allegato);
        allegato.setIdOriginal(original.getId());

        int dotIndex = minioRef.lastIndexOf('.');
        String minioRefNoExtension = (dotIndex >= 0) ? minioRef.substring(0, dotIndex) : minioRef;

        int lastIndexUnderscore = minioRef.lastIndexOf('_');
        String format = (lastIndexUnderscore >= 0 && minioRef
                .substring(lastIndexUnderscore).equalsIgnoreCase("_timbrato")) ? "%s%s" : "%s_timbrato%s";

        int lastSlash = minioRef.lastIndexOf('/');
        String fileName = String.format(format, minioRefNoExtension.substring(lastSlash + 1), extension);
        String filePath = minioRefNoExtension.substring(0, lastSlash +1);
        String minioRefToSave = String.format("%s%s%s", filePath, nProtocollo, InputUtils.normalizeFilenameInput(fileName));

        File file = new File(fileName);
        if (!file.exists()) {
            try {
                boolean isFileCreated = file.createNewFile();
                if(!isFileCreated){
                    throw new RuntimeException("Impossibile creare il file, riprovare.");
                }
            } catch (IOException e) {
                throw new RuntimeException("Errore durante la creazione del file: " + fileName, e);
            }
        }

        try {
            FileUtils.copyInputStreamToFile(stream, file);
            log.info("[Bucket: {}/{}], In corso upload del file: {}",bucketName, protocolloBucketPath, fileName);
            long uploadTimeStart = Time.currentTimeMillis();

            boolean saveSuccess = minioFactory.uploadFileWithFilename(bucketName, minioRefToSave, file.getName());
            if(!saveSuccess){
                CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore in fase di upload nell' objectStore").boom();
            }

            long uploadTimeEnd = Time.currentTimeMillis();
            String formattedDuration = Utils.getOperationTime(uploadTimeStart, uploadTimeEnd);
            log.info("[Bucket: {}/{}], Upload del file: {} avvenuta con successo. Durata dell' upload: {}s",bucketName, protocolloBucketPath, fileName, formattedDuration);

            boolean isTempFileDeleted = file.delete();
            if(isTempFileDeleted){
                log.info("file temporaneo eliminato correttamente");
            }

            allegato.setRiferimentoMinio(minioRefToSave);
            allegato.setImpronta(calculateImpronta(fileName + nProtocollo, stream.readAllBytes()));
            allegato.persist();

        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore durante il salvataggio dell' allegato: ", e).boom();
        }
    }

    @Transactional
    @ExceptionChecked
    public Allegato updateAllegato(AllegatoInput input) {
        Allegato allegato = Allegato.findById(input.getIdAllegato());
        if(allegato == null){
            throw new RuntimeException(String.format("Allegato con id: %s non presente sul database", input.getIdAllegato()));
        }
        allegato.setNome(input.getNome());
        allegato.setOggetto(input.getOggetto());
        allegato.setCollocazioneTelematica(input.getCollocazioneTelematica());
        allegato.setDiscarded(false);

        if (input.isMain()) {
            allegato.setIsMain(Boolean.TRUE);
        } else {
            allegato.setIsMain(Boolean.FALSE);
        }
        return allegato;
    }

    @Transactional
    public Allegato saveAllegatoOriginal(Allegato allegato) {
        Allegato original = Allegato.builder()
                .oggetto(allegato.getOggetto())
                .tsCreation(Calendar.getInstance().getTime())
                .riferimentoMinio(allegato.getRiferimentoMinio())
                .isMain(false)
                .nome(allegato.getNome())
                .dimensione(allegato.getDimensione())
                .estensione(allegato.getEstensione())
                .impronta(allegato.getImpronta())
                .discarded(false)
                .build();
        original.persist();
        return original;
    }

    public InputStream downloadByRef(String minioRef){
        return minioFactory.downloadFile(bucketName, minioRef);
    }

    public byte[] searchByRef(String minioRef) throws IOException {
        return minioFactory.downloadFile(bucketName, minioRef).readAllBytes();
    }

    public boolean deleteByRef(String minioRef){
        return minioFactory.deleteFile(bucketName, minioRef);
    }

    @Override
    @Transactional
    public boolean delete(Long fileId){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try {
            Allegato allegato = Allegato.findById(fileId);
            //se allegato non esiste oppure ha un protocollo legato
            if(allegato == null || allegato.getProtocollo() != null) {
                return false;
            }

            String impronta = allegato.getImpronta();
            String minioRef = allegato.getRiferimentoMinio();
            allegato.delete();

            boolean isDeleted = true;

            /*
             Check se esistono allegati con la stessa impronta.
             Se non esistono, viene cancellato il file anche dal bucket di minio
             */
            List<Allegato> sameAllegati = Allegato.find("impronta",impronta).list();

            if (sameAllegati.isEmpty()) {
                isDeleted = this.deleteByRef(minioRef);
            }

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return isDeleted;
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nell eliminazione dell'allegato").boom();
            return false;
        }
    }

    @Transactional
    public boolean deleteAllegatoTitolario(Long fileId){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try {
            Allegato allegato = Allegato.findById(fileId);
            if(allegato == null) {
                return false;
            }

            String minioRef = allegato.getRiferimentoMinio();
            allegato.delete();

            String idUtenteForStorico = ssoManager.extractIdFromToken();
            String nomeUtenteForStorico = ssoManager.extractNameFromToken();

            storicoService.insertNewStoricoForIdTitolario(
                    allegato.getTitolario(),
                    idUtenteForStorico,
                    nomeUtenteForStorico,
                    STORICO_ELIMINAZIONE_DOCUMENTO, String.format(
                            "Nome del documento: \"%s\"", documentService.shortenFileName(allegato.getNome(), 15)));

            log.info("L'utente:[id: {} | nome: {}], ha eliminato il documento:[id: {} | nome: {}] dal fascicolo:[id: {} | nome: {}]",
                    idUtenteForStorico,
                    nomeUtenteForStorico,
                    allegato.getId(),
                    allegato.getNome(),
                    allegato.getTitolario().getId(),
                    allegato.getTitolario().getNome());

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return this.deleteByRef(minioRef);
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nell eliminazione dell'allegato").boom();
            return false;
        }
    }

    @Transactional
    @ExceptionChecked
    public List<AttachmentDTO> buildAttachmentsForEmail(List<Allegato> allegati) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        List<AttachmentDTO> attachments = new ArrayList<>();

        for (Allegato allegato : allegati) {
            try {
                Allegato allegatoToCheck = Allegato.findById(allegato.getId());
                String fileNameMinio = allegatoToCheck.getRiferimentoMinio();

                if (fileNameMinio == null) {
                    throw new IllegalStateException("Reference in MinIO not found for ID: " + allegato.getId());
                }

                String extension = allegatoToCheck.getEstensione();

                InputStream inputStream = this.downloadByRef(fileNameMinio);
                byte[] fileBytes = inputStream.readAllBytes();

                AttachmentDTO attachmentDTO = AttachmentDTO.builder().name(allegato.getNome()).content(fileBytes).build();

                AttachmentContentType contentType;
                //Integer dotIndex = fileNameMinio.lastIndexOf('.');
                //String extension = (dotIndex >= 0) ? fileNameMinio.substring(dotIndex) : null;

                // Questo check va fatto per garantire la gestione dei file senza estensione
                if (extension != null) {
                    contentType = attachmentContentTypeService.findByExtension(extension);
                    if (contentType == null)
                        throw new IllegalStateException("Errore nel file " + fileNameMinio + ". Estensione '" + extension + "' non trovata in tabella");
                    attachmentDTO.setType(contentType.getType());
                } else {
                    contentType =  extractEstensioneFromByte(fileBytes, attachmentDTO.getName());
                    if(contentType == null){
                        throw new IllegalStateException("Errore nel file " + fileNameMinio + ". Impossibile recuperare l'estensione.");
                    }
                    attachmentDTO.setType(contentType.getType());
                }
                attachments.add(attachmentDTO);
            } catch (Exception e) {
                LogUtils.exiting(LogUtils.LogLevel.ERROR);
                log.error("Parse Error ALlegato to AttachmentDTO");
                throw new RuntimeException(ExceptionUtils.getRootCauseMessage(e), e);
            }
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return attachments;
    }

    public AttachmentContentType extractEstensioneFromByte(byte[] fileBytes, String fileName){
        try (InputStream tikaInputStream = new ByteArrayInputStream(fileBytes)) {
            AutoDetectParser parser = new AutoDetectParser();
            Metadata metadata = new Metadata();
            parser.parse(tikaInputStream, new BodyContentHandler(), metadata);

            String extractedContentType = metadata.get("Content-Type");
            if (extractedContentType != null && !extractedContentType.isEmpty()) {
                return attachmentContentTypeService.findByContentType(extractedContentType);
            }
        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL,
                    "Impossibile recuperare l'estensione del file: {}", fileName).boom();
        }
        return null;
    }

    private Allegato generateAllegatoFromAttachmentDTO(AttachmentDTO attachmentDTO, boolean isMain, String oggetto, String collocazioneTelematica){
        FileUploadForm uploadForm = new FileUploadForm();
        uploadForm.setFileData(attachmentDTO.getContent());
        uploadForm.setFileName(attachmentDTO.getName());
        uploadForm.setOggetto(oggetto != null ? oggetto : attachmentDTO.getName());
        uploadForm.setIsMain(isMain ? "1" : "0");
        uploadForm.setDimensione((long) attachmentDTO.getContent().length);
        uploadForm.setCollocazioneTelematica(collocazioneTelematica != null ? collocazioneTelematica : "");
        uploadForm.setProtocollazioneAuto(true);
        return this.saveAllegati(uploadForm);
    }

    public List<Allegato> generateAllegatiFromEmailContentDTO(EmailContentDTO emailContentDTO, boolean generateOnlyMain) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if (emailContentDTO == null) {
            log.error("EmailContentDTO è null");
            throw new IllegalArgumentException("EmailContentDTO cannot be null.");
        }

        List<Allegato> list = new ArrayList<>();
        if (emailContentDTO.getAttachments() == null || emailContentDTO.getAttachments().isEmpty()) {
            return list;
        }

        boolean isMain = true;
        for (AttachmentDTO attachmentDTO : emailContentDTO.getAttachments()) {
            try {
                if (!generateOnlyMain || isMain) {
                    list.add(this.generateAllegatoFromAttachmentDTO(attachmentDTO, isMain, null, null));
                }
                isMain = false;
            } catch (Exception e) {
                LogUtils.exiting(LogUtils.LogLevel.DEBUG);
                log.error("Errore nel salvataggio dell'allegato durate la protocollazione PEC");
                throw new RuntimeException("Problematica relativa alla creazione degli allegati", e);
            }
        }
        log.debug("{} allegato/i sono stati caricati nel bucket: ",emailContentDTO.getAttachments().size());
        return list;
    }

    public Allegato generateAllegatoFromRicevutaPECDTO(RicevutaPECDTO ricevutaPECDTO, boolean isMain) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        if (ricevutaPECDTO == null) {
            log.error("RicevutaPECDTO è null");
            throw new IllegalArgumentException("RicevutaPECDTO cannot be null.");
        }

        if (ricevutaPECDTO.getMessaggioEml() == null) {
            return null;
        }

        try {
            return this.generateAllegatoFromAttachmentDTO(ricevutaPECDTO.getMessaggioEml(), isMain, ricevutaPECDTO.getDisplayName(), null);
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            log.error("Errore nel salvataggio dell'allegato ricevuta PEC durate la gestione delle ricevute PEC");
            CustomException.get(CustomException.ErrorCode.INTERNAL,String.format(
                    "Problematica relativa alla creazione dell'allegato durante la gestione delle ricevute PEC - %s", e.getMessage())).boom();
        }
        return null;
    }

    @Transactional
    public byte[] getAllegatoEml(Long idEmail){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try {
            Email email = Email.findById(idEmail);
            if (email == null) {
                throw new IllegalArgumentException("Email con id " + idEmail + " non presente.");
            }

            EmailDirection direction = email.getEmailDirection();
            if (direction == null) {
                throw new IllegalArgumentException("Email direction is null.");
            }

            Allegato allegato;

            if (direction.getDirection().equalsIgnoreCase("ENTRATA")) {
                allegato = (Allegato) em.createNamedQuery("findMainEmlEntrata")
                        .setParameter("idEmail", email.getId())
                        .getSingleResult();
            } else if (direction.getDirection().equalsIgnoreCase("USCITA")) {
                allegato = (Allegato) em.createNamedQuery("findEmlUscita")
                        .setParameter("idEmail", email.getId())
                        .getSingleResult();
            } else {
                throw new IllegalArgumentException(" Email direction: " + direction.getDirection() + " non valido");
            }

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);

            return searchByRef(allegato.getRiferimentoMinio());

        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            log.error("Errore nel recupero del file eml del protocollo/circolare");
            throw new RuntimeException(e.getMessage());
        }
    }

    @Transactional
    @ExceptionChecked
    public boolean spostaAllegatoTitolario(Allegato allegato, Long newIdTitolario) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try {
            if(allegato == null && allegato.getRiferimentoMinio() != null){
                CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                        "Allegato non ha il riferimento al bucketStore").boom();
            }
            if(newIdTitolario == null){
                CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                        "Nuovo idTitolario non presente").boom();
            }

            String minioRef = allegato.getRiferimentoMinio();

            int dotIndex = minioRef.lastIndexOf('.');
            int lastSlash = minioRef.lastIndexOf('/');

            String extension = minioRef.substring(dotIndex);
            String minioRefNoExtension = minioRef.substring(0, dotIndex);
            String fileName = String.format("%s%s", minioRefNoExtension.substring(lastSlash + 1), extension);
            String newMinioRef = String.format("/%s/%s/%s/%s", docsBucketPath, "titolario", newIdTitolario, fileName);

            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            boolean isChangedPath = minioFactory.moveFileToNewLocation(bucketName, allegato.getRiferimentoMinio(), newMinioRef);

            if(!isChangedPath){
                CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                        "Non è stato possibile spostare il documento nel path desiderato").boom();
            }

            allegato.setRiferimentoMinio(newMinioRef);
            allegato.persist();
            return true;

        }catch (Exception e){
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            String message = String.format("Errore nello spostamento dei file nel bucketStore: %s",e.getMessage());
            CustomException.get(CustomException.ErrorCode.INTERNAL, message).boom();
            return false;
        }
    }

    public List<AllegatoInput> escludiSegnaturaDaAllegatoInputList(List<AllegatoInput> allegatoInputList){
        return allegatoInputList.
                stream()
                .filter(allegato -> !allegato.getNome().startsWith("Segnatura"))
                .toList();
    }

    /***
     * Metodo che modifica il nome e descrizione del file Segnatura.xml in caso, venga modificato, il documento principale del protocollo.
     * Restituisce boolean per tener traccia dell'avvenuta operazione, utile per la storicizzazione.
     * @param protocollo - protocollo da aggiornare
     * @return boolean
     */
    public boolean renameSegnaturaNonValida(Protocollo protocollo){
        String nome = String.format("NON_VALIDA_Segnatura_%s.xml",
                Utils.fromDateToString(new Date(), Utils.DateFormat.DMY_HMS_COMPACT));

        String oggetto = String.format("Segnatura %s - fine validità: %s", protocollo.getNProtocollo(),
                Utils.fromDateToString(new Date(), Utils.DateFormat.DMY_HM));

        return protocollo.getAllegati().stream()
                .filter(allegato -> allegato.getNome().startsWith("Segnatura"))
                .findFirst()
                .map(allegato -> {
                    byte[] fileBites = {};
                    try{
                        InputStream is = downloadByRef(allegato.getRiferimentoMinio());
                        fileBites = is.readAllBytes();
                    } catch (Exception e){
                        log.error("error");
                    }
                    allegato.setNome(nome);
                    allegato.setOggetto(oggetto);
                    allegato.setImpronta(calculateImpronta(allegato.getNome(), fileBites));
                    return true;
                })
                .orElse(false);
    }

    public Allegato findFirstByImpronta(String impronta) {
        return em.createQuery("SELECT a FROM Allegato a WHERE a.impronta = :impronta", Allegato.class)
                .setParameter("impronta", impronta)
                .getResultList().stream()
                .findFirst()
                .orElse(null);
    }


    public void deleteAllegatiNonUtilizzati() {

        //1. Allegati da eliminare da MinIO e dal DB
        String query = "(protocollo is null and idEmail is null and titolario is null)";
        List<Allegato> listAllegati = Allegato.find(query).page(0, 100).list();

        for(Allegato allegato : listAllegati) {
            Allegato otherAllegatoUsed = (Allegato) Allegato.find("(protocollo is not null or idEmail is not null or titolario is not null) and impronta = ?1", allegato.getImpronta()).firstResultOptional().orElse(null);
            if (otherAllegatoUsed == null) {
                try {
                    deleteByRef(allegato.getRiferimentoMinio());
                }
                catch(Exception ignored) {}
            }
            allegato.delete();
        }
    }

    /**
     * Servizio che restituisce una lista di allegati paginata
     * accetta la ricerca globale, sort, paginazione
     * @param dto - conterrà tutti i parametri in input che vengono dai filtri
     * @return
     */
    @ExceptionChecked
    public AllegatiOutputDTO getAllegati(RicercaAllegatiDTO dto) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (!ssoManager.hasJwtToken()) {
            return new AllegatiOutputDTO(new ArrayList<>(), 0, 0);
        }

        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());
        if(dto.getIdTitolario() == null && dto.getIdProtocollo() == null)
            throw new IllegalArgumentException("idTitolario e idProtocollo non possono essere entrambi nulli");


        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("(discarded is null OR discarded = false) ");

        if(dto.getIdTitolario() != null) {
            query.append("and titolario.id = :idTitolario ");
            params.put("idTitolario", dto.getIdTitolario());
        }

        if(dto.getIdProtocollo() != null){
            query.append("and protocollo.id = :idProtocollo ");
            params.put("idProtocollo", dto.getIdProtocollo());
        }

        if(dto.hasSearch()){
            query.append("and (:search = '' ")
                    .append("or lower(nome) like LOWER(concat('%', :search, '%'))) ");
            params.put("search", dto.getSearch().trim());
        }

        log.info("[getAllegati] - Params = {}", params);

        PanacheQuery <Allegato> allegatiQuery = Allegato.find(query.toString(), sortCriteria, params);
        List<Allegato> allegati = allegatiQuery.page(Page.of(dto.getPage(), dto.getSize())).list();

        long totalResults = allegatiQuery.count();
        AllegatiOutputDTO outputDTO = new AllegatiOutputDTO(AllegatoDTO.fromAllegatiList(allegati), getPagesCount(totalResults, dto.getSize()), totalResults);

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return outputDTO;
    }

    @Transactional
    public AllegatiOutputDTO getAllegatiDiscarded(RicercaAllegatiDTO dto) {

        if (!ssoManager.hasJwtToken()) {
            return new AllegatiOutputDTO(new ArrayList<>(), 0, 0);
        }

        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

        if(dto.getIdProtocollo() == null)
            throw new IllegalArgumentException("idProtocollo non puo' essere null");

        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("discarded = :discarded ");
        params.put("discarded", true);

        query.append("and protocollo.id = :idProtocollo ");
        params.put("idProtocollo", dto.getIdProtocollo());

        if(dto.hasSearch()){
            query.append("and (:search = '' ")
                    .append("or lower(nome) like LOWER(concat('%', :search, '%'))) ");
            params.put("search", dto.getSearch().trim());
        }

        log.info("[getAllegatiDiscarded] - Params = {}", params);

        PanacheQuery <Allegato> allegatiQuery = Allegato.find(query.toString(), sortCriteria, params);
        List<Allegato> allegati = allegatiQuery.page(Page.of(dto.getPage(), dto.getSize())).list();

        long totalResults = allegatiQuery.count();
        return new AllegatiOutputDTO(AllegatoDTO.fromAllegatiList(allegati), getPagesCount(totalResults, dto.getSize()), totalResults);

    }

    @Transactional
    public boolean discardAllegato(Long idAllegato) {
        try {
            String idUtente = ssoManager.extractIdFromToken();
            String nomeUtente = ssoManager.extractNameFromToken();

            Allegato allegato = Allegato.findById(idAllegato);

            if(allegato == null)
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Allegato selezionato non trovato").boom();

            if(allegato.getIsMain()){
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile eliminare l'allegato principale").boom();
            }
            allegato.setDiscarded(Boolean.TRUE);
            allegato.persistAndFlush();

           storicoService.insertNewStoricoForIdDiscardResumeAllegati(allegato.getProtocollo(), idUtente, nomeUtente, String.format("ha spostato nel cestino l'allegato %s ", allegato.getNome()), null);
        } catch (Exception e){
            log.error(e.getMessage());
            CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
        }

        return true;
    }

    @Transactional
    public boolean resumeAllegato(Long idAllegato) {
        try {
            String idUtente = ssoManager.extractIdFromToken();
            String nomeUtente = ssoManager.extractNameFromToken();

            Allegato allegato = Allegato.findById(idAllegato);

            if(allegato == null)
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Allegato selezionato non trovato").boom();

            allegato.setDiscarded(Boolean.FALSE);
            allegato.persistAndFlush();

            storicoService.insertNewStoricoForIdDiscardResumeAllegati(allegato.getProtocollo(), idUtente, nomeUtente, String.format("ha ripristinato l'allegato %s ", allegato.getNome()), null);
        } catch (Exception e){
            log.error(e.getMessage());
            CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
        }

        return true;
    }

    @Override
    public PanacheQuery<Allegato> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<Allegato> getFindByIdQuery(Long id) {
        return null;
    }

}
