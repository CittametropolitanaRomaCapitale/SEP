package it.parsec326.pi.intranet.utils;


import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.TipologiaPosta;

/**
 * Contiene servizi di utilità per la gestione del protocollo.
 */
public class ProtocolloUtils {

    /**
     * Restituisce PEC se il metodo di spedizione è Pec.
     * Restituisce PEO se il metodo di spedizione è Email.
     * Restituisce null altrimenti.
     * @param metodoSpedizione
     * @return
     */
    public static String getTipoEmail(MetodoSpedizione metodoSpedizione) {
        if (isPec(metodoSpedizione))
            return TipologiaPosta.PEC.getTipologiaPosta();
        if (isPeo(metodoSpedizione))
            return TipologiaPosta.PEO.getTipologiaPosta();
        return null;
    }

    /**
     * Dato il metodo di spedizione, restituisce true se PEC.
     * @param metodoSpedizione
     * @return
     */
    public static boolean isPec(MetodoSpedizione metodoSpedizione) {
        return metodoSpedizione.equals(MetodoSpedizione.Pec);
    }

    /**
     * Dato il metodo di spedizione, restituisce true se Email
     * @param metodoSpedizione
     * @return
     */
    public static boolean isPeo(MetodoSpedizione metodoSpedizione) {
        return metodoSpedizione.equals(MetodoSpedizione.Email);
    }

    public static final String formatoFiligrana = "%s del %s - %s";


    /**
     * Util che consente di rimuovere un utente specifico se presente in una string di utenti
     * @param users - Lista di utenti in formato String seprati da virgola
     * @param userToRemove - utente che va rimosso dalla lista di users
     * @return
     */
    public static String removeUser(String users, String userToRemove) {
        if (users == null || users.isEmpty()) {
            return "";
        }

        String[] userArray = users.split(",");
        StringBuilder result = new StringBuilder();

        for (String user : userArray) {
            String trimmedUser = user.trim();
            if (!trimmedUser.equals(userToRemove)) {
                if (!result.isEmpty()) {
                    result.append(", ");
                }
                result.append(trimmedUser);
            }
        }

        return result.toString();
    }
}
