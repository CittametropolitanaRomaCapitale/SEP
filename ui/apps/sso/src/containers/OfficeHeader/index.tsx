import {
  useGetApiOfficeByCdrCodeRelatedOfficesQuery,
  useGetApiOfficeByIdQuery
} from '@cmrc/services/sso';
import { formatDate } from '@cmrc/ui/utils/formatters';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import HistoryIcon from '@mui/icons-material/History';
import LabelItem from '@cmrc/ui/components/LabelItem';
import Stack from '@mui/material/Stack';
import { dictionary } from '../../features/dettaglio_ufficio/dictionary';
import { useDrawer } from '../../store/drawer/useDrawer';
import { useFormState } from '../../store/form/useForm';
import { useDialog } from '../../store/dialog/useDialog';

export const OfficeHeader = () => {
  const { query } = useRouter();
  const { data: officeData, isUninitialized } = useGetApiOfficeByIdQuery({
    id: Number(query?.id)
  });
  const { data: relatedOfficeData, isUninitialized: isUninitializedRelated } =
    useGetApiOfficeByCdrCodeRelatedOfficesQuery(
      {
        cdrCode: officeData?.code
      },
      {
        skip: !officeData?.code
      }
    );

  const { openDrawer: openEdit } = useDrawer({
    drawer_id: 'modificaUfficio'
  });

  const { setDefaultValues } = useFormState({
    form_id: 'formUfficio'
  });

  const { openWithContent } = useDialog({
    dialog_id: 'chiudiUfficio'
  });

  const { openWithContent: openWithContenPermanentDelete } = useDialog({
    dialog_id: 'chiudiUfficioDefinitivamente'
  });

  const { openWithContent: openWithContenReopen } = useDialog({
    dialog_id: 'riapriUfficio'
  });

  const { openDrawer } = useDrawer({
    drawer_id: 'cronologiaUfficio'
  });

  const { openWithContent: openWithContentBlocca } = useDialog({
    dialog_id: 'bloccaUfficio'
  });

  const onOpenReopenOffice = ({ id, name }) => {
    openWithContenReopen({
      content: {
        name,
        id
      }
    });
  };

  const onOpenDelete = ({ id, name }) => {
    openWithContent({
      content: {
        name,
        id
      }
    });
  };

  const onOpenPermanentDelete = ({ id, name }) => {
    openWithContenPermanentDelete({
      content: {
        name,
        id
      }
    });
  };

  const onOpenEdit = () => {
    setDefaultValues({
      default_values: {
        ...officeData,
        belonging_offices: relatedOfficeData?.map((item) => ({
          label: item?.name,
          value: item?.id
        }))
      }
    });
    openEdit();
  };

  const onOpenBlock = ({ id, name }) => {
    openWithContentBlocca({
      content: {
        name,
        id
      }
    });
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Grid container sx={{ alignItems: 'center', mb: 3 }}>
        <Grid item sx={{ display: 'flex' }} xs={6}>
          <Typography
            fontSize="1.4rem"
            sx={(theme) => ({
              color: theme.palette.common.black,
              fontWeight: theme.typography.fontWeightBold,
              marginLeft: 1
            })}
          >
            CDR
          </Typography>
          <Typography
            sx={{ textTransform: 'uppercase', ml: 1 }}
            fontSize="1.4rem"
          >
            {officeData?.name}
          </Typography>
          {officeData?.deleted && !officeData?.deleted_permanent && (
            <Chip
              label={dictionary.get('chiuso')}
              size="small"
              variant="filled"
              color="error"
              sx={{ ml: 1, mt: 0.5, textTransform: 'uppercase' }}
            />
          )}
          {officeData?.deleted_permanent && (
            <Chip
              label={dictionary.get('chiusoDefinitivamente')}
              size="small"
              variant="filled"
              color="error"
              sx={{ ml: 1, mt: 0.5, textTransform: 'uppercase' }}
            />
          )}
          {officeData?.blocked && (
            <Chip
              label={dictionary.get('bloccato')}
              size="small"
              variant="filled"
              color="error"
              sx={{ ml: 1, mt: 0.5, textTransform: 'uppercase' }}
            />
          )}
        </Grid>
        <Grid
          item
          xs={6}
          sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
        >
          {!officeData?.deleted && !officeData?.deleted_permanent && (
            <>
              <Button
                variant="contained"
                size="small"
                sx={{ height: '30px' }}
                onClick={onOpenEdit}
                aria-label="modifica"
                disabled={isUninitialized || isUninitializedRelated}
              >
                Modifica
              </Button>
              <Button
                variant={officeData?.blocked ? 'contained' : 'outlined'}
                size="small"
                sx={{ height: '30px' }}
                onClick={() =>
                  onOpenBlock({ name: officeData?.name, id: officeData?.id })
                }
                aria-label="blocca"
              >
                {officeData?.blocked
                  ? 'Sblocca accessi ufficio'
                  : 'Blocca accessi ufficio'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ height: '30px' }}
                onClick={() =>
                  onOpenDelete({ name: officeData?.name, id: officeData?.id })
                }
                aria-label="chiudi"
              >
                Chiudi
              </Button>
            </>
          )}
          {officeData?.deleted && !officeData?.deleted_permanent && (
            <Button
              variant="contained"
              size="small"
              sx={{ height: '30px' }}
              onClick={() =>
                onOpenReopenOffice({
                  name: officeData?.name,
                  id: officeData?.id
                })
              }
              aria-label="riapri"
            >
              Riapri
            </Button>
          )}

          {!officeData?.deleted_permanent && (
            <Button
              variant="outlined"
              size="small"
              sx={{ height: '30px' }}
              onClick={() =>
                onOpenPermanentDelete({
                  name: officeData?.name,
                  id: officeData?.id
                })
              }
              aria-label="chiudi-definitivamente"
            >
              Chiudi Definitivamente
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            sx={{ height: '30px' }}
            startIcon={<HistoryIcon />}
            onClick={openDrawer}
          >
            Cronologia
          </Button>
        </Grid>
      </Grid>
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <LabelItem
              label={dictionary.get('office_start_date')}
              value={
                officeData?.office_start_date
                  ? formatDate({ date: officeData?.office_start_date })
                  : null
              }
              labelIsUppercase
            />

            <LabelItem
              label={dictionary.get('office_end_date')}
              value={
                officeData?.office_end_date
                  ? formatDate({ date: officeData?.office_end_date })
                  : null
              }
              labelIsUppercase
            />

            <LabelItem
              label={dictionary.get('last_update')}
              value={
                officeData?.last_update
                  ? formatDate({ date: officeData?.last_update })
                  : null
              }
              labelIsUppercase
            />

            <LabelItem
              label={dictionary.get('state')}
              value={officeData?.office_end_date ? 'Chiuso' : 'Attivo'}
              labelIsUppercase
            />

            <LabelItem
              label={dictionary.get('dirigente')}
              value={String(officeData?.dirigente_user_id)}
              labelIsUppercase
            />

            <LabelItem
              label={dictionary.get('description')}
              value={officeData?.description}
              labelIsUppercase
            />

            <LabelItem
              label={dictionary.get('service')}
              value={officeData?.service}
              labelIsUppercase
            />
            <LabelItem
              label={dictionary.get('short_description')}
              value={officeData?.short_description}
              labelIsUppercase
            />
          </Stack>
        </Grid>
      </Card>
    </Container>
  );
};
