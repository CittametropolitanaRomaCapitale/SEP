import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ConfermaDatiNonSalvati');

dictionary
  .add('titleDialog', 'Dati non salvati')
  .add('messaggioDialogDatiNonSalvati', 'Attenzione! I dati inseriti verranno persi. Vuoi procedere lo stesso?')
  .add('continuaModificare', 'No, continua a modificare')
  .add('procediSenzaSalvare', 'Sì, procedi senza salvare');
