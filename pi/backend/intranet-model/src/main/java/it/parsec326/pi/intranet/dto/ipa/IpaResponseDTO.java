package it.parsec326.pi.intranet.dto.ipa;

import it.parsec326.pi.intranet.dto.input.AnagraficaInput;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class IpaResponseDTO extends AnagraficaInput {
    public TipologiaIpaResponse tipologiaIpaResponse;
    public String codAmm;
    public String descAmm;
    public String acronimo;
    public String statoCanale;
    public String codAOO;
    public String codUniOU;
    public String descOU;
    public String dataVerificaOF;
    public String datValCanaleTrasmSfe;
}
