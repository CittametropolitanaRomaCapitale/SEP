package it.parsec326.pi.intranet.utils;

import io.quarkus.panache.common.Sort;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.eclipse.microprofile.graphql.DefaultValue;

@AllArgsConstructor
@NoArgsConstructor
public class SortInput {

    public String by;

    @DefaultValue("false")
    public boolean desc;

    public Sort.Direction getDirection() {
        return desc ? Sort.Direction.Descending : Sort.Direction.Ascending;
    }

    public static Sort getSortOrDefault(SortInput sort){
        if(sort == null || sort.by == null || sort.by.isBlank()) {
            return Sort.by("id", Sort.Direction.Ascending);
        } else {
            return Sort.by(sort.by, sort.getDirection());
        }
    }

    public static Sort getSortOrDefault(SortInput sort, String prefix){
        if(sort == null || sort.by == null || sort.by.isBlank()) {
            return Sort.by(prefix + ".id", Sort.Direction.Ascending);
        } else {
            return Sort.by(prefix + "." + sort.by, sort.getDirection());
        }
    }
}
