import { EmailBaseFragment } from "@cmrc/services/src/app/piapi/generated";

/*
  Costruisce il body di una mail di risposta/inoltro lasciando un po di spazio sopra,
  di seguito mette i dati che di solito si trovano nel corpo
*/
export const buildBody = (emailData:EmailBaseFragment) => 
`

------------------------------
Da:<${emailData?.from}>
Inviato: ${emailData?.tsInvio}
A: ${emailData.to}
Oggetto: ${emailData?.oggetto}`

export const extractValuesFromArray = (array) => Array.isArray(array) ? array.map(item => item.value) : [];

export const transformEmailString = (str) => str.split(',').map(email => ({
  label: email.trim(),
  value: email.trim()
}))


export const tipoToExclude = ['PEO']
export const statoInvioToExclude = ['SALVARE_IN_INBOX', 'SALVARE_COME_ALLEGATO',]

