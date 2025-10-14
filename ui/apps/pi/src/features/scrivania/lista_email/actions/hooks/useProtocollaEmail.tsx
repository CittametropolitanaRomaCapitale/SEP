import { useRouter } from 'next/router';
import { PIService } from '@cmrc/services';
import { EmailBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';

export const useProtocollaEmail = () => {
    const { push } = useRouter();
    const [saveProtocolloByEmailMutation] = PIService.useSaveProtocolloByEmailMutation();
    const { tableData } = useTable({
        table_id: 'listaEmail'
    });

    const queryParams = {
        ...tableData?.filters,
        search: tableData?.search,
        page: tableData?.page,
    };

    Object.keys(queryParams).forEach((k) =>
        (queryParams[k] == null || queryParams[k] === '') &&
        delete queryParams[k]
    );

    const protocolla = async (emailData: EmailBaseFragment) => {
        try {
            const response = await saveProtocolloByEmailMutation({ idEmail: emailData?.id }).unwrap();
            if (response?.saveProtocolloByEmail?.id) {
                toast.success(dictionary.get('emailProtocollata'));
                await push({ pathname: '/pec', query: queryParams })
                push(`/protocolli/${response.saveProtocolloByEmail.nProtocollo}`);
            }
        } catch (error) {
            toast.error(`${dictionary.get('emailNonProtocollata')}': '${error}`);
        }
    };

    return { protocolla };

}