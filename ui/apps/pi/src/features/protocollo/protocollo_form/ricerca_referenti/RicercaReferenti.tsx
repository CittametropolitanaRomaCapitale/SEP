import { FCC } from '@cmrc/types/FCC';
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Checkbox, Typography } from '@mui/material';
import {
  TipoRegistrazione,
  ReferenteOutputDto,
  MetodoSpedizione
} from '@cmrc/services/src/app/piapi/generated';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  OrganigrammaTreeView,
  SelectedItem
} from '../../../../components/OrganigrammaTreeView/OrganigrammaTreeView';
import { SearchInputReferenti } from './SearchInputReferenti';
import { PaginationRicercaReferenti } from './PaginationRicercaReferenti';
import { dictionary } from './dictionary';
import { RicercaAnagraficaList } from './RicercaAnagraficaList';
import { RicercaIPAListEnti } from './RicercaIPAListEnti';
import { RicercaIPAListUO } from './RicercaIPAListUO';
import { RicercaIPAListAOO } from './RicercaIPAListAOO';
import RubricaTabsLayout from './layouts/RubricaTabsLayout';
import { useTable } from '../../../../store/table/useTable';
import { RicercaGruppiList } from './RicercaGruppiList';

interface RicercaReferentiProps {
  tipoRegistrazione?: string;
  metodoSpedizione?: string;
  onAddItems: (items: SelectedItem[], usePeoInsteadOfPec: boolean) => void;
  onSearchClose: () => void;
  onTabChanged?: (tab: string) => void;
  tipoRicercaIpa?: string;
  onIpaTriggerRicercaEnti?: () => void;
  onIpaTriggerRicercaAOO?: (codAmm: string) => void;
  onIpaTriggerRicercaUO?: (codAmm: string) => void;
  isMittente?: boolean;
  onContattoSaved?: (contatto: ReferenteOutputDto) => void;
}

