import Table from '@cmrc/ui/components/Table';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import SearchUtenti from './SearchUtenti';

export const UfficiTable = ({
  onSearch,
  emptyTableText,
  selectable,
  onSelectRow,
  searchItem,
  data,
  ...tableProps
}) => (
  <Grid sx={{ width: 1 }}>
    <TableTopBar
      leftElement={
        <Stack direction="row" spacing={2} alignItems="baseline">
          <SearchUtenti onSearch={onSearch} />
        </Stack>
      }
    />
    <Table
      emptyTableText={emptyTableText}
      selectable={selectable}
      onSelectRow={onSelectRow}
      data={data?.filter((item) => item.username.includes(searchItem))}
      {...tableProps}
    />
  </Grid>
);
