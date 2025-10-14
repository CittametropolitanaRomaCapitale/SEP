import { FCC } from '@cmrc/types/FCC';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  PecPeo,
  PecRegolaInputDtoInput
} from '@cmrc/services/src/app/piapi/generated';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useMonitoraggioPecForm } from './useMonitoraggioPecForm';
import { dictionary } from './dictionary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material';
import { useGetQueryPecRegole } from './hooks/usaDataRegoleMonitoraggio';
import { useGestioneRegoleMonitoraggio } from './hooks/useGestioneRegoleMonitoraggio';
import toast from '@cmrc/ui/components/Toast';
import { DeleteRegolaButton } from './DeleteRegolaButton';

export interface MonitoraggioProps {
  data: PecPeo;
  closeDrawer: () => void;
}

export const MonitoraggioPecDrawer: FCC<MonitoraggioProps> = ({
  data,
  closeDrawer
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: regole, refetch } = useGetQueryPecRegole();
  const { saveOrUpdateRule, isLoadingSave } = useGestioneRegoleMonitoraggio();
  const { methods, structure } = useMonitoraggioPecForm({
    regole: regole?.getPecRegole?.list?.find((r) => r.idCategoriaRegola === 1)
  });
  const { methods: methods2, structure: structure2 } = useMonitoraggioPecForm({
    regole: regole?.getPecRegole?.list?.find((r) => r.idCategoriaRegola === 2)
  });
  const { methods: methods3, structure: structure3 } = useMonitoraggioPecForm({
    regole: regole?.getPecRegole?.list?.find((r) => r.idCategoriaRegola === 3)
  });
  const { methods: methods4, structure: structure4 } = useMonitoraggioPecForm({
    regole: regole?.getPecRegole?.list?.find((r) => r.idCategoriaRegola === 4)
  });

  const onSave = async (values, accordionIndex) => {
    const input: PecRegolaInputDtoInput = {
      idCategoriaRegola: accordionIndex + 1,
      idEmail: data?.id,
      threshold: values?.threshold,
      durationMinutes: values?.durationMinutes,
      enabled: values?.enabled,
      description: `Regola - ${accordionIndex + 1}`,
      // filtro con gli start effettivamente valorizzati
      finestre: Object?.keys(values)
        .filter((key) => key?.startsWith('start') && values[key])
        .map((key) => {
          // prendo il numero dopo start + 1 per assegnarlo a dayOfWeek
          const index = Number(key.replace('start', ''));
          const start = values[`start${index}`];
          const end = values[`end${index}`];
          return {
            dayOfWeek: index + 1,
            start: new Date(start).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }),
            end: new Date(end).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          };
        })
    };
    const response = await saveOrUpdateRule(input);
    if (response?.savePecRegola?.idCategoriaRegola) {
      toast.success(dictionary.get('saveRegolaSuccess'));
    } else {
      toast.error(dictionary.get('saveRegolaError'));
    }
    refetch();
  };

  const rules = [
    dictionary.get('firstRule'),
    dictionary.get('secondRule'),
    dictionary.get('thirdRule'),
    dictionary.get('fourthRule')
  ];

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <Box sx={{ mt: 3, ml: 1.5 }}>
        Casella:
        <Typography component="span" sx={{ fontWeight: 'bold' }}>
          {' '}
          {data?.indirizzoEmail}
        </Typography>
      </Box>
      {rules.map((rule, index) => {
        let methodsForm = null;
        let structureForm = null;
        if (index === 0) {
          methodsForm = methods;
          structureForm = structure;
        } else if (index === 1) {
          methodsForm = methods2;
          structureForm = structure2;
        } else if (index === 2) {
          methodsForm = methods3;
          structureForm = structure3;
        } else if (index === 3) {
          methodsForm = methods4;
          structureForm = structure4;
        }
        return (
          <Box key={index} sx={{ mt: 2 }}>
            <Accordion
              sx={{ '&::after': { display: 'none' } }}
              expanded={expanded === index}
            >
              <AccordionSummary
                onClick={() => setExpanded(expanded === index ? null : index)}
                expandIcon={
                  expanded === index ? <ExpandMoreIcon /> : <ChevronRightIcon />
                }
              >
                <Typography>{rule}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <FormGenerator
                    methods={methodsForm}
                    structure={structureForm}
                  />
                  <Grid
                    sx={{ display: 'flex', justifyContent: 'right', mt: 3 }}
                  >
                    <DeleteRegolaButton
                      idEmail={data?.id}
                      idCategoriaRegola={index + 1}
                      closeDrawer={closeDrawer}
                    />
                    <LoadingButton
                      onClick={methodsForm.handleSubmit((values) =>
                        onSave(values, index)
                      )}
                      size="small"
                      variant="contained"
                      loading={isLoadingSave}
                      sx={{ height: '30px', ml: 3 }}
                    >
                      {dictionary.get('salva')}
                    </LoadingButton>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      })}
      <Grid item></Grid>
    </Grid>
  );
};
