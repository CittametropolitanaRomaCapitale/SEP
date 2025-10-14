import { ChangeEvent } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { Tooltip, type PaginationProps as MUIPaginationProps, type SxProps } from '@mui/material';
import MUIPagination from '@mui/material/Pagination';
import MUIPaginationItem from '@mui/material/PaginationItem';
import { useTable } from '../../store/table/useTable';

export type PaginationProps = {
  table_id: string;
  count?: number;
  totalItems?: string;
  loading?: boolean;
  onSelectPage?: any;
  itemSx?: SxProps;
} & MUIPaginationProps;

const Pagination: FCC<PaginationProps> = ({
  table_id,
  count,
  totalItems,
  defaultPage,
  loading,
  onSelectPage,
  itemSx,
  ...props
}) => {
  const { setPage, tableData } = useTable({ table_id });

  const onChange = (event: ChangeEvent, page: number) => {
    setPage(page - 1);
    if (onSelectPage) onSelectPage(page - 1);
  };

  return (
    <MUIPagination
      {...props}
      disabled={loading}
      page={(tableData?.page || 0) + 1}
      count={count}
      onChange={onChange}
      renderItem={(item) => {
        if (totalItems !== undefined && totalItems !== null && totalItems !== '') {
          return (
            <Tooltip title={totalItems}>
              <MUIPaginationItem {...item} sx={{ ...itemSx }} />
            </Tooltip>
          );
        }
        return (
          <MUIPaginationItem {...item} sx={{ ...itemSx }} />
        );
      }}
    />
  );
};

export default Pagination;
