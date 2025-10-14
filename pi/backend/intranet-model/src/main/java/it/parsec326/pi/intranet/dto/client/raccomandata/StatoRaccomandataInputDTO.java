package it.parsec326.pi.intranet.dto.client.raccomandata;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatoRaccomandataInputDTO {
    public LoginRaccomandataDTO login;
    public List<String> idRaccomandateList;
}
