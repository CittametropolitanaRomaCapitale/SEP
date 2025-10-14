import { Box, IconButton, Link } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { MetodoSpedizione } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const useReferentiTabs = (metodoSpedizione, isMittente) => {

  const tabs: any = [];
  tabs.push({
    label: dictionary.get('anagrafica'),
    value: 'anagrafica'
  })

  if (!isMittente) {
    tabs.push({
      label: dictionary.get('gruppi'),
      value: 'gruppi'
    })
  }

  if (metodoSpedizione !== MetodoSpedizione.Email) {
    tabs.push({
      label: <Box>
        {dictionary.get('ipa')}
        <IconButton
          style={{ marginBottom: -5 }}
          size="small"
          component="label"
        >
          <Link href={dictionary.get('indiceIpaLink')} target="_blank">
            <OpenInNew />
          </Link>
        </IconButton>
      </Box>,
      value: 'ipa'
    })
  }
  // {
  //   label: <Box>
  //     {dictionary.get('inad')}
  //     <IconButton
  //       style={{ marginBottom: -5 }}
  //       size="small"
  //       component="label"
  //     >
  //       <Link href={dictionary.get('indiceInadLink')} target="_blank">
  //         <OpenInNew />
  //       </Link>
  //     </IconButton>
  //   </Box>,
  //   value: 'inad'
  // }

  return { tabs };
};