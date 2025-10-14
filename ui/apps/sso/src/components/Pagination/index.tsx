import { ChangeEvent } from 'react';
import { FCC } from '@cmrc/types/FCC';
import type { PaginationProps as MUIPaginationProps } from '@mui/material';
import MUIPagination from '@mui/material/Pagination';
import { useTable } from '../../store/table/useTable';

export type PaginationProps = {
  table_id: string;
  count?: number;
  loading?: boolean;
  onSelectPage?: any;
} & MUIPaginationProps;

const Pagination: FCC<PaginationProps> = ({
  table_id,
  count,
  defaultPage,
  loading,
  onSelectPage,
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
    />
  );
};

export default Pagination;
