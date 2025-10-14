import { useEffect } from "react";
import { FCC } from "@cmrc/types/FCC";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TableTopBar from "@cmrc/ui/components/TableTopBar";
import { dictionary } from "./dictionary";
import { usePermessiFascicoloTable } from "./usePermessiFascicoloTable";
import { FiltriPermessiFascicolo } from "./FiltriPermessiFascicolo";
import { useGetQueryPermessiFascicolo } from "../../hooks/useDataPermessiFascicolo";
import EnhancedTable from "../../../../../../components/NewTable";

export const PermessiFascicolo: FCC = () => {
  const { query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetQueryPermessiFascicolo();
  const { columns, clearTable, setPage, setSearch, setFilters } = usePermessiFascicoloTable();

  useEffect(() => {
    if (!isReady) return;
    const { permesso, cdr } = query || {};

    setFilters({
      permesso: permesso !== undefined ? String(permesso)?.split(',') : undefined,
      cdr: cdr !== undefined ? String(cdr)?.split(',') : undefined
    });

    setSearch(String(query?.search || ''));
    setPage(Number(query?.page) || 0);
  }, [isReady]);

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    }, []
  );

  return (
    <Card sx={{ mb: 4, pt: 2 }}>
      <Grid sx={{ width: 1 }}>
        <TableTopBar
          leftElement={<FiltriPermessiFascicolo loading={isLoading} />}
        />
        <EnhancedTable
          columns={columns}
          data={data?.getPermessiVisibilita?.permessi}
          emptyTableText={dictionary.get('tabellaVuotaPermessiTesto')}
          loading={isLoading || isFetching}
        />
      </Grid>
    </Card>
  );
}