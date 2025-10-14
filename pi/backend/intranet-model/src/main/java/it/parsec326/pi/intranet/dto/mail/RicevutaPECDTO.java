package it.parsec326.pi.intranet.dto.mail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@AllArgsConstructor
@Setter
@Getter
public class RicevutaPECDTO {
    private String from;
    private String to;
    private String subject;
    private String riferimentoMessageId;
    private String tipoRicevuta;
    private AttachmentDTO messaggioEml;
    private String displayName;
    private String messageId;
    private Timestamp tsInvio;

    public RicevutaPECDTO() {}

    public boolean isRicevutaDiConsegna() {
        return tipoRicevuta.equalsIgnoreCase("avvenuta-consegna");
    }

    public static RicevutaPECDTO.RicevutaDTOBuilder builder() {
        return new RicevutaPECDTO.RicevutaDTOBuilder();
    }

    public static class RicevutaDTOBuilder {
        private String from;
        private String to;
        private String subject;
        private String riferimentoMessageId;
        private String tipoRicevuta;
        private String displayName;
        private AttachmentDTO messaggioEml;
        private Timestamp tsInvio;
        private String messageId;

        private RicevutaDTOBuilder() {
            // Costruttore privato per impedire l'istanziazione diretta del builder
        }

        public RicevutaPECDTO.RicevutaDTOBuilder from(String from) {
            this.from = from;
            return this;
        }

        public RicevutaPECDTO.RicevutaDTOBuilder to(String to) {
            this.to = to;
            return this;
        }

        public RicevutaPECDTO.RicevutaDTOBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public RicevutaPECDTO.RicevutaDTOBuilder riferimentoMessageId(String riferimentoMessageId) {
            this.riferimentoMessageId = riferimentoMessageId;
            return this;
        }
        public RicevutaPECDTO.RicevutaDTOBuilder messageId(String messageId) {
            this.messageId = messageId;
            return this;
        }

        public RicevutaPECDTO.RicevutaDTOBuilder tipoRicevuta(String tipoRicevuta) {
            this.tipoRicevuta = tipoRicevuta;
            return this;
        }

        public RicevutaPECDTO.RicevutaDTOBuilder messaggioEml(AttachmentDTO messaggioEml) {
            this.messaggioEml = messaggioEml;
            return this;
        }

        public RicevutaPECDTO.RicevutaDTOBuilder displayName(String displayName) {
            this.displayName = displayName;
            return this;
        }
        public RicevutaPECDTO.RicevutaDTOBuilder tsInvio(Timestamp tsInvio) {
            this.tsInvio = tsInvio;
            return this;
        }

        public RicevutaPECDTO.RicevutaDTOBuilder displayNameFromTipoRicevuta(String tipo) {
            if (tipo.equalsIgnoreCase("non-accettazione")) this.displayName = "Ricevuta di non accettazione";
            else if (tipo.equalsIgnoreCase("accettazione")) this.displayName = "Ricevuta di accettazione";
            else if (tipo.equalsIgnoreCase("preavviso-errore-consegna")) this.displayName = "Ricevuta di preavviso di errore consegna";
            else if (tipo.equalsIgnoreCase("presa-in-carico")) this.displayName = "Ricevuta di presa in carico";
            else if (tipo.equalsIgnoreCase("rilevazione-virus")) this.displayName = "Ricevuta di rilevazione virus";
            else if (tipo.equalsIgnoreCase("errore-consegna")) this.displayName = "Ricevuta di errore consegna";
            else if (tipo.equalsIgnoreCase("avvenuta-consegna")) this.displayName = "Ricevuta di avvenuta consegna";
            else this.displayName = tipo;
            return this;
        }

        public RicevutaPECDTO build() {
            RicevutaPECDTO ricevutaPECDTO = new RicevutaPECDTO();
            ricevutaPECDTO.from = this.from;
            ricevutaPECDTO.to = this.to;
            ricevutaPECDTO.subject = this.subject;
            ricevutaPECDTO.messaggioEml = this.messaggioEml;
            ricevutaPECDTO.riferimentoMessageId = this.riferimentoMessageId;
            ricevutaPECDTO.tipoRicevuta = this.tipoRicevuta;
            ricevutaPECDTO.displayName = this.displayName;
            ricevutaPECDTO.tsInvio = this.tsInvio;
            ricevutaPECDTO.messageId = this.messageId;
            return ricevutaPECDTO;
        }
    }
}
