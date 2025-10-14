package it.parsec326.pi.intranet.dto.input;

import lombok.Data;

import java.util.List;

@Data
public class ProtocolloUpdateInput {

    public String nProtocollo;
    public String note;
    public String nProtocolloCircolare;
    public List<AllegatoInput> allegati;
    public List<Long> idTitolario;
    public String cdrCode;
}
