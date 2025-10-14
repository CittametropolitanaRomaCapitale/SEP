package it.parsec326.pi.intranet.dto.ipa.json_mapper;

import lombok.Data;

@Data
public class ApiResponseIpaInfo<T> {
    private ResultResponseIpa result;
    private T data;
}
