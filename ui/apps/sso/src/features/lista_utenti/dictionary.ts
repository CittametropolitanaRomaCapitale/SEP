import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('ListaUtenti');

dictionary
  .add('username', 'Username')
  .add('nome', 'Nome')
  .add('nominativo', 'Nominativo')
  .add('cognome', 'Cognome')
  .add('email', 'E-mail')
  .add('enabled', 'Abilitato')
  .add('userEnabled', 'Abilitato')
  .add('userDisabled', 'Disabilitato')
  .add('offices', 'Uffici')
  .add('tabellaVuotaTesto', 'Non ci sono ancora utenti')
  .add('cerca', 'cerca')
  .add('usersEnabledFilter', 'Stato utenti')
  .add('allUsersStates', 'Tutti gli stati')
  .add('onlyEnabled', 'Abilitati')
  .add('onlyDisabled', 'Disabilitati');
