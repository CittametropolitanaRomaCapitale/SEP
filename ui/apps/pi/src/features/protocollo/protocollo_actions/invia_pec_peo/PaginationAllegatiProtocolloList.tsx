import Pagination from "../../../../components/Pagination";
import { useGetAllegatiProtocolloListQuery } from "../../hooks/useDataAllegatiProtocollo";

export const PaginationAllegatiProtocolloList = () => {
    const { data } = useGetAllegatiProtocolloListQuery();

    return (
        <Pagination
            table_id='allegati'
            count={data?.getAllegati?.pageCount}
            size='small'
            siblingCount={0} />
    );
};
