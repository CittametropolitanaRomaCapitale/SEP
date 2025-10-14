package it.cmrc.sso.util;

import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import io.minio.messages.Item;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.enterprise.context.ApplicationScoped;
import java.io.*;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

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

    @ApplicationScoped
    MinioClient provide() {
        return MinioClient.builder()
                .endpoint(minioHost, minioPort, minioSecure)
                .credentials(minioUsername, minioPassword)
                .build();
    }

    public boolean uploadFile(String bucketName, String documentFileName) {

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
                            .object(documentFileName)
                            .build());

            return true;

        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean existsFile(String bucketName, String documentFilePrefix, String fileName) {

        MinioClient minioClient = provide();
        try {

            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                return false;
            }

            boolean fileFound = false;

            for (Result<Item> d : minioClient.listObjects(
                    ListObjectsArgs.builder()
                            .bucket(bucketName)
                            .prefix(documentFilePrefix)
                            .build())) {
                try {
                    fileFound |= (d.get() != null && d.get().size() > 0 && d.get().objectName().equalsIgnoreCase(fileName));
                } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
                    e.printStackTrace();
                }
            }

            return fileFound;

        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            e.printStackTrace();
            return false;
        }
    }

    public String getSharableLink(String bucketName, String documentFileName, int time, TimeUnit unit) {

        MinioClient minioClient = provide();
        try {

            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                throw new RuntimeException("Bucket not found exception!");
            } else {
                log.info("Bucket " + bucketName + " already exists.");
            }

            log.info("Generating link for file {} - [{}]", bucketName, documentFileName);

            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder().
                            bucket(bucketName)
                            .object(documentFileName)
                            .method(Method.GET)
                            .expiry(time, unit).build());

        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void copyInputStreamToFile(InputStream inputStream, File file)
            throws IOException {

        // append = false
        try (FileOutputStream outputStream = new FileOutputStream(file, false)) {
            int read;
            byte[] bytes = new byte[DEFAULT_BUFFER_SIZE];
            while ((read = inputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, read);
            }
        }

    }

}
