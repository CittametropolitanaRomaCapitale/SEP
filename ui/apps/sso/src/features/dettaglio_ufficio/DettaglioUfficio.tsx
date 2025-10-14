import {
  useDeleteApiOfficeByOfficeIdMutation,
  useDeleteApiOfficeDeleteByOfficeIdPermanentMutation,
  useGetApiOfficeByIdQuery,
  usePutApiOfficeByOfficeIdMutation,
  usePutApiOfficeOpenByOfficeIdMutation
} from '@cmrc/services/sso';
import Drawer from '@cmrc/ui/components/Drawer';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import toast from '@cmrc/ui/components/Toast';
import { DeleteDialog } from '../../components/DeleteDialog';
import { OfficeHeader } from '../../containers/OfficeHeader';
import { useDialog } from '../../store/dialog/useDialog';
import { useDrawer } from '../../store/drawer/useDrawer';
import { useFormState } from '../../store/form/useForm';
import Ufficio from '../lista_uffici/ufficio/Ufficio';
import CronologiaUfficio from './CronologiaUfficio';
import { dictionary } from './dictionary';
import { UtentiUfficio } from './utenti_ufficio/UtentiUfficio';
import { SaveDialog } from '../../components/SaveDialog';

export const DettaglioUfficio = () => {
  const { query } = useRouter();
  const { setDefaultValues } = useFormState({
    form_id: 'formUfficio'
  });

  const { closeDrawer: closeEdit, isOpenDrawer: isOpenEdit } = useDrawer({
    drawer_id: 'modificaUfficio'
  });

  const { closeDrawer: closeCronologia, isOpenDrawer: isOpenCronologia } =
    useDrawer({
      drawer_id: 'cronologiaUfficio'
    });

  const { data: officeData } = useGetApiOfficeByIdQuery({
    id: Number(query?.id)
  });

  const {
    isOpen: isOpenDeleteOffice,
    close: closeDeleteOffice,
    content: contentDeleteOffice
  } = useDialog({
    dialog_id: 'chiudiUfficio'
  });

  const {
    isOpen: isOpenPermanentDeleteOffice,
    close: closePermanentDeleteOffice,
    content: contentPermanentDeleteOffice
  } = useDialog({
    dialog_id: 'chiudiUfficioDefinitivamente'
  });

  const {
    isOpen: isOpenReopenOffice,
    close: closeReopenOffice,
    content: contentReopenOffice
  } = useDialog({
    dialog_id: 'riapriUfficio'
  });

  const {
    isOpen: isOpenBlockOffice,
    close: closeBlockOffice,
    content: contentBlockOffice
  } = useDialog({
    dialog_id: 'bloccaUfficio'
  });

  const [deleteOffice, { isLoading: isLoadingDeleteOffice }] =
    useDeleteApiOfficeByOfficeIdMutation();

  const onDeleteOffice = () => {
    deleteOffice({
      officeId: contentDeleteOffice?.id
    })
      .then(() => {
        toast.success(dictionary.get('ufficioChiuso'));
      })
      .catch(() => {
        toast.error(dictionary.get('errore'));
      });

    closeDeleteOffice();
  };

  const [permanentDeleteOffice, { isLoading: isLoadingPermanentDeleteOffice }] =
    useDeleteApiOfficeDeleteByOfficeIdPermanentMutation();

  const onPermanentDeleteOffice = () => {
    permanentDeleteOffice({
      officeId: contentDeleteOffice?.id
    })
      .then(() => {
        toast.success(dictionary.get('ufficioChiusoDefinitivamente'));
      })
      .catch(() => {
        toast.error(dictionary.get('errore'));
      });

    closeDeleteOffice();
  };

  const [reopenOffice, { isLoading: isLoadingReopenOffice }] =
    usePutApiOfficeOpenByOfficeIdMutation();

  const onReopenOffice = () => {
    reopenOffice({
      officeId: contentDeleteOffice?.id
    })
      .then(() => {
        toast.success(dictionary.get('ufficioRiaperto'));
      })
      .catch(() => {
        toast.error(dictionary.get('errore'));
      });

    closeReopenOffice();
  };

  const [updateOffice, { isLoading: isLoadingBlock }] =
    usePutApiOfficeByOfficeIdMutation();

  const onBlockOffice = () => {
    const blocked = officeData?.blocked;
    updateOffice({
      officeId: officeData?.id,
      officeInput: {
        blocked: !blocked
      }
    })
      .then(() => {
        toast.success(
          dictionary.get(blocked ? 'ufficioSbloccato' : 'ufficioBloccato')
        );
      })
      .catch(() => {
        toast.error(dictionary.get('errore'));
      });

    closeBlockOffice();
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <OfficeHeader />
      <UtentiUfficio />
      <Drawer
        title={dictionary.get('modificaUfficio')}
        onClose={() => {
          setDefaultValues({ default_values: null });
          closeEdit();
        }}
        open={isOpenEdit}
      >
        <Ufficio drawer_id="modificaUfficio" />
      </Drawer>
      <DeleteDialog
        title={dictionary.get('chiudiUfficio')}
        bodyText={dictionary.get('confermaChiudiUfficio', {
          name: contentDeleteOffice?.name || ''
        })}
        close={closeDeleteOffice}
        isOpen={isOpenDeleteOffice}
        onDelete={onDeleteOffice}
        isLoading={isLoadingDeleteOffice}
      />
      <DeleteDialog
        title={dictionary.get('chiudiUfficioDefinitivamente')}
        bodyText={dictionary.get('confermaChiudiUfficioDefinitivamente', {
          name: contentPermanentDeleteOffice?.name || ''
        })}
        close={closePermanentDeleteOffice}
        isOpen={isOpenPermanentDeleteOffice}
        onDelete={onPermanentDeleteOffice}
        isLoading={isLoadingPermanentDeleteOffice}
      />
      <SaveDialog
        title={dictionary.get('riapriUfficio')}
        bodyText={dictionary.get('confermaRiapriUfficio', {
          name: contentReopenOffice?.name || ''
        })}
        close={closeReopenOffice}
        isOpen={isOpenReopenOffice}
        onSave={onReopenOffice}
        isLoading={isLoadingReopenOffice}
      />
      <SaveDialog
        title={dictionary.get(
          officeData?.blocked ? 'sbloccaUffico' : 'bloccaUffico'
        )}
        bodyText={dictionary.get(
          officeData?.blocked
            ? 'confermaSbloccaUfficio'
            : 'confermaBloccaUfficio',
          {
            name: contentBlockOffice?.name || ''
          }
        )}
        close={closeBlockOffice}
        isOpen={isOpenBlockOffice}
        onSave={onBlockOffice}
        isLoading={isLoadingBlock}
      />
      <Drawer
        title={dictionary.get('cronologia', {
          name: officeData?.name
        })}
        onClose={closeCronologia}
        open={isOpenCronologia}
      >
        <CronologiaUfficio />
      </Drawer>
    </Container>
  );
};
