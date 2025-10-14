package it.parsec326.pi.intranet.dto.mail;

import lombok.*;

import java.util.List;

@Data
public class InoltraRispondi {
    public String from;
    public List<String> to;
    public List<String> cc;
    public String subject;
    public String body;
    public List<Long> idAttachments;
    public String tipologiaPosta;
}
