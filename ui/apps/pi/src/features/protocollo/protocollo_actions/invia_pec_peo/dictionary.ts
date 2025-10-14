import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('InviaPecPeoForm');

dictionary
		.add('mittente', 'Mittente')
		.add('tipologia', 'Tipo')
	  .add('oggettoMail', 'Oggetto')
	  .add('corpoMail', 'Corpo')
		.add('invia', 'Invia')
		.add('cerca', 'Cerca')
	  .add('annulla', 'Annulla')
		.add('confermaAnnulla', 'I dati inseriti verranno persi. Vuoi procedere lo stesso?')
		.add('conferma', 'Conferma')

		.add('invioMultiploTooltip', 'Permette di inviare la PEC/PEO separatamente ai singoli destinatari per competenza')
		.add('invioMultiplo', 'Invio multiplo')

		// ALLEGATI TABLE
		.add('allegatiHeader', 'Allegati')
	  .add('nomeFile', 'Nome')
	  .add('dimensione', 'Dimensione')
	  .add('descrizione', 'Descrizione')
		.add('allegatoRequired', 'Il campo \'allegati\' è obbligatorio')

		// RESPONSE
		.add('invioPecPeoOK', 'PEC/PEO inviata con successo')
		.add('invioPecPeoKO', 'Errore durante l\'invio della PEC/PEO')



