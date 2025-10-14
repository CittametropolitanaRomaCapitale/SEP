package it.parsec326.pi.intranet.dto.input.segnatura;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SegnaturaInput {
    private String denominazioneMittente;
    private String cfMittente;
    private String codiceIpaMittente;
    private String codiceAooMittente;

    private String numeroRegistrazione;
    private String dataRegistrazione;
    private String oggetto;

    private String fascicoloCodiceFlat;
    private String fascicoloNome;

    private String nomeAllegato;
    private String mimeTypeAllegato;
    private byte[] improntaBytes;

    private List<SegnaturaDestinatarioInput> destinatari;

    private RiferimentoProtocolloSegnaturaDTO riferimentoProtocolloSegnaturaDTO;

    public SegnaturaInput() {
        destinatari = new ArrayList<>();
    }
}
