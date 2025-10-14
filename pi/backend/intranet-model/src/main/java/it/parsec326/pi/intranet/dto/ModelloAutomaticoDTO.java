package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.model.ModelloAutomatico;

public class ModelloAutomaticoDTO extends ModelloAutomatico {
    public String hierarchyStringTitolario;
    public String cdr;

    public static ModelloAutomaticoDTO fromModel(ModelloAutomatico model) {
        ModelloAutomaticoDTO dto = new ModelloAutomaticoDTO();
        dto.setId(model.getId());
        dto.setNomeModello(model.getNomeModello());
        dto.setCdrCode(model.getCdrCode());
        dto.setTipoRegistrazione(model.getTipoRegistrazione());
        dto.setOggettoProtocollo(model.getOggettoProtocollo());
        dto.setMetodoSpedizione(model.getMetodoSpedizione());
        dto.setTitolario(model.getTitolario());
        dto.hierarchyStringTitolario = "";
        dto.cdr = "";
        return dto;
    }
}
