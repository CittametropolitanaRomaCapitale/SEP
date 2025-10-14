package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

import java.util.List;

@Data
public class TagInput {
    public List<Long> id;
    public String nome;
}
