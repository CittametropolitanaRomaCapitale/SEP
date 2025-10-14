import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader";
import { RaccomandataWebConfigForm } from "./RaccomandataWebConfigForm";
import { useGetQueryRaccomandataConfig } from "./hooks/useDataConfigRaccomandata";
import { dictionary } from "./dictionary";
import LoadingContainer from "../../../../../components/LoadingContainer";

export const RaccomandataWebConfig = () => {
  const { data, isLoading } = useGetQueryRaccomandataConfig();
  
  return (
    <LoadingContainer isLoading={isLoading}>
      <TableExternalHeader
        title={dictionary.get('headerTitle')} />
      <RaccomandataWebConfigForm initialData={data?.getLoginRaccomandata} />
    </LoadingContainer>
  );
};