import { useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../dictionary';
import { AllegatoTable } from '../../../../protocollo/allegati/hooks/useAllegatiService';
import { useHTTPRequests } from '../../../../../utils/network_utilities';

export type DeleteFileProps = {
  allegato?: AllegatoTable
  onDelete?: (data?: any) => void;
  onError?: (data?: any) => void;
};

export const useDeleteDocumento = () => {
  const [deleting, setDeleting] = useState(false);
  const { deleteRequest } = useHTTPRequests();

  const deleteDocumento = (props: DeleteFileProps) => {
    setDeleting(true);
    if (props?.allegato?.idAllegato) {
      const urlDelete = `${process.env.NEXT_PUBLIC_API_URL}/allegato/elimina/titolario/${props?.allegato?.idAllegato}`

      deleteRequest(
        urlDelete,
        ({ data, error }) => {
          setDeleting(false);
          if (data) {
            toast.success(dictionary.get('deleteDocumentoOK'));
            props?.onDelete?.(data);
          }
          if (error) {
            toast.error(dictionary.get('deleteDocumentoKO'));
            props?.onError?.(data);
          }
        }
      );
    }
    else {
      toast.error(dictionary.get('deleteDocumentoKO'));
      setDeleting(false);
    }
  }


  return { deleteDocumento, deleting };
};
