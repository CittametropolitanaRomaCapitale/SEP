import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { DeleteTagButton } from './DeleteTagButton';
import { UpdateTagButton } from './UpdateTagButton';
import { Tag } from '@cmrc/services/src/app/piapi/generated';

type TableTagConfigurationButtonsProps = {
  tagSelected: Tag;
};

export const TableTagConfigurationButtons: FCC<
  TableTagConfigurationButtonsProps
> = ({ tagSelected }) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    <UpdateTagButton tagSelected={tagSelected} />
    <DeleteTagButton tagSelected={tagSelected} />
  </Grid>
);
