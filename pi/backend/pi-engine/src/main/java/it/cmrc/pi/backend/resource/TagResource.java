package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.TagDTOList;
import it.parsec326.pi.intranet.dto.input.TagInput;
import it.parsec326.pi.intranet.dto.ricerca.RicercaTagDTO;
import it.parsec326.pi.intranet.service.TagService;
import it.parsec326.pi.intranet.model.Tag;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import jakarta.inject.Inject;

import java.util.List;

@GraphQLApi
public class TagResource {

    @Inject
    TagService tagService;

    @Query(value = "getAllTag")
    public List<Tag> getAllTag(@Name("search") String search) {
        return tagService.findAllTag(search);
    }

    @Query(value = "getTagList")
    public TagDTOList getTagList(@Name("searchTag") RicercaTagDTO searchTagDTO) {
        return tagService.getTagListDTO(searchTagDTO);
    }

    @Mutation(value = "saveTag")
    public Tag saveTag(@Name("tagInput") TagInput input) {
        return tagService.saveTagInput(input);
    }

    @Mutation(value = "updateTag")
    public Tag updateTag(@Name("id") Long id, @Name("tagInput") TagInput input) {
        return tagService.updateTagInput(id, input);
    }

    @Mutation(value = "deleteTag")
    public boolean deleteTag(@Name("id") Long id) {
        return tagService.deleteTag(id);
    }
}
