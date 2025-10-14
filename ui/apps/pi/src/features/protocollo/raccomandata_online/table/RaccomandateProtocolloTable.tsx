import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TableTopBar from "@cmrc/ui/components/TableTopBar";
import Stack from "@mui/material/Stack";
import toast from "@cmrc/ui/components/Toast";
import { useUpdateStatoRaccomandateForProtocolloMutation } from "@cmrc/services/src/app/piapi/generated";
import { SortingState } from "@tanstack/react-table";
import { dictionary } from "../dictionary";
import { SearchBarRaccomandateProtocolloList } from "./SearchBarRaccomandateProtocolloList";
import { useRaccomandateProtocolloTable } from "../hooks/useRaccomandateProtocolloTable";
import { useGetQueryRaccomandateProtocolloList } from "../hooks/useDataRaccomandateProtocollo";
import { PaginationRaccomandateProtocolloList } from "./PaginationRaccomandateProtocolloList";
import { SincronizzaRaccomandateButton } from "./button/SincronizzaRaccomandateButton";
import { useGetQueryStoricoList } from "../../storicizzazione/hooks/useDataStoricoList";
import EnhancedTable from "../../../../components/NewTable";

export const RaccomandateProtocolloTable = ({ protocolloData, onRowClick }) => {
  const { data, isLoading, isFetching, refetch } = useGetQueryRaccomandateProtocolloList();
  const { columns, clearTable, setSort } = useRaccomandateProtocolloTable();
  const { refetch: refetchStorico } = useGetQueryStoricoList();
  const [updateStatoRaccomandate, { isLoading: isSyncronize }] = useUpdateStatoRaccomandateForProtocolloMutation();

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    }, []
  );

  const handleRowClick = (original) => {
    onRowClick(original);
  };

  const handleSync = async () => {
    try {
      const updateResponse = await updateStatoRaccomandate({ id: protocolloData?.id }).unwrap();
      if (updateResponse?.updateStatoRaccomandateForProtocollo === true) {
        refetch();
        refetchStorico();
        toast.success(dictionary.get('updateSuccess'));
      }
      else if (updateResponse?.updateStatoRaccomandateForProtocollo === false) {
        refetch();
        toast.warn(dictionary.get('updateNotNeeded'));
      }
      else {
        toast.error(dictionary.get('updateKO'));
      }
    }
    catch {
      toast.error(dictionary.get('updateKO'));
    }
  }

  const fetchRaccomandate = async () => {
    await updateStatoRaccomandate({ id: protocolloData?.id }).unwrap();
  }

  useEffect(() => {
    fetchRaccomandate();
  }, [])

  return (
    <Card sx={{ mb: 4, padding: 5 }}>
      <Grid sx={{ width: 1 }}>
        <TableTopBar
          leftElement={
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              {/* <FiltriRaccomandateProtocolloList loading={isLoading} /> */}
              <SincronizzaRaccomandateButton loading={isSyncronize} disabled={isLoading} onSync={handleSync} />
              <SearchBarRaccomandateProtocolloList />
            </Stack>
          }
          rightElement={<PaginationRaccomandateProtocolloList />}
        />
        <EnhancedTable
          columns={columns}
          data={data?.cercaRaccomandate?.raccomandate}
          emptyTableText={dictionary.get('tabellaVuotaRaccomandata')}
          loading={isLoading || isFetching}
          onRowClick={({ original }) => handleRowClick(original)}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'raccomandateProtocollo', sort })
          }}
        />
      </Grid>
    </Card>
  );
}