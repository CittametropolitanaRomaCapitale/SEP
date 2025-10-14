import { FCC } from '@cmrc/types/FCC';
import Typography from '@mui/material/Typography';
import { useGetApiUserByIdQuery } from '@cmrc/services/sso';

export interface UserCellProps {
  id: number;
}

const UserCell: FCC<UserCellProps> = ({ id }) => {
  const { data } = useGetApiUserByIdQuery<{ data: { username: string } }>({
    id
  });
  return (
    <Typography fontWeight={600} fontSize="0.8rem">
      {data?.username ?? '-'}
    </Typography>
  );
};

export default UserCell;
