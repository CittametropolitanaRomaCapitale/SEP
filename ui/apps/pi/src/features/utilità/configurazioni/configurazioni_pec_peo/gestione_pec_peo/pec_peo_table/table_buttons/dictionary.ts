import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('CampiPostaElettronica');

dictionary
.add('conferma', 'Conferma')
.add('annulla', 'Annulla')
.add('procedi', 'Procedi')
.add('configurazioneSalvata', 'Configurazione salvata con successo!')
.add('configurazioneEliminata', 'Configurazione eliminata con successo!')
.add('eliminaPecPeo', 'Elimina PEC/PEO')
.add(
    'confermaEliminaPecpeo',
    "Vuoi procedere con l'eliminazione della posta elettronica?"
  );
