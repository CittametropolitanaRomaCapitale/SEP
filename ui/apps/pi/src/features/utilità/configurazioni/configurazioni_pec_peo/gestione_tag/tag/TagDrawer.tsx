import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Tag } from '@cmrc/services/src/app/piapi/generated';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';
import { useGetQueryTagList } from '../hooks/useDataTag';
import { useGestioneTag } from '../hooks/useGestioneTag';
import { dictionary } from '../dictionary';
import { useTagForm } from '../forms/useTagForm';

type TagProps = {
  tagSelected?: Tag;
};

export const TagDrawer: FCC<TagProps> = ({ tagSelected }) => {
  const { closeDrawer } = useDrawer({
    drawer_id: `tagDrawer_${tagSelected?.id}`
  });
  const { methods, structure } = useTagForm({
    initialData: tagSelected
  });
  const { saveTag, updateTag, isLoadingSave } = useGestioneTag();
  const { refetch } = useGetQueryTagList();

  const onSave = async ({ ...values }) => {
    if (tagSelected?.id) {
      const response = await updateTag({
        id: tagSelected?.id,
        tagInput: {
          nome: values?.nome
        }
      });
      if (response?.updateTag) {
        refetch();
        closeDrawer();
      }
    } else {
      const response = await saveTag({
        nome: values?.nome
      });
      if (response?.saveTag) {
        refetch();
        closeDrawer();
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
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
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
    </Grid>
  );
};
