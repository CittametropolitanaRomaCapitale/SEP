import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('RichiediAssegnazione');

dictionary
  // PULSANTI
  .add('richiediAssegnazione', 'Richiedi Assegnazione')
  .add('richiestaAssegnazioneOK', ':numero: richiesta assegnazione inviata con successo')
  .add('motivazione', 'Motivazione')
  .add('conferma', 'Conferma')
  .add('annulla', 'Annulla')
  .add('richiestaAssegnazioneCausa', 'Il protocollo è stato classificato in un fascicolo di cui non si ha visibilità')
  .add(
    'aggiungereNota',
    'Per visualizzare il protocollo :numero, si dovrà inviare una richiesta di assegnazione all\'utente che ha effettuato la fascicolazione. Specifica la motivazione'
  )
  