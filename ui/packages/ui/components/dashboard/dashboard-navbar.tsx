import { useRef, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Stack, styled } from '@mui/material';
import type { AppBarProps } from '@mui/material';
import { Menu as MenuIcon } from '../../icons/menu';
import { AccountPopover } from './account-popover';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import Link from 'next/link';

export interface DashboardNavbarProps extends AppBarProps {
  onOpenSidebar?: () => void;
  title?: any;
  back?: { link: string; label: string };
  hideSideBar?: boolean;
}

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === 'light'
    ? {
        boxShadow: theme.shadows[3]
      }
    : {
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        boxShadow: 'none'
      })
}));

const AccountButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: 2
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40
          }}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { onOpenSidebar, title, back, hideSideBar, ...other } = props;

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          background: (theme) => theme.palette.primary.main,
          borderRadius: 1,
          top: '20px',
          left: {
            xs: 10,
            sm: 20,
            lg: hideSideBar ? 20 : 280
          },
          zIndex: 1000,
          width: {
            xs: 'calc(100% - 20px)',
            sm: 'calc(100% - 40px)',
            lg: hideSideBar ? 'calc(100% - 40px)' : 'calc(100% - 300px)'
          },
          position: 'absolute'
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: hideSideBar ? 'inline-flex' : 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" sx={{ color: 'white' }} />
          </IconButton>

          <Stack direction={'row'} spacing={1} divider={<ChevronRightIcon />}>
            {back && (
              <Stack direction={'row'} spacing={1}>
                <Link href={back?.link}>
                  <Typography
                    fontWeight="600"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {back?.label}
                  </Typography>
                </Link>
              </Stack>
            )}
            {title && <Typography fontWeight="600">{title}</Typography>}
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <AccountButton />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
