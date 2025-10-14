import { useRouter } from 'next/router';
import { useTable } from '../../../../../store/table/useTable';
import { useDispatch } from '../../../../../store';
import { setEmailData, setinoltraRispondiConProtocollo } from '../../../../../store/email/emailSlice';
import { dictionary } from '../dictionary';

export const useInoltraConProtocollo = () => {
  const { push } = useRouter();
  const { tableData } = useTable({
    table_id: 'listaEmail',
  });
  const dispatch = useDispatch();

  const inoltraConProtocollo = async (emailData) => {
    const queryParams = {
      ...tableData?.filters,
      search: tableData?.search,
      page: tableData?.page,
    };

    Object.keys(queryParams).forEach((k) =>
      (queryParams[k] == null || queryParams[k] === '') &&
      delete queryParams[k]
    );

    dispatch(setinoltraRispondiConProtocollo(dictionary.get('actioniInoltraConProtocollo')));
    dispatch(setEmailData(emailData));
    await push({ pathname: '/pec', query: queryParams })
    push({ pathname: `/crea-protocollo` })
  };
  return { inoltraConProtocollo };
};