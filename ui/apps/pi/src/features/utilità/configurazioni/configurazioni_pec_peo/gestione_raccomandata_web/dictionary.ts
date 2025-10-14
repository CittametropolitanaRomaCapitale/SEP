import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Raccomandata web configurazione');

dictionary
  .add('username', 'Username')
  .add('password', 'Password')
  .add('gruppo', 'Gruppo')
  .add('save', 'Salva')
  .add('saveSuccess', 'Configurazione salvata con successo!')
  .add('updateSuccess', 'Configurazione aggiornata con successo!')
  .add('headerTitle', 'Configurazione raccomandata online')