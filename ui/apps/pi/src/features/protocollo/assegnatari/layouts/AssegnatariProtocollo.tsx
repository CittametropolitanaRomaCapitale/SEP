import { AssegnatariProtocolloSkeleton } from "../../../../components/SkeletonLayouts/AssegnatariProtocolloSkeleton";
import { Assegnatari } from "../Assegnatari";
import { useGetQueryReferentiProtocollo } from "../hooks/useDataReferentiProtocollo";

export const AssegnatariProtocollo = () => {
  const { isLoading } = useGetQueryReferentiProtocollo();

  return (
    isLoading ? <AssegnatariProtocolloSkeleton /> : <Assegnatari />
  )
}