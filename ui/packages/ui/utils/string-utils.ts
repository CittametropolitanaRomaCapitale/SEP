import upperFirst from 'lodash/upperFirst';
import lowerCase from 'lodash/lowerCase';

export const getObfuscatedString = ({
  value,
  replaceWith = '*'
}: {
  value?: string;
  replaceWith?: string;
}) =>
  value?.replace(/(<s>)((.|\n)*?)(<\/s>)/gim, (m, o, s) =>
    s.replace(/[A-Zaz]?/gi, replaceWith)
  );

export const removeTagFromString = ({
  value,
  tag
}: {
  value?: string;
  tag?: string;
}) => value?.replace(new RegExp(`^<${tag}[^>]*>|</${tag}>$`, 'g'), '');

export const checkStringContainsTag = ({
  value,
  tag
}: {
  value?: string;
  tag?: string;
}) => value?.includes(`</${tag}>`);

export const isAlphanumeric = (value?: string) => /^[a-zA-Z0-9]*$/.test(value);

export const toSentence = (value?: string) => upperFirst(lowerCase(value));

/**
 * Permette di ridurre la lunghezza del fileName
 *
 * @param {string} fileName - il nome completo del file, inclusa l'estensione
 * @param {number} maxLength - la lunghezza massima del nome del file
 * @return {string} - il nome del file troncato con "..." se necessario, seguito dall'estensione
 */
export const shortenFilename = (fileName, maxLength) => {
  let shortFileName = fileName;
  if (fileName?.length > maxLength) {
      // Trova l'indice dell'ultimo punto nel nome del file
      const dotIndex = fileName.lastIndexOf('.');

      // Ricavo l'estensione del file
      const extension = (dotIndex > 0) ? fileName.substring(dotIndex) : '';

      const baseName = (dotIndex > 0) ? fileName.substring(0, dotIndex) : fileName;
      shortFileName = baseName.substring(0, maxLength) + '...' + extension;
  }

  return shortFileName;
}


