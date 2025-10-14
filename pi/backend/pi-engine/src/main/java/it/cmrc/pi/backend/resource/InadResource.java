package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.client.InadClient;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
public class InadResource {

    @Inject
    InadClient inadClient;

    @Query(value = "getContattoInad")
    public String getContattoInad(@Name("codiceFiscale") String codiceFiscale) {
        return inadClient.getContattoInad(codiceFiscale,  "cmrc");
    }
}