export const RicercaReferenti: FCC<RicercaReferentiProps> = ({
  tipoRegistrazione,
  tipoRicercaIpa,
  metodoSpedizione,
  onAddItems,
  onSearchClose,
  onTabChanged,
  onIpaTriggerRicercaEnti,
  onIpaTriggerRicercaAOO,
  onIpaTriggerRicercaUO,
  isMittente,
  onContattoSaved
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentTab, setCurrentTab] = useState('anagrafica');
  const [isRegistrazioneUscita] = useState(
    tipoRegistrazione === TipoRegistrazione.Uscita
  );
  const [isRegistrazioneEntrata] = useState(
    tipoRegistrazione === TipoRegistrazione.Entrata
  );
  const [codiceAmm, setCodiceAmm] = useState(null);

  const [usePeoInsteadOfPec, setUsePeoInsteadOfPec] = useState(false);

  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'ricercaReferenti'
  });

  const handleSelectedItemsChange = (items) => {
    setSelectedItems(items);
  };

  const handleAddItems = () => {
    onAddItems(selectedItems, usePeoInsteadOfPec);
    onSearchClose?.();
  };

  const handleChangeTabs = (tab) => {
    setCurrentTab(tab);
    onTabChanged(tab);
  };

  const handleSelectedTipoRicerca = (tipo, codAmm) => {
    if (tipo === 'enti') onIpaTriggerRicercaEnti();
    else if (tipo === 'aoo') {
      // salva salva nei filters di tableData l'input di ricerca della lista enti in modo da recuperarlo al click su "indietro"
      setFilters({ searchEnte: tableData?.search });
      onIpaTriggerRicercaAOO(codAmm);
      setCodiceAmm(codAmm);
    } else if (tipo === 'uo') {
      // salva nei filters di tableData l'input di ricerca della lista enti in modo da recuperarlo al click su "indietro"
      setFilters({ searchEnte: tableData?.search });
      onIpaTriggerRicercaUO(codAmm);
      setCodiceAmm(codAmm);
    }
  };

  const handleSearchChanged = () => {
    if (currentTab === 'ipa') {
      if (tipoRicercaIpa === 'uo') onIpaTriggerRicercaUO(codiceAmm);
      else if (tipoRicercaIpa === 'aoo') onIpaTriggerRicercaAOO(codiceAmm);
      else onIpaTriggerRicercaEnti();
    }
  };
  const handleBackFromUO = () => {
    onIpaTriggerRicercaEnti();

    // recupera l'input di ricerca  della lista degli enti precedentemente salvato nei filters di tableData
    setSearch(tableData?.filters?.searchEnte);
  };
  const handleBackFromAOO = () => {
    onIpaTriggerRicercaEnti();

    // recupera l'input di ricerca  della lista degli enti precedentemente salvato nei filters di tableData
    setSearch(tableData?.filters?.searchEnte);
  };

  const containerIPAResults = () => {
    if (currentTab === 'ipa') {
      if (tipoRicercaIpa === 'uo') {
        return (
          <RicercaIPAListUO
            onBack={() => {
              handleBackFromUO();
            }}
            onSelectedItemsChange={handleSelectedItemsChange}
            isMultiSelect={!isMittente}
          />
        );
      }
      if (tipoRicercaIpa === 'aoo') {
        return (
          <RicercaIPAListAOO
            onBack={() => {
              handleBackFromAOO();
            }}
            onSelectedItemsChange={handleSelectedItemsChange}
            isMultiSelect={!isMittente}
          />
        );
      }
      return (
        <RicercaIPAListEnti
          onSelectedTipoRicerca={(tipo, codAmm) => {
            handleSelectedTipoRicerca(tipo, codAmm);
          }}
          onSelectedItemsChange={handleSelectedItemsChange}
          isMultiSelect={!isMittente}
        />
      );
    }
    return false;
  };

  // Recupera i dati da inserire nei campi mittente e destinatari in funzione della tipologia di registrazione selezionata
  const renderRubricaResults = () => {
    if (isRegistrazioneUscita && !isMittente) {
      return (
        <RubricaTabsLayout
          currentTab={currentTab}
          onChangeTab={handleChangeTabs}
          metodoSpedizione={metodoSpedizione}
          isMittente={isMittente}
        >
          {currentTab === 'anagrafica' && (
            <RicercaAnagraficaList
              onSelectedItemsChange={handleSelectedItemsChange}
              isMultiSelect={!isMittente}
              onContattoSaved={onContattoSaved}
            />
          )}
          {currentTab === 'gruppi' && (
            <RicercaGruppiList
              onSelectedItemsChange={handleSelectedItemsChange}
            />
          )}
          {currentTab === 'ipa' && containerIPAResults()}
        </RubricaTabsLayout>
      );
    }
    if (isRegistrazioneEntrata && isMittente) {
      return (
        <RubricaTabsLayout
          currentTab={currentTab}
          onChangeTab={handleChangeTabs}
          metodoSpedizione={metodoSpedizione}
          isMittente={isMittente}
        >
          {currentTab === 'anagrafica' && (
            <RicercaAnagraficaList
              onSelectedItemsChange={handleSelectedItemsChange}
              isMultiSelect={!isMittente}
              onContattoSaved={onContattoSaved}
            />
          )}
          {currentTab === 'ipa' && containerIPAResults()}
        </RubricaTabsLayout>
      );
    }
    return (
      <OrganigrammaTreeView onSelectedItemsChange={handleSelectedItemsChange} />
    );
  };

  return (
    <Card sx={{ padding: 0, minHeight: '400px' }}>
      <Grid direction="column" rowSpacing={1} sx={{ mb: 1, padding: 2 }}>
        <Grid item>
          <TableTopBar
            leftElement={
              <SearchInputReferenti
                onSearchChanged={(newSearch) => {
                  handleSearchChanged();
                }}
              />
            }
            rightElement={<PaginationRicercaReferenti />}
          />
        </Grid>
        <Grid item>{renderRubricaResults()}</Grid>
        {
          (currentTab === 'anagrafica' || currentTab === 'gruppi') && metodoSpedizione == MetodoSpedizione.Pec && isRegistrazioneUscita &&  
          <Grid item display='flex' justifyContent='flex-end' alignItems='center'>
            <Typography variant='caption' sx={{fontWeight: 'bold'}}>
              {dictionary.get('usePEOInsteadOfPEC')}
            </Typography>
            <Checkbox 
              checked={usePeoInsteadOfPec}
              onChange={(evt) => setUsePeoInsteadOfPec(evt.target.checked)}
            />
          </Grid>
        }
        <Grid item mt={currentTab === 'anagrafica' && metodoSpedizione == MetodoSpedizione.Pec && isRegistrazioneUscita ? 0 : 3} justifyContent="flex-end">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="flex-end"
          >
            <Button
              size="small"
              variant="outlined"
              sx={{ height: '30px' }}
              onClick={() => onSearchClose?.()}
            >
              {dictionary.get('annulla')}
            </Button>
            <LoadingButton
              size="small"
              variant="contained"
              sx={{ height: '30px' }}
              onClick={handleAddItems}
              disabled={!(selectedItems?.length > 0)}
            >
              {dictionary.get('aggiungi')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
