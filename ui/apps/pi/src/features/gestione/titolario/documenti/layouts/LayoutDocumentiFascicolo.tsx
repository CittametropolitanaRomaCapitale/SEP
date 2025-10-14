import { useState } from "react";
import { FCC } from "@cmrc/types/FCC"
import { AllegatoBaseFragment, TitolarioOutputDto } from "@cmrc/services/src/app/piapi/generated";
import { GetDataDocumentiFascicoloProvider } from "../hooks/useDataDocumentiFascicolo";
import { ListaDocumentiFascicolo } from "../ListaDocumentiFascicolo";
import { TopbarDocumentiFascicolo } from "../TopbarDocumentiFascicolo";

export type LayoutDocumentiFascicoloProps = {
  itemSelected: TitolarioOutputDto;
  hasPermission: boolean;
}

export const LayoutDocumentiFascicolo: FCC<LayoutDocumentiFascicoloProps> = ({ itemSelected, hasPermission }) => {
  const [selectedDocumenti, setSelectedDocumenti] = useState<AllegatoBaseFragment[]>([]);

  return (
    <GetDataDocumentiFascicoloProvider itemSelected={itemSelected}>
      <TopbarDocumentiFascicolo itemSelected={itemSelected} selectedDocumenti={selectedDocumenti} disabled={!hasPermission}/>
      <ListaDocumentiFascicolo setSelectedDocumenti={setSelectedDocumenti} disabled={!hasPermission} />
    </GetDataDocumentiFascicoloProvider >
  )
}