import { useEffect, useState } from 'react';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  ProtocolloInputInput,
  TipologiaRubrica,
  Tag,
  AnagraficaDto,
  MetodoSpedizione,
  ReferenteOutputDto
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../ricerca_referenti/dictionary';
import { LabelValue } from './useProtocolloFormData';
import { RicercaReferenti } from '../ricerca_referenti/RicercaReferenti';
import { useTable } from '../../../../store/table/useTable';
import { GetDataReferentiProvider } from '../../../../hooks/useDataReferenti';

export type ProtocolloForm = ProtocolloInputInput & {
  flagTag: boolean;
  destinatariCompetenza: LabelValue[];
  destinatariConoscenza: LabelValue[];
  formTagList: Array<{ label: string; value: Tag }>;
};

export const useDestinatariProtocolloForm = (
  readMode,
  tipoRegistrazioneSel,
  metodoSpedizioneSel,
  formMethod,
  isFlagTag
) => {
  const [openSearchDestinatariCompetenza, setOpenSearchDestinatariCompetenza] =
    useState(false);
  const [openSearchDestinatariConoscenza, setOpenSearchDestinatariConoscenza] =
    useState(false);

  const [tipoRicercaIpaConoscenza, setTipoRicercaIpaConoscenza] =
    useState(null);
  const [tipoRicercaIpaCompetenza, setTipoRicercaIpaCompetenza] =
    useState(null);
  const [ipaSelectedCodAoo, setIpaSelectedCodAoo] = useState(null);
  const [ipaSelectedCodAmm, setIpaSelectedCodAmm] = useState(null);

  const [isInadConoscenza, setIsInadConoscenza] = useState(false);
  const [isInadCompetenza, setIsInadCompetenza] = useState(false);
  const [tipologiaRubrica, setTipologiaRubrica] = useState(
    TipologiaRubrica.AnagraficaInterna
  );

  const [contattoAggiuntoCompetenza, setContattoAggiuntoCompetenza] = useState(
    []
  );
  const [contattoAggiuntoConoscenza, setContattoAggiuntoConoscenza] = useState(
    []
  );
  const handleContattoSaved = (
    contatto: ReferenteOutputDto,
    tipo: 'competenza' | 'conoscenza'
  ) => {
    if (tipo === 'competenza') {
      setContattoAggiuntoCompetenza([contatto]);
    } else {
      setContattoAggiuntoConoscenza([contatto]);
    }
  };

  useEffect(() => {
    if (contattoAggiuntoCompetenza?.length > 0) {
      let contattiAggiunti = formMethod.getValues('destinatariCompetenza');
      if (contattiAggiunti === null) contattiAggiunti = [];
      formMethod.setValue('destinatariCompetenza', [
        ...contattiAggiunti, 
        contattoAggiuntoCompetenza[0]
      ]);
    }
  }, [contattoAggiuntoCompetenza]);
  useEffect(() => {
    if (contattoAggiuntoConoscenza?.length > 0) {
      let contattiAggiunti = formMethod.getValues('destinatariConoscenza');
      if (contattiAggiunti === null) contattiAggiunti = [];
      formMethod.setValue('destinatariConoscenza', [
        ...contattiAggiunti,
        contattoAggiuntoConoscenza[0]
      ]);
    }
  }, [contattoAggiuntoConoscenza]);

  const { setSearch } = useTable({
    table_id: 'ricercaReferenti'
  });

  // Resetta tutti i dati della ricerca quando si chiude il dialog
  const resetSearchState = () => {
    setSearch('');
    setTipoRicercaIpaCompetenza(null);
    setTipoRicercaIpaConoscenza(null);
    setIsInadCompetenza(false);
    setIsInadConoscenza(false);
    setIpaSelectedCodAoo(null);
    setIpaSelectedCodAmm(null);
    setTipologiaRubrica(TipologiaRubrica.AnagraficaInterna);
  };

  const handleSearchCloseCompetenza = () => {
    setOpenSearchDestinatariCompetenza(false);
    resetSearchState();
  };

  const handleSearchCloseConoscenza = () => {
    setOpenSearchDestinatariConoscenza(false);
    resetSearchState();
  };

  const handleAddItems = (name, items, usePeoInsteadOfPec) => {
    const currentValue = formMethod.getValues(name) || [];

    // Filtra gli elementi che non sono già inseriti nella lista destinatari
    const filteredNewItems = items.filter(
      (newItem) =>
        !currentValue.some(
          (currentItem) => currentItem.idDestinatario === newItem.idDestinatario
        )
    );

    // Filtra gli elementi che non sono duplicati nella lista della nuova selezione
    const uniqueNewItems = filteredNewItems.filter(
      (newItem, index, self) =>
        index ===
        self.findIndex((item) => item.idDestinatario === newItem.idDestinatario)
    );

    
    // Se ci sono nuovi destinatari li aggiunge
    if (uniqueNewItems.length > 0) {

      const newItemsToAdd = [];
      for(let i=0;i<uniqueNewItems.length;i++) {
        const newItemToAdd = Object.assign({}, uniqueNewItems[i]);

        console.log(uniqueNewItems[i], newItemToAdd);
        if (newItemToAdd.tipo === 'anagrafica_interna') {
          let labelToShow = newItemToAdd.ragioneSociale;
          if (newItemToAdd.cfPiva) labelToShow += " " + newItemToAdd.cfPiva;
          
          if (metodoSpedizioneSel == MetodoSpedizione.Pec) 
            labelToShow += " (" + (usePeoInsteadOfPec ?  newItemToAdd.email : newItemToAdd.pec) + ")";
          else if (metodoSpedizioneSel == MetodoSpedizione.Email) 
            labelToShow += " (" + newItemToAdd.email + ")";
  
          if (newItemToAdd.indirizzo) labelToShow += " - " + newItemToAdd.indirizzo;
          if (newItemToAdd.citta) labelToShow += " - " + newItemToAdd.citta;
          if (newItemToAdd.cap) labelToShow += " - " + newItemToAdd.cap;
  
          newItemToAdd.label = labelToShow;
          newItemToAdd.usePeoForSendEmail = usePeoInsteadOfPec;
        }
        newItemsToAdd.push(newItemToAdd); 
      }
      const updatedValue = [...currentValue, ...newItemsToAdd];

      //const updatedValue = [...currentValue, ...uniqueNewItems];
      formMethod.setValue(name, updatedValue);
      formMethod.clearErrors('destinatariCompetenza');
    }
  };

  const handleTabChanged = (tab: string) => {
    setSearch(''); // Resetta la ricerca ogni volta che cambiamo tab
    setTipoRicercaIpaCompetenza(tab === 'ipa' ? 'enti' : null); // Imposta il tipo di ricerca IPA per la tab selezionata (competenza)
    setTipoRicercaIpaConoscenza(tab === 'ipa' ? 'enti' : null); // Imposta il tipo di ricerca IPA per la tab selezionata (conoscenza)
    setIsInadCompetenza(tab === 'inad'); // Imposta se è INAD per la tab selezionata (competenza)
    setIsInadConoscenza(tab === 'inad'); // Imposta se è INAD per la tab selezionata (conoscenza)

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

  const structure: BaseInputProps<ProtocolloForm>[] = [
    {
      type: 'searchable-textField',
      name: 'destinatariCompetenza',
      required: !readMode && !isFlagTag,
      title: dictionary.get('rubrica'),
      label: dictionary.get('destinatariCompetenza'),
      disabled:
        readMode ||
        tipoRegistrazioneSel === undefined ||
        metodoSpedizioneSel === undefined,
      componentProps: {
        multiple: true,
        getOptionLabel: (item) => item?.label ?? '',
        searchBody: (
          <GetDataReferentiProvider
            tipoRegistrazione={tipoRegistrazioneSel}
            metodoSpedizione={metodoSpedizioneSel}
            tipoRicercaIPA={tipoRicercaIpaCompetenza}
            isInad={isInadCompetenza}
            ipaSelectedCodAmm={ipaSelectedCodAmm}
            ipaSelectedCodAoo={ipaSelectedCodAoo}
            tipologiaRubrica={tipologiaRubrica}
          >
            <RicercaReferenti
              tipoRegistrazione={tipoRegistrazioneSel}
              tipoRicercaIpa={tipoRicercaIpaCompetenza}
              metodoSpedizione={metodoSpedizioneSel}
              onAddItems={(item, usePeoInsteadOfPec) =>
                handleAddItems('destinatariCompetenza', item, usePeoInsteadOfPec)
              }
              onSearchClose={handleSearchCloseCompetenza}
              onTabChanged={(tab) => handleTabChanged(tab)}
              onIpaTriggerRicercaEnti={() => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(null);
                setTipoRicercaIpaCompetenza('enti');
                setSearch('');
              }}
              onIpaTriggerRicercaAOO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpaCompetenza('aoo');
                setSearch('');
              }}
              onIpaTriggerRicercaUO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpaCompetenza('uo');
                setSearch('');
              }}
              onContattoSaved={(contatto) =>
                handleContattoSaved(contatto, 'competenza')
              }
            />
          </GetDataReferentiProvider>
        ),
        searchOpen: openSearchDestinatariCompetenza,
        onSearchOpen: () => setOpenSearchDestinatariCompetenza(true),
        onSearchClose: handleSearchCloseCompetenza,
        fullScreen: false
      }
    },
    {
      type: 'searchable-textField',
      name: 'destinatariConoscenza',
      required: false,
      title: dictionary.get('rubrica'),
      label: dictionary.get('destinatariConoscenza'),
      disabled:
        readMode ||
        tipoRegistrazioneSel === undefined ||
        metodoSpedizioneSel === undefined,
      componentProps: {
        multiple: true,
        searchBody: (
          <GetDataReferentiProvider
            tipoRegistrazione={tipoRegistrazioneSel}
            metodoSpedizione={metodoSpedizioneSel}
            tipoRicercaIPA={tipoRicercaIpaConoscenza}
            isInad={isInadConoscenza}
            ipaSelectedCodAmm={ipaSelectedCodAmm}
            ipaSelectedCodAoo={ipaSelectedCodAoo}
            tipologiaRubrica={tipologiaRubrica}
          >
            <RicercaReferenti
              tipoRegistrazione={tipoRegistrazioneSel}
              metodoSpedizione={metodoSpedizioneSel}
              tipoRicercaIpa={tipoRicercaIpaConoscenza}
              onAddItems={(item, usePeoInsteadOfPec) =>
                handleAddItems('destinatariConoscenza', item, usePeoInsteadOfPec)
              }
              onSearchClose={handleSearchCloseConoscenza}
              onTabChanged={(tab) => handleTabChanged(tab)}
              onIpaTriggerRicercaEnti={() => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(null);
                setTipoRicercaIpaConoscenza('enti');
                setSearch('');
              }}
              onIpaTriggerRicercaAOO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpaConoscenza('aoo');
                setSearch('');
              }}
              onIpaTriggerRicercaUO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpaConoscenza('uo');
                setSearch('');
              }}
              onContattoSaved={(contatto) =>
                handleContattoSaved(contatto, 'conoscenza')
              }
            />
          </GetDataReferentiProvider>
        ),
        searchOpen: openSearchDestinatariConoscenza,
        onSearchOpen: () => setOpenSearchDestinatariConoscenza(true),
        onSearchClose: handleSearchCloseConoscenza,
        fullScreen: false
      }
    }
  ];

  return { structure };
};
