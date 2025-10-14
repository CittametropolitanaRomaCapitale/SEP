package it.parsec326.pi.intranet.dto.mail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class EmailConfigurationDTO {
    private String host;
    private String port;
    private String imapHost;
    private String imapPort;
    private String username;
    private String password;
    private boolean isPec;
    private boolean saveToSent;

    private EmailConfigurationDTO() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String host;
        private String port;
        private String imapHost;
        private String imapPort;
        private String username;
        private String password;
        private boolean isPec;
        private boolean saveToSent;

        private Builder() {
            // Costruttore privato per impedire l'istanziazione diretta del builder
        }

        public Builder host(String host) {
            this.host = host;
            return this;
        }

        public Builder port(String port) {
            this.port = port;
            return this;
        }

        public Builder imapHost(String imapHost) {
            this.imapHost = imapHost;
            return this;
        }

        public Builder imapPort(String imapPort) {
            this.imapPort = imapPort;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder password(String password) {
            this.password = password;
            return this;
        }

        public Builder isPec(boolean isPec) {
            this.isPec = isPec;
            return this;
        }

        public Builder saveToSent(boolean saveToSent) {
            this.saveToSent = saveToSent;
            return this;
        }

        public EmailConfigurationDTO build() {
            EmailConfigurationDTO emailConfigurationDTO = new EmailConfigurationDTO();
            emailConfigurationDTO.host = this.host;
            emailConfigurationDTO.port = this.port;
            emailConfigurationDTO.username = this.username;
            emailConfigurationDTO.password = this.password;
            emailConfigurationDTO.isPec = this.isPec;
            emailConfigurationDTO.saveToSent = this.saveToSent;
            emailConfigurationDTO.imapHost = this.imapHost;
            emailConfigurationDTO.imapPort = this.imapPort;
            return emailConfigurationDTO;
        }
    }
}
