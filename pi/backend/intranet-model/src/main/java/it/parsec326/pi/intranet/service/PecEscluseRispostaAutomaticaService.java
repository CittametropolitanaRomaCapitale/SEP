package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.PecEscluseRispostaAutomaticaDTOList;
import it.parsec326.pi.intranet.dto.input.PecEscluseRispostaAutomaticaInput;
import it.parsec326.pi.intranet.dto.output.PecEscluseRispostaAutomaticaDTO;
import it.parsec326.pi.intranet.mapper.PecEscluseRispostaAutomaticaMapper;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.dto.ricerca.RicercaPecEscluseRispostaAutomaticaDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.PecEscluseRispostaAutomatica;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.SortInput;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@ApplicationScoped
public class PecEscluseRispostaAutomaticaService implements PanacheCustomEntityServiceInterface<PecEscluseRispostaAutomatica> {

    @Inject
    EntityManager entityManager;

    @Inject
    SSOClient ssoManager;

    @Inject
    PecEscluseRispostaAutomaticaMapper pecEscluseRispostaAutomaticaMapper;

    @Inject
    UserTransaction transaction;

    public List<PecEscluseRispostaAutomatica> findAllPecEscluse(String search) {
        String queryStr = "SELECT p FROM PecEscluseRispostaAutomatica p";
        if (search != null && !search.trim().isEmpty()) {
            queryStr += " WHERE LOWER(p.indirizzo) LIKE LOWER(:search)";
        }
        queryStr += " ORDER BY p.indirizzo ASC";
        TypedQuery<PecEscluseRispostaAutomatica> query = entityManager.createQuery(queryStr, PecEscluseRispostaAutomatica.class);
        if (search != null && !search.trim().isEmpty()) {
            query.setParameter("search", "%" + search + "%");
        }
        return query.getResultList();
    }

