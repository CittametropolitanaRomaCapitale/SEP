package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.security.UnauthorizedException;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.PecRegoleDTO;
import it.parsec326.pi.intranet.dto.input.PecRegolaFinestraTemporaleInput;
import it.parsec326.pi.intranet.dto.input.PecRegolaInputDTO;
import it.parsec326.pi.intranet.mapper.PecRegolaMapper;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.SortInput;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.extern.slf4j.Slf4j;

import java.time.*;
import java.util.*;


@ApplicationScoped
@Slf4j
public class PecRegoleService  implements PanacheCustomEntityServiceInterface<PecRegola> {

    @Inject
    PecRegolaMapper mapper;

    @Inject
    SSOClient ssoClient;

    @Inject
    EmailService emailService;

    @Transactional
    public PecRegola getFirstNonVerified(PecPeo pecToScan, LocalDateTime dateTime) {

        List<PecRegola> regole = PecRegola.find("idEmail = ?1 AND enabled = true", pecToScan.getId()).list();

        DayOfWeek currentDay = dateTime.getDayOfWeek();
        LocalTime currentTime = dateTime.toLocalTime();

        for(PecRegola regola : regole) {
            boolean isFinestraAttiva = false;
            for (PecRegolaFinestraTemporale window : regola.getFinestre()) {
                if (window.getDayOfWeek() == currentDay.getValue() &&
                        !currentTime.isBefore(window.getStartTime()) &&
                        !currentTime.isAfter(window.getEndTime())) {
                    isFinestraAttiva = true;
                    break;
                }
            }
            if (!isFinestraAttiva) {
                continue;
            }

            LocalDateTime from = dateTime.minusMinutes(regola.getDurationMinutes());

            long count = emailService.countPecs(pecToScan.getIndirizzoEmail(), from, dateTime, regola.getIdCategoriaRegola() == PecRegola.CATEGORIA_REGOLA_PEC_USCITA_MIN || regola.getIdCategoriaRegola() == PecRegola.CATEGORIA_REGOLA_PEC_USCITA_MAX);
            if (regola.isError(count)) {
                regola.setCountToVerify(count);
                return regola;
            }
        }
        return null;
    }

    @Transactional
    public PecRegolaFinestraTemporale findOrCreateFinestra(PecRegolaFinestraTemporaleInput input) {
        if (input == null) return null;

        // converto da localtime a string
        LocalTime startTime = LocalTime.parse(input.start);
        LocalTime endTime = LocalTime.parse(input.end);

        PecRegolaFinestraTemporale existing = PecRegolaFinestraTemporale
                .find("dayOfWeek = ?1 and startTime = ?2 and endTime = ?3",
                        input.dayOfWeek, startTime, endTime)
                .firstResult();

        if (existing != null) return existing;

        // Creazione nuova finestra
        PecRegolaFinestraTemporale nuova = new PecRegolaFinestraTemporale();
        nuova.dayOfWeek = (short)Math.toIntExact(input.dayOfWeek);
        nuova.startTime = startTime;
        nuova.endTime = endTime;

        nuova.persist();
        return nuova;
    }


    @Transactional
    public PecRegolaInputDTO saveRegola(PecRegolaInputDTO input) {
        if (input == null) {
            throw new RuntimeException("Input non può essere nullo");
        }
        if (!ssoClient.hasJwtToken() || !ssoClient.isUtenteAdmin()) {
            throw new UnauthorizedException("Non si possiede l'autorizzazione");
        }

        Set<PecRegolaFinestraTemporale> finestre = new HashSet<>();
        for(PecRegolaFinestraTemporaleInput finestraInput : input.finestre) {
            finestre.add(findOrCreateFinestra(finestraInput));
        }


        PecRegola regola = getForEmailAndCategory(input.idEmail, input.idCategoriaRegola);
        if (regola == null) {
            PecRegola regolaToInsert = mapper.toEntity(input);
            regolaToInsert.setFinestre(finestre);
            regolaToInsert.persist();
            return mapper.toDto(regolaToInsert);
        }

        regola.setEnabled(input.enabled);
        regola.setThreshold(input.threshold);
        regola.setDurationMinutes(input.durationMinutes);
        regola.setFinestre(finestre);
        regola.persist();
        return mapper.toDto(regola);
    }

    @Transactional
    public boolean deleteRegola(Long idEmail, Long idCategory) {
        if (idEmail == null || idCategory == null) {
            throw new RuntimeException("Input non può essere nullo");
        }
        if (!ssoClient.hasJwtToken() || !ssoClient.isUtenteAdmin()) {
            throw new UnauthorizedException("Non si possiede l'autorizzazione");
        }
        return PecRegola.delete("idEmail = ?1 AND idCategoriaRegola = ?2", idEmail, idCategory) > 0;
    }

    public PecRegoleDTO getForEmail(Long idEmail) {
        if (idEmail == null) {
            throw new RuntimeException("Input non può essere nullo");
        }
        if (!ssoClient.hasJwtToken() || !ssoClient.isUtenteAdmin()) {
            throw new UnauthorizedException("Non si possiede l'autorizzazione");
        }
        List<PecRegola> list = PecRegola.find("idEmail = ?1", idEmail).list();
        PecRegoleDTO output = new PecRegoleDTO();
        output.list = new ArrayList<>();
        for(PecRegola regola : list) {
            output.list.add(mapper.toDto(regola));
        }
        return output;
    }

    public PecRegola getForEmailAndCategory(Long idEmail, Long idCategory) {
        if (idEmail == null || idCategory == null) {
            throw new RuntimeException("Input non può essere nullo");
        }
        if (!ssoClient.hasJwtToken() || !ssoClient.isUtenteAdmin()) {
            throw new UnauthorizedException("Non si possiede l'autorizzazione");
        }
        return PecRegola.find("idEmail = ?1 AND idCategoriaRegola = ?2", idEmail, idCategory).firstResult();
    }


    @Override
    public PanacheQuery<PecRegola> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<PecRegola> getFindByIdQuery(Long id) {
        return null;
    }

    @Override
    public UserTransaction getTransaction() {
        return null;
    }
}
