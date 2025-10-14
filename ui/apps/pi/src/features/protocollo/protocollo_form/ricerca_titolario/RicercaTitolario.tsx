import { useEffect, useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import ViewCompactAltSharpIcon from '@mui/icons-material/ViewCompactAltSharp';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import {
  TipologiaTitolario,
  TitolarioOutputDto
} from '@cmrc/services/src/app/piapi/generated';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useOffice } from '@cmrc/auth/useOffice';
import Breadcrumb from '../../../../components/Breadcrumb';
import { SearchInputTitolario } from './SearchInputTitolario';
import { useGetTitolarioList } from '../../../../hooks/useDataTitolario';
import LoadingContainer from '../../../../components/LoadingContainer';
import { AddTitolario } from '../../../gestione/titolario/buttons/AddTitolario';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from './dictionary';
import { TitolarioButtons } from '../../../gestione/titolario/buttons/TitolarioButtons';
import { useRicercaTitolario } from '../hooks/useRicercaTitolario';
import { SpostaFascicoli } from '../../../gestione/titolario/buttons/SpostaFascicoli';
import { SpostaDocumenti } from '../../../gestione/titolario/buttons/SpostaDocumenti';
import { useSnackbar } from '../../../../store/snackbar/useSnackBar';
import { SpostaProtocolli } from '../../../gestione/titolario/buttons/SpostaProtocolli';
import LegendaIconeTitolario from './LegendaIconeTitolario';
import { useDispatch } from '../../../../store';
import { resetState } from '../../../../store/titolario/titolarioSlice';
import { useAppSelector } from '../../../../store/hooks';
import { FiltriTitolario } from './FiltriTitolario';
import Box from '@mui/material/Box';
import DescriptionIcon from '@mui/icons-material/Description';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import Checkbox from '@cmrc/ui/form/FormComponents/Checkbox';

interface RicercaTitolarioProps {
  onAddItems?: (items: TitolarioOutputDto[]) => void;
  onChangeItem?: (item: TitolarioOutputDto) => void;
  onSearchClose?: () => void;
  isGestione?: boolean; // props per definire che la sezione che usa il componente è "Gestione"
  minHeight?: number;
  setFiltersList?: (filters: any) => void;
  setIsOpenSnackbarFascicoli?: (isOpen: boolean) => void;
  hideFilterForFascicoliDeleted?: boolean;
  setIndexesForSearch?: (lastIdTitolario: any, startIndex: any) => void;
}

