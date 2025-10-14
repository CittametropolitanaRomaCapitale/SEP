package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.TipologiaPosta;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "PE_CONFIGURAZIONE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity

@NamedQuery(
        name = "getConfByTipologiaPosta",
        query = "SELECT e FROM PeConfigurazione e " +
                "WHERE e.tipologiaPosta = :tipologiaPosta"
)
@NamedQuery(
        name = "getConfByTipologiaPostaAndEnv",
        query = "SELECT e FROM PeConfigurazione e " +
                "WHERE e.tipologiaPosta = :tipologiaPosta AND e.env = :env"
)
public class PeConfigurazione extends PanacheCustomEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPOLOGIA_POSTA", nullable = false)
    private TipologiaPosta tipologiaPosta;

    @Column(name = "SMTP_HOST", nullable = false)
    private String smtpHost;

    @Column(name = "SMTP_PORT", nullable = false)
    private Integer smtpPort;

    @Column(name = "USE_TLS", nullable = false)
    private Boolean useTls;

    @Column(name = "CONNECTION_TIMEOUT")
    private Integer connectionTimeout;

    @Column(name = "ENV")
    private String env;

    @Column(name = "IMAP_HOST", nullable = false)
    private String imapHost;

    @Column(name = "IMAP_PORT", nullable = false)
    private Integer imapPort;

    @Column(name = "SENT_FOLDER", nullable = false)
    private String sentFolder;
}
