package it.parsec326.pi.intranet.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.MediaType;
import lombok.Data;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;


@Data
public class RestProtocolloInput {

    @RestForm("object")
    @NotNull
    @PartType(MediaType.TEXT_PLAIN)
    private String object; // Oggetto del protocollo

    @RestForm("sender")
    @NotNull
    @PartType(MediaType.TEXT_PLAIN)
    private String sender; // Mittenti separati da ";"

    @RestForm("addresse")
    @PartType(MediaType.TEXT_PLAIN)
    private String addresse; // Destinatari separati da ";"

    @RestForm("delivery_type")
    @NotNull
    @PartType(MediaType.TEXT_PLAIN)
    private String delivery_type; // Modalità di consegna

    @RestForm("direction")
    @NotNull
    @PartType(MediaType.TEXT_PLAIN)
    private String direction; // Direzione del protocollo

    @RestForm("titolario")
    @NotNull
    @PartType(MediaType.TEXT_PLAIN)
    private String titolario; // Titolario di classificazione

    @RestForm("document_protocol")
    @PartType(MediaType.TEXT_PLAIN)
    private String document_protocol; // Numero protocollo precedente (opzionale)

    @RestForm("document_protocol_date")
    @PartType(MediaType.TEXT_PLAIN)
    private String document_protocol_date; // Data protocollo precedente (opzionale)

    @RestForm("document_filename")
    @NotNull
    @PartType(MediaType.TEXT_PLAIN)
    private String document_filename;

    @RestForm("document")
    @NotNull
    @PartType(MediaType.TEXT_PLAIN)
    private String document; // Documento principale

    @RestForm("attachment_1_filename")
    @PartType(MediaType.TEXT_PLAIN)
    private String attachment_1_filename;

    @RestForm("attachment_1")
    @PartType(MediaType.TEXT_PLAIN)
    private String attachment_1;

    @RestForm("attachment_2_filename")
    @PartType(MediaType.TEXT_PLAIN)
    private String attachment_2_filename;

    @RestForm("attachment_2")
    @PartType(MediaType.TEXT_PLAIN)
    private String attachment_2;

    @RestForm("attachment_3_filename")
    @PartType(MediaType.TEXT_PLAIN)
    private String attachment_3_filename;

    @RestForm("attachment_3")
    @PartType(MediaType.TEXT_PLAIN)
    private String attachment_3;
}
