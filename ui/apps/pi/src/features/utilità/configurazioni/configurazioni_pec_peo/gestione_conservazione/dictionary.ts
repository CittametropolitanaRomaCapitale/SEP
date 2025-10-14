import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Configurazione Conservazione');

dictionary
.add('headerTitle', 'Configurazione conservazione')

  // Campi FORM
  .add('url', 'URL')
  .add('username', 'User')
  .add('password', 'Password')
  .add('ente', 'Ente')
  .add('struttura', 'Struttura')
  .add('ambiente', 'Ambiente')

  // Tooltip
  .add('urlTooltip', 'Url del servizio di conservazione')
  .add('usernameTooltip', 'User del servizio di conservazione')
  .add('passwordTooltip', 'Password del servizio di conservazione')
  .add('enteTooltip', 'L\'ente delle richieste')
  .add('ambienteTooltip', 'L\'ambiente in cui si versa il file')
  .add('strutturaTooltip', 'La struttura che effettua le richieste')

  // Messages
  .add('save', 'Salva')
  .add('saveSuccess', 'Configurazione salvata con successo!')
  .add('updateSuccess', 'Configurazione aggiornata con successo!')