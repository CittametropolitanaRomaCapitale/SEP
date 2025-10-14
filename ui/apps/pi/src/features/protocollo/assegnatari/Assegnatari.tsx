import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Grid, Typography } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { dictionary } from "./dictionary";
import { PaginazioneAssegnatari } from "./PaginazioneAssegnatari";
import { AssegnatariTable } from "./AssegnatariTable";

export const Assegnatari = () => {
  const [expanded, setExpanded] = useState(true);
  const handleChangeAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ padding: 5, marginBottom: 4 }}>
      <Box>
        <Accordion expanded={expanded} disableGutters>
          <AccordionSummary
            onClick={handleChangeAccordion}
            expandIcon={<UnfoldMoreIcon sx={{ marginLeft: '5px', color: expanded ? 'white' : 'grey' }} />}
            sx={{
              backgroundColor: expanded ? 'primary.main' : 'background.default',
              borderRadius: '8px',
              margin: '0',
              height: '55px'
            }}
          >

            <Typography sx={{ color: expanded ? 'background.default' : 'primary.main', margin: '11px' }}> {dictionary.get('assegnatari')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction='row' justifyContent='flex-end'>
              <Grid item>
                {expanded && <PaginazioneAssegnatari />}
              </Grid>
              <Grid item xs={12} md={12}>
                <AssegnatariTable />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Card>
  );
}