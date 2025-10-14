import { FCC } from '@cmrc/types/FCC';
import { useRouter } from 'next/router';
import Dialog from '@cmrc/ui/components/Dialog';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { dictionary } from './dictionary';

export interface ConfermaDatiNonSalvatiProps {
    route?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isOpen?: boolean;
}

const ConfermaDatiNonSalvati: FCC<ConfermaDatiNonSalvatiProps> = ({
    route,
    onConfirm,
    onCancel,
    isOpen,
}) => {
    const router = useRouter();

    const handleCancel = () => {
        if (onCancel)
            onCancel();
    };

    const handleConfirm = () => {
        if (route) {
            router.push(route);
            if (onConfirm)
                onConfirm();
        }
    }

    return (
        <Dialog fullWidth={false} open={isOpen} title={dictionary.get('titleDialog')} onClose={handleCancel}>
            <ConfirmDialog
                message={dictionary.get('messaggioDialogDatiNonSalvati')}
                cancelString={dictionary.get('continuaModificare')}
                confirmString={dictionary.get('procediSenzaSalvare')}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                sx={{ maxWidth: '500px' }}
            />
        </Dialog>
    );
};

export default ConfermaDatiNonSalvati;