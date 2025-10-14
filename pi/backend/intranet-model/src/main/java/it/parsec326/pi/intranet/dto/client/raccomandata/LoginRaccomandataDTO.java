package it.parsec326.pi.intranet.dto.client.raccomandata;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class LoginRaccomandataDTO {
    public String username;
    public String password;
    public String gruppo;
}
