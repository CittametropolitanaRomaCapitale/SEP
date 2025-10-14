import { FCC } from '@cmrc/types/FCC';

export const ValueOrDefault: FCC<{ value: string }> = ({ value }) =>
  value ? <>{value}</> : <>-</>;
