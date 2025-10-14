package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.service.AttachmentContentTypeService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
public class AttachmentContentTypeResource {

    @Inject
    AttachmentContentTypeService attachmentContentTypeService;

    @Query(value = "getAllExtensions")
    public List<String> getAllExtensions(){
        return attachmentContentTypeService.getAllExtensions();
    }
}
