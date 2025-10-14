import { TitolarioOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { useRicercaTitolario } from '../../../../protocollo/protocollo_form/hooks/useRicercaTitolario';
import { dictionary } from '../../dictionary';

export const useTitolarioButtons = () => {
  const { getSezionePadre } = useRicercaTitolario();

  const addTitolarioSetionTitle = (breadcrumb: TitolarioOutputDto[]) => {
    const titolarioSection = getSezionePadre(breadcrumb);
    switch (titolarioSection?.tipologia) {
      case 'Titoli':
        return dictionary.get('titolo');
      case 'Titolo':
        return dictionary.get('sezione');
      case 'Sezione':
        return dictionary.get('sottoSezione');
      case 'SottoSezione':
      case 'FascicoloLv1':
      case 'FascicoloLvN':
        return dictionary.get('fascicolo');
      default:
        break;
    }
    return undefined;
  };

  const editTitolarioSetionTitle = (itemSelected: TitolarioOutputDto) => {
    if (['FascicoloLv1', 'FascicoloLvN'].includes(itemSelected?.tipologia)) {
      return dictionary.get('fascicolo');
    }
    return itemSelected?.tipologia;
  };

  return {
    addTitolarioSetionTitle,
    editTitolarioSetionTitle
  };
};
