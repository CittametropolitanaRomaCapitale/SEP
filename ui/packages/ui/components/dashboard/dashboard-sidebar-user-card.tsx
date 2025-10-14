import type { FC } from 'react';
import { ListItemProps, Typography } from '@mui/material';

interface DashboardSidebarUserCardProps extends ListItemProps {
  name: string;
  roles: string;
}

export const DashboardSidebarUserCard: FC<DashboardSidebarUserCardProps> = (
  props
) => {
  const { name, roles } = props;

  return (
    <>
      <Typography color="gray.100" variant="subtitle1">
        {name}
      </Typography>
      <Typography color="neutral.200" variant="caption">
        {roles}
      </Typography>
    </>
  );
};
