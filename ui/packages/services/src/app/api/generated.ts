import { api } from './baseApi';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInteger: any;
  DateTime: any;
  Object: any;
};

export type Accertamento = {
  __typename?: 'Accertamento';
  accertamentoData?: Maybe<Accertamento>;
  accertato?: Maybe<Scalars['BigDecimal']>;
  annoCompetenza?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['Int']>;
  articoloDescr?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Scalars['Int']>;
  capitoloDescr?: Maybe<Scalars['String']>;
  capitoloStorico?: Maybe<Scalars['String']>;
  categoria?: Maybe<Scalars['String']>;
  categoriaDescr?: Maybe<Scalars['String']>;
  cdc?: Maybe<Scalars['String']>;
  cdcDscr?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cdrDescr?: Maybe<Scalars['String']>;
  contoF?: Maybe<Scalars['String']>;
  contoFinanziario?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  disponibilita?: Maybe<Scalars['BigDecimal']>;
  disponibilitaStorni?: Maybe<Scalars['BigDecimal']>;
  id?: Maybe<Scalars['BigInteger']>;
  impegnoData?: Maybe<Impegno>;
  importo?: Maybe<Scalars['BigDecimal']>;
  macroAggregato?: Maybe<Scalars['String']>;
  macroaggregatoDescr?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  missione?: Maybe<Scalars['String']>;
  missioneDescr?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  numAccertamento?: Maybe<Scalars['Int']>;
  numeroImpegno?: Maybe<Scalars['Int']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['BigDecimal']>;
  prenotazioneData?: Maybe<Prenotazione>;
  programma?: Maybe<Scalars['String']>;
  programmaDescr?: Maybe<Scalars['String']>;
  reimputazioneData?: Maybe<Reimputazione>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  sub?: Maybe<Scalars['Int']>;
  subAccertamentoData?: Maybe<SubAccertamento>;
  subImpegnoData?: Maybe<SubImpegno>;
  tipo?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  tipologiaDescr?: Maybe<Scalars['String']>;
  titolo?: Maybe<Scalars['Int']>;
  titoloDescr?: Maybe<Scalars['String']>;
  validato?: Maybe<Scalars['Boolean']>;
  vincolato?: Maybe<Scalars['Boolean']>;
};

export type AccertamentoInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numAccertamento?: InputMaybe<Scalars['Int']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export type ApprovazioneBilancioInputInput = {
  improcedibile?: InputMaybe<Scalars['Boolean']>;
  negativo?: InputMaybe<Scalars['Boolean']>;
  positivo?: InputMaybe<Scalars['Boolean']>;
};

export type Attivita = {
  __typename?: 'Attivita';
  avanzaStatoDetermina?: Maybe<Scalars['Boolean']>;
  bpmnProcessTaskId?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataCompletamento?: Maybe<Scalars['DateTime']>;
  dataCompletamentoString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataInserimento?: Maybe<Scalars['DateTime']>;
  dataInserimentoString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataPresaInCarico?: Maybe<Scalars['DateTime']>;
  dataPresaInCaricoString?: Maybe<Scalars['String']>;
  determina?: Maybe<Determina>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nota?: Maybe<Nota>;
  pdfGenerated?: Maybe<Scalars['Boolean']>;
  presaInCaricoDa?: Maybe<Scalars['String']>;
  presaInCaricoDaId?: Maybe<Scalars['String']>;
  referenceName?: Maybe<Scalars['String']>;
  revisione?: Maybe<Scalars['Boolean']>;
  roles?: Maybe<Scalars['String']>;
  stato?: Maybe<Scalars['String']>;
  statoAttivita?: Maybe<StatoAttivita>;
  statoDet?: Maybe<Scalars['String']>;
  statoDetermina?: Maybe<StatoDetermina>;
  statoRevisione?: Maybe<Scalars['String']>;
  tipo?: Maybe<Scalars['String']>;
  tipoAttivita?: Maybe<TipoAttivita>;
  userEnabled: Scalars['Boolean'];
};

export type AttivitaInputInput = {
  bpmnProcessTaskId?: InputMaybe<Scalars['String']>;
  dataInserimento?: InputMaybe<Scalars['String']>;
  dataPresaInCarico?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  presaInCaricoDa?: InputMaybe<Scalars['String']>;
  revisione?: InputMaybe<Scalars['Boolean']>;
  statoAttivita?: InputMaybe<Scalars['String']>;
  tipoAttivita?: InputMaybe<Scalars['String']>;
};

export type AttivitaPendenteDto = {
  __typename?: 'AttivitaPendenteDTO';
  dataPresaInCaricoString?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  potentialGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  presaInCaricoDa?: Maybe<Scalars['String']>;
  processId?: Maybe<Scalars['String']>;
  processInstanceId?: Maybe<Scalars['String']>;
  referenceName?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  stato?: Maybe<Scalars['String']>;
  userEnabled: Scalars['Boolean'];
};

export type AttribuzioniOrizzontali = {
  __typename?: 'AttribuzioniOrizzontali';
  controlloBeniServizi?: Maybe<Scalars['Boolean']>;
  controlloBilancio?: Maybe<Scalars['Boolean']>;
  controlloFiscale?: Maybe<Scalars['Boolean']>;
  controlloMutuo?: Maybe<Scalars['Boolean']>;
  controlloPartecipate?: Maybe<Scalars['Boolean']>;
  controlloPatrimonio?: Maybe<Scalars['Boolean']>;
  controlloPianoOpere?: Maybe<Scalars['Boolean']>;
  controlloPosizione?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  peg?: Maybe<Scalars['Boolean']>;
};

export type AttribuzioniOrizzontaliInput = {
  controlloBeniServizi?: InputMaybe<Scalars['Boolean']>;
  controlloBilancio?: InputMaybe<Scalars['Boolean']>;
  controlloFiscale?: InputMaybe<Scalars['Boolean']>;
  controlloMutuo?: InputMaybe<Scalars['Boolean']>;
  controlloPartecipate?: InputMaybe<Scalars['Boolean']>;
  controlloPatrimonio?: InputMaybe<Scalars['Boolean']>;
  controlloPianoOpere?: InputMaybe<Scalars['Boolean']>;
  controlloPosizione?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['BigInteger']>;
  peg?: InputMaybe<Scalars['Boolean']>;
};

export type AttribuzioniOrizzontaliInputInput = {
  attribuzioniOrizzontali?: InputMaybe<AttribuzioniOrizzontaliInput>;
  sceltaAttribuzioniOrizzontali?: InputMaybe<Scalars['Boolean']>;
};

export type CheckDisponibilitaDto = {
  __typename?: 'CheckDisponibilitaDTO';
  determine?: Maybe<Array<Maybe<Determina>>>;
  disponibilitaContabilita?: Maybe<Scalars['BigDecimal']>;
  disponibilitaEffettiva?: Maybe<Scalars['BigDecimal']>;
  totaleImpegnatoAccertato?: Maybe<Scalars['BigDecimal']>;
};

export type DatiUtenteDto = {
  __typename?: 'DatiUtenteDTO';
  history?: Maybe<Array<Maybe<UserHistory>>>;
  storic_offices?: Maybe<Array<Maybe<Office>>>;
  user_data?: Maybe<DatiUtenteSso>;
  utenteData?: Maybe<Utente>;
};

export type DatiUtenteSso = {
  __typename?: 'DatiUtenteSSO';
  auth_id?: Maybe<Scalars['String']>;
  delegations?: Maybe<Array<Maybe<Delegation>>>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  userOffices?: Maybe<Array<Maybe<UserOffice>>>;
  username?: Maybe<Scalars['String']>;
};

export type DefaultDetermina = {
  __typename?: 'DefaultDetermina';
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  nomeCampo?: Maybe<Scalars['String']>;
  tipoDetermina?: Maybe<TipoDetermina>;
  valore?: Maybe<Scalars['String']>;
};

export type DefaultDeterminaInputInput = {
  nomeCampo?: InputMaybe<Scalars['String']>;
  tipoDetermina?: InputMaybe<Scalars['String']>;
  valore?: InputMaybe<Scalars['String']>;
};

export type DefaultListe = {
  __typename?: 'DefaultListe';
  attivo?: Maybe<Scalars['Boolean']>;
  cdr?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  nomeCampo?: Maybe<Scalars['String']>;
  tipoLista?: Maybe<TipoLista>;
};

export type DefaultListeInputInput = {
  attivo?: InputMaybe<Scalars['Boolean']>;
  cdr?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  nomeCampo?: InputMaybe<Scalars['String']>;
  tipoLista?: InputMaybe<Scalars['String']>;
};

export type Delegation = {
  __typename?: 'Delegation';
  /** ISO-8601 */
  delegation_end?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  delegation_start?: Maybe<Scalars['DateTime']>;
  fromUserData?: Maybe<DatiUtenteSso>;
  permits?: Maybe<Array<Maybe<Permit>>>;
};

export type Determina = {
  __typename?: 'Determina';
  allegatiInPubblicazione?: Maybe<Array<Maybe<Documento>>>;
  anac?: Maybe<Scalars['Boolean']>;
  annoDetermina?: Maybe<Scalars['Int']>;
  annoProposta?: Maybe<Scalars['Int']>;
  ato2?: Maybe<Scalars['Boolean']>;
  attivita_pendente?: Maybe<AttivitaPendenteDto>;
  attribuzioniOrizzontali?: Maybe<AttribuzioniOrizzontali>;
  attribuzioni_orizzontali_id?: Maybe<Scalars['BigInteger']>;
  bpmnProcessId?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataCreazione?: Maybe<Scalars['DateTime']>;
  dataCreazioneString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataEsecutiva?: Maybe<Scalars['DateTime']>;
  dataEsecutivaString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataFinePubblicazione?: Maybe<Scalars['DateTime']>;
  dataFinePubblicazioneString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataInizioPubblicazione?: Maybe<Scalars['DateTime']>;
  dataInizioPubblicazioneString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataProposta?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataProtocollazione?: Maybe<Scalars['DateTime']>;
  dataProtocollazioneString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataRedazione?: Maybe<Scalars['DateTime']>;
  dataRedazioneString?: Maybe<Scalars['String']>;
  deleted: Scalars['Boolean'];
  dispositivo?: Maybe<Scalars['String']>;
  dispositivo_clean?: Maybe<Scalars['String']>;
  documenti?: Maybe<Array<Maybe<Documento>>>;
  documentoOscurato?: Maybe<Documento>;
  documentoOscuratoBozza?: Maybe<Documento>;
  documentoOscuratoFirmato?: Maybe<Documento>;
  documentoPrincipale?: Maybe<Documento>;
  documentoPrincipaleFirmato?: Maybe<Documento>;
  email?: Maybe<Scalars['String']>;
  faseDetermina?: Maybe<FaseDetermina>;
  formAnac?: Maybe<Array<Maybe<FormAnac>>>;
  formAnacCompletato?: Maybe<Array<Maybe<FormAnac>>>;
  formGpp?: Maybe<FormGpp>;
  gpp?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['BigInteger']>;
  idAtto?: Maybe<Scalars['BigInteger']>;
  listaAttivita?: Maybe<Array<Maybe<Attivita>>>;
  metaType?: Maybe<Scalars['String']>;
  modLiquidazione?: Maybe<Scalars['String']>;
  modLiquidazione_clean?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  motivazione_clean?: Maybe<Scalars['String']>;
  note?: Maybe<Array<Maybe<Nota>>>;
  numProposta?: Maybe<Scalars['String']>;
  numProtocollo?: Maybe<Scalars['String']>;
  num_proposta_num?: Maybe<Scalars['BigInteger']>;
  numeroRepertorio?: Maybe<Scalars['String']>;
  oggetto?: Maybe<Scalars['String']>;
  preferita: Scalars['Boolean'];
  premesso?: Maybe<Scalars['String']>;
  premesso_clean?: Maybe<Scalars['String']>;
  preseDatto?: Maybe<Scalars['String']>;
  preseDatto_clean?: Maybe<Scalars['String']>;
  proprietaOffuscate?: Maybe<Array<Maybe<ProprietaOffuscata>>>;
  redattore?: Maybe<Scalars['String']>;
  responsabileIstruttoria?: Maybe<Scalars['String']>;
  responsabileProcedimento?: Maybe<Scalars['String']>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  ruDetermina?: Maybe<Scalars['String']>;
  ruDetermina_num?: Maybe<Scalars['BigInteger']>;
  skipResponsabileProcedimento?: Maybe<Scalars['Boolean']>;
  soggettiMotivoEsclusioneCig?: Maybe<Array<Maybe<Soggetto>>>;
  soggettiUniqueCig?: Maybe<Array<Maybe<Soggetto>>>;
  stato?: Maybe<Scalars['String']>;
  statoDetermina?: Maybe<StatoDetermina>;
  template?: Maybe<Scalars['String']>;
  template_type?: Maybe<TemplateDeterminaType>;
  tipo?: Maybe<Scalars['String']>;
  tipoAffidamento?: Maybe<Scalars['String']>;
  tipoDetermina?: Maybe<TipoDetermina>;
  validazione?: Maybe<ValidazioneTabDto>;
  vistiDiLegge?: Maybe<Scalars['String']>;
  vistiDiLegge_clean?: Maybe<Scalars['String']>;
  vistoDipartimentale?: Maybe<Scalars['Boolean']>;
};

export type DeterminaFormAnac = {
  __typename?: 'DeterminaFormAnac';
  anacCompletato?: Maybe<Scalars['Boolean']>;
  annoDetermina?: Maybe<Scalars['String']>;
  annoProposta?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cig?: Maybe<Scalars['String']>;
  determina_id?: Maybe<Scalars['BigInteger']>;
  formAnac?: Maybe<FormAnac>;
  importoDiAggiudicazione?: Maybe<Scalars['BigDecimal']>;
  numProposta?: Maybe<Scalars['String']>;
  oggettoDetermina?: Maybe<Scalars['String']>;
  ruDetermina?: Maybe<Scalars['String']>;
  stato?: Maybe<Scalars['String']>;
  statoAnac?: Maybe<Scalars['String']>;
  statoDetermina?: Maybe<StatoDetermina>;
  tipo?: Maybe<Scalars['String']>;
  tipoDetermina?: Maybe<TipoDetermina>;
};

export type DeterminaFormGpp = {
  __typename?: 'DeterminaFormGpp';
  annoDetermina?: Maybe<Scalars['String']>;
  annoProposta?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  determina_id?: Maybe<Scalars['BigInteger']>;
  formGpp?: Maybe<FormGpp>;
  gppCompletato?: Maybe<Scalars['Boolean']>;
  numProposta?: Maybe<Scalars['String']>;
  oggettoDetermina?: Maybe<Scalars['String']>;
  ruDetermina?: Maybe<Scalars['String']>;
  stato?: Maybe<Scalars['String']>;
  statoDetermina?: Maybe<StatoDetermina>;
  statoGpp?: Maybe<Scalars['String']>;
  tipo?: Maybe<Scalars['String']>;
  tipoDetermina?: Maybe<TipoDetermina>;
  totaleGpp?: Maybe<Scalars['BigDecimal']>;
};

export type DeterminaInputInput = {
  anac?: InputMaybe<Scalars['Boolean']>;
  bpmnProcessId?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  dataEsecutiva?: InputMaybe<Scalars['String']>;
  /** ISO-8601 */
  dataFinePubblicazione?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataInizioPubblicazione?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataProtocollazione?: InputMaybe<Scalars['DateTime']>;
  dispositivo?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  faseDetermina?: InputMaybe<Scalars['String']>;
  gpp?: InputMaybe<Scalars['Boolean']>;
  modLiquidazione?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numProtocollo?: InputMaybe<Scalars['String']>;
  numeroRepertorio?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  premesso?: InputMaybe<Scalars['String']>;
  preseDatto?: InputMaybe<Scalars['String']>;
  redattore?: InputMaybe<Scalars['String']>;
  responsabileIstruttoria?: InputMaybe<Scalars['String']>;
  responsabileProcedimento?: InputMaybe<Scalars['String']>;
  riferimentiContabiliId?: InputMaybe<Scalars['BigInteger']>;
  skipResponsabileProcedimento?: InputMaybe<Scalars['Boolean']>;
  statoDetermina?: InputMaybe<Scalars['String']>;
  template?: InputMaybe<Scalars['String']>;
  tipoAffidamento?: InputMaybe<Scalars['String']>;
  tipoDetermina?: InputMaybe<Scalars['String']>;
  vistiDiLegge?: InputMaybe<Scalars['String']>;
  vistoDipartimentale?: InputMaybe<Scalars['Boolean']>;
};

export type Documento = {
  __typename?: 'Documento';
  bozza?: Maybe<Scalars['Boolean']>;
  determina_id?: Maybe<Scalars['BigInteger']>;
  firmato?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['BigInteger']>;
  inPubblicazione?: Maybe<Scalars['Boolean']>;
  metaType?: Maybe<Scalars['String']>;
  nonInPubblicazione?: Maybe<Scalars['Boolean']>;
  oscurato?: Maybe<Scalars['Boolean']>;
  principale?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['String']>;
};

export type DocumentoInputInput = {
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  inPubblicazione?: InputMaybe<Scalars['Boolean']>;
  nonInPubblicazione?: InputMaybe<Scalars['Boolean']>;
  oscurato?: InputMaybe<Scalars['Boolean']>;
  principale?: InputMaybe<Scalars['Boolean']>;
  url?: InputMaybe<Scalars['String']>;
};

export type FasciaDiControllo = {
  __typename?: 'FasciaDiControllo';
  /** ISO-8601 */
  a?: Maybe<Scalars['DateTime']>;
  aString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  da?: Maybe<Scalars['DateTime']>;
  daString?: Maybe<Scalars['String']>;
  deleted: Scalars['Boolean'];
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  tipoDetermina?: Maybe<TipoDetermina>;
};

export enum FasciaDiControlloFilter {
  Attive = 'ATTIVE',
  Storico = 'STORICO',
  Tutte = 'TUTTE'
}

export type FasciaDiControlloInputInput = {
  a?: InputMaybe<Scalars['String']>;
  da?: InputMaybe<Scalars['String']>;
  tipoDetermina?: InputMaybe<TipoDetermina>;
};

export enum FaseDetermina {
  Annullata = 'annullata',
  ApprovazioneDiRagioneria = 'approvazioneDiRagioneria',
  FirmaDirigenteRagioneria = 'firmaDirigenteRagioneria',
  Firmata = 'firmata',
  Pubblicata = 'pubblicata',
  Redazione = 'redazione',
  SecondaApprovazioneDiRagioneria = 'secondaApprovazioneDiRagioneria'
}

export enum FiltroAttivita {
  Concluse = 'CONCLUSE',
  Default = 'DEFAULT',
  DiFirma = 'DI_FIRMA',
  LeMieAttivita = 'LE_MIE_ATTIVITA'
}

