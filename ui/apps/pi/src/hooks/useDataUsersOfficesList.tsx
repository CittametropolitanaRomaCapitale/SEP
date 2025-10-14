import { InputMaybe, Scalars } from '@cmrc/services';
import { ReferenteProtocolloInputInput } from '@cmrc/services/src/app/piapi/generated';
import { useGetApiOfficeQuery, useGetApiUserQuery } from '@cmrc/services/sso';
import orderBy from 'lodash/orderBy';

export type AssegnatarioSelect = ReferenteProtocolloInputInput & {
  label:InputMaybe<Scalars['String']>,
  value:InputMaybe<Scalars['String']>
}

export const useDataUsersOfficesList = () => {
  const { data: offices, refetch: refetchOffices, isLoading: isLoadingUsers } : any = useGetApiOfficeQuery({});
  const {data: users, refetch: refetchUsers, isLoading: isLoadingOffices } : any = useGetApiUserQuery({})

  const fetchData = async () => {
    await refetchOffices();
    await refetchUsers();
  };

  const officeList: AssegnatarioSelect[] = orderBy(
    [
      ...(offices?.data?.map((office) => ({
        label: `${office?.name} - ${office?.short_description}`,
        value: office?.id,
        idAssegnatario: office?.code,
        nomeAssegnatario: office?.name,
        tipoDestinatario: 'ufficio'
      })) || []),
    ],
    'label'
  );

  const usersList: AssegnatarioSelect[] = orderBy(
    [
      ...(users?.map((user) => ({
        label: `${user?.firstName} ${user?.lastName}`,
        value: user?.id,
        idAssegnatario: user?.auth_id,
        nomeAssegnatario: `${user?.firstName} ${user?.lastName}`,
        tipoDestinatario: 'utente'
      })) || []),
    ],
    'label'
  );

  return { fetchData, officeList, usersList, isLoadingUsers, isLoadingOffices};
};
