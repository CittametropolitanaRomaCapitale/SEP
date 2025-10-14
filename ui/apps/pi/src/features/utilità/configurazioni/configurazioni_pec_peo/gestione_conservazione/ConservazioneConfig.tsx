import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader";
import LoadingContainer from "../../../../../components/LoadingContainer";
import { useGetQueryConservazioneConfig } from "./hooks/useDataConservazioneConfig";
import { ConservazioneConfigForm } from "./forms/ConservazioneConfigForm";
import { dictionary } from "./dictionary";

export const ConservazioneConfig = () => {
  const { data, isLoading } = useGetQueryConservazioneConfig();
  
  return (
    <LoadingContainer isLoading={isLoading}>
      <TableExternalHeader
        title={dictionary.get('headerTitle')} />
      <ConservazioneConfigForm initialData={data?.getLoginConservazione} />
    </LoadingContainer>
  );
};