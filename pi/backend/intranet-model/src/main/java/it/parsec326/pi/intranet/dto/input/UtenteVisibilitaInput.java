package it.parsec326.pi.intranet.dto.input;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UtenteVisibilitaInput {
        public String idUtente;
        public String usernameUtente;
        public String nomeUtente;
}
