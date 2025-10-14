import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@cmrc/ui/components/Drawer';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid';
import toast from '@cmrc/ui/components/Toast';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { useTable } from '../../../store/table/useTable';
import { RicercaAvanzataUtentiDrawer } from './RicercaAvanzataUtentiDrawer';
import { dictionary } from './dictionary';
import { useState } from 'react';
import { useHTTPRequests } from '../../../utils/network_utilities';

export const RicercaAvanzataUtentiButtons = () => {
    const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
        drawer_id: 'ricercaAvanzataUtentiDrawer'
    });
    const { tableData, setFilters } = useTable({
        table_id: 'listaUtenti'
    });
    const { downloadRequest } = useHTTPRequests();


    const [isExporting, setIsExporting] = useState(false);
    const exportResults = async () => {
        setIsExporting(true);

        let urlExport = `${process.env.NEXT_PUBLIC_SSO_API_URL}/api/auth/users/export?`;
        urlExport += 'page=0';
        urlExport += '&size=10000';
        urlExport += '&by=' + (tableData?.sort?.by ?? 'username');
        urlExport += '&desc=' + (tableData?.sort?.desc ? 'true' : 'false');
        
        if (tableData?.search) urlExport += '&search=' + tableData?.search;
        
        if (tableData?.filters?.enabled && tableData?.filters?.enabled > 0) {
            urlExport += '&enabledFlag=' + tableData?.filters?.enabled;   
        }
        
        if (tableData?.filters?.advancedFilters?.application?.value) urlExport += '&appId=' + tableData?.filters?.advancedFilters?.application?.value;
        if (tableData?.filters?.advancedFilters?.roles) {
            for(let i=0;i<tableData?.filters?.advancedFilters?.roles.length;i++) {
                urlExport += '&roles=' + tableData?.filters?.advancedFilters?.roles[i].value;
            }
        }
        if (tableData?.filters?.advancedFilters?.types) {
            for(let i=0;i<tableData?.filters?.advancedFilters?.types.length;i++) {
                urlExport += '&types=' + tableData?.filters?.advancedFilters?.types[i].value;
            }
        }
        if (tableData?.filters?.advancedFilters?.officeIds) {
            for(let i=0;i<tableData?.filters?.advancedFilters?.officeIds.length;i++) {
                urlExport += '&officeIds=' + tableData?.filters?.advancedFilters?.officeIds[i].value;
            }
        }

        console.log(urlExport, tableData);
        const downloadResponse = await downloadRequest({
          url: urlExport,
          filename: 'utenti.xls',
          forceDownload: true,
        });
        if (downloadResponse?.ok) {
            toast.success(dictionary.get('downloadExportUtentiOK'));
        } else {
            toast.error(dictionary.get('downloadExportUtentiKO'));
        }
        setIsExporting(false);
    };
    
    return (
        <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'right' }}>
            <LoadingButton
                loading={isExporting}
                onClick={exportResults}
                size="small"
                variant="outlined"
                title={dictionary.get('exportTitle')}
                sx={{mr: 1}}
                >
                {dictionary.get('exportAsXls')}
            </LoadingButton>
            {!tableData?.filters?.advancedFilters && (
                <Button
                    onClick={openDrawer}
                    startIcon={<SearchIcon />}
                    sx={{ mr: 1 }}
                    size="small"
                    variant="contained"
                >
                    {dictionary.get('ricercaAvanzata')}
                </Button>
            )}
            {!!tableData?.filters?.advancedFilters && (
                <>
                    <Button
                        startIcon={<CancelIcon />}
                        sx={{ mr: 1 }}
                        size="small"
                        variant="contained"
                        onClick={() =>
                            setFilters({ advancedFilters: undefined })
                        }
                    >
                        {dictionary.get('annullaRicercaAvanzata')}
                    </Button>
                    <Button
                        onClick={openDrawer}
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                        size="small"
                        variant="contained"
                    >
                        {dictionary.get('modificaRicercaAvanzata')}
                    </Button>
                </>
            )}

            <Drawer
                title={dictionary.get('ricercaAvanzata')}
                onClose={closeDrawer}
                open={isOpenDrawer}
            >
                <RicercaAvanzataUtentiDrawer />
            </Drawer>
        </Grid>
    );
};
