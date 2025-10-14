import { Box, Card, Grid } from "@mui/material"
import { FCC } from "@cmrc/types/FCC"
import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader"
import { UseFormReturn } from "react-hook-form"
import { useState } from "react"
import { RaccomandataProtocolloInputInput } from "@cmrc/services/src/app/piapi/generated"
import TableTopBar from "@cmrc/ui/components/TableTopBar"
import { dictionary } from "../dictionary"
import { useDocumentoRaccomandataTable } from "./hooks/useDocumentoRaccomandataTable"
import EnhancedTable from "../../../../components/NewTable"
import { useGetAllegatiProtocolloListQuery } from "../../hooks/useDataAllegatiProtocollo"
import SearchAllegatiProtocolloList from "../../protocollo_actions/invia_pec_peo/SearchAllegatiProtocolloList"
import { PaginationAllegatiProtocolloList } from "../../protocollo_actions/invia_pec_peo/PaginationAllegatiProtocolloList"

export interface DocumentoRaccomandataFormProps {
  formMethod: UseFormReturn<any, RaccomandataProtocolloInputInput>;
  readMode?: boolean;
}

export const DocumentoRaccomandataForm: FCC<DocumentoRaccomandataFormProps> = ({ formMethod, readMode }) => {
  const { columns } = useDocumentoRaccomandataTable()
  const [errorMessage, setErrorMessage] = useState(false)
  const { data, isLoading, isFetching } = useGetAllegatiProtocolloListQuery();

  const handleOnSelectedRow = (row) => {
    formMethod.setValue('idAllegato', row[0]?.id)

    if (row[0]?.id)
      setErrorMessage(false)

    else
      setErrorMessage(true)
  }

  return (
    <>
      <Box sx={{ marginBottom: 1 }}>
        <TableExternalHeader
          title={dictionary.get('documentoHeader')}
        />
      </Box>
      <Card sx={({ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 3 })}>
        <Grid item sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 0, marginBottom: 1 }}>
          {!readMode &&
            <TableTopBar
              leftElement={<SearchAllegatiProtocolloList />}
              rightElement={<PaginationAllegatiProtocolloList />}
            />
          }
          <EnhancedTable
            columns={columns}
            loading={!readMode && (isFetching || isLoading)}
            data={readMode ? [formMethod.getValues("allegato")] : data?.getAllegati?.allegati.filter((allegato) => allegato?.estensione === '.pdf')}
            selectable={!readMode}
            multiSelectable={false}
            onSelectRow={(row) => handleOnSelectedRow(row)}
          />
          {!readMode && errorMessage &&
            <Box sx={{ paddingTop: '15px' }}>
              <small style={{ fontWeight: '600', color: 'red' }}>{dictionary.get('allegatoRequired')}</small>
            </Box>
          }
        </Grid>
      </Card>
    </>
  )
}