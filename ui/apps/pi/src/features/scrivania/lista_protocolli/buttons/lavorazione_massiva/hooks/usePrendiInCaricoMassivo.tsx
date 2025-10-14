import { ProtocolloBaseFragment, usePresaInCaricoProtocolloMassivaMutation } from "@cmrc/services/src/app/piapi/generated";
import toast from "@cmrc/ui/components/Toast";
import { useOffice } from "@cmrc/auth/useOffice";
import { useGetQueryProtocolliList } from "../../../hooks/useDataProtocolliList";
import { dictionary } from "../dictionary";

export const usePrendiIncCaricoMassivo = () => {
  const { cdrCode } = useOffice();
  const { refetch } = useGetQueryProtocolliList();
  const [presaInCaricoMassiva, { isLoading: isLoadingPrendiInCarico }] = usePresaInCaricoProtocolloMassivaMutation();

  const prendiInCaricoMassivo = async (selectedProtocolli: ProtocolloBaseFragment[]) => {
    const response = await presaInCaricoMassiva({
      numbers: selectedProtocolli.map(protocollo => protocollo.nProtocollo),
      selectedOffice: cdrCode
    }).unwrap();
    if (response?.presaInCaricoProtocolloMassiva) {
      toast.success(dictionary.get("presaInCaricoMassivaOK"));
      refetch();
    }
  }

  return { prendiInCaricoMassivo, isLoadingPrendiInCarico }
}