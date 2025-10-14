package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import it.parsec326.pi.intranet.model.Ufficio;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.SortInput;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.UserTransaction;
import lombok.Getter;

@ApplicationScoped
public class UfficioService implements PanacheCustomEntityServiceInterface<Ufficio> {

    @Inject @Getter
    UserTransaction transaction;
    @Inject
    EntityManager em;

    public Ufficio findByCdrCode(String cdrCode){
        return em.createNamedQuery("findOfficeByCdrCode", Ufficio.class)
                .setParameter("cdrCode", cdrCode)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    public Ufficio isUfficioPersistent(Ufficio ufficio){
        return em.createNamedQuery("findOfficeByCodeAndCdrCode", Ufficio.class)
                .setParameter("cdr", ufficio.getCdr())
                .setParameter("cdrCode", ufficio.getCdrCode())
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public PanacheQuery<Ufficio> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<Ufficio> getFindByIdQuery(Long id) {
        return null;
    }
}
