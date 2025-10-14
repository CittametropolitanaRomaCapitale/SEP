import Box from "@mui/material/Box";
import MUISkeleton from '@mui/material/Skeleton';
import MUITableBody from '@mui/material/TableBody';
import MUITableRow from '@mui/material/TableRow';
import MUITableCell from '@mui/material/TableCell';
import { FCC } from "@cmrc/types/FCC";
import { type TableBodyProps as MUITableBodyProps } from '@mui/material';

const SkeletonCell = () => (
  <Box sx={{
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <MUISkeleton width="100%" />
  </Box>
);

type SkeletonTableBodyProps = {
  skeletonRows: number;
  columnsCount: number;
} & Omit<MUITableBodyProps, 'children'>;

export const SkeletonTableBody: FCC<SkeletonTableBodyProps> = ({
  skeletonRows,
  columnsCount,
  className,
}) => {
  const rows = Array.from({ length: skeletonRows }, (_, rowIdx) => rowIdx);
  const columns = Array.from({ length: columnsCount }, (_, colIdx) => colIdx);

  return (
    <MUITableBody className={className}>
      {rows.map((rowId) => (
        <MUITableRow key={`skeleton-row-${rowId}`}>
          {columns.map((colId) => (
            <MUITableCell
              key={`skeleton-cell-${rowId}-${colId}`}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <SkeletonCell />
            </MUITableCell>
          ))}
        </MUITableRow>
      ))}
    </MUITableBody>
  );
};

export default SkeletonTableBody;