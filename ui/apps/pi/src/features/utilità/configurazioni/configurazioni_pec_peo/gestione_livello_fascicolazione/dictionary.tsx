import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>(
  'CampiLivelloFascicolazione'
);

dictionary
  .add(
    'configurazioniLivelloFascicolazione',
    'Configurazioni livello fascicolazione'
  )
  .add('livello', 'Livello massimo fascicolazione')
  .add(
    'numberRequired',
    'Il livello massimo di fascicolazione deve essere un numero'
  )
  .add('save', 'Salva')
  .add('saveSuccess', 'Livello massimo di fascicolazione salvato con successo')
  .add('saveLivelloFascicolazione', 'Salva livello fascicolazione')
  .add(
    'confirmSaveMessage',
    "Sei sicuro di voler aggiornare il livello massimo di fascicolazione a :livello? L'operazione sarà irreversibile."
  )
  .add('annulla', 'Annulla')
  .add('conferma', 'Conferma');
