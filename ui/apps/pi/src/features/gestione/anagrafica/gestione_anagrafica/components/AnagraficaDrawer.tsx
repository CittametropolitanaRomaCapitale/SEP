import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { AnagraficaDto, ReferenteOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useDrawer } from '../../../../../store/drawer/useDrawer';
import { useGetQueryAnagraficaList } from '../hooks/useDataAnagraficaList';
import { useGestioneAnagrafica } from '../hooks/useGestioneAnagrafica';
import { dictionary } from '../dictionary';
import { useGetReferentiList } from '../../../../../hooks/useDataReferenti';
import { useAnagraficaForm } from '../forms/useAnagraficaForm';

export interface AnagraficaProps {
  data?: AnagraficaDto;
  from: string;
  readMode?: boolean;
  onContattoSaved?: (contatto: ReferenteOutputDto) => void;
}

export const AnagraficaDrawer: FCC<AnagraficaProps> = ({
  data,
  from,
  readMode,
  onContattoSaved
}) => {
  const { closeDrawer } = useDrawer({
    drawer_id: `anagraficaDrawer_${data?.id}`
  });
  const { methods, structure } = useAnagraficaForm({ initialData: data, from });
  const { saveContatto, updateContatto, isLoadingSave } =
    useGestioneAnagrafica();
  const anagraficaQuery = useGetQueryAnagraficaList();
  const referentiQuery = useGetReferentiList();

  const onSave = async ({ ...values }) => {
    if (data?.id) {
      const response = await updateContatto({
        id: data?.id,
        input: {
          ragioneSociale: values?.ragioneSociale,
          nome: values?.nome,
          cognome: values?.cognome,
          cfPiva: values?.cfPiva,
          indirizzo: values?.indirizzo,
          citta: values?.citta,
          cap: values?.cap,
          provincia: values?.provincia,
          email: values?.email,
          pec: values?.pec,
          telefono: values?.telefono,
          fax: values?.fax,
          note: values?.note,
          certificato: from === 'anagrafica',
          gruppiIds: values?.gruppi?.map((g) => g?.value)
        }
      });

      if (response?.updateContatto?.id) {
        closeDrawer();
      }
    } else {
      const response = await saveContatto({
        ragioneSociale: values?.ragioneSociale,
        nome: values?.nome,
        cognome: values?.cognome,
        cfPiva: values?.cfPiva,
        indirizzo: values?.indirizzo,
        citta: values?.citta,
        cap: values?.cap,
        provincia: values?.provincia,
        email: values?.email,
        pec: values?.pec,
        telefono: values?.telefono,
        fax: values?.fax,
        note: values?.note,
        certificato: from === 'anagrafica',
        gruppiIds: values?.gruppi?.map((g) => g?.value)
      });
      if (response?.saveContatto?.id) {
        if (onContattoSaved) {
          const contattoPulito = {
            tipo: 'anagrafica_interna',
            id: String(response.saveContatto.id),
            idDestinatario: String(response.saveContatto.id),
            descrizione: response.saveContatto.ragioneSociale,
            ragioneSociale: response.saveContatto.ragioneSociale,
            cognome: response.saveContatto.cognome,
            nome: response.saveContatto.nome,
            cfPiva: response.saveContatto.cfPiva,
            pec: response.saveContatto.pec,
            email: response.saveContatto.email,
            citta: response.saveContatto.citta,
            indirizzo: response.saveContatto.indirizzo,
            label: response.saveContatto.ragioneSociale,
            children: null
          } as ReferenteOutputDto;
          onContattoSaved(contattoPulito);
        }
        closeDrawer();
      }
    }
    if (from === 'anagrafica') {
      anagraficaQuery.refetch();
    } else {
      referentiQuery.refetch();
    }
  };

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <Grid item>
        <FormGenerator
          methods={methods}
          structure={structure}
          disabled={readMode}
        />
      </Grid>
      {!readMode && (
        <Grid item>
          <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button
              onClick={closeDrawer}
              size="small"
              sx={{ height: '30px', mr: 1 }}
            >
              {dictionary.get('annulla')}
            </Button>
            <LoadingButton
              onClick={methods.handleSubmit((values) => onSave(values))}
              size="small"
              variant="contained"
              loading={isLoadingSave}
              sx={{ height: '30px' }}
            >
              {dictionary.get('salva')}
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
