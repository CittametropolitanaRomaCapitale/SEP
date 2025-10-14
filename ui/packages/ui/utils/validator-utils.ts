export const isStringStartWithNumber = (value?: string) => /^\d/.test(value);

export const isTaxCodeValid = (value?: string) =>
  RegExp(
    /^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
  ).test(value);

export const isVatNumberValid = (value?: string) =>
  RegExp(/^(IT){0,1}[0-9]{11}$/).test(value);

export const isFileValid = ({
  file,
  allowedExtensions
}: {
  file: File;
  allowedExtensions?: string[];
}) => {
  let isValid = !(allowedExtensions?.length > 0);
  allowedExtensions?.forEach((extension) => {
    if (file?.name?.toLowerCase()?.endsWith(extension?.toLowerCase())) {
      isValid = true;
    }
  });
  return isValid;
};

export const isSizeValid = ({
  file,
  maxFileSize
}: {
  file: File;
  maxFileSize?: number;
}) =>
  maxFileSize !== undefined ? file?.size / 1024 / 1024 < maxFileSize : true;

export const checkEmailValidation = (value?: string) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);

export const isNumeric = (value?: string) => /^\d+$/.test(value);

export const isAlphaNumericDash = (value?: string) => /^[0-9a-zA-Z-]+$/.test(value);

export const isOverLength = (text, maxLength) => text.length > maxLength;

export const checkTelphoneNumber = (value?: string) =>
  /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}(\s?(ext|x|ext.)\s?\d{1,5})?$/.test(value);

export const isString = (value: string): boolean => /^[a-zA-Z]+$/.test(value);
