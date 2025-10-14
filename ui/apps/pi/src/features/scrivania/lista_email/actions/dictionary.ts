import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Protocollo');

dictionary
  // ACTIONS EMAIL
  .add('inoltraPecPeo', 'Inoltra via PEC/PEO')
  .add('rispondiPecPeo', 'Rispondi via PEC/PEO')
  .add('rispondiConProtocollo', 'Rispondi')
  .add('inoltraConProtocollo', 'Inoltra')
  .add('protocolla', 'Protocolla')
  .add('storico', 'Visualizza storico')
  .add('goToProtocollo', 'Vai al protocollo')
  .add('downloadAllegatiProtocollo', 'Download allegati')
  .add('actionRispondi', 'REPLY')
  .add('actioniInoltra', 'FORWARD')
  .add('actionRispondiConProtocollo', 'rispondiConProtocollo')
  .add('actioniInoltraConProtocollo', 'inoltraConProtocollo')

  // ACTIONS WEBSOCKET
  .add('syncSuccess', 'Sincronizzazione effettuata')
  .add('reSync', 'Connessione in corso, riprova tra poco')

  // RESPONSE
  .add('emailProtocollata', 'Email protocollata con successo')
  .add('emailNonProtocollata', 'Errore durante la protocollazione della email');
