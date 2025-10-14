package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.input.FileUploadForm;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.Allegato;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.RegistroGiornaliero;
import it.parsec326.pi.intranet.model.Titolario;
import it.parsec326.pi.intranet.service.AllegatoService;
import it.parsec326.pi.intranet.service.StoricoService;
import it.parsec326.pi.intranet.service.TitolarioService;
import it.parsec326.pi.intranet.utils.MinioConnectionFactory;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.StoricoOperazione;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Path("allegato")
@Slf4j
public class FileUploadRestService {

    @Inject
    AllegatoService allegatoService;

    @Inject
    TitolarioService titolarioService;

    @Inject
    StoricoService storicoService;

    @Inject
    MinioConnectionFactory minioFactory;

    @Inject
    SSOClient ssoManager;

    @ConfigProperty(name = "filezip.maxsize")
    Long maxSizeFileZip;

    @POST
    @Path("carica")
    @Consumes("multipart/form-data")
    public Response caricaAllegato(FileUploadForm input) {
        try {
            Allegato allegato = allegatoService.uploadAllegatiProtocollo(input);
            return Response.status(200).entity(allegato).build();
        } catch (Exception e) {
            e.printStackTrace();
            return CustomException.get(CustomException.ErrorCode.INTERNAL, e).restResponse();
        }
    }

