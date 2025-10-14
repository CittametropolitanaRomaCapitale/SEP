package it.parsec326.pi.intranet.dto.input;

import it.parsec326.pi.intranet.utils.SortInput;
import lombok.*;

import java.util.List;

@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class BaseSearchDTO {
    private String search;
    private Integer page;
    private Integer size;
    private SortInput sort;
    private List<String> cdr;

    public boolean hasSort() {
        return sort != null;
    }
    public boolean hasSearch() {
        return search != null && !search.isEmpty();
    }
    public boolean hasCdr() {
        return cdr != null && !cdr.isEmpty();
    }
}
