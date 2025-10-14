package it.parsec326.pi.intranet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ModelloAutomaticoOutputDTO {
    private List<ModelloAutomaticoDTO> modelloAutomaticoList;
    private long pageCount;
    private long totalResults;
}
