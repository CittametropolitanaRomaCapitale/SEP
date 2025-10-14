import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@cmrc/ui/components/Dialog';
import { UserOffice } from '@cmrc/services/sso';
import { useAuth } from '../../hooks/use-auth';
import Input from '@cmrc/ui/form/FormComponents/Input';

const allOffice = {
  id: 0,
  office: {
    id: 0,
    name: 'ALL'
  }
};

interface SelectOfficePopoverProps {
  hideAllOfficesOption?: boolean;
  showShortDescription?: boolean;
}

export const SelectOfficePopover = (props: SelectOfficePopoverProps) => {
  const { onSelectOffice, user } = useAuth();
  const offices =
    props.hideAllOfficesOption !== undefined && props.hideAllOfficesOption
      ? [...(user?.officeWithPermission || [])]
      : [allOffice, ...(user?.officeWithPermission || [])];
  const [search, setSearch] = useState('');
  const [isOfficeNotSelected, setIsOfficeNotSelected] = useState(true);

  const filteredOffices = offices.filter(
    (item: UserOffice) =>
      (!item.deleted &&
        item?.office?.name?.toLowerCase().includes(search.toLowerCase())) ||
      item?.office?.short_description
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );
  return (
    <Dialog open title="Seleziona ufficio" fullWidth={false} hideCloseButton>
      <Grid>
        <Input
          sx={{ mb: 2 }}
          inputLeftElement={<SearchIcon />}
          placeholder="cerca"
          size="medium"
          variant="standard"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Grid sx={{ maxHeight: '200px', overflow: 'auto' }}>
          <FormControl sx={{ width: 1, overflow: 'hidden' }}>
            {filteredOffices.map((item: UserOffice) => (
              <FormControlLabel
                value={item?.office?.id}
                key={`${item?.id}_${item?.office?.id}`}
                control={
                  <Checkbox
                    checked={
                      user?.selectedOffice?.office?.id === item?.office?.id
                    }
                    onChange={(event) => {
                      const office = offices.find(
                        (office) =>
                          office.office.id === Number(event.target.value)
                      );
                      setIsOfficeNotSelected(false);
                      onSelectOffice(office);
                    }}
                  />
                }
                label={
                  props.showShortDescription
                    ? `${item?.office?.name} - ${item?.office?.short_description}`
                    : item?.office?.name
                }
                sx={{ height: '32px' }}
              />
            ))}
          </FormControl>
          {filteredOffices.length === 0 && (
            <Typography sx={{ textAlign: 'center', mb: 2 }}>
              Nessun ufficio trovato
            </Typography>
          )}
        </Grid>

        <Stack direction="row" justifyContent="center" sx={{ pt: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => onSelectOffice(user?.selectedOffice, true)}
            disabled={isOfficeNotSelected}
          >
            Ok
          </Button>
        </Stack>
      </Grid>
    </Dialog>
  );
};
