package it.parsec326.pi.intranet.dto.mail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentDTO{
    private String name;
    private byte[] content;
    private String type;
    private String extension;
    private boolean excludeFromImpronta;

    public static AttachmentDTO.Builder builder() {
        return new AttachmentDTO.Builder();
    }

    public static class Builder {
        private String name;
        private byte[] content;
        private String type;
        private String extension;

        public Builder() {}

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder content(byte[] content) {
            this.content = content;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder extension(String extension) {
            this.extension = extension;
            return this;
        }

        // Metodo per costruire un'istanza di AttachmentDTO con i valori forniti
        public AttachmentDTO build() {
            AttachmentDTO attachmentDTO = new AttachmentDTO();
            attachmentDTO.name = this.name;
            attachmentDTO.content = this.content;
            attachmentDTO.type = this.type;
            attachmentDTO.extension = this.extension;
            attachmentDTO.excludeFromImpronta = false;
            return attachmentDTO;
        }
    }

    @Override
    public String toString() {
        return "AttachmentDTO{" +
                "name='" + name + '\'' +
                ", content=" + Arrays.toString(content) +
                ", type='" + type + '\'' +
                ", extension='" + extension + '\'' +
                ", exclude from impronta='" + excludeFromImpronta + '\'' +
                '}';
    }
}