    @GET
    @Path("download/{fileid}")
    public Response downloadAllegato(@PathParam("fileid") Long fileId) {
        try {
            Allegato allegato = Allegato.findById(fileId);
            String minioRef = allegato.getRiferimentoMinio();
            InputStream result = allegatoService.downloadByRef(minioRef);

            Protocollo protocollo = allegato.getProtocollo();
            if (protocollo != null) {
                StringBuilder sb = new StringBuilder();
                sb.append(StoricoOperazione.DownloadAllegato.getStatoParameter(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()) ? "Circolare" : "Protocollo"));
                sb.append(": (");
                sb.append(fileId);
                sb.append(") ");
                sb.append(allegato.getNome());
                String operazione = Utils.truncatetringToSize(sb.toString(), 255, "...");

                storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), operazione, null);
            }

            return Response.ok(result)
                    .header("Content-Disposition", "attachment; filename=\"" + allegato.getNome() + "\"")
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(String.format("Non è stato possibile scaricare l'allegato con id: %s", fileId)).build();
        }
    }


    @GET
    @Path("download/zip")
    @Produces("application/zip")
    public Response downloadAllegati(@QueryParam("idProtocollo") Long idProtocollo) {

        Protocollo protocollo = Protocollo.findById(idProtocollo);
        if (protocollo == null) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Protocollo non trovato.").build();
        }

        if (protocollo.getAllegati() == null || protocollo.getAllegati().size() == 0) { // Correzione: size() == 0
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore durante la generazione dello ZIP. Nessun allegato Presente").build();
        }

        protocollo.removeDiscardedAllegati();
        List<Allegato> allegatiList = protocollo.getAllegati();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zipOut = new ZipOutputStream(baos)) {

            Set<String> existingNames = new HashSet<>();

            for (Allegato allegato : allegatiList) {

                if (allegato == null) {
                    log.error("Allegato non trovato.");
                    continue;
                }

                String fileName = allegato.getNome();
                String baseName = fileName;
                String extension = "";

                int extensionIndex = fileName.lastIndexOf(".");

                if (extensionIndex != -1) {
                    baseName = fileName.substring(0, extensionIndex);
                    extension = fileName.substring(extensionIndex);
                }

                String uniqueName = fileName;
                int counter = 1;

                while (existingNames.contains(uniqueName)) {
                    uniqueName = baseName + "_" + counter + extension;
                    counter++;
                }

                existingNames.add(uniqueName);

                String minioRef = allegato.getRiferimentoMinio();
                InputStream fileStream = allegatoService.downloadByRef(minioRef);

                if (fileStream != null) {
                    ZipEntry zipEntry = new ZipEntry(uniqueName);
                    zipOut.putNextEntry(zipEntry);
                    fileStream.transferTo(zipOut);
                    zipOut.closeEntry();
                    fileStream.close();
                }
            }

            zipOut.finish();

            long maxSizeInBytes = maxSizeFileZip * 1024 * 1024;
            if (baos.size() > maxSizeInBytes) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Il file ZIP generato supera il limite di " + maxSizeFileZip.toString() + " MB.").build();
            }

            String objecHeader = String.format("attachment; filename=\"allegati_%s.zip\"", protocollo.getNProtocollo());
            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), "ha eseguito l'export degli allegati in formato zip", null);

            return Response.ok(baos.toByteArray())
                    .header("Content-Disposition", objecHeader)
                    .type("application/zip")
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore durante la generazione dello ZIP.").build();
        }
    }


    @GET
    @Path("download-registro/{registroId}")
    public Response downloadRegistro(@PathParam("registroId") Long registroId) {
        try {
            RegistroGiornaliero registro = RegistroGiornaliero.findById(registroId);
            String minioRef = registro.getRiferimentoMinio();
            InputStream result = allegatoService.downloadByRef(minioRef);

            return Response.ok(result)
                    .header("Content-Disposition", "attachment; filename=\"" + registro.getFile() + "\"")
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(String.format("Non è stato possibile scaricare il registro con id: %s", registroId)).build();
        }
    }

    @GET
    @Path("/{fileid}")
    public Response getAllegatoById(@PathParam("fileid") Long fileId) {
        try {
            Allegato allegato = Allegato.findById(fileId);
            String minioRef = allegato.getRiferimentoMinio();
            byte[] result = allegatoService.searchByRef(minioRef);

            return Response.ok(result).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(String.format("Non è stato possibile ottenere l'allegato con id: %s", fileId)).build();
        }
    }

    @GET
    @Path("/eml/{idEmail}")
    public Response getAllegatoEml(@PathParam("idEmail") Long idEmail) {
        try {
            byte[] result = allegatoService.getAllegatoEml(idEmail);
            return Response.ok(result).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(String.format("Non è stato possibile ottenere l'allegato con id: %s", idEmail)).build();
        }
    }

    @POST
    @Path("/upload/titolario")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadFile(FileUploadForm fileUploadForm,
                               @RestForm("selectedOffice") @PartType(MediaType.TEXT_PLAIN) String fileName,
                               @RestForm("idTitolario") @PartType(MediaType.TEXT_PLAIN) Long idTitolario,
                               @RestForm("selectedOffice") @PartType(MediaType.TEXT_PLAIN) String selectedOffice) {

        return allegatoService.insertAllegatoTitolario(fileUploadForm, idTitolario, selectedOffice);
    }

    @DELETE
    @Path("elimina/{fileid}")
    public Response eliminaAllegato(@PathParam("fileid") Long fileId) {
        try {
            boolean isDeleted = allegatoService.delete(fileId);
            if (isDeleted) {
                return Response.status(Response.Status.OK)
                        .entity(String.format("Allegato con id %s eliminato con successo", fileId)).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(String.format("Non è stato possibile eliminare l'allegato con id: %s", fileId)).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return CustomException.get(CustomException.ErrorCode.INTERNAL, e).restResponse();
        }
    }

    @DELETE
    @Path("elimina/titolario/{fileid}")
    public Response eliminaAllegatoTitolario(@PathParam("fileid") Long fileId) {
        try {
            boolean isDeleted = allegatoService.deleteAllegatoTitolario(fileId);
            if (isDeleted) {
                return Response.status(Response.Status.OK)
                        .entity(String.format("Allegato con id %s eliminato con successo", fileId)).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(String.format("Non è stato possibile eliminare l'allegato con id: %s", fileId)).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return CustomException.get(CustomException.ErrorCode.INTERNAL, e).restResponse();
        }
    }

    @GET
    @Path("download/titolario/zip/{id}/{cdrCode}")
    @Produces("application/zip")
    public Response downloadTitolarioZip(@PathParam("id") Long id, @PathParam("cdrCode") String cdrCode) {
        try {
            Map<Long, String> nameMap = new HashMap<>();
            Set<Titolario> result = titolarioService.getDescendantsForTitolarioId(id, cdrCode);
            Map<Long, Long> parentMap = titolarioService.getLongLongMap(nameMap, result);
            File zipFile = titolarioService.createTitolarioZip(result, parentMap, nameMap, cdrCode);
            byte[] zipBytes = Files.readAllBytes(zipFile.toPath());
            String filename = "titolario_" + Utils.fromDateToString(Calendar.getInstance().getTime(), Utils.DateFormat.DMY_HMS_COMPACT);
            String headerFilename = String.format("attachment; filename=\"%s\"", filename);
            return Response.ok(zipBytes)
                    .header("Content-Disposition", headerFilename)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore durante la generazione dello ZIP: " + e.getMessage()).build();
        }
    }
}