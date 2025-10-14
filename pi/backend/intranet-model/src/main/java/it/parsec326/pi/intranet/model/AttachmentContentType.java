package it.parsec326.pi.intranet.model;
import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "attachment_content_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentContentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "extension")
    private String extension;
}