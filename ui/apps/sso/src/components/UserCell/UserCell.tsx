import { FCC } from '@cmrc/types/FCC';
import Typography from '@mui/material/Typography';
import { useGetApiUserByIdQuery } from '@cmrc/services/sso';
import { User } from '../../types';

export interface UserCellProps {
  id?: number;
}

const UserCell: FCC<UserCellProps> = ({ id }) => {
  const { data } = useGetApiUserByIdQuery(
    {
      id
    },
    { skip: !id }
  );

  return (
    <Typography>
      {(data as User)?.username ? (data as User)?.username : '-'}
    </Typography>
  );
};

export default UserCell;
