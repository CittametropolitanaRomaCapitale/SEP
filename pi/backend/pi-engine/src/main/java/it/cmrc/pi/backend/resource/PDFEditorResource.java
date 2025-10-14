package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.service.DocumentService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.io.IOException;
import java.util.Date;

@GraphQLApi
public class PDFEditorResource {

    @Inject
    DocumentService documentService;

    @Query("generateRicevuta")
    public String downloadPdf(String nProtocollo) throws IOException {
        Protocollo protocollo = Protocollo.find("nProtocollo", nProtocollo).firstResult();
        return documentService.createPdfRicevuta(protocollo);
    }

    @Query(value = "getPdfRegistroGiornaliero")
    public String getPdfRegistroGiornaliero(@Name("data") Date data) {
        return documentService.getPdfRegistroGiornaliero(data);
    }
}
