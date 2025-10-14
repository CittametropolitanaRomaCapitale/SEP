package it.parsec326.pi.intranet.utils.email;

import jakarta.mail.internet.MimeUtility;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FilenameParser {

    // Regex che cerca:
    //  - filename= / filename*= (ignora maiuscole/minuscole grazie a (?i))
    //  - eventuali spazi
    //  - poi "qualcosa tra virgolette" oppure "qualcosa senza virgolette" (fino a un ';' o fine stringa)
    private static final Pattern FILENAME_PATTERN = Pattern.compile(
            "(?i)filename\\*?=\\s*(\"([^\"]*)\"|([^\";]+))"
    );

    /**
     * Rimuove/riduce i caratteri di controllo e unisce eventuali line-break
     * per evitare "spezzature" anomale
     */
    public static String pulisciHeader(String header) {
        // Eliminiamo a capo + tab (es. \r\n\t) sostituendoli con uno spazio
        // in modo da avere l'header su un'unica riga
        if (header == null) {
            return null;
        }
        String res = header.replaceAll("[\r\n\t]+", " ");
        // Rimuove eventuali doppi/tripli spazi
        res = res.trim().replaceAll("\\s+", " ");
        return res;
    }

    /**
     * Metodo generale per estrarre il filename da un singolo header,
     * gestendo possibili virgolette mancanti o intestazioni malformate.
     */
    public static String estraiFilenameDaHeader(String header) {
        if (header == null || header.isEmpty()) {
            return null;
        }

        // 1) Normalizza newline e tab in uno spazio singolo
        header = header.replaceAll("[\r\n\t]+", " ").trim();

        // 2) Se troviamo una sequenza filename=" ma non c'è virgoletta di chiusura, la aggiungiamo.
        //    Cerchiamo "filename=\"" in modo case-insensitive (quindi usiamo toLowerCase o un indexOf ignorando case).
        String lowerHeader = header.toLowerCase();
        int idx = lowerHeader.indexOf("filename=\"");
        if (idx != -1) {
            // Cerchiamo una virgoletta di chiusura DOPO la posizione trovata
            // offset = idx + lunghezza di 'filename="'
            int offset = idx + 10; // "filename=\"".length() = 10
            int closingQuote = header.indexOf('"', offset);
            if (closingQuote == -1) {
                // Non abbiamo trovato la chiusura -> la aggiungiamo in fondo
                header += "\"";
            }
        }

        // 3) Ora proviamo la regex
        Matcher matcher = FILENAME_PATTERN.matcher(header);
        if (matcher.find()) {
            // Se matcha, possiamo avere due gruppi “utili”:
            //  - group(2) = il contenuto tra virgolette, se presente
            //  - group(3) = il contenuto senza virgolette, se c’è
            String rawFilename = (matcher.group(2) != null) ? matcher.group(2) : matcher.group(3);
            if (rawFilename != null) {
                rawFilename = rawFilename.trim();
                // 4) Tenta la decodifica (es. se è un =?UTF-8?Q? ... ?=)
                try {
                    rawFilename = MimeUtility.decodeText(rawFilename);
                } catch (Exception e) {
                    // Se fallisce, usiamo il valore “grezzo”
                }
                return rawFilename;
            }
        }

        // Se siamo arrivati qui, la regex non ha trovato nulla (o non decodificabile)
        return null;
    }
}