export const RicercaTitolario: FCC<RicercaTitolarioProps> = ({
  onAddItems,
  onChangeItem,
  onSearchClose,
  isGestione,
  minHeight,
  setFiltersList,
  hideFilterForFascicoliDeleted,
  setIndexesForSearch
}) => {
  const initialBreadcrumb: TitolarioOutputDto[] = [
    {
      id: null,
      label: 'TITOLI',
      idPadre: null,
      leaf: false,
      tipologia: 'Titoli',
      note: '',
      tsCreation: null,
      tsChiusura: null,
      closed: false,
      deleted: false,
      write: false,
      immutable: false,
      fascicoloDipendente: false,
      numDocumenti: null,
      numProtocolli: null,
      visible: null
    }
  ];

  const [allTitolarioData, setAllTitolarioData] = useState([]);
  const [isFillingTitolarioData, setIsFIllingTitolarioData] = useState(false);
  const [isFiltriDisabled, setFiltriDisabled] = useState(true);
  const [breadcrumb, setBreadcrumb] =
    useState<TitolarioOutputDto[]>(initialBreadcrumb);
  const { isFascicoloLevel, isDipendenteSection } = useRicercaTitolario();
  const [selectedItems, setSelectedItems] = useState<TitolarioOutputDto[]>([]);
  const [selectedItem, setSelectedItem] = useState<TitolarioOutputDto>();
  const [selected, setSelected] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<TitolarioOutputDto>();
  const [isOpenSnackbarFascicoli, setIsOpenSnackbarFascicoli] = useState(false);
  const [displayCheckbox, setDisplayCheckbox] = useState(false);
  const {
    isLoading,
    isFetching,
    data: currentData,
    refetch
  } = useGetTitolarioList();
  const [itemTooltip, setItemTooltip] = useState('');
  const { isUserPIAdmin, isUserArchivista } = useOffice();
  const dispatch = useDispatch();
  const router = useRouter();
  const hierarchyState = useAppSelector(
    (state) => state?.titolario?.initialData?.hierarchy
  );
  const { setSearch, setFilters, setPage, tableData } = useTable({
    table_id: 'ricercaTitolario'
  });

  const { isOpen: isOpenSpostaProtocolli } = useSnackbar({
    snackBarId: 'spostaProtocolli'
  });

  const { isOpen: isOpenSpostaDocumenti } = useSnackbar({
    snackBarId: 'spostaDocumenti'
  });

  const handleReset = () => {
    setSelectedItem(null);
    setSelectedLeaf(null);
  };

  useEffect(
    () => () => {
      /** clean up */
      handleReset();
    },
    []
  );

  useEffect(() => {
    setSelected(false);
    setSelectedLeaf(null);
  }, [isOpenSpostaProtocolli, isOpenSpostaDocumenti]);

  useEffect(() => {
    if (hierarchyState && router.asPath.includes('?idPadre')) {
      setBreadcrumb([...initialBreadcrumb, ...(hierarchyState || [])]);
      dispatch(resetState());
    }
  }, []);

  useEffect(() => {
    if (currentData === undefined || currentData === null) return;
    setIsFIllingTitolarioData(true);
    setAllTitolarioData([
      ...allTitolarioData,
      ...currentData?.getTitolario?.titolario
    ]);
    setTimeout(() => {
      setIsFIllingTitolarioData(false);
    }, 200);
  }, [currentData]);

  const setDisabledFiltri = (searchValue, breadcrumb) => {
    if (searchValue.length >= 3) {
      setFiltriDisabled(false);
      return;
    }

    let disable: boolean = true;
    for (let i = 0; i < breadcrumb.length; i++) {
      if (breadcrumb[i].tipologia === TipologiaTitolario.SottoSezione) {
        disable = false;
        break;
      }
    }
    setFiltriDisabled(disable);
  };

  const handleMoreResultsForTitolario = (page, index, idTitolario) => {
    setPage(page);
    setIndexesForSearch(idTitolario, index);
  };
  // Gestisce il clic su un elemento
  const handleItemClick = (item: TitolarioOutputDto) => {
    if (item?.leaf) {
      if (isOpenSpostaProtocolli || isOpenSpostaDocumenti) {
        setSelectedLeaf(item);
        setSelected(true);
      }
      return;
    }

    setSearch('');
    setAllTitolarioData([]);
    setIsFIllingTitolarioData(true);
    setIndexesForSearch(-1, -1);
    const hierarchy = item?.hierarchy || [];
    const updatedBreadcrumb = [...initialBreadcrumb, ...hierarchy, item];
    setBreadcrumb(updatedBreadcrumb);
    setDisabledFiltri('', updatedBreadcrumb);
    onChangeItem(item);
  };

  // Gestisce il passaggio sull'elemento per visualizzare il tooltip
  const handleItemHover = async (item: TitolarioOutputDto) => {
    if (item) {
      setItemTooltip(item?.hierarchyString);
    }
  };

  const handleSearchInput = (searchValue: string) => {
    setAllTitolarioData([]);
    setIndexesForSearch(-1, -1);
    setIsFIllingTitolarioData(true);
    setDisabledFiltri(searchValue, breadcrumb);
    setSearch(searchValue);
  };

  // Gestisce il clic su un elemento del breadcrumb.
  const handleBreadcrumbClick = (item: any) => {
    setSearch('');
    setAllTitolarioData([]);
    setIsFIllingTitolarioData(true);
    setIndexesForSearch(-1, -1);
    // Trova l'indice del breadcrumb che corrisponde all'elemento su cui è stato cliccato
    const index = breadcrumb.findIndex((crumb) => crumb.id === item.id);

    // Crea un nuovo array di breadcrumb che include tutti gli elementi fino a quello cliccato
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setDisabledFiltri('', newBreadcrumb);
    onChangeItem(item); // aggiorna il provider passando l'elemento selezionato
  };

  const handleFiltersTitolarioChanged = (selectedFilters: any[]) => {
    setAllTitolarioData([]);
    setIsFIllingTitolarioData(true);
    setIndexesForSearch(-1, -1);
    setDisabledFiltri('', breadcrumb);
    setFilters({
      ...tableData?.filters,
      stato: selectedFilters
    });
  };

  /**
   * Gestisce la selezione/deselezione di un elemento, supportando sia selezione multipla che esclusiva.
   * Se un elemento è selezionato, lo rimuove. Altrimenti aggiunge alla lista.
   *  */
  const handleSelectionToggle = (item: TitolarioOutputDto) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some((i) => i.id === item.id);
      if (isSelected) {
        return prevSelected.filter((i) => i.id !== item.id);
      }
      return [...prevSelected, item];
    });
  };

  // Gestisce l'aggiunta degli elementi foglia selezionati per popolare il titolario
  const handleAddItems = () => {
    onAddItems(selectedItems);
    onSearchClose?.();
  };
  const handleItemUpdated = (item: any) => {
    setAllTitolarioData([]);
    setIsFIllingTitolarioData(true);
    setIndexesForSearch(-1, -1);
    setDisabledFiltri('', breadcrumb);
    setPage(0);
    refetch();
  };

  /** Definisce se rendere visibili o meno le actions su ogni elemento dell'alberatura
   *  La selezione è possibile solo sugli elementi foglia
   */
  const renderItemActions = (itemSelected: TitolarioOutputDto) => {
    if (
      itemSelected?.leaf &&
      !itemSelected.deleted &&
      !itemSelected.closed &&
      !isGestione
    ) {
      const isSelected = selectedItems.some((i) => i.id === itemSelected.id);
      return (
        <ListItemIcon key={itemSelected.id}>
          <IconButton
            key={itemSelected.id}
            onClick={() => handleSelectionToggle(itemSelected)}
            title={
              isSelected
                ? dictionary.get('RimuoviFascicolo')
                : dictionary.get('SelezionaFascicolo')
            }
            size="small"
          >
            {isSelected ? (
              <CheckIcon color="primary" />
            ) : (
              <AddIcon color="primary" />
            )}
          </IconButton>
        </ListItemIcon>
      );
    }

    if (isGestione && !isOpenSpostaProtocolli && !isOpenSpostaDocumenti) {
      return (
        <TitolarioButtons
          hasPermission={itemSelected?.write}
          isArchivista={isUserArchivista}
          isImmutable={itemSelected?.immutable}
          hasAdminPermission={isUserPIAdmin}
          itemSelected={itemSelected}
          breadcrumb={[
            ...initialBreadcrumb,
            ...(itemSelected?.hierarchy || [])
          ]}
          disabled={
            displayCheckbox || isOpenSpostaProtocolli || isOpenSpostaDocumenti
          }
          setSelectedItem={setSelectedItem}
          setDisplayCheckbox={setDisplayCheckbox}
          setSelectedItems={setSelectedItems}
          onItemUpdated={handleItemUpdated}
          onItemDeleted={handleItemUpdated}
        />
      );
    }
    return <ListItemIcon></ListItemIcon>;
  };

  const renderIconTitolario = (tipologia, isClosed) => {
    if (isClosed)
      return (
        <FolderOffIcon
          titleAccess={dictionary.get('fascicoloChiuso')}
          color="primary"
          fontSize="small"
        />
      );

    switch (tipologia) {
      case TipologiaTitolario.Titolo:
        return (
          <AccountTreeIcon
            titleAccess={dictionary.get('titolo')}
            color="primary"
            fontSize="small"
          />
        );
      case TipologiaTitolario.Sezione:
        return (
          <ViewCompactAltSharpIcon
            titleAccess={dictionary.get('sezione')}
            color="primary"
            fontSize="small"
          />
        );
      case TipologiaTitolario.SottoSezione:
        return (
          <GridViewSharpIcon
            titleAccess={dictionary.get('sottoSezione')}
            color="primary"
            fontSize="small"
          />
        );
      case TipologiaTitolario.FascicoloLv1:
        return (
          <FolderIcon
            titleAccess={dictionary.get('fascicoloLv1')}
            color="primary"
            fontSize="small"
          />
        );
      case TipologiaTitolario.FascicoloLvN:
        return (
          <FolderCopyOutlinedIcon
            titleAccess={dictionary.get('fascicoloLvN')}
            color="primary"
            fontSize="small"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card sx={{ padding: 0, minHeight }}>
      <Grid
        container
        direction="column"
        rowSpacing={1}
        sx={{ mb: 1, padding: 2 }}
      >
        <Grid item>
          <Breadcrumb
            items={breadcrumb.map((crumb) => ({
              id: crumb.id,
              name: crumb.label,
              path: `/${crumb.label}`
            }))}
            onItemClick={handleBreadcrumbClick}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TableTopBar
                leftElement={
                  <SearchInputTitolario
                    onSearch={handleSearchInput}
                    disabled={
                      breadcrumb.length > 0
                        ? breadcrumb[breadcrumb.length - 1].fascicoloDipendente
                        : false
                    }
                  />
                }
              />
            </Grid>
            <Grid item xs={2}>
              <FiltriTitolario
                disabled={isFiltriDisabled}
                onSelectedOptions={handleFiltersTitolarioChanged}
                tableData={tableData}
                setFiltersList={setFiltersList}
                hideFilterForFascicoliDeleted={hideFilterForFascicoliDeleted}
              />
            </Grid>
          </Grid>
        </Grid>
        <>
          {(isUserPIAdmin ||
            (isUserArchivista && isFascicoloLevel(breadcrumb))) &&
            !isDipendenteSection(breadcrumb) &&
            isGestione &&
            !isOpenSnackbarFascicoli &&
            !displayCheckbox &&
            !isOpenSpostaProtocolli &&
            !isOpenSpostaDocumenti && (
              <AddTitolario
                hasPermission={
                  isUserPIAdmin ||
                  (isUserArchivista && isFascicoloLevel(breadcrumb))
                }
                breadcrumb={breadcrumb}
                disabled={isOpenSnackbarFascicoli}
                onItemUpdated={handleItemUpdated}
              />
            )}
          {(isUserPIAdmin || isUserArchivista) &&
            isGestione &&
            displayCheckbox &&
            isFascicoloLevel(breadcrumb) && (
              <SpostaFascicoli
                setDisplayCheckbox={setDisplayCheckbox}
                breadcrumb={breadcrumb}
                selectedItems={selectedItems}
                reset={handleReset}
                onItemUpdated={handleItemUpdated}
              />
            )}
          {/* TO-DO: AGGIUNGERE IL CONTROLLO SUL PERMESSO PER SPOSTARE I PROTOCOLLI DEL FASCICOLO DIPENDENTE */}
          {(isUserPIAdmin || isUserArchivista) &&
            isGestione &&
            isOpenSpostaProtocolli &&
            isFascicoloLevel(breadcrumb) && (
              <SpostaProtocolli
                fascicoloOld={selectedItem}
                fascicoloNew={selectedLeaf}
                disabled={!selectedLeaf}
                reset={handleReset}
                onItemUpdated={handleItemUpdated}
              />
            )}
          {/* TO-DO: AGGIUNGERE IL CONTROLLO SUL PERMESSO PER SPOSTARE I DOCUMENTI DEL FASCICOLO DIPENDENTE */}
          {(isUserPIAdmin || isUserArchivista) &&
            isGestione &&
            isOpenSpostaDocumenti &&
            isFascicoloLevel(breadcrumb) && (
              <SpostaDocumenti
                fascicoloOld={selectedItem}
                fascicoloNew={selectedLeaf}
                disabled={!selectedLeaf}
                reset={handleReset}
                onItemUpdated={handleItemUpdated}
              />
            )}
          {allTitolarioData?.length > 0 ? (
            <>
              <Grid item>
                <LegendaIconeTitolario />
              </Grid>
              <Grid item>
                <List>
                  {allTitolarioData?.map((item: TitolarioOutputDto) => {
                    let itemTooltipPrefix = '';
                    if (item.deleted) {
                      itemTooltipPrefix += `${dictionary.get(
                        'fascicoloEliminatoTooltip'
                      )} - `;
                    }
                    if (item.closed) {
                      itemTooltipPrefix += `${dictionary.get(
                        'fascicoloChiusoTooltip'
                      )} - `;
                    }

                    return (
                      <ListItem
                        key={item.id}
                        secondaryAction={renderItemActions(item)}
                        disablePadding
                      >
                        {!['Titolo', 'Sezione', 'SottoSezione'].includes(
                          item?.tipologia
                        ) &&
                          displayCheckbox && (
                            <Checkbox
                              checked={selectedItems.some(
                                (selected) => selected.id === item.id
                              )}
                              onChange={() => {
                                setSelectedItems((prevSelected) => {
                                  const isSelected = prevSelected.some(
                                    (selected) => selected.id === item.id
                                  );
                                  if (isSelected) {
                                    return prevSelected.filter(
                                      (selected) => selected.id !== item.id
                                    );
                                  } else {
                                    return [...prevSelected, item];
                                  }
                                });
                              }}
                            />
                          )}
                        <ListItemButton
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          onMouseOver={() => handleItemHover(item)}
                          selected={selectedLeaf?.id === item.id && selected}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '48px 5fr 190px',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' }
                          }}
                        >
                          <ListItemIcon>
                            {renderIconTitolario(item?.tipologia, item?.closed)}
                          </ListItemIcon>
                          <Tooltip
                            key={item.id}
                            title={itemTooltipPrefix + itemTooltip}
                          >
                            <Typography
                              key={item.id}
                              color={item.closed ? 'textSecondary' : ''}
                              sx={{
                                textDecoration: item.deleted
                                  ? 'line-through'
                                  : ''
                              }}
                            >
                              {item.label}
                            </Typography>
                          </Tooltip>
                          <Box>
                            {(item?.numDocumenti > 0 ||
                              item?.numProtocolli > 0) && (
                              <Box
                                key={item.id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {item?.numDocumenti > 0 && (
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    icon={<DescriptionIcon fontSize="small" />}
                                    title={dictionary.get('numDocumenti', {
                                      numero: `${item?.numDocumenti}`
                                    })}
                                    sx={{ mr: 2 }}
                                    label={item?.numDocumenti}
                                  />
                                )}
                                {item?.numProtocolli > 0 && (
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    icon={<FilePresentIcon fontSize="small" />}
                                    title={dictionary.get('numProtocolli', {
                                      numero: `${item?.numProtocolli}`
                                    })}
                                    label={item?.numProtocolli}
                                  />
                                )}
                              </Box>
                            )}
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              {currentData?.getTitolario?.hasMore ? (
                <LoadingButton
                  variant={'outlined'}
                  loading={isLoading || isFetching}
                  onClick={() => {
                    handleMoreResultsForTitolario(
                      currentData?.getTitolario?.nextPage,
                      currentData?.getTitolario?.lastIndex,
                      currentData?.getTitolario?.lastIdTitolario
                    );
                  }}
                >
                  {dictionary.get('loadMoreResults')}
                </LoadingButton>
              ) : (
                <></>
              )}
              {/* I bottoni sono nascosti se si è in gestione */}
              {!isGestione && (
                <Grid item mt={3} justifyContent="flex-end">
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
              )}
            </>
          ) : (
            <LoadingContainer
              isLoading={isFillingTitolarioData || isLoading || isFetching}
            >
              <h3 style={{ textAlign: 'center' }}>
                {dictionary.get('nessunRisultato')}
              </h3>
            </LoadingContainer>
          )}
        </>
      </Grid>
    </Card>
  );
};
