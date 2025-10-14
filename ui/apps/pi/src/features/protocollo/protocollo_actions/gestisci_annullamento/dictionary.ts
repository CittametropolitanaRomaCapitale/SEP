import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Gestione annullamento protocollo');

dictionary
.add('gestRichiestaTitle','Gestisci richiesta di annullamento')
.add('gestRichiestaAnnullamento','Gestisci annullamento')
.add('gestRichiestaAnnullamento','Gestisci richiesta di annullamento')
.add('annullaOk', ':numero annullato con successo')
.add('rifiutaOk', 'Richiesta di annullamento rifiutata')
.add('motivazione', 'Motivazione')
.add('conferma', 'Conferma')
.add('rifiuta','Rifiuta')
.add(
  'labelGestioneAnnullamento',
  "Vuoi confermare la richiesta di annullamento? Specifica la motivazione."
)


