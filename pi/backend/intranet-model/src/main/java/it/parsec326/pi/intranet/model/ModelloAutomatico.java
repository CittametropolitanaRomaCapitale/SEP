package it.parsec326.pi.intranet.model;

import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "modello_automatico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Builder
@ApplicationScoped

@NamedQuery(
        name = "getModelliAutomaticiByCdrCode",
        query = "SELECT ma FROM ModelloAutomatico ma WHERE ma.cdrCode is null OR ma.cdrCode in :cdrCodes"
)
public class ModelloAutomatico extends PanacheCustomEntity{

    @Column(name = "nome_modello")
    private String nomeModello;

    @Column(name = "oggetto_protocollo")
    private String oggettoProtocollo;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_spedizione")
    private MetodoSpedizione metodoSpedizione;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_registrazione")
    private TipoRegistrazione tipoRegistrazione;

    @Column(name = "cdr_code")
    private String cdrCode;

    @ManyToOne
    @JoinColumn(name = "id_titolario")
    private Titolario titolario;
}
