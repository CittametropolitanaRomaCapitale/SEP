import { format, parseISO } from 'date-fns';

export const formatDate = ({
  date,
  dateOnly,
  formatString
}: {
  date: string | Date;
  dateOnly?: boolean;
  formatString?: string;
}) => {
  const defaultFormatter = dateOnly ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm';
  const formatter = formatString ? formatString : defaultFormatter;

  if (typeof date === 'string') {
    return date ? format(parseISO(date), formatter) : null;
  }

  if (date instanceof Date) return date ? format(date, formatter) : null;
};
