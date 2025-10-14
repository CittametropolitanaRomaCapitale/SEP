package it.parsec326.pi.intranet.service;

import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.Email;
import it.parsec326.pi.intranet.model.PecOperation;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.utils.common.Operazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@ApplicationScoped
public class PecOperationService {

    @Inject
    EntityManager em;

    @Transactional
    public void insertPecOperation(Protocollo protocollo, String cdrCode, String idUtente, String nomeUtente, Operazione operazione) {
        try {
            // Recupero tutte le email associate al protocollo in un'unica query
            List<Email> emails = Email.find("protocollo.id", protocollo.getId()).list();

            // Precaricamento delle PecOperation associate alle email in un'unica query
            List<PecOperation> existingOperations = em.createQuery(
                            "SELECT po FROM PecOperation po WHERE po.protocollo.id = :idProtocollo AND po.email IN :emails AND po.cdrCode = :cdrCode", PecOperation.class)
                    .setParameter("idProtocollo", protocollo.getId())
                    .setParameter("emails", emails)
                    .setParameter("cdrCode", cdrCode)
                    .getResultList();

            // Creiamo una mappa per accesso rapido
            Map<Long, PecOperation> operationMap = new HashMap<>();
            for(PecOperation existingOperation : existingOperations) {
                operationMap.put(existingOperation.getEmail().getId(), existingOperation);
            }

            Date now = Calendar.getInstance().getTime();

            for (Email email : emails) {
                PecOperation pecOperation = operationMap.get(email.getId());

                if (pecOperation != null) { // Se l'operazione esiste già, aggiorniamola
                    pecOperation.setIdUtente(idUtente);
                    pecOperation.setNomeUtente(nomeUtente);
                    pecOperation.setLastOperation(operazione);
                    pecOperation.setTsUpdate(now);
                    em.merge(pecOperation); // Uso di merge anziché persist
                } else { // Altrimenti, creiamo un nuovo record
                    pecOperation = PecOperation.builder()
                            .protocollo(protocollo)
                            .email(email)
                            .cdrCode(cdrCode)
                            .idUtente(idUtente)
                            .nomeUtente(nomeUtente)
                            .lastOperation(operazione)
                            .tsCreation(now)
                            .build();

                    em.persist(pecOperation); // Persistiamo il nuovo record
                }

                if (Operazione.classificazione.toString().equalsIgnoreCase(operazione.toString())) {
                    email.setClassificazione("SI");
                    em.merge(email); // Uso di merge per l'aggiornamento
                }
            }
        } catch (Exception e) {
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore imprevisto durante la: " + operazione.toString(), e);
        }
    }



}
