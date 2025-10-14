import toast from "@cmrc/ui/components/Toast";
import { useHTTPRequests } from "../../../../utils/network_utilities";
import { AllegatoUploadStatuses } from "../../../../utils/types";
import { dictionary } from "../dictionary";
import { AllegatoTable } from "./useAllegatiService";

export const useAllegatiTableOperations = () => {
  const { deleteRequest } = useHTTPRequests();

  const UseDeleteAllegato = (file: AllegatoTable) => {
    if (file.idAllegato != null && !file.isInoltro) {
      deleteRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/allegato/elimina/${file.idAllegato}`,
        ({ data, error }) => {
          if (error) {
            toast.error(dictionary.get('allegatoNonEliminato'));
          } else {
            // toast.success(dictionary.get('allegatoEliminato'));
          }
        }
      );
    }
    if (file.uploadStatus === AllegatoUploadStatuses.IN_PROGRESS) {
      file.abortController.abort();
    }
  };

  return {
    UseDeleteAllegato,
  }
}
