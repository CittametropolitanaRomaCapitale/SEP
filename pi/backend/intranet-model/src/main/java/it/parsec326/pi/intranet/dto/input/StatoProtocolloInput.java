package it.parsec326.pi.intranet.dto.input;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StatoProtocolloInput {
    public Long idProtocollo;
    public String statoProtocollo;
    public String selectedOffice;
}
