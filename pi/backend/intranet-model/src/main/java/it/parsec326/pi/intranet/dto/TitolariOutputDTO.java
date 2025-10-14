package it.parsec326.pi.intranet.dto;

import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TitolariOutputDTO {
    private List<TitolarioOutputDTO> titolario;
    private boolean hasMore;
    private int currentPage;
    private int nextPage;
    private int lastIndex;
    private long lastIdTitolario;
}
