package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import it.parsec326.pi.intranet.model.EmailTemplate;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.UserTransaction;
import lombok.Getter;

@ApplicationScoped
public class EmailTemplateService implements PanacheCustomEntityServiceInterface<EmailTemplate> {

    @Inject
    EntityManager em;

    @Inject
    @Getter
    UserTransaction transaction;

    public EmailTemplate getTemplate(Operazione operazione, String tipologia) {

        return em.createNamedQuery("findTemplateByOperazioneAndTipologia", EmailTemplate.class)
                .setParameter("operazione", operazione)
                .setParameter("tipologia", tipologia)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public PanacheQuery<EmailTemplate> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<EmailTemplate> getFindByIdQuery(Long id) {
        return null;
    }

}