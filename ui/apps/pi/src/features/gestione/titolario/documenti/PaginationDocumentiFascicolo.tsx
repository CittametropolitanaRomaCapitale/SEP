import { FCC } from "@cmrc/types/FCC";
import Pagination from "../../../../components/Pagination";

type PaginationDocumentiFascicoloProps = {
  pagecount: number;
}

export const PaginationDocumentiFascicolo: FCC<PaginationDocumentiFascicoloProps> = ({ pagecount }) => (
  <Pagination
    table_id="listaDocumentiFascicolo"
    count={pagecount}
    size='small'
    siblingCount={0}
  />
);