export type FirmaInputInput = {
  otp?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type FormAnac = {
  __typename?: 'FormAnac';
  cig?: Maybe<Scalars['String']>;
  codice_struttura_preponente?: Maybe<Scalars['String']>;
  completato?: Maybe<Scalars['Boolean']>;
  determina_id?: Maybe<Scalars['BigInteger']>;
  gruppiInvitati?: Maybe<Array<Maybe<GruppoInvitatoAnac>>>;
  id?: Maybe<Scalars['BigInteger']>;
  importoDiAggiudicazione?: Maybe<Scalars['BigDecimal']>;
  importo_aggiudicazione?: Maybe<Scalars['BigDecimal']>;
  importo_somme_liquidate?: Maybe<Scalars['BigDecimal']>;
  invitati?: Maybe<Array<Maybe<InvitatoAnac>>>;
  metaType?: Maybe<Scalars['String']>;
  nome_struttura_preponente?: Maybe<Scalars['String']>;
  oggetto_bando?: Maybe<Scalars['String']>;
  procesura_scelta?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tempo_completamento_servizio_a?: Maybe<Scalars['DateTime']>;
  tempo_completamento_servizio_aString?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tempo_completamento_servizio_da?: Maybe<Scalars['DateTime']>;
  tempo_completamento_servizio_daString?: Maybe<Scalars['String']>;
};

export type FormAnacInputInput = {
  cig?: InputMaybe<Scalars['String']>;
  codice_struttura_preponente?: InputMaybe<Scalars['String']>;
  completato?: InputMaybe<Scalars['Boolean']>;
  determina_id?: InputMaybe<Scalars['BigInteger']>;
  importo_aggiudicazione?: InputMaybe<Scalars['BigDecimal']>;
  importo_somme_liquidate?: InputMaybe<Scalars['BigDecimal']>;
  nome_struttura_preponente?: InputMaybe<Scalars['String']>;
  oggetto_bando?: InputMaybe<Scalars['String']>;
  procesura_scelta?: InputMaybe<Scalars['String']>;
  tempo_completamento_servizio_a?: InputMaybe<Scalars['String']>;
  tempo_completamento_servizio_da?: InputMaybe<Scalars['String']>;
};

export type FormGpp = {
  __typename?: 'FormGpp';
  categorie?: Maybe<Array<Maybe<GppCategoria>>>;
  completato?: Maybe<Scalars['Boolean']>;
  determina_id?: Maybe<Scalars['BigInteger']>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  totale?: Maybe<Scalars['BigDecimal']>;
  totaleGpp?: Maybe<Scalars['BigDecimal']>;
};

export type FormGppInputInput = {
  completato?: InputMaybe<Scalars['Boolean']>;
  determina_id?: InputMaybe<Scalars['BigInteger']>;
};

export type GppCategoria = {
  __typename?: 'GppCategoria';
  anno?: Maybe<Scalars['Int']>;
  categoria?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  form_gpp_id?: Maybe<Scalars['BigInteger']>;
  id?: Maybe<Scalars['BigInteger']>;
  macro_categoria?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  quantita?: Maybe<Scalars['Int']>;
  quantita_gpp?: Maybe<Scalars['Int']>;
  totale?: Maybe<Scalars['BigDecimal']>;
};

export type GppCategoriaInputInput = {
  anno?: InputMaybe<Scalars['Int']>;
  categoria?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  form_gpp_id?: InputMaybe<Scalars['BigInteger']>;
  macro_categoria?: InputMaybe<Scalars['String']>;
  quantita?: InputMaybe<Scalars['Int']>;
  quantita_gpp?: InputMaybe<Scalars['Int']>;
  totale?: InputMaybe<Scalars['BigDecimal']>;
};

export type GruppoInvitatoAnac = {
  __typename?: 'GruppoInvitatoAnac';
  aggiudicatario?: Maybe<Scalars['Boolean']>;
  codice_fiscale?: Maybe<Scalars['String']>;
  form_anac_id?: Maybe<Scalars['BigInteger']>;
  id?: Maybe<Scalars['BigInteger']>;
  identificativoFiscaleEstero?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  ragione_sociale?: Maybe<Scalars['String']>;
  ruolo?: Maybe<Scalars['String']>;
};

export type GruppoInvitatoAnacInputInput = {
  aggiudicatario?: InputMaybe<Scalars['Boolean']>;
  codice_fiscale?: InputMaybe<Scalars['String']>;
  form_anac_id?: InputMaybe<Scalars['BigInteger']>;
  identificativoFiscaleEstero?: InputMaybe<Scalars['String']>;
  ragione_sociale?: InputMaybe<Scalars['String']>;
  ruolo?: InputMaybe<Scalars['String']>;
};

export type Impegno = {
  __typename?: 'Impegno';
  accertamentoData?: Maybe<Accertamento>;
  annoCompetenza?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['Int']>;
  articoloDescr?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Scalars['Int']>;
  capitoloDescr?: Maybe<Scalars['String']>;
  capitoloStorico?: Maybe<Scalars['String']>;
  categoria?: Maybe<Scalars['String']>;
  categoriaDescr?: Maybe<Scalars['String']>;
  cdc?: Maybe<Scalars['String']>;
  cdcDscr?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cdrDescr?: Maybe<Scalars['String']>;
  contoF?: Maybe<Scalars['String']>;
  contoFinanziario?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  disponibilita?: Maybe<Scalars['BigDecimal']>;
  disponibilitaStorni?: Maybe<Scalars['BigDecimal']>;
  id?: Maybe<Scalars['BigInteger']>;
  impIniz?: Maybe<Scalars['BigDecimal']>;
  impVar?: Maybe<Scalars['BigDecimal']>;
  impegnato?: Maybe<Scalars['BigDecimal']>;
  impegnoData?: Maybe<Impegno>;
  importo?: Maybe<Scalars['BigDecimal']>;
  macroAggregato?: Maybe<Scalars['String']>;
  macroaggregatoDescr?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  missione?: Maybe<Scalars['String']>;
  missioneDescr?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  numPrenotazioneSIBAssociata?: Maybe<Scalars['Int']>;
  numeroImpegno?: Maybe<Scalars['Int']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['BigDecimal']>;
  prenotazione?: Maybe<Scalars['Boolean']>;
  prenotazioneData?: Maybe<Prenotazione>;
  programma?: Maybe<Scalars['String']>;
  programmaDescr?: Maybe<Scalars['String']>;
  reimputazioneData?: Maybe<Reimputazione>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  sub?: Maybe<Scalars['Int']>;
  subAccertamentoData?: Maybe<SubAccertamento>;
  subImpegnoData?: Maybe<SubImpegno>;
  tipo?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  tipologiaDescr?: Maybe<Scalars['String']>;
  titolo?: Maybe<Scalars['Int']>;
  titoloDescr?: Maybe<Scalars['String']>;
  validato?: Maybe<Scalars['Boolean']>;
  vincolato?: Maybe<Scalars['Boolean']>;
};

export type ImpegnoInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export type InvitatoAnac = {
  __typename?: 'InvitatoAnac';
  aggiudicatario?: Maybe<Scalars['Boolean']>;
  codice_fiscale?: Maybe<Scalars['String']>;
  form_anac_id?: Maybe<Scalars['BigInteger']>;
  id?: Maybe<Scalars['BigInteger']>;
  identificativoFiscaleEstero?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  ragione_sociale?: Maybe<Scalars['String']>;
};

export type InvitatoAnacInputInput = {
  aggiudicatario?: InputMaybe<Scalars['Boolean']>;
  codice_fiscale?: InputMaybe<Scalars['String']>;
  form_anac_id?: InputMaybe<Scalars['BigInteger']>;
  identificativoFiscaleEstero?: InputMaybe<Scalars['String']>;
  ragione_sociale?: InputMaybe<Scalars['String']>;
};

export type Movimento = {
  __typename?: 'Movimento';
  accertamentoData?: Maybe<Accertamento>;
  annoCompetenza?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['Int']>;
  articoloDescr?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Scalars['Int']>;
  capitoloDescr?: Maybe<Scalars['String']>;
  capitoloStorico?: Maybe<Scalars['String']>;
  categoria?: Maybe<Scalars['String']>;
  categoriaDescr?: Maybe<Scalars['String']>;
  cdc?: Maybe<Scalars['String']>;
  cdcDscr?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cdrDescr?: Maybe<Scalars['String']>;
  contoF?: Maybe<Scalars['String']>;
  contoFinanziario?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  disponibilita?: Maybe<Scalars['BigDecimal']>;
  id?: Maybe<Scalars['BigInteger']>;
  impegnoData?: Maybe<Impegno>;
  importo?: Maybe<Scalars['BigDecimal']>;
  macroAggregato?: Maybe<Scalars['String']>;
  macroaggregatoDescr?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  missione?: Maybe<Scalars['String']>;
  missioneDescr?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  numeroImpegno?: Maybe<Scalars['Int']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['BigDecimal']>;
  prenotazioneData?: Maybe<Prenotazione>;
  programma?: Maybe<Scalars['String']>;
  programmaDescr?: Maybe<Scalars['String']>;
  reimputazioneData?: Maybe<Reimputazione>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  sub?: Maybe<Scalars['Int']>;
  subAccertamentoData?: Maybe<SubAccertamento>;
  subImpegnoData?: Maybe<SubImpegno>;
  tipo?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  tipologiaDescr?: Maybe<Scalars['String']>;
  titolo?: Maybe<Scalars['Int']>;
  titoloDescr?: Maybe<Scalars['String']>;
  validato?: Maybe<Scalars['Boolean']>;
  vincolato?: Maybe<Scalars['Boolean']>;
};

export type MovimentoInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export type MovimentoUscitaInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  id?: InputMaybe<Scalars['BigInteger']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numAccertamento?: InputMaybe<Scalars['Int']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipo_movimento?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export type MultiMovimentoSoggettoUpdateInput = {
  movimentoUscitaInputList?: InputMaybe<Array<InputMaybe<MovimentoUscitaInputInput>>>;
  soggettoInputList?: InputMaybe<Array<InputMaybe<SoggettoInputInput>>>;
};

/** Mutation root */
export type Mutation = {
  __typename?: 'Mutation';
  aggiornaAccertamento?: Maybe<Accertamento>;
  aggiornaAttivita?: Maybe<Attivita>;
  aggiornaDefaultDetermina?: Maybe<DefaultDetermina>;
  aggiornaDefaultListe?: Maybe<DefaultListe>;
  aggiornaDetermina?: Maybe<Determina>;
  aggiornaDocumento?: Maybe<Documento>;
  aggiornaFasciaDiControllo?: Maybe<FasciaDiControllo>;
  aggiornaFormAnac?: Maybe<FormAnac>;
  aggiornaFormGpp?: Maybe<FormGpp>;
  aggiornaGppCategoria?: Maybe<GppCategoria>;
  aggiornaGruppoInvitatoAnac?: Maybe<GruppoInvitatoAnac>;
  aggiornaImpegno?: Maybe<Impegno>;
  aggiornaInvitatoAnac?: Maybe<InvitatoAnac>;
  aggiornaMovimento?: Maybe<Movimento>;
  aggiornaNota?: Maybe<Nota>;
  aggiornaPrenotazione?: Maybe<Prenotazione>;
  aggiornaProprietaOffuscata?: Maybe<ProprietaOffuscata>;
  aggiornaReimputazione?: Maybe<Reimputazione>;
  aggiornaRiferimentiContabili?: Maybe<RiferimentiContabili>;
  aggiornaSoggetto?: Maybe<Soggetto>;
  aggiornaSubAccertamento?: Maybe<SubAccertamento>;
  aggiornaSubImpegno?: Maybe<SubImpegno>;
  aggiornaUtente?: Maybe<Utente>;
  annullaDetermina: Scalars['Boolean'];
  cambiaAttivita: Scalars['Boolean'];
  completaAttivita?: Maybe<Attivita>;
  duplicaDetermina?: Maybe<Determina>;
  eliminaAccertamento: Scalars['Boolean'];
  eliminaAttivita: Scalars['Boolean'];
  eliminaDefaultDetermina: Scalars['Boolean'];
  eliminaDefaultListe: Scalars['Boolean'];
  eliminaDefinitivamenteFasciaDiControllo: Scalars['Boolean'];
  eliminaDetermina: Scalars['Boolean'];
  eliminaDocumento: Scalars['Boolean'];
  eliminaFasciaDiControllo: Scalars['Boolean'];
  eliminaFormAnac: Scalars['Boolean'];
  eliminaFormGpp: Scalars['Boolean'];
  eliminaGppCategoria: Scalars['Boolean'];
  eliminaGruppoInvitatoAnac: Scalars['Boolean'];
  eliminaImpegno: Scalars['Boolean'];
  eliminaInvitatoAnac: Scalars['Boolean'];
  eliminaListaFasciaDiControllo: Scalars['Boolean'];
  eliminaMovimento: Scalars['Boolean'];
  eliminaNota: Scalars['Boolean'];
  eliminaPrenotazione: Scalars['Boolean'];
  eliminaProprietaOffuscata: Scalars['Boolean'];
  eliminaReimputazione: Scalars['Boolean'];
  eliminaRiferimentiContabili: Scalars['Boolean'];
  eliminaSoggetto: Scalars['Boolean'];
  eliminaSubAccertamento: Scalars['Boolean'];
  eliminaSubImpegno: Scalars['Boolean'];
  eliminaUtente: Scalars['Boolean'];
  firmaMultipla?: Maybe<Array<Maybe<Attivita>>>;
  generateD33CSV: Scalars['Boolean'];
  mergeDefaultDetermina?: Maybe<DefaultDetermina>;
  rilasciaAttivita?: Maybe<Attivita>;
  rivendicaAttivita?: Maybe<Attivita>;
  rivendicaAttivitaMassiva?: Maybe<Array<Maybe<Attivita>>>;
  salvaAccertamento?: Maybe<Accertamento>;
  salvaAttivita?: Maybe<Attivita>;
  salvaAttribuzioniOrizzontali?: Maybe<AttribuzioniOrizzontali>;
  salvaDefaultDetermina?: Maybe<DefaultDetermina>;
  salvaDefaultListe?: Maybe<DefaultListe>;
  salvaDetermina?: Maybe<Determina>;
  salvaFasciaDiControllo?: Maybe<FasciaDiControllo>;
  salvaFormAnac?: Maybe<FormAnac>;
  salvaFormGpp?: Maybe<FormGpp>;
  salvaGppCategoria?: Maybe<GppCategoria>;
  salvaGruppoInvitatoAnac?: Maybe<GruppoInvitatoAnac>;
  salvaImpegno?: Maybe<Impegno>;
  salvaInvitatoAnac?: Maybe<InvitatoAnac>;
  salvaMovimento?: Maybe<Movimento>;
  salvaMultiMovimentoSoggetto: Scalars['Boolean'];
  salvaMultiMovimentoSoggettoStorni: Scalars['Boolean'];
  salvaMultiProprietaOffuscataSoggetto: Scalars['Boolean'];
  salvaNota?: Maybe<Nota>;
  salvaPrenotazione?: Maybe<Prenotazione>;
  salvaProprietaOffuscataDetermina?: Maybe<ProprietaOffuscata>;
  salvaProprietaOffuscataRiferimentiContabili?: Maybe<ProprietaOffuscata>;
  salvaProprietaOffuscataSoggetto?: Maybe<ProprietaOffuscata>;
  salvaProprietaOffuscateDetermina: Scalars['Boolean'];
  salvaReimputazione?: Maybe<Reimputazione>;
  salvaRiferimentiContabili?: Maybe<RiferimentiContabili>;
  salvaSoggetto?: Maybe<Soggetto>;
  salvaSubAccertamento?: Maybe<SubAccertamento>;
  salvaSubImpegno?: Maybe<Movimento>;
  salvaUtente?: Maybe<Utente>;
  toggleDeterminaPreferita?: Maybe<Utente>;
  valida_capitolo?: Maybe<Array<Maybe<ValidazioneDto>>>;
  valida_prenotazione?: Maybe<Array<Maybe<ValidazioneDto>>>;
  valida_subImpegnoAccertamento?: Maybe<Array<Maybe<ValidazioneDto>>>;
};


/** Mutation root */
export type MutationAggiornaAccertamentoArgs = {
  data?: InputMaybe<AccertamentoInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaAttivitaArgs = {
  data?: InputMaybe<AttivitaInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaDefaultDeterminaArgs = {
  data?: InputMaybe<DefaultDeterminaInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaDefaultListeArgs = {
  data?: InputMaybe<DefaultListeInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaDeterminaArgs = {
  data?: InputMaybe<DeterminaInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaDocumentoArgs = {
  data?: InputMaybe<DocumentoInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaFasciaDiControlloArgs = {
  data?: InputMaybe<FasciaDiControlloInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaFormAnacArgs = {
  data?: InputMaybe<FormAnacInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaFormGppArgs = {
  data?: InputMaybe<FormGppInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaGppCategoriaArgs = {
  data?: InputMaybe<GppCategoriaInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaGruppoInvitatoAnacArgs = {
  data?: InputMaybe<GruppoInvitatoAnacInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaImpegnoArgs = {
  data?: InputMaybe<ImpegnoInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaInvitatoAnacArgs = {
  data?: InputMaybe<InvitatoAnacInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaMovimentoArgs = {
  data?: InputMaybe<MovimentoInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
  tipoUscita?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationAggiornaNotaArgs = {
  data?: InputMaybe<NotaInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaPrenotazioneArgs = {
  data?: InputMaybe<PrenotazioneInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaProprietaOffuscataArgs = {
  data?: InputMaybe<ProprietaOffuscataInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaReimputazioneArgs = {
  data?: InputMaybe<ReimputazioneInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaRiferimentiContabiliArgs = {
  data?: InputMaybe<RiferimentiContabiliInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaSoggettoArgs = {
  data?: InputMaybe<SoggettoInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaSubAccertamentoArgs = {
  data?: InputMaybe<SubAccertamentoInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaSubImpegnoArgs = {
  data?: InputMaybe<SubImpegnoInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAggiornaUtenteArgs = {
  data?: InputMaybe<UtenteInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAnnullaDeterminaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  nota?: InputMaybe<NotaInputInput>;
};


/** Mutation root */
export type MutationCambiaAttivitaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  nuovaAttivita?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationCompletaAttivitaArgs = {
  approvazioneBilancioInput?: InputMaybe<ApprovazioneBilancioInputInput>;
  attribuzioniOrizzontali?: InputMaybe<AttribuzioniOrizzontaliInputInput>;
  avanzaStatoDetermina?: InputMaybe<Scalars['Boolean']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  firmaInput?: InputMaybe<FirmaInputInput>;
  nota?: InputMaybe<NotaInputInput>;
  omissis?: InputMaybe<Scalars['Boolean']>;
  remote_sign?: InputMaybe<Scalars['Boolean']>;
  revisione?: InputMaybe<Scalars['Boolean']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskId?: InputMaybe<Scalars['String']>;
  taskName?: InputMaybe<TipoAttivita>;
  titoloScelto?: InputMaybe<Scalars['Int']>;
};


/** Mutation root */
export type MutationDuplicaDeterminaArgs = {
  data?: InputMaybe<DeterminaInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaAccertamentoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaAttivitaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaDefaultDeterminaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaDefaultListeArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaDefinitivamenteFasciaDiControlloArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaDeterminaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaDocumentoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaFasciaDiControlloArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaFormAnacArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaFormGppArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaGppCategoriaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaGruppoInvitatoAnacArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaImpegnoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaInvitatoAnacArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaListaFasciaDiControlloArgs = {
  idList?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
};


/** Mutation root */
export type MutationEliminaMovimentoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaNotaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaPrenotazioneArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaProprietaOffuscataArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaReimputazioneArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaRiferimentiContabiliArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaSoggettoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaSubAccertamentoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaSubImpegnoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationEliminaUtenteArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationFirmaMultiplaArgs = {
  approvazioneBilancioInput?: InputMaybe<ApprovazioneBilancioInputInput>;
  attribuzioniOrizzontali?: InputMaybe<AttribuzioniOrizzontaliInputInput>;
  avanzaStatoDetermina?: InputMaybe<Scalars['Boolean']>;
  determineIds?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  firmaInput?: InputMaybe<FirmaInputInput>;
  omissis?: InputMaybe<Scalars['Boolean']>;
  remote_sign?: InputMaybe<Scalars['Boolean']>;
  revisione?: InputMaybe<Scalars['Boolean']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskNames?: InputMaybe<Array<InputMaybe<TipoAttivita>>>;
  titoloScelto?: InputMaybe<Scalars['Int']>;
};


/** Mutation root */
export type MutationGenerateD33CsvArgs = {
  year?: InputMaybe<Scalars['Int']>;
};


/** Mutation root */
export type MutationMergeDefaultDeterminaArgs = {
  data?: InputMaybe<DefaultDeterminaInputInput>;
};


/** Mutation root */
export type MutationRilasciaAttivitaArgs = {
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskId?: InputMaybe<Scalars['String']>;
  taskName?: InputMaybe<TipoAttivita>;
};


/** Mutation root */
export type MutationRivendicaAttivitaArgs = {
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  referenceName?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskId?: InputMaybe<Scalars['String']>;
  taskName?: InputMaybe<TipoAttivita>;
};


/** Mutation root */
export type MutationRivendicaAttivitaMassivaArgs = {
  determineIds?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  referenceNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  taskNames?: InputMaybe<Array<InputMaybe<TipoAttivita>>>;
};


/** Mutation root */
export type MutationSalvaAccertamentoArgs = {
  data?: InputMaybe<AccertamentoInputInput>;
};


/** Mutation root */
export type MutationSalvaAttivitaArgs = {
  data?: InputMaybe<AttivitaInputInput>;
};


/** Mutation root */
export type MutationSalvaAttribuzioniOrizzontaliArgs = {
  data?: InputMaybe<AttribuzioniOrizzontaliInput>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSalvaDefaultDeterminaArgs = {
  data?: InputMaybe<DefaultDeterminaInputInput>;
};


/** Mutation root */
export type MutationSalvaDefaultListeArgs = {
  data?: InputMaybe<DefaultListeInputInput>;
};


/** Mutation root */
export type MutationSalvaDeterminaArgs = {
  data?: InputMaybe<DeterminaInputInput>;
  fastMode?: InputMaybe<Scalars['Boolean']>;
};


/** Mutation root */
export type MutationSalvaFasciaDiControlloArgs = {
  data?: InputMaybe<FasciaDiControlloInputInput>;
};


/** Mutation root */
export type MutationSalvaFormAnacArgs = {
  data?: InputMaybe<FormAnacInputInput>;
};


/** Mutation root */
export type MutationSalvaFormGppArgs = {
  data?: InputMaybe<FormGppInputInput>;
};


/** Mutation root */
export type MutationSalvaGppCategoriaArgs = {
  data?: InputMaybe<GppCategoriaInputInput>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSalvaGruppoInvitatoAnacArgs = {
  data?: InputMaybe<GruppoInvitatoAnacInputInput>;
};


/** Mutation root */
export type MutationSalvaImpegnoArgs = {
  data?: InputMaybe<ImpegnoInputInput>;
};


/** Mutation root */
export type MutationSalvaInvitatoAnacArgs = {
  data?: InputMaybe<InvitatoAnacInputInput>;
};


/** Mutation root */
export type MutationSalvaMovimentoArgs = {
  data?: InputMaybe<MovimentoInputInput>;
};


/** Mutation root */
export type MutationSalvaMultiMovimentoSoggettoArgs = {
  data?: InputMaybe<MultiMovimentoSoggettoUpdateInput>;
};


/** Mutation root */
export type MutationSalvaMultiMovimentoSoggettoStorniArgs = {
  data?: InputMaybe<MultiMovimentoSoggettoUpdateInput>;
};


/** Mutation root */
export type MutationSalvaMultiProprietaOffuscataSoggettoArgs = {
  id_determina?: InputMaybe<Scalars['BigInteger']>;
  proprieta?: InputMaybe<Array<InputMaybe<ProprietaOffuscataSectionInputInput>>>;
  proprieta_comuni?: InputMaybe<Array<InputMaybe<ProprietaOffuscataCampo>>>;
};


/** Mutation root */
export type MutationSalvaNotaArgs = {
  data?: InputMaybe<NotaInputInput>;
};


/** Mutation root */
export type MutationSalvaPrenotazioneArgs = {
  data?: InputMaybe<PrenotazioneInputInput>;
};


/** Mutation root */
export type MutationSalvaProprietaOffuscataDeterminaArgs = {
  data?: InputMaybe<ProprietaOffuscataInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSalvaProprietaOffuscataRiferimentiContabiliArgs = {
  data?: InputMaybe<ProprietaOffuscataInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSalvaProprietaOffuscataSoggettoArgs = {
  data?: InputMaybe<ProprietaOffuscataInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSalvaProprietaOffuscateDeterminaArgs = {
  data?: InputMaybe<Array<InputMaybe<ProprietaOffuscataMergeInputInput>>>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSalvaReimputazioneArgs = {
  data?: InputMaybe<ReimputazioneInputInput>;
};


/** Mutation root */
export type MutationSalvaRiferimentiContabiliArgs = {
  data?: InputMaybe<RiferimentiContabiliInputInput>;
};


/** Mutation root */
export type MutationSalvaSoggettoArgs = {
  data?: InputMaybe<SoggettoInputInput>;
};


/** Mutation root */
export type MutationSalvaSubAccertamentoArgs = {
  data?: InputMaybe<SubAccertamentoInputInput>;
};


/** Mutation root */
export type MutationSalvaSubImpegnoArgs = {
  annoCompetenza?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<SubImpegnoInputInput>;
};


/** Mutation root */
export type MutationSalvaUtenteArgs = {
  data?: InputMaybe<UtenteInputInput>;
};


/** Mutation root */
export type MutationToggleDeterminaPreferitaArgs = {
  determina_id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationValida_CapitoloArgs = {
  determina_id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationValida_PrenotazioneArgs = {
  determina_id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationValida_SubImpegnoAccertamentoArgs = {
  determina_id?: InputMaybe<Scalars['BigInteger']>;
};

export type Nota = {
  __typename?: 'Nota';
  attivita?: Maybe<Attivita>;
  /** ISO-8601 */
  dataCreazione?: Maybe<Scalars['DateTime']>;
  dataCreazioneString?: Maybe<Scalars['String']>;
  determina?: Maybe<Determina>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  mittente?: Maybe<Scalars['String']>;
  richiestaRevisione?: Maybe<Scalars['Boolean']>;
  testo?: Maybe<Scalars['String']>;
};

export type NotaInputInput = {
  attivitaId?: InputMaybe<Scalars['BigInteger']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  mittente?: InputMaybe<Scalars['String']>;
  testo?: InputMaybe<Scalars['String']>;
};

export type Office = {
  __typename?: 'Office';
  code?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  service?: Maybe<Scalars['String']>;
};

export type Permit = {
  __typename?: 'Permit';
  /** ISO-8601 */
  delegation_end?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  delegation_start?: Maybe<Scalars['DateTime']>;
  officeName?: Maybe<Scalars['String']>;
  office_id?: Maybe<Scalars['BigInteger']>;
  role?: Maybe<Role>;
  type?: Maybe<PermitType>;
};

export enum PermitType {
  Delegation = 'DELEGATION',
  Persistent = 'PERSISTENT',
  Transient = 'TRANSIENT'
}

export type Prenotazione = {
  __typename?: 'Prenotazione';
  accertamentoData?: Maybe<Accertamento>;
  annoCompetenza?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['Int']>;
  articoloDescr?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Scalars['Int']>;
  capitoloDescr?: Maybe<Scalars['String']>;
  capitoloStorico?: Maybe<Scalars['String']>;
  categoria?: Maybe<Scalars['String']>;
  categoriaDescr?: Maybe<Scalars['String']>;
  cdc?: Maybe<Scalars['String']>;
  cdcDscr?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cdrDescr?: Maybe<Scalars['String']>;
  contoF?: Maybe<Scalars['String']>;
  contoFinanziario?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  disponibilita?: Maybe<Scalars['BigDecimal']>;
  disponibilitaStorni?: Maybe<Scalars['BigDecimal']>;
  id?: Maybe<Scalars['BigInteger']>;
  idPrenotazioneSIB?: Maybe<Scalars['Int']>;
  impIniz?: Maybe<Scalars['BigDecimal']>;
  impVar?: Maybe<Scalars['BigDecimal']>;
  impegnato?: Maybe<Scalars['BigDecimal']>;
  impegnoData?: Maybe<Impegno>;
  importo?: Maybe<Scalars['BigDecimal']>;
  macroAggregato?: Maybe<Scalars['String']>;
  macroaggregatoDescr?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  missione?: Maybe<Scalars['String']>;
  missioneDescr?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  numPrenotazioneSIBAssociata?: Maybe<Scalars['Int']>;
  numeroImpegno?: Maybe<Scalars['Int']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['BigDecimal']>;
  prenotazione?: Maybe<Scalars['Boolean']>;
  prenotazioneData?: Maybe<Prenotazione>;
  programma?: Maybe<Scalars['String']>;
  programmaDescr?: Maybe<Scalars['String']>;
  reimputazioneData?: Maybe<Reimputazione>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  sub?: Maybe<Scalars['Int']>;
  subAccertamentoData?: Maybe<SubAccertamento>;
  subImpegnoData?: Maybe<SubImpegno>;
  tipo?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  tipologiaDescr?: Maybe<Scalars['String']>;
  titolo?: Maybe<Scalars['Int']>;
  titoloDescr?: Maybe<Scalars['String']>;
  validato?: Maybe<Scalars['Boolean']>;
  vincolato?: Maybe<Scalars['Boolean']>;
};

export type PrenotazioneInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export type ProprietaOffuscata = {
  __typename?: 'ProprietaOffuscata';
  campo?: Maybe<ProprietaOffuscataCampo>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  offuscamento?: Maybe<Scalars['String']>;
  offuscata?: Maybe<Scalars['Boolean']>;
};

export enum ProprietaOffuscataCampo {
  Cap = 'cap',
  Cia = 'cia',
  Cig = 'cig',
  Codice = 'codice',
  CodiceFiscale = 'codiceFiscale',
  Comune = 'comune',
  Cup = 'cup',
  Dispositivo = 'dispositivo',
  Indirizzo = 'indirizzo',
  ModLiquidazione = 'modLiquidazione',
  Motivazione = 'motivazione',
  Nominativo = 'nominativo',
  Oggetto = 'oggetto',
  Piva = 'piva',
  Premesso = 'premesso',
  PreseDatto = 'preseDatto',
  VistiDiLegge = 'vistiDiLegge'
}

export type ProprietaOffuscataInputInput = {
  campo?: InputMaybe<ProprietaOffuscataCampo>;
  offuscamento?: InputMaybe<Scalars['String']>;
  offuscata: Scalars['Boolean'];
};

export type ProprietaOffuscataMergeInputInput = {
  campo?: InputMaybe<ProprietaOffuscataCampo>;
  id?: InputMaybe<Scalars['BigInteger']>;
  offuscamento?: InputMaybe<Scalars['String']>;
  offuscata: Scalars['Boolean'];
};

export type ProprietaOffuscataSectionInputInput = {
  campo?: InputMaybe<ProprietaOffuscataCampo>;
  id?: InputMaybe<Scalars['BigInteger']>;
};

/** Query root */
export type Query = {
  __typename?: 'Query';
  accertamenti?: Maybe<Array<Maybe<Accertamento>>>;
  accertamenti_paginato: Scalars['Int'];
  accertamento?: Maybe<Accertamento>;
  attivita?: Maybe<Array<Maybe<Attivita>>>;
  attivita_paginato: Scalars['Int'];
  attivita_pendenti?: Maybe<Array<Maybe<SidProcessGraphqlDto>>>;
  attivita_pendenti_new?: Maybe<Array<Maybe<SidProcessGraphqlDto>>>;
  attivita_pendenti_paginato: Scalars['Float'];
  attivita_pendenti_paginato_new: Scalars['Float'];
  calcolo_disponibilita_teorica?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Array<Maybe<RecordCapitolo>>>;
  capitolo_pages: Scalars['Float'];
  check_capitolo?: Maybe<CheckDisponibilitaDto>;
  check_prenotazione?: Maybe<CheckDisponibilitaDto>;
  check_subaccertamento?: Maybe<CheckDisponibilitaDto>;
  check_subimpegno?: Maybe<CheckDisponibilitaDto>;
  defaultDetermina?: Maybe<DefaultDetermina>;
  defaultDetermine?: Maybe<Array<Maybe<DefaultDetermina>>>;
  defaultDetermine_paginato: Scalars['Int'];
  defaultLista?: Maybe<DefaultListe>;
  defaultListe?: Maybe<Array<Maybe<DefaultListe>>>;
  defaultListe_paginato: Scalars['Int'];
  determina?: Maybe<Determina>;
  determina_form_anac_by_cig_determinaId?: Maybe<DeterminaFormAnac>;
  determine?: Maybe<Array<Maybe<Determina>>>;
  determine_avanzato?: Maybe<Array<Maybe<Determina>>>;
  determine_avanzato_paginato: Scalars['Int'];
  determine_form_gpp_by_determina_id?: Maybe<DeterminaFormGpp>;
  determine_paginato: Scalars['Int'];
  documenti?: Maybe<Array<Maybe<Documento>>>;
  documenti_paginato: Scalars['Int'];
  documento?: Maybe<Documento>;
  fascia_di_controllo?: Maybe<FasciaDiControllo>;
  fascia_di_controllo_lista?: Maybe<Array<Maybe<FasciaDiControllo>>>;
  fascia_di_controllo_lista_paginato: Scalars['Int'];
  fascia_di_controllo_per_tipo_determina?: Maybe<FasciaDiControllo>;
  form_anac?: Maybe<FormAnac>;
  form_anac_by_cig_determinaId?: Maybe<FormAnac>;
  form_gpp?: Maybe<FormGpp>;
  impegni?: Maybe<Array<Maybe<Impegno>>>;
  impegni_paginato: Scalars['Int'];
  impegno?: Maybe<Impegno>;
  impegno_accertamento?: Maybe<Array<Maybe<RecordImpAccert>>>;
  impegno_accertamento_pages: Scalars['Float'];
  lista_determine_form_anac?: Maybe<Array<Maybe<DeterminaFormAnac>>>;
  lista_determine_form_anac_paginato: Scalars['Int'];
  lista_determine_form_gpp?: Maybe<Array<Maybe<DeterminaFormGpp>>>;
  lista_determine_form_gpp_paginato: Scalars['Int'];
  lista_form_anac?: Maybe<Array<Maybe<FormAnac>>>;
  lista_form_anac_paginato: Scalars['Int'];
  movimenti?: Maybe<Array<Maybe<Movimento>>>;
  movimenti_paginato: Scalars['Int'];
  movimento?: Maybe<Movimento>;
  nota?: Maybe<Nota>;
  note?: Maybe<Array<Maybe<Nota>>>;
  note_paginato: Scalars['Int'];
  prenotazione?: Maybe<Prenotazione>;
  prenotazione_pages: Scalars['Float'];
  prenotazione_sib?: Maybe<Array<Maybe<RecordPrenotImpegno>>>;
  prenotazioni?: Maybe<Array<Maybe<Prenotazione>>>;
  prenotazioni_paginato: Scalars['Int'];
  proprietaOffuscata?: Maybe<ProprietaOffuscata>;
  proprietaOffuscate?: Maybe<Array<Maybe<ProprietaOffuscata>>>;
  proprietaOffuscate_paginato: Scalars['Int'];
  pubblica_determina: Scalars['Boolean'];
  reimputazione?: Maybe<Reimputazione>;
  reimputazioni?: Maybe<Array<Maybe<Reimputazione>>>;
  reimputazioni_paginato: Scalars['Int'];
  riferimentiContabili?: Maybe<Array<Maybe<RiferimentiContabili>>>;
  riferimentiContabili_paginato: Scalars['Int'];
  riferimentoContabile?: Maybe<RiferimentiContabili>;
  singola_attivita?: Maybe<Attivita>;
  singola_attivita_uuid?: Maybe<Attivita>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  soggetti_paginato: Scalars['Int'];
  soggetti_per_determina?: Maybe<Array<Maybe<Soggetto>>>;
  soggetto?: Maybe<Soggetto>;
  soggetto_sib?: Maybe<Array<Maybe<RecordSoggetto>>>;
  soggetto_sib_pages: Scalars['Float'];
  sso_data?: Maybe<DatiUtenteDto>;
  subAccertamenti?: Maybe<Array<Maybe<SubAccertamento>>>;
  subAccertamenti_paginato: Scalars['Int'];
  subAccertamento?: Maybe<SubAccertamento>;
  subImpegni?: Maybe<Array<Maybe<SubImpegno>>>;
  subImpegni_paginato: Scalars['Int'];
  subImpegno?: Maybe<SubImpegno>;
  testAnacXml?: Maybe<Scalars['String']>;
  tipo_determina?: Maybe<Array<Maybe<TipoDetermina>>>;
  utente?: Maybe<Utente>;
  utenti?: Maybe<Array<Maybe<Utente>>>;
  utenti_paginato: Scalars['Int'];
};


/** Query root */
export type QueryAccertamentiArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryAccertamenti_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryAccertamentoArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryAttivitaArgs = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  filtro?: InputMaybe<FiltroAttivita>;
  page?: InputMaybe<Scalars['Int']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
  utente?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryAttivita_PaginatoArgs = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  filtro?: InputMaybe<FiltroAttivita>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
  utente?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryAttivita_PendentiArgs = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
};


/** Query root */
export type QueryAttivita_Pendenti_NewArgs = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
};


/** Query root */
export type QueryAttivita_Pendenti_PaginatoArgs = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
};


/** Query root */
export type QueryAttivita_Pendenti_Paginato_NewArgs = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
};


/** Query root */
export type QueryCalcolo_Disponibilita_TeoricaArgs = {
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
};


/** Query root */
export type QueryCapitoloArgs = {
  annoBilancio?: InputMaybe<Scalars['String']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  capitoloVecchio?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  sorted?: InputMaybe<Scalars['Boolean']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
  vincolo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryCapitolo_PagesArgs = {
  annoBilancio?: InputMaybe<Scalars['String']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  capitoloVecchio?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
  vincolo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryCheck_CapitoloArgs = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  entrata?: InputMaybe<Scalars['Boolean']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  titolo?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryCheck_PrenotazioneArgs = {
  annoCompetenza?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  numPrenotazione?: InputMaybe<Scalars['Int']>;
  variazioni?: InputMaybe<Scalars['BigDecimal']>;
};


/** Query root */
export type QueryCheck_SubaccertamentoArgs = {
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  numAccertamento?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryCheck_SubimpegnoArgs = {
  annoCompetenza?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  numImpegno?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryDefaultDeterminaArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryDefaultDetermineArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  tipoDetermina?: InputMaybe<TipoDetermina>;
};


/** Query root */
export type QueryDefaultDetermine_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  tipoDetermina?: InputMaybe<TipoDetermina>;
};


/** Query root */
export type QueryDefaultListaArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryDefaultListeArgs = {
  cdr?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  tipoLista?: InputMaybe<TipoLista>;
};


/** Query root */
export type QueryDefaultListe_PaginatoArgs = {
  cdr?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  tipoLista?: InputMaybe<TipoLista>;
};


/** Query root */
export type QueryDeterminaArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryDetermina_Form_Anac_By_Cig_DeterminaIdArgs = {
  cig?: InputMaybe<Scalars['String']>;
  determinaId: Scalars['BigInteger'];
};


/** Query root */
export type QueryDetermineArgs = {
  annoProposta?: InputMaybe<Scalars['Int']>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  preferite?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
};


/** Query root */
export type QueryDetermine_AvanzatoArgs = {
  annoDetermina?: InputMaybe<Scalars['Int']>;
  annoProposta?: InputMaybe<Scalars['Int']>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cia?: InputMaybe<Scalars['String']>;
  cig?: InputMaybe<Scalars['String']>;
  creatoreDetermina?: InputMaybe<Scalars['String']>;
  cup?: InputMaybe<Scalars['String']>;
  data_creazione_a?: InputMaybe<Scalars['String']>;
  data_creazione_da?: InputMaybe<Scalars['String']>;
  data_esecutiva_a?: InputMaybe<Scalars['String']>;
  data_esecutiva_da?: InputMaybe<Scalars['String']>;
  dipositivo?: InputMaybe<Scalars['String']>;
  idDetermina?: InputMaybe<Scalars['Int']>;
  numProposta?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  preferite?: InputMaybe<Scalars['Boolean']>;
  protocollo?: InputMaybe<Scalars['String']>;
  responsabileProcedimento?: InputMaybe<Scalars['String']>;
  ruDetermina?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  statoDetermina?: InputMaybe<StatoDetermina>;
  tipoDetermina?: InputMaybe<TipoDetermina>;
  tipoFinanziamento?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryDetermine_Avanzato_PaginatoArgs = {
  annoDetermina?: InputMaybe<Scalars['Int']>;
  annoProposta?: InputMaybe<Scalars['Int']>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cia?: InputMaybe<Scalars['String']>;
  cig?: InputMaybe<Scalars['String']>;
  creatoreDetermina?: InputMaybe<Scalars['String']>;
  cup?: InputMaybe<Scalars['String']>;
  data_creazione_a?: InputMaybe<Scalars['String']>;
  data_creazione_da?: InputMaybe<Scalars['String']>;
  data_esecutiva_a?: InputMaybe<Scalars['String']>;
  data_esecutiva_da?: InputMaybe<Scalars['String']>;
  dipositivo?: InputMaybe<Scalars['String']>;
  idDetermina?: InputMaybe<Scalars['Int']>;
  numProposta?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  preferite?: InputMaybe<Scalars['Boolean']>;
  protocollo?: InputMaybe<Scalars['String']>;
  responsabileProcedimento?: InputMaybe<Scalars['String']>;
  ruDetermina?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  statoDetermina?: InputMaybe<StatoDetermina>;
  tipoDetermina?: InputMaybe<TipoDetermina>;
  tipoFinanziamento?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryDetermine_Form_Gpp_By_Determina_IdArgs = {
  determinaId?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryDetermine_PaginatoArgs = {
  annoProposta?: InputMaybe<Scalars['Int']>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  preferite?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>>>;
};


/** Query root */
export type QueryDocumentiArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryDocumenti_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryDocumentoArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryFascia_Di_ControlloArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryFascia_Di_Controllo_ListaArgs = {
  filter?: InputMaybe<FasciaDiControlloFilter>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryFascia_Di_Controllo_Lista_PaginatoArgs = {
  filter?: InputMaybe<FasciaDiControlloFilter>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryFascia_Di_Controllo_Per_Tipo_DeterminaArgs = {
  tipo?: InputMaybe<TipoDetermina>;
};


/** Query root */
export type QueryForm_AnacArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryForm_Anac_By_Cig_DeterminaIdArgs = {
  cig?: InputMaybe<Scalars['String']>;
  determinaId: Scalars['BigInteger'];
};


/** Query root */
export type QueryForm_GppArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryImpegniArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryImpegni_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryImpegnoArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryImpegno_AccertamentoArgs = {
  annoBilancio?: InputMaybe<Scalars['String']>;
  annoImpegno?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  numImpegno?: InputMaybe<Scalars['String']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  sorted?: InputMaybe<Scalars['Boolean']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryImpegno_Accertamento_PagesArgs = {
  annoBilancio?: InputMaybe<Scalars['String']>;
  annoImpegno?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  numImpegno?: InputMaybe<Scalars['String']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryLista_Determine_Form_AnacArgs = {
  anacStateFiler?: InputMaybe<StateFiler>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryLista_Determine_Form_Anac_PaginatoArgs = {
  anacStateFiler?: InputMaybe<StateFiler>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryLista_Determine_Form_GppArgs = {
  a?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  da?: InputMaybe<Scalars['String']>;
  gppStateFiler?: InputMaybe<StateFiler>;
  macro_categoria?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryLista_Determine_Form_Gpp_PaginatoArgs = {
  a?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  da?: InputMaybe<Scalars['String']>;
  gppStateFiler?: InputMaybe<StateFiler>;
  macro_categoria?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryLista_Form_AnacArgs = {
  cig?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryLista_Form_Anac_PaginatoArgs = {
  cig?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryMovimentiArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryMovimenti_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryMovimentoArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryNotaArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryNoteArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryNote_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryPrenotazioneArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryPrenotazione_PagesArgs = {
  annoBilancio?: InputMaybe<Scalars['String']>;
  annoPrenotazione?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  numeroPrenotazione?: InputMaybe<Scalars['String']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryPrenotazione_SibArgs = {
  annoBilancio?: InputMaybe<Scalars['String']>;
  annoPrenotazione?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  numeroPrenotazione?: InputMaybe<Scalars['String']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  sorted?: InputMaybe<Scalars['Boolean']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryPrenotazioniArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryPrenotazioni_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryProprietaOffuscataArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryProprietaOffuscateArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryProprietaOffuscate_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryPubblica_DeterminaArgs = {
  determinaId?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryReimputazioneArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryReimputazioniArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryReimputazioni_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryRiferimentiContabiliArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryRiferimentiContabili_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QueryRiferimentoContabileArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QuerySingola_AttivitaArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QuerySingola_Attivita_UuidArgs = {
  determinaId: Scalars['BigInteger'];
  uuid?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QuerySoggettiArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QuerySoggetti_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QuerySoggetti_Per_DeterminaArgs = {
  determinaId?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QuerySoggettoArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QuerySoggetto_SibArgs = {
  codice?: InputMaybe<Scalars['String']>;
  codiceFiscale?: InputMaybe<Scalars['String']>;
  nominativo?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  partitaIVA?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QuerySoggetto_Sib_PagesArgs = {
  codice?: InputMaybe<Scalars['String']>;
  codiceFiscale?: InputMaybe<Scalars['String']>;
  nominativo?: InputMaybe<Scalars['String']>;
  partitaIVA?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QuerySubAccertamentiArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QuerySubAccertamenti_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QuerySubAccertamentoArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QuerySubImpegniArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QuerySubImpegni_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


/** Query root */
export type QuerySubImpegnoArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryTestAnacXmlArgs = {
  anno: Scalars['Int'];
};


/** Query root */
export type QueryTipo_DeterminaArgs = {
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryUtenteArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryUtentiArgs = {
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};


/** Query root */
export type QueryUtenti_PaginatoArgs = {
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};

export type RecordCapitolo = {
  __typename?: 'RecordCapitolo';
  accertato?: Maybe<Scalars['String']>;
  annoRiferimento?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['String']>;
  articoloNew?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['String']>;
  capart?: Maybe<Scalars['String']>;
  capartNew?: Maybe<Scalars['String']>;
  capitolo?: Maybe<Scalars['String']>;
  cdcVero?: Maybe<Scalars['String']>;
  cdg?: Maybe<Scalars['String']>;
  cdgNew?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrNew?: Maybe<Scalars['String']>;
  cdrVero?: Maybe<Scalars['String']>;
  codAnnoBil?: Maybe<Scalars['String']>;
  codCapitolo?: Maybe<Scalars['String']>;
  codCapitoloNew?: Maybe<Scalars['String']>;
  codCateg?: Maybe<Scalars['String']>;
  codCorrelazione?: Maybe<Scalars['String']>;
  codiceCdr?: Maybe<Scalars['String']>;
  conto?: Maybe<Scalars['String']>;
  corrBreve?: Maybe<Scalars['String']>;
  correlazione?: Maybe<Scalars['String']>;
  desCateg?: Maybe<Scalars['String']>;
  desFunzione?: Maybe<Scalars['String']>;
  desRisorsa?: Maybe<Scalars['String']>;
  desServizio?: Maybe<Scalars['String']>;
  desTitolo?: Maybe<Scalars['String']>;
  descCdc?: Maybe<Scalars['String']>;
  descCdr?: Maybe<Scalars['String']>;
  descSiope?: Maybe<Scalars['String']>;
  descrizioneArticolo?: Maybe<Scalars['String']>;
  eS?: Maybe<Scalars['String']>;
  flgAnnullato?: Maybe<Scalars['String']>;
  funz?: Maybe<Scalars['String']>;
  impegnato?: Maybe<Scalars['String']>;
  inT?: Maybe<Scalars['String']>;
  incassato?: Maybe<Scalars['String']>;
  iniziale?: Maybe<Scalars['String']>;
  interventoCompleto?: Maybe<Scalars['String']>;
  liquidato?: Maybe<Scalars['String']>;
  ncateg?: Maybe<Scalars['String']>;
  ncontof?: Maybe<Scalars['String']>;
  ncontofinanziario?: Maybe<Scalars['String']>;
  ndesccateg?: Maybe<Scalars['String']>;
  ndesctipmac?: Maybe<Scalars['String']>;
  ndesctit?: Maybe<Scalars['String']>;
  nmis?: Maybe<Scalars['String']>;
  nmissione?: Maybe<Scalars['String']>;
  nprog?: Maybe<Scalars['String']>;
  nprogramma?: Maybe<Scalars['String']>;
  ntipmac?: Maybe<Scalars['String']>;
  ntit?: Maybe<Scalars['String']>;
  num?: Maybe<Scalars['String']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  oid?: Maybe<Scalars['String']>;
  oidLivello?: Maybe<Scalars['String']>;
  pagato?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['String']>;
  progetto?: Maybe<Scalars['String']>;
  residuo?: Maybe<Scalars['String']>;
  ris?: Maybe<Scalars['String']>;
  serv?: Maybe<Scalars['String']>;
  siope?: Maybe<Scalars['String']>;
  sub?: Maybe<Scalars['String']>;
  tipoVincolo?: Maybe<Scalars['String']>;
  tit?: Maybe<Scalars['String']>;
  variazione?: Maybe<Scalars['String']>;
  vincolato?: Maybe<Scalars['String']>;
  voce?: Maybe<Scalars['String']>;
};

export type RecordImpAccert = {
  __typename?: 'RecordImpAccert';
  aaBil?: Maybe<Scalars['String']>;
  anno?: Maybe<Scalars['String']>;
  annoCrono?: Maybe<Scalars['String']>;
  annoRes?: Maybe<Scalars['String']>;
  annoRiferimento?: Maybe<Scalars['String']>;
  art?: Maybe<Scalars['String']>;
  artNew?: Maybe<Scalars['String']>;
  cap?: Maybe<Scalars['String']>;
  capNew?: Maybe<Scalars['String']>;
  capart?: Maybe<Scalars['String']>;
  capartNew?: Maybe<Scalars['String']>;
  cat?: Maybe<Scalars['String']>;
  cdg?: Maybe<Scalars['String']>;
  cdgNew?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrNew?: Maybe<Scalars['String']>;
  cdrVero?: Maybe<Scalars['String']>;
  cdrVeroNew?: Maybe<Scalars['String']>;
  cntNumeroAtto?: Maybe<Scalars['String']>;
  codAnnoAtto?: Maybe<Scalars['String']>;
  codAnnoBil?: Maybe<Scalars['String']>;
  codCig?: Maybe<Scalars['String']>;
  codComune?: Maybe<Scalars['String']>;
  codForn?: Maybe<Scalars['String']>;
  codIcecca?: Maybe<Scalars['String']>;
  codRdp?: Maybe<Scalars['String']>;
  codRdpNew?: Maybe<Scalars['String']>;
  codRdpOld?: Maybe<Scalars['String']>;
  codRdpOldNew?: Maybe<Scalars['String']>;
  codRuolo?: Maybe<Scalars['String']>;
  codTipoAtto?: Maybe<Scalars['String']>;
  conto?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  desCateg?: Maybe<Scalars['String']>;
  desFunzione?: Maybe<Scalars['String']>;
  desRisorsa?: Maybe<Scalars['String']>;
  desServizio?: Maybe<Scalars['String']>;
  desTitolo?: Maybe<Scalars['String']>;
  descCdc?: Maybe<Scalars['String']>;
  descCdr?: Maybe<Scalars['String']>;
  descSiope?: Maybe<Scalars['String']>;
  descr?: Maybe<Scalars['String']>;
  emittente?: Maybe<Scalars['String']>;
  es?: Maybe<Scalars['String']>;
  flgEsecutivo?: Maybe<Scalars['String']>;
  fornitore?: Maybe<Scalars['String']>;
  fun?: Maybe<Scalars['String']>;
  impAss?: Maybe<Scalars['String']>;
  impIni?: Maybe<Scalars['String']>;
  impLiq?: Maybe<Scalars['String']>;
  impPag?: Maybe<Scalars['String']>;
  impVar?: Maybe<Scalars['String']>;
  inT?: Maybe<Scalars['String']>;
  mac?: Maybe<Scalars['String']>;
  mis?: Maybe<Scalars['String']>;
  nContof?: Maybe<Scalars['String']>;
  nContofinanziario?: Maybe<Scalars['String']>;
  nDesccateg?: Maybe<Scalars['String']>;
  nDesctipmac?: Maybe<Scalars['String']>;
  nDesctit?: Maybe<Scalars['String']>;
  nMissione?: Maybe<Scalars['String']>;
  nProgramma?: Maybe<Scalars['String']>;
  ncateg?: Maybe<Scalars['String']>;
  nmis?: Maybe<Scalars['String']>;
  nprog?: Maybe<Scalars['String']>;
  ntipmac?: Maybe<Scalars['String']>;
  ntit?: Maybe<Scalars['String']>;
  num?: Maybe<Scalars['String']>;
  numOld?: Maybe<Scalars['String']>;
  numRes?: Maybe<Scalars['String']>;
  numeroCrono?: Maybe<Scalars['String']>;
  oggetto?: Maybe<Scalars['String']>;
  oid?: Maybe<Scalars['String']>;
  prog?: Maybe<Scalars['String']>;
  progetto?: Maybe<Scalars['String']>;
  ris?: Maybe<Scalars['String']>;
  ser?: Maybe<Scalars['String']>;
  siope?: Maybe<Scalars['String']>;
  statoImp?: Maybe<Scalars['String']>;
  sub?: Maybe<Scalars['String']>;
  subOld?: Maybe<Scalars['String']>;
  subRes?: Maybe<Scalars['String']>;
  tipo?: Maybe<Scalars['String']>;
  tipoRes?: Maybe<Scalars['String']>;
  tit?: Maybe<Scalars['String']>;
  voce?: Maybe<Scalars['String']>;
};

export type RecordPrenotImpegno = {
  __typename?: 'RecordPrenotImpegno';
  amnImpaccSubEuro?: Maybe<Scalars['String']>;
  anno?: Maybe<Scalars['String']>;
  annoRiferimento?: Maybe<Scalars['String']>;
  art?: Maybe<Scalars['String']>;
  artNew?: Maybe<Scalars['String']>;
  cap?: Maybe<Scalars['String']>;
  capNew?: Maybe<Scalars['String']>;
  capart?: Maybe<Scalars['String']>;
  capartNew?: Maybe<Scalars['String']>;
  cat?: Maybe<Scalars['String']>;
  cdg?: Maybe<Scalars['String']>;
  cdgNew?: Maybe<Scalars['String']>;
  cdgVero?: Maybe<Scalars['String']>;
  cdgVeroNew?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrNew?: Maybe<Scalars['String']>;
  cdrVero?: Maybe<Scalars['String']>;
  cdrVeroNew?: Maybe<Scalars['String']>;
  cntNumeroAtto?: Maybe<Scalars['String']>;
  codAnnoAtto?: Maybe<Scalars['String']>;
  codAnnoBil?: Maybe<Scalars['String']>;
  codForn?: Maybe<Scalars['String']>;
  codRdp?: Maybe<Scalars['String']>;
  codRdpOld?: Maybe<Scalars['String']>;
  codRuolo?: Maybe<Scalars['String']>;
  codTipoAtto?: Maybe<Scalars['String']>;
  codUnitaOrg?: Maybe<Scalars['String']>;
  conto?: Maybe<Scalars['String']>;
  desCateg?: Maybe<Scalars['String']>;
  desFunzione?: Maybe<Scalars['String']>;
  desRisorsa?: Maybe<Scalars['String']>;
  desServizio?: Maybe<Scalars['String']>;
  desTitolo?: Maybe<Scalars['String']>;
  descCdc?: Maybe<Scalars['String']>;
  descCdr?: Maybe<Scalars['String']>;
  descSiope?: Maybe<Scalars['String']>;
  descr?: Maybe<Scalars['String']>;
  es?: Maybe<Scalars['String']>;
  flgRelationType?: Maybe<Scalars['String']>;
  fornitore?: Maybe<Scalars['String']>;
  fun?: Maybe<Scalars['String']>;
  funOld?: Maybe<Scalars['String']>;
  impAss?: Maybe<Scalars['String']>;
  impIniz?: Maybe<Scalars['String']>;
  impVar?: Maybe<Scalars['String']>;
  inT?: Maybe<Scalars['String']>;
  nCateg?: Maybe<Scalars['String']>;
  nContof?: Maybe<Scalars['String']>;
  nContofinanziario?: Maybe<Scalars['String']>;
  nDesccateg?: Maybe<Scalars['String']>;
  nDesctipmac?: Maybe<Scalars['String']>;
  nDesctit?: Maybe<Scalars['String']>;
  nMis?: Maybe<Scalars['String']>;
  nMissione?: Maybe<Scalars['String']>;
  nProg?: Maybe<Scalars['String']>;
  nProgramma?: Maybe<Scalars['String']>;
  nTipmac?: Maybe<Scalars['String']>;
  nTit?: Maybe<Scalars['String']>;
  num?: Maybe<Scalars['String']>;
  oggetto?: Maybe<Scalars['String']>;
  oid?: Maybe<Scalars['String']>;
  ris?: Maybe<Scalars['String']>;
  ser?: Maybe<Scalars['String']>;
  serOld?: Maybe<Scalars['String']>;
  siope?: Maybe<Scalars['String']>;
  sub?: Maybe<Scalars['String']>;
  tipo?: Maybe<Scalars['String']>;
  tit?: Maybe<Scalars['String']>;
  voce?: Maybe<Scalars['String']>;
};

export type RecordSoggetto = {
  __typename?: 'RecordSoggetto';
  cap?: Maybe<Scalars['String']>;
  capOld?: Maybe<Scalars['String']>;
  cin?: Maybe<Scalars['String']>;
  codBanca?: Maybe<Scalars['String']>;
  codCity?: Maybe<Scalars['String']>;
  codStatoSogg?: Maybe<Scalars['String']>;
  codSubject?: Maybe<Scalars['String']>;
  codUser?: Maybe<Scalars['String']>;
  codicebancario?: Maybe<Scalars['String']>;
  codicefiscale?: Maybe<Scalars['String']>;
  comune?: Maybe<Scalars['String']>;
  defCodBank?: Maybe<Scalars['String']>;
  desQuietanza?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  flgLogicaldel?: Maybe<Scalars['String']>;
  flgRelationType?: Maybe<Scalars['String']>;
  iban?: Maybe<Scalars['String']>;
  indirizzo?: Maybe<Scalars['String']>;
  nazione?: Maybe<Scalars['String']>;
  nominativo?: Maybe<Scalars['String']>;
  numerocivico?: Maybe<Scalars['String']>;
  partitaiva?: Maybe<Scalars['String']>;
  provincia?: Maybe<Scalars['String']>;
  ruolo?: Maybe<Scalars['String']>;
  telefono?: Maybe<Scalars['String']>;
};

export enum RecordState {
  Cr = 'CR',
  In = 'IN',
  Out = 'OUT'
}

export enum RecordType {
  DeleteOffice = 'DELETE_OFFICE',
  InvalidatePermit = 'INVALIDATE_PERMIT',
  Office = 'OFFICE',
  Perm = 'PERM',
  UpdateRow = 'UPDATE_ROW'
}

export type Reimputazione = {
  __typename?: 'Reimputazione';
  accertamentoData?: Maybe<Accertamento>;
  annoCompetenza?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['Int']>;
  articoloDescr?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Scalars['Int']>;
  capitoloDescr?: Maybe<Scalars['String']>;
  capitoloStorico?: Maybe<Scalars['String']>;
  categoria?: Maybe<Scalars['String']>;
  categoriaDescr?: Maybe<Scalars['String']>;
  cdc?: Maybe<Scalars['String']>;
  cdcDscr?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cdrDescr?: Maybe<Scalars['String']>;
  contoF?: Maybe<Scalars['String']>;
  contoFinanziario?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  disponibilita?: Maybe<Scalars['BigDecimal']>;
  disponibilitaStorni?: Maybe<Scalars['BigDecimal']>;
  id?: Maybe<Scalars['BigInteger']>;
  impegnoData?: Maybe<Impegno>;
  importo?: Maybe<Scalars['BigDecimal']>;
  liquidato?: Maybe<Scalars['BigDecimal']>;
  macroAggregato?: Maybe<Scalars['String']>;
  macroaggregatoDescr?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  missione?: Maybe<Scalars['String']>;
  missioneDescr?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  numeroImpegno?: Maybe<Scalars['Int']>;
  numeroNuovoImpegno?: Maybe<Scalars['Int']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['BigDecimal']>;
  prenotazioneData?: Maybe<Prenotazione>;
  programma?: Maybe<Scalars['String']>;
  programmaDescr?: Maybe<Scalars['String']>;
  reimputazioneData?: Maybe<Reimputazione>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  sub?: Maybe<Scalars['Int']>;
  subAccertamentoData?: Maybe<SubAccertamento>;
  subImpegnoData?: Maybe<SubImpegno>;
  tipo?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  tipologiaDescr?: Maybe<Scalars['String']>;
  titolo?: Maybe<Scalars['Int']>;
  titoloDescr?: Maybe<Scalars['String']>;
  validato?: Maybe<Scalars['Boolean']>;
  vincolato?: Maybe<Scalars['Boolean']>;
};

export type ReimputazioneInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export type RiferimentiContabili = {
  __typename?: 'RiferimentiContabili';
  capitoli?: Maybe<Array<Maybe<Movimento>>>;
  cca?: Maybe<Scalars['String']>;
  cia?: Maybe<Scalars['String']>;
  determina?: Maybe<Determina>;
  id?: Maybe<Scalars['BigInteger']>;
  impegniAccertamenti?: Maybe<Array<Maybe<Movimento>>>;
  metaType?: Maybe<Scalars['String']>;
  movimenti?: Maybe<Array<Maybe<Movimento>>>;
  prenotazioni?: Maybe<Array<Maybe<Movimento>>>;
  proprietaOffuscate?: Maybe<Array<Maybe<ProprietaOffuscata>>>;
  tipoFinanziamento?: Maybe<Scalars['String']>;
  totImporto?: Maybe<Scalars['Float']>;
  /** ISO-8601 */
  ultimaValidazione?: Maybe<Scalars['DateTime']>;
  ultimaValidazioneString?: Maybe<Scalars['String']>;
  valido?: Maybe<Scalars['Boolean']>;
};

export type RiferimentiContabiliInputInput = {
  cca?: InputMaybe<Scalars['String']>;
  cia?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  tipoFinanziamento?: InputMaybe<Scalars['String']>;
  ultimaValidazione?: InputMaybe<Scalars['String']>;
};

export type Role = {
  __typename?: 'Role';
  full_name?: Maybe<Scalars['String']>;
  hierarchy_level: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type SidProcessGraphqlDto = {
  __typename?: 'SidProcessGraphqlDTO';
  bpmnProcessTaskId?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataCreazioneDetermina?: Maybe<Scalars['DateTime']>;
  determina?: Maybe<Determina>;
  name?: Maybe<Scalars['String']>;
  potentialGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  processId?: Maybe<Scalars['String']>;
  processInstanceId?: Maybe<Scalars['String']>;
  referenceName?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  statoAttivita?: Maybe<Scalars['String']>;
  tipoAttivita?: Maybe<TipoAttivita>;
};

export type Soggetto = {
  __typename?: 'Soggetto';
  cap?: Maybe<Scalars['String']>;
  cig?: Maybe<Scalars['String']>;
  codObiettivo?: Maybe<Scalars['String']>;
  codice?: Maybe<Scalars['String']>;
  codiceFiscale?: Maybe<Scalars['String']>;
  comune?: Maybe<Scalars['String']>;
  cup?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  importo?: Maybe<Scalars['BigDecimal']>;
  importoAggiudicazione?: Maybe<Scalars['BigDecimal']>;
  importoSommeLiquidate?: Maybe<Scalars['BigDecimal']>;
  indirizzo?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  motivoEsclusioneCig?: Maybe<Scalars['String']>;
  movimento?: Maybe<Movimento>;
  movimento_id?: Maybe<Scalars['BigInteger']>;
  nominativo?: Maybe<Scalars['String']>;
  numAccertamentoSib?: Maybe<Scalars['Int']>;
  numImpegnoSib?: Maybe<Scalars['Int']>;
  numPrenotazioneSib?: Maybe<Scalars['Int']>;
  numReimputazioneSib?: Maybe<Scalars['Int']>;
  numSubAccertamentoSib?: Maybe<Scalars['Int']>;
  numSubImpegnoSib?: Maybe<Scalars['Int']>;
  origin?: Maybe<Scalars['String']>;
  piva?: Maybe<Scalars['String']>;
  proprietaOffuscate?: Maybe<Array<Maybe<ProprietaOffuscata>>>;
};

export type SoggettoInputInput = {
  cap?: InputMaybe<Scalars['String']>;
  cig?: InputMaybe<Scalars['String']>;
  codObiettivo?: InputMaybe<Scalars['String']>;
  codice?: InputMaybe<Scalars['String']>;
  codiceFiscale?: InputMaybe<Scalars['String']>;
  comune?: InputMaybe<Scalars['String']>;
  cup?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['BigInteger']>;
  importo?: InputMaybe<Scalars['String']>;
  indirizzo?: InputMaybe<Scalars['String']>;
  motivoEsclusioneCig?: InputMaybe<Scalars['String']>;
  movimentoId?: InputMaybe<Scalars['BigInteger']>;
  nominativo?: InputMaybe<Scalars['String']>;
  piva?: InputMaybe<Scalars['String']>;
};

export type SortInputInput = {
  by?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
};

export enum StateFiler {
  Bozza = 'BOZZA',
  Completato = 'COMPLETATO',
  DaCompletare = 'DA_COMPLETARE'
}

export enum StatoAttivita {
  Annullata = 'annullata',
  Completata = 'completata',
  DaPrendereInCarico = 'daPrendereInCarico',
  PresaInCarico = 'presaInCarico'
}

export enum StatoDetermina {
  AllaFirmaDelRagioniereGenerale = 'AllaFirmaDelRagioniereGenerale',
  AllaFirmaDirigenteProponente = 'AllaFirmaDirigenteProponente',
  AllaFirmaDirigenteSpesaEntrata = 'AllaFirmaDirigenteSpesaEntrata',
  Annullata = 'Annullata',
  ApprovazioniOrizzontaliDiRagioneria = 'ApprovazioniOrizzontaliDiRagioneria',
  Esecutiva = 'Esecutiva',
  FirmataDalDirigenteProponente = 'FirmataDalDirigenteProponente',
  FirmataDalDirigenteSpesaEntrata = 'FirmataDalDirigenteSpesaEntrata',
  InLavorazioneUfficioRagioneria = 'InLavorazioneUfficioRagioneria',
  InVisioneDirettoreDipartimento = 'InVisioneDirettoreDipartimento',
  InVisioneDirigente = 'InVisioneDirigente',
  InVisioneResponsabileProcedimento = 'InVisioneResponsabileProcedimento',
  OscuramentoDati = 'OscuramentoDati',
  ServizioProponente = 'ServizioProponente',
  UfficioRagioneria = 'UfficioRagioneria'
}

export type SubAccertamento = {
  __typename?: 'SubAccertamento';
  accertamentoData?: Maybe<Accertamento>;
  annoCompetenza?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['Int']>;
  articoloDescr?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Scalars['Int']>;
  capitoloDescr?: Maybe<Scalars['String']>;
  capitoloStorico?: Maybe<Scalars['String']>;
  categoria?: Maybe<Scalars['String']>;
  categoriaDescr?: Maybe<Scalars['String']>;
  cdc?: Maybe<Scalars['String']>;
  cdcDscr?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cdrDescr?: Maybe<Scalars['String']>;
  contoF?: Maybe<Scalars['String']>;
  contoFinanziario?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  disponibilita?: Maybe<Scalars['BigDecimal']>;
  disponibilitaStorni?: Maybe<Scalars['BigDecimal']>;
  id?: Maybe<Scalars['BigInteger']>;
  impegnoData?: Maybe<Impegno>;
  importo?: Maybe<Scalars['BigDecimal']>;
  liquidato?: Maybe<Scalars['BigDecimal']>;
  macroAggregato?: Maybe<Scalars['String']>;
  macroaggregatoDescr?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  missione?: Maybe<Scalars['String']>;
  missioneDescr?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  numAccertamento?: Maybe<Scalars['Int']>;
  numSubAccertamento?: Maybe<Scalars['Int']>;
  numeroImpegno?: Maybe<Scalars['Int']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['BigDecimal']>;
  prenotazioneData?: Maybe<Prenotazione>;
  programma?: Maybe<Scalars['String']>;
  programmaDescr?: Maybe<Scalars['String']>;
  reimputazioneData?: Maybe<Reimputazione>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  sub?: Maybe<Scalars['Int']>;
  subAccertamentoData?: Maybe<SubAccertamento>;
  subImpegnoData?: Maybe<SubImpegno>;
  tipo?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  tipologiaDescr?: Maybe<Scalars['String']>;
  titolo?: Maybe<Scalars['Int']>;
  titoloDescr?: Maybe<Scalars['String']>;
  validato?: Maybe<Scalars['Boolean']>;
  vincolato?: Maybe<Scalars['Boolean']>;
};

export type SubAccertamentoInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numAccertamento?: InputMaybe<Scalars['Int']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export type SubImpegno = {
  __typename?: 'SubImpegno';
  accertamentoData?: Maybe<Accertamento>;
  annoCompetenza?: Maybe<Scalars['String']>;
  articolo?: Maybe<Scalars['Int']>;
  articoloDescr?: Maybe<Scalars['String']>;
  assestato?: Maybe<Scalars['BigDecimal']>;
  capitolo?: Maybe<Scalars['Int']>;
  capitoloDescr?: Maybe<Scalars['String']>;
  capitoloStorico?: Maybe<Scalars['String']>;
  categoria?: Maybe<Scalars['String']>;
  categoriaDescr?: Maybe<Scalars['String']>;
  cdc?: Maybe<Scalars['String']>;
  cdcDscr?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  cdrDescr?: Maybe<Scalars['String']>;
  contoF?: Maybe<Scalars['String']>;
  contoFinanziario?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  disponibilita?: Maybe<Scalars['BigDecimal']>;
  disponibilitaStorni?: Maybe<Scalars['BigDecimal']>;
  id?: Maybe<Scalars['BigInteger']>;
  impegnoData?: Maybe<Impegno>;
  importo?: Maybe<Scalars['BigDecimal']>;
  liquidato?: Maybe<Scalars['BigDecimal']>;
  macroAggregato?: Maybe<Scalars['String']>;
  macroaggregatoDescr?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  missione?: Maybe<Scalars['String']>;
  missioneDescr?: Maybe<Scalars['String']>;
  motivazione?: Maybe<Scalars['String']>;
  numSubImpegno?: Maybe<Scalars['Int']>;
  numeroImpegno?: Maybe<Scalars['Int']>;
  numeroVincolo?: Maybe<Scalars['String']>;
  prenotato?: Maybe<Scalars['BigDecimal']>;
  prenotazioneData?: Maybe<Prenotazione>;
  programma?: Maybe<Scalars['String']>;
  programmaDescr?: Maybe<Scalars['String']>;
  reimputazioneData?: Maybe<Reimputazione>;
  riferimentiContabili?: Maybe<RiferimentiContabili>;
  soggetti?: Maybe<Array<Maybe<Soggetto>>>;
  sub?: Maybe<Scalars['Int']>;
  subAccertamentoData?: Maybe<SubAccertamento>;
  subImpegnoData?: Maybe<SubImpegno>;
  tipo?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  tipologiaDescr?: Maybe<Scalars['String']>;
  titolo?: Maybe<Scalars['Int']>;
  titoloDescr?: Maybe<Scalars['String']>;
  validato?: Maybe<Scalars['Boolean']>;
  vincolato?: Maybe<Scalars['Boolean']>;
};

export type SubImpegnoInputInput = {
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['Int']>;
  articoloDescr?: InputMaybe<Scalars['String']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  capitolo?: InputMaybe<Scalars['Int']>;
  capitoloDescr?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  categoria?: InputMaybe<Scalars['String']>;
  categoriaDescr?: InputMaybe<Scalars['String']>;
  cdc?: InputMaybe<Scalars['String']>;
  cdcDscr?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  cdrDescr?: InputMaybe<Scalars['String']>;
  codForn?: InputMaybe<Scalars['String']>;
  cod_cig?: InputMaybe<Scalars['String']>;
  contoF?: InputMaybe<Scalars['String']>;
  contoFinanziario?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  disponibilita?: InputMaybe<Scalars['BigDecimal']>;
  idPrenotazioneSIB?: InputMaybe<Scalars['Int']>;
  impIniz?: InputMaybe<Scalars['BigDecimal']>;
  impVar?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  importo?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  macroAggregato?: InputMaybe<Scalars['String']>;
  macroaggregatoDescr?: InputMaybe<Scalars['String']>;
  missione?: InputMaybe<Scalars['String']>;
  missioneDescr?: InputMaybe<Scalars['String']>;
  motivazione?: InputMaybe<Scalars['String']>;
  numPrenotazioneSIBAssociata?: InputMaybe<Scalars['Int']>;
  numSubAccertamento?: InputMaybe<Scalars['Int']>;
  numSubImpegno?: InputMaybe<Scalars['Int']>;
  numeroImpegno?: InputMaybe<Scalars['Int']>;
  numeroNuovoImpegno?: InputMaybe<Scalars['Int']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  programma?: InputMaybe<Scalars['String']>;
  programmaDescr?: InputMaybe<Scalars['String']>;
  sub?: InputMaybe<Scalars['Int']>;
  tipo?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  tipologiaDescr?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['Int']>;
  titoloDescr?: InputMaybe<Scalars['String']>;
  validato?: InputMaybe<Scalars['Boolean']>;
  vincolato?: InputMaybe<Scalars['Boolean']>;
};

export enum TemplateDeterminaType {
  Ato2 = 'ATO2',
  Base = 'BASE',
  Pnrr = 'PNRR',
  PnrrAto2 = 'PNRR_ATO2'
}

export enum TipoAttivita {
  AnnullamentoScrittureContabili = 'annullamentoScrittureContabili',
  ApprovazioneDirettore = 'approvazioneDirettore',
  ApprovazioneDirigente = 'approvazioneDirigente',
  ApprovazioneFirmaDirigente = 'approvazioneFirmaDirigente',
  ApprovazioneFirmaDirigenteEntrata = 'approvazioneFirmaDirigenteEntrata',
  ApprovazioneFirmaDirigenteSpesa1 = 'approvazioneFirmaDirigenteSpesa1',
  ApprovazioneFirmaDirigenteSpesa2 = 'approvazioneFirmaDirigenteSpesa2',
  ApprovazioneFirmaRagioniereGenerale = 'approvazioneFirmaRagioniereGenerale',
  ApprovazioneOmissis = 'approvazioneOmissis',
  ApprovazioneRagioneria = 'approvazioneRagioneria',
  ApprovazioneRagioneriaEntrata = 'approvazioneRagioneriaEntrata',
  ApprovazioneRagioneriaTitolo1 = 'approvazioneRagioneriaTitolo1',
  ApprovazioneRagioneriaTitolo2 = 'approvazioneRagioneriaTitolo2',
  ApprovazioneResponsabileProcedimento = 'approvazioneResponsabileProcedimento',
  ApprovazioneUfficioBilancio = 'approvazioneUfficioBilancio',
  AttribuzioniOrizzontali = 'attribuzioniOrizzontali',
  AttribuzioniOrizzontaliEntrata = 'attribuzioniOrizzontaliEntrata',
  AttribuzioniOrizzontaliSpesa = 'attribuzioniOrizzontaliSpesa',
  AttribuzioniOrizzontaliTitolo1 = 'attribuzioniOrizzontaliTitolo1',
  AttribuzioniOrizzontaliTitolo2 = 'attribuzioniOrizzontaliTitolo2',
  AvanzaStatoDetermina = 'avanzaStatoDetermina',
  BeniServizi = 'beniServizi',
  Bilancio = 'bilancio',
  FirmaDirigente = 'firmaDirigente',
  FirmaDirigenteEntrata = 'firmaDirigenteEntrata',
  FirmaDirigenteSpesa1 = 'firmaDirigenteSpesa1',
  FirmaDirigenteSpesa2 = 'firmaDirigenteSpesa2',
  FirmaRagioniereGenerale = 'firmaRagioniereGenerale',
  Fiscale = 'fiscale',
  GestioneOmissis = 'gestioneOmissis',
  Mutuo = 'mutuo',
  None = 'none',
  Partecipate = 'partecipate',
  Patrimonio = 'patrimonio',
  Peg = 'peg',
  PianoOpere = 'pianoOpere',
  Posizione = 'posizione',
  Redazione = 'redazione',
  SecondaApprovazioneRagioneriaEntrata = 'secondaApprovazioneRagioneriaEntrata',
  SecondaApprovazioneRagioneriaTitolo1 = 'secondaApprovazioneRagioneriaTitolo1',
  SecondaApprovazioneRagioneriaTitolo2 = 'secondaApprovazioneRagioneriaTitolo2'
}

export enum TipoDetermina {
  AccertamentoImpegno = 'accertamentoImpegno',
  AccertamentoImpegnoAto2 = 'accertamentoImpegnoAto2',
  AnticipazioneEconomale = 'anticipazioneEconomale',
  ContabileSenzaEntrata = 'contabileSenzaEntrata',
  ContabileSenzaEntrataAto2 = 'contabileSenzaEntrataAto2',
  ContabileSenzaSpesa = 'contabileSenzaSpesa',
  ContabileSenzaSpesaAto2 = 'contabileSenzaSpesaAto2',
  ContabileSenzaStorniEntrata = 'contabileSenzaStorniEntrata',
  ContabileSenzaStorniEntrataAto2 = 'contabileSenzaStorniEntrataAto2',
  ContabileSenzaStorniSpesa = 'contabileSenzaStorniSpesa',
  ContabileSenzaStorniSpesaAto2 = 'contabileSenzaStorniSpesaAto2',
  Notificazione = 'notificazione',
  RilevanzaEntrata = 'rilevanzaEntrata',
  RilevanzaEntrataAto2 = 'rilevanzaEntrataAto2',
  RilevanzaSpesa = 'rilevanzaSpesa',
  RilevanzaSpesaAto2 = 'rilevanzaSpesaAto2',
  SenzaRilevanza = 'senzaRilevanza',
  SenzaRilevanzaAto2 = 'senzaRilevanzaAto2'
}

export enum TipoLista {
  Affidamento = 'affidamento',
  CategorieGpp = 'categorieGPP',
  CodiceObiettivo = 'codiceObiettivo',
  Finanziamento = 'finanziamento',
  MacrocategoriaGpp = 'macrocategoriaGPP'
}

export type UserHistory = {
  __typename?: 'UserHistory';
  /** ISO-8601 */
  created_at?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  delegation_end?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  delegation_start?: Maybe<Scalars['DateTime']>;
  record_type?: Maybe<RecordType>;
  state?: Maybe<RecordState>;
  type?: Maybe<PermitType>;
};

export type UserOffice = {
  __typename?: 'UserOffice';
  office?: Maybe<Office>;
  roles?: Maybe<Array<Maybe<Role>>>;
  userOfficeRoles?: Maybe<Array<Maybe<Permit>>>;
};

export type Utente = {
  __typename?: 'Utente';
  determinePreferite?: Maybe<Array<Maybe<Determina>>>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  ssoId?: Maybe<Scalars['String']>;
};

export type UtenteInputInput = {
  ssoId?: InputMaybe<Scalars['String']>;
};

export type ValidazioneDto = {
  __typename?: 'ValidazioneDTO';
  motivazione?: Maybe<Scalars['String']>;
  movimentoId?: Maybe<Scalars['BigInteger']>;
  valido: Scalars['Boolean'];
};

export type ValidazioneTabDto = {
  __typename?: 'ValidazioneTabDTO';
  determinaValida: Scalars['Boolean'];
  frontespizioPremessa: Scalars['Boolean'];
  riferimentiContabili: Scalars['Boolean'];
  sezioneDispositivo: Scalars['Boolean'];
};

export type AnacFragment = { __typename?: 'DeterminaFormAnac', determina_id?: any | null, cig?: string | null, numProposta?: string | null, annoProposta?: string | null, ruDetermina?: string | null, annoDetermina?: string | null, oggettoDetermina?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, cdr?: string | null, statoAnac?: string | null };

export type Anac_FormFragment = { __typename?: 'FormAnac', id?: any | null, cig?: string | null, determina_id?: any | null, completato?: boolean | null, oggetto_bando?: string | null, nome_struttura_preponente?: string | null, codice_struttura_preponente?: string | null, procesura_scelta?: string | null, importo_aggiudicazione?: any | null, importo_somme_liquidate?: any | null, tempo_completamento_servizio_da?: any | null, tempo_completamento_servizio_a?: any | null, invitati?: Array<{ __typename?: 'InvitatoAnac', id?: any | null, form_anac_id?: any | null, aggiudicatario?: boolean | null, ragione_sociale?: string | null, codice_fiscale?: string | null, identificativoFiscaleEstero?: string | null } | null> | null, gruppiInvitati?: Array<{ __typename?: 'GruppoInvitatoAnac', id?: any | null, form_anac_id?: any | null, aggiudicatario?: boolean | null, ragione_sociale?: string | null, codice_fiscale?: string | null, identificativoFiscaleEstero?: string | null, ruolo?: string | null } | null> | null };

export type Anac_Gruppo_InvitatoFragment = { __typename?: 'GruppoInvitatoAnac', id?: any | null, form_anac_id?: any | null, aggiudicatario?: boolean | null, ragione_sociale?: string | null, codice_fiscale?: string | null, identificativoFiscaleEstero?: string | null, ruolo?: string | null };

export type Anac_InvitatoFragment = { __typename?: 'InvitatoAnac', id?: any | null, form_anac_id?: any | null, aggiudicatario?: boolean | null, ragione_sociale?: string | null, codice_fiscale?: string | null, identificativoFiscaleEstero?: string | null };

export type AttivitaFragment = { __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean, determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null } | null };

export type Attivita_BaseFragment = { __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean };

export type Attivita_LightFragment = { __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, referenceName?: string | null, stato?: string | null, dataPresaInCaricoString?: string | null, determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, numProposta?: string | null, annoProposta?: number | null, ruDetermina?: string | null, annoDetermina?: number | null, oggetto?: string | null, stato?: string | null, tipo?: string | null, dataCreazioneString?: string | null } | null };

export type Attivita_NotaFragment = { __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean, nota?: { __typename?: 'Nota', id?: any | null, testo?: string | null } | null };

export type Attivita_Pendente_DtoFragment = { __typename?: 'AttivitaPendenteDTO', id?: string | null, name?: string | null, referenceName?: string | null, userEnabled: boolean, dataPresaInCaricoString?: string | null, stato?: string | null, presaInCaricoDa?: string | null };

export type Attribuzioni_OrizzontaliFragment = { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null };

export type CapitoloFragment = { __typename?: 'RecordCapitolo', eS?: string | null, codCapitoloNew?: string | null, articoloNew?: string | null, ntit?: string | null, annoRiferimento?: string | null, assestato?: string | null, impegnato?: string | null, accertato?: string | null, prenotato?: string | null, codCapitolo?: string | null, descrizioneArticolo?: string | null, nmis?: string | null, nprog?: string | null, ntipmac?: string | null, cdr?: string | null, cdrNew?: string | null, cdcVero?: string | null, ncateg?: string | null, ncontof?: string | null, ncontofinanziario?: string | null, nmissione?: string | null, nprogramma?: string | null, ndesctit?: string | null, ndesctipmac?: string | null, descCdr?: string | null, descCdc?: string | null, ndesccateg?: string | null, vincolato?: string | null, numeroVincolo?: string | null };

export type Default_DeterminaFragment = { __typename?: 'DefaultDetermina', id?: any | null, nomeCampo?: string | null, valore?: string | null, tipoDetermina?: TipoDetermina | null };

export type Default_ListeFragment = { __typename?: 'DefaultListe', id?: any | null, nomeCampo?: string | null, tipoLista?: TipoLista | null, cdr?: string | null, descrizione?: string | null, attivo?: boolean | null };

export type Determina_ListaFragment = { __typename?: 'Determina', id?: any | null, cdr?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazioneString?: string | null, preferita: boolean };

export type DeterminaFragment = { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null };

export type Determina_AnacFragment = { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null };

export type Determina_BaseFragment = { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null };

export type Determina_DetailFragment = { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, documentoPrincipale?: { __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null, documentoOscurato?: { __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null, attivita_pendente?: { __typename?: 'AttivitaPendenteDTO', id?: string | null, name?: string | null, referenceName?: string | null, userEnabled: boolean, dataPresaInCaricoString?: string | null, stato?: string | null, presaInCaricoDa?: string | null } | null, listaAttivita?: Array<{ __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean, nota?: { __typename?: 'Nota', id?: any | null, testo?: string | null } | null } | null> | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null };

export type Determina_GppFragment = { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, formGpp?: { __typename?: 'FormGpp', id?: any | null, determina_id?: any | null, totale?: any | null, totaleGpp?: any | null, completato?: boolean | null, categorie?: Array<{ __typename?: 'GppCategoria', id?: any | null, macro_categoria?: string | null, categoria?: string | null, quantita?: number | null, quantita_gpp?: number | null, totale?: any | null, anno?: number | null, descrizione?: string | null } | null> | null } | null };

export type Disponibilita_DtoFragment = { __typename?: 'CheckDisponibilitaDTO', disponibilitaContabilita?: any | null, disponibilitaEffettiva?: any | null, totaleImpegnatoAccertato?: any | null, determine?: Array<{ __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null } | null> | null };

export type DocumentoFragment = { __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null };

export type Fascia_ControlloFragment = { __typename?: 'FasciaDiControllo', id?: any | null, tipoDetermina?: TipoDetermina | null, da?: any | null, daString?: string | null, a?: any | null, aString?: string | null };

export type GppFragment = { __typename?: 'DeterminaFormGpp', determina_id?: any | null, numProposta?: string | null, annoProposta?: string | null, ruDetermina?: string | null, annoDetermina?: string | null, oggettoDetermina?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, cdr?: string | null, statoGpp?: string | null, formGpp?: { __typename?: 'FormGpp', totale?: any | null } | null };

export type Gpp_CategoriaFragment = { __typename?: 'GppCategoria', id?: any | null, macro_categoria?: string | null, categoria?: string | null, quantita?: number | null, quantita_gpp?: number | null, totale?: any | null, anno?: number | null, descrizione?: string | null };

export type Gpp_FormFragment = { __typename?: 'FormGpp', id?: any | null, determina_id?: any | null, totale?: any | null, totaleGpp?: any | null, completato?: boolean | null, categorie?: Array<{ __typename?: 'GppCategoria', id?: any | null, macro_categoria?: string | null, categoria?: string | null, quantita?: number | null, quantita_gpp?: number | null, totale?: any | null, anno?: number | null, descrizione?: string | null } | null> | null };

export type ImpegnoFragment = { __typename?: 'RecordImpAccert', capNew?: string | null, artNew?: string | null, ntit?: string | null, annoRiferimento?: string | null, anno?: string | null, num?: string | null, impAss?: string | null, impLiq?: string | null, cap?: string | null, descr?: string | null, nmis?: string | null, nprog?: string | null, ntipmac?: string | null, cdr?: string | null, cdrNew?: string | null, cdrVeroNew?: string | null, ncateg?: string | null, nContof?: string | null, nContofinanziario?: string | null, nMissione?: string | null, nProgramma?: string | null, nDesctit?: string | null, nDesctipmac?: string | null, descCdr?: string | null, descCdc?: string | null, nDesccateg?: string | null, es?: string | null, tipo?: string | null, sub?: string | null, codForn?: string | null, codCig?: string | null };

export type MovimentoFragment = { __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null };

export type Movimento_AccertamentoFragment = { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null };

export type Movimento_ImpegnoFragment = { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null };

export type Movimento_PrenotazioneFragment = { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null };

export type Movimento_ReimputazioneFragment = { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null };

export type Movimento_SoggettoFragment = { __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null };

export type Movimento_Sub_AccertamentoFragment = { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null };

export type Movimento_Sub_ImpegnoFragment = { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null };

export type NotaFragment = { __typename?: 'Nota', id?: any | null, testo?: string | null };

export type Nota_DeterminaFragment = { __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null };

export type PrenotazioneFragment = { __typename?: 'RecordPrenotImpegno', capNew?: string | null, artNew?: string | null, nTit?: string | null, annoRiferimento?: string | null, anno?: string | null, num?: string | null, impAss?: string | null, cap?: string | null, descr?: string | null, nMis?: string | null, nProg?: string | null, nTipmac?: string | null, cdr?: string | null, cdrNew?: string | null, cdrVeroNew?: string | null, nCateg?: string | null, nContof?: string | null, nContofinanziario?: string | null, nMissione?: string | null, nProgramma?: string | null, nDesctit?: string | null, nDesctipmac?: string | null, descCdr?: string | null, descCdc?: string | null, nDesccateg?: string | null, impIniz?: string | null, impVar?: string | null };

export type Proprieta_OffuscataFragment = { __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null };

export type Proprieta_Offuscata_SoggettoFragment = { __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null };

export type Riferimenti_ContabiliFragment = { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null };

export type Sid_ProcessFragment = { __typename?: 'SidProcessGraphqlDTO', bpmnProcessTaskId?: string | null, referenceName?: string | null, stato?: string | null, determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, numProposta?: string | null, annoProposta?: number | null, ruDetermina?: string | null, annoDetermina?: number | null, oggetto?: string | null, stato?: string | null, tipo?: string | null, dataCreazioneString?: string | null } | null };

export type SoggettoFragment = { __typename?: 'RecordSoggetto', nominativo?: string | null, partitaiva?: string | null, codicefiscale?: string | null, comune?: string | null, indirizzo?: string | null, cap?: string | null, codSubject?: string | null };

export type Validazione_DtoFragment = { __typename?: 'ValidazioneDTO', movimentoId?: any | null, motivazione?: string | null, valido: boolean };

export type Validazione_Tab_DtoFragment = { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean };

export type SaveAccertamentoMutationVariables = Exact<{
  data?: InputMaybe<AccertamentoInputInput>;
}>;


export type SaveAccertamentoMutation = { __typename?: 'Mutation', salvaAccertamento?: { __typename?: 'Accertamento', id?: any | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null };

export type UpdateAccertamentoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<AccertamentoInputInput>;
}>;


export type UpdateAccertamentoMutation = { __typename?: 'Mutation', aggiornaAccertamento?: { __typename?: 'Accertamento', id?: any | null } | null };

export type SaveAnacFormMutationVariables = Exact<{
  data?: InputMaybe<FormAnacInputInput>;
}>;


export type SaveAnacFormMutation = { __typename?: 'Mutation', salvaFormAnac?: { __typename?: 'FormAnac', id?: any | null } | null };

export type UpdateAnacFormMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<FormAnacInputInput>;
}>;


export type UpdateAnacFormMutation = { __typename?: 'Mutation', aggiornaFormAnac?: { __typename?: 'FormAnac', id?: any | null } | null };

export type DeleteAnacGruppoInvitatoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteAnacGruppoInvitatoMutation = { __typename?: 'Mutation', eliminaGruppoInvitatoAnac: boolean };

export type SaveAnacGruppoInvitatoMutationVariables = Exact<{
  data?: InputMaybe<GruppoInvitatoAnacInputInput>;
}>;


export type SaveAnacGruppoInvitatoMutation = { __typename?: 'Mutation', salvaGruppoInvitatoAnac?: { __typename?: 'GruppoInvitatoAnac', id?: any | null } | null };

export type UpdateAnacGruppoInvitatoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<GruppoInvitatoAnacInputInput>;
}>;


export type UpdateAnacGruppoInvitatoMutation = { __typename?: 'Mutation', aggiornaGruppoInvitatoAnac?: { __typename?: 'GruppoInvitatoAnac', id?: any | null } | null };

export type DeleteAnacInvitatoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteAnacInvitatoMutation = { __typename?: 'Mutation', eliminaInvitatoAnac: boolean };

export type SaveAnacInvitatoMutationVariables = Exact<{
  data?: InputMaybe<InvitatoAnacInputInput>;
}>;


export type SaveAnacInvitatoMutation = { __typename?: 'Mutation', salvaInvitatoAnac?: { __typename?: 'InvitatoAnac', id?: any | null } | null };

export type UpdateAnacInvitatoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<InvitatoAnacInputInput>;
}>;


export type UpdateAnacInvitatoMutation = { __typename?: 'Mutation', aggiornaInvitatoAnac?: { __typename?: 'InvitatoAnac', id?: any | null } | null };

export type SaveCampiDefaultDeterminaMutationVariables = Exact<{
  vistiDiLegge?: InputMaybe<DefaultDeterminaInputInput>;
  preseDatto?: InputMaybe<DefaultDeterminaInputInput>;
}>;


export type SaveCampiDefaultDeterminaMutation = { __typename?: 'Mutation', vistiDiLegge?: { __typename?: 'DefaultDetermina', id?: any | null } | null, preseDatto?: { __typename?: 'DefaultDetermina', id?: any | null } | null };

export type SaveCampoDefaultDeterminaMutationVariables = Exact<{
  data?: InputMaybe<DefaultDeterminaInputInput>;
}>;


export type SaveCampoDefaultDeterminaMutation = { __typename?: 'Mutation', mergeDefaultDetermina?: { __typename?: 'DefaultDetermina', id?: any | null } | null };

export type CompletaAttivitaMutationVariables = Exact<{
  taskName?: InputMaybe<TipoAttivita>;
  taskId?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  revisione?: InputMaybe<Scalars['Boolean']>;
  nota?: InputMaybe<NotaInputInput>;
  avanzaStatoDetermina?: InputMaybe<Scalars['Boolean']>;
  attribuzioniOrizzontali?: InputMaybe<AttribuzioniOrizzontaliInputInput>;
  approvazioneBilancioInput?: InputMaybe<ApprovazioneBilancioInputInput>;
  remote_sign?: InputMaybe<Scalars['Boolean']>;
  firmaInput?: InputMaybe<FirmaInputInput>;
  omissis?: InputMaybe<Scalars['Boolean']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  titoloScelto?: InputMaybe<Scalars['Int']>;
}>;


export type CompletaAttivitaMutation = { __typename?: 'Mutation', completaAttivita?: { __typename?: 'Attivita', id?: any | null } | null };

export type DeleteDefaultListaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteDefaultListaMutation = { __typename?: 'Mutation', eliminaDefaultListe: boolean };

export type SaveDefaultListaMutationVariables = Exact<{
  data?: InputMaybe<DefaultListeInputInput>;
}>;


export type SaveDefaultListaMutation = { __typename?: 'Mutation', salvaDefaultListe?: { __typename?: 'DefaultListe', id?: any | null } | null };

export type UpdateDefaultListaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<DefaultListeInputInput>;
}>;


export type UpdateDefaultListaMutation = { __typename?: 'Mutation', aggiornaDefaultListe?: { __typename?: 'DefaultListe', id?: any | null } | null };

export type DeleteDeterminaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  nota?: InputMaybe<NotaInputInput>;
}>;


export type DeleteDeterminaMutation = { __typename?: 'Mutation', annullaDetermina: boolean };

export type DuplicaDeterminaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<DeterminaInputInput>;
}>;


export type DuplicaDeterminaMutation = { __typename?: 'Mutation', duplicaDetermina?: { __typename?: 'Determina', id?: any | null } | null };

export type SaveDeterminaMutationVariables = Exact<{
  data?: InputMaybe<DeterminaInputInput>;
  fastMode?: InputMaybe<Scalars['Boolean']>;
}>;


export type SaveDeterminaMutation = { __typename?: 'Mutation', salvaDetermina?: { __typename?: 'Determina', id?: any | null, attivita_pendente?: { __typename?: 'AttivitaPendenteDTO', id?: string | null, name?: string | null, referenceName?: string | null, userEnabled: boolean, dataPresaInCaricoString?: string | null, stato?: string | null, presaInCaricoDa?: string | null } | null } | null };

export type UpdateDeterminaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<DeterminaInputInput>;
}>;


export type UpdateDeterminaMutation = { __typename?: 'Mutation', aggiornaDetermina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null } | null };

export type UpdateDeterminaPreferitaMutationVariables = Exact<{
  determina_id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type UpdateDeterminaPreferitaMutation = { __typename?: 'Mutation', toggleDeterminaPreferita?: { __typename?: 'Utente', id?: any | null } | null };

export type DeleteDocumentoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteDocumentoMutation = { __typename?: 'Mutation', eliminaDocumento: boolean };

export type DeleteFasceControlloMutationVariables = Exact<{
  idList?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>> | InputMaybe<Scalars['BigInteger']>>;
}>;


export type DeleteFasceControlloMutation = { __typename?: 'Mutation', eliminaListaFasciaDiControllo: boolean };

export type DeleteFasciaControlloMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteFasciaControlloMutation = { __typename?: 'Mutation', eliminaFasciaDiControllo: boolean };

export type SaveFasciaControlloMutationVariables = Exact<{
  data?: InputMaybe<FasciaDiControlloInputInput>;
}>;


export type SaveFasciaControlloMutation = { __typename?: 'Mutation', salvaFasciaDiControllo?: { __typename?: 'FasciaDiControllo', id?: any | null } | null };

export type UpdateFasciaControlloMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<FasciaDiControlloInputInput>;
}>;


export type UpdateFasciaControlloMutation = { __typename?: 'Mutation', aggiornaFasciaDiControllo?: { __typename?: 'FasciaDiControllo', id?: any | null } | null };

export type DeleteFasciaControlloDefinitoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteFasciaControlloDefinitoMutation = { __typename?: 'Mutation', eliminaDefinitivamenteFasciaDiControllo: boolean };

export type FirmaMultiplaMutationVariables = Exact<{
  taskNames: Array<InputMaybe<TipoAttivita>> | InputMaybe<TipoAttivita>;
  taskIds: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
  determineIds: Array<InputMaybe<Scalars['BigInteger']>> | InputMaybe<Scalars['BigInteger']>;
  revisione?: InputMaybe<Scalars['Boolean']>;
  avanzaStatoDetermina?: InputMaybe<Scalars['Boolean']>;
  attribuzioniOrizzontali?: InputMaybe<AttribuzioniOrizzontaliInputInput>;
  approvazioneBilancioInput?: InputMaybe<ApprovazioneBilancioInputInput>;
  remote_sign?: InputMaybe<Scalars['Boolean']>;
  firmaInput?: InputMaybe<FirmaInputInput>;
  omissis?: InputMaybe<Scalars['Boolean']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  titoloScelto?: InputMaybe<Scalars['Int']>;
}>;


export type FirmaMultiplaMutation = { __typename?: 'Mutation', firmaMultipla?: Array<{ __typename?: 'Attivita', id?: any | null } | null> | null };

export type DeleteGppCategoriaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteGppCategoriaMutation = { __typename?: 'Mutation', eliminaGppCategoria: boolean };

export type SaveGppCategoriaMutationVariables = Exact<{
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<GppCategoriaInputInput>;
}>;


export type SaveGppCategoriaMutation = { __typename?: 'Mutation', salvaGppCategoria?: { __typename?: 'GppCategoria', id?: any | null } | null };

export type UpdateGppCategoriaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<GppCategoriaInputInput>;
}>;


export type UpdateGppCategoriaMutation = { __typename?: 'Mutation', aggiornaGppCategoria?: { __typename?: 'GppCategoria', id?: any | null } | null };

export type SaveGppFormMutationVariables = Exact<{
  data?: InputMaybe<FormGppInputInput>;
}>;


export type SaveGppFormMutation = { __typename?: 'Mutation', salvaFormGpp?: { __typename?: 'FormGpp', id?: any | null } | null };

export type UpdateGppFormMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<FormGppInputInput>;
}>;


export type UpdateGppFormMutation = { __typename?: 'Mutation', aggiornaFormGpp?: { __typename?: 'FormGpp', id?: any | null } | null };

export type SaveImpegnoMutationVariables = Exact<{
  data?: InputMaybe<ImpegnoInputInput>;
}>;


export type SaveImpegnoMutation = { __typename?: 'Mutation', salvaImpegno?: { __typename?: 'Impegno', id?: any | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null };

export type UpdateImpegnoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<ImpegnoInputInput>;
}>;


export type UpdateImpegnoMutation = { __typename?: 'Mutation', aggiornaImpegno?: { __typename?: 'Impegno', id?: any | null } | null };

export type SaveMovimentiMutationVariables = Exact<{
  data?: InputMaybe<MultiMovimentoSoggettoUpdateInput>;
}>;


export type SaveMovimentiMutation = { __typename?: 'Mutation', salvaMultiMovimentoSoggetto: boolean };

export type SaveMovimentiStorniMutationVariables = Exact<{
  data?: InputMaybe<MultiMovimentoSoggettoUpdateInput>;
}>;


export type SaveMovimentiStorniMutation = { __typename?: 'Mutation', salvaMultiMovimentoSoggettoStorni: boolean };

export type DeleteMovimentoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteMovimentoMutation = { __typename?: 'Mutation', eliminaMovimento: boolean };

export type UpdateMovimentoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<MovimentoInputInput>;
  tipoUscita?: InputMaybe<Scalars['String']>;
}>;


export type UpdateMovimentoMutation = { __typename?: 'Mutation', aggiornaMovimento?: { __typename?: 'Movimento', id?: any | null } | null };

export type SaveNotaMutationVariables = Exact<{
  data?: InputMaybe<NotaInputInput>;
}>;


export type SaveNotaMutation = { __typename?: 'Mutation', salvaNota?: { __typename?: 'Nota', id?: any | null } | null };

export type SavePrenotazioneMutationVariables = Exact<{
  data?: InputMaybe<PrenotazioneInputInput>;
}>;


export type SavePrenotazioneMutation = { __typename?: 'Mutation', salvaPrenotazione?: { __typename?: 'Prenotazione', id?: any | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null };

export type UpdatePrenotazioneMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<PrenotazioneInputInput>;
}>;


export type UpdatePrenotazioneMutation = { __typename?: 'Mutation', aggiornaPrenotazione?: { __typename?: 'Prenotazione', id?: any | null } | null };

export type SaveProprietaOffuscateMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<Array<InputMaybe<ProprietaOffuscataMergeInputInput>> | InputMaybe<ProprietaOffuscataMergeInputInput>>;
}>;


export type SaveProprietaOffuscateMutation = { __typename?: 'Mutation', salvaProprietaOffuscateDetermina: boolean };

export type SaveProprietaOffuscateSoggettoMutationVariables = Exact<{
  id_determina?: InputMaybe<Scalars['BigInteger']>;
  proprieta_comuni?: InputMaybe<Array<InputMaybe<ProprietaOffuscataCampo>> | InputMaybe<ProprietaOffuscataCampo>>;
  proprieta?: InputMaybe<Array<InputMaybe<ProprietaOffuscataSectionInputInput>> | InputMaybe<ProprietaOffuscataSectionInputInput>>;
}>;


export type SaveProprietaOffuscateSoggettoMutation = { __typename?: 'Mutation', salvaMultiProprietaOffuscataSoggetto: boolean };

export type UpdateRiferimentiContabiliMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<RiferimentiContabiliInputInput>;
}>;


export type UpdateRiferimentiContabiliMutation = { __typename?: 'Mutation', aggiornaRiferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null } | null };

export type UpdateRiferimentiMovimentiMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  riferimentiContabili?: InputMaybe<RiferimentiContabiliInputInput>;
  capitoli?: InputMaybe<MultiMovimentoSoggettoUpdateInput>;
  prenotazioni?: InputMaybe<MultiMovimentoSoggettoUpdateInput>;
  impegniAccertamenti?: InputMaybe<MultiMovimentoSoggettoUpdateInput>;
}>;


export type UpdateRiferimentiMovimentiMutation = { __typename?: 'Mutation', salvaCapitoli: boolean, salvaPrenotazioni: boolean, salvaImpegniAccertamenti: boolean, aggiornaRiferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null } | null };

export type RilasciaAttivitaMutationVariables = Exact<{
  taskName?: InputMaybe<TipoAttivita>;
  taskId?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type RilasciaAttivitaMutation = { __typename?: 'Mutation', rilasciaAttivita?: { __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean } | null };

export type RivenditaAttivitaMutationVariables = Exact<{
  taskName?: InputMaybe<TipoAttivita>;
  taskId?: InputMaybe<Scalars['String']>;
  referenceName?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type RivenditaAttivitaMutation = { __typename?: 'Mutation', rivendicaAttivita?: { __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean } | null };

export type RivendicaAttivitaMassivaMutationVariables = Exact<{
  taskNames: Array<InputMaybe<TipoAttivita>> | InputMaybe<TipoAttivita>;
  taskIds: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
  referenceNames?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  determineIds: Array<InputMaybe<Scalars['BigInteger']>> | InputMaybe<Scalars['BigInteger']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type RivendicaAttivitaMassivaMutation = { __typename?: 'Mutation', rivendicaAttivitaMassiva?: Array<{ __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean } | null> | null };

export type DeleteSoggettoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteSoggettoMutation = { __typename?: 'Mutation', eliminaSoggetto: boolean };

export type SaveSoggettoMutationVariables = Exact<{
  data?: InputMaybe<SoggettoInputInput>;
}>;


export type SaveSoggettoMutation = { __typename?: 'Mutation', salvaSoggetto?: { __typename?: 'Soggetto', id?: any | null } | null };

export type UpdateSoggettoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<SoggettoInputInput>;
}>;


export type UpdateSoggettoMutation = { __typename?: 'Mutation', aggiornaSoggetto?: { __typename?: 'Soggetto', id?: any | null } | null };

export type SaveSubAccertamentoMutationVariables = Exact<{
  data?: InputMaybe<SubAccertamentoInputInput>;
}>;


export type SaveSubAccertamentoMutation = { __typename?: 'Mutation', salvaSubAccertamento?: { __typename?: 'SubAccertamento', id?: any | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null };

export type SaveSubImpegnoMutationVariables = Exact<{
  annoCompetenza?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<SubImpegnoInputInput>;
}>;


export type SaveSubImpegnoMutation = { __typename?: 'Mutation', salvaSubImpegno?: { __typename?: 'Movimento', id?: any | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null };

export type UpdateSubImpegnoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  data?: InputMaybe<SubImpegnoInputInput>;
}>;


export type UpdateSubImpegnoMutation = { __typename?: 'Mutation', aggiornaSubImpegno?: { __typename?: 'SubImpegno', id?: any | null } | null };

export type UpdateValidaCapitoloMutationVariables = Exact<{
  determina_id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type UpdateValidaCapitoloMutation = { __typename?: 'Mutation', valida_capitolo?: Array<{ __typename?: 'ValidazioneDTO', movimentoId?: any | null, motivazione?: string | null, valido: boolean } | null> | null };

export type UpdateValidaImpegnoAccertamentoMutationVariables = Exact<{
  determina_id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type UpdateValidaImpegnoAccertamentoMutation = { __typename?: 'Mutation', valida_subImpegnoAccertamento?: Array<{ __typename?: 'ValidazioneDTO', movimentoId?: any | null, motivazione?: string | null, valido: boolean } | null> | null };

export type UpdateValidaMovimentiMutationVariables = Exact<{
  determina_id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type UpdateValidaMovimentiMutation = { __typename?: 'Mutation', valida_capitolo?: Array<{ __typename?: 'ValidazioneDTO', movimentoId?: any | null, motivazione?: string | null, valido: boolean } | null> | null, valida_prenotazione?: Array<{ __typename?: 'ValidazioneDTO', movimentoId?: any | null, motivazione?: string | null, valido: boolean } | null> | null, valida_subImpegnoAccertamento?: Array<{ __typename?: 'ValidazioneDTO', movimentoId?: any | null, motivazione?: string | null, valido: boolean } | null> | null };

export type UpdateValidaPrenotazioneMutationVariables = Exact<{
  determina_id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type UpdateValidaPrenotazioneMutation = { __typename?: 'Mutation', valida_prenotazione?: Array<{ __typename?: 'ValidazioneDTO', movimentoId?: any | null, motivazione?: string | null, valido: boolean } | null> | null };

export type GetAnacQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<SortInputInput>;
  anacStateFiler?: InputMaybe<StateFiler>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type GetAnacQuery = { __typename?: 'Query', lista_determine_form_anac_paginato: number, lista_determine_form_anac?: Array<{ __typename?: 'DeterminaFormAnac', determina_id?: any | null, cig?: string | null, numProposta?: string | null, annoProposta?: string | null, ruDetermina?: string | null, annoDetermina?: string | null, oggettoDetermina?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, cdr?: string | null, statoAnac?: string | null } | null> | null };

export type GetAnacDetailsQueryVariables = Exact<{
  determinaId: Scalars['BigInteger'];
  cig?: InputMaybe<Scalars['String']>;
}>;


export type GetAnacDetailsQuery = { __typename?: 'Query', determina_form_anac_by_cig_determinaId?: { __typename?: 'DeterminaFormAnac', importoDiAggiudicazione?: any | null } | null, form_anac_by_cig_determinaId?: { __typename?: 'FormAnac', id?: any | null, cig?: string | null, determina_id?: any | null, completato?: boolean | null, oggetto_bando?: string | null, nome_struttura_preponente?: string | null, codice_struttura_preponente?: string | null, procesura_scelta?: string | null, importo_aggiudicazione?: any | null, importo_somme_liquidate?: any | null, tempo_completamento_servizio_da?: any | null, tempo_completamento_servizio_a?: any | null, invitati?: Array<{ __typename?: 'InvitatoAnac', id?: any | null, form_anac_id?: any | null, aggiudicatario?: boolean | null, ragione_sociale?: string | null, codice_fiscale?: string | null, identificativoFiscaleEstero?: string | null } | null> | null, gruppiInvitati?: Array<{ __typename?: 'GruppoInvitatoAnac', id?: any | null, form_anac_id?: any | null, aggiudicatario?: boolean | null, ragione_sociale?: string | null, codice_fiscale?: string | null, identificativoFiscaleEstero?: string | null, ruolo?: string | null } | null> | null } | null };

export type GetAttivitaQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  utente?: InputMaybe<Scalars['String']>;
  filtro?: InputMaybe<FiltroAttivita>;
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>> | InputMaybe<StatoDetermina>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>> | InputMaybe<TipoDetermina>>;
  sort?: InputMaybe<SortInputInput>;
}>;


export type GetAttivitaQuery = { __typename?: 'Query', attivita_paginato: number, attivita?: Array<{ __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, referenceName?: string | null, stato?: string | null, dataPresaInCaricoString?: string | null, determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, numProposta?: string | null, annoProposta?: number | null, ruDetermina?: string | null, annoDetermina?: number | null, oggetto?: string | null, stato?: string | null, tipo?: string | null, dataCreazioneString?: string | null } | null } | null> | null };

export type GetAttivitaDetailsQueryVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']>;
  determinaId: Scalars['BigInteger'];
}>;


export type GetAttivitaDetailsQuery = { __typename?: 'Query', singola_attivita_uuid?: { __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean, determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null } | null } | null };

export type GetAttivitaPendentiQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>> | InputMaybe<StatoDetermina>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>> | InputMaybe<TipoDetermina>>;
  sort?: InputMaybe<SortInputInput>;
}>;


export type GetAttivitaPendentiQuery = { __typename?: 'Query', attivita_pendenti_paginato_new: number, attivita_pendenti_new?: Array<{ __typename?: 'SidProcessGraphqlDTO', bpmnProcessTaskId?: string | null, referenceName?: string | null, stato?: string | null, determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, numProposta?: string | null, annoProposta?: number | null, ruDetermina?: string | null, annoDetermina?: number | null, oggetto?: string | null, stato?: string | null, tipo?: string | null, dataCreazioneString?: string | null } | null } | null> | null };

export type GetCapitoliQueryVariables = Exact<{
  annoCompetenza?: InputMaybe<Scalars['String']>;
  annoBilancio?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitoloVecchio?: InputMaybe<Scalars['String']>;
  vincolo?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
}>;


export type GetCapitoliQuery = { __typename?: 'Query', capitolo_pages: number, capitolo?: Array<{ __typename?: 'RecordCapitolo', eS?: string | null, codCapitoloNew?: string | null, articoloNew?: string | null, ntit?: string | null, annoRiferimento?: string | null, assestato?: string | null, impegnato?: string | null, accertato?: string | null, prenotato?: string | null, codCapitolo?: string | null, descrizioneArticolo?: string | null, nmis?: string | null, nprog?: string | null, ntipmac?: string | null, cdr?: string | null, cdrNew?: string | null, cdcVero?: string | null, ncateg?: string | null, ncontof?: string | null, ncontofinanziario?: string | null, nmissione?: string | null, nprogramma?: string | null, ndesctit?: string | null, ndesctipmac?: string | null, descCdr?: string | null, descCdc?: string | null, ndesccateg?: string | null, vincolato?: string | null, numeroVincolo?: string | null } | null> | null };

export type GetDefaultDetermineQueryVariables = Exact<{
  tipoDetermina?: InputMaybe<TipoDetermina>;
}>;


export type GetDefaultDetermineQuery = { __typename?: 'Query', defaultDetermine?: Array<{ __typename?: 'DefaultDetermina', id?: any | null, nomeCampo?: string | null, valore?: string | null, tipoDetermina?: TipoDetermina | null } | null> | null };

export type GetDefaultListeQueryVariables = Exact<{
  cdr?: InputMaybe<Scalars['String']>;
  tipoLista?: InputMaybe<TipoLista>;
}>;


export type GetDefaultListeQuery = { __typename?: 'Query', defaultListe?: Array<{ __typename?: 'DefaultListe', id?: any | null, nomeCampo?: string | null, tipoLista?: TipoLista | null, cdr?: string | null, descrizione?: string | null, attivo?: boolean | null } | null> | null };

export type GetDeterminaAnacQueryVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type GetDeterminaAnacQuery = { __typename?: 'Query', determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null } | null };

export type GetDeterminaAttivitaQueryVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type GetDeterminaAttivitaQuery = { __typename?: 'Query', determina?: { __typename?: 'Determina', attivita_pendente?: { __typename?: 'AttivitaPendenteDTO', id?: string | null } | null } | null };

export type GetDeterminaDetailsQueryVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type GetDeterminaDetailsQuery = { __typename?: 'Query', determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, documentoPrincipale?: { __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null, documentoOscurato?: { __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null, attivita_pendente?: { __typename?: 'AttivitaPendenteDTO', id?: string | null, name?: string | null, referenceName?: string | null, userEnabled: boolean, dataPresaInCaricoString?: string | null, stato?: string | null, presaInCaricoDa?: string | null } | null, listaAttivita?: Array<{ __typename?: 'Attivita', id?: any | null, bpmnProcessTaskId?: string | null, name?: string | null, referenceName?: string | null, presaInCaricoDa?: string | null, statoAttivita?: StatoAttivita | null, stato?: string | null, tipoAttivita?: TipoAttivita | null, dataInserimento?: any | null, dataInserimentoString?: string | null, dataPresaInCarico?: any | null, dataPresaInCaricoString?: string | null, dataCompletamento?: any | null, dataCompletamentoString?: string | null, revisione?: boolean | null, statoDetermina?: StatoDetermina | null, statoRevisione?: string | null, statoDet?: string | null, userEnabled: boolean, nota?: { __typename?: 'Nota', id?: any | null, testo?: string | null } | null } | null> | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null } | null };

export type GetDeterminaGppQueryVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type GetDeterminaGppQuery = { __typename?: 'Query', determine_form_gpp_by_determina_id?: { __typename?: 'DeterminaFormGpp', totaleGpp?: any | null } | null, determina?: { __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, formGpp?: { __typename?: 'FormGpp', id?: any | null, determina_id?: any | null, totale?: any | null, totaleGpp?: any | null, completato?: boolean | null, categorie?: Array<{ __typename?: 'GppCategoria', id?: any | null, macro_categoria?: string | null, categoria?: string | null, quantita?: number | null, quantita_gpp?: number | null, totale?: any | null, anno?: number | null, descrizione?: string | null } | null> | null } | null } | null };

export type GetDetermineQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<SortInputInput>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  statoDetermina?: InputMaybe<Array<InputMaybe<StatoDetermina>> | InputMaybe<StatoDetermina>>;
  tipoDetermina?: InputMaybe<Array<InputMaybe<TipoDetermina>> | InputMaybe<TipoDetermina>>;
  annoProposta?: InputMaybe<Scalars['Int']>;
  preferite?: InputMaybe<Scalars['Boolean']>;
}>;


export type GetDetermineQuery = { __typename?: 'Query', determine_paginato: number, determine?: Array<{ __typename?: 'Determina', id?: any | null, cdr?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazioneString?: string | null, preferita: boolean } | null> | null };

export type GetDetermineAvanzatoQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<SortInputInput>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  data_creazione_da?: InputMaybe<Scalars['String']>;
  data_creazione_a?: InputMaybe<Scalars['String']>;
  data_esecutiva_da?: InputMaybe<Scalars['String']>;
  data_esecutiva_a?: InputMaybe<Scalars['String']>;
  protocollo?: InputMaybe<Scalars['String']>;
  cia?: InputMaybe<Scalars['String']>;
  cig?: InputMaybe<Scalars['String']>;
  cup?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  tipoFinanziamento?: InputMaybe<Scalars['String']>;
  dipositivo?: InputMaybe<Scalars['String']>;
  creatoreDetermina?: InputMaybe<Scalars['String']>;
  responsabileProcedimento?: InputMaybe<Scalars['String']>;
  statoDetermina?: InputMaybe<StatoDetermina>;
  tipoDetermina?: InputMaybe<TipoDetermina>;
  numProposta?: InputMaybe<Scalars['String']>;
  annoProposta?: InputMaybe<Scalars['Int']>;
  ruDetermina?: InputMaybe<Scalars['String']>;
  annoDetermina?: InputMaybe<Scalars['Int']>;
  idDetermina?: InputMaybe<Scalars['Int']>;
  preferite?: InputMaybe<Scalars['Boolean']>;
}>;


export type GetDetermineAvanzatoQuery = { __typename?: 'Query', determine_avanzato_paginato: number, determine_avanzato?: Array<{ __typename?: 'Determina', id?: any | null, cdr?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazioneString?: string | null, preferita: boolean } | null> | null };

export type GetDisponibilitaCapitoloQueryVariables = Exact<{
  capitolo?: InputMaybe<Scalars['Int']>;
  titolo?: InputMaybe<Scalars['Int']>;
  articolo?: InputMaybe<Scalars['Int']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  entrata?: InputMaybe<Scalars['Boolean']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  impegnato?: InputMaybe<Scalars['BigDecimal']>;
  accertato?: InputMaybe<Scalars['BigDecimal']>;
  prenotato?: InputMaybe<Scalars['BigDecimal']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
}>;


export type GetDisponibilitaCapitoloQuery = { __typename?: 'Query', check_capitolo?: { __typename?: 'CheckDisponibilitaDTO', disponibilitaContabilita?: any | null, disponibilitaEffettiva?: any | null, totaleImpegnatoAccertato?: any | null, determine?: Array<{ __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null } | null> | null } | null };

export type GetDisponibilitaPrenotazioneQueryVariables = Exact<{
  numPrenotazione?: InputMaybe<Scalars['Int']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  variazioni?: InputMaybe<Scalars['BigDecimal']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
}>;


export type GetDisponibilitaPrenotazioneQuery = { __typename?: 'Query', check_prenotazione?: { __typename?: 'CheckDisponibilitaDTO', disponibilitaContabilita?: any | null, disponibilitaEffettiva?: any | null, totaleImpegnatoAccertato?: any | null, determine?: Array<{ __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null } | null> | null } | null };

export type GetDisponibilitaSubAccertamentoQueryVariables = Exact<{
  numAccertamento?: InputMaybe<Scalars['Int']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
}>;


export type GetDisponibilitaSubAccertamentoQuery = { __typename?: 'Query', check_subaccertamento?: { __typename?: 'CheckDisponibilitaDTO', disponibilitaContabilita?: any | null, disponibilitaEffettiva?: any | null, totaleImpegnatoAccertato?: any | null, determine?: Array<{ __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null } | null> | null } | null };

export type GetDisponibilitaSubImpegnoQueryVariables = Exact<{
  numImpegno?: InputMaybe<Scalars['Int']>;
  assestato?: InputMaybe<Scalars['BigDecimal']>;
  liquidato?: InputMaybe<Scalars['BigDecimal']>;
  annoCompetenza?: InputMaybe<Scalars['String']>;
  determinaId?: InputMaybe<Scalars['BigInteger']>;
}>;


export type GetDisponibilitaSubImpegnoQuery = { __typename?: 'Query', check_subimpegno?: { __typename?: 'CheckDisponibilitaDTO', disponibilitaContabilita?: any | null, disponibilitaEffettiva?: any | null, totaleImpegnatoAccertato?: any | null, determine?: Array<{ __typename?: 'Determina', id?: any | null, cdr?: string | null, cdrCode?: string | null, numProposta?: string | null, annoDetermina?: number | null, ruDetermina?: string | null, annoProposta?: number | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, oggetto?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, responsabileIstruttoria?: string | null, responsabileProcedimento?: string | null, dataCreazione?: any | null, dataCreazioneString?: string | null, skipResponsabileProcedimento?: boolean | null, vistoDipartimentale?: boolean | null, anac?: boolean | null, gpp?: boolean | null, tipoAffidamento?: string | null, email?: string | null, vistiDiLegge?: string | null, premesso?: string | null, motivazione?: string | null, preseDatto?: string | null, dispositivo?: string | null, modLiquidazione?: string | null, redattore?: string | null, faseDetermina?: FaseDetermina | null, template_type?: TemplateDeterminaType | null, preferita: boolean, ato2?: boolean | null, numProtocollo?: string | null, numeroRepertorio?: string | null, dataProtocollazione?: any | null, dataProtocollazioneString?: string | null, dataInizioPubblicazione?: any | null, dataInizioPubblicazioneString?: string | null, dataFinePubblicazione?: any | null, dataFinePubblicazioneString?: string | null, riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null, documenti?: Array<{ __typename?: 'Documento', id?: any | null, principale?: boolean | null, oscurato?: boolean | null, inPubblicazione?: boolean | null, nonInPubblicazione?: boolean | null, url?: string | null, metaType?: string | null } | null> | null, validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null, attribuzioniOrizzontali?: { __typename?: 'AttribuzioniOrizzontali', id?: any | null, controlloPosizione?: boolean | null, peg?: boolean | null, controlloFiscale?: boolean | null, controlloPartecipate?: boolean | null, controlloPatrimonio?: boolean | null, controlloMutuo?: boolean | null, controlloBilancio?: boolean | null, controlloPianoOpere?: boolean | null, controlloBeniServizi?: boolean | null } | null, note?: Array<{ __typename?: 'Nota', id?: any | null, testo?: string | null, mittente?: string | null, richiestaRevisione?: boolean | null, dataCreazione?: any | null, dataCreazioneString?: string | null, attivita?: { __typename?: 'Attivita', referenceName?: string | null } | null } | null> | null } | null> | null } | null };

export type GetFasciaControlloQueryVariables = Exact<{
  filter?: InputMaybe<FasciaDiControlloFilter>;
}>;


export type GetFasciaControlloQuery = { __typename?: 'Query', fascia_di_controllo_lista?: Array<{ __typename?: 'FasciaDiControllo', id?: any | null, tipoDetermina?: TipoDetermina | null, da?: any | null, daString?: string | null, a?: any | null, aString?: string | null } | null> | null };

export type GetGppQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<SortInputInput>;
  gppStateFiler?: InputMaybe<StateFiler>;
  macro_categoria?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  categoria?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  da?: InputMaybe<Scalars['String']>;
  a?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type GetGppQuery = { __typename?: 'Query', lista_determine_form_gpp_paginato: number, lista_determine_form_gpp?: Array<{ __typename?: 'DeterminaFormGpp', determina_id?: any | null, numProposta?: string | null, annoProposta?: string | null, ruDetermina?: string | null, annoDetermina?: string | null, oggettoDetermina?: string | null, statoDetermina?: StatoDetermina | null, stato?: string | null, tipoDetermina?: TipoDetermina | null, tipo?: string | null, cdr?: string | null, statoGpp?: string | null, formGpp?: { __typename?: 'FormGpp', totale?: any | null } | null } | null> | null };

export type GetImpegniQueryVariables = Exact<{
  annoImpegno?: InputMaybe<Scalars['String']>;
  numImpegno?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  tipoMovimento?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
}>;


export type GetImpegniQuery = { __typename?: 'Query', impegno_accertamento_pages: number, impegno_accertamento?: Array<{ __typename?: 'RecordImpAccert', capNew?: string | null, artNew?: string | null, ntit?: string | null, annoRiferimento?: string | null, anno?: string | null, num?: string | null, impAss?: string | null, impLiq?: string | null, cap?: string | null, descr?: string | null, nmis?: string | null, nprog?: string | null, ntipmac?: string | null, cdr?: string | null, cdrNew?: string | null, cdrVeroNew?: string | null, ncateg?: string | null, nContof?: string | null, nContofinanziario?: string | null, nMissione?: string | null, nProgramma?: string | null, nDesctit?: string | null, nDesctipmac?: string | null, descCdr?: string | null, descCdc?: string | null, nDesccateg?: string | null, es?: string | null, tipo?: string | null, sub?: string | null, codForn?: string | null, codCig?: string | null } | null> | null };

export type GetMovimentiAttivitaDetailsQueryVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']>;
  determinaId: Scalars['BigInteger'];
}>;


export type GetMovimentiAttivitaDetailsQuery = { __typename?: 'Query', singola_attivita_uuid?: { __typename?: 'Attivita', determina?: { __typename?: 'Determina', riferimentiContabili?: { __typename?: 'RiferimentiContabili', id?: any | null, cia?: string | null, cca?: string | null, tipoFinanziamento?: string | null, totImporto?: number | null, ultimaValidazione?: any | null, ultimaValidazioneString?: string | null, capitoli?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, prenotazioni?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null, impegniAccertamenti?: Array<{ __typename?: 'Movimento', id?: any | null, annoCompetenza?: string | null, articolo?: number | null, assestato?: any | null, capitolo?: number | null, capitoloStorico?: string | null, disponibilita?: any | null, importo?: any | null, numeroImpegno?: number | null, titolo?: number | null, tipologia?: string | null, metaType?: string | null, missione?: string | null, programma?: string | null, macroAggregato?: string | null, cdr?: string | null, cdrCode?: string | null, cdc?: string | null, categoria?: string | null, contoF?: string | null, contoFinanziario?: string | null, missioneDescr?: string | null, programmaDescr?: string | null, titoloDescr?: string | null, macroaggregatoDescr?: string | null, articoloDescr?: string | null, cdrDescr?: string | null, cdcDscr?: string | null, tipologiaDescr?: string | null, categoriaDescr?: string | null, tipo?: string | null, validato?: boolean | null, motivazione?: string | null, prenotato?: any | null, sub?: number | null, impegnoData?: { __typename?: 'Impegno', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numPrenotazioneSIBAssociata?: number | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, prenotazioneData?: { __typename?: 'Prenotazione', impegnato?: any | null, prenotato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, impIniz?: any | null, impVar?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numeroImpegno?: number | null } | null, accertamentoData?: { __typename?: 'Accertamento', accertato?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, disponibilita?: any | null, disponibilitaStorni?: any | null, numAccertamento?: number | null, prenotato?: any | null } | null, subImpegnoData?: { __typename?: 'SubImpegno', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numeroImpegno?: number | null, numSubImpegno?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, subAccertamentoData?: { __typename?: 'SubAccertamento', disponibilita?: any | null, disponibilitaStorni?: any | null, liquidato?: any | null, numAccertamento?: number | null, numSubAccertamento?: number | null, vincolato?: boolean | null, numeroVincolo?: string | null } | null, reimputazioneData?: { __typename?: 'Reimputazione', liquidato?: any | null, disponibilita?: any | null, disponibilitaStorni?: any | null, vincolato?: boolean | null, numeroVincolo?: string | null, numeroImpegno?: number | null } | null, subRows?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null } | null> | null } | null } | null } | null };

export type GetPrenotazioniQueryVariables = Exact<{
  annoPrenotazione?: InputMaybe<Scalars['String']>;
  numeroPrenotazione?: InputMaybe<Scalars['String']>;
  titolo?: InputMaybe<Scalars['String']>;
  capitolo?: InputMaybe<Scalars['String']>;
  articolo?: InputMaybe<Scalars['String']>;
  capitoloStorico?: InputMaybe<Scalars['String']>;
  numeroVincolo?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
}>;


export type GetPrenotazioniQuery = { __typename?: 'Query', prenotazione_pages: number, prenotazione_sib?: Array<{ __typename?: 'RecordPrenotImpegno', capNew?: string | null, artNew?: string | null, nTit?: string | null, annoRiferimento?: string | null, anno?: string | null, num?: string | null, impAss?: string | null, cap?: string | null, descr?: string | null, nMis?: string | null, nProg?: string | null, nTipmac?: string | null, cdr?: string | null, cdrNew?: string | null, cdrVeroNew?: string | null, nCateg?: string | null, nContof?: string | null, nContofinanziario?: string | null, nMissione?: string | null, nProgramma?: string | null, nDesctit?: string | null, nDesctipmac?: string | null, descCdr?: string | null, descCdc?: string | null, nDesccateg?: string | null, impIniz?: string | null, impVar?: string | null } | null> | null };

export type GetSoggettiQueryVariables = Exact<{
  nominativo?: InputMaybe<Scalars['String']>;
  codice?: InputMaybe<Scalars['String']>;
  codiceFiscale?: InputMaybe<Scalars['String']>;
  partitaIVA?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  size?: InputMaybe<Scalars['Int']>;
}>;


export type GetSoggettiQuery = { __typename?: 'Query', soggetto_sib_pages: number, soggetto_sib?: Array<{ __typename?: 'RecordSoggetto', nominativo?: string | null, partitaiva?: string | null, codicefiscale?: string | null, comune?: string | null, indirizzo?: string | null, cap?: string | null, codSubject?: string | null } | null> | null };

export type GetSoggettiDeterminaQueryVariables = Exact<{
  determinaId?: InputMaybe<Scalars['BigInteger']>;
}>;


export type GetSoggettiDeterminaQuery = { __typename?: 'Query', soggetti_per_determina?: Array<{ __typename?: 'Soggetto', id?: any | null, movimento_id?: any | null, nominativo?: string | null, importo?: any | null, cig?: string | null, motivoEsclusioneCig?: string | null, cup?: string | null, codObiettivo?: string | null, piva?: string | null, codiceFiscale?: string | null, indirizzo?: string | null, cap?: string | null, comune?: string | null, codice?: string | null, origin?: string | null, numImpegnoSib?: number | null, numPrenotazioneSib?: number | null, numAccertamentoSib?: number | null, numSubImpegnoSib?: number | null, numSubAccertamentoSib?: number | null, numReimputazioneSib?: number | null, proprietaOffuscate?: Array<{ __typename?: 'ProprietaOffuscata', id?: any | null, campo?: ProprietaOffuscataCampo | null, offuscamento?: string | null, offuscata?: boolean | null } | null> | null } | null> | null };

export type GetTipoDeterminaQueryVariables = Exact<{
  cdrCode?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Scalars['String']>;
}>;


export type GetTipoDeterminaQuery = { __typename?: 'Query', tipo_determina?: Array<TipoDetermina | null> | null };

export type GetValidazioneTabQueryVariables = Exact<{
  determina_id: Scalars['BigInteger'];
}>;


export type GetValidazioneTabQuery = { __typename?: 'Query', determina?: { __typename?: 'Determina', validazione?: { __typename?: 'ValidazioneTabDTO', determinaValida: boolean, frontespizioPremessa: boolean, riferimentiContabili: boolean, sezioneDispositivo: boolean } | null } | null };

export const AnacFragmentDoc = `
    fragment anac on DeterminaFormAnac {
  determina_id
  cig
  numProposta
  annoProposta
  ruDetermina
  annoDetermina
  oggettoDetermina
  statoDetermina
  stato
  tipoDetermina
  tipo
  cdr
  statoAnac
}
    `;
export const Anac_InvitatoFragmentDoc = `
    fragment anac_invitato on InvitatoAnac {
  id
  form_anac_id
  aggiudicatario
  ragione_sociale
  codice_fiscale
  identificativoFiscaleEstero
}
    `;
export const Anac_Gruppo_InvitatoFragmentDoc = `
    fragment anac_gruppo_invitato on GruppoInvitatoAnac {
  id
  form_anac_id
  aggiudicatario
  ragione_sociale
  codice_fiscale
  identificativoFiscaleEstero
  ruolo
}
    `;
export const Anac_FormFragmentDoc = `
    fragment anac_form on FormAnac {
  id
  cig
  determina_id
  completato
  oggetto_bando
  nome_struttura_preponente
  codice_struttura_preponente
  procesura_scelta
  importo_aggiudicazione
  importo_somme_liquidate
  tempo_completamento_servizio_da
  tempo_completamento_servizio_a
  invitati {
    ...anac_invitato
  }
  gruppiInvitati {
    ...anac_gruppo_invitato
  }
}
    ${Anac_InvitatoFragmentDoc}
${Anac_Gruppo_InvitatoFragmentDoc}`;
export const Attivita_BaseFragmentDoc = `
    fragment attivita_base on Attivita {
  id
  bpmnProcessTaskId
  name
  referenceName
  presaInCaricoDa
  statoAttivita
  stato
  tipoAttivita
  dataInserimento
  dataInserimentoString
  dataPresaInCarico
  dataPresaInCaricoString
  dataCompletamento
  dataCompletamentoString
  revisione
  statoDetermina
  statoRevisione
  statoDet
  userEnabled
}
    `;
export const Determina_BaseFragmentDoc = `
    fragment determina_base on Determina {
  id
  cdr
  cdrCode
  numProposta
  annoDetermina
  ruDetermina
  annoProposta
  tipoDetermina
  tipo
  oggetto
  statoDetermina
  stato
  responsabileIstruttoria
  responsabileProcedimento
  dataCreazione
  dataCreazioneString
  skipResponsabileProcedimento
  vistoDipartimentale
  anac
  gpp
  tipoAffidamento
  email
  vistiDiLegge
  premesso
  motivazione
  preseDatto
  dispositivo
  modLiquidazione
  redattore
  faseDetermina
  template_type
  preferita
  ato2
  numProtocollo
  numeroRepertorio
  dataProtocollazione
  dataProtocollazioneString
  dataInizioPubblicazione
  dataInizioPubblicazioneString
  dataFinePubblicazione
  dataFinePubblicazioneString
}
    `;
export const Movimento_ImpegnoFragmentDoc = `
    fragment movimento_impegno on Impegno {
  impegnato
  prenotato
  vincolato
  numeroVincolo
  numPrenotazioneSIBAssociata
  impIniz
  impVar
  disponibilita
  disponibilitaStorni
  numeroImpegno
}
    `;
export const Movimento_PrenotazioneFragmentDoc = `
    fragment movimento_prenotazione on Prenotazione {
  impegnato
  prenotato
  vincolato
  numeroVincolo
  impIniz
  impVar
  disponibilita
  disponibilitaStorni
  numeroImpegno
}
    `;
export const Movimento_AccertamentoFragmentDoc = `
    fragment movimento_accertamento on Accertamento {
  accertato
  vincolato
  numeroVincolo
  disponibilita
  disponibilitaStorni
  numAccertamento
  prenotato
}
    `;
export const Movimento_Sub_ImpegnoFragmentDoc = `
    fragment movimento_sub_impegno on SubImpegno {
  disponibilita
  disponibilitaStorni
  liquidato
  numeroImpegno
  numSubImpegno
  vincolato
  numeroVincolo
}
    `;
export const Movimento_Sub_AccertamentoFragmentDoc = `
    fragment movimento_sub_accertamento on SubAccertamento {
  disponibilita
  disponibilitaStorni
  liquidato
  numAccertamento
  numSubAccertamento
  vincolato
  numeroVincolo
}
    `;
export const Movimento_ReimputazioneFragmentDoc = `
    fragment movimento_reimputazione on Reimputazione {
  liquidato
  disponibilita
  disponibilitaStorni
  vincolato
  numeroVincolo
  numeroImpegno
}
    `;
export const Proprieta_Offuscata_SoggettoFragmentDoc = `
    fragment proprieta_offuscata_soggetto on ProprietaOffuscata {
  id
  campo
  offuscamento
  offuscata
}
    `;
export const Movimento_SoggettoFragmentDoc = `
    fragment movimento_soggetto on Soggetto {
  id
  movimento_id
  nominativo
  importo
  cig
  motivoEsclusioneCig
  cup
  codObiettivo
  piva
  codiceFiscale
  indirizzo
  cap
  comune
  codice
  origin
  numImpegnoSib
  numPrenotazioneSib
  numAccertamentoSib
  numSubImpegnoSib
  numSubAccertamentoSib
  numReimputazioneSib
  proprietaOffuscate {
    ...proprieta_offuscata_soggetto
  }
}
    ${Proprieta_Offuscata_SoggettoFragmentDoc}`;
export const MovimentoFragmentDoc = `
    fragment movimento on Movimento {
  id
  annoCompetenza
  articolo
  assestato
  capitolo
  capitoloStorico
  disponibilita
  importo
  numeroImpegno
  titolo
  tipologia
  metaType
  missione
  programma
  macroAggregato
  cdr
  cdrCode
  cdc
  categoria
  contoF
  contoFinanziario
  missioneDescr
  programmaDescr
  titoloDescr
  macroaggregatoDescr
  articoloDescr
  cdrDescr
  cdcDscr
  tipologiaDescr
  categoriaDescr
  tipo
  validato
  motivazione
  prenotato
  sub
  impegnoData {
    ...movimento_impegno
  }
  prenotazioneData {
    ...movimento_prenotazione
  }
  accertamentoData {
    ...movimento_accertamento
  }
  subImpegnoData {
    ...movimento_sub_impegno
  }
  subAccertamentoData {
    ...movimento_sub_accertamento
  }
  reimputazioneData {
    ...movimento_reimputazione
  }
  subRows: soggetti {
    ...movimento_soggetto
  }
}
    ${Movimento_ImpegnoFragmentDoc}
${Movimento_PrenotazioneFragmentDoc}
${Movimento_AccertamentoFragmentDoc}
${Movimento_Sub_ImpegnoFragmentDoc}
${Movimento_Sub_AccertamentoFragmentDoc}
${Movimento_ReimputazioneFragmentDoc}
${Movimento_SoggettoFragmentDoc}`;
export const Riferimenti_ContabiliFragmentDoc = `
    fragment riferimenti_contabili on RiferimentiContabili {
  id
  cia
  cca
  tipoFinanziamento
  totImporto
  ultimaValidazione
  ultimaValidazioneString
  capitoli {
    ...movimento
  }
  prenotazioni {
    ...movimento
  }
  impegniAccertamenti {
    ...movimento
  }
}
    ${MovimentoFragmentDoc}`;
export const DocumentoFragmentDoc = `
    fragment documento on Documento {
  id
  principale
  oscurato
  inPubblicazione
  nonInPubblicazione
  url
  metaType
}
    `;
export const Validazione_Tab_DtoFragmentDoc = `
    fragment validazione_tab_dto on ValidazioneTabDTO {
  determinaValida
  frontespizioPremessa
  riferimentiContabili
  sezioneDispositivo
}
    `;
export const Proprieta_OffuscataFragmentDoc = `
    fragment proprieta_offuscata on ProprietaOffuscata {
  id
  campo
  offuscamento
  offuscata
}
    `;
export const Attribuzioni_OrizzontaliFragmentDoc = `
    fragment attribuzioni_orizzontali on AttribuzioniOrizzontali {
  id
  controlloPosizione
  peg
  controlloFiscale
  controlloPartecipate
  controlloPatrimonio
  controlloMutuo
  controlloBilancio
  controlloPianoOpere
  controlloBeniServizi
}
    `;
export const Nota_DeterminaFragmentDoc = `
    fragment nota_determina on Nota {
  id
  testo
  mittente
  richiestaRevisione
  dataCreazione
  dataCreazioneString
  attivita {
    referenceName
  }
}
    `;
export const DeterminaFragmentDoc = `
    fragment determina on Determina {
  ...determina_base
  riferimentiContabili {
    ...riferimenti_contabili
  }
  documenti {
    ...documento
  }
  validazione {
    ...validazione_tab_dto
  }
  proprietaOffuscate {
    ...proprieta_offuscata
  }
  attribuzioniOrizzontali {
    ...attribuzioni_orizzontali
  }
  note {
    ...nota_determina
  }
}
    ${Determina_BaseFragmentDoc}
${Riferimenti_ContabiliFragmentDoc}
${DocumentoFragmentDoc}
${Validazione_Tab_DtoFragmentDoc}
${Proprieta_OffuscataFragmentDoc}
${Attribuzioni_OrizzontaliFragmentDoc}
${Nota_DeterminaFragmentDoc}`;
export const AttivitaFragmentDoc = `
    fragment attivita on Attivita {
  ...attivita_base
  determina {
    ...determina
  }
}
    ${Attivita_BaseFragmentDoc}
${DeterminaFragmentDoc}`;
export const Attivita_LightFragmentDoc = `
    fragment attivita_light on Attivita {
  id
  bpmnProcessTaskId
  referenceName
  stato
  dataPresaInCaricoString
  determina {
    id
    cdr
    numProposta
    annoProposta
    ruDetermina
    annoDetermina
    oggetto
    stato
    tipo
    dataCreazioneString
  }
}
    `;
export const CapitoloFragmentDoc = `
    fragment capitolo on RecordCapitolo {
  eS
  codCapitoloNew
  articoloNew
  ntit
  annoRiferimento
  assestato
  impegnato
  accertato
  prenotato
  codCapitolo
  descrizioneArticolo
  nmis
  nprog
  ntipmac
  cdr
  cdrNew
  cdcVero
  ncateg
  ncontof
  ncontofinanziario
  nmissione
  nprogramma
  ndesctit
  ndesctipmac
  descCdr
  descCdc
  ndesccateg
  vincolato
  numeroVincolo
}
    `;
export const Default_DeterminaFragmentDoc = `
    fragment default_determina on DefaultDetermina {
  id
  nomeCampo
  valore
  tipoDetermina
}
    `;
export const Default_ListeFragmentDoc = `
    fragment default_liste on DefaultListe {
  id
  nomeCampo
  tipoLista
  cdr
  descrizione
  attivo
}
    `;
export const Determina_ListaFragmentDoc = `
    fragment determina_lista on Determina {
  id
  cdr
  numProposta
  annoDetermina
  ruDetermina
  annoProposta
  tipoDetermina
  tipo
  oggetto
  statoDetermina
  stato
  responsabileIstruttoria
  responsabileProcedimento
  dataCreazioneString
  preferita
}
    `;
export const Determina_AnacFragmentDoc = `
    fragment determina_anac on Determina {
  ...determina_base
}
    ${Determina_BaseFragmentDoc}`;
export const Attivita_Pendente_DtoFragmentDoc = `
    fragment attivita_pendente_dto on AttivitaPendenteDTO {
  id
  name
  referenceName
  userEnabled
  dataPresaInCaricoString
  stato
  presaInCaricoDa
}
    `;
export const NotaFragmentDoc = `
    fragment nota on Nota {
  id
  testo
}
    `;
export const Attivita_NotaFragmentDoc = `
    fragment attivita_nota on Attivita {
  ...attivita_base
  nota {
    ...nota
  }
}
    ${Attivita_BaseFragmentDoc}
${NotaFragmentDoc}`;
export const Determina_DetailFragmentDoc = `
    fragment determina_detail on Determina {
  ...determina_base
  documentoPrincipale {
    ...documento
  }
  documentoOscurato {
    ...documento
  }
  attivita_pendente {
    ...attivita_pendente_dto
  }
  listaAttivita {
    ...attivita_nota
  }
  riferimentiContabili {
    ...riferimenti_contabili
  }
  note {
    ...nota_determina
  }
  documenti {
    ...documento
  }
}
    ${Determina_BaseFragmentDoc}
${DocumentoFragmentDoc}
${Attivita_Pendente_DtoFragmentDoc}
${Attivita_NotaFragmentDoc}
${Riferimenti_ContabiliFragmentDoc}
${Nota_DeterminaFragmentDoc}`;
export const Gpp_CategoriaFragmentDoc = `
    fragment gpp_categoria on GppCategoria {
  id
  macro_categoria
  categoria
  quantita
  quantita_gpp
  totale
  anno
  descrizione
}
    `;
export const Gpp_FormFragmentDoc = `
    fragment gpp_form on FormGpp {
  id
  determina_id
  totale
  totaleGpp
  completato
  categorie {
    ...gpp_categoria
  }
}
    ${Gpp_CategoriaFragmentDoc}`;
export const Determina_GppFragmentDoc = `
    fragment determina_gpp on Determina {
  ...determina_base
  formGpp {
    ...gpp_form
  }
}
    ${Determina_BaseFragmentDoc}
${Gpp_FormFragmentDoc}`;
export const Disponibilita_DtoFragmentDoc = `
    fragment disponibilita_dto on CheckDisponibilitaDTO {
  disponibilitaContabilita
  disponibilitaEffettiva
  totaleImpegnatoAccertato
  determine {
    ...determina
  }
}
    ${DeterminaFragmentDoc}`;
export const Fascia_ControlloFragmentDoc = `
    fragment fascia_controllo on FasciaDiControllo {
  id
  tipoDetermina
  da
  daString
  a
  aString
}
    `;
export const GppFragmentDoc = `
    fragment gpp on DeterminaFormGpp {
  determina_id
  numProposta
  annoProposta
  ruDetermina
  annoDetermina
  oggettoDetermina
  statoDetermina
  stato
  tipoDetermina
  tipo
  cdr
  statoGpp
  formGpp {
    totale
  }
}
    `;
export const ImpegnoFragmentDoc = `
    fragment impegno on RecordImpAccert {
  capNew
  artNew
  ntit
  annoRiferimento
  anno
  num
  impAss
  impLiq
  cap
  descr
  nmis
  nprog
  ntipmac
  cdr
  cdrNew
  cdrVeroNew
  ncateg
  nContof
  nContofinanziario
  nMissione
  nProgramma
  nDesctit
  nDesctipmac
  descCdr
  descCdc
  nDesccateg
  es
  tipo
  sub
  codForn
  codCig
}
    `;
export const PrenotazioneFragmentDoc = `
    fragment prenotazione on RecordPrenotImpegno {
  capNew
  artNew
  nTit
  annoRiferimento
  anno
  num
  impAss
  cap
  descr
  nMis
  nProg
  nTipmac
  cdr
  cdrNew
  cdrVeroNew
  nCateg
  nContof
  nContofinanziario
  nMissione
  nProgramma
  nDesctit
  nDesctipmac
  descCdr
  descCdc
  nDesccateg
  impIniz
  impVar
}
    `;
export const Sid_ProcessFragmentDoc = `
    fragment sid_process on SidProcessGraphqlDTO {
  bpmnProcessTaskId
  referenceName
  stato: statoAttivita
  determina {
    id
    cdr
    numProposta
    annoProposta
    ruDetermina
    annoDetermina
    oggetto
    stato
    tipo
    dataCreazioneString
  }
}
    `;
export const SoggettoFragmentDoc = `
    fragment soggetto on RecordSoggetto {
  nominativo
  partitaiva
  codicefiscale
  comune
  indirizzo
  cap
  codSubject
}
    `;
export const Validazione_DtoFragmentDoc = `
    fragment validazione_dto on ValidazioneDTO {
  movimentoId
  motivazione
  valido
}
    `;
export const SaveAccertamentoDocument = `
    mutation saveAccertamento($data: AccertamentoInputInput) {
  salvaAccertamento(data: $data) {
    id
    subRows: soggetti {
      ...movimento_soggetto
    }
  }
}
    ${Movimento_SoggettoFragmentDoc}`;
export const UpdateAccertamentoDocument = `
    mutation updateAccertamento($id: BigInteger, $data: AccertamentoInputInput) {
  aggiornaAccertamento(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveAnacFormDocument = `
    mutation saveAnacForm($data: FormAnacInputInput) {
  salvaFormAnac(data: $data) {
    id
  }
}
    `;
export const UpdateAnacFormDocument = `
    mutation updateAnacForm($id: BigInteger, $data: FormAnacInputInput) {
  aggiornaFormAnac(id: $id, data: $data) {
    id
  }
}
    `;
export const DeleteAnacGruppoInvitatoDocument = `
    mutation deleteAnacGruppoInvitato($id: BigInteger) {
  eliminaGruppoInvitatoAnac(id: $id)
}
    `;
export const SaveAnacGruppoInvitatoDocument = `
    mutation saveAnacGruppoInvitato($data: GruppoInvitatoAnacInputInput) {
  salvaGruppoInvitatoAnac(data: $data) {
    id
  }
}
    `;
export const UpdateAnacGruppoInvitatoDocument = `
    mutation updateAnacGruppoInvitato($id: BigInteger, $data: GruppoInvitatoAnacInputInput) {
  aggiornaGruppoInvitatoAnac(id: $id, data: $data) {
    id
  }
}
    `;
export const DeleteAnacInvitatoDocument = `
    mutation deleteAnacInvitato($id: BigInteger) {
  eliminaInvitatoAnac(id: $id)
}
    `;
export const SaveAnacInvitatoDocument = `
    mutation saveAnacInvitato($data: InvitatoAnacInputInput) {
  salvaInvitatoAnac(data: $data) {
    id
  }
}
    `;
export const UpdateAnacInvitatoDocument = `
    mutation updateAnacInvitato($id: BigInteger, $data: InvitatoAnacInputInput) {
  aggiornaInvitatoAnac(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveCampiDefaultDeterminaDocument = `
    mutation saveCampiDefaultDetermina($vistiDiLegge: DefaultDeterminaInputInput, $preseDatto: DefaultDeterminaInputInput) {
  vistiDiLegge: mergeDefaultDetermina(data: $vistiDiLegge) {
    id
  }
  preseDatto: mergeDefaultDetermina(data: $preseDatto) {
    id
  }
}
    `;
export const SaveCampoDefaultDeterminaDocument = `
    mutation saveCampoDefaultDetermina($data: DefaultDeterminaInputInput) {
  mergeDefaultDetermina(data: $data) {
    id
  }
}
    `;
export const CompletaAttivitaDocument = `
    mutation completaAttivita($taskName: TipoAttivita, $taskId: String, $determinaId: BigInteger, $revisione: Boolean, $nota: NotaInputInput, $avanzaStatoDetermina: Boolean, $attribuzioniOrizzontali: AttribuzioniOrizzontaliInputInput, $approvazioneBilancioInput: ApprovazioneBilancioInputInput, $remote_sign: Boolean, $firmaInput: FirmaInputInput, $omissis: Boolean, $roles: [String], $titoloScelto: Int) {
  completaAttivita(
    taskName: $taskName
    taskId: $taskId
    determinaId: $determinaId
    revisione: $revisione
    nota: $nota
    avanzaStatoDetermina: $avanzaStatoDetermina
    attribuzioniOrizzontali: $attribuzioniOrizzontali
    approvazioneBilancioInput: $approvazioneBilancioInput
    remote_sign: $remote_sign
    firmaInput: $firmaInput
    omissis: $omissis
    roles: $roles
    titoloScelto: $titoloScelto
  ) {
    id
  }
}
    `;
export const DeleteDefaultListaDocument = `
    mutation deleteDefaultLista($id: BigInteger) {
  eliminaDefaultListe(id: $id)
}
    `;
export const SaveDefaultListaDocument = `
    mutation saveDefaultLista($data: DefaultListeInputInput) {
  salvaDefaultListe(data: $data) {
    id
  }
}
    `;
export const UpdateDefaultListaDocument = `
    mutation updateDefaultLista($id: BigInteger, $data: DefaultListeInputInput) {
  aggiornaDefaultListe(id: $id, data: $data) {
    id
  }
}
    `;
export const DeleteDeterminaDocument = `
    mutation deleteDetermina($id: BigInteger, $nota: NotaInputInput) {
  annullaDetermina(id: $id, nota: $nota)
}
    `;
export const DuplicaDeterminaDocument = `
    mutation duplicaDetermina($id: BigInteger, $data: DeterminaInputInput) {
  duplicaDetermina(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveDeterminaDocument = `
    mutation saveDetermina($data: DeterminaInputInput, $fastMode: Boolean) {
  salvaDetermina(data: $data, fastMode: $fastMode) {
    id
    attivita_pendente {
      ...attivita_pendente_dto
    }
  }
}
    ${Attivita_Pendente_DtoFragmentDoc}`;
export const UpdateDeterminaDocument = `
    mutation updateDetermina($id: BigInteger, $data: DeterminaInputInput) {
  aggiornaDetermina(id: $id, data: $data) {
    ...determina_base
  }
}
    ${Determina_BaseFragmentDoc}`;
export const UpdateDeterminaPreferitaDocument = `
    mutation updateDeterminaPreferita($determina_id: BigInteger) {
  toggleDeterminaPreferita(determina_id: $determina_id) {
    id
  }
}
    `;
export const DeleteDocumentoDocument = `
    mutation deleteDocumento($id: BigInteger) {
  eliminaDocumento(id: $id)
}
    `;
export const DeleteFasceControlloDocument = `
    mutation deleteFasceControllo($idList: [BigInteger]) {
  eliminaListaFasciaDiControllo(idList: $idList)
}
    `;
export const DeleteFasciaControlloDocument = `
    mutation deleteFasciaControllo($id: BigInteger) {
  eliminaFasciaDiControllo(id: $id)
}
    `;
export const SaveFasciaControlloDocument = `
    mutation saveFasciaControllo($data: FasciaDiControlloInputInput) {
  salvaFasciaDiControllo(data: $data) {
    id
  }
}
    `;
export const UpdateFasciaControlloDocument = `
    mutation updateFasciaControllo($id: BigInteger, $data: FasciaDiControlloInputInput) {
  aggiornaFasciaDiControllo(id: $id, data: $data) {
    id
  }
}
    `;
export const DeleteFasciaControlloDefinitoDocument = `
    mutation deleteFasciaControlloDefinito($id: BigInteger) {
  eliminaDefinitivamenteFasciaDiControllo(id: $id)
}
    `;
export const FirmaMultiplaDocument = `
    mutation firmaMultipla($taskNames: [TipoAttivita]!, $taskIds: [String]!, $determineIds: [BigInteger]!, $revisione: Boolean, $avanzaStatoDetermina: Boolean, $attribuzioniOrizzontali: AttribuzioniOrizzontaliInputInput, $approvazioneBilancioInput: ApprovazioneBilancioInputInput, $remote_sign: Boolean, $firmaInput: FirmaInputInput, $omissis: Boolean, $roles: [String], $titoloScelto: Int) {
  firmaMultipla(
    taskNames: $taskNames
    taskIds: $taskIds
    determineIds: $determineIds
    revisione: $revisione
    avanzaStatoDetermina: $avanzaStatoDetermina
    attribuzioniOrizzontali: $attribuzioniOrizzontali
    approvazioneBilancioInput: $approvazioneBilancioInput
    remote_sign: $remote_sign
    firmaInput: $firmaInput
    omissis: $omissis
    roles: $roles
    titoloScelto: $titoloScelto
  ) {
    id
  }
}
    `;
export const DeleteGppCategoriaDocument = `
    mutation deleteGppCategoria($id: BigInteger) {
  eliminaGppCategoria(id: $id)
}
    `;
export const SaveGppCategoriaDocument = `
    mutation saveGppCategoria($determinaId: BigInteger, $data: GppCategoriaInputInput) {
  salvaGppCategoria(determinaId: $determinaId, data: $data) {
    id
  }
}
    `;
export const UpdateGppCategoriaDocument = `
    mutation updateGppCategoria($id: BigInteger, $data: GppCategoriaInputInput) {
  aggiornaGppCategoria(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveGppFormDocument = `
    mutation saveGppForm($data: FormGppInputInput) {
  salvaFormGpp(data: $data) {
    id
  }
}
    `;
export const UpdateGppFormDocument = `
    mutation updateGppForm($id: BigInteger, $data: FormGppInputInput) {
  aggiornaFormGpp(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveImpegnoDocument = `
    mutation saveImpegno($data: ImpegnoInputInput) {
  salvaImpegno(data: $data) {
    id
    subRows: soggetti {
      ...movimento_soggetto
    }
  }
}
    ${Movimento_SoggettoFragmentDoc}`;
export const UpdateImpegnoDocument = `
    mutation updateImpegno($id: BigInteger, $data: ImpegnoInputInput) {
  aggiornaImpegno(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveMovimentiDocument = `
    mutation saveMovimenti($data: MultiMovimentoSoggettoUpdateInput) {
  salvaMultiMovimentoSoggetto(data: $data)
}
    `;
export const SaveMovimentiStorniDocument = `
    mutation saveMovimentiStorni($data: MultiMovimentoSoggettoUpdateInput) {
  salvaMultiMovimentoSoggettoStorni(data: $data)
}
    `;
export const DeleteMovimentoDocument = `
    mutation deleteMovimento($id: BigInteger) {
  eliminaMovimento(id: $id)
}
    `;
export const UpdateMovimentoDocument = `
    mutation updateMovimento($id: BigInteger, $data: MovimentoInputInput, $tipoUscita: String) {
  aggiornaMovimento(id: $id, data: $data, tipoUscita: $tipoUscita) {
    id
  }
}
    `;
export const SaveNotaDocument = `
    mutation saveNota($data: NotaInputInput) {
  salvaNota(data: $data) {
    id
  }
}
    `;
export const SavePrenotazioneDocument = `
    mutation savePrenotazione($data: PrenotazioneInputInput) {
  salvaPrenotazione(data: $data) {
    id
    subRows: soggetti {
      ...movimento_soggetto
    }
  }
}
    ${Movimento_SoggettoFragmentDoc}`;
export const UpdatePrenotazioneDocument = `
    mutation updatePrenotazione($id: BigInteger, $data: PrenotazioneInputInput) {
  aggiornaPrenotazione(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveProprietaOffuscateDocument = `
    mutation saveProprietaOffuscate($id: BigInteger, $data: [ProprietaOffuscataMergeInputInput]) {
  salvaProprietaOffuscateDetermina(id: $id, data: $data)
}
    `;
export const SaveProprietaOffuscateSoggettoDocument = `
    mutation saveProprietaOffuscateSoggetto($id_determina: BigInteger, $proprieta_comuni: [ProprietaOffuscataCampo], $proprieta: [ProprietaOffuscataSectionInputInput]) {
  salvaMultiProprietaOffuscataSoggetto(
    id_determina: $id_determina
    proprieta_comuni: $proprieta_comuni
    proprieta: $proprieta
  )
}
    `;
export const UpdateRiferimentiContabiliDocument = `
    mutation updateRiferimentiContabili($id: BigInteger, $data: RiferimentiContabiliInputInput) {
  aggiornaRiferimentiContabili(id: $id, data: $data) {
    id
  }
}
    `;
export const UpdateRiferimentiMovimentiDocument = `
    mutation updateRiferimentiMovimenti($id: BigInteger, $riferimentiContabili: RiferimentiContabiliInputInput, $capitoli: MultiMovimentoSoggettoUpdateInput, $prenotazioni: MultiMovimentoSoggettoUpdateInput, $impegniAccertamenti: MultiMovimentoSoggettoUpdateInput) {
  aggiornaRiferimentiContabili(id: $id, data: $riferimentiContabili) {
    id
  }
  salvaCapitoli: salvaMultiMovimentoSoggetto(data: $capitoli)
  salvaPrenotazioni: salvaMultiMovimentoSoggetto(data: $prenotazioni)
  salvaImpegniAccertamenti: salvaMultiMovimentoSoggetto(
    data: $impegniAccertamenti
  )
}
    `;
export const RilasciaAttivitaDocument = `
    mutation rilasciaAttivita($taskName: TipoAttivita, $taskId: String, $determinaId: BigInteger, $roles: [String]) {
  rilasciaAttivita(
    taskName: $taskName
    taskId: $taskId
    determinaId: $determinaId
    roles: $roles
  ) {
    ...attivita_base
  }
}
    ${Attivita_BaseFragmentDoc}`;
export const RivenditaAttivitaDocument = `
    mutation rivenditaAttivita($taskName: TipoAttivita, $taskId: String, $referenceName: String, $determinaId: BigInteger, $roles: [String]) {
  rivendicaAttivita(
    taskName: $taskName
    taskId: $taskId
    referenceName: $referenceName
    determinaId: $determinaId
    roles: $roles
  ) {
    ...attivita_base
  }
}
    ${Attivita_BaseFragmentDoc}`;
export const RivendicaAttivitaMassivaDocument = `
    mutation rivendicaAttivitaMassiva($taskNames: [TipoAttivita]!, $taskIds: [String]!, $referenceNames: [String], $determineIds: [BigInteger]!, $roles: [String]) {
  rivendicaAttivitaMassiva(
    taskNames: $taskNames
    taskIds: $taskIds
    referenceNames: $referenceNames
    determineIds: $determineIds
    roles: $roles
  ) {
    ...attivita_base
  }
}
    ${Attivita_BaseFragmentDoc}`;
export const DeleteSoggettoDocument = `
    mutation deleteSoggetto($id: BigInteger) {
  eliminaSoggetto(id: $id)
}
    `;
export const SaveSoggettoDocument = `
    mutation saveSoggetto($data: SoggettoInputInput) {
  salvaSoggetto(data: $data) {
    id
  }
}
    `;
export const UpdateSoggettoDocument = `
    mutation updateSoggetto($id: BigInteger, $data: SoggettoInputInput) {
  aggiornaSoggetto(id: $id, data: $data) {
    id
  }
}
    `;
export const SaveSubAccertamentoDocument = `
    mutation saveSubAccertamento($data: SubAccertamentoInputInput) {
  salvaSubAccertamento(data: $data) {
    id
    subRows: soggetti {
      ...movimento_soggetto
    }
  }
}
    ${Movimento_SoggettoFragmentDoc}`;
export const SaveSubImpegnoDocument = `
    mutation saveSubImpegno($annoCompetenza: String, $data: SubImpegnoInputInput) {
  salvaSubImpegno(annoCompetenza: $annoCompetenza, data: $data) {
    id
    subRows: soggetti {
      ...movimento_soggetto
    }
  }
}
    ${Movimento_SoggettoFragmentDoc}`;
export const UpdateSubImpegnoDocument = `
    mutation updateSubImpegno($id: BigInteger, $data: SubImpegnoInputInput) {
  aggiornaSubImpegno(id: $id, data: $data) {
    id
  }
}
    `;
export const UpdateValidaCapitoloDocument = `
    mutation updateValidaCapitolo($determina_id: BigInteger) {
  valida_capitolo(determina_id: $determina_id) {
    ...validazione_dto
  }
}
    ${Validazione_DtoFragmentDoc}`;
export const UpdateValidaImpegnoAccertamentoDocument = `
    mutation updateValidaImpegnoAccertamento($determina_id: BigInteger) {
  valida_subImpegnoAccertamento(determina_id: $determina_id) {
    ...validazione_dto
  }
}
    ${Validazione_DtoFragmentDoc}`;
export const UpdateValidaMovimentiDocument = `
    mutation updateValidaMovimenti($determina_id: BigInteger) {
  valida_capitolo(determina_id: $determina_id) {
    ...validazione_dto
  }
  valida_prenotazione(determina_id: $determina_id) {
    ...validazione_dto
  }
  valida_subImpegnoAccertamento(determina_id: $determina_id) {
    ...validazione_dto
  }
}
    ${Validazione_DtoFragmentDoc}`;
export const UpdateValidaPrenotazioneDocument = `
    mutation updateValidaPrenotazione($determina_id: BigInteger) {
  valida_prenotazione(determina_id: $determina_id) {
    ...validazione_dto
  }
}
    ${Validazione_DtoFragmentDoc}`;
export const GetAnacDocument = `
    query getAnac($page: Int, $size: Int, $search: String, $sort: SortInputInput, $anacStateFiler: StateFiler, $cdrCode: [String]) {
  lista_determine_form_anac_paginato(
    page: $page
    size: $size
    search: $search
    sort: $sort
    anacStateFiler: $anacStateFiler
    cdrCode: $cdrCode
  )
  lista_determine_form_anac(
    page: $page
    size: $size
    search: $search
    sort: $sort
    anacStateFiler: $anacStateFiler
    cdrCode: $cdrCode
  ) {
    ...anac
  }
}
    ${AnacFragmentDoc}`;
export const GetAnacDetailsDocument = `
    query getAnacDetails($determinaId: BigInteger!, $cig: String) {
  determina_form_anac_by_cig_determinaId(determinaId: $determinaId, cig: $cig) {
    importoDiAggiudicazione
  }
  form_anac_by_cig_determinaId(determinaId: $determinaId, cig: $cig) {
    ...anac_form
  }
}
    ${Anac_FormFragmentDoc}`;
export const GetAttivitaDocument = `
    query getAttivita($page: Int, $size: Int, $search: String, $utente: String, $filtro: FiltroAttivita, $cdr: [String], $roles: [String], $statoDetermina: [StatoDetermina], $tipoDetermina: [TipoDetermina], $sort: SortInputInput = {by: "dataInserimento", desc: true}) {
  attivita_paginato(
    utente: $utente
    filtro: $filtro
    cdr: $cdr
    roles: $roles
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    search: $search
    size: $size
  )
  attivita(
    utente: $utente
    filtro: $filtro
    cdr: $cdr
    roles: $roles
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    page: $page
    size: $size
    search: $search
    sort: $sort
  ) {
    ...attivita_light
  }
}
    ${Attivita_LightFragmentDoc}`;
export const GetAttivitaDetailsDocument = `
    query getAttivitaDetails($uuid: String, $determinaId: BigInteger!) {
  singola_attivita_uuid(uuid: $uuid, determinaId: $determinaId) {
    ...attivita
  }
}
    ${AttivitaFragmentDoc}`;
export const GetAttivitaPendentiDocument = `
    query getAttivitaPendenti($page: Int, $size: Int, $search: String, $cdr: [String], $roles: [String], $statoDetermina: [StatoDetermina], $tipoDetermina: [TipoDetermina], $sort: SortInputInput = {by: "dataInserimento", desc: true}) {
  attivita_pendenti_paginato_new(
    cdr: $cdr
    roles: $roles
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    search: $search
    size: $size
  )
  attivita_pendenti_new(
    cdr: $cdr
    roles: $roles
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    page: $page
    size: $size
    search: $search
    sort: $sort
  ) {
    ...sid_process
  }
}
    ${Sid_ProcessFragmentDoc}`;
export const GetCapitoliDocument = `
    query getCapitoli($annoCompetenza: String, $annoBilancio: String, $titolo: String, $capitolo: String, $articolo: String, $capitoloVecchio: String, $vincolo: String, $cdr: String, $tipoMovimento: String, $page: Int, $size: Int) {
  capitolo_pages(
    annoCompetenza: $annoCompetenza
    annoBilancio: $annoBilancio
    titolo: $titolo
    capitolo: $capitolo
    articolo: $articolo
    capitoloVecchio: $capitoloVecchio
    vincolo: $vincolo
    cdr: $cdr
    tipoMovimento: $tipoMovimento
    size: $size
  )
  capitolo(
    annoCompetenza: $annoCompetenza
    annoBilancio: $annoBilancio
    titolo: $titolo
    capitolo: $capitolo
    articolo: $articolo
    capitoloVecchio: $capitoloVecchio
    vincolo: $vincolo
    cdr: $cdr
    tipoMovimento: $tipoMovimento
    page: $page
    size: $size
  ) {
    ...capitolo
  }
}
    ${CapitoloFragmentDoc}`;
export const GetDefaultDetermineDocument = `
    query getDefaultDetermine($tipoDetermina: TipoDetermina) {
  defaultDetermine(tipoDetermina: $tipoDetermina) {
    ...default_determina
  }
}
    ${Default_DeterminaFragmentDoc}`;
export const GetDefaultListeDocument = `
    query getDefaultListe($cdr: String, $tipoLista: TipoLista) {
  defaultListe(cdr: $cdr, tipoLista: $tipoLista) {
    ...default_liste
  }
}
    ${Default_ListeFragmentDoc}`;
export const GetDeterminaAnacDocument = `
    query getDeterminaAnac($id: BigInteger!) {
  determina(id: $id) {
    ...determina_anac
  }
}
    ${Determina_AnacFragmentDoc}`;
export const GetDeterminaAttivitaDocument = `
    query getDeterminaAttivita($id: BigInteger!) {
  determina(id: $id) {
    attivita_pendente {
      id
    }
  }
}
    `;
export const GetDeterminaDetailsDocument = `
    query getDeterminaDetails($id: BigInteger!) {
  determina(id: $id) {
    ...determina_detail
  }
}
    ${Determina_DetailFragmentDoc}`;
export const GetDeterminaGppDocument = `
    query getDeterminaGpp($id: BigInteger!) {
  determine_form_gpp_by_determina_id(determinaId: $id) {
    totaleGpp
  }
  determina(id: $id) {
    ...determina_gpp
  }
}
    ${Determina_GppFragmentDoc}`;
export const GetDetermineDocument = `
    query getDetermine($page: Int, $size: Int, $search: String, $sort: SortInputInput = {by: "datacreazione", desc: true}, $cdrCode: [String], $statoDetermina: [StatoDetermina], $tipoDetermina: [TipoDetermina], $annoProposta: Int, $preferite: Boolean) {
  determine_paginato(
    search: $search
    size: $size
    cdrCode: $cdrCode
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    annoProposta: $annoProposta
    preferite: $preferite
  )
  determine(
    page: $page
    size: $size
    search: $search
    sort: $sort
    cdrCode: $cdrCode
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    annoProposta: $annoProposta
    preferite: $preferite
  ) {
    ...determina_lista
  }
}
    ${Determina_ListaFragmentDoc}`;
export const GetDetermineAvanzatoDocument = `
    query getDetermineAvanzato($page: Int, $size: Int, $search: String, $sort: SortInputInput = {by: "datacreazione", desc: true}, $cdrCode: [String], $data_creazione_da: String, $data_creazione_a: String, $data_esecutiva_da: String, $data_esecutiva_a: String, $protocollo: String, $cia: String, $cig: String, $cup: String, $oggetto: String, $tipoFinanziamento: String, $dipositivo: String, $creatoreDetermina: String, $responsabileProcedimento: String, $statoDetermina: StatoDetermina, $tipoDetermina: TipoDetermina, $numProposta: String, $annoProposta: Int, $ruDetermina: String, $annoDetermina: Int, $idDetermina: Int, $preferite: Boolean) {
  determine_avanzato_paginato(
    search: $search
    size: $size
    cdrCode: $cdrCode
    data_creazione_da: $data_creazione_da
    data_creazione_a: $data_creazione_a
    data_esecutiva_da: $data_esecutiva_da
    data_esecutiva_a: $data_esecutiva_a
    protocollo: $protocollo
    cia: $cia
    cig: $cig
    cup: $cup
    oggetto: $oggetto
    tipoFinanziamento: $tipoFinanziamento
    dipositivo: $dipositivo
    creatoreDetermina: $creatoreDetermina
    responsabileProcedimento: $responsabileProcedimento
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    numProposta: $numProposta
    annoProposta: $annoProposta
    ruDetermina: $ruDetermina
    annoDetermina: $annoDetermina
    idDetermina: $idDetermina
    preferite: $preferite
  )
  determine_avanzato(
    page: $page
    size: $size
    search: $search
    sort: $sort
    cdrCode: $cdrCode
    data_creazione_da: $data_creazione_da
    data_creazione_a: $data_creazione_a
    data_esecutiva_da: $data_esecutiva_da
    data_esecutiva_a: $data_esecutiva_a
    protocollo: $protocollo
    cia: $cia
    cig: $cig
    cup: $cup
    oggetto: $oggetto
    tipoFinanziamento: $tipoFinanziamento
    dipositivo: $dipositivo
    creatoreDetermina: $creatoreDetermina
    responsabileProcedimento: $responsabileProcedimento
    statoDetermina: $statoDetermina
    tipoDetermina: $tipoDetermina
    numProposta: $numProposta
    annoProposta: $annoProposta
    ruDetermina: $ruDetermina
    annoDetermina: $annoDetermina
    idDetermina: $idDetermina
    preferite: $preferite
  ) {
    ...determina_lista
  }
}
    ${Determina_ListaFragmentDoc}`;
export const GetDisponibilitaCapitoloDocument = `
    query getDisponibilitaCapitolo($capitolo: Int, $titolo: Int, $articolo: Int, $annoCompetenza: String, $entrata: Boolean, $assestato: BigDecimal, $impegnato: BigDecimal, $accertato: BigDecimal, $prenotato: BigDecimal, $determinaId: BigInteger) {
  check_capitolo(
    capitolo: $capitolo
    titolo: $titolo
    articolo: $articolo
    annoCompetenza: $annoCompetenza
    entrata: $entrata
    assestato: $assestato
    impegnato: $impegnato
    accertato: $accertato
    prenotato: $prenotato
    determinaId: $determinaId
  ) {
    ...disponibilita_dto
  }
}
    ${Disponibilita_DtoFragmentDoc}`;
export const GetDisponibilitaPrenotazioneDocument = `
    query getDisponibilitaPrenotazione($numPrenotazione: Int, $assestato: BigDecimal, $variazioni: BigDecimal, $determinaId: BigInteger, $annoCompetenza: String) {
  check_prenotazione(
    numPrenotazione: $numPrenotazione
    assestato: $assestato
    variazioni: $variazioni
    determinaId: $determinaId
    annoCompetenza: $annoCompetenza
  ) {
    ...disponibilita_dto
  }
}
    ${Disponibilita_DtoFragmentDoc}`;
export const GetDisponibilitaSubAccertamentoDocument = `
    query getDisponibilitaSubAccertamento($numAccertamento: Int, $assestato: BigDecimal, $liquidato: BigDecimal, $determinaId: BigInteger) {
  check_subaccertamento(
    numAccertamento: $numAccertamento
    assestato: $assestato
    liquidato: $liquidato
    determinaId: $determinaId
  ) {
    ...disponibilita_dto
  }
}
    ${Disponibilita_DtoFragmentDoc}`;
export const GetDisponibilitaSubImpegnoDocument = `
    query getDisponibilitaSubImpegno($numImpegno: Int, $assestato: BigDecimal, $liquidato: BigDecimal, $annoCompetenza: String, $determinaId: BigInteger) {
  check_subimpegno(
    numImpegno: $numImpegno
    assestato: $assestato
    liquidato: $liquidato
    annoCompetenza: $annoCompetenza
    determinaId: $determinaId
  ) {
    ...disponibilita_dto
  }
}
    ${Disponibilita_DtoFragmentDoc}`;
export const GetFasciaControlloDocument = `
    query getFasciaControllo($filter: FasciaDiControlloFilter) {
  fascia_di_controllo_lista(filter: $filter) {
    ...fascia_controllo
  }
}
    ${Fascia_ControlloFragmentDoc}`;
export const GetGppDocument = `
    query getGpp($page: Int, $size: Int, $search: String, $sort: SortInputInput, $gppStateFiler: StateFiler, $macro_categoria: [String], $categoria: [String], $da: String, $a: String, $cdrCode: [String]) {
  lista_determine_form_gpp_paginato(
    page: $page
    size: $size
    search: $search
    sort: $sort
    gppStateFiler: $gppStateFiler
    macro_categoria: $macro_categoria
    categoria: $categoria
    da: $da
    a: $a
    cdrCode: $cdrCode
  )
  lista_determine_form_gpp(
    page: $page
    size: $size
    search: $search
    sort: $sort
    gppStateFiler: $gppStateFiler
    macro_categoria: $macro_categoria
    categoria: $categoria
    da: $da
    a: $a
    cdrCode: $cdrCode
  ) {
    ...gpp
  }
}
    ${GppFragmentDoc}`;
export const GetImpegniDocument = `
    query getImpegni($annoImpegno: String, $numImpegno: String, $titolo: String, $capitolo: String, $articolo: String, $capitoloStorico: String, $numeroVincolo: String, $cdr: String, $tipoMovimento: String, $page: Int, $size: Int) {
  impegno_accertamento_pages(
    annoImpegno: $annoImpegno
    numImpegno: $numImpegno
    titolo: $titolo
    capitolo: $capitolo
    articolo: $articolo
    capitoloStorico: $capitoloStorico
    numeroVincolo: $numeroVincolo
    cdr: $cdr
    tipoMovimento: $tipoMovimento
    size: $size
  )
  impegno_accertamento(
    annoImpegno: $annoImpegno
    numImpegno: $numImpegno
    titolo: $titolo
    capitolo: $capitolo
    articolo: $articolo
    capitoloStorico: $capitoloStorico
    numeroVincolo: $numeroVincolo
    cdr: $cdr
    tipoMovimento: $tipoMovimento
    page: $page
    size: $size
  ) {
    ...impegno
  }
}
    ${ImpegnoFragmentDoc}`;
export const GetMovimentiAttivitaDetailsDocument = `
    query getMovimentiAttivitaDetails($uuid: String, $determinaId: BigInteger!) {
  singola_attivita_uuid(uuid: $uuid, determinaId: $determinaId) {
    determina {
      riferimentiContabili {
        ...riferimenti_contabili
      }
    }
  }
}
    ${Riferimenti_ContabiliFragmentDoc}`;
export const GetPrenotazioniDocument = `
    query getPrenotazioni($annoPrenotazione: String, $numeroPrenotazione: String, $titolo: String, $capitolo: String, $articolo: String, $capitoloStorico: String, $numeroVincolo: String, $cdr: String, $page: Int, $size: Int) {
  prenotazione_pages(
    annoPrenotazione: $annoPrenotazione
    numeroPrenotazione: $numeroPrenotazione
    titolo: $titolo
    capitolo: $capitolo
    articolo: $articolo
    capitoloStorico: $capitoloStorico
    numeroVincolo: $numeroVincolo
    cdr: $cdr
    size: $size
  )
  prenotazione_sib(
    annoPrenotazione: $annoPrenotazione
    numeroPrenotazione: $numeroPrenotazione
    titolo: $titolo
    capitolo: $capitolo
    articolo: $articolo
    capitoloStorico: $capitoloStorico
    numeroVincolo: $numeroVincolo
    cdr: $cdr
    page: $page
    size: $size
  ) {
    ...prenotazione
  }
}
    ${PrenotazioneFragmentDoc}`;
export const GetSoggettiDocument = `
    query getSoggetti($nominativo: String, $codice: String, $codiceFiscale: String, $partitaIVA: String, $page: Int, $size: Int) {
  soggetto_sib_pages(
    nominativo: $nominativo
    codice: $codice
    codiceFiscale: $codiceFiscale
    partitaIVA: $partitaIVA
    size: $size
  )
  soggetto_sib(
    nominativo: $nominativo
    codice: $codice
    codiceFiscale: $codiceFiscale
    partitaIVA: $partitaIVA
    page: $page
    size: $size
  ) {
    ...soggetto
  }
}
    ${SoggettoFragmentDoc}`;
export const GetSoggettiDeterminaDocument = `
    query getSoggettiDetermina($determinaId: BigInteger) {
  soggetti_per_determina(determinaId: $determinaId) {
    ...movimento_soggetto
  }
}
    ${Movimento_SoggettoFragmentDoc}`;
export const GetTipoDeterminaDocument = `
    query getTipoDetermina($cdrCode: String, $cdr: String) {
  tipo_determina(cdrCode: $cdrCode, cdr: $cdr)
}
    `;
export const GetValidazioneTabDocument = `
    query getValidazioneTab($determina_id: BigInteger!) {
  determina(id: $determina_id) {
    validazione {
      ...validazione_tab_dto
    }
  }
}
    ${Validazione_Tab_DtoFragmentDoc}`;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    saveAccertamento: build.mutation<SaveAccertamentoMutation, SaveAccertamentoMutationVariables | void>({
      query: (variables) => ({ document: SaveAccertamentoDocument, variables })
    }),
    updateAccertamento: build.mutation<UpdateAccertamentoMutation, UpdateAccertamentoMutationVariables | void>({
      query: (variables) => ({ document: UpdateAccertamentoDocument, variables })
    }),
    saveAnacForm: build.mutation<SaveAnacFormMutation, SaveAnacFormMutationVariables | void>({
      query: (variables) => ({ document: SaveAnacFormDocument, variables })
    }),
    updateAnacForm: build.mutation<UpdateAnacFormMutation, UpdateAnacFormMutationVariables | void>({
      query: (variables) => ({ document: UpdateAnacFormDocument, variables })
    }),
    deleteAnacGruppoInvitato: build.mutation<DeleteAnacGruppoInvitatoMutation, DeleteAnacGruppoInvitatoMutationVariables | void>({
      query: (variables) => ({ document: DeleteAnacGruppoInvitatoDocument, variables })
    }),
    saveAnacGruppoInvitato: build.mutation<SaveAnacGruppoInvitatoMutation, SaveAnacGruppoInvitatoMutationVariables | void>({
      query: (variables) => ({ document: SaveAnacGruppoInvitatoDocument, variables })
    }),
    updateAnacGruppoInvitato: build.mutation<UpdateAnacGruppoInvitatoMutation, UpdateAnacGruppoInvitatoMutationVariables | void>({
      query: (variables) => ({ document: UpdateAnacGruppoInvitatoDocument, variables })
    }),
    deleteAnacInvitato: build.mutation<DeleteAnacInvitatoMutation, DeleteAnacInvitatoMutationVariables | void>({
      query: (variables) => ({ document: DeleteAnacInvitatoDocument, variables })
    }),
    saveAnacInvitato: build.mutation<SaveAnacInvitatoMutation, SaveAnacInvitatoMutationVariables | void>({
      query: (variables) => ({ document: SaveAnacInvitatoDocument, variables })
    }),
    updateAnacInvitato: build.mutation<UpdateAnacInvitatoMutation, UpdateAnacInvitatoMutationVariables | void>({
      query: (variables) => ({ document: UpdateAnacInvitatoDocument, variables })
    }),
    saveCampiDefaultDetermina: build.mutation<SaveCampiDefaultDeterminaMutation, SaveCampiDefaultDeterminaMutationVariables | void>({
      query: (variables) => ({ document: SaveCampiDefaultDeterminaDocument, variables })
    }),
    saveCampoDefaultDetermina: build.mutation<SaveCampoDefaultDeterminaMutation, SaveCampoDefaultDeterminaMutationVariables | void>({
      query: (variables) => ({ document: SaveCampoDefaultDeterminaDocument, variables })
    }),
    completaAttivita: build.mutation<CompletaAttivitaMutation, CompletaAttivitaMutationVariables | void>({
      query: (variables) => ({ document: CompletaAttivitaDocument, variables })
    }),
    deleteDefaultLista: build.mutation<DeleteDefaultListaMutation, DeleteDefaultListaMutationVariables | void>({
      query: (variables) => ({ document: DeleteDefaultListaDocument, variables })
    }),
    saveDefaultLista: build.mutation<SaveDefaultListaMutation, SaveDefaultListaMutationVariables | void>({
      query: (variables) => ({ document: SaveDefaultListaDocument, variables })
    }),
    updateDefaultLista: build.mutation<UpdateDefaultListaMutation, UpdateDefaultListaMutationVariables | void>({
      query: (variables) => ({ document: UpdateDefaultListaDocument, variables })
    }),
    deleteDetermina: build.mutation<DeleteDeterminaMutation, DeleteDeterminaMutationVariables | void>({
      query: (variables) => ({ document: DeleteDeterminaDocument, variables })
    }),
    duplicaDetermina: build.mutation<DuplicaDeterminaMutation, DuplicaDeterminaMutationVariables | void>({
      query: (variables) => ({ document: DuplicaDeterminaDocument, variables })
    }),
    saveDetermina: build.mutation<SaveDeterminaMutation, SaveDeterminaMutationVariables | void>({
      query: (variables) => ({ document: SaveDeterminaDocument, variables })
    }),
    updateDetermina: build.mutation<UpdateDeterminaMutation, UpdateDeterminaMutationVariables | void>({
      query: (variables) => ({ document: UpdateDeterminaDocument, variables })
    }),
    updateDeterminaPreferita: build.mutation<UpdateDeterminaPreferitaMutation, UpdateDeterminaPreferitaMutationVariables | void>({
      query: (variables) => ({ document: UpdateDeterminaPreferitaDocument, variables })
    }),
    deleteDocumento: build.mutation<DeleteDocumentoMutation, DeleteDocumentoMutationVariables | void>({
      query: (variables) => ({ document: DeleteDocumentoDocument, variables })
    }),
    deleteFasceControllo: build.mutation<DeleteFasceControlloMutation, DeleteFasceControlloMutationVariables | void>({
      query: (variables) => ({ document: DeleteFasceControlloDocument, variables })
    }),
    deleteFasciaControllo: build.mutation<DeleteFasciaControlloMutation, DeleteFasciaControlloMutationVariables | void>({
      query: (variables) => ({ document: DeleteFasciaControlloDocument, variables })
    }),
    saveFasciaControllo: build.mutation<SaveFasciaControlloMutation, SaveFasciaControlloMutationVariables | void>({
      query: (variables) => ({ document: SaveFasciaControlloDocument, variables })
    }),
    updateFasciaControllo: build.mutation<UpdateFasciaControlloMutation, UpdateFasciaControlloMutationVariables | void>({
      query: (variables) => ({ document: UpdateFasciaControlloDocument, variables })
    }),
    deleteFasciaControlloDefinito: build.mutation<DeleteFasciaControlloDefinitoMutation, DeleteFasciaControlloDefinitoMutationVariables | void>({
      query: (variables) => ({ document: DeleteFasciaControlloDefinitoDocument, variables })
    }),
    firmaMultipla: build.mutation<FirmaMultiplaMutation, FirmaMultiplaMutationVariables>({
      query: (variables) => ({ document: FirmaMultiplaDocument, variables })
    }),
    deleteGppCategoria: build.mutation<DeleteGppCategoriaMutation, DeleteGppCategoriaMutationVariables | void>({
      query: (variables) => ({ document: DeleteGppCategoriaDocument, variables })
    }),
    saveGppCategoria: build.mutation<SaveGppCategoriaMutation, SaveGppCategoriaMutationVariables | void>({
      query: (variables) => ({ document: SaveGppCategoriaDocument, variables })
    }),
    updateGppCategoria: build.mutation<UpdateGppCategoriaMutation, UpdateGppCategoriaMutationVariables | void>({
      query: (variables) => ({ document: UpdateGppCategoriaDocument, variables })
    }),
    saveGppForm: build.mutation<SaveGppFormMutation, SaveGppFormMutationVariables | void>({
      query: (variables) => ({ document: SaveGppFormDocument, variables })
    }),
    updateGppForm: build.mutation<UpdateGppFormMutation, UpdateGppFormMutationVariables | void>({
      query: (variables) => ({ document: UpdateGppFormDocument, variables })
    }),
    saveImpegno: build.mutation<SaveImpegnoMutation, SaveImpegnoMutationVariables | void>({
      query: (variables) => ({ document: SaveImpegnoDocument, variables })
    }),
    updateImpegno: build.mutation<UpdateImpegnoMutation, UpdateImpegnoMutationVariables | void>({
      query: (variables) => ({ document: UpdateImpegnoDocument, variables })
    }),
    saveMovimenti: build.mutation<SaveMovimentiMutation, SaveMovimentiMutationVariables | void>({
      query: (variables) => ({ document: SaveMovimentiDocument, variables })
    }),
    saveMovimentiStorni: build.mutation<SaveMovimentiStorniMutation, SaveMovimentiStorniMutationVariables | void>({
      query: (variables) => ({ document: SaveMovimentiStorniDocument, variables })
    }),
    deleteMovimento: build.mutation<DeleteMovimentoMutation, DeleteMovimentoMutationVariables | void>({
      query: (variables) => ({ document: DeleteMovimentoDocument, variables })
    }),
    updateMovimento: build.mutation<UpdateMovimentoMutation, UpdateMovimentoMutationVariables | void>({
      query: (variables) => ({ document: UpdateMovimentoDocument, variables })
    }),
    saveNota: build.mutation<SaveNotaMutation, SaveNotaMutationVariables | void>({
      query: (variables) => ({ document: SaveNotaDocument, variables })
    }),
    savePrenotazione: build.mutation<SavePrenotazioneMutation, SavePrenotazioneMutationVariables | void>({
      query: (variables) => ({ document: SavePrenotazioneDocument, variables })
    }),
    updatePrenotazione: build.mutation<UpdatePrenotazioneMutation, UpdatePrenotazioneMutationVariables | void>({
      query: (variables) => ({ document: UpdatePrenotazioneDocument, variables })
    }),
    saveProprietaOffuscate: build.mutation<SaveProprietaOffuscateMutation, SaveProprietaOffuscateMutationVariables | void>({
      query: (variables) => ({ document: SaveProprietaOffuscateDocument, variables })
    }),
    saveProprietaOffuscateSoggetto: build.mutation<SaveProprietaOffuscateSoggettoMutation, SaveProprietaOffuscateSoggettoMutationVariables | void>({
      query: (variables) => ({ document: SaveProprietaOffuscateSoggettoDocument, variables })
    }),
    updateRiferimentiContabili: build.mutation<UpdateRiferimentiContabiliMutation, UpdateRiferimentiContabiliMutationVariables | void>({
      query: (variables) => ({ document: UpdateRiferimentiContabiliDocument, variables })
    }),
    updateRiferimentiMovimenti: build.mutation<UpdateRiferimentiMovimentiMutation, UpdateRiferimentiMovimentiMutationVariables | void>({
      query: (variables) => ({ document: UpdateRiferimentiMovimentiDocument, variables })
    }),
    rilasciaAttivita: build.mutation<RilasciaAttivitaMutation, RilasciaAttivitaMutationVariables | void>({
      query: (variables) => ({ document: RilasciaAttivitaDocument, variables })
    }),
    rivenditaAttivita: build.mutation<RivenditaAttivitaMutation, RivenditaAttivitaMutationVariables | void>({
      query: (variables) => ({ document: RivenditaAttivitaDocument, variables })
    }),
    rivendicaAttivitaMassiva: build.mutation<RivendicaAttivitaMassivaMutation, RivendicaAttivitaMassivaMutationVariables>({
      query: (variables) => ({ document: RivendicaAttivitaMassivaDocument, variables })
    }),
    deleteSoggetto: build.mutation<DeleteSoggettoMutation, DeleteSoggettoMutationVariables | void>({
      query: (variables) => ({ document: DeleteSoggettoDocument, variables })
    }),
    saveSoggetto: build.mutation<SaveSoggettoMutation, SaveSoggettoMutationVariables | void>({
      query: (variables) => ({ document: SaveSoggettoDocument, variables })
    }),
    updateSoggetto: build.mutation<UpdateSoggettoMutation, UpdateSoggettoMutationVariables | void>({
      query: (variables) => ({ document: UpdateSoggettoDocument, variables })
    }),
    saveSubAccertamento: build.mutation<SaveSubAccertamentoMutation, SaveSubAccertamentoMutationVariables | void>({
      query: (variables) => ({ document: SaveSubAccertamentoDocument, variables })
    }),
    saveSubImpegno: build.mutation<SaveSubImpegnoMutation, SaveSubImpegnoMutationVariables | void>({
      query: (variables) => ({ document: SaveSubImpegnoDocument, variables })
    }),
    updateSubImpegno: build.mutation<UpdateSubImpegnoMutation, UpdateSubImpegnoMutationVariables | void>({
      query: (variables) => ({ document: UpdateSubImpegnoDocument, variables })
    }),
    updateValidaCapitolo: build.mutation<UpdateValidaCapitoloMutation, UpdateValidaCapitoloMutationVariables | void>({
      query: (variables) => ({ document: UpdateValidaCapitoloDocument, variables })
    }),
    updateValidaImpegnoAccertamento: build.mutation<UpdateValidaImpegnoAccertamentoMutation, UpdateValidaImpegnoAccertamentoMutationVariables | void>({
      query: (variables) => ({ document: UpdateValidaImpegnoAccertamentoDocument, variables })
    }),
    updateValidaMovimenti: build.mutation<UpdateValidaMovimentiMutation, UpdateValidaMovimentiMutationVariables | void>({
      query: (variables) => ({ document: UpdateValidaMovimentiDocument, variables })
    }),
    updateValidaPrenotazione: build.mutation<UpdateValidaPrenotazioneMutation, UpdateValidaPrenotazioneMutationVariables | void>({
      query: (variables) => ({ document: UpdateValidaPrenotazioneDocument, variables })
    }),
    getAnac: build.query<GetAnacQuery, GetAnacQueryVariables | void>({
      query: (variables) => ({ document: GetAnacDocument, variables })
    }),
    getAnacDetails: build.query<GetAnacDetailsQuery, GetAnacDetailsQueryVariables>({
      query: (variables) => ({ document: GetAnacDetailsDocument, variables })
    }),
    getAttivita: build.query<GetAttivitaQuery, GetAttivitaQueryVariables | void>({
      query: (variables) => ({ document: GetAttivitaDocument, variables })
    }),
    getAttivitaDetails: build.query<GetAttivitaDetailsQuery, GetAttivitaDetailsQueryVariables>({
      query: (variables) => ({ document: GetAttivitaDetailsDocument, variables })
    }),
    getAttivitaPendenti: build.query<GetAttivitaPendentiQuery, GetAttivitaPendentiQueryVariables | void>({
      query: (variables) => ({ document: GetAttivitaPendentiDocument, variables })
    }),
    getCapitoli: build.query<GetCapitoliQuery, GetCapitoliQueryVariables | void>({
      query: (variables) => ({ document: GetCapitoliDocument, variables })
    }),
    getDefaultDetermine: build.query<GetDefaultDetermineQuery, GetDefaultDetermineQueryVariables | void>({
      query: (variables) => ({ document: GetDefaultDetermineDocument, variables })
    }),
    getDefaultListe: build.query<GetDefaultListeQuery, GetDefaultListeQueryVariables | void>({
      query: (variables) => ({ document: GetDefaultListeDocument, variables })
    }),
    getDeterminaAnac: build.query<GetDeterminaAnacQuery, GetDeterminaAnacQueryVariables>({
      query: (variables) => ({ document: GetDeterminaAnacDocument, variables })
    }),
    getDeterminaAttivita: build.query<GetDeterminaAttivitaQuery, GetDeterminaAttivitaQueryVariables>({
      query: (variables) => ({ document: GetDeterminaAttivitaDocument, variables })
    }),
    getDeterminaDetails: build.query<GetDeterminaDetailsQuery, GetDeterminaDetailsQueryVariables>({
      query: (variables) => ({ document: GetDeterminaDetailsDocument, variables })
    }),
    getDeterminaGpp: build.query<GetDeterminaGppQuery, GetDeterminaGppQueryVariables>({
      query: (variables) => ({ document: GetDeterminaGppDocument, variables })
    }),
    getDetermine: build.query<GetDetermineQuery, GetDetermineQueryVariables | void>({
      query: (variables) => ({ document: GetDetermineDocument, variables })
    }),
    getDetermineAvanzato: build.query<GetDetermineAvanzatoQuery, GetDetermineAvanzatoQueryVariables | void>({
      query: (variables) => ({ document: GetDetermineAvanzatoDocument, variables })
    }),
    getDisponibilitaCapitolo: build.query<GetDisponibilitaCapitoloQuery, GetDisponibilitaCapitoloQueryVariables | void>({
      query: (variables) => ({ document: GetDisponibilitaCapitoloDocument, variables })
    }),
    getDisponibilitaPrenotazione: build.query<GetDisponibilitaPrenotazioneQuery, GetDisponibilitaPrenotazioneQueryVariables | void>({
      query: (variables) => ({ document: GetDisponibilitaPrenotazioneDocument, variables })
    }),
    getDisponibilitaSubAccertamento: build.query<GetDisponibilitaSubAccertamentoQuery, GetDisponibilitaSubAccertamentoQueryVariables | void>({
      query: (variables) => ({ document: GetDisponibilitaSubAccertamentoDocument, variables })
    }),
    getDisponibilitaSubImpegno: build.query<GetDisponibilitaSubImpegnoQuery, GetDisponibilitaSubImpegnoQueryVariables | void>({
      query: (variables) => ({ document: GetDisponibilitaSubImpegnoDocument, variables })
    }),
    getFasciaControllo: build.query<GetFasciaControlloQuery, GetFasciaControlloQueryVariables | void>({
      query: (variables) => ({ document: GetFasciaControlloDocument, variables })
    }),
    getGpp: build.query<GetGppQuery, GetGppQueryVariables | void>({
      query: (variables) => ({ document: GetGppDocument, variables })
    }),
    getImpegni: build.query<GetImpegniQuery, GetImpegniQueryVariables | void>({
      query: (variables) => ({ document: GetImpegniDocument, variables })
    }),
    getMovimentiAttivitaDetails: build.query<GetMovimentiAttivitaDetailsQuery, GetMovimentiAttivitaDetailsQueryVariables>({
      query: (variables) => ({ document: GetMovimentiAttivitaDetailsDocument, variables })
    }),
    getPrenotazioni: build.query<GetPrenotazioniQuery, GetPrenotazioniQueryVariables | void>({
      query: (variables) => ({ document: GetPrenotazioniDocument, variables })
    }),
    getSoggetti: build.query<GetSoggettiQuery, GetSoggettiQueryVariables | void>({
      query: (variables) => ({ document: GetSoggettiDocument, variables })
    }),
    getSoggettiDetermina: build.query<GetSoggettiDeterminaQuery, GetSoggettiDeterminaQueryVariables | void>({
      query: (variables) => ({ document: GetSoggettiDeterminaDocument, variables })
    }),
    getTipoDetermina: build.query<GetTipoDeterminaQuery, GetTipoDeterminaQueryVariables | void>({
      query: (variables) => ({ document: GetTipoDeterminaDocument, variables })
    }),
    getValidazioneTab: build.query<GetValidazioneTabQuery, GetValidazioneTabQueryVariables>({
      query: (variables) => ({ document: GetValidazioneTabDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useSaveAccertamentoMutation, useUpdateAccertamentoMutation, useSaveAnacFormMutation, useUpdateAnacFormMutation, useDeleteAnacGruppoInvitatoMutation, useSaveAnacGruppoInvitatoMutation, useUpdateAnacGruppoInvitatoMutation, useDeleteAnacInvitatoMutation, useSaveAnacInvitatoMutation, useUpdateAnacInvitatoMutation, useSaveCampiDefaultDeterminaMutation, useSaveCampoDefaultDeterminaMutation, useCompletaAttivitaMutation, useDeleteDefaultListaMutation, useSaveDefaultListaMutation, useUpdateDefaultListaMutation, useDeleteDeterminaMutation, useDuplicaDeterminaMutation, useSaveDeterminaMutation, useUpdateDeterminaMutation, useUpdateDeterminaPreferitaMutation, useDeleteDocumentoMutation, useDeleteFasceControlloMutation, useDeleteFasciaControlloMutation, useSaveFasciaControlloMutation, useUpdateFasciaControlloMutation, useDeleteFasciaControlloDefinitoMutation, useFirmaMultiplaMutation, useDeleteGppCategoriaMutation, useSaveGppCategoriaMutation, useUpdateGppCategoriaMutation, useSaveGppFormMutation, useUpdateGppFormMutation, useSaveImpegnoMutation, useUpdateImpegnoMutation, useSaveMovimentiMutation, useSaveMovimentiStorniMutation, useDeleteMovimentoMutation, useUpdateMovimentoMutation, useSaveNotaMutation, useSavePrenotazioneMutation, useUpdatePrenotazioneMutation, useSaveProprietaOffuscateMutation, useSaveProprietaOffuscateSoggettoMutation, useUpdateRiferimentiContabiliMutation, useUpdateRiferimentiMovimentiMutation, useRilasciaAttivitaMutation, useRivenditaAttivitaMutation, useRivendicaAttivitaMassivaMutation, useDeleteSoggettoMutation, useSaveSoggettoMutation, useUpdateSoggettoMutation, useSaveSubAccertamentoMutation, useSaveSubImpegnoMutation, useUpdateSubImpegnoMutation, useUpdateValidaCapitoloMutation, useUpdateValidaImpegnoAccertamentoMutation, useUpdateValidaMovimentiMutation, useUpdateValidaPrenotazioneMutation, useGetAnacQuery, useLazyGetAnacQuery, useGetAnacDetailsQuery, useLazyGetAnacDetailsQuery, useGetAttivitaQuery, useLazyGetAttivitaQuery, useGetAttivitaDetailsQuery, useLazyGetAttivitaDetailsQuery, useGetAttivitaPendentiQuery, useLazyGetAttivitaPendentiQuery, useGetCapitoliQuery, useLazyGetCapitoliQuery, useGetDefaultDetermineQuery, useLazyGetDefaultDetermineQuery, useGetDefaultListeQuery, useLazyGetDefaultListeQuery, useGetDeterminaAnacQuery, useLazyGetDeterminaAnacQuery, useGetDeterminaAttivitaQuery, useLazyGetDeterminaAttivitaQuery, useGetDeterminaDetailsQuery, useLazyGetDeterminaDetailsQuery, useGetDeterminaGppQuery, useLazyGetDeterminaGppQuery, useGetDetermineQuery, useLazyGetDetermineQuery, useGetDetermineAvanzatoQuery, useLazyGetDetermineAvanzatoQuery, useGetDisponibilitaCapitoloQuery, useLazyGetDisponibilitaCapitoloQuery, useGetDisponibilitaPrenotazioneQuery, useLazyGetDisponibilitaPrenotazioneQuery, useGetDisponibilitaSubAccertamentoQuery, useLazyGetDisponibilitaSubAccertamentoQuery, useGetDisponibilitaSubImpegnoQuery, useLazyGetDisponibilitaSubImpegnoQuery, useGetFasciaControlloQuery, useLazyGetFasciaControlloQuery, useGetGppQuery, useLazyGetGppQuery, useGetImpegniQuery, useLazyGetImpegniQuery, useGetMovimentiAttivitaDetailsQuery, useLazyGetMovimentiAttivitaDetailsQuery, useGetPrenotazioniQuery, useLazyGetPrenotazioniQuery, useGetSoggettiQuery, useLazyGetSoggettiQuery, useGetSoggettiDeterminaQuery, useLazyGetSoggettiDeterminaQuery, useGetTipoDeterminaQuery, useLazyGetTipoDeterminaQuery, useGetValidazioneTabQuery, useLazyGetValidazioneTabQuery } = injectedRtkApi;

