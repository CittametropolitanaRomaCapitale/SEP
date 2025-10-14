package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import io.quarkus.panache.common.Page;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.TagDTOList;
import it.parsec326.pi.intranet.dto.input.TagInput;
import it.parsec326.pi.intranet.dto.output.TagDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaTagDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.mapper.TagMapper;
import it.parsec326.pi.intranet.model.ReferentiProtocollo;
import it.parsec326.pi.intranet.model.Tag;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
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
public class TagService implements PanacheCustomEntityServiceInterface<Tag> {

    @Inject
    EntityManager entityManager;

    @Inject
    SSOClient ssoManager;

    @Inject
    TagMapper tagMapper;

    @Inject
    UserTransaction transaction;

    public List<Tag> findAllTag(String search) {
        String queryStr = "SELECT t FROM Tag t";
        if (search != null && !search.trim().isEmpty()) {
            queryStr += " WHERE LOWER(t.nome) LIKE LOWER(:search)";
        }
        queryStr += " ORDER BY t.nome ASC";
        TypedQuery<Tag> query = entityManager.createQuery(queryStr, Tag.class);
        if (search != null && !search.trim().isEmpty()) {
            query.setParameter("search", "%" + search + "%");
        }
        return query.getResultList();
    }

    @Transactional
    public Tag findTagById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Tag tag = entityManager.find(Tag.class, id);
        if (tag == null) {
            throw new EntityNotFoundException("Tag with ID " + id + " not found");
        }
        return tag;
    }

    public TagDTOList getTagListDTO(RicercaTagDTO dto){
        if (dto == null){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nell'elaborazione dei tag.").boom();
        }
        PanacheQuery<Tag> query = getTagQuery(dto);
        List<TagDTO> tagList = query.page(Page.of(dto.getPage(), dto.getSize()))
                .list()
                .stream()
                .map(this::convertToTagDTO)
                .toList();
        long totalResults = query.count();
        TagDTOList outputDTO = new TagDTOList(tagList, getPagesCount(totalResults, dto.getSize()), totalResults);

        return outputDTO;
    }

    public TagDTO convertToTagDTO(Tag entity){
        return TagDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .build();
    }

    public PanacheQuery<Tag> getTagQuery(RicercaTagDTO dto){
        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());
        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("id is not null ");
        if(dto.hasSearch()){
            String search = dto.getSearch().trim().toLowerCase().replace(" ", "");
            query.append("and (:search = '' ")
                    .append("or lower(REPLACE(nome, ' ', '')) like LOWER(concat('%', :search, '%')) ")
            .append(")");
            params.put("search", search);
        }
        return Tag.find(query.toString(), sortCriteria, params);
    }

    @Transactional
    public Tag saveTagInput(TagInput input) {
        if (!ssoManager.hasJwtToken()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non autorizzato.").boom();
        }
        if (!ssoManager.isUtenteAdmin()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non si dispone dei permessi per creare un tag.").boom();
        }
        if (input == null || input.getNome().isBlank()) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nell'elaborazione del tag.").boom();
        }
        return saveTag(tagMapper.toEntity(input));
    }

    @Transactional
    public Tag saveTag(Tag tag) {
        List<Tag> existingTags = findAllTag(tag.getNome().trim());
        boolean tagAlreadyExist = existingTags.stream().anyMatch(t -> t.getNome().trim().equalsIgnoreCase(tag.getNome().trim()));
        if (tagAlreadyExist) {
            CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                    "Errore: Esiste già un tag con questo nome.").boom();
        }
        return save(tag);
    }

    @Transactional
    public Tag updateTagInput(Long id, TagInput input) {
        if (!ssoManager.hasJwtToken()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non autorizzato.").boom();
        }
        if (!ssoManager.isUtenteAdmin()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non si dispone dei permessi per modificare un tag.").boom();
        }
        if (id == null || input == null || input.getNome().isBlank()) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella modifica del tag.").boom();
        }
        return updateTag(id, tagMapper.toEntity(input));
    }

    @Transactional
    public Tag updateTag(Long id, Tag tag) {
        Tag tagToUpdate = findTagById(id);
        // controllo se il tag nel frattempo è stato cancellato
        if (tagToUpdate == null) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.NOT_FOUND, "Tag da mdoificare non trovato").boom();
        }
        // controllo se esiste già un tag che si chiama nello stesso modo del nuovo nome
        List<Tag> existingTags = findAllTag(tag.getNome().trim());
        boolean tagAlreadyExist = existingTags.stream().filter(t -> !Objects.equals(t.getId(), id)).anyMatch(t -> t.getNome().trim().equalsIgnoreCase(tag.getNome().trim()));
        if (tagAlreadyExist) {
            CustomException.get(CustomException.ErrorCode.BAD_REQUEST,
                    "Errore: Esiste già un tag con questo nome.").boom();
        }
        tagToUpdate.setNome(tag.getNome());
        tagToUpdate.persistAndFlush();
        tag.setId(tagToUpdate.getId());
        return tag;
    }

    @Transactional
    public boolean deleteTag(Long id) {
        if (!ssoManager.hasJwtToken()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non autorizzato.").boom();
        }
        if (!ssoManager.isUtenteAdmin()) {
            CustomException.get(CustomException.ErrorCode.UNAUTHORIZED,
                    "Errore: non si dispone dei permessi per eliminare un tag.").boom();
        }
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        if (id == null)
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Parametro id obbligatorio non trovato").boom();

        Tag tag = Tag.findById(id);
        if (tag == null) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.NOT_FOUND, "Tag da eliminare non trovato").boom();
        }
        boolean tagUsed = ReferentiProtocollo.find("idDestinatario = ?1 and tipoDestinatario = ?2", id, "tag").count() > 0;
        if (tagUsed) {
            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            CustomException.get(CustomException.ErrorCode.BAD_REQUEST, "Impossibile eliminare il tag, viene già utilizzato in un protocollo.").boom();
        }
        tag.delete();
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return true;
    }


    @Override
    public PanacheQuery<Tag> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<Tag> getFindByIdQuery(Long id) {
        return null;
    }

    @Override
    public UserTransaction getTransaction() {
        return null;
    }
}
