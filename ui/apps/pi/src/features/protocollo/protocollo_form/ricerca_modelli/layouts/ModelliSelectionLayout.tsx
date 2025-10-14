import { FCC } from '@cmrc/types/FCC';
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { ModelloAutomaticoDto, useGetModelliAutomaticiByCdrCodeQuery } from '@cmrc/services/src/app/piapi/generated';
import { useOffice } from '@cmrc/auth/useOffice';
import Select from '@cmrc/ui/form/FormComponents/Select';
import { dictionary } from '../dictionary';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const ModelliSelectionLayout: FCC<{
  onChangeModello?: any;
}> = ({ onChangeModello }) => {
  const { cdrCode } = useOffice();
  const [selectedModello, setSelectedModello] = useState('');
  const [modelli, setModelli] = useState([]);

  const { isLoading, data }  = useGetModelliAutomaticiByCdrCodeQuery({ selectedOffice: cdrCode });
  
  useEffect(() => {
    if (!isLoading) {
        const modelliOptions: ModelloAutomaticoDto[] = [{
            "nomeModello": dictionary.get('nessunModello'), 
            'id': '',
            'oggettoProtocollo': null,
            'cdrCode': null,
            'metodoSpedizione': null,
            'tipoRegistrazione': null,
            'titolario': null,
            'hierarchyStringTitolario': ''
        }];
        for(let i=0;i<data?.getModelliAutomaticiByCdrCode.length;i++) {
            modelliOptions.push(data?.getModelliAutomaticiByCdrCode[i]);
        }
        setModelli(modelliOptions);
    }
  }, [isLoading]);

  const handleChangeModello = (e) => {
    setSelectedModello(e.target.value);
  };
  const handleSelectModello = (e) => {
    const selModelloObject = modelli.filter((item) => item.id == selectedModello);
    onChangeModello(selModelloObject[0]);
  };
  return (
        <Grid item sx={{p:0}}>
          <Grid sx={{ display: 'flex', justifyContent: 'right',m:0,p:0 }}>
            <Select
              sx={{paddingRight:3, width: 2/3}}
                size='small'
                name='select-modello'
                label={dictionary.get('cambiaModello')}
                onChange={handleChangeModello}
                options={modelli.map(item => { return {"value": item.id, "label": item.nomeModello} })}
                value={selectedModello}
            >
            </Select>
            <Button
                variant='outlined'
                onClick={handleSelectModello} 
                size="small"
                disabled={false}
                title={dictionary.get('selezionaModelloTitle')}
                sx={{width: 1/3}}
                >
                    {dictionary.get('selezionaModello')}
            </Button>
          </Grid>
        </Grid>
  );
};

export default ModelliSelectionLayout;


