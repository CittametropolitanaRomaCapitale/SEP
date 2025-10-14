import { FCC } from "@cmrc/types/FCC";
import Pagination from "../../../../components/Pagination";

type PaginationProtocolliFascicoloProps = {
  pageCount: number;
}

export const PaginationProtocolliFascicolo: FCC<PaginationProtocolliFascicoloProps> = ({ pageCount }) => (
  <Pagination
    table_id="listaProtocolliFascicolo"
    count={pageCount}
    size='small'
    siblingCount={0}
  />
);
