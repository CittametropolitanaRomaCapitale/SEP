import { Dictionary } from '@cmrc/ui/utils/dictionary';

export const dictionary = new Dictionary<any, any>('Annulla Protocollo');

dictionary
.add('richiestaAnnullamento','Richiesta di annullamento')
.add('annulla','Annulla')
.add('richiestaOk', 'Richiesta di annullamento inoltrata')
.add('annullaOk', ':numero annullato con successo')
.add('richiesta_annullamento_ko', 'Problematica relativa alla richiesta di annullamento')
.add('motivazione', 'Motivazione')
.add('conferma', 'Conferma')
.add('annulla','Annulla')
.add('annullaAction', 'Annulla')
.add(
  'motivazioneRichiestaAnnullamento',
  "Stai per richiedere l'annullamento di :numero, specifica la motivazione."
)
.add(
  'motivazioneRichiestaAnnullamentoSub',
  "Ricorda di inserire l'eventuale numero che sostituisce il protocollo o circolare in oggetto."
)
.add(
  'motivazioneAnnullamento',
  "Stai per annullare :numero, specifica la motivazione"
)


