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
  Void: any;
};

export type AllegatiOutputDto = {
  __typename?: 'AllegatiOutputDTO';
  allegati?: Maybe<Array<Maybe<AllegatoDto>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
};

export type Allegato = {
  __typename?: 'Allegato';
  collocazioneTelematica?: Maybe<Scalars['String']>;
  dimensione?: Maybe<Scalars['BigInteger']>;
  discarded?: Maybe<Scalars['Boolean']>;
  estensione?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  idEmail?: Maybe<Scalars['BigInteger']>;
  idOriginal?: Maybe<Scalars['BigInteger']>;
  idUtente?: Maybe<Scalars['String']>;
  idUtenteLastOperation?: Maybe<Scalars['String']>;
  impronta?: Maybe<Scalars['String']>;
  isMain?: Maybe<Scalars['Boolean']>;
  metaType?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  oggetto?: Maybe<Scalars['String']>;
  protocollo?: Maybe<Protocollo>;
  riferimentoMinio?: Maybe<Scalars['String']>;
  tipoDocumento?: Maybe<Scalars['String']>;
  titolario?: Maybe<Titolario>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
};

export type AllegatoDto = {
  __typename?: 'AllegatoDTO';
  collocazioneTelematica?: Maybe<Scalars['String']>;
  dimensione: Scalars['BigInteger'];
  discarded: Scalars['Boolean'];
  estensione?: Maybe<Scalars['String']>;
  id: Scalars['BigInteger'];
  idEmail: Scalars['BigInteger'];
  idOriginal: Scalars['BigInteger'];
  idUtente?: Maybe<Scalars['String']>;
  idUtenteLastOperation?: Maybe<Scalars['String']>;
  impronta?: Maybe<Scalars['String']>;
  main: Scalars['Boolean'];
  nome?: Maybe<Scalars['String']>;
  oggetto?: Maybe<Scalars['String']>;
  riferimentoMinio?: Maybe<Scalars['String']>;
  tipoDocumento?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
};

export type AllegatoInputInput = {
  collocazioneTelematica?: InputMaybe<Scalars['String']>;
  dimensione?: InputMaybe<Scalars['BigInteger']>;
  estensione?: InputMaybe<Scalars['String']>;
  idAllegato?: InputMaybe<Scalars['BigInteger']>;
  inoltro: Scalars['Boolean'];
  main: Scalars['Boolean'];
  nome?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
};

export enum AmbienteConservazione {
  Parer = 'PARER',
  ParerTest = 'PARER_TEST'
}

export type Anagrafica = {
  __typename?: 'Anagrafica';
  cancellato: Scalars['Boolean'];
  cap?: Maybe<Scalars['String']>;
  certificato: Scalars['Boolean'];
  cfPiva?: Maybe<Scalars['String']>;
  citta?: Maybe<Scalars['String']>;
  cognome?: Maybe<Scalars['String']>;
  dirty: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  idIpaInad?: Maybe<Scalars['String']>;
  impronta?: Maybe<Scalars['String']>;
  indirizzo?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  pec?: Maybe<Scalars['String']>;
  pecToUseForRecipient?: Maybe<Scalars['String']>;
  personaFisica: Scalars['Boolean'];
  personaGiuridica: Scalars['Boolean'];
  provincia?: Maybe<Scalars['String']>;
  ragioneSociale?: Maybe<Scalars['String']>;
  telefono?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
};

export type AnagraficaDto = {
  __typename?: 'AnagraficaDTO';
  cancellato: Scalars['Boolean'];
  cap?: Maybe<Scalars['String']>;
  certificato: Scalars['Boolean'];
  cfPiva?: Maybe<Scalars['String']>;
  citta?: Maybe<Scalars['String']>;
  cognome?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  gruppi?: Maybe<Array<Maybe<GruppoDto>>>;
  id?: Maybe<Scalars['BigInteger']>;
  idIpaInad?: Maybe<Scalars['String']>;
  impronta?: Maybe<Scalars['String']>;
  indirizzo?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  pec?: Maybe<Scalars['String']>;
  provincia?: Maybe<Scalars['String']>;
  ragioneSociale?: Maybe<Scalars['String']>;
  telefono?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
};

export type AnagraficaDtoList = {
  __typename?: 'AnagraficaDTOList';
  anagraficaList?: Maybe<Array<Maybe<AnagraficaDto>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
};

export type AnagraficaInputInput = {
  cap?: InputMaybe<Scalars['String']>;
  certificato?: InputMaybe<Scalars['Boolean']>;
  cfPiva?: InputMaybe<Scalars['String']>;
  citta?: InputMaybe<Scalars['String']>;
  cognome?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  fax?: InputMaybe<Scalars['String']>;
  gruppiIds?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  indirizzo?: InputMaybe<Scalars['String']>;
  nome?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  pec?: InputMaybe<Scalars['String']>;
  provincia?: InputMaybe<Scalars['String']>;
  ragioneSociale?: InputMaybe<Scalars['String']>;
  telefono?: InputMaybe<Scalars['String']>;
};

export type ConfigurazioniPeOutputDto = {
  __typename?: 'ConfigurazioniPEOutputDTO';
  configurazioniPostaElettronica?: Maybe<Array<Maybe<PecPeo>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
};

