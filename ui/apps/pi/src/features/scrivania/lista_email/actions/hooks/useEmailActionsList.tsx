import { EmailBaseFragment, EmailDirection, TipologiaPosta } from "@cmrc/services/src/app/piapi/generated";
import { dictionary } from "../dictionary";

export const useEmailActionsList = () => {

    const getActions = (emailData: EmailBaseFragment) => {
        const actions = []

        // "Vai al protocollo" e "Download allegati" visibile solo se è presente il protocollo associato alla email
        if (emailData?.protocollo) {
            actions.push(dictionary.get('goToProtocollo'));
            actions.push(dictionary.get('downloadAllegatiProtocollo'));
        }

        // "Protocolla" visibile solo se non è presente il protocollo associato alla email in entrata
        else if (emailData?.emailDirection === EmailDirection.Entrata) {
            actions.push(dictionary.get('protocolla'));
        }

        // "Rispondi" e "Inoltra" visibili solo per le PEC protocollate in entrata
        if (emailData?.tipoEmail === TipologiaPosta.Pec && emailData?.protocollo && emailData?.emailDirection === EmailDirection.Entrata) {
            actions.push(dictionary.get('rispondiConProtocollo'));
            actions.push(dictionary.get('inoltraConProtocollo'));
        }

        // "Inoltra via PEC/PEO" e "Rispondi via PEC/PEO" visibili solo per le PEO
        if (emailData?.tipoEmail === TipologiaPosta.Peo) {
            actions.push(dictionary.get('inoltraPecPeo'));
            actions.push(dictionary.get('rispondiPecPeo'));
        }

        actions.push(dictionary.get('storico'))

        return actions
    }

    return {
        getActions
    }
}