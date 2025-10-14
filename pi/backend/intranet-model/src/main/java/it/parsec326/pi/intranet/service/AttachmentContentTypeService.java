package it.parsec326.pi.intranet.service;

import it.parsec326.pi.intranet.model.AttachmentContentType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class AttachmentContentTypeService {

    @Inject
    EntityManager entityManager;

    @Transactional
    public AttachmentContentType findByContentType(String contentType) {
        return entityManager.createQuery("SELECT a FROM AttachmentContentType a WHERE a.type = :contentType", AttachmentContentType.class)
                .setParameter("contentType", contentType)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public AttachmentContentType findByExtension(String extension) {
        return entityManager.createQuery("SELECT a FROM AttachmentContentType a WHERE lower(a.extension) = :extension", AttachmentContentType.class)
                .setParameter("extension", extension.toLowerCase())
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public boolean isValidContentType(String contentType) {
        return findByContentType(contentType) != null;
    }

    public List<String> getAllExtensions(){
        TypedQuery<AttachmentContentType> query = entityManager
                .createQuery("select a from AttachmentContentType a", AttachmentContentType.class);

        return query.getResultList().stream()
                .map(AttachmentContentType::getExtension)
                .toList();
    }
}
