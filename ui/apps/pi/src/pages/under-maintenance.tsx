import type { NextPage } from 'next';
import Head from 'next/head';

import { useAuth } from '@cmrc/ui/hooks/use-auth';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import { Logo } from '@cmrc/ui/components/logo';
import { getSession } from 'next-auth/react';
import { getPermissionToken } from '@cmrc/auth/NextAuthApi';
import { useMaintenanceEnv } from '@cmrc/auth/useMaintenanceEnv';

const UnderMaintenance: NextPage = () => {
  const { logout } = useAuth();
  const {maintenanceMode} = useMaintenanceEnv();

  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const onLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>CMRC | Non accessibile</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'flex-start',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          py: '0px'
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <Box
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 400,
                textAlign: 'center'
              }}
            >
              <Logo
                sx={{
                  height: 80,
                  width: 80
                }}
              />
            </Box>
          </Box>

          <Typography
            align="center"
            sx={{ paddingTop: '20%' }}
            variant={mobileDevice ? 'h4' : 'h3'}
          >
            Il sistema non è accessibile
          </Typography>
          <Typography
            align="center"
            sx={{ paddingTop: '8' }}
            variant={mobileDevice ? 'h6' : 'h5'}
          >
            {maintenanceMode?.message}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <Button component="a" variant="outlined" onClick={onLogout}>
              Logout
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const permissions = await getPermissionToken(session?.access_token, []);

  return {
    props: {
      session,
      permissions
    }
  };
}

export default UnderMaintenance;
