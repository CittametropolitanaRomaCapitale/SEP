import { FCC } from '@cmrc/types/FCC';
import Stack from '@mui/material/Stack';
import HLabelItem from '@cmrc/ui/components/HLabelItem';

export interface NumberYearCellProps {
  number?: string | number;
  year?: string | number;
  numberString?: string;
  yearString?: string;
}

const NumberYearCell: FCC<NumberYearCellProps> = ({
  number,
  year,
  numberString,
  yearString
}) => (
  <Stack>
    <HLabelItem
      label={numberString}
      value={String(number || '-')}
      labelIsUppercase
    />
    <HLabelItem
      label={yearString}
      value={String(year || '-')}
      labelIsUppercase
    />
  </Stack>
);
export default NumberYearCell;