export type DatiUtenteSso = {
  __typename?: 'DatiUtenteSSO';
  auth_id?: Maybe<Scalars['String']>;
  delegations?: Maybe<Array<Maybe<Delegation>>>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  userOffices?: Maybe<Array<Maybe<UserOffice>>>;
  username?: Maybe<Scalars['String']>;
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

export type DettaglioProtocolloDto = {
  __typename?: 'DettaglioProtocolloDTO';
  annulla: Scalars['Boolean'];
  assegna: Scalars['Boolean'];
  authorized: Scalars['Boolean'];
  canPrendereInCaricoFromPec: Scalars['Boolean'];
  canViewFromPec: Scalars['Boolean'];
  destinatariCompetenza?: Maybe<Array<Maybe<ReferenteOutputDto>>>;
  destinatariConoscenza?: Maybe<Array<Maybe<ReferenteOutputDto>>>;
  gestioneAnnullamento: Scalars['Boolean'];
  protocolAuthor: Scalars['Boolean'];
  protocollo?: Maybe<Protocollo>;
  richiestaAnnullamento: Scalars['Boolean'];
  rifiuta: Scalars['Boolean'];
  statoProtocollo?: Maybe<Scalars['String']>;
  tagList?: Maybe<Array<Maybe<Tag>>>;
  titolario?: Maybe<Array<Maybe<TitolarioOutputDto>>>;
};

export type Email = {
  __typename?: 'Email';
  allegati?: Maybe<Array<Maybe<Allegato>>>;
  cc?: Maybe<Scalars['String']>;
  classificazione?: Maybe<Scalars['String']>;
  corpo?: Maybe<Scalars['String']>;
  deletedFromInbox?: Maybe<Scalars['Boolean']>;
  emailDirection?: Maybe<EmailDirection>;
  from?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  idUtente?: Maybe<Scalars['String']>;
  impronta?: Maybe<Scalars['String']>;
  isHidden?: Maybe<Scalars['Boolean']>;
  messageId?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  nomeUtente?: Maybe<Scalars['String']>;
  notificaProtocollo: Scalars['Boolean'];
  oggetto?: Maybe<Scalars['String']>;
  protocollo?: Maybe<Protocollo>;
  statoInvio?: Maybe<StatoInvio>;
  tipoEmail?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsInvio?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsRicezione?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
};

export enum EmailDirection {
  Entrata = 'ENTRATA',
  Uscita = 'USCITA'
}

export type EmailOutputDto = {
  __typename?: 'EmailOutputDTO';
  email?: Maybe<Array<Maybe<Email>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
};

export type GruppiOutputDto = {
  __typename?: 'GruppiOutputDTO';
  gruppiList?: Maybe<Array<Maybe<Gruppo>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
};

export type Gruppo = {
  __typename?: 'Gruppo';
  contatti?: Maybe<Array<Maybe<Anagrafica>>>;
  id?: Maybe<Scalars['BigInteger']>;
  idUtenteLastOperation?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsDeleted?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsUpdate?: Maybe<Scalars['DateTime']>;
};

export type GruppoAnagraficaDtoInput = {
  anagraficaIds?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  nome?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
};

export type GruppoDto = {
  __typename?: 'GruppoDTO';
  id?: Maybe<Scalars['BigInteger']>;
  nome?: Maybe<Scalars['String']>;
};

export type GruppoOutputDto = {
  __typename?: 'GruppoOutputDTO';
  /** ISO-8601 */
  creation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  deleted?: Maybe<Scalars['DateTime']>;
  id: Scalars['BigInteger'];
  nome?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  update?: Maybe<Scalars['DateTime']>;
};

export type InoltraRispondiInput = {
  body?: InputMaybe<Scalars['String']>;
  cc?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  from?: InputMaybe<Scalars['String']>;
  idAttachments?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  subject?: InputMaybe<Scalars['String']>;
  tipologiaPosta?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type IpaResponseDto = {
  __typename?: 'IpaResponseDTO';
  acronimo?: Maybe<Scalars['String']>;
  cap?: Maybe<Scalars['String']>;
  certificato?: Maybe<Scalars['Boolean']>;
  cfPiva?: Maybe<Scalars['String']>;
  citta?: Maybe<Scalars['String']>;
  codAOO?: Maybe<Scalars['String']>;
  codAmm?: Maybe<Scalars['String']>;
  codUniOU?: Maybe<Scalars['String']>;
  cognome?: Maybe<Scalars['String']>;
  datValCanaleTrasmSfe?: Maybe<Scalars['String']>;
  dataVerificaOF?: Maybe<Scalars['String']>;
  descAmm?: Maybe<Scalars['String']>;
  descOU?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  gruppiIds?: Maybe<Array<Maybe<Scalars['BigInteger']>>>;
  indirizzo?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  pec?: Maybe<Scalars['String']>;
  provincia?: Maybe<Scalars['String']>;
  ragioneSociale?: Maybe<Scalars['String']>;
  statoCanale?: Maybe<Scalars['String']>;
  telefono?: Maybe<Scalars['String']>;
  tipologiaIpaResponse?: Maybe<TipologiaIpaResponse>;
};

export type IpaResponseDtoInput = {
  acronimo?: InputMaybe<Scalars['String']>;
  cap?: InputMaybe<Scalars['String']>;
  certificato?: InputMaybe<Scalars['Boolean']>;
  cfPiva?: InputMaybe<Scalars['String']>;
  citta?: InputMaybe<Scalars['String']>;
  codAOO?: InputMaybe<Scalars['String']>;
  codAmm?: InputMaybe<Scalars['String']>;
  codUniOU?: InputMaybe<Scalars['String']>;
  cognome?: InputMaybe<Scalars['String']>;
  datValCanaleTrasmSfe?: InputMaybe<Scalars['String']>;
  dataVerificaOF?: InputMaybe<Scalars['String']>;
  descAmm?: InputMaybe<Scalars['String']>;
  descOU?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  fax?: InputMaybe<Scalars['String']>;
  gruppiIds?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  indirizzo?: InputMaybe<Scalars['String']>;
  nome?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  pec?: InputMaybe<Scalars['String']>;
  provincia?: InputMaybe<Scalars['String']>;
  ragioneSociale?: InputMaybe<Scalars['String']>;
  statoCanale?: InputMaybe<Scalars['String']>;
  telefono?: InputMaybe<Scalars['String']>;
  tipologiaIpaResponse?: InputMaybe<TipologiaIpaResponse>;
};

export type LoginConservazioneDto = {
  __typename?: 'LoginConservazioneDTO';
  ambiente?: Maybe<AmbienteConservazione>;
  ente?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  struttura?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  versione?: Maybe<Scalars['String']>;
  xmlSip?: Maybe<Scalars['String']>;
};

export type LoginConservazioneDtoInput = {
  ambiente?: InputMaybe<AmbienteConservazione>;
  ente?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  struttura?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
  versione?: InputMaybe<Scalars['String']>;
  xmlSip?: InputMaybe<Scalars['String']>;
};

export type LoginRaccomandataDto = {
  __typename?: 'LoginRaccomandataDTO';
  gruppo?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type LoginRaccomandataDtoInput = {
  gruppo?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export enum MetodoSpedizione {
  AMano = 'AMano',
  AccreditamentoWeb = 'AccreditamentoWeb',
  Corriere = 'Corriere',
  Email = 'Email',
  Mepa = 'Mepa',
  NotificaAtti = 'NotificaAtti',
  Pec = 'Pec',
  PostaPrioritaria = 'PostaPrioritaria',
  Raccomandata = 'Raccomandata',
  RaccomandataSemplice = 'RaccomandataSemplice',
  Sportello = 'Sportello',
  Tracciabilita = 'Tracciabilita'
}

export type MittenteProtocolloInputInput = {
  codAmm?: InputMaybe<Scalars['String']>;
  codAoo?: InputMaybe<Scalars['String']>;
  codUniOu?: InputMaybe<Scalars['String']>;
  descMittente?: InputMaybe<Scalars['String']>;
  idMittente?: InputMaybe<Scalars['String']>;
  isIpa?: InputMaybe<Scalars['Boolean']>;
  tipoMittente?: InputMaybe<Scalars['String']>;
  tipologiaIpa?: InputMaybe<Scalars['String']>;
};

export type ModelloAutomaticoDto = {
  __typename?: 'ModelloAutomaticoDTO';
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  hierarchyStringTitolario?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  metodoSpedizione?: Maybe<MetodoSpedizione>;
  nomeModello?: Maybe<Scalars['String']>;
  oggettoProtocollo?: Maybe<Scalars['String']>;
  tipoRegistrazione?: Maybe<TipoRegistrazione>;
  titolario?: Maybe<Titolario>;
};

export type ModelloAutomaticoInputDtoInput = {
  cdrCode?: InputMaybe<Scalars['String']>;
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
  metodoSpedizione?: InputMaybe<Scalars['String']>;
  nomeModello?: InputMaybe<Scalars['String']>;
  oggettoProtocollo?: InputMaybe<Scalars['String']>;
  tipoRegistrazione?: InputMaybe<Scalars['String']>;
};

export type ModelloAutomaticoOutputDto = {
  __typename?: 'ModelloAutomaticoOutputDTO';
  modelloAutomaticoList?: Maybe<Array<Maybe<ModelloAutomaticoDto>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
};

/** Mutation root */
export type Mutation = {
  __typename?: 'Mutation';
  addContactsToGroup: Scalars['Boolean'];
  annullaProtocollo: Scalars['Boolean'];
  annullaRaccomandata: Scalars['Boolean'];
  assegnaProtocollo: Scalars['Boolean'];
  assegnazioneProtocolloMassiva: Scalars['Boolean'];
  createModelloAutomatico?: Maybe<ModelloAutomaticoDto>;
  createRegistroGiornaliero: Scalars['Boolean'];
  deleteAnagraficaWithoutCertificazione?: Maybe<Scalars['String']>;
  deleteConfiguration: Scalars['Boolean'];
  deleteContatto: Scalars['Boolean'];
  deleteGruppo: Scalars['Boolean'];
  deleteModelloAutomatico: Scalars['Boolean'];
  deletePecEsclusa: Scalars['Boolean'];
  deletePecRegola: Scalars['Boolean'];
  deleteTag: Scalars['Boolean'];
  deleteTitolario: Scalars['Boolean'];
  deleteVisibilitaTitolario: Scalars['Boolean'];
  discardAllegato: Scalars['Boolean'];
  dropTitolario: Scalars['Boolean'];
  exportListaProtocolli?: Maybe<Scalars['String']>;
  exportStorico?: Maybe<Scalars['String']>;
  fascicolazioneMassivaProtocollo: Scalars['Boolean'];
  fascicolazioneProtocollo: Scalars['Boolean'];
  gestioneAnnullamento: Scalars['Boolean'];
  importAnagraficaFromBase64: Scalars['Boolean'];
  importModelliAutomaticiFromBase64: Scalars['Boolean'];
  importProtocolliEmergenzaFromBase64?: Maybe<Array<Maybe<ProtocolloEmergenzaDto>>>;
  inoltraRispondiEmail: Scalars['Boolean'];
  insertPermessoFascicoloDipendente?: Maybe<Scalars['Void']>;
  insertRaccomandata?: Maybe<RaccomandataProtocollo>;
  insertTitolario: Scalars['Boolean'];
  insertVisibilitatitolario: Scalars['Boolean'];
  inviaRaccomandateInCoda?: Maybe<Scalars['Void']>;
  notificaProtocollo: Scalars['Boolean'];
  presaInCaricoProtocolloMassiva: Scalars['Boolean'];
  reinviaEmail?: Maybe<Scalars['String']>;
  removeContactFromGroup: Scalars['Boolean'];
  resumeAllegato: Scalars['Boolean'];
  revocaAssegnazioneProtocollo: Scalars['Boolean'];
  richiestaAnnullamentoProtocollo: Scalars['Boolean'];
  richiestaAssegnazioneProtocollo: Scalars['Boolean'];
  rifiutaProtocollo: Scalars['Boolean'];
  rifiutaProtocolloMassiva: Scalars['Boolean'];
  saveConfiguration: Scalars['Boolean'];
  saveContatto?: Maybe<Anagrafica>;
  saveGruppo?: Maybe<Gruppo>;
  saveLoginConservazione: Scalars['Boolean'];
  saveLoginRaccomandata: Scalars['Boolean'];
  savePecEsclusa?: Maybe<PecEscluseRispostaAutomatica>;
  savePecRegola?: Maybe<PecRegolaInputDto>;
  saveProtocollo?: Maybe<Protocollo>;
  saveProtocolloByEmail?: Maybe<Protocollo>;
  saveTag?: Maybe<Tag>;
  sendEmailToQueue?: Maybe<Scalars['String']>;
  setMaxLivelloFascicolazioneForTitolario: Scalars['Boolean'];
  spostaAllegatiFascicolo: Scalars['Boolean'];
  spostaFascicolo: Scalars['Boolean'];
  spostaProtocollo: Scalars['Boolean'];
  updateConfigurations: Scalars['Boolean'];
  updateContatto?: Maybe<Anagrafica>;
  updateGruppo?: Maybe<Gruppo>;
  updateLoginConservazione: Scalars['Boolean'];
  updateLoginRaccomandata: Scalars['Boolean'];
  updateModelloAutomatico?: Maybe<ModelloAutomaticoDto>;
  updateNoteProtocollo: Scalars['Boolean'];
  updatePecEsclusa?: Maybe<PecEscluseRispostaAutomatica>;
  updateProtocollo?: Maybe<Protocollo>;
  updateStatoProtocollo: Scalars['Boolean'];
  updateStatoRaccomandateForProtocollo: Scalars['Boolean'];
  updateTag?: Maybe<Tag>;
  updateTitolario: Scalars['Boolean'];
};


/** Mutation root */
export type MutationAddContactsToGroupArgs = {
  contactIds?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  groupId?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationAnnullaProtocolloArgs = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  notaAnnullamento?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationAnnullaRaccomandataArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  motivazione?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationAssegnaProtocolloArgs = {
  assegnatari?: InputMaybe<Array<InputMaybe<ReferenteProtocolloInputInput>>>;
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  noteAssegnazione?: InputMaybe<Scalars['String']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationAssegnazioneProtocolloMassivaArgs = {
  assegnatari?: InputMaybe<Array<InputMaybe<ReferenteProtocolloInputInput>>>;
  noteAssegnazione?: InputMaybe<Scalars['String']>;
  numbers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationCreateModelloAutomaticoArgs = {
  input?: InputMaybe<ModelloAutomaticoInputDtoInput>;
};


/** Mutation root */
export type MutationDeleteConfigurationArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeleteContattoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeleteGruppoArgs = {
  groupId?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeleteModelloAutomaticoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeletePecEsclusaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeletePecRegolaArgs = {
  idCategoria?: InputMaybe<Scalars['BigInteger']>;
  idEmail?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeleteTagArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeleteTitolarioArgs = {
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDeleteVisibilitaTitolarioArgs = {
  deleteVisibilitaTitolario?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
};


/** Mutation root */
export type MutationDiscardAllegatoArgs = {
  idAllegato?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationDropTitolarioArgs = {
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationExportListaProtocolliArgs = {
  dto?: InputMaybe<RicercaProtocolliDtoInput>;
  formato?: InputMaybe<Scalars['String']>;
  idProtocolliSelezionati?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
};


/** Mutation root */
export type MutationExportStoricoArgs = {
  dto?: InputMaybe<RicercaStoricoDtoInput>;
  formato?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationFascicolazioneMassivaProtocolloArgs = {
  idProtocolloList?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  idTitolarioList?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationFascicolazioneProtocolloArgs = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  idTitolarioList?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationGestioneAnnullamentoArgs = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  isAnnulla: Scalars['Boolean'];
  nota?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationImportAnagraficaFromBase64Args = {
  fileBase64?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationImportModelliAutomaticiFromBase64Args = {
  fileBase64?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationImportProtocolliEmergenzaFromBase64Args = {
  cdr?: InputMaybe<Scalars['String']>;
  fileBase64?: InputMaybe<Scalars['String']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationInoltraRispondiEmailArgs = {
  dto?: InputMaybe<InoltraRispondiInput>;
};


/** Mutation root */
export type MutationInsertRaccomandataArgs = {
  input?: InputMaybe<RaccomandataProtocolloInputInput>;
};


/** Mutation root */
export type MutationInsertTitolarioArgs = {
  titolarioInput?: InputMaybe<TitolarioInputInput>;
};


/** Mutation root */
export type MutationInsertVisibilitatitolarioArgs = {
  visibilitaTitolarioInput?: InputMaybe<VisibilitaTitolarioInputInput>;
};


/** Mutation root */
export type MutationNotificaProtocolloArgs = {
  input?: InputMaybe<NotificaProtocolloPecPeoInputInput>;
};


/** Mutation root */
export type MutationPresaInCaricoProtocolloMassivaArgs = {
  numbers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationReinviaEmailArgs = {
  idEmail?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationRemoveContactFromGroupArgs = {
  contactId?: InputMaybe<Scalars['BigInteger']>;
  groupId?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationResumeAllegatoArgs = {
  idAllegato?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationRevocaAssegnazioneProtocolloArgs = {
  referentiProtocolloId?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationRichiestaAnnullamentoProtocolloArgs = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  notaAnnullamento?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRichiestaAssegnazioneProtocolloArgs = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  note?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRifiutaProtocolloArgs = {
  nProtocollo?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationRifiutaProtocolloMassivaArgs = {
  note?: InputMaybe<Scalars['String']>;
  numbers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Mutation root */
export type MutationSaveConfigurationArgs = {
  pecPeoDTOInput?: InputMaybe<PecPeoDtoInputInput>;
};


/** Mutation root */
export type MutationSaveContattoArgs = {
  anagraficaInput?: InputMaybe<AnagraficaInputInput>;
};


/** Mutation root */
export type MutationSaveGruppoArgs = {
  gruppoAnagraficaDTO?: InputMaybe<GruppoAnagraficaDtoInput>;
};


/** Mutation root */
export type MutationSaveLoginConservazioneArgs = {
  loginInput?: InputMaybe<LoginConservazioneDtoInput>;
};


/** Mutation root */
export type MutationSaveLoginRaccomandataArgs = {
  loginInput?: InputMaybe<LoginRaccomandataDtoInput>;
};


/** Mutation root */
export type MutationSavePecEsclusaArgs = {
  pecInput?: InputMaybe<PecEscluseRispostaAutomaticaInputInput>;
};


/** Mutation root */
export type MutationSavePecRegolaArgs = {
  input?: InputMaybe<PecRegolaInputDtoInput>;
};


/** Mutation root */
export type MutationSaveProtocolloArgs = {
  protocollo_input?: InputMaybe<ProtocolloInputInput>;
};


/** Mutation root */
export type MutationSaveProtocolloByEmailArgs = {
  idEmail?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSaveTagArgs = {
  tagInput?: InputMaybe<TagInputInput>;
};


/** Mutation root */
export type MutationSendEmailToQueueArgs = {
  idEmail?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSetMaxLivelloFascicolazioneForTitolarioArgs = {
  livello?: InputMaybe<Scalars['Int']>;
};


/** Mutation root */
export type MutationSpostaAllegatiFascicoloArgs = {
  allegatiIds?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  newTitolarioId?: InputMaybe<Scalars['BigInteger']>;
  oldTitolarioId?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSpostaFascicoloArgs = {
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  idFascicoliList?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  idFascicoloPadre?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationSpostaProtocolloArgs = {
  idFascicoloNew?: InputMaybe<Scalars['BigInteger']>;
  idFascicoloOld?: InputMaybe<Scalars['BigInteger']>;
  idProtocolli?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
};


/** Mutation root */
export type MutationUpdateConfigurationsArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  input?: InputMaybe<PecPeoDtoInputInput>;
};


/** Mutation root */
export type MutationUpdateContattoArgs = {
  anagraficaInput?: InputMaybe<AnagraficaInputInput>;
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationUpdateGruppoArgs = {
  groupId?: InputMaybe<Scalars['BigInteger']>;
  gruppoAnagraficaDTO?: InputMaybe<GruppoAnagraficaDtoInput>;
};


/** Mutation root */
export type MutationUpdateLoginConservazioneArgs = {
  loginInput?: InputMaybe<LoginConservazioneDtoInput>;
};


/** Mutation root */
export type MutationUpdateLoginRaccomandataArgs = {
  loginInput?: InputMaybe<LoginRaccomandataDtoInput>;
};


/** Mutation root */
export type MutationUpdateModelloAutomaticoArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  input?: InputMaybe<ModelloAutomaticoInputDtoInput>;
};


/** Mutation root */
export type MutationUpdateNoteProtocolloArgs = {
  updateInput?: InputMaybe<ProtocolloUpdateInputInput>;
};


/** Mutation root */
export type MutationUpdatePecEsclusaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  pecInput?: InputMaybe<PecEscluseRispostaAutomaticaInputInput>;
};


/** Mutation root */
export type MutationUpdateProtocolloArgs = {
  updateInput?: InputMaybe<ProtocolloUpdateInputInput>;
};


/** Mutation root */
export type MutationUpdateStatoProtocolloArgs = {
  stato_protocollo_input?: InputMaybe<StatoProtocolloInputInput>;
};


/** Mutation root */
export type MutationUpdateStatoRaccomandateForProtocolloArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Mutation root */
export type MutationUpdateTagArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  tagInput?: InputMaybe<TagInputInput>;
};


/** Mutation root */
export type MutationUpdateTitolarioArgs = {
  titolarioInput?: InputMaybe<TitolarioInputInput>;
};

export type NotificaProtocolloPecPeoInputInput = {
  allegati?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  corpo?: InputMaybe<Scalars['String']>;
  destinatariCompetenza?: InputMaybe<Array<InputMaybe<ReferenteOutputDtoInput>>>;
  destinatariCompetenzaUsePeoInsteadOfPec?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  destinatariConoscenza?: InputMaybe<Array<InputMaybe<ReferenteOutputDtoInput>>>;
  destinatariConoscenzaUsePeoInsteadOfPec?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  from?: InputMaybe<Scalars['String']>;
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  multiplo?: InputMaybe<Scalars['Boolean']>;
  nProtocollo?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
};

export type Office = {
  __typename?: 'Office';
  code?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  service?: Maybe<Scalars['String']>;
  short_description?: Maybe<Scalars['String']>;
};

export type PeConfigurazione = {
  __typename?: 'PeConfigurazione';
  connectionTimeout?: Maybe<Scalars['Int']>;
  env?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  imapHost?: Maybe<Scalars['String']>;
  imapPort?: Maybe<Scalars['Int']>;
  metaType?: Maybe<Scalars['String']>;
  sentFolder?: Maybe<Scalars['String']>;
  smtpHost?: Maybe<Scalars['String']>;
  smtpPort?: Maybe<Scalars['Int']>;
  tipologiaPosta?: Maybe<TipologiaPosta>;
  useTls?: Maybe<Scalars['Boolean']>;
};

export type PeConfigurazioneInput = {
  connectionTimeout?: InputMaybe<Scalars['Int']>;
  env?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['BigInteger']>;
  imapHost?: InputMaybe<Scalars['String']>;
  imapPort?: InputMaybe<Scalars['Int']>;
  sentFolder?: InputMaybe<Scalars['String']>;
  smtpHost?: InputMaybe<Scalars['String']>;
  smtpPort?: InputMaybe<Scalars['Int']>;
  tipologiaPosta?: InputMaybe<TipologiaPosta>;
  useTls?: InputMaybe<Scalars['Boolean']>;
};

export type PecEscluseRispostaAutomatica = {
  __typename?: 'PecEscluseRispostaAutomatica';
  id?: Maybe<Scalars['BigInteger']>;
  indirizzo?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
};

export type PecEscluseRispostaAutomaticaDto = {
  __typename?: 'PecEscluseRispostaAutomaticaDTO';
  id?: Maybe<Scalars['BigInteger']>;
  indirizzo?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
};

export type PecEscluseRispostaAutomaticaDtoList = {
  __typename?: 'PecEscluseRispostaAutomaticaDTOList';
  pageCount: Scalars['BigInteger'];
  pecEscluseRispostaAutomaticaList?: Maybe<Array<Maybe<PecEscluseRispostaAutomaticaDto>>>;
  totalResults: Scalars['BigInteger'];
};

export type PecEscluseRispostaAutomaticaInputInput = {
  id?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  indirizzo?: InputMaybe<Scalars['String']>;
};

export type PecPeo = {
  __typename?: 'PecPeo';
  attiva: Scalars['Boolean'];
  configurazione?: Maybe<PeConfigurazione>;
  deleteMessages: Scalars['Boolean'];
  id?: Maybe<Scalars['BigInteger']>;
  idUtente?: Maybe<Scalars['String']>;
  indirizzoEmail?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  mustSendRispostaAutomatica: Scalars['Boolean'];
  password?: Maybe<Scalars['String']>;
  passwordDecrypted?: Maybe<Scalars['String']>;
  readPec: Scalars['Boolean'];
  saveToSent: Scalars['Boolean'];
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  uffici?: Maybe<Array<Maybe<Ufficio>>>;
  username?: Maybe<Scalars['String']>;
  utente?: Maybe<Scalars['String']>;
};

export type PecPeoDtoInputInput = {
  attiva?: InputMaybe<Scalars['Boolean']>;
  cdrList?: InputMaybe<Array<InputMaybe<UfficioInput>>>;
  deleteMessages?: InputMaybe<Scalars['Boolean']>;
  formSwitch?: InputMaybe<Scalars['String']>;
  idUtente?: InputMaybe<Scalars['String']>;
  indirizzoEmail?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  readPec?: InputMaybe<Scalars['Boolean']>;
  saveToSent?: InputMaybe<Scalars['Boolean']>;
  sendRispostaAutomatica?: InputMaybe<Scalars['Boolean']>;
  tipologiaPosta?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
  utente?: InputMaybe<Scalars['String']>;
};

export type PecPeoInput = {
  attiva: Scalars['Boolean'];
  configurazione?: InputMaybe<PeConfigurazioneInput>;
  deleteMessages: Scalars['Boolean'];
  id?: InputMaybe<Scalars['BigInteger']>;
  idUtente?: InputMaybe<Scalars['String']>;
  indirizzoEmail?: InputMaybe<Scalars['String']>;
  mustSendRispostaAutomatica: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
  passwordCrypted?: InputMaybe<Scalars['String']>;
  readPec: Scalars['Boolean'];
  saveToSent: Scalars['Boolean'];
  /** ISO-8601 */
  tsCreation?: InputMaybe<Scalars['DateTime']>;
  uffici?: InputMaybe<Array<InputMaybe<UfficioInput>>>;
  username?: InputMaybe<Scalars['String']>;
  utente?: InputMaybe<Scalars['String']>;
};

export type PecRegolaFinestraTemporaleInput = {
  __typename?: 'PecRegolaFinestraTemporaleInput';
  dayOfWeek?: Maybe<Scalars['BigInteger']>;
  end?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
};

export type PecRegolaFinestraTemporaleInputInput = {
  dayOfWeek?: InputMaybe<Scalars['BigInteger']>;
  end?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['String']>;
};

export type PecRegolaInputDto = {
  __typename?: 'PecRegolaInputDTO';
  description?: Maybe<Scalars['String']>;
  durationMinutes?: Maybe<Scalars['BigInteger']>;
  enabled?: Maybe<Scalars['Boolean']>;
  finestre?: Maybe<Array<Maybe<PecRegolaFinestraTemporaleInput>>>;
  idCategoriaRegola?: Maybe<Scalars['BigInteger']>;
  idEmail?: Maybe<Scalars['BigInteger']>;
  threshold?: Maybe<Scalars['BigInteger']>;
};

export type PecRegolaInputDtoInput = {
  description?: InputMaybe<Scalars['String']>;
  durationMinutes?: InputMaybe<Scalars['BigInteger']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  finestre?: InputMaybe<Array<InputMaybe<PecRegolaFinestraTemporaleInputInput>>>;
  idCategoriaRegola?: InputMaybe<Scalars['BigInteger']>;
  idEmail?: InputMaybe<Scalars['BigInteger']>;
  threshold?: InputMaybe<Scalars['BigInteger']>;
};

export type PecRegoleDto = {
  __typename?: 'PecRegoleDTO';
  list?: Maybe<Array<Maybe<PecRegolaInputDto>>>;
};

export type PermessiFascicoloDipendente = {
  __typename?: 'PermessiFascicoloDipendente';
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  titolario?: Maybe<Titolario>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  uffici?: Maybe<Array<Maybe<Ufficio>>>;
  visibilitaArchivista?: Maybe<PermessoFascicoloDipendente>;
  visibilitaDipendente?: Maybe<PermessoFascicoloDipendente>;
  visibilitaDirigente?: Maybe<PermessoFascicoloDipendente>;
  visibilitaProtocollatore?: Maybe<PermessoFascicoloDipendente>;
  visibilitaUtente?: Maybe<PermessoFascicoloDipendente>;
};

export type PermessiVisibilitaOutputDto = {
  __typename?: 'PermessiVisibilitaOutputDTO';
  pageCount: Scalars['Int'];
  permessi?: Maybe<Array<Maybe<VisibilitaTitolario>>>;
  totalResults: Scalars['BigInteger'];
};

export enum PermessoFascicoloDipendente {
  No = 'no',
  Protocollazione = 'protocollazione',
  Visualizzazione = 'visualizzazione'
}

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

export type ProtocolliClassificazione = {
  __typename?: 'ProtocolliClassificazione';
  id?: Maybe<Scalars['BigInteger']>;
  idTitolario?: Maybe<Scalars['BigInteger']>;
  idUtenteLastOperation?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  protocollo?: Maybe<Protocollo>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsDeleted?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsUpdate?: Maybe<Scalars['DateTime']>;
};

export type ProtocolliOutputDto = {
  __typename?: 'ProtocolliOutputDTO';
  pageCount: Scalars['BigInteger'];
  protocolli?: Maybe<Array<Maybe<Protocollo>>>;
  totalResults: Scalars['BigInteger'];
};

export type Protocollo = {
  __typename?: 'Protocollo';
  allegati?: Maybe<Array<Maybe<Allegato>>>;
  assegnatari?: Maybe<Scalars['String']>;
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  corpoPecPeo?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  dataProtocolloEmergenza?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataProtocolloMittente?: Maybe<Scalars['DateTime']>;
  destinatari?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  idMittente?: Maybe<Scalars['String']>;
  idUtente?: Maybe<Scalars['String']>;
  idUtenteLastOperation?: Maybe<Scalars['String']>;
  indirizzoPecPeo?: Maybe<Scalars['String']>;
  invioEmailMultiplo?: Maybe<Scalars['Int']>;
  metaType?: Maybe<Scalars['String']>;
  metodoSpedizione?: Maybe<MetodoSpedizione>;
  mittente?: Maybe<Scalars['String']>;
  nProtocollo?: Maybe<Scalars['String']>;
  nProtocolloCircolare?: Maybe<Scalars['String']>;
  nProtocolloEmergenza?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  numeroProgressivoForSignature?: Maybe<Scalars['String']>;
  oggetto?: Maybe<Scalars['String']>;
  protocolliClassificazioneList?: Maybe<Array<Maybe<ProtocolliClassificazione>>>;
  protocolloMittente?: Maybe<Scalars['String']>;
  raccomandate?: Maybe<Array<Maybe<RaccomandataProtocollo>>>;
  stato?: Maybe<StatoProtocollo>;
  tipoRegistrazione?: Maybe<TipoRegistrazione>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  tsCreationFormatted?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
  utente?: Maybe<Scalars['String']>;
};

export type ProtocolloEmergenzaDto = {
  __typename?: 'ProtocolloEmergenzaDTO';
  /** ISO-8601 */
  dataProtocolloEmergenza?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataProtocolloMittente?: Maybe<Scalars['DateTime']>;
  destinatari?: Maybe<Scalars['String']>;
  empty: Scalars['Boolean'];
  imported: Scalars['Boolean'];
  metodo?: Maybe<Scalars['String']>;
  mittente?: Maybe<Scalars['String']>;
  nAutorizzazione?: Maybe<Scalars['String']>;
  nProtocollo?: Maybe<Scalars['String']>;
  nProtocolloEmergenza?: Maybe<Scalars['String']>;
  nProtocolloMittente?: Maybe<Scalars['String']>;
  numeroProtocolloEmergenza?: Maybe<Scalars['String']>;
  oggetto?: Maybe<Scalars['String']>;
  tipologia?: Maybe<Scalars['String']>;
  titolario?: Maybe<Scalars['String']>;
  valid: Scalars['Boolean'];
};

export type ProtocolloInputInput = {
  allegati?: InputMaybe<Array<InputMaybe<AllegatoInputInput>>>;
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  corpoPecPeo?: InputMaybe<Scalars['String']>;
  /** ISO-8601 */
  dataProtocolloMittente?: InputMaybe<Scalars['DateTime']>;
  idTitolario?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  idUtente?: InputMaybe<Scalars['String']>;
  idUtenteLastOperation?: InputMaybe<Scalars['String']>;
  indirizzoPecPeo?: InputMaybe<Scalars['String']>;
  invioEmailMultiplo?: InputMaybe<Scalars['Int']>;
  metodoSpedizione?: InputMaybe<Scalars['String']>;
  mittente?: InputMaybe<MittenteProtocolloInputInput>;
  nProtocollo?: InputMaybe<Scalars['String']>;
  nProtocolloCircolare?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  old_idMittente?: InputMaybe<Scalars['String']>;
  old_mittente?: InputMaybe<Scalars['String']>;
  protocolloMittente?: InputMaybe<Scalars['String']>;
  referenti?: InputMaybe<Array<InputMaybe<ReferenteProtocolloInputInput>>>;
  stato?: InputMaybe<Scalars['String']>;
  tagList?: InputMaybe<Array<InputMaybe<TagInput>>>;
  tipoRegistrazione?: InputMaybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: InputMaybe<Scalars['DateTime']>;
  utente?: InputMaybe<Scalars['String']>;
};

export type ProtocolloUpdateInputInput = {
  allegati?: InputMaybe<Array<InputMaybe<AllegatoInputInput>>>;
  cdrCode?: InputMaybe<Scalars['String']>;
  idTitolario?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  nProtocollo?: InputMaybe<Scalars['String']>;
  nProtocolloCircolare?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
};

/** Query root */
export type Query = {
  __typename?: 'Query';
  cercaRaccomandate?: Maybe<RaccomandataProtocolloDto>;
  cittaDaCap?: Maybe<Array<Maybe<Scalars['String']>>>;
  configById?: Maybe<PecPeo>;
  createFascicoliDipendenti: Scalars['Boolean'];
  createFascicoliFattureDetermine: Scalars['Boolean'];
  deleteAllegatiNonUtilizzati: Scalars['Boolean'];
  dettaglioGruppo?: Maybe<GruppoOutputDto>;
  dettaglioProtocollo?: Maybe<DettaglioProtocolloDto>;
  dettaglioTitolario?: Maybe<TitolarioOutputDto>;
  findAllPecPeoIdByEmail?: Maybe<Array<Maybe<Scalars['BigInteger']>>>;
  findReferenti?: Maybe<ReferentiOutputDto>;
  forceGetAllOffices?: Maybe<UfficiOutputDto>;
  forceGetAllUsers?: Maybe<UtentiOutputDto>;
  forceGetAllUsersWithRoleAndCdr?: Maybe<UtentiOutputDto>;
  forceGetTitolario?: Maybe<TitolariOutputDto>;
  generateBarcode?: Maybe<Scalars['String']>;
  generateRicevuta?: Maybe<Scalars['String']>;
  getAllAnagrafica?: Maybe<AnagraficaDtoList>;
  getAllExtensions?: Maybe<Array<Maybe<Scalars['String']>>>;
  getAllGruppi?: Maybe<GruppiOutputDto>;
  getAllOffices?: Maybe<UfficiOutputDto>;
  getAllPecConfigurations?: Maybe<Array<Maybe<PecPeo>>>;
  getAllPecEscluse?: Maybe<Array<Maybe<PecEscluseRispostaAutomatica>>>;
  getAllPecPeoByCdrCode?: Maybe<Array<Maybe<PecPeo>>>;
  getAllPecPeoFromEmails?: Maybe<Array<Maybe<PecPeo>>>;
  getAllPermessiFascicoloDipendente?: Maybe<Array<Maybe<PermessiFascicoloDipendente>>>;
  getAllProtocolliByFascicolo?: Maybe<Array<Maybe<Protocollo>>>;
  getAllTag?: Maybe<Array<Maybe<Tag>>>;
  getAllTitolarioByName?: Maybe<Array<Maybe<Scalars['BigInteger']>>>;
  getAllUsers?: Maybe<UtentiOutputDto>;
  getAllegati?: Maybe<AllegatiOutputDto>;
  getAllegatiDiscarded?: Maybe<AllegatiOutputDto>;
  getAssegnatariTooltipForProtocollo?: Maybe<Array<Maybe<ReferentiProtocollo>>>;
  getClassificazioneStringByIdProtocollo?: Maybe<Array<Maybe<TitolarioOutputDto>>>;
  getConfigurations?: Maybe<ConfigurazioniPeOutputDto>;
  getConfiguredUsers?: Maybe<Array<Maybe<PecPeo>>>;
  getContattoInad?: Maybe<Scalars['String']>;
  getDettaglioAnagrafica?: Maybe<AnagraficaDto>;
  getEmails?: Maybe<EmailOutputDto>;
  getLoginConservazione?: Maybe<LoginConservazioneDto>;
  getLoginRaccomandata?: Maybe<LoginRaccomandataDto>;
  getMaxLivelloFascicolazioneForTitolario: Scalars['Int'];
  getMittenteFileds?: Maybe<RaccomandataMittenteFields>;
  getModelliAutomaticiByCdrCode?: Maybe<Array<Maybe<ModelloAutomaticoDto>>>;
  getPathForTitolarioItem?: Maybe<Scalars['String']>;
  getPdfRegistroGiornaliero?: Maybe<Scalars['String']>;
  getPecEscluseList?: Maybe<PecEscluseRispostaAutomaticaDtoList>;
  getPecPeoByTipologiaPosta?: Maybe<Array<Maybe<Scalars['String']>>>;
  getPecPeoByUtenteAndCdr?: Maybe<Array<Maybe<Scalars['String']>>>;
  getPecRegole?: Maybe<PecRegoleDto>;
  getPermessiVisibilita?: Maybe<PermessiVisibilitaOutputDto>;
  getProtocolli?: Maybe<ProtocolliOutputDto>;
  getProtocolliByFascicolo?: Maybe<ProtocolliOutputDto>;
  getProtocolliNative?: Maybe<ProtocolliOutputDto>;
  getProtocolloAllegatoPrincipale?: Maybe<Allegato>;
  getProtocolloById?: Maybe<Protocollo>;
  getReferenti?: Maybe<ReferentiProtocolloOutputDto>;
  getReferentiDto?: Maybe<ReferentiProtocolloOutputDto>;
  getRegistroGiornaliero?: Maybe<RegistroGiornalieroOutputDto>;
  getStoricoProtocollo?: Maybe<StoricoOutputDto>;
  getStoricoRegistroGiornaliero?: Maybe<StoricoOutputDto>;
  getStoricoTitolario?: Maybe<StoricoOutputDto>;
  getTagList?: Maybe<TagDtoList>;
  getTitolario?: Maybe<TitolariOutputDto>;
  getTitolarioById?: Maybe<Titolario>;
  inviaConservazioneForDay: Scalars['Boolean'];
  listaCap?: Maybe<Array<Maybe<Scalars['String']>>>;
  listaCapEsteso?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  protocolloByNumero?: Maybe<Protocollo>;
  refreshGetAllUsersAndAdminsFromSSO: Scalars['Boolean'];
  searchModelliAutomatici?: Maybe<ModelloAutomaticoOutputDto>;
  titolarioFindById?: Maybe<Titolario>;
  vieDaCap?: Maybe<Array<Maybe<Scalars['String']>>>;
  vieDaCitta?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** Query root */
export type QueryCercaRaccomandateArgs = {
  ricercaRaccomandate?: InputMaybe<RicercaRaccomandataDtoInput>;
};


/** Query root */
export type QueryCittaDaCapArgs = {
  cap?: InputMaybe<Scalars['String']>;
  prefix?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryConfigByIdArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryCreateFascicoliDipendentiArgs = {
  endIndex?: InputMaybe<Scalars['BigInteger']>;
  forceRewritePermessi?: InputMaybe<Scalars['Boolean']>;
  forceRewritePermessiExDipendenti?: InputMaybe<Scalars['Boolean']>;
  startIndex?: InputMaybe<Scalars['BigInteger']>;
  userAuthId?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryDettaglioGruppoArgs = {
  groupId?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryDettaglioProtocolloArgs = {
  nProtocollo?: InputMaybe<Scalars['String']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryDettaglioTitolarioArgs = {
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryFindAllPecPeoIdByEmailArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
  indirizzoEmail?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryFindReferentiArgs = {
  ricerca_referenti?: InputMaybe<RicercaReferentiDtoInput>;
};


/** Query root */
export type QueryForceGetAllUsersWithRoleAndCdrArgs = {
  cdr?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search?: InputMaybe<Scalars['String']>;
  size: Scalars['Int'];
};


/** Query root */
export type QueryForceGetTitolarioArgs = {
  dto?: InputMaybe<RicercaTitolarioDtoInput>;
};


/** Query root */
export type QueryGenerateBarcodeArgs = {
  nProtocollo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGenerateRicevutaArgs = {
  nProtocollo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetAllAnagraficaArgs = {
  ricercaAnagrafica?: InputMaybe<RicercaAnagraficaDtoInput>;
};


/** Query root */
export type QueryGetAllGruppiArgs = {
  ricercaGruppi?: InputMaybe<RicercaGruppiDtoInput>;
};


/** Query root */
export type QueryGetAllPecEscluseArgs = {
  search?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetAllProtocolliByFascicoloArgs = {
  idFascicolo?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryGetAllTagArgs = {
  search?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetAllTitolarioByNameArgs = {
  nome?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetAllegatiArgs = {
  ricercaAllegatiDTO?: InputMaybe<RicercaAllegatiDtoInput>;
};


/** Query root */
export type QueryGetAllegatiDiscardedArgs = {
  ricercaAllegatiDTO?: InputMaybe<RicercaAllegatiDtoInput>;
};


/** Query root */
export type QueryGetAssegnatariTooltipForProtocolloArgs = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryGetClassificazioneStringByIdProtocolloArgs = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryGetConfigurationsArgs = {
  ricerca?: InputMaybe<RicercaConfigPedtoInput>;
};


/** Query root */
export type QueryGetContattoInadArgs = {
  codiceFiscale?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetDettaglioAnagraficaArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryGetEmailsArgs = {
  ricerca?: InputMaybe<RicercaEmailDtoInput>;
};


/** Query root */
export type QueryGetModelliAutomaticiByCdrCodeArgs = {
  selectedOffice?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetPathForTitolarioItemArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryGetPdfRegistroGiornalieroArgs = {
  data?: InputMaybe<Scalars['DateTime']>;
};


/** Query root */
export type QueryGetPecEscluseListArgs = {
  searchPecEscluse?: InputMaybe<RicercaPecEscluseRispostaAutomaticaDtoInput>;
};


/** Query root */
export type QueryGetPecPeoByTipologiaPostaArgs = {
  idUtente?: InputMaybe<Scalars['String']>;
  selectedCdrCode?: InputMaybe<Scalars['String']>;
  tipologiaPosta?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetPecPeoByUtenteAndCdrArgs = {
  idUtente?: InputMaybe<Scalars['String']>;
  selectedCdrCode?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetPecRegoleArgs = {
  idEmail?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryGetPermessiVisibilitaArgs = {
  visibilitaDTO?: InputMaybe<RicercaPermessiVisibilitaDtoInput>;
};


/** Query root */
export type QueryGetProtocolliArgs = {
  ricerca_protocolli?: InputMaybe<RicercaProtocolliDtoInput>;
};


/** Query root */
export type QueryGetProtocolliByFascicoloArgs = {
  ricerca_protocolli?: InputMaybe<RicercaProtocolliDtoInput>;
};


/** Query root */
export type QueryGetProtocolliNativeArgs = {
  ricerca_protocolli?: InputMaybe<RicercaProtocolliDtoInput>;
};


/** Query root */
export type QueryGetProtocolloAllegatoPrincipaleArgs = {
  nProtocollo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryGetProtocolloByIdArgs = {
  id: Scalars['BigInteger'];
};


/** Query root */
export type QueryGetReferentiArgs = {
  ricercaReferentiProtocollo?: InputMaybe<RicercaReferentiProtocolloDtoInput>;
};


/** Query root */
export type QueryGetReferentiDtoArgs = {
  ricercaReferentiProtocollo?: InputMaybe<RicercaReferentiProtocolloDtoInput>;
};


/** Query root */
export type QueryGetRegistroGiornalieroArgs = {
  ricercaRegistroDTO?: InputMaybe<RicercaRegistiGiornalieriDtoInput>;
};


/** Query root */
export type QueryGetStoricoProtocolloArgs = {
  ricerca_storico?: InputMaybe<RicercaStoricoDtoInput>;
};


/** Query root */
export type QueryGetStoricoRegistroGiornalieroArgs = {
  ricerca_storico?: InputMaybe<RicercaStoricoDtoInput>;
};


/** Query root */
export type QueryGetStoricoTitolarioArgs = {
  ricerca_storico?: InputMaybe<RicercaStoricoDtoInput>;
};


/** Query root */
export type QueryGetTagListArgs = {
  searchTag?: InputMaybe<RicercaTagDtoInput>;
};


/** Query root */
export type QueryGetTitolarioArgs = {
  dto?: InputMaybe<RicercaTitolarioDtoInput>;
};


/** Query root */
export type QueryGetTitolarioByIdArgs = {
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryInviaConservazioneForDayArgs = {
  date?: InputMaybe<Scalars['DateTime']>;
};


/** Query root */
export type QueryListaCapArgs = {
  prefix?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryListaCapEstesoArgs = {
  citta?: InputMaybe<Scalars['String']>;
  prefix?: InputMaybe<Scalars['String']>;
  tipoRicerca?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryProtocolloByNumeroArgs = {
  nProtocollo?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QuerySearchModelliAutomaticiArgs = {
  input?: InputMaybe<RicercaModelloAutomaticoDtoInput>;
};


/** Query root */
export type QueryTitolarioFindByIdArgs = {
  id?: InputMaybe<Scalars['BigInteger']>;
};


/** Query root */
export type QueryVieDaCapArgs = {
  cap?: InputMaybe<Scalars['String']>;
  prefix?: InputMaybe<Scalars['String']>;
};


/** Query root */
export type QueryVieDaCittaArgs = {
  citta?: InputMaybe<Scalars['String']>;
};

export type RaccomandataMittenteFields = {
  __typename?: 'RaccomandataMittenteFields';
  cap?: Maybe<Scalars['String']>;
  citta?: Maybe<Scalars['String']>;
  civico?: Maybe<Scalars['String']>;
  dipartimentoServizio?: Maybe<Scalars['String']>;
  indirizzo?: Maybe<Scalars['String']>;
  mittente?: Maybe<Scalars['String']>;
  presso?: Maybe<Scalars['String']>;
  provincia?: Maybe<Scalars['String']>;
};

export type RaccomandataProtocollo = {
  __typename?: 'RaccomandataProtocollo';
  allegato?: Maybe<Allegato>;
  costo?: Maybe<Scalars['String']>;
  destinatario?: Maybe<Scalars['String']>;
  destinatarioCap?: Maybe<Scalars['String']>;
  destinatarioCitta?: Maybe<Scalars['String']>;
  destinatarioCivico?: Maybe<Scalars['String']>;
  destinatarioIndirizzo?: Maybe<Scalars['String']>;
  destinatarioIndirizzo2?: Maybe<Scalars['String']>;
  destinatarioProvincia?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  idRaccomandata?: Maybe<Scalars['String']>;
  idUtente?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  mittente?: Maybe<Scalars['String']>;
  mittenteCap?: Maybe<Scalars['String']>;
  mittenteCitta?: Maybe<Scalars['String']>;
  mittenteCivico?: Maybe<Scalars['String']>;
  mittenteIndirizzo?: Maybe<Scalars['String']>;
  mittentePresso?: Maybe<Scalars['String']>;
  mittenteProvincia?: Maybe<Scalars['String']>;
  nomeUtente?: Maybe<Scalars['String']>;
  numero?: Maybe<Scalars['String']>;
  protocollo?: Maybe<Protocollo>;
  stato?: Maybe<StatoRaccomandataProtocollo>;
  statoConsegna?: Maybe<Scalars['String']>;
  tipo?: Maybe<TipoRaccomandata>;
  /** ISO-8601 */
  tsConsegna?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsInoltro?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsInserimento?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsUpdate?: Maybe<Scalars['DateTime']>;
  ulterioreDatoMittente?: Maybe<Scalars['String']>;
};

export type RaccomandataProtocolloDto = {
  __typename?: 'RaccomandataProtocolloDTO';
  pageCount: Scalars['BigInteger'];
  raccomandate?: Maybe<Array<Maybe<RaccomandataProtocollo>>>;
  totalResults: Scalars['BigInteger'];
};

export type RaccomandataProtocolloInputInput = {
  destinatario?: InputMaybe<Scalars['String']>;
  destinatarioCap?: InputMaybe<Scalars['String']>;
  destinatarioCitta?: InputMaybe<Scalars['String']>;
  destinatarioCivico?: InputMaybe<Scalars['String']>;
  destinatarioIndirizzo?: InputMaybe<Scalars['String']>;
  destinatarioIndirizzo2?: InputMaybe<Scalars['String']>;
  destinatarioProvincia?: InputMaybe<Scalars['String']>;
  idAllegato?: InputMaybe<Scalars['BigInteger']>;
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  mittente?: InputMaybe<Scalars['String']>;
  mittenteCap?: InputMaybe<Scalars['String']>;
  mittenteCitta?: InputMaybe<Scalars['String']>;
  mittenteCivico?: InputMaybe<Scalars['String']>;
  mittenteIndirizzo?: InputMaybe<Scalars['String']>;
  mittentePresso?: InputMaybe<Scalars['String']>;
  mittenteProvincia?: InputMaybe<Scalars['String']>;
  tipo?: InputMaybe<Scalars['String']>;
  ulterioreDatoMittente?: InputMaybe<Scalars['String']>;
};

export type ReferenteOutputDto = {
  __typename?: 'ReferenteOutputDTO';
  cap?: Maybe<Scalars['String']>;
  cfPiva?: Maybe<Scalars['String']>;
  children?: Maybe<Array<Maybe<ReferenteOutputDto>>>;
  citta?: Maybe<Scalars['String']>;
  cognome?: Maybe<Scalars['String']>;
  descrizione?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  idDestinatario?: Maybe<Scalars['String']>;
  indirizzo?: Maybe<Scalars['String']>;
  ipaResponseDTO?: Maybe<IpaResponseDto>;
  label?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  pec?: Maybe<Scalars['String']>;
  ragioneSociale?: Maybe<Scalars['String']>;
  statoProtocollo?: Maybe<Scalars['String']>;
  tipo?: Maybe<Scalars['String']>;
};

export type ReferenteOutputDtoInput = {
  cap?: InputMaybe<Scalars['String']>;
  cfPiva?: InputMaybe<Scalars['String']>;
  children?: InputMaybe<Array<InputMaybe<ReferenteOutputDtoInput>>>;
  citta?: InputMaybe<Scalars['String']>;
  cognome?: InputMaybe<Scalars['String']>;
  descrizione?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  idDestinatario?: InputMaybe<Scalars['String']>;
  indirizzo?: InputMaybe<Scalars['String']>;
  ipaResponseDTO?: InputMaybe<IpaResponseDtoInput>;
  label?: InputMaybe<Scalars['String']>;
  nome?: InputMaybe<Scalars['String']>;
  pec?: InputMaybe<Scalars['String']>;
  ragioneSociale?: InputMaybe<Scalars['String']>;
  statoProtocollo?: InputMaybe<Scalars['String']>;
  tipo?: InputMaybe<Scalars['String']>;
};

export type ReferenteProtocolloInputInput = {
  attribuzione?: InputMaybe<Scalars['String']>;
  cdrAssegnatario?: InputMaybe<Scalars['String']>;
  codAmm?: InputMaybe<Scalars['String']>;
  codAoo?: InputMaybe<Scalars['String']>;
  codUniOu?: InputMaybe<Scalars['String']>;
  idAssegnatario?: InputMaybe<Scalars['String']>;
  isAssegnato?: InputMaybe<Scalars['Boolean']>;
  isIpa?: InputMaybe<Scalars['Boolean']>;
  nomeAssegnatario?: InputMaybe<Scalars['String']>;
  tipoDestinatario?: InputMaybe<Scalars['String']>;
  tipologiaIpa?: InputMaybe<Scalars['String']>;
  usePeoForSendEmail?: InputMaybe<Scalars['Boolean']>;
};

export type ReferentiOutputDto = {
  __typename?: 'ReferentiOutputDTO';
  pageCount: Scalars['BigInteger'];
  referenti?: Maybe<Array<Maybe<ReferenteOutputDto>>>;
  totalResults: Scalars['BigInteger'];
};

export type ReferentiProtocollo = {
  __typename?: 'ReferentiProtocollo';
  assegnato: Scalars['Boolean'];
  attribuzione?: Maybe<Scalars['String']>;
  creationOption: Scalars['Boolean'];
  id?: Maybe<Scalars['BigInteger']>;
  idDestinatario?: Maybe<Scalars['String']>;
  idMittente?: Maybe<Scalars['String']>;
  idProtocollo?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  nomeDestinatario?: Maybe<Scalars['String']>;
  nomeMittente?: Maybe<Scalars['String']>;
  noteAssegnazione?: Maybe<Scalars['String']>;
  statoProtocollo?: Maybe<StatoProtocollo>;
  tipoDestinatario?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStatoProtocollo?: Maybe<Scalars['DateTime']>;
  ufficioLavorazione?: Maybe<Scalars['String']>;
};

export type ReferentiProtocolloDto = {
  __typename?: 'ReferentiProtocolloDTO';
  assegnato: Scalars['Boolean'];
  attribuzione?: Maybe<Scalars['String']>;
  creationOption: Scalars['Boolean'];
  id?: Maybe<Scalars['BigInteger']>;
  idDestinatario?: Maybe<Scalars['String']>;
  idMittente?: Maybe<Scalars['String']>;
  idProtocollo?: Maybe<Scalars['BigInteger']>;
  nomeDestinatario?: Maybe<Scalars['String']>;
  nomeMittente?: Maybe<Scalars['String']>;
  noteAssegnazione?: Maybe<Scalars['String']>;
  revocabile: Scalars['Boolean'];
  statoProtocollo?: Maybe<StatoProtocollo>;
  tipoDestinatario?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStartVali?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsStatoProtocollo?: Maybe<Scalars['DateTime']>;
};

export type ReferentiProtocolloOutputDto = {
  __typename?: 'ReferentiProtocolloOutputDTO';
  pageCount: Scalars['BigInteger'];
  referenti?: Maybe<Array<Maybe<ReferentiProtocolloDto>>>;
  totalResults: Scalars['BigInteger'];
};

export type RegistroGiornaliero = {
  __typename?: 'RegistroGiornaliero';
  /** ISO-8601 */
  dataRegistro?: Maybe<Scalars['DateTime']>;
  esitoVersamento?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  riferimentoMinio?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  urn?: Maybe<Scalars['String']>;
};

export type RegistroGiornalieroOutputDto = {
  __typename?: 'RegistroGiornalieroOutputDTO';
  pageCount: Scalars['BigInteger'];
  registri?: Maybe<Array<Maybe<RegistroGiornaliero>>>;
  totalResults: Scalars['BigInteger'];
};

export type RicercaAllegatiDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaAnagraficaDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cfPiva?: InputMaybe<Scalars['String']>;
  cognome?: InputMaybe<Scalars['String']>;
  gruppoId?: InputMaybe<Scalars['BigInteger']>;
  mail?: InputMaybe<Scalars['String']>;
  nome?: InputMaybe<Scalars['String']>;
  onlyCertified?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  pec?: InputMaybe<Scalars['String']>;
  ragioneSociale?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaConfigPedtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  indirizzo?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  tipologiaPosta?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ufficio?: InputMaybe<Scalars['String']>;
  utente?: InputMaybe<Scalars['String']>;
};

export type RicercaEmailDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ISO-8601 */
  dataInvioFrom?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataInvioTo?: InputMaybe<Scalars['DateTime']>;
  emailDirection?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  indirizziEmail?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isAssegnato?: InputMaybe<Scalars['Boolean']>;
  isClassificato?: InputMaybe<Scalars['Boolean']>;
  mostraNonLavorate?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  selectedCdr?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  statoInvio?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  statoProtocollazione?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tipoEmail?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type RicercaGruppiDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  nome?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaModelloAutomaticoDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdrCode?: InputMaybe<Scalars['String']>;
  metodoSpedizione?: InputMaybe<Scalars['String']>;
  nomeModello?: InputMaybe<Scalars['String']>;
  oggettoProtocollo?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  tipoRegistrazione?: InputMaybe<Scalars['String']>;
};

export type RicercaPecEscluseRispostaAutomaticaDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaPermessiVisibilitaDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdrNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
  page?: InputMaybe<Scalars['Int']>;
  permesso?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaProtocolliDtoInput = {
  anno?: InputMaybe<Scalars['Int']>;
  assegnatari?: InputMaybe<Scalars['String']>;
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdrCode?: InputMaybe<Scalars['String']>;
  /** ISO-8601 */
  dataCreazioneEmergenzaFrom?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataCreazioneEmergenzaTo?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataCreazioneFrom?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataCreazioneTo?: InputMaybe<Scalars['DateTime']>;
  destinatari?: InputMaybe<Scalars['String']>;
  filtroAll: Scalars['Boolean'];
  filtroUfficio: Scalars['Boolean'];
  idFascicoli?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  idFascicolo?: InputMaybe<Scalars['BigInteger']>;
  metodoSpedizione?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  mittente?: InputMaybe<Scalars['String']>;
  nomeTitolario?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  numero?: InputMaybe<Scalars['String']>;
  numeroEmergenza?: InputMaybe<Scalars['String']>;
  oggetto?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  ricercaAvanzata: Scalars['Boolean'];
  search?: InputMaybe<Scalars['String']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  stato?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tagList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tipoRegistrazione?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type RicercaRaccomandataDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  stato?: InputMaybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreationTo?: InputMaybe<Scalars['DateTime']>;
};

export type RicercaReferentiDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ipaCodAmm?: InputMaybe<Scalars['String']>;
  ipaCodAoo?: InputMaybe<Scalars['String']>;
  metodoSpedizione?: InputMaybe<Scalars['String']>;
  mittente: Scalars['Boolean'];
  noCache: Scalars['Boolean'];
  page?: InputMaybe<Scalars['Int']>;
  ricercaINAD: Scalars['Boolean'];
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  tipoRegistrazione?: InputMaybe<Scalars['String']>;
  tipoRicercaIPA?: InputMaybe<Scalars['String']>;
  tipologiaRubrica?: InputMaybe<TipologiaRubrica>;
};

export type RicercaReferentiProtocolloDtoInput = {
  attribuzioneList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  excludeStatoRifiutato: Scalars['Boolean'];
  nomeDestinatario?: InputMaybe<Scalars['String']>;
  numero?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  statoProtocollo?: InputMaybe<Array<InputMaybe<StatoProtocollo>>>;
  tipoUtenteList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type RicercaRegistiGiornalieriDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ISO-8601 */
  dataRegistroFrom?: InputMaybe<Scalars['DateTime']>;
  /** ISO-8601 */
  dataRegistroTo?: InputMaybe<Scalars['DateTime']>;
  note?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaStoricoDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdrCode?: InputMaybe<Scalars['String']>;
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  idRegistroGiornaliero?: InputMaybe<Scalars['BigInteger']>;
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
  isFilteredByCdr?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaTagDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
};

export type RicercaTitolarioDtoInput = {
  cdr?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cdrCode?: InputMaybe<Scalars['String']>;
  hideFascicoliDeleted: Scalars['Boolean'];
  idPadre?: InputMaybe<Scalars['BigInteger']>;
  lastIdTitolario: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  showFascicoliChiusi: Scalars['Boolean'];
  showFascicoliDeleted: Scalars['Boolean'];
  showFascicoliForProtocolli: Scalars['Boolean'];
  showFascicoliWithDocumenti: Scalars['Boolean'];
  showFascicoliWithProtocolli: Scalars['Boolean'];
  size?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortInputInput>;
  startIndex: Scalars['Int'];
};

export type Role = {
  __typename?: 'Role';
  full_name?: Maybe<Scalars['String']>;
  hierarchy_level: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type SortInputInput = {
  by?: InputMaybe<Scalars['String']>;
  desc?: InputMaybe<Scalars['Boolean']>;
};

export enum StatoInvio {
  DaInviare = 'DA_INVIARE',
  Inviato = 'INVIATO',
  InvioFallito = 'INVIO_FALLITO',
  SalvareComeAllegato = 'SALVARE_COME_ALLEGATO',
  SalvareInInbox = 'SALVARE_IN_INBOX'
}

export enum StatoProtocollo {
  Annullato = 'Annullato',
  Assegnato = 'Assegnato',
  Completato = 'Completato',
  DaAssegnare = 'DaAssegnare',
  DaPrendereInCarico = 'DaPrendereInCarico',
  InCorso = 'InCorso',
  PresoInCarico = 'PresoInCarico',
  RichiestaDiAnnullamento = 'RichiestaDiAnnullamento',
  Rifiutato = 'Rifiutato'
}

export type StatoProtocolloInputInput = {
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
  statoProtocollo?: InputMaybe<Scalars['String']>;
};

export enum StatoRaccomandataProtocollo {
  Accettato = 'accettato',
  AttesaStampa = 'attesaStampa',
  Confermato = 'confermato',
  ConsegnaParziale = 'consegnaParziale',
  Consegnato = 'consegnato',
  Elaborato = 'elaborato',
  Eliminato = 'eliminato',
  Errore = 'errore',
  InCoda = 'inCoda',
  Inviato = 'inviato',
  Nessuno = 'nessuno',
  NonConsegnato = 'nonConsegnato',
  Normalizzazione = 'normalizzazione',
  Rimandato = 'rimandato',
  Verificato = 'verificato'
}

export type Storico = {
  __typename?: 'Storico';
  id?: Maybe<Scalars['BigInteger']>;
  idProtocollo?: Maybe<Scalars['BigInteger']>;
  idRegistroGiornaliero?: Maybe<Scalars['BigInteger']>;
  idTitolario?: Maybe<Scalars['BigInteger']>;
  idUtente?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  operazione?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  utente?: Maybe<Scalars['String']>;
};

export type StoricoOutputDto = {
  __typename?: 'StoricoOutputDTO';
  logStorici?: Maybe<Array<Maybe<Storico>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
};

export type Tag = {
  __typename?: 'Tag';
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
};

export type TagDto = {
  __typename?: 'TagDTO';
  id?: Maybe<Scalars['BigInteger']>;
  nome?: Maybe<Scalars['String']>;
};

export type TagDtoList = {
  __typename?: 'TagDTOList';
  pageCount: Scalars['BigInteger'];
  tagList?: Maybe<Array<Maybe<TagDto>>>;
  totalResults: Scalars['BigInteger'];
};

export type TagInput = {
  id?: InputMaybe<Scalars['BigInteger']>;
  nome?: InputMaybe<Scalars['String']>;
};

export type TagInputInput = {
  id?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>>>;
  nome?: InputMaybe<Scalars['String']>;
};

export enum TipoRaccomandata {
  Lettera = 'Lettera',
  Raccomandata = 'Raccomandata',
  RaccomandataAr = 'RaccomandataAR'
}

export enum TipoRegistrazione {
  Circolare = 'Circolare',
  Entrata = 'Entrata',
  Interno = 'Interno',
  Uscita = 'Uscita'
}

export enum TipologiaIpaResponse {
  Aoo = 'AOO',
  Ente = 'ENTE',
  Uo = 'UO'
}

export enum TipologiaPosta {
  Pec = 'PEC',
  Peo = 'PEO',
  Ricevuta = 'RICEVUTA'
}

export enum TipologiaRubrica {
  AnagraficaInterna = 'ANAGRAFICA_INTERNA',
  Gruppi = 'GRUPPI',
  Inad = 'INAD',
  Ipa = 'IPA'
}

export enum TipologiaTitolario {
  FascicoloLv1 = 'FascicoloLv1',
  FascicoloLvN = 'FascicoloLvN',
  Sezione = 'Sezione',
  SottoSezione = 'SottoSezione',
  Titolo = 'Titolo'
}

export type TitolariOutputDto = {
  __typename?: 'TitolariOutputDTO';
  currentPage: Scalars['Int'];
  hasMore: Scalars['Boolean'];
  lastIdTitolario: Scalars['BigInteger'];
  lastIndex: Scalars['Int'];
  nextPage: Scalars['Int'];
  titolario?: Maybe<Array<Maybe<TitolarioOutputDto>>>;
};

export type Titolario = {
  __typename?: 'Titolario';
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  idPadre?: Maybe<Scalars['BigInteger']>;
  idUtenteCreatore?: Maybe<Scalars['String']>;
  idUtenteLastOperation?: Maybe<Scalars['String']>;
  isFascicoloDipendente?: Maybe<Scalars['Boolean']>;
  leaf?: Maybe<Scalars['Boolean']>;
  metaType?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  nomeUtenteCreatore?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  permessiFascicoloDipendente?: Maybe<Array<Maybe<PermessiFascicoloDipendente>>>;
  tipologiaTitolario?: Maybe<TipologiaTitolario>;
  /** ISO-8601 */
  tsChiusura?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsDeleted?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsUpdate?: Maybe<Scalars['DateTime']>;
};

export type TitolarioInputInput = {
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  fascicoloDipendente: Scalars['Boolean'];
  id?: InputMaybe<Scalars['BigInteger']>;
  idPadre?: InputMaybe<Scalars['BigInteger']>;
  leaf: Scalars['Boolean'];
  nome?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  tipologia?: InputMaybe<Scalars['String']>;
  /** ISO-8601 */
  tsChiusura?: InputMaybe<Scalars['DateTime']>;
};

export type TitolarioOutputDto = {
  __typename?: 'TitolarioOutputDTO';
  cdr?: Maybe<Scalars['String']>;
  closed: Scalars['Boolean'];
  deleted: Scalars['Boolean'];
  fascicoloDipendente: Scalars['Boolean'];
  hierarchy?: Maybe<Array<Maybe<TitolarioOutputDto>>>;
  hierarchyString?: Maybe<Scalars['String']>;
  id: Scalars['BigInteger'];
  idPadre: Scalars['BigInteger'];
  immutable: Scalars['Boolean'];
  label?: Maybe<Scalars['String']>;
  leaf: Scalars['Boolean'];
  nomeUtenteCreatore?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  numDocumenti: Scalars['Int'];
  numProtocolli: Scalars['Int'];
  tipologia?: Maybe<Scalars['String']>;
  /** ISO-8601 */
  tsChiusura?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsDeleted?: Maybe<Scalars['DateTime']>;
  visible: Scalars['Boolean'];
  write: Scalars['Boolean'];
};

export type UfficiOutputDto = {
  __typename?: 'UfficiOutputDTO';
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
  uffici?: Maybe<Array<Maybe<Office>>>;
};

export type Ufficio = {
  __typename?: 'Ufficio';
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  metaType?: Maybe<Scalars['String']>;
  pecPeoList?: Maybe<Array<Maybe<PecPeo>>>;
};

export type UfficioInput = {
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['BigInteger']>;
  pecPeoList?: InputMaybe<Array<InputMaybe<PecPeoInput>>>;
};

export type UserOffice = {
  __typename?: 'UserOffice';
  office?: Maybe<Office>;
  roles?: Maybe<Array<Maybe<Role>>>;
  rolesNodeleg?: Maybe<Array<Maybe<Role>>>;
  userOfficeRoles?: Maybe<Array<Maybe<Permit>>>;
};

export type UtenteDto = {
  __typename?: 'UtenteDTO';
  cognome?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  nome?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type UtenteVisibilitaInputInput = {
  idUtente?: InputMaybe<Scalars['String']>;
  nomeUtente?: InputMaybe<Scalars['String']>;
  usernameUtente?: InputMaybe<Scalars['String']>;
};

export type UtentiOutputDto = {
  __typename?: 'UtentiOutputDTO';
  datiUtenteSSO?: Maybe<Array<Maybe<DatiUtenteSso>>>;
  pageCount: Scalars['BigInteger'];
  totalResults: Scalars['BigInteger'];
  utenti?: Maybe<Array<Maybe<UtenteDto>>>;
};

export type VisibilitaTitolario = {
  __typename?: 'VisibilitaTitolario';
  cdr?: Maybe<Scalars['String']>;
  cdrCode?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInteger']>;
  idUtente?: Maybe<Scalars['String']>;
  idUtenteLastOperation?: Maybe<Scalars['String']>;
  metaType?: Maybe<Scalars['String']>;
  nomeUtente?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  titolario?: Maybe<Titolario>;
  /** ISO-8601 */
  tsCreation?: Maybe<Scalars['DateTime']>;
  /** ISO-8601 */
  tsUpdate?: Maybe<Scalars['DateTime']>;
  usernameUtente?: Maybe<Scalars['String']>;
  write?: Maybe<Scalars['Boolean']>;
};

export type VisibilitaTitolarioInputInput = {
  cdr?: InputMaybe<Scalars['String']>;
  cdrCode?: InputMaybe<Scalars['String']>;
  idTitolario?: InputMaybe<Scalars['BigInteger']>;
  note?: InputMaybe<Scalars['String']>;
  permesso?: InputMaybe<Scalars['String']>;
  utenteAuthIdList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  utenti?: InputMaybe<Array<InputMaybe<UtenteVisibilitaInputInput>>>;
};

export type AllegatoBaseFragment = { __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null };

export type AnagraficaBaseFragment = { __typename?: 'Anagrafica', id?: any | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, cfPiva?: string | null, indirizzo?: string | null, citta?: string | null, cap?: string | null, provincia?: string | null, email?: string | null, pec?: string | null, telefono?: string | null, fax?: string | null, note?: string | null, tsCreation?: any | null, tsStartVali?: any | null, certificato: boolean, cancellato: boolean };

export type AnagraficaDtoFragment = { __typename?: 'AnagraficaDTO', id?: any | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, cfPiva?: string | null, indirizzo?: string | null, citta?: string | null, cap?: string | null, provincia?: string | null, email?: string | null, pec?: string | null, telefono?: string | null, fax?: string | null, note?: string | null, tsCreation?: any | null, tsStartVali?: any | null, certificato: boolean, gruppi?: Array<{ __typename?: 'GruppoDTO', id?: any | null, nome?: string | null } | null> | null };

export type PostaEConfigruationFragmentFragment = { __typename?: 'PeConfigurazione', tipologiaPosta?: TipologiaPosta | null, smtpHost?: string | null, smtpPort?: number | null, useTls?: boolean | null, connectionTimeout?: number | null, env?: string | null };

export type EmailBaseFragment = { __typename?: 'Email', id?: any | null, tipoEmail?: string | null, emailDirection?: EmailDirection | null, from?: string | null, to?: string | null, cc?: string | null, oggetto?: string | null, corpo?: string | null, tsInvio?: any | null, statoInvio?: StatoInvio | null, classificazione?: string | null, idUtente?: string | null, tsCreation?: any | null, tsRicezione?: any | null, tsStartVali?: any | null, impronta?: string | null, messageId?: string | null, protocollo?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null };

export type GruppoBaseFragment = { __typename?: 'Gruppo', id?: any | null, nome?: string | null, note?: string | null, tsCreation?: any | null, tsUpdate?: any | null, tsDeleted?: any | null };

export type PecPeoFragmentFragment = { __typename?: 'PecPeo', id?: any | null, idUtente?: string | null, utente?: string | null, username?: string | null, indirizzoEmail?: string | null, tsCreation?: any | null, password?: string | null, attiva: boolean, saveToSent: boolean, readPec: boolean, deleteMessages: boolean, mustSendRispostaAutomatica: boolean, configurazione?: { __typename?: 'PeConfigurazione', tipologiaPosta?: TipologiaPosta | null, smtpHost?: string | null, smtpPort?: number | null, useTls?: boolean | null, connectionTimeout?: number | null, env?: string | null } | null, uffici?: Array<{ __typename?: 'Ufficio', id?: any | null, cdr?: string | null, cdrCode?: string | null } | null> | null };

export type PecEscluseRispostaAutomaticaBaseFragment = { __typename?: 'PecEscluseRispostaAutomatica', id?: any | null, indirizzo?: string | null, tsCreation?: any | null };

export type ProtocolliClassificazioneBaseFragment = { __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null };

export type ProtocolloNoAllegatiFragment = { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null };

export type ProtocolloBaseFragment = { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null };

export type RaccomandataBaseFragment = { __typename?: 'RaccomandataProtocollo', tsCreation?: any | null, tsUpdate?: any | null, idRaccomandata?: string | null, id?: any | null, numero?: string | null, stato?: StatoRaccomandataProtocollo | null, costo?: string | null, tipo?: TipoRaccomandata | null, mittente?: string | null, mittenteIndirizzo?: string | null, ulterioreDatoMittente?: string | null, mittenteCivico?: string | null, mittentePresso?: string | null, mittenteCap?: string | null, mittenteProvincia?: string | null, mittenteCitta?: string | null, destinatario?: string | null, destinatarioCitta?: string | null, destinatarioProvincia?: string | null, destinatarioCap?: string | null, destinatarioIndirizzo?: string | null, destinatarioIndirizzo2?: string | null, destinatarioCivico?: string | null, tsInserimento?: any | null, tsInoltro?: any | null, tsConsegna?: any | null, statoConsegna?: string | null, protocollo?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null, allegato?: { __typename?: 'Allegato', id?: any | null, nome?: string | null, oggetto?: string | null } | null };

export type ReferenteProtocolloFragment = { __typename?: 'ReferentiProtocolloDTO', id?: any | null, idProtocollo?: any | null, idDestinatario?: string | null, tipoDestinatario?: string | null, nomeDestinatario?: string | null, assegnato: boolean, attribuzione?: string | null, statoProtocollo?: StatoProtocollo | null, creationOption: boolean, idMittente?: string | null, nomeMittente?: string | null, tsCreation?: any | null, tsStartVali?: any | null, tsStatoProtocollo?: any | null, revocabile: boolean, noteAssegnazione?: string | null };

export type StoricoBaseFragment = { __typename?: 'Storico', tsCreation?: any | null, idUtente?: string | null, utente?: string | null, note?: string | null, operazione?: string | null };

export type StoricoRegistroGiornalieroBaseFragment = { __typename?: 'Storico', tsCreation?: any | null, idUtente?: string | null, utente?: string | null, note?: string | null, operazione?: string | null, idRegistroGiornaliero?: any | null };

export type StoricoTitolarioBaseFragment = { __typename?: 'Storico', tsCreation?: any | null, idUtente?: string | null, utente?: string | null, note?: string | null, operazione?: string | null, idTitolario?: any | null };

export type TagBaseFragment = { __typename?: 'Tag', id?: any | null, nome?: string | null };

export type TitolarioBaseFragment = { __typename?: 'Titolario', id?: any | null, idPadre?: any | null, idUtenteLastOperation?: string | null, cdr?: string | null, cdrCode?: string | null, leaf?: boolean | null, nome?: string | null, tipologiaTitolario?: TipologiaTitolario | null, tsCreation?: any | null, tsChiusura?: any | null, tsDeleted?: any | null, tsUpdate?: any | null };

export type Titolario_Output_DtoFragment = { __typename?: 'TitolarioOutputDTO', id: any, idPadre: any, label?: string | null, tipologia?: string | null, hierarchyString?: string | null, note?: string | null, tsChiusura?: any | null, tsCreation?: any | null, tsDeleted?: any | null, nomeUtenteCreatore?: string | null, cdr?: string | null, closed: boolean, deleted: boolean, leaf: boolean, numDocumenti: number, numProtocolli: number, visible: boolean };

export type UfficioFragmentFragment = { __typename?: 'Ufficio', id?: any | null, cdr?: string | null, cdrCode?: string | null };

export type DiscardAllegatoMutationVariables = Exact<{
  idAllegato: Scalars['BigInteger'];
}>;


export type DiscardAllegatoMutation = { __typename?: 'Mutation', discardAllegato: boolean };

export type ResumeAllegatoMutationVariables = Exact<{
  idAllegato: Scalars['BigInteger'];
}>;


export type ResumeAllegatoMutation = { __typename?: 'Mutation', resumeAllegato: boolean };

export type DeleteContattoMutationVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type DeleteContattoMutation = { __typename?: 'Mutation', deleteContatto: boolean };

export type ImportAnagraficaMutationVariables = Exact<{
  fileBase64: Scalars['String'];
}>;


export type ImportAnagraficaMutation = { __typename?: 'Mutation', importAnagraficaFromBase64: boolean };

export type SaveContattoMutationVariables = Exact<{
  anagraficaInput?: InputMaybe<AnagraficaInputInput>;
}>;


export type SaveContattoMutation = { __typename?: 'Mutation', saveContatto?: { __typename?: 'Anagrafica', id?: any | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, cfPiva?: string | null, indirizzo?: string | null, citta?: string | null, cap?: string | null, provincia?: string | null, email?: string | null, pec?: string | null, telefono?: string | null, fax?: string | null, note?: string | null, tsCreation?: any | null, tsStartVali?: any | null, certificato: boolean, cancellato: boolean } | null };

export type UpdateContattoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
  input?: InputMaybe<AnagraficaInputInput>;
}>;


export type UpdateContattoMutation = { __typename?: 'Mutation', updateContatto?: { __typename?: 'Anagrafica', id?: any | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, cfPiva?: string | null, indirizzo?: string | null, citta?: string | null, cap?: string | null, provincia?: string | null, email?: string | null, pec?: string | null, telefono?: string | null, fax?: string | null, note?: string | null, tsCreation?: any | null, tsStartVali?: any | null, certificato: boolean, cancellato: boolean } | null };

export type SaveLoginRaccomandataMutationVariables = Exact<{
  loginInput: LoginRaccomandataDtoInput;
}>;


export type SaveLoginRaccomandataMutation = { __typename?: 'Mutation', saveLoginRaccomandata: boolean };

export type SaveLoginConservazioneMutationVariables = Exact<{
  loginInput: LoginConservazioneDtoInput;
}>;


export type SaveLoginConservazioneMutation = { __typename?: 'Mutation', saveLoginConservazione: boolean };

export type UpdateLoginRaccomandataMutationVariables = Exact<{
  loginInput: LoginRaccomandataDtoInput;
}>;


export type UpdateLoginRaccomandataMutation = { __typename?: 'Mutation', updateLoginRaccomandata: boolean };

export type UpdateLoginConservazioneMutationVariables = Exact<{
  loginInput: LoginConservazioneDtoInput;
}>;


export type UpdateLoginConservazioneMutation = { __typename?: 'Mutation', updateLoginConservazione: boolean };

export type InoltraRispondiEmailMutationVariables = Exact<{
  dto?: InputMaybe<InoltraRispondiInput>;
}>;


export type InoltraRispondiEmailMutation = { __typename?: 'Mutation', inoltraRispondiEmail: boolean };

export type DeleteGruppoMutationVariables = Exact<{
  groupId: Scalars['BigInteger'];
}>;


export type DeleteGruppoMutation = { __typename?: 'Mutation', deleteGruppo: boolean };

export type RemoveContactFromGroupMutationVariables = Exact<{
  groupId: Scalars['BigInteger'];
  contactId: Scalars['BigInteger'];
}>;


export type RemoveContactFromGroupMutation = { __typename?: 'Mutation', removeContactFromGroup: boolean };

export type SaveGruppoMutationVariables = Exact<{
  gruppoAnagraficaDTO?: InputMaybe<GruppoAnagraficaDtoInput>;
}>;


export type SaveGruppoMutation = { __typename?: 'Mutation', saveGruppo?: { __typename?: 'Gruppo', id?: any | null, nome?: string | null, note?: string | null, tsCreation?: any | null, tsUpdate?: any | null, tsDeleted?: any | null } | null };

export type AddContactsToGroupMutationVariables = Exact<{
  groupId: Scalars['BigInteger'];
  contactIds: Array<Scalars['BigInteger']> | Scalars['BigInteger'];
}>;


export type AddContactsToGroupMutation = { __typename?: 'Mutation', addContactsToGroup: boolean };

export type UpdateGruppoMutationVariables = Exact<{
  groupId: Scalars['BigInteger'];
  input: GruppoAnagraficaDtoInput;
}>;


export type UpdateGruppoMutation = { __typename?: 'Mutation', updateGruppo?: { __typename?: 'Gruppo', id?: any | null } | null };

export type DeleteModelloAutomaticoMutationVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type DeleteModelloAutomaticoMutation = { __typename?: 'Mutation', deleteModelloAutomatico: boolean };

export type CreateModelloAutomaticoMutationVariables = Exact<{
  input?: InputMaybe<ModelloAutomaticoInputDtoInput>;
}>;


export type CreateModelloAutomaticoMutation = { __typename?: 'Mutation', createModelloAutomatico?: { __typename?: 'ModelloAutomaticoDTO', id?: any | null, nomeModello?: string | null, oggettoProtocollo?: string | null, metodoSpedizione?: MetodoSpedizione | null, tipoRegistrazione?: TipoRegistrazione | null, cdrCode?: string | null, hierarchyStringTitolario?: string | null, cdr?: string | null, titolario?: { __typename?: 'Titolario', id?: any | null, idPadre?: any | null, nome?: string | null } | null } | null };

export type UpdateModelloAutomaticoMutationVariables = Exact<{
  id: Scalars['BigInteger'];
  input?: InputMaybe<ModelloAutomaticoInputDtoInput>;
}>;


export type UpdateModelloAutomaticoMutation = { __typename?: 'Mutation', updateModelloAutomatico?: { __typename?: 'ModelloAutomaticoDTO', id?: any | null, nomeModello?: string | null, oggettoProtocollo?: string | null, metodoSpedizione?: MetodoSpedizione | null, tipoRegistrazione?: TipoRegistrazione | null, cdrCode?: string | null, hierarchyStringTitolario?: string | null, cdr?: string | null, titolario?: { __typename?: 'Titolario', id?: any | null, idPadre?: any | null, nome?: string | null } | null } | null };

export type SavePecEsclusaMutationVariables = Exact<{
  pecInput: PecEscluseRispostaAutomaticaInputInput;
}>;


export type SavePecEsclusaMutation = { __typename?: 'Mutation', savePecEsclusa?: { __typename?: 'PecEscluseRispostaAutomatica', id?: any | null, indirizzo?: string | null } | null };

export type UpdatePecEsclusaMutationVariables = Exact<{
  id: Scalars['BigInteger'];
  pecInput: PecEscluseRispostaAutomaticaInputInput;
}>;


export type UpdatePecEsclusaMutation = { __typename?: 'Mutation', updatePecEsclusa?: { __typename?: 'PecEscluseRispostaAutomatica', id?: any | null, indirizzo?: string | null } | null };

export type DeletePecEsclusaMutationVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type DeletePecEsclusaMutation = { __typename?: 'Mutation', deletePecEsclusa: boolean };

export type DeletePecPeoConfigurationMutationVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type DeletePecPeoConfigurationMutation = { __typename?: 'Mutation', deleteConfiguration: boolean };

export type SavePecPeoConfigurationMutationVariables = Exact<{
  input?: InputMaybe<PecPeoDtoInputInput>;
}>;


export type SavePecPeoConfigurationMutation = { __typename?: 'Mutation', saveConfiguration: boolean };

export type UpdateConfigurationsMutationVariables = Exact<{
  id: Scalars['BigInteger'];
  input?: InputMaybe<PecPeoDtoInputInput>;
}>;


export type UpdateConfigurationsMutation = { __typename?: 'Mutation', updateConfigurations: boolean };

export type AddRegolaMutationVariables = Exact<{
  input: PecRegolaInputDtoInput;
}>;


export type AddRegolaMutation = { __typename?: 'Mutation', savePecRegola?: { __typename?: 'PecRegolaInputDTO', idEmail?: any | null, idCategoriaRegola?: any | null } | null };

export type DeleteRegolaMutationVariables = Exact<{
  idEmail: Scalars['BigInteger'];
  idCategoria: Scalars['BigInteger'];
}>;


export type DeleteRegolaMutation = { __typename?: 'Mutation', deletePecRegola: boolean };

export type ExportListaProtocolliMutationVariables = Exact<{
  dto: RicercaProtocolliDtoInput;
  formato: Scalars['String'];
  idProtocolliSelezionati?: InputMaybe<Array<InputMaybe<Scalars['BigInteger']>> | InputMaybe<Scalars['BigInteger']>>;
}>;


export type ExportListaProtocolliMutation = { __typename?: 'Mutation', exportListaProtocolli?: string | null };

export type ImportProtocolliEmergenzaMutationVariables = Exact<{
  fileBase64: Scalars['String'];
  selectedOffice: Scalars['String'];
  cdr: Scalars['String'];
}>;


export type ImportProtocolliEmergenzaMutation = { __typename?: 'Mutation', importProtocolliEmergenzaFromBase64?: Array<{ __typename?: 'ProtocolloEmergenzaDTO', nProtocollo?: string | null, nProtocolloEmergenza?: string | null, imported: boolean } | null> | null };

export type AnnullaProtocolloMutationVariables = Exact<{
  idProtocollo: Scalars['BigInteger'];
  notaAnnullamento: Scalars['String'];
}>;


export type AnnullaProtocolloMutation = { __typename?: 'Mutation', annullaProtocollo: boolean };

export type RichiestaAnnullamentoProtocolloMutationVariables = Exact<{
  idProtocollo: Scalars['BigInteger'];
  notaAnnullamento: Scalars['String'];
}>;


export type RichiestaAnnullamentoProtocolloMutation = { __typename?: 'Mutation', richiestaAnnullamentoProtocollo: boolean };

export type GestioneAnnullamentoMutationVariables = Exact<{
  idProtocollo: Scalars['BigInteger'];
  isAnnulla: Scalars['Boolean'];
  nota: Scalars['String'];
}>;


export type GestioneAnnullamentoMutation = { __typename?: 'Mutation', gestioneAnnullamento: boolean };

export type AssegnaProtocolloMutationVariables = Exact<{
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
  assegnatari?: InputMaybe<Array<InputMaybe<ReferenteProtocolloInputInput>> | InputMaybe<ReferenteProtocolloInputInput>>;
  selectedOffice: Scalars['String'];
  noteAssegnazione?: InputMaybe<Scalars['String']>;
}>;


export type AssegnaProtocolloMutation = { __typename?: 'Mutation', assegnaProtocollo: boolean };

export type AssegnazioneProtocolloMassivaMutationVariables = Exact<{
  numbers: Array<Scalars['String']> | Scalars['String'];
  selectedOffice: Scalars['String'];
  referenti: Array<ReferenteProtocolloInputInput> | ReferenteProtocolloInputInput;
  noteAssegnazione?: InputMaybe<Scalars['String']>;
}>;


export type AssegnazioneProtocolloMassivaMutation = { __typename?: 'Mutation', assegnazioneProtocolloMassiva: boolean };

export type FascicolaProtocolloMutationVariables = Exact<{
  idProtocollo: Scalars['BigInteger'];
  idTitolarioList?: InputMaybe<Array<Scalars['BigInteger']> | Scalars['BigInteger']>;
  selectedOffice: Scalars['String'];
}>;


export type FascicolaProtocolloMutation = { __typename?: 'Mutation', fascicolazioneProtocollo: boolean };

export type FascicolaProtocolloMassivoMutationVariables = Exact<{
  idProtocolloList: Array<InputMaybe<Scalars['BigInteger']>> | InputMaybe<Scalars['BigInteger']>;
  idTitolarioList?: InputMaybe<Array<Scalars['BigInteger']> | Scalars['BigInteger']>;
  selectedOffice: Scalars['String'];
}>;


export type FascicolaProtocolloMassivoMutation = { __typename?: 'Mutation', fascicolazioneMassivaProtocollo: boolean };

export type SaveProtocolloMutationVariables = Exact<{
  data: ProtocolloInputInput;
}>;


export type SaveProtocolloMutation = { __typename?: 'Mutation', saveProtocollo?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null } | null };

export type SaveProtocolloByEmailMutationVariables = Exact<{
  idEmail: Scalars['BigInteger'];
}>;


export type SaveProtocolloByEmailMutation = { __typename?: 'Mutation', saveProtocolloByEmail?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, stato?: StatoProtocollo | null, indirizzoPecPeo?: string | null } | null };

export type InsertRaccomandataMutationVariables = Exact<{
  input: RaccomandataProtocolloInputInput;
}>;


export type InsertRaccomandataMutation = { __typename?: 'Mutation', insertRaccomandata?: { __typename?: 'RaccomandataProtocollo', id?: any | null } | null };

export type NotificaProtocolloMutationVariables = Exact<{
  input: NotificaProtocolloPecPeoInputInput;
}>;


export type NotificaProtocolloMutation = { __typename?: 'Mutation', notificaProtocollo: boolean };

export type UpdateNoteProtocolloMutationVariables = Exact<{
  input?: InputMaybe<ProtocolloUpdateInputInput>;
}>;


export type UpdateNoteProtocolloMutation = { __typename?: 'Mutation', updateNoteProtocollo: boolean };

export type RevocaAssegnazioneProtocolloMutationVariables = Exact<{
  referentiProtocolloId: Scalars['BigInteger'];
}>;


export type RevocaAssegnazioneProtocolloMutation = { __typename?: 'Mutation', revocaAssegnazioneProtocollo: boolean };

export type RichiestaAssegnazioneProtocolloMutationVariables = Exact<{
  idProtocollo: Scalars['BigInteger'];
  note?: InputMaybe<Scalars['String']>;
}>;


export type RichiestaAssegnazioneProtocolloMutation = { __typename?: 'Mutation', richiestaAssegnazioneProtocollo: boolean };

export type RifiutaProtocolloMutationVariables = Exact<{
  nProtocollo?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
}>;


export type RifiutaProtocolloMutation = { __typename?: 'Mutation', rifiutaProtocollo: boolean };

export type RifiutaProtocolloMassivaMutationVariables = Exact<{
  numbers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  selectedOffice: Scalars['String'];
  note: Scalars['String'];
}>;


export type RifiutaProtocolloMassivaMutation = { __typename?: 'Mutation', rifiutaProtocolloMassiva: boolean };

export type UpdateProtocolloMutationVariables = Exact<{
  data: ProtocolloUpdateInputInput;
}>;


export type UpdateProtocolloMutation = { __typename?: 'Mutation', updateProtocollo?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null } | null };

export type AnnullaRaccomandataMutationVariables = Exact<{
  id: Scalars['BigInteger'];
  motivazione: Scalars['String'];
}>;


export type AnnullaRaccomandataMutation = { __typename?: 'Mutation', annullaRaccomandata: boolean };

export type UpdateStatoRaccomandateForProtocolloMutationVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type UpdateStatoRaccomandateForProtocolloMutation = { __typename?: 'Mutation', updateStatoRaccomandateForProtocollo: boolean };

export type UpdateStatoProtocolloMutationVariables = Exact<{
  input?: InputMaybe<StatoProtocolloInputInput>;
}>;


export type UpdateStatoProtocolloMutation = { __typename?: 'Mutation', updateStatoProtocollo: boolean };

export type PresaInCaricoProtocolloMassivaMutationVariables = Exact<{
  numbers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  selectedOffice: Scalars['String'];
}>;


export type PresaInCaricoProtocolloMassivaMutation = { __typename?: 'Mutation', presaInCaricoProtocolloMassiva: boolean };

export type ExportStoricoMutationVariables = Exact<{
  dto: RicercaStoricoDtoInput;
  formato: Scalars['String'];
}>;


export type ExportStoricoMutation = { __typename?: 'Mutation', exportStorico?: string | null };

export type SaveTagMutationVariables = Exact<{
  tagInput: TagInputInput;
}>;


export type SaveTagMutation = { __typename?: 'Mutation', saveTag?: { __typename?: 'Tag', id?: any | null, nome?: string | null } | null };

export type UpdateTagMutationVariables = Exact<{
  id: Scalars['BigInteger'];
  tagInput: TagInputInput;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', updateTag?: { __typename?: 'Tag', id?: any | null, nome?: string | null } | null };

export type DeleteTagMutationVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type DeleteTagMutation = { __typename?: 'Mutation', deleteTag: boolean };

export type DeleteTitolarioMutationVariables = Exact<{
  idTitolario: Scalars['BigInteger'];
}>;


export type DeleteTitolarioMutation = { __typename?: 'Mutation', deleteTitolario: boolean };

export type DeleteVisibilitaTitolarioMutationVariables = Exact<{
  idVisibilitaList: Array<InputMaybe<Scalars['BigInteger']>> | InputMaybe<Scalars['BigInteger']>;
}>;


export type DeleteVisibilitaTitolarioMutation = { __typename?: 'Mutation', deleteVisibilitaTitolario: boolean };

export type DropTitolarioMutationVariables = Exact<{
  idTitolario: Scalars['BigInteger'];
}>;


export type DropTitolarioMutation = { __typename?: 'Mutation', dropTitolario: boolean };

export type InsertVisibilitaTitolarioMutationVariables = Exact<{
  visibilitaTitolarioInput: VisibilitaTitolarioInputInput;
}>;


export type InsertVisibilitaTitolarioMutation = { __typename?: 'Mutation', insertVisibilitatitolario: boolean };

export type InsertTitolarioMutationVariables = Exact<{
  titolarioInput: TitolarioInputInput;
}>;


export type InsertTitolarioMutation = { __typename?: 'Mutation', insertTitolario: boolean };

export type SetMaxLivelloFascicolazioneForTitolarioMutationVariables = Exact<{
  livello: Scalars['Int'];
}>;


export type SetMaxLivelloFascicolazioneForTitolarioMutation = { __typename?: 'Mutation', setMaxLivelloFascicolazioneForTitolario: boolean };

export type SpostaProtocolloMutationVariables = Exact<{
  idProtocolli: Array<Scalars['BigInteger']> | Scalars['BigInteger'];
  idFascicoloOld: Scalars['BigInteger'];
  idFascicoloNew: Scalars['BigInteger'];
}>;


export type SpostaProtocolloMutation = { __typename?: 'Mutation', spostaProtocollo: boolean };

export type SpostaFascicoloMutationVariables = Exact<{
  idFascicoliList: Array<Scalars['BigInteger']> | Scalars['BigInteger'];
  idFascicoloPadre: Scalars['BigInteger'];
  cdr: Scalars['String'];
  cdrCode: Scalars['String'];
}>;


export type SpostaFascicoloMutation = { __typename?: 'Mutation', spostaFascicolo: boolean };

export type SpostaAllegatiFascicoloMutationVariables = Exact<{
  allegatiIds: Array<Scalars['BigInteger']> | Scalars['BigInteger'];
  oldTitolarioId: Scalars['BigInteger'];
  newTitolarioId: Scalars['BigInteger'];
}>;


export type SpostaAllegatiFascicoloMutation = { __typename?: 'Mutation', spostaAllegatiFascicolo: boolean };

export type UpdateTitolarioMutationVariables = Exact<{
  titolarioInput: TitolarioInputInput;
}>;


export type UpdateTitolarioMutation = { __typename?: 'Mutation', updateTitolario: boolean };

export type GetAllExtensionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllExtensionsQuery = { __typename?: 'Query', getAllExtensions?: Array<string | null> | null };

export type GetAllegatiQueryVariables = Exact<{
  ricercaAllegatiDTO: RicercaAllegatiDtoInput;
}>;


export type GetAllegatiQuery = { __typename?: 'Query', getAllegati?: { __typename?: 'AllegatiOutputDTO', pageCount: any, totalResults: any, allegati?: Array<{ __typename?: 'AllegatoDTO', id: any, idOriginal: any, idUtente?: string | null, nome?: string | null, dimensione: any, estensione?: string | null, impronta?: string | null } | null> | null } | null };

export type GetAllegatiDiscardedQueryVariables = Exact<{
  ricercaAllegatiDTO: RicercaAllegatiDtoInput;
}>;


export type GetAllegatiDiscardedQuery = { __typename?: 'Query', getAllegatiDiscarded?: { __typename?: 'AllegatiOutputDTO', allegati?: Array<{ __typename?: 'AllegatoDTO', nome?: string | null, collocazioneTelematica?: string | null, oggetto?: string | null, id: any, idOriginal: any, estensione?: string | null, dimensione: any } | null> | null } | null };

export type GetAllAnagraficaQueryVariables = Exact<{
  ricercaAnagraficaDTO?: InputMaybe<RicercaAnagraficaDtoInput>;
}>;


export type GetAllAnagraficaQuery = { __typename?: 'Query', getAllAnagrafica?: { __typename?: 'AnagraficaDTOList', pageCount: any, totalResults: any, anagraficaList?: Array<{ __typename?: 'AnagraficaDTO', id?: any | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, cfPiva?: string | null, indirizzo?: string | null, citta?: string | null, cap?: string | null, provincia?: string | null, email?: string | null, pec?: string | null, telefono?: string | null, fax?: string | null, note?: string | null, tsCreation?: any | null, tsStartVali?: any | null, certificato: boolean, gruppi?: Array<{ __typename?: 'GruppoDTO', id?: any | null, nome?: string | null } | null> | null } | null> | null } | null };

export type GetContattoInadQueryVariables = Exact<{
  codiceFiscale: Scalars['String'];
}>;


export type GetContattoInadQuery = { __typename?: 'Query', getContattoInad?: string | null };

export type GetDettaglioAnagraficaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['BigInteger']>;
}>;


export type GetDettaglioAnagraficaQuery = { __typename?: 'Query', getDettaglioAnagrafica?: { __typename?: 'AnagraficaDTO', id?: any | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, indirizzo?: string | null, citta?: string | null, cap?: string | null, provincia?: string | null } | null };

export type GetPecPeoByTipologiaPostaQueryVariables = Exact<{
  idUtente?: InputMaybe<Scalars['String']>;
  tipologiaPosta: Scalars['String'];
  selectedCdrCode: Scalars['String'];
}>;


export type GetPecPeoByTipologiaPostaQuery = { __typename?: 'Query', getPecPeoByTipologiaPosta?: Array<string | null> | null };

export type GetPecPeoByUtenteAndCdrQueryVariables = Exact<{
  idUtente?: InputMaybe<Scalars['String']>;
  selectedCdrCode: Scalars['String'];
}>;


export type GetPecPeoByUtenteAndCdrQuery = { __typename?: 'Query', getPecPeoByUtenteAndCdr?: Array<string | null> | null };

export type FindAllPecPeoIdByEmailQueryVariables = Exact<{
  id: Scalars['BigInteger'];
  indirizzoEmail: Scalars['String'];
}>;


export type FindAllPecPeoIdByEmailQuery = { __typename?: 'Query', findAllPecPeoIdByEmail?: Array<any | null> | null };

export type GetPecPeoConfigurationsQueryVariables = Exact<{
  RicercaConfigPEDTOInput?: InputMaybe<RicercaConfigPedtoInput>;
}>;


export type GetPecPeoConfigurationsQuery = { __typename?: 'Query', getConfigurations?: { __typename?: 'ConfigurazioniPEOutputDTO', pageCount: any, totalResults: any, configurazioniPostaElettronica?: Array<{ __typename?: 'PecPeo', id?: any | null, idUtente?: string | null, utente?: string | null, username?: string | null, indirizzoEmail?: string | null, tsCreation?: any | null, password?: string | null, attiva: boolean, saveToSent: boolean, readPec: boolean, deleteMessages: boolean, mustSendRispostaAutomatica: boolean, configurazione?: { __typename?: 'PeConfigurazione', tipologiaPosta?: TipologiaPosta | null, smtpHost?: string | null, smtpPort?: number | null, useTls?: boolean | null, connectionTimeout?: number | null, env?: string | null } | null, uffici?: Array<{ __typename?: 'Ufficio', id?: any | null, cdr?: string | null, cdrCode?: string | null } | null> | null } | null> | null } | null };

export type GetConfiguredUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConfiguredUsersQuery = { __typename?: 'Query', getConfiguredUsers?: Array<{ __typename?: 'PecPeo', id?: any | null, idUtente?: string | null, utente?: string | null, username?: string | null, indirizzoEmail?: string | null, tsCreation?: any | null, password?: string | null, attiva: boolean, saveToSent: boolean, readPec: boolean, deleteMessages: boolean, mustSendRispostaAutomatica: boolean, configurazione?: { __typename?: 'PeConfigurazione', tipologiaPosta?: TipologiaPosta | null, smtpHost?: string | null, smtpPort?: number | null, useTls?: boolean | null, connectionTimeout?: number | null, env?: string | null } | null, uffici?: Array<{ __typename?: 'Ufficio', id?: any | null, cdr?: string | null, cdrCode?: string | null } | null> | null } | null> | null };

export type GetLoginRaccomandataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoginRaccomandataQuery = { __typename?: 'Query', getLoginRaccomandata?: { __typename?: 'LoginRaccomandataDTO', gruppo?: string | null, username?: string | null, password?: string | null } | null };

export type GetLoginConservazioneQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoginConservazioneQuery = { __typename?: 'Query', getLoginConservazione?: { __typename?: 'LoginConservazioneDTO', url?: string | null, username?: string | null, password?: string | null, ambiente?: AmbienteConservazione | null, ente?: string | null, struttura?: string | null } | null };

export type GetEmailsQueryVariables = Exact<{
  ricerca?: InputMaybe<RicercaEmailDtoInput>;
}>;


export type GetEmailsQuery = { __typename?: 'Query', getEmails?: { __typename?: 'EmailOutputDTO', pageCount: any, totalResults: any, email?: Array<{ __typename?: 'Email', id?: any | null, tipoEmail?: string | null, emailDirection?: EmailDirection | null, from?: string | null, to?: string | null, cc?: string | null, oggetto?: string | null, corpo?: string | null, tsInvio?: any | null, statoInvio?: StatoInvio | null, classificazione?: string | null, idUtente?: string | null, tsCreation?: any | null, tsRicezione?: any | null, tsStartVali?: any | null, impronta?: string | null, messageId?: string | null, protocollo?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null } | null> | null } | null };

export type GetAllGruppiQueryVariables = Exact<{
  ricercaGruppiDTO?: InputMaybe<RicercaGruppiDtoInput>;
}>;


export type GetAllGruppiQuery = { __typename?: 'Query', getAllGruppi?: { __typename?: 'GruppiOutputDTO', pageCount: any, totalResults: any, gruppiList?: Array<{ __typename?: 'Gruppo', id?: any | null, nome?: string | null, note?: string | null, tsCreation?: any | null, tsUpdate?: any | null, tsDeleted?: any | null } | null> | null } | null };

export type DettaglioGruppoQueryVariables = Exact<{
  groupId: Scalars['BigInteger'];
}>;


export type DettaglioGruppoQuery = { __typename?: 'Query', dettaglioGruppo?: { __typename?: 'GruppoOutputDTO', id: any, nome?: string | null, note?: string | null, creation?: any | null, update?: any | null, deleted?: any | null } | null };

export type GetModelliAutomaticiByCdrCodeQueryVariables = Exact<{
  selectedOffice: Scalars['String'];
}>;


export type GetModelliAutomaticiByCdrCodeQuery = { __typename?: 'Query', getModelliAutomaticiByCdrCode?: Array<{ __typename?: 'ModelloAutomaticoDTO', id?: any | null, nomeModello?: string | null, oggettoProtocollo?: string | null, metodoSpedizione?: MetodoSpedizione | null, tipoRegistrazione?: TipoRegistrazione | null, cdrCode?: string | null, hierarchyStringTitolario?: string | null, cdr?: string | null, titolario?: { __typename?: 'Titolario', id?: any | null, idPadre?: any | null, nome?: string | null } | null } | null> | null };

export type SearchModelliAutomaticiQueryVariables = Exact<{
  input?: InputMaybe<RicercaModelloAutomaticoDtoInput>;
}>;


export type SearchModelliAutomaticiQuery = { __typename?: 'Query', searchModelliAutomatici?: { __typename?: 'ModelloAutomaticoOutputDTO', pageCount: any, totalResults: any, modelloAutomaticoList?: Array<{ __typename?: 'ModelloAutomaticoDTO', id?: any | null, nomeModello?: string | null, oggettoProtocollo?: string | null, metodoSpedizione?: MetodoSpedizione | null, tipoRegistrazione?: TipoRegistrazione | null, cdrCode?: string | null, hierarchyStringTitolario?: string | null, cdr?: string | null, titolario?: { __typename?: 'Titolario', id?: any | null, idPadre?: any | null, nome?: string | null } | null } | null> | null } | null };

export type GetAllPecEscluseQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']>;
}>;


export type GetAllPecEscluseQuery = { __typename?: 'Query', getAllPecEscluse?: Array<{ __typename?: 'PecEscluseRispostaAutomatica', id?: any | null, indirizzo?: string | null, tsCreation?: any | null } | null> | null };

export type GetPecEscluseListQueryVariables = Exact<{
  searchPecEscluse?: InputMaybe<RicercaPecEscluseRispostaAutomaticaDtoInput>;
}>;


export type GetPecEscluseListQuery = { __typename?: 'Query', getPecEscluseList?: { __typename?: 'PecEscluseRispostaAutomaticaDTOList', pageCount: any, totalResults: any, pecEscluseRispostaAutomaticaList?: Array<{ __typename?: 'PecEscluseRispostaAutomaticaDTO', id?: any | null, indirizzo?: string | null, tsCreation?: any | null } | null> | null } | null };

export type GetPecRegoleQueryVariables = Exact<{
  idEmail: Scalars['BigInteger'];
}>;


export type GetPecRegoleQuery = { __typename?: 'Query', getPecRegole?: { __typename?: 'PecRegoleDTO', list?: Array<{ __typename?: 'PecRegolaInputDTO', idEmail?: any | null, idCategoriaRegola?: any | null, threshold?: any | null, durationMinutes?: any | null, enabled?: boolean | null, finestre?: Array<{ __typename?: 'PecRegolaFinestraTemporaleInput', dayOfWeek?: any | null, start?: string | null, end?: string | null } | null> | null } | null> | null } | null };

export type GetProtocolliQueryVariables = Exact<{
  ricercaProtocolliDTO?: InputMaybe<RicercaProtocolliDtoInput>;
}>;


export type GetProtocolliQuery = { __typename?: 'Query', getProtocolli?: { __typename?: 'ProtocolliOutputDTO', pageCount: any, totalResults: any, protocolli?: Array<{ __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null> | null } | null };

export type GetProtocolloByNumeroQueryVariables = Exact<{
  nProtocollo?: InputMaybe<Scalars['String']>;
}>;


export type GetProtocolloByNumeroQuery = { __typename?: 'Query', protocolloByNumero?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null };

export type GetProtocolloByIdQueryVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type GetProtocolloByIdQuery = { __typename?: 'Query', getProtocolloById?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null } | null };

export type GenerateBarcodeQueryVariables = Exact<{
  nProtocollo?: InputMaybe<Scalars['String']>;
}>;


export type GenerateBarcodeQuery = { __typename?: 'Query', generateBarcode?: string | null };

export type GenerateRicevutaQueryVariables = Exact<{
  nProtocollo?: InputMaybe<Scalars['String']>;
}>;


export type GenerateRicevutaQuery = { __typename?: 'Query', generateRicevuta?: string | null };

export type GetAllegatoPrincipaleQueryVariables = Exact<{
  nProtocollo?: InputMaybe<Scalars['String']>;
}>;


export type GetAllegatoPrincipaleQuery = { __typename?: 'Query', getProtocolloAllegatoPrincipale?: { __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null };

export type DettaglioProtocolloQueryVariables = Exact<{
  nProtocollo?: InputMaybe<Scalars['String']>;
  selectedOffice?: InputMaybe<Scalars['String']>;
}>;


export type DettaglioProtocolloQuery = { __typename?: 'Query', dettaglioProtocollo?: { __typename?: 'DettaglioProtocolloDTO', statoProtocollo?: string | null, assegna: boolean, rifiuta: boolean, annulla: boolean, richiestaAnnullamento: boolean, gestioneAnnullamento: boolean, protocolAuthor: boolean, authorized: boolean, canPrendereInCaricoFromPec: boolean, canViewFromPec: boolean, destinatariCompetenza?: Array<{ __typename?: 'ReferenteOutputDTO', label?: string | null, idDestinatario?: string | null, tipo?: string | null } | null> | null, destinatariConoscenza?: Array<{ __typename?: 'ReferenteOutputDTO', label?: string | null, idDestinatario?: string | null, tipo?: string | null } | null> | null, protocollo?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null, titolario?: Array<{ __typename?: 'TitolarioOutputDTO', id: any, idPadre: any, label?: string | null, tipologia?: string | null, hierarchyString?: string | null, note?: string | null, tsChiusura?: any | null, tsCreation?: any | null, tsDeleted?: any | null, nomeUtenteCreatore?: string | null, cdr?: string | null, closed: boolean, deleted: boolean, leaf: boolean, numDocumenti: number, numProtocolli: number, visible: boolean } | null> | null, tagList?: Array<{ __typename?: 'Tag', id?: any | null, nome?: string | null } | null> | null } | null };

export type CercaRaccomandateQueryVariables = Exact<{
  ricercaRaccomandate: RicercaRaccomandataDtoInput;
}>;


export type CercaRaccomandateQuery = { __typename?: 'Query', cercaRaccomandate?: { __typename?: 'RaccomandataProtocolloDTO', pageCount: any, totalResults: any, raccomandate?: Array<{ __typename?: 'RaccomandataProtocollo', tsCreation?: any | null, tsUpdate?: any | null, idRaccomandata?: string | null, id?: any | null, numero?: string | null, stato?: StatoRaccomandataProtocollo | null, costo?: string | null, tipo?: TipoRaccomandata | null, mittente?: string | null, mittenteIndirizzo?: string | null, ulterioreDatoMittente?: string | null, mittenteCivico?: string | null, mittentePresso?: string | null, mittenteCap?: string | null, mittenteProvincia?: string | null, mittenteCitta?: string | null, destinatario?: string | null, destinatarioCitta?: string | null, destinatarioProvincia?: string | null, destinatarioCap?: string | null, destinatarioIndirizzo?: string | null, destinatarioIndirizzo2?: string | null, destinatarioCivico?: string | null, tsInserimento?: any | null, tsInoltro?: any | null, tsConsegna?: any | null, statoConsegna?: string | null, protocollo?: { __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null, allegato?: { __typename?: 'Allegato', id?: any | null, nome?: string | null, oggetto?: string | null } | null } | null> | null } | null };

export type GetAssegnatariTooltipForProtocolloQueryVariables = Exact<{
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
}>;


export type GetAssegnatariTooltipForProtocolloQuery = { __typename?: 'Query', getAssegnatariTooltipForProtocollo?: Array<{ __typename?: 'ReferentiProtocollo', nomeDestinatario?: string | null, ufficioLavorazione?: string | null, statoProtocollo?: StatoProtocollo | null } | null> | null };

export type GetMittenteFiledsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMittenteFiledsQuery = { __typename?: 'Query', getMittenteFileds?: { __typename?: 'RaccomandataMittenteFields', mittente?: string | null, dipartimentoServizio?: string | null, indirizzo?: string | null, civico?: string | null, presso?: string | null, citta?: string | null, cap?: string | null, provincia?: string | null } | null };

export type FindReferentiQueryVariables = Exact<{
  search?: InputMaybe<RicercaReferentiDtoInput>;
}>;


export type FindReferentiQuery = { __typename?: 'Query', findReferenti?: { __typename?: 'ReferentiOutputDTO', pageCount: any, totalResults: any, referenti?: Array<{ __typename?: 'ReferenteOutputDTO', id?: string | null, idDestinatario?: string | null, label?: string | null, tipo?: string | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, cfPiva?: string | null, pec?: string | null, email?: string | null, descrizione?: string | null, citta?: string | null, cap?: string | null, indirizzo?: string | null, ipaResponseDTO?: { __typename?: 'IpaResponseDTO', codAmm?: string | null, descAmm?: string | null, acronimo?: string | null, codAOO?: string | null, codUniOU?: string | null, descOU?: string | null, cfPiva?: string | null, pec?: string | null, ragioneSociale?: string | null, indirizzo?: string | null, citta?: string | null, provincia?: string | null, cap?: string | null, telefono?: string | null, fax?: string | null } | null, children?: Array<{ __typename?: 'ReferenteOutputDTO', id?: string | null, idDestinatario?: string | null, label?: string | null, tipo?: string | null, ragioneSociale?: string | null, nome?: string | null, cognome?: string | null, cfPiva?: string | null, pec?: string | null, email?: string | null, descrizione?: string | null, citta?: string | null, cap?: string | null, indirizzo?: string | null } | null> | null } | null> | null } | null };

export type GetReferentiProtocolloQueryVariables = Exact<{
  ricercaReferentiProtocollo?: InputMaybe<RicercaReferentiProtocolloDtoInput>;
}>;


export type GetReferentiProtocolloQuery = { __typename?: 'Query', getReferenti?: { __typename?: 'ReferentiProtocolloOutputDTO', pageCount: any, totalResults: any, referenti?: Array<{ __typename?: 'ReferentiProtocolloDTO', id?: any | null, idProtocollo?: any | null, idDestinatario?: string | null, tipoDestinatario?: string | null, nomeDestinatario?: string | null, assegnato: boolean, attribuzione?: string | null, statoProtocollo?: StatoProtocollo | null, creationOption: boolean, idMittente?: string | null, nomeMittente?: string | null, tsCreation?: any | null, tsStartVali?: any | null, tsStatoProtocollo?: any | null, revocabile: boolean, noteAssegnazione?: string | null } | null> | null } | null };

export type GetRegistroGiornalieroQueryVariables = Exact<{
  ricercaRegistroDTO: RicercaRegistiGiornalieriDtoInput;
}>;


export type GetRegistroGiornalieroQuery = { __typename?: 'Query', getRegistroGiornaliero?: { __typename?: 'RegistroGiornalieroOutputDTO', pageCount: any, totalResults: any, registri?: Array<{ __typename?: 'RegistroGiornaliero', id?: any | null, file?: string | null, note?: string | null, dataRegistro?: any | null, urn?: string | null, esitoVersamento?: string | null } | null> | null } | null };

export type GetStoricoProtocolloQueryVariables = Exact<{
  ricercaStoricoDTO?: InputMaybe<RicercaStoricoDtoInput>;
}>;


export type GetStoricoProtocolloQuery = { __typename?: 'Query', getStoricoProtocollo?: { __typename?: 'StoricoOutputDTO', pageCount: any, totalResults: any, logStorici?: Array<{ __typename?: 'Storico', tsCreation?: any | null, idUtente?: string | null, utente?: string | null, note?: string | null, operazione?: string | null } | null> | null } | null };

export type GetStoricoTitolarioQueryVariables = Exact<{
  ricercaStoricoDTO?: InputMaybe<RicercaStoricoDtoInput>;
}>;


export type GetStoricoTitolarioQuery = { __typename?: 'Query', getStoricoTitolario?: { __typename?: 'StoricoOutputDTO', pageCount: any, totalResults: any, logStorici?: Array<{ __typename?: 'Storico', tsCreation?: any | null, idUtente?: string | null, utente?: string | null, note?: string | null, operazione?: string | null, idTitolario?: any | null } | null> | null } | null };

export type GetStoricoRegistroGiornalieroQueryVariables = Exact<{
  ricercaStoricoDTO?: InputMaybe<RicercaStoricoDtoInput>;
}>;


export type GetStoricoRegistroGiornalieroQuery = { __typename?: 'Query', getStoricoRegistroGiornaliero?: { __typename?: 'StoricoOutputDTO', pageCount: any, totalResults: any, logStorici?: Array<{ __typename?: 'Storico', tsCreation?: any | null, idUtente?: string | null, utente?: string | null, note?: string | null, operazione?: string | null, idRegistroGiornaliero?: any | null } | null> | null } | null };

export type ListaCapQueryVariables = Exact<{
  prefix: Scalars['String'];
}>;


export type ListaCapQuery = { __typename?: 'Query', listaCap?: Array<string | null> | null };

export type CittaDaCapQueryVariables = Exact<{
  cap: Scalars['String'];
  prefix: Scalars['String'];
}>;


export type CittaDaCapQuery = { __typename?: 'Query', cittaDaCap?: Array<string | null> | null };

export type VieDaCapQueryVariables = Exact<{
  cap: Scalars['String'];
  prefix?: InputMaybe<Scalars['String']>;
}>;


export type VieDaCapQuery = { __typename?: 'Query', vieDaCap?: Array<string | null> | null };

export type VieDaCittaQueryVariables = Exact<{
  citta: Scalars['String'];
}>;


export type VieDaCittaQuery = { __typename?: 'Query', vieDaCitta?: Array<string | null> | null };

export type ListaCapEstesoQueryVariables = Exact<{
  prefix: Scalars['String'];
  citta: Scalars['String'];
  tipoRicerca: Scalars['String'];
}>;


export type ListaCapEstesoQuery = { __typename?: 'Query', listaCapEsteso?: Array<Array<string | null> | null> | null };

export type GetAllTagQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']>;
}>;


export type GetAllTagQuery = { __typename?: 'Query', getAllTag?: Array<{ __typename?: 'Tag', id?: any | null, nome?: string | null } | null> | null };

export type GetTagListQueryVariables = Exact<{
  searchTag?: InputMaybe<RicercaTagDtoInput>;
}>;


export type GetTagListQuery = { __typename?: 'Query', getTagList?: { __typename?: 'TagDTOList', pageCount: any, totalResults: any, tagList?: Array<{ __typename?: 'TagDTO', id?: any | null, nome?: string | null } | null> | null } | null };

export type GetTitolarioQueryVariables = Exact<{
  dto?: InputMaybe<RicercaTitolarioDtoInput>;
}>;


export type GetTitolarioQuery = { __typename?: 'Query', getTitolario?: { __typename?: 'TitolariOutputDTO', hasMore: boolean, currentPage: number, nextPage: number, lastIndex: number, lastIdTitolario: any, titolario?: Array<{ __typename?: 'TitolarioOutputDTO', id: any, idPadre: any, label?: string | null, tipologia?: string | null, note?: string | null, leaf: boolean, tsCreation?: any | null, tsChiusura?: any | null, tsDeleted?: any | null, closed: boolean, deleted: boolean, hierarchyString?: string | null, write: boolean, immutable: boolean, fascicoloDipendente: boolean, numDocumenti: number, numProtocolli: number, visible: boolean, hierarchy?: Array<{ __typename?: 'TitolarioOutputDTO', id: any, idPadre: any, label?: string | null, tipologia?: string | null, leaf: boolean, fascicoloDipendente: boolean } | null> | null } | null> | null } | null };

export type GetPathForTitolarioQueryVariables = Exact<{
  id: Scalars['BigInteger'];
}>;


export type GetPathForTitolarioQuery = { __typename?: 'Query', getPathForTitolarioItem?: string | null };

export type GetAllProtocolliByFascicoloQueryVariables = Exact<{
  idFascicolo: Scalars['BigInteger'];
}>;


export type GetAllProtocolliByFascicoloQuery = { __typename?: 'Query', getAllProtocolliByFascicolo?: Array<{ __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null> | null };

export type GetProtocolliByFascicoloQueryVariables = Exact<{
  ricerca_protocolli?: InputMaybe<RicercaProtocolliDtoInput>;
}>;


export type GetProtocolliByFascicoloQuery = { __typename?: 'Query', getProtocolliByFascicolo?: { __typename?: 'ProtocolliOutputDTO', pageCount: any, totalResults: any, protocolli?: Array<{ __typename?: 'Protocollo', id?: any | null, nProtocollo?: string | null, idMittente?: string | null, mittente?: string | null, assegnatari?: string | null, destinatari?: string | null, idUtente?: string | null, utente?: string | null, tipoRegistrazione?: TipoRegistrazione | null, oggetto?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, metodoSpedizione?: MetodoSpedizione | null, protocolloMittente?: string | null, dataProtocolloMittente?: any | null, note?: string | null, stato?: StatoProtocollo | null, nProtocolloCircolare?: string | null, cdr?: string | null, cdrCode?: string | null, indirizzoPecPeo?: string | null, corpoPecPeo?: string | null, invioEmailMultiplo?: number | null, nProtocolloEmergenza?: string | null, dataProtocolloEmergenza?: any | null, allegati?: Array<{ __typename?: 'Allegato', id?: any | null, idUtente?: string | null, tipoDocumento?: string | null, oggetto?: string | null, collocazioneTelematica?: string | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsStartVali?: any | null, riferimentoMinio?: string | null, isMain?: boolean | null, nome?: string | null, dimensione?: any | null, estensione?: string | null, idEmail?: any | null, impronta?: string | null, idOriginal?: any | null } | null> | null, protocolliClassificazioneList?: Array<{ __typename?: 'ProtocolliClassificazione', id?: any | null, idTitolario?: any | null, idUtenteLastOperation?: string | null, tsCreation?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null> | null } | null> | null } | null };

export type GetTitolarioByIdQueryVariables = Exact<{
  idTitolario: Scalars['BigInteger'];
}>;


export type GetTitolarioByIdQuery = { __typename?: 'Query', getTitolarioById?: { __typename?: 'Titolario', id?: any | null, idPadre?: any | null, idUtenteLastOperation?: string | null, cdr?: string | null, cdrCode?: string | null, leaf?: boolean | null, nome?: string | null, tipologiaTitolario?: TipologiaTitolario | null, tsCreation?: any | null, tsChiusura?: any | null, tsDeleted?: any | null, tsUpdate?: any | null } | null };

export type DettaglioTitolarioQueryVariables = Exact<{
  idTitolario: Scalars['BigInteger'];
}>;


export type DettaglioTitolarioQuery = { __typename?: 'Query', dettaglioTitolario?: { __typename?: 'TitolarioOutputDTO', id: any, idPadre: any, label?: string | null, tipologia?: string | null, hierarchyString?: string | null, note?: string | null, tsChiusura?: any | null, tsCreation?: any | null, tsDeleted?: any | null, nomeUtenteCreatore?: string | null, cdr?: string | null, closed: boolean, deleted: boolean, leaf: boolean, numDocumenti: number, numProtocolli: number, visible: boolean } | null };

export type GetPermessiVisibilitaQueryVariables = Exact<{
  visibilitaDTO: RicercaPermessiVisibilitaDtoInput;
}>;


export type GetPermessiVisibilitaQuery = { __typename?: 'Query', getPermessiVisibilita?: { __typename?: 'PermessiVisibilitaOutputDTO', pageCount: number, totalResults: any, permessi?: Array<{ __typename?: 'VisibilitaTitolario', id?: any | null, idUtente?: string | null, cdr?: string | null, cdrCode?: string | null, tsCreation?: any | null, write?: boolean | null, tsUpdate?: any | null, note?: string | null, idUtenteLastOperation?: string | null, usernameUtente?: string | null, nomeUtente?: string | null, titolario?: { __typename?: 'Titolario', id?: any | null } | null } | null> | null } | null };

export type GetClassificazioneStringByIdProtocolloQueryVariables = Exact<{
  idProtocollo?: InputMaybe<Scalars['BigInteger']>;
}>;


export type GetClassificazioneStringByIdProtocolloQuery = { __typename?: 'Query', getClassificazioneStringByIdProtocollo?: Array<{ __typename?: 'TitolarioOutputDTO', id: any, idPadre: any, label?: string | null, tipologia?: string | null, hierarchyString?: string | null, note?: string | null, tsChiusura?: any | null, tsCreation?: any | null, tsDeleted?: any | null, nomeUtenteCreatore?: string | null, cdr?: string | null, closed: boolean, deleted: boolean, leaf: boolean, numDocumenti: number, numProtocolli: number, visible: boolean } | null> | null };

export type GetMaxLivelloFascicolazioneForTitolarioQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMaxLivelloFascicolazioneForTitolarioQuery = { __typename?: 'Query', getMaxLivelloFascicolazioneForTitolario: number };

export type GetAllOfficesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOfficesQuery = { __typename?: 'Query', getAllOffices?: { __typename?: 'UfficiOutputDTO', pageCount: any, totalResults: any, uffici?: Array<{ __typename?: 'Office', name?: string | null, code?: string | null, description?: string | null } | null> | null } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers?: { __typename?: 'UtentiOutputDTO', pageCount: any, totalResults: any, utenti?: Array<{ __typename?: 'UtenteDTO', id?: string | null, nome?: string | null, cognome?: string | null } | null> | null } | null };

export type GetAllUsersWithRoleAndCdrQueryVariables = Exact<{
  roles?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  cdr: Scalars['String'];
  search?: InputMaybe<Scalars['String']>;
  size: Scalars['Int'];
}>;


export type GetAllUsersWithRoleAndCdrQuery = { __typename?: 'Query', forceGetAllUsersWithRoleAndCdr?: { __typename?: 'UtentiOutputDTO', pageCount: any, totalResults: any, utenti?: Array<{ __typename?: 'UtenteDTO', id?: string | null, nome?: string | null, cognome?: string | null, username?: string | null } | null> | null, datiUtenteSSO?: Array<{ __typename?: 'DatiUtenteSSO', auth_id?: string | null, firstName?: string | null, lastName?: string | null, username?: string | null, userOffices?: Array<{ __typename?: 'UserOffice', office?: { __typename?: 'Office', name?: string | null, code?: string | null, description?: string | null } | null, roles?: Array<{ __typename?: 'Role', full_name?: string | null, name?: string | null, hierarchy_level: number } | null> | null } | null> | null } | null> | null } | null };

export const AnagraficaBaseFragmentDoc = `
    fragment AnagraficaBase on Anagrafica {
  id
  ragioneSociale
  nome
  cognome
  cfPiva
  indirizzo
  citta
  cap
  provincia
  email
  pec
  telefono
  fax
  note
  tsCreation
  tsStartVali
  certificato
  cancellato
}
    `;
export const AnagraficaDtoFragmentDoc = `
    fragment AnagraficaDTO on AnagraficaDTO {
  id
  ragioneSociale
  nome
  cognome
  cfPiva
  indirizzo
  citta
  cap
  provincia
  email
  pec
  telefono
  fax
  note
  tsCreation
  tsStartVali
  certificato
  gruppi {
    id
    nome
  }
}
    `;
export const AllegatoBaseFragmentDoc = `
    fragment AllegatoBase on Allegato {
  id
  idUtente
  tipoDocumento
  oggetto
  collocazioneTelematica
  idUtenteLastOperation
  tsCreation
  tsStartVali
  riferimentoMinio
  isMain
  nome
  dimensione
  estensione
  idEmail
  impronta
  idOriginal
}
    `;
export const ProtocolliClassificazioneBaseFragmentDoc = `
    fragment ProtocolliClassificazioneBase on ProtocolliClassificazione {
  id
  idTitolario
  idUtenteLastOperation
  tsCreation
  tsDeleted
  tsUpdate
}
    `;
export const ProtocolloBaseFragmentDoc = `
    fragment ProtocolloBase on Protocollo {
  id
  nProtocollo
  idMittente
  mittente
  assegnatari
  destinatari
  idUtente
  utente
  tipoRegistrazione
  oggetto
  idUtenteLastOperation
  tsCreation
  tsStartVali
  metodoSpedizione
  protocolloMittente
  dataProtocolloMittente
  note
  stato
  nProtocolloCircolare
  cdr
  cdrCode
  indirizzoPecPeo
  corpoPecPeo
  invioEmailMultiplo
  nProtocolloEmergenza
  dataProtocolloEmergenza
  allegati {
    ...AllegatoBase
  }
  protocolliClassificazioneList {
    ...ProtocolliClassificazioneBase
  }
}
    ${AllegatoBaseFragmentDoc}
${ProtocolliClassificazioneBaseFragmentDoc}`;
export const EmailBaseFragmentDoc = `
    fragment EmailBase on Email {
  id
  protocollo {
    ...ProtocolloBase
  }
  tipoEmail
  emailDirection
  from
  to
  cc
  oggetto
  corpo
  tsInvio
  statoInvio
  classificazione
  idUtente
  tsCreation
  tsRicezione
  tsStartVali
  impronta
  messageId
}
    ${ProtocolloBaseFragmentDoc}`;
export const GruppoBaseFragmentDoc = `
    fragment GruppoBase on Gruppo {
  id
  nome
  note
  tsCreation
  tsUpdate
  tsDeleted
}
    `;
export const PostaEConfigruationFragmentFragmentDoc = `
    fragment PostaEConfigruationFragment on PeConfigurazione {
  tipologiaPosta
  smtpHost
  smtpPort
  useTls
  connectionTimeout
  env
}
    `;
export const UfficioFragmentFragmentDoc = `
    fragment UfficioFragment on Ufficio {
  id
  cdr
  cdrCode
}
    `;
export const PecPeoFragmentFragmentDoc = `
    fragment PecPeoFragment on PecPeo {
  id
  idUtente
  utente
  username
  indirizzoEmail
  tsCreation
  password
  attiva
  saveToSent
  readPec
  deleteMessages
  mustSendRispostaAutomatica
  configurazione {
    ...PostaEConfigruationFragment
  }
  uffici {
    ...UfficioFragment
  }
}
    ${PostaEConfigruationFragmentFragmentDoc}
${UfficioFragmentFragmentDoc}`;
export const PecEscluseRispostaAutomaticaBaseFragmentDoc = `
    fragment PecEscluseRispostaAutomaticaBase on PecEscluseRispostaAutomatica {
  id
  indirizzo
  tsCreation
}
    `;
export const ProtocolloNoAllegatiFragmentDoc = `
    fragment ProtocolloNoAllegati on Protocollo {
  id
  nProtocollo
  idMittente
  mittente
  assegnatari
  destinatari
  idUtente
  utente
  tipoRegistrazione
  oggetto
  idUtenteLastOperation
  tsCreation
  tsStartVali
  metodoSpedizione
  protocolloMittente
  dataProtocolloMittente
  note
  stato
  nProtocolloCircolare
  cdr
  cdrCode
  indirizzoPecPeo
  corpoPecPeo
  invioEmailMultiplo
  protocolliClassificazioneList {
    ...ProtocolliClassificazioneBase
  }
}
    ${ProtocolliClassificazioneBaseFragmentDoc}`;
export const RaccomandataBaseFragmentDoc = `
    fragment RaccomandataBase on RaccomandataProtocollo {
  protocollo {
    ...ProtocolloBase
  }
  allegato {
    id
    nome
    oggetto
  }
  tsCreation
  tsUpdate
  idRaccomandata
  id
  numero
  stato
  costo
  tipo
  mittente
  mittenteIndirizzo
  ulterioreDatoMittente
  mittenteCivico
  mittentePresso
  mittenteCap
  mittenteProvincia
  mittenteCitta
  destinatario
  destinatarioCitta
  destinatarioProvincia
  destinatarioCap
  destinatarioIndirizzo
  destinatarioIndirizzo2
  destinatarioCivico
  tsInserimento
  tsInoltro
  tsConsegna
  statoConsegna
}
    ${ProtocolloBaseFragmentDoc}`;
export const ReferenteProtocolloFragmentDoc = `
    fragment ReferenteProtocollo on ReferentiProtocolloDTO {
  id
  idProtocollo
  idDestinatario
  tipoDestinatario
  nomeDestinatario
  assegnato
  attribuzione
  statoProtocollo
  creationOption
  idMittente
  nomeMittente
  tsCreation
  tsStartVali
  tsStatoProtocollo
  revocabile
  noteAssegnazione
}
    `;
export const StoricoBaseFragmentDoc = `
    fragment StoricoBase on Storico {
  tsCreation
  idUtente
  utente
  note
  operazione
}
    `;
export const StoricoRegistroGiornalieroBaseFragmentDoc = `
    fragment StoricoRegistroGiornalieroBase on Storico {
  tsCreation
  idUtente
  utente
  note
  operazione
  idRegistroGiornaliero
}
    `;
export const StoricoTitolarioBaseFragmentDoc = `
    fragment StoricoTitolarioBase on Storico {
  tsCreation
  idUtente
  utente
  note
  operazione
  idTitolario
}
    `;
export const TagBaseFragmentDoc = `
    fragment TagBase on Tag {
  id
  nome
}
    `;
export const TitolarioBaseFragmentDoc = `
    fragment TitolarioBase on Titolario {
  id
  idPadre
  idUtenteLastOperation
  cdr
  cdrCode
  leaf
  nome
  tipologiaTitolario
  tsCreation
  tsChiusura
  tsDeleted
  tsUpdate
}
    `;
export const Titolario_Output_DtoFragmentDoc = `
    fragment titolario_output_dto on TitolarioOutputDTO {
  id
  idPadre
  label
  tipologia
  hierarchyString
  note
  tsChiusura
  tsCreation
  tsDeleted
  nomeUtenteCreatore
  cdr
  closed
  deleted
  leaf
  numDocumenti
  numProtocolli
  visible
}
    `;
export const DiscardAllegatoDocument = `
    mutation DiscardAllegato($idAllegato: BigInteger!) {
  discardAllegato(idAllegato: $idAllegato)
}
    `;
export const ResumeAllegatoDocument = `
    mutation ResumeAllegato($idAllegato: BigInteger!) {
  resumeAllegato(idAllegato: $idAllegato)
}
    `;
export const DeleteContattoDocument = `
    mutation deleteContatto($id: BigInteger!) {
  deleteContatto(id: $id)
}
    `;
export const ImportAnagraficaDocument = `
    mutation ImportAnagrafica($fileBase64: String!) {
  importAnagraficaFromBase64(fileBase64: $fileBase64)
}
    `;
export const SaveContattoDocument = `
    mutation saveContatto($anagraficaInput: AnagraficaInputInput) {
  saveContatto(anagraficaInput: $anagraficaInput) {
    ...AnagraficaBase
  }
}
    ${AnagraficaBaseFragmentDoc}`;
export const UpdateContattoDocument = `
    mutation updateContatto($id: BigInteger, $input: AnagraficaInputInput) {
  updateContatto(id: $id, anagraficaInput: $input) {
    ...AnagraficaBase
  }
}
    ${AnagraficaBaseFragmentDoc}`;
export const SaveLoginRaccomandataDocument = `
    mutation saveLoginRaccomandata($loginInput: LoginRaccomandataDTOInput!) {
  saveLoginRaccomandata(loginInput: $loginInput)
}
    `;
export const SaveLoginConservazioneDocument = `
    mutation saveLoginConservazione($loginInput: LoginConservazioneDTOInput!) {
  saveLoginConservazione(loginInput: $loginInput)
}
    `;
export const UpdateLoginRaccomandataDocument = `
    mutation updateLoginRaccomandata($loginInput: LoginRaccomandataDTOInput!) {
  updateLoginRaccomandata(loginInput: $loginInput)
}
    `;
export const UpdateLoginConservazioneDocument = `
    mutation updateLoginConservazione($loginInput: LoginConservazioneDTOInput!) {
  updateLoginConservazione(loginInput: $loginInput)
}
    `;
export const InoltraRispondiEmailDocument = `
    mutation inoltraRispondiEmail($dto: InoltraRispondiInput) {
  inoltraRispondiEmail(dto: $dto)
}
    `;
export const DeleteGruppoDocument = `
    mutation DeleteGruppo($groupId: BigInteger!) {
  deleteGruppo(groupId: $groupId)
}
    `;
export const RemoveContactFromGroupDocument = `
    mutation RemoveContactFromGroup($groupId: BigInteger!, $contactId: BigInteger!) {
  removeContactFromGroup(groupId: $groupId, contactId: $contactId)
}
    `;
export const SaveGruppoDocument = `
    mutation saveGruppo($gruppoAnagraficaDTO: GruppoAnagraficaDTOInput) {
  saveGruppo(gruppoAnagraficaDTO: $gruppoAnagraficaDTO) {
    ...GruppoBase
  }
}
    ${GruppoBaseFragmentDoc}`;
export const AddContactsToGroupDocument = `
    mutation AddContactsToGroup($groupId: BigInteger!, $contactIds: [BigInteger!]!) {
  addContactsToGroup(groupId: $groupId, contactIds: $contactIds)
}
    `;
export const UpdateGruppoDocument = `
    mutation UpdateGruppo($groupId: BigInteger!, $input: GruppoAnagraficaDTOInput!) {
  updateGruppo(groupId: $groupId, gruppoAnagraficaDTO: $input) {
    id
  }
}
    `;
export const DeleteModelloAutomaticoDocument = `
    mutation deleteModelloAutomatico($id: BigInteger!) {
  deleteModelloAutomatico(id: $id)
}
    `;
export const CreateModelloAutomaticoDocument = `
    mutation createModelloAutomatico($input: ModelloAutomaticoInputDTOInput) {
  createModelloAutomatico(input: $input) {
    id
    nomeModello
    oggettoProtocollo
    metodoSpedizione
    tipoRegistrazione
    cdrCode
    titolario {
      id
      idPadre
      nome
    }
    hierarchyStringTitolario
    cdr
  }
}
    `;
export const UpdateModelloAutomaticoDocument = `
    mutation updateModelloAutomatico($id: BigInteger!, $input: ModelloAutomaticoInputDTOInput) {
  updateModelloAutomatico(id: $id, input: $input) {
    id
    nomeModello
    oggettoProtocollo
    metodoSpedizione
    tipoRegistrazione
    cdrCode
    titolario {
      id
      idPadre
      nome
    }
    hierarchyStringTitolario
    cdr
  }
}
    `;
export const SavePecEsclusaDocument = `
    mutation savePecEsclusa($pecInput: PecEscluseRispostaAutomaticaInputInput!) {
  savePecEsclusa(pecInput: $pecInput) {
    id
    indirizzo
  }
}
    `;
export const UpdatePecEsclusaDocument = `
    mutation updatePecEsclusa($id: BigInteger!, $pecInput: PecEscluseRispostaAutomaticaInputInput!) {
  updatePecEsclusa(id: $id, pecInput: $pecInput) {
    id
    indirizzo
  }
}
    `;
export const DeletePecEsclusaDocument = `
    mutation deletePecEsclusa($id: BigInteger!) {
  deletePecEsclusa(id: $id)
}
    `;
export const DeletePecPeoConfigurationDocument = `
    mutation deletePecPeoConfiguration($id: BigInteger!) {
  deleteConfiguration(id: $id)
}
    `;
export const SavePecPeoConfigurationDocument = `
    mutation savePecPeoConfiguration($input: PecPeoDTOInputInput) {
  saveConfiguration(pecPeoDTOInput: $input)
}
    `;
export const UpdateConfigurationsDocument = `
    mutation updateConfigurations($id: BigInteger!, $input: PecPeoDTOInputInput) {
  updateConfigurations(id: $id, input: $input)
}
    `;
export const AddRegolaDocument = `
    mutation addRegola($input: PecRegolaInputDTOInput!) {
  savePecRegola(input: $input) {
    idEmail
    idCategoriaRegola
  }
}
    `;
export const DeleteRegolaDocument = `
    mutation deleteRegola($idEmail: BigInteger!, $idCategoria: BigInteger!) {
  deletePecRegola(idEmail: $idEmail, idCategoria: $idCategoria)
}
    `;
export const ExportListaProtocolliDocument = `
    mutation exportListaProtocolli($dto: RicercaProtocolliDTOInput!, $formato: String!, $idProtocolliSelezionati: [BigInteger]) {
  exportListaProtocolli(
    dto: $dto
    formato: $formato
    idProtocolliSelezionati: $idProtocolliSelezionati
  )
}
    `;
export const ImportProtocolliEmergenzaDocument = `
    mutation ImportProtocolliEmergenza($fileBase64: String!, $selectedOffice: String!, $cdr: String!) {
  importProtocolliEmergenzaFromBase64(
    fileBase64: $fileBase64
    selectedOffice: $selectedOffice
    cdr: $cdr
  ) {
    nProtocollo
    nProtocolloEmergenza
    imported
  }
}
    `;
export const AnnullaProtocolloDocument = `
    mutation annullaProtocollo($idProtocollo: BigInteger!, $notaAnnullamento: String!) {
  annullaProtocollo(
    idProtocollo: $idProtocollo
    notaAnnullamento: $notaAnnullamento
  )
}
    `;
export const RichiestaAnnullamentoProtocolloDocument = `
    mutation richiestaAnnullamentoProtocollo($idProtocollo: BigInteger!, $notaAnnullamento: String!) {
  richiestaAnnullamentoProtocollo(
    idProtocollo: $idProtocollo
    notaAnnullamento: $notaAnnullamento
  )
}
    `;
export const GestioneAnnullamentoDocument = `
    mutation gestioneAnnullamento($idProtocollo: BigInteger!, $isAnnulla: Boolean!, $nota: String!) {
  gestioneAnnullamento(
    idProtocollo: $idProtocollo
    isAnnulla: $isAnnulla
    nota: $nota
  )
}
    `;
export const AssegnaProtocolloDocument = `
    mutation assegnaProtocollo($idProtocollo: BigInteger, $assegnatari: [ReferenteProtocolloInputInput], $selectedOffice: String!, $noteAssegnazione: String) {
  assegnaProtocollo(
    idProtocollo: $idProtocollo
    assegnatari: $assegnatari
    selectedOffice: $selectedOffice
    noteAssegnazione: $noteAssegnazione
  )
}
    `;
export const AssegnazioneProtocolloMassivaDocument = `
    mutation assegnazioneProtocolloMassiva($numbers: [String!]!, $selectedOffice: String!, $referenti: [ReferenteProtocolloInputInput!]!, $noteAssegnazione: String) {
  assegnazioneProtocolloMassiva(
    numbers: $numbers
    selectedOffice: $selectedOffice
    assegnatari: $referenti
    noteAssegnazione: $noteAssegnazione
  )
}
    `;
export const FascicolaProtocolloDocument = `
    mutation FascicolaProtocollo($idProtocollo: BigInteger!, $idTitolarioList: [BigInteger!], $selectedOffice: String!) {
  fascicolazioneProtocollo(
    idProtocollo: $idProtocollo
    idTitolarioList: $idTitolarioList
    selectedOffice: $selectedOffice
  )
}
    `;
export const FascicolaProtocolloMassivoDocument = `
    mutation FascicolaProtocolloMassivo($idProtocolloList: [BigInteger]!, $idTitolarioList: [BigInteger!], $selectedOffice: String!) {
  fascicolazioneMassivaProtocollo(
    idProtocolloList: $idProtocolloList
    idTitolarioList: $idTitolarioList
    selectedOffice: $selectedOffice
  )
}
    `;
export const SaveProtocolloDocument = `
    mutation saveProtocollo($data: ProtocolloInputInput!) {
  saveProtocollo(protocollo_input: $data) {
    id
    nProtocollo
  }
}
    `;
export const SaveProtocolloByEmailDocument = `
    mutation saveProtocolloByEmail($idEmail: BigInteger!) {
  saveProtocolloByEmail(idEmail: $idEmail) {
    id
    nProtocollo
    stato
    indirizzoPecPeo
  }
}
    `;
export const InsertRaccomandataDocument = `
    mutation insertRaccomandata($input: RaccomandataProtocolloInputInput!) {
  insertRaccomandata(input: $input) {
    id
  }
}
    `;
export const NotificaProtocolloDocument = `
    mutation notificaProtocollo($input: NotificaProtocolloPecPeoInputInput!) {
  notificaProtocollo(input: $input)
}
    `;
export const UpdateNoteProtocolloDocument = `
    mutation updateNoteProtocollo($input: ProtocolloUpdateInputInput) {
  updateNoteProtocollo(updateInput: $input)
}
    `;
export const RevocaAssegnazioneProtocolloDocument = `
    mutation RevocaAssegnazioneProtocollo($referentiProtocolloId: BigInteger!) {
  revocaAssegnazioneProtocollo(referentiProtocolloId: $referentiProtocolloId)
}
    `;
export const RichiestaAssegnazioneProtocolloDocument = `
    mutation richiestaAssegnazioneProtocollo($idProtocollo: BigInteger!, $note: String) {
  richiestaAssegnazioneProtocollo(idProtocollo: $idProtocollo, note: $note)
}
    `;
export const RifiutaProtocolloDocument = `
    mutation rifiutaProtocollo($nProtocollo: String, $note: String, $selectedOffice: String) {
  rifiutaProtocollo(
    nProtocollo: $nProtocollo
    note: $note
    selectedOffice: $selectedOffice
  )
}
    `;
export const RifiutaProtocolloMassivaDocument = `
    mutation RifiutaProtocolloMassiva($numbers: [String!], $selectedOffice: String!, $note: String!) {
  rifiutaProtocolloMassiva(
    numbers: $numbers
    selectedOffice: $selectedOffice
    note: $note
  )
}
    `;
export const UpdateProtocolloDocument = `
    mutation updateProtocollo($data: ProtocolloUpdateInputInput!) {
  updateProtocollo(updateInput: $data) {
    id
    nProtocollo
  }
}
    `;
export const AnnullaRaccomandataDocument = `
    mutation annullaRaccomandata($id: BigInteger!, $motivazione: String!) {
  annullaRaccomandata(id: $id, motivazione: $motivazione)
}
    `;
export const UpdateStatoRaccomandateForProtocolloDocument = `
    mutation updateStatoRaccomandateForProtocollo($id: BigInteger!) {
  updateStatoRaccomandateForProtocollo(id: $id)
}
    `;
export const UpdateStatoProtocolloDocument = `
    mutation updateStatoProtocollo($input: StatoProtocolloInputInput) {
  updateStatoProtocollo(stato_protocollo_input: $input)
}
    `;
export const PresaInCaricoProtocolloMassivaDocument = `
    mutation presaInCaricoProtocolloMassiva($numbers: [String!], $selectedOffice: String!) {
  presaInCaricoProtocolloMassiva(
    numbers: $numbers
    selectedOffice: $selectedOffice
  )
}
    `;
export const ExportStoricoDocument = `
    mutation exportStorico($dto: RicercaStoricoDTOInput!, $formato: String!) {
  exportStorico(dto: $dto, formato: $formato)
}
    `;
export const SaveTagDocument = `
    mutation saveTag($tagInput: TagInputInput!) {
  saveTag(tagInput: $tagInput) {
    id
    nome
  }
}
    `;
export const UpdateTagDocument = `
    mutation updateTag($id: BigInteger!, $tagInput: TagInputInput!) {
  updateTag(id: $id, tagInput: $tagInput) {
    id
    nome
  }
}
    `;
export const DeleteTagDocument = `
    mutation deleteTag($id: BigInteger!) {
  deleteTag(id: $id)
}
    `;
export const DeleteTitolarioDocument = `
    mutation deleteTitolario($idTitolario: BigInteger!) {
  deleteTitolario(idTitolario: $idTitolario)
}
    `;
export const DeleteVisibilitaTitolarioDocument = `
    mutation deleteVisibilitaTitolario($idVisibilitaList: [BigInteger]!) {
  deleteVisibilitaTitolario(deleteVisibilitaTitolario: $idVisibilitaList)
}
    `;
export const DropTitolarioDocument = `
    mutation dropTitolario($idTitolario: BigInteger!) {
  dropTitolario(idTitolario: $idTitolario)
}
    `;
export const InsertVisibilitaTitolarioDocument = `
    mutation insertVisibilitaTitolario($visibilitaTitolarioInput: VisibilitaTitolarioInputInput!) {
  insertVisibilitatitolario(visibilitaTitolarioInput: $visibilitaTitolarioInput)
}
    `;
export const InsertTitolarioDocument = `
    mutation insertTitolario($titolarioInput: TitolarioInputInput!) {
  insertTitolario(titolarioInput: $titolarioInput)
}
    `;
export const SetMaxLivelloFascicolazioneForTitolarioDocument = `
    mutation setMaxLivelloFascicolazioneForTitolario($livello: Int!) {
  setMaxLivelloFascicolazioneForTitolario(livello: $livello)
}
    `;
export const SpostaProtocolloDocument = `
    mutation spostaProtocollo($idProtocolli: [BigInteger!]!, $idFascicoloOld: BigInteger!, $idFascicoloNew: BigInteger!) {
  spostaProtocollo(
    idProtocolli: $idProtocolli
    idFascicoloOld: $idFascicoloOld
    idFascicoloNew: $idFascicoloNew
  )
}
    `;
export const SpostaFascicoloDocument = `
    mutation spostaFascicolo($idFascicoliList: [BigInteger!]!, $idFascicoloPadre: BigInteger!, $cdr: String!, $cdrCode: String!) {
  spostaFascicolo(
    idFascicoliList: $idFascicoliList
    idFascicoloPadre: $idFascicoloPadre
    cdr: $cdr
    cdrCode: $cdrCode
  )
}
    `;
export const SpostaAllegatiFascicoloDocument = `
    mutation spostaAllegatiFascicolo($allegatiIds: [BigInteger!]!, $oldTitolarioId: BigInteger!, $newTitolarioId: BigInteger!) {
  spostaAllegatiFascicolo(
    allegatiIds: $allegatiIds
    oldTitolarioId: $oldTitolarioId
    newTitolarioId: $newTitolarioId
  )
}
    `;
export const UpdateTitolarioDocument = `
    mutation updateTitolario($titolarioInput: TitolarioInputInput!) {
  updateTitolario(titolarioInput: $titolarioInput)
}
    `;
export const GetAllExtensionsDocument = `
    query getAllExtensions {
  getAllExtensions
}
    `;
export const GetAllegatiDocument = `
    query GetAllegati($ricercaAllegatiDTO: RicercaAllegatiDTOInput!) {
  getAllegati(ricercaAllegatiDTO: $ricercaAllegatiDTO) {
    allegati {
      id
      idOriginal
      idUtente
      nome
      dimensione
      estensione
      impronta
    }
    pageCount
    totalResults
  }
}
    `;
export const GetAllegatiDiscardedDocument = `
    query GetAllegatiDiscarded($ricercaAllegatiDTO: RicercaAllegatiDTOInput!) {
  getAllegatiDiscarded(ricercaAllegatiDTO: $ricercaAllegatiDTO) {
    allegati {
      nome
      collocazioneTelematica
      oggetto
      id
      idOriginal
      estensione
      dimensione
    }
  }
}
    `;
export const GetAllAnagraficaDocument = `
    query getAllAnagrafica($ricercaAnagraficaDTO: RicercaAnagraficaDTOInput) {
  getAllAnagrafica(ricercaAnagrafica: $ricercaAnagraficaDTO) {
    anagraficaList {
      ...AnagraficaDTO
    }
    pageCount
    totalResults
  }
}
    ${AnagraficaDtoFragmentDoc}`;
export const GetContattoInadDocument = `
    query GetContattoInad($codiceFiscale: String!) {
  getContattoInad(codiceFiscale: $codiceFiscale)
}
    `;
export const GetDettaglioAnagraficaDocument = `
    query getDettaglioAnagrafica($id: BigInteger) {
  getDettaglioAnagrafica(id: $id) {
    id
    ragioneSociale
    nome
    cognome
    indirizzo
    citta
    cap
    provincia
  }
}
    `;
export const GetPecPeoByTipologiaPostaDocument = `
    query getPecPeoByTipologiaPosta($idUtente: String, $tipologiaPosta: String!, $selectedCdrCode: String!) {
  getPecPeoByTipologiaPosta(
    idUtente: $idUtente
    tipologiaPosta: $tipologiaPosta
    selectedCdrCode: $selectedCdrCode
  )
}
    `;
export const GetPecPeoByUtenteAndCdrDocument = `
    query getPecPeoByUtenteAndCdr($idUtente: String, $selectedCdrCode: String!) {
  getPecPeoByUtenteAndCdr(idUtente: $idUtente, selectedCdrCode: $selectedCdrCode)
}
    `;
export const FindAllPecPeoIdByEmailDocument = `
    query findAllPecPeoIdByEmail($id: BigInteger!, $indirizzoEmail: String!) {
  findAllPecPeoIdByEmail(id: $id, indirizzoEmail: $indirizzoEmail)
}
    `;
export const GetPecPeoConfigurationsDocument = `
    query getPecPeoConfigurations($RicercaConfigPEDTOInput: RicercaConfigPEDTOInput) {
  getConfigurations(ricerca: $RicercaConfigPEDTOInput) {
    pageCount
    totalResults
    configurazioniPostaElettronica {
      ...PecPeoFragment
    }
  }
}
    ${PecPeoFragmentFragmentDoc}`;
export const GetConfiguredUsersDocument = `
    query getConfiguredUsers {
  getConfiguredUsers {
    ...PecPeoFragment
  }
}
    ${PecPeoFragmentFragmentDoc}`;
export const GetLoginRaccomandataDocument = `
    query getLoginRaccomandata {
  getLoginRaccomandata {
    gruppo
    username
    password
  }
}
    `;
export const GetLoginConservazioneDocument = `
    query getLoginConservazione {
  getLoginConservazione {
    url
    username
    password
    ambiente
    ente
    struttura
  }
}
    `;
export const GetEmailsDocument = `
    query getEmails($ricerca: RicercaEmailDTOInput) {
  getEmails(ricerca: $ricerca) {
    pageCount
    totalResults
    email {
      ...EmailBase
    }
  }
}
    ${EmailBaseFragmentDoc}`;
export const GetAllGruppiDocument = `
    query getAllGruppi($ricercaGruppiDTO: RicercaGruppiDTOInput) {
  getAllGruppi(ricercaGruppi: $ricercaGruppiDTO) {
    gruppiList {
      ...GruppoBase
    }
    pageCount
    totalResults
  }
}
    ${GruppoBaseFragmentDoc}`;
export const DettaglioGruppoDocument = `
    query DettaglioGruppo($groupId: BigInteger!) {
  dettaglioGruppo(groupId: $groupId) {
    id
    nome
    note
    creation
    update
    deleted
  }
}
    `;
export const GetModelliAutomaticiByCdrCodeDocument = `
    query getModelliAutomaticiByCdrCode($selectedOffice: String!) {
  getModelliAutomaticiByCdrCode(selectedOffice: $selectedOffice) {
    id
    nomeModello
    oggettoProtocollo
    metodoSpedizione
    tipoRegistrazione
    cdrCode
    titolario {
      id
      idPadre
      nome
    }
    hierarchyStringTitolario
    cdr
  }
}
    `;
export const SearchModelliAutomaticiDocument = `
    query searchModelliAutomatici($input: RicercaModelloAutomaticoDTOInput) {
  searchModelliAutomatici(input: $input) {
    pageCount
    totalResults
    modelloAutomaticoList {
      id
      nomeModello
      oggettoProtocollo
      metodoSpedizione
      tipoRegistrazione
      cdrCode
      titolario {
        id
        idPadre
        nome
      }
      hierarchyStringTitolario
      cdr
    }
  }
}
    `;
export const GetAllPecEscluseDocument = `
    query getAllPecEscluse($search: String) {
  getAllPecEscluse(search: $search) {
    ...PecEscluseRispostaAutomaticaBase
  }
}
    ${PecEscluseRispostaAutomaticaBaseFragmentDoc}`;
export const GetPecEscluseListDocument = `
    query getPecEscluseList($searchPecEscluse: RicercaPecEscluseRispostaAutomaticaDTOInput) {
  getPecEscluseList(searchPecEscluse: $searchPecEscluse) {
    pecEscluseRispostaAutomaticaList {
      id
      indirizzo
      tsCreation
    }
    pageCount
    totalResults
  }
}
    `;
export const GetPecRegoleDocument = `
    query getPecRegole($idEmail: BigInteger!) {
  getPecRegole(idEmail: $idEmail) {
    list {
      idEmail
      idCategoriaRegola
      threshold
      durationMinutes
      enabled
      finestre {
        dayOfWeek
        start
        end
      }
    }
  }
}
    `;
export const GetProtocolliDocument = `
    query GetProtocolli($ricercaProtocolliDTO: RicercaProtocolliDTOInput) {
  getProtocolli(ricerca_protocolli: $ricercaProtocolliDTO) {
    pageCount
    totalResults
    protocolli {
      ...ProtocolloBase
    }
  }
}
    ${ProtocolloBaseFragmentDoc}`;
export const GetProtocolloByNumeroDocument = `
    query getProtocolloByNumero($nProtocollo: String) {
  protocolloByNumero(nProtocollo: $nProtocollo) {
    ...ProtocolloBase
  }
}
    ${ProtocolloBaseFragmentDoc}`;
export const GetProtocolloByIdDocument = `
    query getProtocolloById($id: BigInteger!) {
  getProtocolloById(id: $id) {
    id
    nProtocollo
  }
}
    `;
export const GenerateBarcodeDocument = `
    query generateBarcode($nProtocollo: String) {
  generateBarcode(nProtocollo: $nProtocollo)
}
    `;
export const GenerateRicevutaDocument = `
    query generateRicevuta($nProtocollo: String) {
  generateRicevuta(nProtocollo: $nProtocollo)
}
    `;
export const GetAllegatoPrincipaleDocument = `
    query getAllegatoPrincipale($nProtocollo: String) {
  getProtocolloAllegatoPrincipale(nProtocollo: $nProtocollo) {
    ...AllegatoBase
  }
}
    ${AllegatoBaseFragmentDoc}`;
export const DettaglioProtocolloDocument = `
    query dettaglioProtocollo($nProtocollo: String, $selectedOffice: String) {
  dettaglioProtocollo(nProtocollo: $nProtocollo, selectedOffice: $selectedOffice) {
    destinatariCompetenza {
      label
      idDestinatario
      tipo
    }
    destinatariConoscenza {
      label
      idDestinatario
      tipo
    }
    protocollo {
      ...ProtocolloBase
    }
    titolario {
      ...titolario_output_dto
    }
    statoProtocollo
    assegna
    rifiuta
    annulla
    richiestaAnnullamento
    gestioneAnnullamento
    protocolAuthor
    authorized
    canPrendereInCaricoFromPec
    canViewFromPec
    tagList {
      id
      nome
    }
  }
}
    ${ProtocolloBaseFragmentDoc}
${Titolario_Output_DtoFragmentDoc}`;
export const CercaRaccomandateDocument = `
    query cercaRaccomandate($ricercaRaccomandate: RicercaRaccomandataDTOInput!) {
  cercaRaccomandate(ricercaRaccomandate: $ricercaRaccomandate) {
    raccomandate {
      ...RaccomandataBase
    }
    pageCount
    totalResults
  }
}
    ${RaccomandataBaseFragmentDoc}`;
export const GetAssegnatariTooltipForProtocolloDocument = `
    query getAssegnatariTooltipForProtocollo($idProtocollo: BigInteger) {
  getAssegnatariTooltipForProtocollo(idProtocollo: $idProtocollo) {
    nomeDestinatario
    ufficioLavorazione
    statoProtocollo
  }
}
    `;
export const GetMittenteFiledsDocument = `
    query getMittenteFileds {
  getMittenteFileds {
    mittente
    dipartimentoServizio
    indirizzo
    civico
    presso
    citta
    cap
    provincia
  }
}
    `;
export const FindReferentiDocument = `
    query findReferenti($search: RicercaReferentiDTOInput) {
  findReferenti(ricerca_referenti: $search) {
    referenti {
      id
      idDestinatario
      label
      tipo
      ragioneSociale
      nome
      cognome
      cfPiva
      pec
      email
      descrizione
      citta
      cap
      indirizzo
      ipaResponseDTO {
        codAmm
        descAmm
        acronimo
        codAOO
        codUniOU
        descOU
        cfPiva
        pec
        ragioneSociale
        indirizzo
        citta
        provincia
        cap
        telefono
        fax
      }
      children {
        id
        idDestinatario
        label
        tipo
        ragioneSociale
        nome
        cognome
        cfPiva
        pec
        email
        descrizione
        citta
        cap
        indirizzo
      }
    }
    pageCount
    totalResults
  }
}
    `;
export const GetReferentiProtocolloDocument = `
    query getReferentiProtocollo($ricercaReferentiProtocollo: RicercaReferentiProtocolloDTOInput) {
  getReferenti(ricercaReferentiProtocollo: $ricercaReferentiProtocollo) {
    pageCount
    totalResults
    referenti {
      ...ReferenteProtocollo
    }
  }
}
    ${ReferenteProtocolloFragmentDoc}`;
export const GetRegistroGiornalieroDocument = `
    query GetRegistroGiornaliero($ricercaRegistroDTO: RicercaRegistiGiornalieriDTOInput!) {
  getRegistroGiornaliero(ricercaRegistroDTO: $ricercaRegistroDTO) {
    registri {
      id
      file
      note
      dataRegistro
      urn
      esitoVersamento
    }
    pageCount
    totalResults
  }
}
    `;
export const GetStoricoProtocolloDocument = `
    query getStoricoProtocollo($ricercaStoricoDTO: RicercaStoricoDTOInput) {
  getStoricoProtocollo(ricerca_storico: $ricercaStoricoDTO) {
    logStorici {
      ...StoricoBase
    }
    pageCount
    totalResults
  }
}
    ${StoricoBaseFragmentDoc}`;
export const GetStoricoTitolarioDocument = `
    query getStoricoTitolario($ricercaStoricoDTO: RicercaStoricoDTOInput) {
  getStoricoTitolario(ricerca_storico: $ricercaStoricoDTO) {
    logStorici {
      ...StoricoTitolarioBase
    }
    pageCount
    totalResults
  }
}
    ${StoricoTitolarioBaseFragmentDoc}`;
export const GetStoricoRegistroGiornalieroDocument = `
    query getStoricoRegistroGiornaliero($ricercaStoricoDTO: RicercaStoricoDTOInput) {
  getStoricoRegistroGiornaliero(ricerca_storico: $ricercaStoricoDTO) {
    logStorici {
      ...StoricoRegistroGiornalieroBase
    }
    pageCount
    totalResults
  }
}
    ${StoricoRegistroGiornalieroBaseFragmentDoc}`;
export const ListaCapDocument = `
    query ListaCap($prefix: String!) {
  listaCap(prefix: $prefix)
}
    `;
export const CittaDaCapDocument = `
    query CittaDaCap($cap: String!, $prefix: String!) {
  cittaDaCap(cap: $cap, prefix: $prefix)
}
    `;
export const VieDaCapDocument = `
    query VieDaCap($cap: String!, $prefix: String) {
  vieDaCap(cap: $cap, prefix: $prefix)
}
    `;
export const VieDaCittaDocument = `
    query VieDaCitta($citta: String!) {
  vieDaCitta(citta: $citta)
}
    `;
export const ListaCapEstesoDocument = `
    query ListaCapEsteso($prefix: String!, $citta: String!, $tipoRicerca: String!) {
  listaCapEsteso(prefix: $prefix, citta: $citta, tipoRicerca: $tipoRicerca)
}
    `;
export const GetAllTagDocument = `
    query getAllTag($search: String) {
  getAllTag(search: $search) {
    ...TagBase
  }
}
    ${TagBaseFragmentDoc}`;
export const GetTagListDocument = `
    query GetTagList($searchTag: RicercaTagDTOInput) {
  getTagList(searchTag: $searchTag) {
    tagList {
      id
      nome
    }
    pageCount
    totalResults
  }
}
    `;
export const GetTitolarioDocument = `
    query GetTitolario($dto: RicercaTitolarioDTOInput) {
  getTitolario(dto: $dto) {
    hasMore
    currentPage
    nextPage
    lastIndex
    lastIdTitolario
    titolario {
      id
      idPadre
      label
      tipologia
      note
      leaf
      tsCreation
      tsChiusura
      tsDeleted
      closed
      deleted
      hierarchyString
      write
      immutable
      fascicoloDipendente
      numDocumenti
      numProtocolli
      visible
      hierarchy {
        id
        idPadre
        label
        tipologia
        leaf
        fascicoloDipendente
      }
    }
  }
}
    `;
export const GetPathForTitolarioDocument = `
    query GetPathForTitolario($id: BigInteger!) {
  getPathForTitolarioItem(id: $id)
}
    `;
export const GetAllProtocolliByFascicoloDocument = `
    query getAllProtocolliByFascicolo($idFascicolo: BigInteger!) {
  getAllProtocolliByFascicolo(idFascicolo: $idFascicolo) {
    ...ProtocolloNoAllegati
  }
}
    ${ProtocolloNoAllegatiFragmentDoc}`;
export const GetProtocolliByFascicoloDocument = `
    query getProtocolliByFascicolo($ricerca_protocolli: RicercaProtocolliDTOInput) {
  getProtocolliByFascicolo(ricerca_protocolli: $ricerca_protocolli) {
    pageCount
    totalResults
    protocolli {
      ...ProtocolloBase
    }
  }
}
    ${ProtocolloBaseFragmentDoc}`;
export const GetTitolarioByIdDocument = `
    query getTitolarioById($idTitolario: BigInteger!) {
  getTitolarioById(idTitolario: $idTitolario) {
    ...TitolarioBase
  }
}
    ${TitolarioBaseFragmentDoc}`;
export const DettaglioTitolarioDocument = `
    query dettaglioTitolario($idTitolario: BigInteger!) {
  dettaglioTitolario(idTitolario: $idTitolario) {
    ...titolario_output_dto
  }
}
    ${Titolario_Output_DtoFragmentDoc}`;
export const GetPermessiVisibilitaDocument = `
    query GetPermessiVisibilita($visibilitaDTO: RicercaPermessiVisibilitaDTOInput!) {
  getPermessiVisibilita(visibilitaDTO: $visibilitaDTO) {
    permessi {
      id
      titolario {
        id
      }
      idUtente
      cdr
      cdrCode
      tsCreation
      write
      tsUpdate
      note
      idUtenteLastOperation
      usernameUtente
      nomeUtente
    }
    pageCount
    totalResults
  }
}
    `;
export const GetClassificazioneStringByIdProtocolloDocument = `
    query getClassificazioneStringByIdProtocollo($idProtocollo: BigInteger) {
  getClassificazioneStringByIdProtocollo(idProtocollo: $idProtocollo) {
    ...titolario_output_dto
  }
}
    ${Titolario_Output_DtoFragmentDoc}`;
export const GetMaxLivelloFascicolazioneForTitolarioDocument = `
    query getMaxLivelloFascicolazioneForTitolario {
  getMaxLivelloFascicolazioneForTitolario
}
    `;
export const GetAllOfficesDocument = `
    query getAllOffices {
  getAllOffices {
    pageCount
    totalResults
    uffici {
      name
      code
      description
    }
  }
}
    `;
export const GetAllUsersDocument = `
    query getAllUsers {
  getAllUsers {
    pageCount
    totalResults
    utenti {
      id
      nome
      cognome
    }
  }
}
    `;
export const GetAllUsersWithRoleAndCdrDocument = `
    query GetAllUsersWithRoleAndCdr($roles: [String!], $cdr: String!, $search: String, $size: Int!) {
  forceGetAllUsersWithRoleAndCdr(
    roles: $roles
    cdr: $cdr
    search: $search
    size: $size
  ) {
    utenti {
      id
      nome
      cognome
      username
    }
    datiUtenteSSO {
      auth_id
      firstName
      lastName
      username
      userOffices {
        office {
          name
          code
          description
        }
        roles {
          full_name
          name
          hierarchy_level
        }
      }
    }
    pageCount
    totalResults
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    DiscardAllegato: build.mutation<DiscardAllegatoMutation, DiscardAllegatoMutationVariables>({
      query: (variables) => ({ document: DiscardAllegatoDocument, variables })
    }),
    ResumeAllegato: build.mutation<ResumeAllegatoMutation, ResumeAllegatoMutationVariables>({
      query: (variables) => ({ document: ResumeAllegatoDocument, variables })
    }),
    deleteContatto: build.mutation<DeleteContattoMutation, DeleteContattoMutationVariables>({
      query: (variables) => ({ document: DeleteContattoDocument, variables })
    }),
    ImportAnagrafica: build.mutation<ImportAnagraficaMutation, ImportAnagraficaMutationVariables>({
      query: (variables) => ({ document: ImportAnagraficaDocument, variables })
    }),
    saveContatto: build.mutation<SaveContattoMutation, SaveContattoMutationVariables | void>({
      query: (variables) => ({ document: SaveContattoDocument, variables })
    }),
    updateContatto: build.mutation<UpdateContattoMutation, UpdateContattoMutationVariables | void>({
      query: (variables) => ({ document: UpdateContattoDocument, variables })
    }),
    saveLoginRaccomandata: build.mutation<SaveLoginRaccomandataMutation, SaveLoginRaccomandataMutationVariables>({
      query: (variables) => ({ document: SaveLoginRaccomandataDocument, variables })
    }),
    saveLoginConservazione: build.mutation<SaveLoginConservazioneMutation, SaveLoginConservazioneMutationVariables>({
      query: (variables) => ({ document: SaveLoginConservazioneDocument, variables })
    }),
    updateLoginRaccomandata: build.mutation<UpdateLoginRaccomandataMutation, UpdateLoginRaccomandataMutationVariables>({
      query: (variables) => ({ document: UpdateLoginRaccomandataDocument, variables })
    }),
    updateLoginConservazione: build.mutation<UpdateLoginConservazioneMutation, UpdateLoginConservazioneMutationVariables>({
      query: (variables) => ({ document: UpdateLoginConservazioneDocument, variables })
    }),
    inoltraRispondiEmail: build.mutation<InoltraRispondiEmailMutation, InoltraRispondiEmailMutationVariables | void>({
      query: (variables) => ({ document: InoltraRispondiEmailDocument, variables })
    }),
    DeleteGruppo: build.mutation<DeleteGruppoMutation, DeleteGruppoMutationVariables>({
      query: (variables) => ({ document: DeleteGruppoDocument, variables })
    }),
    RemoveContactFromGroup: build.mutation<RemoveContactFromGroupMutation, RemoveContactFromGroupMutationVariables>({
      query: (variables) => ({ document: RemoveContactFromGroupDocument, variables })
    }),
    saveGruppo: build.mutation<SaveGruppoMutation, SaveGruppoMutationVariables | void>({
      query: (variables) => ({ document: SaveGruppoDocument, variables })
    }),
    AddContactsToGroup: build.mutation<AddContactsToGroupMutation, AddContactsToGroupMutationVariables>({
      query: (variables) => ({ document: AddContactsToGroupDocument, variables })
    }),
    UpdateGruppo: build.mutation<UpdateGruppoMutation, UpdateGruppoMutationVariables>({
      query: (variables) => ({ document: UpdateGruppoDocument, variables })
    }),
    deleteModelloAutomatico: build.mutation<DeleteModelloAutomaticoMutation, DeleteModelloAutomaticoMutationVariables>({
      query: (variables) => ({ document: DeleteModelloAutomaticoDocument, variables })
    }),
    createModelloAutomatico: build.mutation<CreateModelloAutomaticoMutation, CreateModelloAutomaticoMutationVariables | void>({
      query: (variables) => ({ document: CreateModelloAutomaticoDocument, variables })
    }),
    updateModelloAutomatico: build.mutation<UpdateModelloAutomaticoMutation, UpdateModelloAutomaticoMutationVariables>({
      query: (variables) => ({ document: UpdateModelloAutomaticoDocument, variables })
    }),
    savePecEsclusa: build.mutation<SavePecEsclusaMutation, SavePecEsclusaMutationVariables>({
      query: (variables) => ({ document: SavePecEsclusaDocument, variables })
    }),
    updatePecEsclusa: build.mutation<UpdatePecEsclusaMutation, UpdatePecEsclusaMutationVariables>({
      query: (variables) => ({ document: UpdatePecEsclusaDocument, variables })
    }),
    deletePecEsclusa: build.mutation<DeletePecEsclusaMutation, DeletePecEsclusaMutationVariables>({
      query: (variables) => ({ document: DeletePecEsclusaDocument, variables })
    }),
    deletePecPeoConfiguration: build.mutation<DeletePecPeoConfigurationMutation, DeletePecPeoConfigurationMutationVariables>({
      query: (variables) => ({ document: DeletePecPeoConfigurationDocument, variables })
    }),
    savePecPeoConfiguration: build.mutation<SavePecPeoConfigurationMutation, SavePecPeoConfigurationMutationVariables | void>({
      query: (variables) => ({ document: SavePecPeoConfigurationDocument, variables })
    }),
    updateConfigurations: build.mutation<UpdateConfigurationsMutation, UpdateConfigurationsMutationVariables>({
      query: (variables) => ({ document: UpdateConfigurationsDocument, variables })
    }),
    addRegola: build.mutation<AddRegolaMutation, AddRegolaMutationVariables>({
      query: (variables) => ({ document: AddRegolaDocument, variables })
    }),
    deleteRegola: build.mutation<DeleteRegolaMutation, DeleteRegolaMutationVariables>({
      query: (variables) => ({ document: DeleteRegolaDocument, variables })
    }),
    exportListaProtocolli: build.mutation<ExportListaProtocolliMutation, ExportListaProtocolliMutationVariables>({
      query: (variables) => ({ document: ExportListaProtocolliDocument, variables })
    }),
    ImportProtocolliEmergenza: build.mutation<ImportProtocolliEmergenzaMutation, ImportProtocolliEmergenzaMutationVariables>({
      query: (variables) => ({ document: ImportProtocolliEmergenzaDocument, variables })
    }),
    annullaProtocollo: build.mutation<AnnullaProtocolloMutation, AnnullaProtocolloMutationVariables>({
      query: (variables) => ({ document: AnnullaProtocolloDocument, variables })
    }),
    richiestaAnnullamentoProtocollo: build.mutation<RichiestaAnnullamentoProtocolloMutation, RichiestaAnnullamentoProtocolloMutationVariables>({
      query: (variables) => ({ document: RichiestaAnnullamentoProtocolloDocument, variables })
    }),
    gestioneAnnullamento: build.mutation<GestioneAnnullamentoMutation, GestioneAnnullamentoMutationVariables>({
      query: (variables) => ({ document: GestioneAnnullamentoDocument, variables })
    }),
    assegnaProtocollo: build.mutation<AssegnaProtocolloMutation, AssegnaProtocolloMutationVariables>({
      query: (variables) => ({ document: AssegnaProtocolloDocument, variables })
    }),
    assegnazioneProtocolloMassiva: build.mutation<AssegnazioneProtocolloMassivaMutation, AssegnazioneProtocolloMassivaMutationVariables>({
      query: (variables) => ({ document: AssegnazioneProtocolloMassivaDocument, variables })
    }),
    FascicolaProtocollo: build.mutation<FascicolaProtocolloMutation, FascicolaProtocolloMutationVariables>({
      query: (variables) => ({ document: FascicolaProtocolloDocument, variables })
    }),
    FascicolaProtocolloMassivo: build.mutation<FascicolaProtocolloMassivoMutation, FascicolaProtocolloMassivoMutationVariables>({
      query: (variables) => ({ document: FascicolaProtocolloMassivoDocument, variables })
    }),
    saveProtocollo: build.mutation<SaveProtocolloMutation, SaveProtocolloMutationVariables>({
      query: (variables) => ({ document: SaveProtocolloDocument, variables })
    }),
    saveProtocolloByEmail: build.mutation<SaveProtocolloByEmailMutation, SaveProtocolloByEmailMutationVariables>({
      query: (variables) => ({ document: SaveProtocolloByEmailDocument, variables })
    }),
    insertRaccomandata: build.mutation<InsertRaccomandataMutation, InsertRaccomandataMutationVariables>({
      query: (variables) => ({ document: InsertRaccomandataDocument, variables })
    }),
    notificaProtocollo: build.mutation<NotificaProtocolloMutation, NotificaProtocolloMutationVariables>({
      query: (variables) => ({ document: NotificaProtocolloDocument, variables })
    }),
    updateNoteProtocollo: build.mutation<UpdateNoteProtocolloMutation, UpdateNoteProtocolloMutationVariables | void>({
      query: (variables) => ({ document: UpdateNoteProtocolloDocument, variables })
    }),
    RevocaAssegnazioneProtocollo: build.mutation<RevocaAssegnazioneProtocolloMutation, RevocaAssegnazioneProtocolloMutationVariables>({
      query: (variables) => ({ document: RevocaAssegnazioneProtocolloDocument, variables })
    }),
    richiestaAssegnazioneProtocollo: build.mutation<RichiestaAssegnazioneProtocolloMutation, RichiestaAssegnazioneProtocolloMutationVariables>({
      query: (variables) => ({ document: RichiestaAssegnazioneProtocolloDocument, variables })
    }),
    rifiutaProtocollo: build.mutation<RifiutaProtocolloMutation, RifiutaProtocolloMutationVariables | void>({
      query: (variables) => ({ document: RifiutaProtocolloDocument, variables })
    }),
    RifiutaProtocolloMassiva: build.mutation<RifiutaProtocolloMassivaMutation, RifiutaProtocolloMassivaMutationVariables>({
      query: (variables) => ({ document: RifiutaProtocolloMassivaDocument, variables })
    }),
    updateProtocollo: build.mutation<UpdateProtocolloMutation, UpdateProtocolloMutationVariables>({
      query: (variables) => ({ document: UpdateProtocolloDocument, variables })
    }),
    annullaRaccomandata: build.mutation<AnnullaRaccomandataMutation, AnnullaRaccomandataMutationVariables>({
      query: (variables) => ({ document: AnnullaRaccomandataDocument, variables })
    }),
    updateStatoRaccomandateForProtocollo: build.mutation<UpdateStatoRaccomandateForProtocolloMutation, UpdateStatoRaccomandateForProtocolloMutationVariables>({
      query: (variables) => ({ document: UpdateStatoRaccomandateForProtocolloDocument, variables })
    }),
    updateStatoProtocollo: build.mutation<UpdateStatoProtocolloMutation, UpdateStatoProtocolloMutationVariables | void>({
      query: (variables) => ({ document: UpdateStatoProtocolloDocument, variables })
    }),
    presaInCaricoProtocolloMassiva: build.mutation<PresaInCaricoProtocolloMassivaMutation, PresaInCaricoProtocolloMassivaMutationVariables>({
      query: (variables) => ({ document: PresaInCaricoProtocolloMassivaDocument, variables })
    }),
    exportStorico: build.mutation<ExportStoricoMutation, ExportStoricoMutationVariables>({
      query: (variables) => ({ document: ExportStoricoDocument, variables })
    }),
    saveTag: build.mutation<SaveTagMutation, SaveTagMutationVariables>({
      query: (variables) => ({ document: SaveTagDocument, variables })
    }),
    updateTag: build.mutation<UpdateTagMutation, UpdateTagMutationVariables>({
      query: (variables) => ({ document: UpdateTagDocument, variables })
    }),
    deleteTag: build.mutation<DeleteTagMutation, DeleteTagMutationVariables>({
      query: (variables) => ({ document: DeleteTagDocument, variables })
    }),
    deleteTitolario: build.mutation<DeleteTitolarioMutation, DeleteTitolarioMutationVariables>({
      query: (variables) => ({ document: DeleteTitolarioDocument, variables })
    }),
    deleteVisibilitaTitolario: build.mutation<DeleteVisibilitaTitolarioMutation, DeleteVisibilitaTitolarioMutationVariables>({
      query: (variables) => ({ document: DeleteVisibilitaTitolarioDocument, variables })
    }),
    dropTitolario: build.mutation<DropTitolarioMutation, DropTitolarioMutationVariables>({
      query: (variables) => ({ document: DropTitolarioDocument, variables })
    }),
    insertVisibilitaTitolario: build.mutation<InsertVisibilitaTitolarioMutation, InsertVisibilitaTitolarioMutationVariables>({
      query: (variables) => ({ document: InsertVisibilitaTitolarioDocument, variables })
    }),
    insertTitolario: build.mutation<InsertTitolarioMutation, InsertTitolarioMutationVariables>({
      query: (variables) => ({ document: InsertTitolarioDocument, variables })
    }),
    setMaxLivelloFascicolazioneForTitolario: build.mutation<SetMaxLivelloFascicolazioneForTitolarioMutation, SetMaxLivelloFascicolazioneForTitolarioMutationVariables>({
      query: (variables) => ({ document: SetMaxLivelloFascicolazioneForTitolarioDocument, variables })
    }),
    spostaProtocollo: build.mutation<SpostaProtocolloMutation, SpostaProtocolloMutationVariables>({
      query: (variables) => ({ document: SpostaProtocolloDocument, variables })
    }),
    spostaFascicolo: build.mutation<SpostaFascicoloMutation, SpostaFascicoloMutationVariables>({
      query: (variables) => ({ document: SpostaFascicoloDocument, variables })
    }),
    spostaAllegatiFascicolo: build.mutation<SpostaAllegatiFascicoloMutation, SpostaAllegatiFascicoloMutationVariables>({
      query: (variables) => ({ document: SpostaAllegatiFascicoloDocument, variables })
    }),
    updateTitolario: build.mutation<UpdateTitolarioMutation, UpdateTitolarioMutationVariables>({
      query: (variables) => ({ document: UpdateTitolarioDocument, variables })
    }),
    getAllExtensions: build.query<GetAllExtensionsQuery, GetAllExtensionsQueryVariables | void>({
      query: (variables) => ({ document: GetAllExtensionsDocument, variables })
    }),
    GetAllegati: build.query<GetAllegatiQuery, GetAllegatiQueryVariables>({
      query: (variables) => ({ document: GetAllegatiDocument, variables })
    }),
    GetAllegatiDiscarded: build.query<GetAllegatiDiscardedQuery, GetAllegatiDiscardedQueryVariables>({
      query: (variables) => ({ document: GetAllegatiDiscardedDocument, variables })
    }),
    getAllAnagrafica: build.query<GetAllAnagraficaQuery, GetAllAnagraficaQueryVariables | void>({
      query: (variables) => ({ document: GetAllAnagraficaDocument, variables })
    }),
    GetContattoInad: build.query<GetContattoInadQuery, GetContattoInadQueryVariables>({
      query: (variables) => ({ document: GetContattoInadDocument, variables })
    }),
    getDettaglioAnagrafica: build.query<GetDettaglioAnagraficaQuery, GetDettaglioAnagraficaQueryVariables | void>({
      query: (variables) => ({ document: GetDettaglioAnagraficaDocument, variables })
    }),
    getPecPeoByTipologiaPosta: build.query<GetPecPeoByTipologiaPostaQuery, GetPecPeoByTipologiaPostaQueryVariables>({
      query: (variables) => ({ document: GetPecPeoByTipologiaPostaDocument, variables })
    }),
    getPecPeoByUtenteAndCdr: build.query<GetPecPeoByUtenteAndCdrQuery, GetPecPeoByUtenteAndCdrQueryVariables>({
      query: (variables) => ({ document: GetPecPeoByUtenteAndCdrDocument, variables })
    }),
    findAllPecPeoIdByEmail: build.query<FindAllPecPeoIdByEmailQuery, FindAllPecPeoIdByEmailQueryVariables>({
      query: (variables) => ({ document: FindAllPecPeoIdByEmailDocument, variables })
    }),
    getPecPeoConfigurations: build.query<GetPecPeoConfigurationsQuery, GetPecPeoConfigurationsQueryVariables | void>({
      query: (variables) => ({ document: GetPecPeoConfigurationsDocument, variables })
    }),
    getConfiguredUsers: build.query<GetConfiguredUsersQuery, GetConfiguredUsersQueryVariables | void>({
      query: (variables) => ({ document: GetConfiguredUsersDocument, variables })
    }),
    getLoginRaccomandata: build.query<GetLoginRaccomandataQuery, GetLoginRaccomandataQueryVariables | void>({
      query: (variables) => ({ document: GetLoginRaccomandataDocument, variables })
    }),
    getLoginConservazione: build.query<GetLoginConservazioneQuery, GetLoginConservazioneQueryVariables | void>({
      query: (variables) => ({ document: GetLoginConservazioneDocument, variables })
    }),
    getEmails: build.query<GetEmailsQuery, GetEmailsQueryVariables | void>({
      query: (variables) => ({ document: GetEmailsDocument, variables })
    }),
    getAllGruppi: build.query<GetAllGruppiQuery, GetAllGruppiQueryVariables | void>({
      query: (variables) => ({ document: GetAllGruppiDocument, variables })
    }),
    DettaglioGruppo: build.query<DettaglioGruppoQuery, DettaglioGruppoQueryVariables>({
      query: (variables) => ({ document: DettaglioGruppoDocument, variables })
    }),
    getModelliAutomaticiByCdrCode: build.query<GetModelliAutomaticiByCdrCodeQuery, GetModelliAutomaticiByCdrCodeQueryVariables>({
      query: (variables) => ({ document: GetModelliAutomaticiByCdrCodeDocument, variables })
    }),
    searchModelliAutomatici: build.query<SearchModelliAutomaticiQuery, SearchModelliAutomaticiQueryVariables | void>({
      query: (variables) => ({ document: SearchModelliAutomaticiDocument, variables })
    }),
    getAllPecEscluse: build.query<GetAllPecEscluseQuery, GetAllPecEscluseQueryVariables | void>({
      query: (variables) => ({ document: GetAllPecEscluseDocument, variables })
    }),
    getPecEscluseList: build.query<GetPecEscluseListQuery, GetPecEscluseListQueryVariables | void>({
      query: (variables) => ({ document: GetPecEscluseListDocument, variables })
    }),
    getPecRegole: build.query<GetPecRegoleQuery, GetPecRegoleQueryVariables>({
      query: (variables) => ({ document: GetPecRegoleDocument, variables })
    }),
    GetProtocolli: build.query<GetProtocolliQuery, GetProtocolliQueryVariables | void>({
      query: (variables) => ({ document: GetProtocolliDocument, variables })
    }),
    getProtocolloByNumero: build.query<GetProtocolloByNumeroQuery, GetProtocolloByNumeroQueryVariables | void>({
      query: (variables) => ({ document: GetProtocolloByNumeroDocument, variables })
    }),
    getProtocolloById: build.query<GetProtocolloByIdQuery, GetProtocolloByIdQueryVariables>({
      query: (variables) => ({ document: GetProtocolloByIdDocument, variables })
    }),
    generateBarcode: build.query<GenerateBarcodeQuery, GenerateBarcodeQueryVariables | void>({
      query: (variables) => ({ document: GenerateBarcodeDocument, variables })
    }),
    generateRicevuta: build.query<GenerateRicevutaQuery, GenerateRicevutaQueryVariables | void>({
      query: (variables) => ({ document: GenerateRicevutaDocument, variables })
    }),
    getAllegatoPrincipale: build.query<GetAllegatoPrincipaleQuery, GetAllegatoPrincipaleQueryVariables | void>({
      query: (variables) => ({ document: GetAllegatoPrincipaleDocument, variables })
    }),
    dettaglioProtocollo: build.query<DettaglioProtocolloQuery, DettaglioProtocolloQueryVariables | void>({
      query: (variables) => ({ document: DettaglioProtocolloDocument, variables })
    }),
    cercaRaccomandate: build.query<CercaRaccomandateQuery, CercaRaccomandateQueryVariables>({
      query: (variables) => ({ document: CercaRaccomandateDocument, variables })
    }),
    getAssegnatariTooltipForProtocollo: build.query<GetAssegnatariTooltipForProtocolloQuery, GetAssegnatariTooltipForProtocolloQueryVariables | void>({
      query: (variables) => ({ document: GetAssegnatariTooltipForProtocolloDocument, variables })
    }),
    getMittenteFileds: build.query<GetMittenteFiledsQuery, GetMittenteFiledsQueryVariables | void>({
      query: (variables) => ({ document: GetMittenteFiledsDocument, variables })
    }),
    findReferenti: build.query<FindReferentiQuery, FindReferentiQueryVariables | void>({
      query: (variables) => ({ document: FindReferentiDocument, variables })
    }),
    getReferentiProtocollo: build.query<GetReferentiProtocolloQuery, GetReferentiProtocolloQueryVariables | void>({
      query: (variables) => ({ document: GetReferentiProtocolloDocument, variables })
    }),
    GetRegistroGiornaliero: build.query<GetRegistroGiornalieroQuery, GetRegistroGiornalieroQueryVariables>({
      query: (variables) => ({ document: GetRegistroGiornalieroDocument, variables })
    }),
    getStoricoProtocollo: build.query<GetStoricoProtocolloQuery, GetStoricoProtocolloQueryVariables | void>({
      query: (variables) => ({ document: GetStoricoProtocolloDocument, variables })
    }),
    getStoricoTitolario: build.query<GetStoricoTitolarioQuery, GetStoricoTitolarioQueryVariables | void>({
      query: (variables) => ({ document: GetStoricoTitolarioDocument, variables })
    }),
    getStoricoRegistroGiornaliero: build.query<GetStoricoRegistroGiornalieroQuery, GetStoricoRegistroGiornalieroQueryVariables | void>({
      query: (variables) => ({ document: GetStoricoRegistroGiornalieroDocument, variables })
    }),
    ListaCap: build.query<ListaCapQuery, ListaCapQueryVariables>({
      query: (variables) => ({ document: ListaCapDocument, variables })
    }),
    CittaDaCap: build.query<CittaDaCapQuery, CittaDaCapQueryVariables>({
      query: (variables) => ({ document: CittaDaCapDocument, variables })
    }),
    VieDaCap: build.query<VieDaCapQuery, VieDaCapQueryVariables>({
      query: (variables) => ({ document: VieDaCapDocument, variables })
    }),
    VieDaCitta: build.query<VieDaCittaQuery, VieDaCittaQueryVariables>({
      query: (variables) => ({ document: VieDaCittaDocument, variables })
    }),
    ListaCapEsteso: build.query<ListaCapEstesoQuery, ListaCapEstesoQueryVariables>({
      query: (variables) => ({ document: ListaCapEstesoDocument, variables })
    }),
    getAllTag: build.query<GetAllTagQuery, GetAllTagQueryVariables | void>({
      query: (variables) => ({ document: GetAllTagDocument, variables })
    }),
    GetTagList: build.query<GetTagListQuery, GetTagListQueryVariables | void>({
      query: (variables) => ({ document: GetTagListDocument, variables })
    }),
    GetTitolario: build.query<GetTitolarioQuery, GetTitolarioQueryVariables | void>({
      query: (variables) => ({ document: GetTitolarioDocument, variables })
    }),
    GetPathForTitolario: build.query<GetPathForTitolarioQuery, GetPathForTitolarioQueryVariables>({
      query: (variables) => ({ document: GetPathForTitolarioDocument, variables })
    }),
    getAllProtocolliByFascicolo: build.query<GetAllProtocolliByFascicoloQuery, GetAllProtocolliByFascicoloQueryVariables>({
      query: (variables) => ({ document: GetAllProtocolliByFascicoloDocument, variables })
    }),
    getProtocolliByFascicolo: build.query<GetProtocolliByFascicoloQuery, GetProtocolliByFascicoloQueryVariables | void>({
      query: (variables) => ({ document: GetProtocolliByFascicoloDocument, variables })
    }),
    getTitolarioById: build.query<GetTitolarioByIdQuery, GetTitolarioByIdQueryVariables>({
      query: (variables) => ({ document: GetTitolarioByIdDocument, variables })
    }),
    dettaglioTitolario: build.query<DettaglioTitolarioQuery, DettaglioTitolarioQueryVariables>({
      query: (variables) => ({ document: DettaglioTitolarioDocument, variables })
    }),
    GetPermessiVisibilita: build.query<GetPermessiVisibilitaQuery, GetPermessiVisibilitaQueryVariables>({
      query: (variables) => ({ document: GetPermessiVisibilitaDocument, variables })
    }),
    getClassificazioneStringByIdProtocollo: build.query<GetClassificazioneStringByIdProtocolloQuery, GetClassificazioneStringByIdProtocolloQueryVariables | void>({
      query: (variables) => ({ document: GetClassificazioneStringByIdProtocolloDocument, variables })
    }),
    getMaxLivelloFascicolazioneForTitolario: build.query<GetMaxLivelloFascicolazioneForTitolarioQuery, GetMaxLivelloFascicolazioneForTitolarioQueryVariables | void>({
      query: (variables) => ({ document: GetMaxLivelloFascicolazioneForTitolarioDocument, variables })
    }),
    getAllOffices: build.query<GetAllOfficesQuery, GetAllOfficesQueryVariables | void>({
      query: (variables) => ({ document: GetAllOfficesDocument, variables })
    }),
    getAllUsers: build.query<GetAllUsersQuery, GetAllUsersQueryVariables | void>({
      query: (variables) => ({ document: GetAllUsersDocument, variables })
    }),
    GetAllUsersWithRoleAndCdr: build.query<GetAllUsersWithRoleAndCdrQuery, GetAllUsersWithRoleAndCdrQueryVariables>({
      query: (variables) => ({ document: GetAllUsersWithRoleAndCdrDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useDiscardAllegatoMutation, useResumeAllegatoMutation, useDeleteContattoMutation, useImportAnagraficaMutation, useSaveContattoMutation, useUpdateContattoMutation, useSaveLoginRaccomandataMutation, useSaveLoginConservazioneMutation, useUpdateLoginRaccomandataMutation, useUpdateLoginConservazioneMutation, useInoltraRispondiEmailMutation, useDeleteGruppoMutation, useRemoveContactFromGroupMutation, useSaveGruppoMutation, useAddContactsToGroupMutation, useUpdateGruppoMutation, useDeleteModelloAutomaticoMutation, useCreateModelloAutomaticoMutation, useUpdateModelloAutomaticoMutation, useSavePecEsclusaMutation, useUpdatePecEsclusaMutation, useDeletePecEsclusaMutation, useDeletePecPeoConfigurationMutation, useSavePecPeoConfigurationMutation, useUpdateConfigurationsMutation, useAddRegolaMutation, useDeleteRegolaMutation, useExportListaProtocolliMutation, useImportProtocolliEmergenzaMutation, useAnnullaProtocolloMutation, useRichiestaAnnullamentoProtocolloMutation, useGestioneAnnullamentoMutation, useAssegnaProtocolloMutation, useAssegnazioneProtocolloMassivaMutation, useFascicolaProtocolloMutation, useFascicolaProtocolloMassivoMutation, useSaveProtocolloMutation, useSaveProtocolloByEmailMutation, useInsertRaccomandataMutation, useNotificaProtocolloMutation, useUpdateNoteProtocolloMutation, useRevocaAssegnazioneProtocolloMutation, useRichiestaAssegnazioneProtocolloMutation, useRifiutaProtocolloMutation, useRifiutaProtocolloMassivaMutation, useUpdateProtocolloMutation, useAnnullaRaccomandataMutation, useUpdateStatoRaccomandateForProtocolloMutation, useUpdateStatoProtocolloMutation, usePresaInCaricoProtocolloMassivaMutation, useExportStoricoMutation, useSaveTagMutation, useUpdateTagMutation, useDeleteTagMutation, useDeleteTitolarioMutation, useDeleteVisibilitaTitolarioMutation, useDropTitolarioMutation, useInsertVisibilitaTitolarioMutation, useInsertTitolarioMutation, useSetMaxLivelloFascicolazioneForTitolarioMutation, useSpostaProtocolloMutation, useSpostaFascicoloMutation, useSpostaAllegatiFascicoloMutation, useUpdateTitolarioMutation, useGetAllExtensionsQuery, useLazyGetAllExtensionsQuery, useGetAllegatiQuery, useLazyGetAllegatiQuery, useGetAllegatiDiscardedQuery, useLazyGetAllegatiDiscardedQuery, useGetAllAnagraficaQuery, useLazyGetAllAnagraficaQuery, useGetContattoInadQuery, useLazyGetContattoInadQuery, useGetDettaglioAnagraficaQuery, useLazyGetDettaglioAnagraficaQuery, useGetPecPeoByTipologiaPostaQuery, useLazyGetPecPeoByTipologiaPostaQuery, useGetPecPeoByUtenteAndCdrQuery, useLazyGetPecPeoByUtenteAndCdrQuery, useFindAllPecPeoIdByEmailQuery, useLazyFindAllPecPeoIdByEmailQuery, useGetPecPeoConfigurationsQuery, useLazyGetPecPeoConfigurationsQuery, useGetConfiguredUsersQuery, useLazyGetConfiguredUsersQuery, useGetLoginRaccomandataQuery, useLazyGetLoginRaccomandataQuery, useGetLoginConservazioneQuery, useLazyGetLoginConservazioneQuery, useGetEmailsQuery, useLazyGetEmailsQuery, useGetAllGruppiQuery, useLazyGetAllGruppiQuery, useDettaglioGruppoQuery, useLazyDettaglioGruppoQuery, useGetModelliAutomaticiByCdrCodeQuery, useLazyGetModelliAutomaticiByCdrCodeQuery, useSearchModelliAutomaticiQuery, useLazySearchModelliAutomaticiQuery, useGetAllPecEscluseQuery, useLazyGetAllPecEscluseQuery, useGetPecEscluseListQuery, useLazyGetPecEscluseListQuery, useGetPecRegoleQuery, useLazyGetPecRegoleQuery, useGetProtocolliQuery, useLazyGetProtocolliQuery, useGetProtocolloByNumeroQuery, useLazyGetProtocolloByNumeroQuery, useGetProtocolloByIdQuery, useLazyGetProtocolloByIdQuery, useGenerateBarcodeQuery, useLazyGenerateBarcodeQuery, useGenerateRicevutaQuery, useLazyGenerateRicevutaQuery, useGetAllegatoPrincipaleQuery, useLazyGetAllegatoPrincipaleQuery, useDettaglioProtocolloQuery, useLazyDettaglioProtocolloQuery, useCercaRaccomandateQuery, useLazyCercaRaccomandateQuery, useGetAssegnatariTooltipForProtocolloQuery, useLazyGetAssegnatariTooltipForProtocolloQuery, useGetMittenteFiledsQuery, useLazyGetMittenteFiledsQuery, useFindReferentiQuery, useLazyFindReferentiQuery, useGetReferentiProtocolloQuery, useLazyGetReferentiProtocolloQuery, useGetRegistroGiornalieroQuery, useLazyGetRegistroGiornalieroQuery, useGetStoricoProtocolloQuery, useLazyGetStoricoProtocolloQuery, useGetStoricoTitolarioQuery, useLazyGetStoricoTitolarioQuery, useGetStoricoRegistroGiornalieroQuery, useLazyGetStoricoRegistroGiornalieroQuery, useListaCapQuery, useLazyListaCapQuery, useCittaDaCapQuery, useLazyCittaDaCapQuery, useVieDaCapQuery, useLazyVieDaCapQuery, useVieDaCittaQuery, useLazyVieDaCittaQuery, useListaCapEstesoQuery, useLazyListaCapEstesoQuery, useGetAllTagQuery, useLazyGetAllTagQuery, useGetTagListQuery, useLazyGetTagListQuery, useGetTitolarioQuery, useLazyGetTitolarioQuery, useGetPathForTitolarioQuery, useLazyGetPathForTitolarioQuery, useGetAllProtocolliByFascicoloQuery, useLazyGetAllProtocolliByFascicoloQuery, useGetProtocolliByFascicoloQuery, useLazyGetProtocolliByFascicoloQuery, useGetTitolarioByIdQuery, useLazyGetTitolarioByIdQuery, useDettaglioTitolarioQuery, useLazyDettaglioTitolarioQuery, useGetPermessiVisibilitaQuery, useLazyGetPermessiVisibilitaQuery, useGetClassificazioneStringByIdProtocolloQuery, useLazyGetClassificazioneStringByIdProtocolloQuery, useGetMaxLivelloFascicolazioneForTitolarioQuery, useLazyGetMaxLivelloFascicolazioneForTitolarioQuery, useGetAllOfficesQuery, useLazyGetAllOfficesQuery, useGetAllUsersQuery, useLazyGetAllUsersQuery, useGetAllUsersWithRoleAndCdrQuery, useLazyGetAllUsersWithRoleAndCdrQuery } = injectedRtkApi;

