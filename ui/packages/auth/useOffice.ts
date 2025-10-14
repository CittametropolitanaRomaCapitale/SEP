import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { UserOffice } from '@cmrc/services/sso';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import useStorage from './useStorage';
import { useAdmin } from './useAdmin';

export const useOffice = () => {
  const { user } = useAuth();
  const { getItem, setItem, removeItem } = useStorage();
  const { adminRoles } = useAdmin();

  const setOffice = (office: UserOffice) => {
    setItem('CDR', office?.office?.name);
    setItem('CDRDesc',office?.office.description);
    setItem('shortCDRDesc',office?.office.short_description);
    setItem(
      'CDRCode',
      office?.office?.name === 'ALL' ? 'all' : office?.office?.code
    );
  };

  const removeOffice = () => {
    removeItem('CDR');
    removeItem('CDRCode');
  };

  const isSelectedOfficeAll = user?.selectedOffice?.office?.name === 'ALL';

  const roles = isSelectedOfficeAll
    ? user?.offices?.map((item) => [...(item?.roles || [])]).flat(1)
    : user?.offices?.find((item: any) => item?.office_id === user?.selectedOffice?.office_id)
        ?.roles;

  const isUserRedattore = isSelectedOfficeAll
    ? roles?.find((item) => item?.name === 'redattore') !== undefined
    : user?.selectedOffice?.roles?.find(
        (item) => item?.name === 'redattore'
      ) !== undefined;

  const isUserAdmin = roles?.find(
    (item) => item?.name === 'admin'
    ) !== undefined; 

  // Ruoli PI - Protocollo informatico
  const isPiUser = roles?.find(
    (item) => item?.name === 'utente'
  ) !== undefined;  
  
  const isUserProtocollatore = roles?.find(
      (item) => item?.name === 'protocollatore'
    ) !== undefined;    

  const isUserArchivista = roles?.find(
      (item) => item?.name === 'archivista'
    ) !== undefined;  

  const isUserPIAdmin = adminRoles?.find(
    (item) => item?.role === 'pi_admin'
  ) !== undefined;

  const isUserSIDAdmin = adminRoles?.find(
    (item) => item?.complete_role === 'SID_admin'
  ) !== undefined;

  const isAto2OfficeFound =
    user?.offices?.findIndex((item) => item?.office?.name === 'ATO2') > -1;

  return {
    cdr: getItem('CDR'),
    cdrDesc: getItem('CDRDesc'),
    shortCdrDesc: getItem('shortCDRDesc'),
    cdrCode: getItem('CDRCode'),
    roles: orderBy(
      uniqBy(roles || [], (role) => role?.id),
      'name'
    ),
    isPiUser,
    isUserRedattore,
    isUserArchivista,
    isUserAdmin,
    isUserPIAdmin,
    isUserProtocollatore,
    isSelectedOfficeAll,
    isAto2OfficeFound,
    isUserSIDAdmin,
    setOffice,
    removeOffice
  };
};
