import { FCC } from "@cmrc/types/FCC";
import Stack from "@mui/material/Stack";
import Input from "@cmrc/ui/form/FormComponents/Input";
import { useTable } from "../../../store/table/useTable";

export interface FiltriRegistroGiornalieroProps {
  loading?: boolean;
}

export const FiltriRegistroGiornaliero: FCC<FiltriRegistroGiornalieroProps> = ({ loading }) => {

  const { tableData, setFilters } = useTable({
    table_id: 'registroGiornaliero'
  });

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Input
        disabled={loading}
        type="date"
        size="small"
        label='Da'
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        value={tableData?.filters?.dataRegistroFrom || ''}
        onChange={(event) => {
          setFilters({
            ...tableData?.filters,
            dataRegistroFrom: event.target.value
          });
        }}
      />
      <Input
        disabled={loading}
        type="date"
        size="small"
        label='A'
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        value={tableData?.filters?.dataRegistroTo || ''}
        onChange={(event) => {
          setFilters({
            ...tableData?.filters,
            dataRegistroTo: event.target.value
          });
        }}
      />
    </Stack>
  )
}