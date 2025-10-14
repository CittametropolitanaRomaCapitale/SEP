import { FCC } from '@cmrc/types/FCC';
import Stack from '@mui/material/Stack';
import LabelItem from '@cmrc/ui/components/LabelItem';
import { Box, Card } from '@mui/material';
import * as dateUtils from '@cmrc/ui/utils/date-utils';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { dictionary } from './dictionary';
import { useGetQueryDettaglioProtocollo } from './useDataDettaglioProtocollo';

export const RiepilogoProtocollo:FCC = () => {
    const { data } = useGetQueryDettaglioProtocollo();

    const dataRegistrazione = dateUtils.formatQueryDateTime(
      data?.dettaglioProtocollo?.protocollo?.tsCreation,
      'dd/MM/yyyy'
    );
    const oraRegistrazione = dateUtils.formatQueryDateTime(
      data?.dettaglioProtocollo?.protocollo?.tsCreation,
      'HH:mm'
    );

    return (
      <Card sx={{ padding: '30px', marginBottom: '30px' }}>
        <Box>
          <Stack
            paddingTop={1}
            paddingLeft={2}
            paddingRight={2}
            paddingBottom={1}
            spacing={1}
            direction="row"
          >
            <LabelItem
              label={dictionary.get('numero')}
              value={data?.dettaglioProtocollo?.protocollo?.nProtocollo}
            />
            <LabelItem
              label={dictionary.get('dataDiRegistrazione')}
              value={dataRegistrazione}
            />
            <LabelItem
              label={dictionary.get('oraDiRegistrazione')}
              value={oraRegistrazione}
            />
            <LabelItem
              label={dictionary.get('inseritoDa')}
              value={data?.dettaglioProtocollo?.protocollo?.utente}
            />
             <LabelItem
              label={dictionary.get('cdr')}
              value={data?.dettaglioProtocollo?.protocollo?.cdr}
            />
            <LabelItem
              label={dictionary.get('stato')}
              value={toSentence(data?.dettaglioProtocollo?.protocollo?.stato)}
            />
          </Stack>
        </Box>
      </Card>
    );
  };

export default RiepilogoProtocollo;
