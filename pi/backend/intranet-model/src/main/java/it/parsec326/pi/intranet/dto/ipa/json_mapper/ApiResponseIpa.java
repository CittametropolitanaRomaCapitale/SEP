package it.parsec326.pi.intranet.dto.ipa.json_mapper;

import lombok.Data;

import java.util.List;

@Data
public class ApiResponseIpa<T> {
    private ResultResponseIpa result;
    private List<T> data;
}
