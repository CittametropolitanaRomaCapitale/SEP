import { ReactNode, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Can } from '@4dd/authz';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

import { UserOffice } from '@cmrc/services/sso';

import { Selector as SelectorIcon } from '../../icons/selector';

import { Logo } from '../logo';
import { Scrollbar } from '../scrollbar';
import { DashboardSidebarSection } from './dashboard-sidebar-section';
import { OrganizationPopover } from './organization-popover';
import { useAuth } from '../../hooks/use-auth';
import { DashboardSidebarUserCard } from './dashboard-sidebar-user-card';

export interface DashboardSidebarProps {
  onClose: () => void;
  onOfficeSelected?: (office?: UserOffice) => void;
  open: boolean;
  sections?: Section[];
  showOfficeSelector?: boolean;
  appTitle?: string;
  hideAllOfficesOption?: boolean;
  hideSideBar?: boolean;
  showShortDescription?: boolean;
}

export interface Item {
  title: string;
  children?: Item[];
  chip?: ReactNode;
  icon?: ReactNode;
  path?: string;
  resourceIds?: string[];
}

export interface Section {
  title?: string;
  items: Item[];
  resourceIds?: string[];
}

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const {
    onClose,
    onOfficeSelected,
    open,
    sections = [],
    showOfficeSelector,
    appTitle,
    hideAllOfficesOption,
    hideSideBar,
    showShortDescription
  } = props;
  const router = useRouter();
  const { user, onSelectOffice } = useAuth();

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), {
    noSsr: true
  });

  const organizationsRef = useRef<HTMLButtonElement | null>(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] =
    useState<boolean>(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]
  );

  const handleOpenOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(true);
  };

  const handleCloseOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(false);
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div>
            <Box sx={{ p: 3 }}>
              <NextLink href="/" passHref>
                <a>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42
                    }}
                  />
                </a>
              </NextLink>
            </Box>
            <Box sx={{ padding: '0 10px', textAlign: 'center' }}>
              <Typography
                color="neutral.500"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  lineHeight: 1.75,
                  textTransform: 'uppercase'
                }}
              >
                {appTitle}
              </Typography>
            </Box>

            <Divider sx={{ pt: 3, mb: 2 }} />
            <Box sx={{ px: 2 }}>
              {showOfficeSelector ? (
                <Box
                  onClick={handleOpenOrganizationsPopover}
                  ref={organizationsRef}
                  sx={{
                    alignItems: 'center',
                    backgroundColor: (theme) => theme.palette.primary.main,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 3,
                    py: '11px',
                    borderRadius: 1
                  }}
                >
                  <div>
                    <DashboardSidebarUserCard
                      name={user?.name}
                      roles={user?.roles}
                    />

                    <Typography color="gray.100" variant="body2">
                      {showShortDescription ?
                        `${user?.selectedOffice?.office?.name} - ${user?.selectedOffice?.office?.short_description}` :
                        user?.selectedOffice?.office?.name
                      }
                    </Typography>
                  </div>
                  <SelectorIcon
                    sx={{
                      color: 'white',
                      width: 14,
                      height: 14
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    alignItems: 'center',
                    backgroundColor: (theme) => theme.palette.primary.main,
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 3,
                    py: '11px',
                    borderRadius: 1
                  }}
                >
                  <DashboardSidebarUserCard
                    name={user?.name}
                    roles={user?.roles}
                  />
                </Box>
              )}
            </Box>
          </div>
          <Divider sx={{ pt: 2, mb: 2 }} />

          <Box sx={{ flexGrow: 1 }}>
            {(sections || []).map((section, index) => (
              <Can
                key={`menu_section_${section.title}`}
                permissionIds={section?.resourceIds || []}
              >
                <DashboardSidebarSection
                  key={`sectionTitle_${index}_${section?.title}`}
                  path={router.asPath}
                  sx={{
                    mt: 2,
                    '& + &': {
                      mt: 2
                    }
                  }}
                  {...section}
                />
              </Can>
            ))}
          </Box>

          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="neutral.300" variant="subtitle2">
              {process.env.NEXT_PUBLIC_PACKAGE_VERSION}
            </Typography>
          </Box>
        </Box>
      </Scrollbar>
      <OrganizationPopover
        offices={user?.offices}
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
        onSelectOffice={(office?: UserOffice, closeDialog?: boolean) => {
          onSelectOffice(office, closeDialog);
          if (onOfficeSelected) onOfficeSelected(office);
        }}
        hideAllOfficesOption={hideAllOfficesOption}
      />
    </>
  );

  if (lgUp && !hideSideBar) {
    return (
      <Drawer
        anchor="left"
        open
        sx={{ zIndex: 900 }}
        PaperProps={{
          sx: {
            backgroundColor: '#FFFFFF',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) =>
              theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 240,
            top: 20,
            left: 20,
            height: 'calc(100% - 50px)',
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: '#FFFFFF',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};