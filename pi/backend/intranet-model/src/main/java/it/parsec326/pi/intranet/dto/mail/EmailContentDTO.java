package it.parsec326.pi.intranet.dto.mail;

import it.parsec326.pi.intranet.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

@AllArgsConstructor
@Setter
@Getter
public class EmailContentDTO {
    private Long idEmail;
    private String from;
    private List<String> to;
    private List<String> cc;
    private String subject;
    private String body;
    private Timestamp tsInvio;
    private List<AttachmentDTO> attachments;
    private String direction;
    private String messageId;
    private boolean toBeProtocolled;

    public EmailContentDTO() {}

    public static EmailContentDTOBuilder builder() {
        return new EmailContentDTOBuilder();
    }

    public static class EmailContentDTOBuilder {
        private Long idEmail;
        private String from;
        private List<String> to = new ArrayList<>();
        private List<String> cc = new ArrayList<>();
        private String subject;
        private String body;
        private Timestamp tsInvio;
        private List<AttachmentDTO> attachments = new ArrayList<>();
        private String direction;
        private String messageId;
        private boolean toBeProtocolled;

        private EmailContentDTOBuilder() {
            // Costruttore privato per impedire l'istanziazione diretta del builder
        }
        public EmailContentDTOBuilder idEmail(Long idEmail) {
            this.idEmail = idEmail;
            return this;
        }

        public EmailContentDTOBuilder from(String from) {
            this.from = from;
            return this;
        }

        public EmailContentDTOBuilder to(String to) {
            if(!Utils.isValidEmail(to)){
                throw new IllegalArgumentException("Invalid email address: " + to);
            }
            this.to.add(to);
            return this;
        }

        public EmailContentDTOBuilder to(List<String> to) {
            this.to.addAll(to);
            return this;
        }

        public EmailContentDTOBuilder cc(String cc) {
            if(!Utils.isValidEmail(cc)){
                throw new IllegalArgumentException("Invalid email address: " + cc);
            }
            this.cc.add(cc);
            return this;
        }

        public EmailContentDTOBuilder cc(List<String> cc) {
            this.cc.addAll(cc);
            return this;
        }

        public EmailContentDTOBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public EmailContentDTOBuilder tsInvio(Timestamp tsInvio) {
            this.tsInvio = tsInvio;
            return this;
        }

        public EmailContentDTOBuilder body(String body) {
            this.body = body;
            return this;
        }

        public EmailContentDTOBuilder attachment(AttachmentDTO attachment) {
            this.attachments.add(attachment);
            return this;
        }

        public EmailContentDTOBuilder direction(String direction) {
            this.direction = direction;
            return this;
        }

        public EmailContentDTOBuilder attachments(List<AttachmentDTO> attachments) {
            this.attachments.addAll(attachments);
            return this;
        }

        public EmailContentDTOBuilder messageId(String messageId) {
            this.messageId = messageId;
            return this;
        }

        public EmailContentDTOBuilder toBeProtocolled(boolean toBeProtocolled) {
            this.toBeProtocolled = toBeProtocolled;
            return this;
        }

        public EmailContentDTO build() {
            EmailContentDTO emailContentDTO = new EmailContentDTO();
            emailContentDTO.idEmail = this.idEmail;
            emailContentDTO.from = this.from;
            emailContentDTO.to = this.to;
            emailContentDTO.cc = this.cc;
            emailContentDTO.subject = this.subject;
            emailContentDTO.body = this.body;
            emailContentDTO.tsInvio = this.tsInvio;
            emailContentDTO.attachments = this.attachments;
            emailContentDTO.direction = this.direction;
            emailContentDTO.messageId = this.messageId;
            emailContentDTO.toBeProtocolled = this.toBeProtocolled;
            return emailContentDTO;
        }
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", EmailContentDTO.class.getSimpleName() + "[", "]")
                .add("idEmail=" + idEmail)
                .add("from=" + from)
                .add("to=" + to)
                .add("cc=" + cc)
                .add("subject='" + subject + "'")
                .add("body='" + body + "'")
                .add("tsInvio='" + tsInvio + "'")
                .add("attachments=" + attachments)
                .add("direction=" + direction)
                .add("messageId" + messageId)
                .add("toBeProtocolled" + toBeProtocolled)
                .toString();
    }
}