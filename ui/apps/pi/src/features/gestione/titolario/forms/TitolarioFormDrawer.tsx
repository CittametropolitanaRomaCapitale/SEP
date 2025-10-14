import { FCC } from '@cmrc/types/FCC';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import toast from '@cmrc/ui/components/Toast';
import {
  TitolarioInputInput,
  TitolarioOutputDto,
  useInsertTitolarioMutation,
  useUpdateTitolarioMutation
} from '@cmrc/services/src/app/piapi/generated';
import { formatDate } from '@cmrc/ui/utils/formatters';
import Typography from '@mui/material/Typography';
import { useOffice } from '@cmrc/auth/useOffice';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';
import { useRicercaTitolario } from '../../../protocollo/protocollo_form/hooks/useRicercaTitolario';
import {
  TitolarioFormValues,
  useTitolarioFormDrawer
} from './hooks/useTitolarioFormDrawer';

export type TitolarioFormDrawerProps = {
  itemSelected?: TitolarioOutputDto;
  hasPermission?: boolean;
  breadcrumb?: TitolarioOutputDto[];
  onItemUpdated?: (item: any) => void;
};

export const TitolarioFormDrawer: FCC<TitolarioFormDrawerProps> = ({
  itemSelected,
  breadcrumb,
  hasPermission,
  onItemUpdated
}) => {
  const { cdr, cdrCode, shortCdrDesc } = useOffice();
  const { isFascicoloLevel, getSezionePadre, getTipologia } =
    useRicercaTitolario();

  const { methods, structure } = useTitolarioFormDrawer({
    breadcrumb,
    defaultValues: itemSelected,
    canEditForm: hasPermission
  });
  const [saveTitolario, { isLoading: isLoadingSave }] =
    useInsertTitolarioMutation();
  const [updateTitolario, { isLoading: isLoadingUpdate }] =
    useUpdateTitolarioMutation();

  const { closeDrawer } = useDrawer({
    drawer_id: 'titolarioDrawer'
  });

  const shouldShowOpenedDate = () =>
    isFascicoloLevel(breadcrumb) && itemSelected;

  const onSave = async (values: TitolarioFormValues) => {
    const formData: TitolarioFormValues = values;

    if (formData.id) {
      const excludeParamSave = [
        'deleted',
        'label',
        'hierarchy',
        'tsCreation',
        'tsDeleted',
        'closed',
        'hierarchyString',
        'write',
        'immutable',
        'numDocumenti',
        'numProtocolli',
        'visible'
      ];
      excludeParamSave.forEach((param) => delete formData[param]);
      const titolarioInput: TitolarioInputInput = {
        ...formData,
        tsChiusura: `${new Date(values.tsChiusura).toISOString()}`,
        leaf: !formData.leaf ? false : formData.leaf,
        idPadre: formData.idPadre,
        fascicoloDipendente: false
      };

      const updateResponse = await updateTitolario({ titolarioInput }).unwrap();
      if (updateResponse?.updateTitolario) {
        toast.success(dictionary.get('updateSuccess'));
        closeDrawer();
        onItemUpdated(titolarioInput);
      }
    } else {
      const excludeParamSave = [
        'deleted',
        'label',
        'hierarchy',
        'tsDeleted',
        'closed',
        'tipologia',
        'hierarchyString'
      ];

      if (!values.tsChiusura) {
        excludeParamSave.push('tsChiusura');
      }
      excludeParamSave.forEach((param) => delete formData[param]);

      const lastItem: TitolarioOutputDto = getSezionePadre(breadcrumb);
      const titolarioInput: TitolarioInputInput = {
        ...values,
        tsChiusura:
          values.tsChiusura && `${new Date(values.tsChiusura).toISOString()}`,
        leaf: !values.leaf ? false : values.leaf,
        idPadre: lastItem.id,
        tipologia: getTipologia(lastItem?.tipologia),
        cdr: `${cdr} - ${shortCdrDesc}`,
        cdrCode,
        fascicoloDipendente: false
      };
      const saveResponse = await saveTitolario({ titolarioInput }).unwrap();
      if (saveResponse?.insertTitolario) {
        toast.success(dictionary.get('saveSuccess'));
        closeDrawer();
        onItemUpdated?.(titolarioInput);
      }
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
        {shouldShowOpenedDate() && (
          <Typography
            variant="body2"
            sx={(theme) => ({ pb: 1, color: theme.palette.grey[600] })}
          >
            {`${dictionary.get('tsAperturaFascicolo')} ${formatDate({
              date: itemSelected?.tsCreation,
              dateOnly: false
            })}`}
          </Typography>
        )}
        {itemSelected?.deleted && (
          <Typography variant="body2" sx={{ pb: 1, color: 'red' }}>
            {`${dictionary.get('tsEliminazioneFascicolo')} ${formatDate({
              date: itemSelected?.tsDeleted,
              dateOnly: false
            })}`}
          </Typography>
        )}
      </Grid>
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        {hasPermission && (
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
              loading={isLoadingSave || isLoadingUpdate}
              sx={{ height: '30px' }}
            >
              {dictionary.get('conferma')}
            </LoadingButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
