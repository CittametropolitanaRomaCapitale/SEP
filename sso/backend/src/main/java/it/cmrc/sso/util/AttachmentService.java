package it.cmrc.sso.util;

import it.cmrc.sso.entity.Attachment;
import lombok.Getter;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.SystemException;
import javax.transaction.Transactional;
import javax.transaction.UserTransaction;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class AttachmentService {

    @Inject
    MinioConnectionFactory minioFactory;


    public Attachment findById(Long id) {
        return Attachment.find("id = :id", Map.of("id", id)).firstResult();
    }

    @Transactional
    public Attachment save(InputStream stream, Attachment insert) {
        File f = new File(insert.url);
        try {
            minioFactory.copyInputStreamToFile(stream, f);
            minioFactory.uploadFile("cmrc-sso-delegations", insert.url);
            f.delete();
            insert.persist();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return insert;
    }

    @Transactional
    public long multiDelete(Long delegationId){
        return Attachment.delete("delegation_id = :did", Map.of("did", delegationId));
    }

    @Inject
    @Getter
    UserTransaction transaction;
}
