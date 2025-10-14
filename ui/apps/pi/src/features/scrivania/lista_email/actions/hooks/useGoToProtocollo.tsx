import { useRouter } from 'next/router';
import { useTable } from '../../../../../store/table/useTable';

export const useGoToProtocollo = () => {
  const { push } = useRouter();
  const { tableData } = useTable({
    table_id: 'listaEmail'
  });

  const goToProtocollo = async (emailData) => {
    const nProtocollo = emailData?.protocollo?.nProtocollo;
    const { advancedFilters, ...filters } = tableData?.filters || {};
    const queryParams = {
      indirizziEmail: filters?.indirizziEmail,
      isClassificato: filters?.isClassificato,
      isAssegnato: filters?.isAssegnato,
      mostraNonLavorate: filters?.mostraNonLavorate,
      ...advancedFilters,
      search: tableData?.search,
      page: tableData?.page
    };

    Object.keys(queryParams).forEach(
      (k) =>
        (queryParams[k] == null || queryParams[k] === '') &&
        delete queryParams[k]
    );

    await push({ pathname: '/pec', query: queryParams }).then(() =>
      push(`/protocolli/${nProtocollo}`)
    );
  };
  return { goToProtocollo };
};
