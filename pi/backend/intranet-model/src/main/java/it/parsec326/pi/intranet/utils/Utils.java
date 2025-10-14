package it.parsec326.pi.intranet.utils;

import it.parsec326.pi.intranet.exception.CustomException;
import jakarta.mail.Address;
import jakarta.mail.Folder;
import jakarta.mail.MessagingException;
import jakarta.mail.Store;
import jakarta.mail.internet.InternetAddress;
import lombok.extern.slf4j.Slf4j;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
public class Utils {

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    public enum DateFormat {
        DMY_HMS("dd-MM-yyyy HH:mm:ss"),
        DMY_HM("dd/MM/yyyy HH:mm"),
        YMD_HMSM("yyyy-MM-dd HH:mm:ss.SSS"),
        FC_822("EEE MMM dd HH:mm:ss zzz yyyy"),
        DMY_HMS_COMPACT("ddMMyyyy-HHmmss"),
        DMY("dd/MM/yyyy");

        private String format;
        DateFormat(String format) {
            this.format = format;
        }
    };

    public static String formatDate(String dateToFormat, DateFormat startFormat, DateFormat targetFormat) throws ParseException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        SimpleDateFormat sdf = new SimpleDateFormat(startFormat.format);
        Date date = sdf.parse(dateToFormat);
        SimpleDateFormat outputSdf = new SimpleDateFormat(targetFormat.format);
        String formattedDate = outputSdf.format(date);
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return formattedDate;
    }

    public static String fromDateToString(Date date, DateFormat format) {
        try {
            SimpleDateFormat outputFormat = new SimpleDateFormat(format.format);
            return outputFormat.format(date);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static Date parseDate(String dateString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return dateFormat.parse(dateString);
        } catch (ParseException e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante l'elaborazione della data").boom();            return null;
        }
    }

    public static Date parseDate(String dateString, String dateFormatString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(dateFormatString);
        try {
            return dateFormat.parse(dateString);
        } catch (ParseException e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante l'elaborazione della data").boom();            return null;
        }
    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.isEmpty();
    }

    public static List<String> numProtocolloPatterns(String text) {
        List<String> matches = new ArrayList<>();
        Pattern pattern = Pattern.compile("CMRC-\\d{4}-\\d+");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            matches.add(matcher.group());
        }
        return matches;
    }

    public static List<String> stringToList(String assegnatari) {
        if(assegnatari != null && !assegnatari.equals("")){
            List<String> result = new ArrayList<>();
            if(assegnatari.contains(",")){
                result = List.of(assegnatari.split(","));
            }else{
                result.add(assegnatari);
            }
            return result;
        }
        return new ArrayList<>();
    }

    public static String joinEmailAddresses(List<String> to, List<String> cc) {
        String toAddresses = to.stream()
                .map(address -> address + ":TO")
                .collect(Collectors.joining(","));

        String ccAddresses = "";
        if(cc != null){
            ccAddresses = cc.stream()
                    .map(address -> address + ":CC")
                    .collect(Collectors.joining(","));
        }

        return toAddresses + (toAddresses.isEmpty() || ccAddresses.isEmpty() ? "" : ",") + ccAddresses;
    }

    public static String extractEmail(String input) {
        Pattern emailPattern = Pattern.compile("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z]{2,6}\\b", Pattern.CASE_INSENSITIVE);
        Matcher matcher = emailPattern.matcher(input);
        if(!matcher.find()){
            return null;
        }
        return matcher.group();
    }

    public static String extractedAdress(Address address) {
        InternetAddress internetAddress = (InternetAddress) address;
        return internetAddress.getAddress();
    }

    private static String getStackTraceAsString(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

    public static void updateAppendInClauseByLong(StringBuilder query, Map<String, Object> params, String fieldName, List<Long> allegati, String paramName) {
        if (allegati != null && !allegati.isEmpty()) {
            String inClause = allegati.stream()
                    .map(allegato -> {
                        String param = paramName + allegati.indexOf(allegato);
                        params.put(param, allegato);
                        return ":" + param;
                    })
                    .collect(Collectors.joining(", "));
            query.append("where ")
                    .append(fieldName)
                    .append(" in (")
                    .append(inClause)
                    .append(") ");
        }
    }

    public static String getEnv() {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        String env = null;

        if (System.getenv("ENV") != null) {
            env = System.getenv("ENV");
        }

        if (env == null) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new IllegalStateException("La variabile env non è impostata! Controllare le variabili d'ambiente!");
        }

        if (!env.equals("dev") && !env.equals("coll") && !env.equals("prod")) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new IllegalStateException("La variabile env '" + env + "' non è riconosciuta! Controllare le variabili d'ambiente!");
        }

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);

        log.debug("Env="+env);
        return env;
    }

    public static String getNomeAllegatoConProtocollo(String nomeFile, String numeroProtocollo) {
        // Trovo l'ultima occorrenza di '.' per identificare l'estensione del file
        int dotIndex = nomeFile.lastIndexOf('.');
        String fileExtension = "";
        String baseFileName = nomeFile;

        if (dotIndex != -1) {
            fileExtension = nomeFile.substring(dotIndex); // Ricavo l'estensione del file
            baseFileName = nomeFile.substring(0, dotIndex); // Ricavo il nome del file senza l'estensione
        }

        // Regex per riconoscere e rimuovere tutti i prefissi del protocollo
        Pattern pattern = Pattern.compile("^(CMRC-\\d{4}-\\d{7}_)+");
        Matcher matcher = pattern.matcher(baseFileName);

        // Rimuove tutti i prefissi concatenati
        if (matcher.find()) {
            baseFileName = baseFileName.substring(matcher.end());
        }

        // Costruisco il nuovo nome del file con il prefisso del protocollo aggiunto
        String nuovoNomeFile = numeroProtocollo + "_" + baseFileName + fileExtension;

        return nuovoNomeFile;
    }

    public static String truncatetringToSize(String source, int size, String ellipsis) {
        if (source.length() < size)
            return source;

        return source.substring(0, size - ellipsis.length()).concat(ellipsis);
    }

    public static boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        Matcher matcher = EMAIL_PATTERN.matcher(email);
        return matcher.matches();
    }

    /**
     * Tenta di aprire la prima cartella "Sent" disponibile da una lista di nomi possibili.
     *
     * @param store Store IMAP già aperto (ad es. store = session.getStore("imaps")).
     * @param possibleSentFolders Lista dei possibili nomi delle cartelle "Sent" (es. "INBOX.Sent", "INBOX.inviata", ecc.).
     * @return Folder se trovata e aperta con successo, null in caso non ci siano cartelle "Sent" disponibili.
     */
    public static Folder findSentFolder(Store store, List<String> possibleSentFolders) {
        for (String folderName : possibleSentFolders) {
            try {
                Folder folder = store.getFolder("INBOX." + folderName);
                // Verifichiamo che la cartella esista davvero
                if (folder != null && folder.exists()) {
                    return folder; // restituisce la prima cartella valida trovata
                }
            } catch (MessagingException e) {
                // Se c'è un errore con questa cartella, proseguiamo con la successiva
            }
        }
        // Se non abbiamo trovato nessuna cartella "Sent", restituiamo null
        return null;
    }

    public static String sanitize(String input) {
        // Sostituisce caratteri non-breaking space (\u00A0) con spazi normali
        String sanitized = input.replace("\u00A0", " ");
        // Rimuove tutti i caratteri non visibili o speciali
        sanitized = sanitized.replaceAll("[^\\p{Print}]", "");
        // Rimuove spazi all'inizio e alla fine
        sanitized = sanitized.trim();
        return sanitized;
    }

    public static String sanitizeCheckText(String text) {
        if (text == null || text.isEmpty()) {
            return "";
        }

        // 1. Rimuove tutti i caratteri di controllo non stampabili (inclusi \t, \n, \r, ecc.)
        //    tranne '\n' e '\r' temporaneamente per gestirli separatamente dopo
        text = text.replaceAll("[\\p{Cntrl}&&[^\\n\\r]]", "");

        // 2. Sostituisce a capo e ritorni a capo con spazio singolo
        text = text.replaceAll("[\\r\\n]+", " ");

        // 3. Rimuove caratteri non inclusi in WinAnsiEncoding (limiti del font PDF)
        //    Permette lettere, numeri, punteggiatura di base, accenti principali, simboli comuni
        text = text.replaceAll("[^\u0020-\u007E\u00A0-\u00FF]", "");

        // 4. Sostituisce sequenze di spazi con uno singolo e rimuove spazi iniziali/finali
        return text.replaceAll("\\s+", " ").trim();
    }


    /**
     * - Ritorna una string con formato mm:ss, di una operazione
     * @param startTime - Start dell'operazione
     * @param endTime - Fine dell'operazione
      */
    public static String getOperationTime(long startTime, long endTime){
        long elapsedTimeMillis = endTime - startTime;
        long minutes = (elapsedTimeMillis / 1000) / 60;
        long seconds = (elapsedTimeMillis / 1000) % 60;
        long milliseconds = elapsedTimeMillis % 1000;

        return String.format("%02d:%02d.%03d", minutes, seconds, milliseconds);
    }
}