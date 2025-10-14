package it.cmrc.sso.util;

import io.quarkus.panache.common.Sort;

public class SortInput {


    public static Sort.Direction getDirection(boolean desc) {
        return desc ? Sort.Direction.Descending : Sort.Direction.Ascending;
    }

    public static Sort getSortOrDefault(String by, boolean desc){
        if(by.isBlank()) {
            return Sort.by("id", Sort.Direction.Ascending);
        } else {
            return Sort.by(by, getDirection(desc));
        }
    }

    public static Sort getSortOrDefault(String by, boolean desc, String prefix){
        if(by.isBlank()) {
            return Sort.by(prefix + ".id", Sort.Direction.Ascending);
        } else {
            return Sort.by(prefix + "." + by, getDirection(desc));
        }
    }
}
