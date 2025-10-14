import {
  MittenteProtocolloInputInput,
  ReferenteProtocolloInputInput
} from '@cmrc/services/src/app/piapi/generated';

export type MittenteDestinatarioForm = MittenteProtocolloInputInput &
  ReferenteProtocolloInputInput;

/**
 * Costruzione del mittente o destinatario del protocollo a partire dai dati del form
 * Si effettuano i check per determinare il tipo di mittente/destinatario e si costruisce l'oggetto da inviare al backend
 * nel caso del mittente si passa anche il parametro newUser
 * Nel caso dei destinatari newUser non è necessario perchè si sta ciclando sui destinatari,
 * quindi si partirà dai dati dello stesso
 */
export const build = (
  field,
  formValues: any,
  newUser?: MittenteDestinatarioForm
) => {
  const output = !newUser ? { ...formValues } : { ...newUser };

  if (field === 'mittente') {
    if (formValues?.tipo === 'ufficio') {
      output.idMittente = formValues?.idMittente;
      output.tipoMittente = formValues?.tipo;
      output.descMittente = formValues?.label;
    } else if (formValues?.tipo === 'anagrafica_interna') {
      output.idMittente = formValues?.idDestinatario;
      output.tipoMittente = formValues?.tipo;
      output.descMittente = formValues?.label;
    } else if (formValues?.tipo === 'ipa_ente') {
      output.tipologiaIpa = 'ENTE';
      output.codAmm = formValues?.ipaResponseDTO?.codAmm;
      output.codAoo = null;
      output.codUniOu = null;
      output.isIpa = true;
      output.descMittente = formValues?.label;
    } else if (formValues?.tipo === 'ipa_aoo') {
      output.tipologiaIpa = 'AOO';
      output.codAmm = formValues?.ipaResponseDTO?.codAmm;
      output.codAoo = formValues?.ipaResponseDTO?.codAOO;
      output.codUniOu = null;
      output.isIpa = true;
      output.descMittente = formValues?.label;
    } else if (formValues?.tipo === 'ipa_uo') {
      output.tipologiaIpa = 'UO';
      output.codAmm = formValues?.ipaResponseDTO?.codAmm;
      output.codAoo = null;
      output.codUniOu = formValues?.ipaResponseDTO?.codUniOU;
      output.isIpa = true;
      output.descMittente = formValues?.label;
    }
  } else if (field === 'destinatario') {
    if (formValues?.tipoDestinatario === 'ipa_ente') {
      output.tipologiaIpa = 'ENTE';
      output.codAmm = formValues?.codAmm;
      output.codAoo = null;
      output.codUniOu = null;
      output.isIpa = true;
    } else if (formValues?.tipoDestinatario === 'ipa_aoo') {
      output.tipologiaIpa = 'AOO';
      output.codAmm = formValues?.codAmm;
      output.codAoo = formValues?.codAOO;
      output.codUniOu = null;
      output.isIpa = true;
    } else if (formValues?.tipoDestinatario === 'ipa_uo') {
      output.tipologiaIpa = 'UO';
      output.codAmm = formValues?.codAmm;
      output.codAoo = null;
      output.codUniOu = formValues?.codUniOU;
      output.isIpa = true;
    }
  }
  return output;
};

/**
 * Mappatura dei dati per il mittente necessari a garantire il salvataggio in anagrafica dei contatti ipa
 */
export const buildMittenteProtocollo = (mittenteForm: any) => {
  const newMittente: MittenteProtocolloInputInput = {
    idMittente: null,
    descMittente: null,
    tipologiaIpa: null,
    tipoMittente: null,
    codAmm: null,
    codAoo: null,
    codUniOu: null,
    isIpa: null
  };

  return build('mittente', mittenteForm, newMittente);
};

/**
 * Mappatura dei dati per i referenti(Competenza e conoscenza)
 */
export const buildReferentiProtocollo = (
  destinatario: any,
  attribuzione: string
) => {
  const referente: ReferenteProtocolloInputInput = {
    idAssegnatario: destinatario.idDestinatario,
    nomeAssegnatario: destinatario.label,
    attribuzione,
    isAssegnato: true,
    tipoDestinatario: destinatario.tipo,
    codAmm: destinatario?.ipaResponseDTO?.codAmm,
    codAoo: destinatario?.ipaResponseDTO?.codAOO,
    codUniOu: destinatario?.ipaResponseDTO?.codUniOU,
    isIpa: destinatario?.isIpa,
    cdrAssegnatario: destinatario?.cdrAssegnatario,
    usePeoForSendEmail: destinatario?.usePeoForSendEmail
  };
  return build('destinatario', referente);
};

export const excludeParamSave = [
  'titolario',
  'destinatari',
  'mittenteCustom',
  'titolarioCustom',
  'canUpdateProtocollo',
  'formTagList',
  'flagTag',
  'dataProtocolloEmergenza',
  'nProtocolloEmergenza'
];

export const excludedParamUpdate = [
  'cdr',
  'canUpdateProtocollo',
  'corpoPecPeo',
  'dataProtocolloMittente',
  'destinatari',
  'destinatariCompetenza',
  'destinatariConoscenza',
  'indirizzoPecPeo',
  'invioEmailMultiplo',
  'metodoSpedizione',
  'mittente',
  'mittenteCustom',
  //'nProtocolloCircolare',
  //'note',
  'oggetto',
  'protocolloMittente',
  'tipoRegistrazione',
  'titolario',
  'titolarioCustom',
  'formTagList',
  'flagTag',
  'dataProtocolloEmergenza',
  'nProtocolloEmergenza'
];
