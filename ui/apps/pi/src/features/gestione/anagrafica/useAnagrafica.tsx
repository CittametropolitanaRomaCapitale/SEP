import { useRouter } from 'next/router';
import { dictionary } from './dictionary';

export const useAnagrafica = () => {
  const router = useRouter();

  const changeTab = (event: any, value: string) =>
    router.push(
      `/anagrafica${
        value !== 'anagrafica' ? `/${value}` : ''
      }`
    );

  const tabs = [
    {
      label: dictionary.get('anagraficaTab1'),
      value: 'anagrafica'
    },
    {
      label: dictionary.get('anagraficaTab2'),
      value: 'gruppi'
    }
  ];

  return { changeTab, tabs };
};
