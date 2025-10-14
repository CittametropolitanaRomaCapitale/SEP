package it.parsec326.pi.intranet.dto.excel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorRecord {
    private Long rowNumber;
    private String errorMessage;
}
