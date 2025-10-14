import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Grid,
  Typography
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { PaginazioneStorico } from './PaginazioneStorico';
import { StoricoList } from './StoricoList';
import { dictionary } from './dictionary';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useStoricoForm } from './form/useStoricoForm';
import { useOffice } from '@cmrc/auth/useOffice';
import { EsportaStorico } from './EsportaStorico';
import { FCC } from '@cmrc/types/FCC';

type StoricoProps = {
  idProtocollo: bigint;
  onFilterChange: (value: boolean) => void;
  isFilteredByCdr: boolean;
};

export const Storico: FCC<StoricoProps> = ({
  idProtocollo,
  onFilterChange,
  isFilteredByCdr
}) => {
  const { cdr, cdrCode } = useOffice();
  const { methods, structure } = useStoricoForm(cdr, onFilterChange);
  const [expanded, setExpanded] = useState(true);
  const handleChangeAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ padding: 5 }}>
      <Box>
        <Accordion expanded={expanded} disableGutters>
          <AccordionSummary
            onClick={handleChangeAccordion}
            expandIcon={
              <UnfoldMoreIcon
                sx={{ marginLeft: '5px', color: expanded ? 'white' : 'grey' }}
              />
            }
            sx={{
              backgroundColor: expanded ? 'primary.main' : 'background.default',
              borderRadius: '8px',
              margin: '0',
              height: '55px'
            }}
          >
            <Grid
              container
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography
                sx={{
                  color: expanded ? 'background.default' : 'primary.main',
                  margin: '11px'
                }}
              >
                {' '}
                {dictionary.get('storico')}
              </Typography>
              <EsportaStorico
                idProtocollo={idProtocollo}
                expanded={expanded}
                cdrCode={cdrCode}
                isFilteredByCdr={isFilteredByCdr}
              />
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="row" justifyContent="flex-end">
              <Grid item>
                {expanded && (
                  <Grid container alignItems="center">
                    <Grid item>
                      <FormGenerator methods={methods} structure={structure} />
                    </Grid>
                    <Grid item>
                      <PaginazioneStorico />
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <StoricoList />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Card>
  );
};
