package it.parsec326.pi.intranet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Table(name = "CONFIGURAZIONI")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Builder
@Data
@NamedQuery(
        name = "getConfigurazioniByCategoria",
        query = "SELECT c FROM Configurazione c WHERE c.categoria = :categoria"
)

@NamedQuery(
        name = "getMittenteRispostaAvvenutaConsegna",
        query = "SELECT c.valore FROM Configurazione c WHERE c.categoria = :categoria AND c.nome = :nome"
)
public class Configurazione extends PanacheCustomEntity {

    @Column(name = "nome")
    private String nome;

    @Column(name = "valore")
    private String valore;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "categoria")
    private String categoria;

    @CreationTimestamp
    @Column(name = "ts_creation")
    private Timestamp tsCreation;

    @CreationTimestamp
    @Column(name = "ts_update")
    private Timestamp tsUpdate;

    public Configurazione(String nome, String tipo, String valore, String categoria){
        this.nome = nome;
        this.valore = valore;
        this.tipo = tipo;
        this.categoria = categoria;
    }

    @Override
    public String toString() {
        return "Configurazioni{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", valore='" + valore + '\'' +
                ", tipo='" + tipo + '\'' +
                ", categoria='" + categoria + '\'' +
                ", tsCreation=" + tsCreation +
                ", tsUpdate=" + tsUpdate +
                '}';
    }
}
