package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.service.BarcodeGeneratorService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;

import java.io.IOException;

@GraphQLApi
public class BarcodeGeneratorResource {
    @Inject
    BarcodeGeneratorService barcodeGeneratorService;

    @Query("generateBarcode")
    public String generateBarcode(String nProtocollo) throws IOException {
        return barcodeGeneratorService.generateBarcodeBase64(nProtocollo);
    }
}
