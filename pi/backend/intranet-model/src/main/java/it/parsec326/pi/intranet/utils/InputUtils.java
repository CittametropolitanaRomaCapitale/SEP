package it.parsec326.pi.intranet.utils;

public class InputUtils {

    private InputUtils() {}
    public static String normalizeSearchInput(String search) {
        if (search == null) return "";
        return search
                .replace("–", "-")
                .replace("“", "\"")
                .replace("”", "\"")
                .trim()
                .toLowerCase();
    }

    public static String normalizeFilenameInput(String filename) {
        if (filename == null) return "";
        String newFilename = filename.replaceAll("[^A-Za-z0-9.]", "_");
        return newFilename.length() > 200 ? newFilename.substring(0, 200) : newFilename;
    }
}
