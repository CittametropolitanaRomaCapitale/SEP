import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@cmrc/ui/components/Drawer';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { RicercaAvanzataProtocolliDrawer } from '../ricerca_avanzata/RicercaAvanzataProtocolliDrawer';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';
import { useTable } from '../../../../store/table/useTable';

export const RicercaAvanzataProtocolli = () => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'ricercaAvanzataProtocolliDrawer'
  });
  const { tableData, setFilters } = useTable({
    table_id: 'listaProtocolli'
  });

  return (
    <>
      {!tableData?.filters?.advancedFilters && (
        <Button
          onClick={openDrawer}
          startIcon={<SearchIcon />}
          sx={{ mr: 1 }}
          size="small"
          variant="contained"
        >
          {dictionary.get('ricercaAvanzata')}
        </Button>
      )}
      {!!tableData?.filters?.advancedFilters && (
        <>
          <Button
            startIcon={<CancelIcon />}
            sx={{ mr: 1 }}
            size="small"
            variant="contained"
            onClick={() =>
              setFilters({filtro: tableData?.filters?.filtro})
            }
          >
            {dictionary.get('annullaRicercaAvanzata')}
          </Button>
          <Button
            onClick={openDrawer}
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
            size="small"
            variant="contained"
          >
            {dictionary.get('modificaRicercaAvanzata')}
          </Button>
        </>
      )}

      <Drawer
        title={dictionary.get('ricercaAvanzata')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <RicercaAvanzataProtocolliDrawer />
      </Drawer>
    </>
  );
};
