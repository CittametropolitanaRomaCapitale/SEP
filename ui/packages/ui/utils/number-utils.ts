export const round2Decimal = (value?: string | number) =>
  Number(value || 0).toFixed(2);

export const formatCurrencyNumber = ({
  value,
  currency = '€'
}: {
  value?: string | number;
  currency?: string;
}) =>
  `${round2Decimal(value)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ${currency}`;

export const getRangeArray = ({
  start,
  end,
  step
}: {
  start: number;
  end: number;
  step: number;
}) =>
  Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step);
