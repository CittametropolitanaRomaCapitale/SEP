import { useState } from 'react';
import Divider from '@mui/material/Divider';
import ImportProtocolliAction from './ImportProtocolliAction';
import { ImportProtocolliResults } from './ImportProtocolliResults';
import { Typography } from '@mui/material';
import { dictionary } from './dictionary';

export const EmergenzaLayout = () => {

    const [importResults, setImportResults] = useState([]);

    const handleResults = (results: any) => {
        setImportResults(results);
    };

    return (
    <>
        <Typography
            align='center'
            gutterBottom={true}
            variant='subtitle1'
        >{dictionary.get('importProtocolliDescription')}</Typography>
        <ImportProtocolliAction onResults={handleResults} />
        <Divider />
        <ImportProtocolliResults results={importResults} />
    </>
    );
};
