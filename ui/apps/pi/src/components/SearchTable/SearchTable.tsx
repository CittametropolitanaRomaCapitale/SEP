import { FCC } from '@cmrc/types/FCC';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@cmrc/ui/components/Table';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import Pagination from '../Pagination';
import { useTable } from '../../store/table/useTable';

export interface SearchTableProps {
  table_id?: string;
  structure: BaseInputProps<any>[];
  columns: any[];
  data?: any[];
  pages?: number;
  isLoading?: boolean;
  searchString?: string;
  cancelString?: string;
  resultsString?: string;
  emptyString?: string;
  defaultFormData?: any;
  onSearch?: (args?: any) => void;
  onCancel?: (args?: any) => void;
}

export type SearchTableType = Omit<SearchTableProps, 'structure' | 'columns'>;

const SearchTable: FCC<SearchTableProps> = ({
  table_id,
  structure,
  columns,
  data,
  pages,
  isLoading,
  searchString,
  cancelString,
  resultsString,
  emptyString,
  defaultFormData,
  onSearch,
  onCancel
}) => {
  const { tableData } = useTable({ table_id });

  const methods = useForm({
    defaultValues: { ...defaultFormData },
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const onSelectPage = (page: number) => {
    onSearch({ page, ...methods.getValues() });
  };

  return (
    <Grid container direction="row" rowSpacing={2}>
      <Grid xs={11} item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid xs={1} item container justifyContent="flex-end" alignItems="center">
        <LoadingButton
          size="small"
          variant="contained"
          loading={isLoading}
          onClick={methods.handleSubmit((values) =>
            onSearch({ ...tableData, ...values })
          )}
        >
          {searchString}
        </LoadingButton>
      </Grid>
      {data && (
        <Grid item sx={{ width: '100%' }}>
          {(resultsString || pages != null) && (
            <TableTopBar
              leftElement={
                <Typography sx={{ textTransform: 'uppercase' }}>
                  {resultsString}
                </Typography>
              }
              rightElement={
                <Pagination
                  table_id={table_id}
                  count={pages}
                  onSelectPage={onSelectPage}
                />
              }
            />
          )}
          <Table columns={columns} data={data} emptyTableText={emptyString} />
        </Grid>
      )}
      <Grid item container mt={3} justifyContent="flex-end">
        <Button
          onClick={onCancel}
          size="small"
          variant="outlined"
          sx={{ height: '30px' }}
        >
          {cancelString}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchTable;
