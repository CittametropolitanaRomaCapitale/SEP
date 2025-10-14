import { TipoRegistrazione } from "@cmrc/services/src/app/piapi/generated";
import { useState } from "react";
import FullScreenDialog from "@cmrc/ui/components/FullScreenDialog";
import { RaccomandateProtocolloTable } from "./table/RaccomandateProtocolloTable";
import { useGetQueryDettaglioProtocollo } from "../useDataDettaglioProtocollo";
import { RaccomandateProtocolloTableHeader } from "./table/RaccomandateProtocolloTableHeader";
import { GetRaccomandateProtocolloListListProvider } from "./hooks/useDataRaccomandateProtocollo";
import { useDialog } from "../../../store/dialog/useDialog";
import { RaccomandataForm } from "./form/RaccomandataForm";
import { dictionary } from "./dictionary";

export const Raccomandata = () => {
  const { data } = useGetQueryDettaglioProtocollo();
  const isProtocolAuthor = data?.dettaglioProtocollo?.protocolAuthor
  const tipoRegistrazione = data?.dettaglioProtocollo?.protocollo?.tipoRegistrazione
  const allegatiPdf = data?.dettaglioProtocollo?.protocollo?.allegati.filter((allegato) => allegato?.estensione === '.pdf')
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { open, close: closeDialog, isOpen } = useDialog({
    dialog_id: `raccomandataDialog_${selectedRowData?.idRaccomandata}`
  })

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    open();
  };

  return (
    /* Sezione "Raccomandata online" disponibile solo:
    - per l'utente che ha creato il protocollo
    - protocollo in uscita
    - se il protocollo ha file '.pdf' allegati
    */
    (isProtocolAuthor && tipoRegistrazione === TipoRegistrazione.Uscita && allegatiPdf?.length > 0) &&
    <GetRaccomandateProtocolloListListProvider idProtocollo={data?.dettaglioProtocollo?.protocollo?.id}>
      <RaccomandateProtocolloTableHeader protocolloData={data?.dettaglioProtocollo?.protocollo} />
      <RaccomandateProtocolloTable protocolloData={data?.dettaglioProtocollo?.protocollo} onRowClick={handleRowClick} />
      <FullScreenDialog title={dictionary.get('dettaglioRaccomandata')} open={isOpen} onClose={closeDialog} contrastBackground>
        <RaccomandataForm protocolloData={data?.dettaglioProtocollo?.protocollo} defaultvalues={selectedRowData} readMode />
      </FullScreenDialog>
    </GetRaccomandateProtocolloListListProvider>
  )
};