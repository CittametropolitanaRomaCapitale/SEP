import { useEffect, useState } from 'react';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  TipologiaRubrica,
  TipoRegistrazione,
  AnagraficaDto,
  ReferenteOutputDto
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../ricerca_referenti/dictionary';
import { RicercaReferenti } from '../ricerca_referenti/RicercaReferenti';
import { useTable } from '../../../../store/table/useTable';
import { GetDataReferentiProvider } from '../../../../hooks/useDataReferenti';
import { ProtocolloForm } from './useDestinatariProtocolloForm';

export const useMittenteProtocolloForm = (
  readMode,
  tipoRegistrazioneSel,
  metodoSpedizioneSel,
  formMethod
) => {
  const [openSearchMittente, setOpenSearchMittente] = useState(false);
  const [tipoRicercaIpa, setTipoRicercaIpa] = useState(null);
  const [ipaSelectedCodAoo, setIpaSelectedCodAoo] = useState(null);
  const [ipaSelectedCodAmm, setIpaSelectedCodAmm] = useState(null);
  const [isInad, setIsInad] = useState(false);
  const isRegistrazioneEntrata =
    tipoRegistrazioneSel === TipoRegistrazione.Entrata;
  const [tipologiaRubrica, setTipologiaRubrica] = useState(
    TipologiaRubrica.AnagraficaInterna
  );
  const [contattoAggiunto, setContattoAggiunto] = useState<ReferenteOutputDto[]>([]);
  const { setSearch } = useTable({
    table_id: 'ricercaReferenti'
  });

  // Resetta tutti i dati della ricerca quando si chiude il dialog
  const resetSearchState = () => {
    setSearch('');
    setTipoRicercaIpa(null);
    setIsInad(false);
    setIpaSelectedCodAoo(null);
    setIpaSelectedCodAmm(null);
    setTipologiaRubrica(TipologiaRubrica.AnagraficaInterna);
  };

  const handleSearchClose = () => {
    setOpenSearchMittente(false);
    resetSearchState();
  };

  const handleTabChanged = (tab: string) => {
    setSearch(''); // Resetta la ricerca ogni volta che cambiamo tab
    setTipoRicercaIpa(tab === 'ipa' ? 'enti' : null); // Imposta il tipo di ricerca IPA per la tab selezionata
    setIsInad(tab === 'inad'); // Imposta se è INAD per la tab selezionata

    switch (tab) {
      case 'anagrafica':
        setTipologiaRubrica(TipologiaRubrica.AnagraficaInterna);
        break;
      case 'gruppi':
        setTipologiaRubrica(TipologiaRubrica.Gruppi);
        break;
      case 'ipa':
        setTipologiaRubrica(TipologiaRubrica.Ipa);
        break;
      default:
        break;
    }
  };

  const handleAddItems = (name, items) => {
    // setto le informazioni del mittente selezionato ([0] unico elemento dell'array)
    formMethod.setValue(name, items[0]);
    formMethod.clearErrors(name);
  };

  const handleContattoSaved = (contatto: ReferenteOutputDto) => {
    setContattoAggiunto([contatto]);
  };
  useEffect(() => {
    if (contattoAggiunto?.length > 0) {
      formMethod.setValue(
        'mittente',
        contattoAggiunto.map((c) => c.ragioneSociale || '')
      );
    }
  }, [contattoAggiunto]);

  const structure: BaseInputProps<ProtocolloForm>[] = [
    {
      type: 'searchable-inputPiMod',
      name: 'mittente',
      value:
        formMethod?.getValues('mittente')?.label ||
        formMethod?.getValues('mittente'),
      title: dictionary.get('rubrica'),
      required: true,
      label: dictionary.get('mittente'),
      disabled:
        readMode ||
        tipoRegistrazioneSel === undefined ||
        metodoSpedizioneSel === undefined ||
        !isRegistrazioneEntrata,
      componentProps: {
        multiple: true,
        searchBody: (
          <GetDataReferentiProvider
            tipoRegistrazione={tipoRegistrazioneSel}
            metodoSpedizione={metodoSpedizioneSel}
            tipoRicercaIPA={tipoRicercaIpa}
            isInad={isInad}
            ipaSelectedCodAmm={ipaSelectedCodAmm}
            ipaSelectedCodAoo={ipaSelectedCodAoo}
            tipologiaRubrica={tipologiaRubrica}
            isMittente
          >
            <RicercaReferenti
              tipoRegistrazione={tipoRegistrazioneSel}
              metodoSpedizione={metodoSpedizioneSel}
              tipoRicercaIpa={tipoRicercaIpa}
              onAddItems={(item) => handleAddItems('mittente', item)}
              onSearchClose={handleSearchClose}
              onTabChanged={(tab) => handleTabChanged(tab)}
              onIpaTriggerRicercaEnti={() => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(null);
                setTipoRicercaIpa('enti');
                setSearch('');
              }}
              onIpaTriggerRicercaAOO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpa('aoo');
                setSearch('');
              }}
              onIpaTriggerRicercaUO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpa('uo');
                setSearch('');
              }}
              isMittente
              onContattoSaved={(contatto) => handleContattoSaved(contatto)}
            />
          </GetDataReferentiProvider>
        ),
        searchOpen: openSearchMittente,
        onSearchOpen: () => setOpenSearchMittente(true),
        onSearchClose: handleSearchClose,
        fullScreen: false
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    }
  ];

  return { structure };
};
