import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import { Logo } from '@cmrc/ui/components/logo';

const NotFound: NextPage = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Head>
        <title>CMRC | Pagina non trovata</title>
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
            La pagina che stai cercando non esiste
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <NextLink href="/protocolli" passHref>
              <Button component="a" variant="outlined">
                Torna alla home
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;
