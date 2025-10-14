package it.parsec326.pi.intranet.utils;

import io.minio.*;
import io.minio.errors.*;
import it.parsec326.pi.intranet.exception.CustomException;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Slf4j
public class MinioConnectionFactory {

    @ConfigProperty(name = "minio.host")
    public String minioHost;

    @ConfigProperty(name = "minio.port")
    public int minioPort;

    @ConfigProperty(name = "minio.secure")
    public boolean minioSecure;

    @ConfigProperty(name = "minio.username")
    public String minioUsername;

    @ConfigProperty(name = "minio.password")
    public String minioPassword;

    public static final int DEFAULT_BUFFER_SIZE = 8192;

    public static final String LOGO_FIRMA_FILENAME = "logo_firma";

    public static final String ANAC_TEMPLATE = "anac_template.csv";
    public static final String ANAC_TEMPLATE_GRUPPI = "anac_template_gruppi.csv";

    @ApplicationScoped
    MinioClient provide() {
        return MinioClient.builder()
                .endpoint(minioHost, minioPort, minioSecure)
                .credentials(minioUsername, minioPassword)
                .build();
    }

    public void checkFileExistsInMinio(String bucketName, String minioRef) {
        MinioClient minioClient = provide();
        try {
            minioClient.statObject(
                    io.minio.StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(minioRef)
                            .build()
            );

        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            CustomException.get(CustomException.ErrorCode.NOT_FOUND,e).boom();
        }
    }


    public boolean uploadFileWithFilename(String bucketName, String minioFileName, String documentFileName) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        MinioClient minioClient = provide();
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            } else {
                log.info("Bucket " + bucketName + " already exists.");
            }

            minioClient.uploadObject(
                    UploadObjectArgs.builder()
                            .filename(documentFileName)
                            .bucket(bucketName)
                            .object(minioFileName)
                            .build());

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return true;

        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            log.error("Error occurred: {}", e.getMessage(), e);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nell'upload del file da Minio").boom();
        }

        return false;
    }

    public boolean moveFileToNewLocation(String bucketName, String oldMinioRef, String newMinioRef) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        MinioClient minioClient = provide();
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            } else {
                log.info("Bucket " + bucketName + " already exists.");
            }

            CopySource source = CopySource.builder()
                    .bucket(bucketName)
                    .object(oldMinioRef)
                    .build();

            // se supera questo check il file esiste in minio e può essere successivamente spostato
            this.checkFileExistsInMinio(bucketName, oldMinioRef);
            log.info("File: {}, esiste nel bucket:{}", oldMinioRef, bucketName);

            // si copia il file ottenuto dall source nella nuova location
            minioClient.copyObject(
                    CopyObjectArgs.builder()
                            .bucket(bucketName)
                            .source(source)
                            .bucket(bucketName)
                            .object(newMinioRef)
                            .build());
            log.info("File: {}, spostato nel nuovo path con riferimento:{}", oldMinioRef, newMinioRef);

            // elimino il file dalla precedente location
            this.deleteFile(bucketName, oldMinioRef);

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return true;

        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            log.error("Error occurred: {}", e.getMessage(), e);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nello spostamento del file").boom();

        }
        return false;
    }

    public boolean uploadFileByBais(String bucketName, String minioFileName, ByteArrayInputStream stream, long objectSize, long partSize ) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        MinioClient minioClient = provide();
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            } else {
                log.info("Bucket " + bucketName + " already exists.");
            }

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(minioFileName)
                            .stream(stream, objectSize, partSize)
                            .build());

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return true;

        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            log.error("Error occurred: {}", e.getMessage(), e);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nell'upload del file da Minio").boom();

        }
        return false;
    }

    public boolean deleteFile(String bucketName, String filePath) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        MinioClient minioClient = provide();
        try {
            // Verifica l'esistenza del bucket
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                log.info("Bucket " + bucketName + " does not exist.");
                return false;
            }

            // Elimina il file dal bucket
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filePath)
                            .build());

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);

            log.info("File {} deleted successfully from {}.", filePath, bucketName);
            return true;

        } catch (ErrorResponseException | InsufficientDataException | InternalException |
                 InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException |
                 ServerException | XmlParserException | IOException e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            log.error("Error occurred: {}", e.getMessage(), e);
            CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nell'eliminazione del file da Minio").boom();
            return false;
        }
    }

    public InputStream downloadFile(String bucketName, String filePath) {
        MinioClient minioClient = provide();
        try {
            // Verifica l'esistenza del bucket
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                log.info("Bucket " + bucketName + " does not exist.");
                throw new IllegalArgumentException("Bucket " + bucketName + " does not exist.");
            }

            // Scarica il file dal bucket
            InputStream result = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filePath)
                            .build());

            log.info("File {} was downloaded successfully from {}.", filePath, bucketName);
            return result;

        } catch (ErrorResponseException | InsufficientDataException | InternalException |
                 InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException |
                 ServerException | XmlParserException | IOException e) {
            log.error("Error occurred: {}", e.getMessage(), e);
            throw new RuntimeException("Error occurred while downloading file: " + e.getMessage(), e);
        }
    }
}