    @Transactional
    public PecEscluseRispostaAutomatica findPecEsclusaById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        PecEscluseRispostaAutomatica pec = entityManager.find(PecEscluseRispostaAutomatica.class, id);
        if (pec == null) {
            throw new EntityNotFoundException("Pec with ID " + id + " not found");
        }
        return pec;
    }

    public PecEscluseRispostaAutomaticaDTOList getPecEscluseListDTO(RicercaPecEscluseRispostaAutomaticaDTO dto){
        if (dto == null){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nell'elaborazione delle pec.").boom();
        }
        PanacheQuery<PecEscluseRispostaAutomatica> query = getPecEscluseQuery(dto);
        List<PecEscluseRispostaAutomaticaDTO> pecEscluseList = query.page(Page.of(dto.getPage(), dto.getSize()))
                .list()
                .stream()
                .map(this::convertToPecEscluseDTO)
                .toList();
        long totalResults = query.count();
        PecEscluseRispostaAutomaticaDTOList outputDTO = new PecEscluseRispostaAutomaticaDTOList(pecEscluseList, getPagesCount(totalResults, dto.getSize()), totalResults);

        return outputDTO;
    }

    public PecEscluseRispostaAutomaticaDTO convertToPecEscluseDTO(PecEscluseRispostaAutomatica entity){
        return PecEscluseRispostaAutomaticaDTO.builder()
                .id(entity.getId())
                .indirizzo(entity.getIndirizzo())
                .tsCreation(entity.getTsCreation())
                .build();
    }

    public PanacheQuery<PecEscluseRispostaAutomatica> getPecEscluseQuery(RicercaPecEscluseRispostaAutomaticaDTO dto){
        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());
        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("id is not null ");
        if(dto.hasSearch()){
            String search = dto.getSearch().trim().toLowerCase().replace(" ", "");
            query.append("and (:search = '' ")
                    .append("or lower(REPLACE(indirizzo, ' ', '')) like LOWER(concat('%', :search, '%')) ")
                    .append(")");
            params.put("search", search);
        }
        return PecEscluseRispostaAutomatica.find(query.toString(), sortCriteria, params);
    }

    @Transactional
    public PecEscluseRispostaAutomatica savePecEsclusaInput(PecEscluseRispostaAutomaticaInput input) {
        if (!ssoManager.hasJwtToken()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non autorizzato.").boom();
        }
        if (!ssoManager.isUtenteAdmin()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non si dispone dei permessi per creare una pec.").boom();
        }
        if (input == null || input.getIndirizzo().isBlank()) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nell'elaborazione della pec.").boom();
        }
        return savePecEsclusa(pecEscluseRispostaAutomaticaMapper.toEntity(input));
    }

    @Transactional
    public PecEscluseRispostaAutomatica savePecEsclusa(PecEscluseRispostaAutomatica pec) {
        List<PecEscluseRispostaAutomatica> existingPec = findAllPecEscluse(pec.getIndirizzo().trim());
        boolean pecAlreadyExist = existingPec.stream().anyMatch(p -> p.getIndirizzo().trim().equalsIgnoreCase(pec.getIndirizzo().trim()));
        if (pecAlreadyExist) {
            CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                    "Errore: Esiste già una pec con questo nome.").boom();
        }
        pec.setIndirizzo(pec.getIndirizzo().trim());
        return save(pec);
    }

    @Override
    public PanacheQuery<PecEscluseRispostaAutomatica> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<PecEscluseRispostaAutomatica> getFindByIdQuery(Long id) {
        return null;
    }

    @Override
    public UserTransaction getTransaction() {
        return null;
    }

    @Transactional
    public PecEscluseRispostaAutomatica updatePecEsclusaInput(Long id, PecEscluseRispostaAutomaticaInput input) {
        if (!ssoManager.hasJwtToken()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non autorizzato.").boom();
        }
        if (!ssoManager.isUtenteAdmin()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non si dispone dei permessi per modificare una pec.").boom();
        }
        if (id == null || input == null || input.getIndirizzo().isBlank()) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella modifica della pec.").boom();
        }
        return updatePecEsclusa(id, pecEscluseRispostaAutomaticaMapper.toEntity(input));
    }

    @Transactional
    public PecEscluseRispostaAutomatica updatePecEsclusa(Long id, PecEscluseRispostaAutomatica pec) {
        PecEscluseRispostaAutomatica pecToUpdate = findPecEsclusaById(id);
        // controllo se la pec nel frattempo è stato cancellato
        if (pecToUpdate == null) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.NOT_FOUND, "Pec da mdoificare non trovato").boom();
        }
        // controllo se esiste già una pec con lo stesso indirizzo che voglio salvare
        List<PecEscluseRispostaAutomatica> existingPec = findAllPecEscluse(pec.getIndirizzo().trim());
        boolean pecAlreadyExist = existingPec.stream().filter(p -> !Objects.equals(p.getId(), id)).anyMatch(p-> p.getIndirizzo().trim().equalsIgnoreCase(pec.getIndirizzo().trim()));
        if (pecAlreadyExist) {
            CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                    "Errore: Esiste già una pec con questo indirizzo.").boom();
        }
        pecToUpdate.setIndirizzo(pec.getIndirizzo());
        pecToUpdate.persistAndFlush();
        pec.setId(pecToUpdate.getId());
        return pec;
    }

    @Transactional
    public boolean deletePecEsclusa(Long id) {
        if (!ssoManager.hasJwtToken()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non autorizzato.").boom();
        }
        if (!ssoManager.isUtenteAdmin()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non si dispone dei permessi per eliminare una pec.").boom();
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        if (id == null)
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Parametro id obbligatorio non trovato").boom();

        PecEscluseRispostaAutomatica pec = PecEscluseRispostaAutomatica.findById(id);
        if (pec == null) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.NOT_FOUND, "Pec da eliminare non trovato").boom();
        }
        pec.delete();
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }
}
