package it.parsec326.pi.intranet.service;

import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.CircolareNumero;
import it.parsec326.pi.intranet.model.ProtocolloNumero;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import lombok.extern.slf4j.Slf4j;

import java.time.Year;

@Slf4j
@ApplicationScoped
public class NumeroProtocolloCircolareService {
    @Inject
    EntityManager em;
    @Inject
    DistributedLockService lockService;

    public int getAnnoCorrente() {
        return Year.now().getValue();
    }


    public String generateDistribuitedNumeroProtocollo() {
        lockService.blockingLock(1);

        try {
            int annoCorrente = getAnnoCorrente();
            ProtocolloNumero counter = findProtocolloNumeroByAnno(annoCorrente);

            long nextVal = 1;
            if(counter == null){
                log.info("Reset del progressivo protocollo, per il nuovo anno: {}",annoCorrente);
                ProtocolloNumero newCounter = new ProtocolloNumero(annoCorrente, nextVal);
                newCounter.persist();
            }else{
                nextVal = counter.getCount() + 1;
                counter.setCount(nextVal);
                counter.persist();
            }

            String formatCode = String.format("%s-%d-%07d","CMRC", annoCorrente, nextVal);
            log.info("Generato numero progressivo: {}", formatCode);

            return formatCode;
        } catch (Exception e) {
            log.error("Errore durante la generazione del numero protocollo: ", e);
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Transaction error - ",e.getMessage()).boom();
        }
        return null;
    }

    public ProtocolloNumero findProtocolloNumeroByAnno(int annoCorrente) {
        return em.createQuery("SELECT p FROM ProtocolloNumero p WHERE p.anno = :anno", ProtocolloNumero.class)
                .setParameter("anno", annoCorrente)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public String generateDistribuitedNumeroCircolare() {
        lockService.blockingLock(1);

        try {
            int annoCorrente = getAnnoCorrente();
            CircolareNumero counter = findCircolareNumeroByAnno(annoCorrente);

            long nextVal = 1;
            if(counter == null){
                log.info("Reset della progressiva circolare, per il nuovo anno: {}",annoCorrente);
                CircolareNumero newCounter = new CircolareNumero(annoCorrente, nextVal);
                newCounter.persist();
            }else{
                nextVal = counter.getCount() + 1;
                counter.setCount(nextVal);
                counter.persist();
            }

            String formatCode = String.format("CIRC-%d-%07d", annoCorrente, nextVal);
            log.info("Generato numero progressivo: {}", formatCode);

            return formatCode;
        } catch (Exception e) {
            log.error("Errore durante la generazione del numero protocollo: ", e);
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Transaction error - ",e.getMessage()).boom();
        }
        return null;
    }

    public CircolareNumero findCircolareNumeroByAnno(int annoCorrente) {
        return em.createQuery("SELECT p FROM CircolareNumero p WHERE p.anno = :anno", CircolareNumero.class)
                .setParameter("anno", annoCorrente)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
    }
}
