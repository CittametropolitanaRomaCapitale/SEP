import { useRouter } from 'next/router';
import { dictionary } from './dictionary';

export const useConfigurazioni = () => {
  const router = useRouter();

  const changeTab = (event: any, value: string) =>
    router.push(
      `/configurazioni${value !== 'gestione-pec-peo' ? `/${value}` : ''}`
    );

  const tabs = [
    {
      label: dictionary.get('configuirazioniTab1'),
      value: 'gestione-pec-peo'
    },
    {
      label: dictionary.get('configuirazioniTab2'),
      value: 'gestione-raccomandata-online'
    },
    {
      label: dictionary.get('configuirazioniTab3'),
      value: 'conservazione-sostitutiva'
    },
    {
      label: dictionary.get('configuirazioniTab4'),
      value: 'gestione-tag'
    },
    {
      label: dictionary.get('configuirazioniTab5'),
      value: 'gestione-livello-fascicolazione'
    },
    {
      label: dictionary.get('configuirazioniTab6'),
      value: 'gestione-risposta-automatica-pec'
    }
  ];

  return { changeTab, tabs };
};
