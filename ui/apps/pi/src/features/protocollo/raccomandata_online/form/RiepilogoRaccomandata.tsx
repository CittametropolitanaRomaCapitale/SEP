import Stack from '@mui/material/Stack';
import LabelItem from '@cmrc/ui/components/LabelItem';
import { Box, Card } from '@mui/material';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { formatDate } from '@cmrc/ui/utils/formatters';
import { dictionary } from '../dictionary';

export const RiepilogoRaccomandata = ({ defaultValues, hidden }) => (
  <Card
    sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 3, marginTop: 3 }}
    hidden={hidden}
  >
    <Box>
      <Stack
        paddingTop={1}
        paddingBottom={1}
        paddingLeft={2}
        paddingRight={2}
        spacing={5}
        direction="row"
      >
        <Box
          onClick={(e) => {
            e.stopPropagation();
            if (defaultValues?.numero && defaultValues?.idRaccomandata) {
              window.open(
                `https://www.poste.it/cerca/#/risultati-spedizioni/${defaultValues?.numero}`,
                '_blank',
                'noopener,noreferrer'
              );
            }
          }}
          sx={{
            width: 200,
            textDecoration: 'none'
          }}
        >
          <LabelItem
            label={dictionary.get('numeroRaccomandata')}
            value={defaultValues?.numero}
            sxValue={defaultValues?.numero && {textDecoration: 'underline', cursor: 'pointer'}}
          />
        </Box>
        <LabelItem
          label={dictionary.get('idRaccomandata')}
          value={defaultValues?.idRaccomandata}
        />
        <LabelItem
          label={dictionary.get('tsInserimento')}
          value={formatDate({
            date: defaultValues?.tsInserimento,
            dateOnly: false
          })}
        />
        <LabelItem
          label={dictionary.get('statoRaccomandata')}
          value={toSentence(defaultValues?.stato)}
        />
        <LabelItem
          label={dictionary.get('costoRaccomandata')}
          value={defaultValues?.costo ? `${defaultValues?.costo} €` : '-'}
        />
      </Stack>
    </Box>
  </Card>
);
