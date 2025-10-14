import {
  parseISO,
  startOfDay,
  endOfDay,
  startOfHour,
  endOfHour,
  startOfMinute,
  endOfMinute,
  compareAsc,
  compareDesc,
  isEqual,
  format
} from 'date-fns';

const getParsedDate = (date: string | Date) =>
  typeof date === 'string' ? parseISO(date) : date;

export const getStartOfDay = (date: string | Date) =>
  date ? startOfDay(getParsedDate(date)) : date;

export const geEndOfDay = (date: string | Date) =>
  date ? endOfDay(getParsedDate(date)) : date;

export const getStartOfHour = (date: string | Date) =>
  date ? startOfHour(getParsedDate(date)) : date;

export const getEndOfHour = (date: string | Date) =>
  date ? endOfHour(getParsedDate(date)) : date;

export const getStartOfMinute = (date: string | Date) =>
  date ? startOfMinute(getParsedDate(date)) : date;

export const getEndOfMinute = (date: string | Date) =>
  date ? endOfMinute(getParsedDate(date)) : date;

export const isDateGreaterThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) =>
  compareAsc(
    startOfDay(getParsedDate(date)),
    startOfDay(getParsedDate(dateToCompare))
  ) === 1;

export const isDateGreaterOrEqualThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) =>
  compareAsc(
    startOfDay(getParsedDate(date)),
    startOfDay(getParsedDate(dateToCompare))
  ) === 1 ||
  isEqual(
    startOfDay(getParsedDate(date)),
    startOfDay(getParsedDate(dateToCompare))
  );

export const isDateLowerThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) =>
  compareDesc(
    startOfDay(getParsedDate(date)),
    startOfDay(getParsedDate(dateToCompare))
  ) === 1;

export const isDateLowerOrEqualThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) =>
  compareDesc(
    startOfDay(getParsedDate(date)),
    startOfDay(getParsedDate(dateToCompare))
  ) === 1 ||
  isEqual(
    startOfDay(getParsedDate(date)),
    startOfDay(getParsedDate(dateToCompare))
  );

export const isDateEqualTo = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) =>
  isEqual(
    startOfDay(getParsedDate(date)),
    startOfDay(getParsedDate(dateToCompare))
  );

export const isDateTimeGreaterThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) => compareAsc(getParsedDate(date), getParsedDate(dateToCompare)) === 1;

export const isDateTimeGreaterOrEqualThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) =>
  compareAsc(getParsedDate(date), getParsedDate(dateToCompare)) === 1 ||
  isEqual(getParsedDate(date), getParsedDate(dateToCompare));

export const isDateTimeLowerThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) => compareDesc(getParsedDate(date), getParsedDate(dateToCompare)) === 1;

export const isDateTimeLowerOrEqualThan = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) =>
  compareDesc(getParsedDate(date), getParsedDate(dateToCompare)) === 1 ||
  isEqual(getParsedDate(date), getParsedDate(dateToCompare));

export const isDateTimeEqualTo = ({
  date,
  dateToCompare
}: {
  date: string | Date;
  dateToCompare: string | Date;
}) => isEqual(getParsedDate(date), getParsedDate(dateToCompare));

export const formatQueryDateTime = (
  date?: string | Date,
  formatString: string = "yyyy-MM-dd'T'HH:mm"
) => (date ? format(getParsedDate(date), formatString) : undefined);
