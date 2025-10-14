package it.cmrc.sso.resources;


import it.cmrc.sso.beans.UtentiExcel;
import it.cmrc.sso.entity.*;
import it.cmrc.sso.entity.common.PermitType;
import it.cmrc.sso.util.AttachmentService;
import it.cmrc.sso.util.MinioConnectionFactory;
import it.cmrc.sso.util.PermitService;
import it.cmrc.sso.util.UserOfficeService;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jboss.resteasy.annotations.jaxrs.PathParam;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Path("/api/docs")
@Slf4j
public class FileUploadRestService {



    @Inject
    MinioConnectionFactory minioConnectionFactory;

    @Inject
    AttachmentService service;

    @Inject
    PermitService permitService;

    @Inject
    UserOfficeService userOfficeService;

    @POST
    @Path("import_file")
    @Consumes("multipart/form-data")
    public Response loadImportFile(MultipartFormDataInput input) throws IOException {

        log.info("Avvio importazione");

        List<UtentiExcel> utenti = new ArrayList<>();

        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("uploadedFile");

        Long roleId = null;

        String ruolo = uploadForm.get("ruolo").get(0).getBody(String.class, null);
        if(ruolo.equals("redattore")){
            log.info("Ruolo redattore");
            roleId = 13L;
        } else if(ruolo.equals("responsabileprocedimento")){
            log.info("Ruolo responsabileprocedimento");
            roleId = 14L;
        }

        for (InputPart inputPart : inputParts) {
            try{

                Workbook workbook = new XSSFWorkbook(inputPart.getBody(InputStream.class,null));
                Sheet sheet = workbook.getSheetAt(0);
                int cont = 0;
                for (Row row : sheet) {
                    if (++cont > 1) {
                        Cell cell0 = row.getCell(0);
                        Cell cell4 = row.getCell(4);
                        if(cell0 != null  && cell4 != null) {
                            String username = cell0.getStringCellValue();
                            String ncdrId = cell4.getCellType().equals(CellType.NUMERIC) ? (((long)cell4.getNumericCellValue()) + "") : cell4.getStringCellValue();
                            utenti.add(new UtentiExcel(username, ncdrId));
                            log.info("Extracted user {} on cdr {}", username, ncdrId);
                        }
                    }
                }
                workbook.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        for(UtentiExcel utente : utenti){
            Permit permit = new Permit();
            Long userId = User.findByUsername(utente.getUsername()).id;
            Long officeId = Office.findByCode(utente.getNcdr()).id;
            if(UserOffice.findByUserIdAndOfficeId(userId, officeId) == null){
                UserOffice userOffice = new UserOffice();
                userOffice.setOffice_id(officeId);
                userOffice.setUser_id(userId);
                log.info("Aggiungo userId {} all'ufficio officeId {}", userId, officeId);
                userOfficeService.save(userOffice);
            } else {
                log.info("Utente userId {} già appartiene all'ufficio officeId {}", userId, officeId);
            }
            if(Permit.findByUserIdAndOfficeIdAndRoleId(userId, officeId, roleId) == null){
                permit.setUser_id(userId);
                permit.setRole_id(roleId);
                permit.setOffice_id(officeId);
                permit.setType(PermitType.PERSISTENT);
                log.info("Salvando permit per userId {}, roleId {}, officeId {}", userId, roleId, officeId);
                permitService.save(permit);
            } else {
                log.info("Utente userId {} già possiede il ruolo {} per l'ufficio officeId {}", userId, roleId, officeId);
            }

        }

        return Response.status(200).build();
    }


    @POST
    @Path("load_attachment")
    @Consumes("multipart/form-data")
    public Response loadAttachment(MultipartFormDataInput input) throws IOException {

        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("uploadedFile");

        String delegations = uploadForm.get("delegationId").get(0).getBody(String.class, null);
        StringTokenizer tokenizer = new StringTokenizer(delegations, ",");

        List<Attachment> attachments = new ArrayList<>();

        while(tokenizer.hasMoreTokens()){
            Delegation delegation = Delegation.findById(Long.valueOf(tokenizer.nextToken()));

            if(Attachment.find("delegation_id = :did", Map.of("did", delegation.id)).count() > 0){
                service.multiDelete(delegation.id);
            }

            if(delegation == null) {
                Response.status(Response.Status.BAD_REQUEST).entity("Input permit id doesn't exists").build();
            }

            Attachment attachment = new Attachment();

            for (InputPart inputPart : inputParts) {
                String hold = "";
                try{
                    hold = inputPart.getHeaders().get("Content-Disposition").get(0);
                    hold = hold.substring(hold.indexOf("filename") + 9).replaceAll("\"", "").trim();
                } catch (Exception e) {
                    hold = "";
                    e.printStackTrace();
                }

                try {
                    InputStream inputStream = inputPart.getBody(InputStream.class,null);
                    attachment.url = hold;
                    attachment.delegation_id = delegation.id;
                    attachment = service.save(inputStream, attachment);

                    attachments.add(attachment);

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return Response.status(200)
                .entity(attachments).build();
    }

    @GET
    @Path("download_attachment/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadAttachment(@PathParam(value = "id") Long id) throws IOException {
        Attachment attachment = Attachment.findById(id);
        URLConnection yc = new URL(minioConnectionFactory.getSharableLink(
                "cmrc-sso-delegations",
                attachment.url,
                5,
                TimeUnit.MINUTES
        )).openConnection();

        return Response.ok(createStreamingOutput(yc.getInputStream())).header(
                "Content-Disposition", "attachment; filename=\"" + attachment.url + "\"").build();
    }


    @DELETE
    @Path("delete_attachment/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Transactional
    public Response deleteAttachment(@PathParam(value = "id") Long id) {
        return Response.ok(Attachment.deleteById(id)).build();
    }

    private synchronized StreamingOutput createStreamingOutput(InputStream responseStream){
        return out -> {
            int length;
            byte[] buffer = new byte[1024];
            while((length = responseStream.read(buffer)) != -1) {
                out.write(buffer, 0, length);
            }
            out.flush();
            responseStream.close();
        };
    }


}
