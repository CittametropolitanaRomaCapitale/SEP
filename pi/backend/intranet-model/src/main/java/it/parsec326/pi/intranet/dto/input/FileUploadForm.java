package it.parsec326.pi.intranet.dto.input;

import jakarta.ws.rs.core.MediaType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.InputStream;
import java.util.Base64;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileUploadForm {

    @RestForm("id")
    @PartType(MediaType.TEXT_PLAIN)
    public Long id;

    @RestForm("refId")
    @PartType(MediaType.TEXT_PLAIN)
    public Long refId;

    @RestForm("file")
    @PartType(MediaType.APPLICATION_OCTET_STREAM)
    public byte[] fileData;

    @RestForm("fileStream")
    @PartType(MediaType.APPLICATION_OCTET_STREAM)
    public InputStream fileStream;

    @RestForm("emlFile")
    @PartType(MediaType.TEXT_PLAIN)
    public String emailFile;

    @RestForm("fileUpload")
    @PartType(MediaType.TEXT_PLAIN)
    public FileUpload fileUpload;

    @RestForm("filename")
    @PartType(MediaType.TEXT_PLAIN)
    public String fileName;

    @RestForm("oggetto")
    @PartType(MediaType.TEXT_PLAIN)
    public String oggetto;

    @RestForm("collocazionetelematica")
    @PartType(MediaType.TEXT_PLAIN)
    public String collocazioneTelematica;

    @RestForm("ismain")
    @PartType(MediaType.TEXT_PLAIN)
    public String isMain;

    @RestForm("size")
    @PartType(MediaType.TEXT_PLAIN)
    public Long dimensione;

    @RestForm("isInoltro")
    @PartType(MediaType.TEXT_PLAIN)
    public boolean isInoltro;

    @RestForm("appSection")
    @PartType(MediaType.TEXT_PLAIN)
    public String appSection;

    @RestForm("selectedOffice")
    @PartType(MediaType.TEXT_PLAIN)
    public String selectedOffice;

    public boolean protocollazioneAuto;

    public FileUploadForm(String fileData,String fileName, String isMain) {
        this.fileData = Base64.getDecoder().decode(fileData);
        this.fileName = fileName;
        this.dimensione = (long) this.fileData.length;
        this.isMain = isMain;

        this.oggetto = fileName;
        this.collocazioneTelematica = "";
        this.emailFile = fileData;
        this.appSection = "";
        this.isInoltro = false;
        this.protocollazioneAuto = true;
        this.refId = null;
    }
}

