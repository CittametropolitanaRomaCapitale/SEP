import { dictionary } from '../../dictionary';
import { useProtocolloFormData } from './useProtocolloFormData';

export const useProtocolloService = () => {
  const metodiSpedizionePecPeo = ['Pec', 'Email'];
  const registrazioniNoTracciabilita = ['Entrata', 'Uscita'];
  const {
    getMetodiSpedizione,
    getPecPeo
  } = useProtocolloFormData();
  
  const pecPeoSelected = (metodoSpedizione) => (metodiSpedizionePecPeo.includes(metodoSpedizione));

  const getMetododiSpedizioneList = (tipoRegistrazione) => registrazioniNoTracciabilita.includes(tipoRegistrazione)
    ? getMetodiSpedizione().filter(m => m !== dictionary.get('metodoDiSpedizioneTracciabilita'))
    : getMetodiSpedizione()

  const getPecPeoList = (metodoSpedizione, readMode, indirizzoPecPeo) => getPecPeo(metodoSpedizione, readMode, indirizzoPecPeo)

  return {
    getMetododiSpedizioneList,
    pecPeoSelected,
    getPecPeoList
  };
};
