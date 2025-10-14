import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { styled } from '@mui/material';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import type { DashboardSidebarProps } from './dashboard-sidebar';
import type { DashboardNavbarProps } from './dashboard-navbar';
import { useAuthContext } from '../../contexts/jwt-context';
import Box from '@mui/material/Box';

interface DashboardLayoutProps {
  children?: ReactNode;
  hideSideBar?: boolean;
  showShortDescription?: boolean;
}

const DashboardLayoutRoot = styled(Box)<DashboardLayoutProps>(({ theme, hideSideBar }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: hideSideBar ? 20 : 280
  }
}));

export const DashboardLayout: FC<
  DashboardLayoutProps &
    Pick<
      DashboardSidebarProps,
      'sections' | 'showOfficeSelector' | 'appTitle' | 'onOfficeSelected' | 'hideAllOfficesOption'
    > &
    Pick<DashboardNavbarProps, 'title' | 'back'>
> = (props) => {
  const {
    children,
    title,
    back,
    sections = [],
    showOfficeSelector,
    appTitle,
    onOfficeSelected,
    hideAllOfficesOption,
    showShortDescription,
    hideSideBar
  } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { user } = useAuthContext();
  return (
    <>
      <DashboardLayoutRoot hideSideBar={hideSideBar}>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar
        hideSideBar={hideSideBar}
        title={title}
        back={back}
        onOpenSidebar={(): void => setIsSidebarOpen(true)}
      />
      <DashboardSidebar
        showShortDescription={showShortDescription}
        hideSideBar={hideSideBar}
        sections={sections}
        open={isSidebarOpen}
        showOfficeSelector={showOfficeSelector}
        appTitle={appTitle}
        onClose={(): void => setIsSidebarOpen(false)}
        onOfficeSelected={onOfficeSelected}
        hideAllOfficesOption={hideAllOfficesOption}
      />
    </>
  );
};