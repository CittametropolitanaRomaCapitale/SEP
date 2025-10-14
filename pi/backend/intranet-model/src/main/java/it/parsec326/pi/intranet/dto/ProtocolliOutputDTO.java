package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.output.ProtocolloDTO;
import it.parsec326.pi.intranet.model.Protocollo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProtocolliOutputDTO {
    private List<Protocollo> protocolli;
    private long pageCount;
    private long totalResults;

    public static List<ProtocolloDTO> getDtoFromProtocolli(List<Protocollo> listProtocolli) {
        List<ProtocolloDTO> protocolli = new ArrayList<>();
        if (listProtocolli == null)
            return protocolli;
        for(Protocollo p : listProtocolli) {
            protocolli.add(ProtocolloDTO.fromProtocollo(p));
        }
        return protocolli;
    }
}
