package it.parsec326.pi.intranet.dto.excel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImportResult<T> {
    private Boolean idoneo;
    private List<T> lista;
}
