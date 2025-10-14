package it.parsec326.pi.intranet.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DistributedLockService {
  private static final String BLOCKING_QUERY_TXT = "SELECT count(*) FROM pg_advisory_xact_lock( :lockId )";

  @Inject
  private EntityManager em;

  @Transactional(Transactional.TxType.MANDATORY)
  public void blockingLock(long lockId) {
    Query query = em.createNativeQuery(BLOCKING_QUERY_TXT);
    query.setParameter("lockId", lockId);
    query.getSingleResult();
  }
}
