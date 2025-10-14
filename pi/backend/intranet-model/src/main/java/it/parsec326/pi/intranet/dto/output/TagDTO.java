package it.parsec326.pi.intranet.dto.output;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TagDTO {
    public Long id;
    public String nome;
}
