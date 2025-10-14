package it.parsec326.pi.intranet.dto.output;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseResourceDTO {
    public boolean isError;
    public String message;
}
