import { useState } from 'react';
import { useRevocaAssegnazioneProtocolloMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useRouter } from 'next/router';
import { useGetQueryStoricoList } from '../../storicizzazione/hooks/useDataStoricoList';
import { useGetQueryReferentiProtocollo } from './useDataReferentiProtocollo';
import { useGetQueryDettaglioProtocollo } from '../../useDataDettaglioProtocollo';

export const useRevocaAssegnazione = (referenteId: string) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [revocaAssegnazioneProtocolloMutation] = useRevocaAssegnazioneProtocolloMutation();
    const {refetch: refetchStorico} = useGetQueryStoricoList();
    const {refetch: refetchAssegnatari} = useGetQueryReferentiProtocollo();
    const {refetch: refetchDettaglio} = useGetQueryDettaglioProtocollo();

    
    const onRevocaAssegnazione = async () => {
        try {
            setLoading(true);
            const response = await revocaAssegnazioneProtocolloMutation({
                referentiProtocolloId: referenteId,
            }).unwrap();

            if (response?.revocaAssegnazioneProtocollo) {
                toast.success('Assegnazione revocata');
                refetchStorico();
                refetchAssegnatari();
                refetchDettaglio();
            }
        } catch (error) {
            setLoading(false);
        }
    };

    return {
        loading,
        onRevocaAssegnazione,
    };
};
