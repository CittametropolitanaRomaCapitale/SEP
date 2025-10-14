import { Office } from "@cmrc/services/sso";

export const formatOfficeLabel = (office: Office): string => {
  const description = office?.description || '';
  const shortDescription = description.length > 32 ? `${description.substring(0, 32)}...` : description;
  return `${office?.name} - ${shortDescription}`;
};