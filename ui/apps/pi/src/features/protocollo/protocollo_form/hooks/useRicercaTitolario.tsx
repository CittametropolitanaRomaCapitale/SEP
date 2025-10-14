import {
  TipologiaTitolario,
  TitolarioOutputDto
} from '@cmrc/services/src/app/piapi/generated';

export const useRicercaTitolario = () => {
  const getSezionePadre = (breadcrumb?: TitolarioOutputDto[]) =>
    breadcrumb[breadcrumb.length - 1];
  const getTipologia = (tipologiaPadre?: any) => {
    if (tipologiaPadre === TipologiaTitolario.Titolo)
      return TipologiaTitolario.Sezione;

    if (tipologiaPadre === TipologiaTitolario.Sezione)
      return TipologiaTitolario.SottoSezione;

    if (tipologiaPadre === TipologiaTitolario.SottoSezione)
      return TipologiaTitolario.FascicoloLv1;

    if (
      tipologiaPadre === TipologiaTitolario.FascicoloLv1 ||
      tipologiaPadre === TipologiaTitolario.FascicoloLvN
    )
      return TipologiaTitolario.FascicoloLvN;

    return 'Titolo';
  };

  const isFascicoloLevel = (breadcrumb?: TitolarioOutputDto[]) => {
    const lastItem = getSezionePadre(breadcrumb);
    return ['SottoSezione', 'FascicoloLv1', 'FascicoloLvN'].includes(
      lastItem?.tipologia
    );
  };

  const isSezioneLevel = (breadcrumb?: TitolarioOutputDto[]) => {
    const lastItem = getSezionePadre(breadcrumb);
    return ['Titoli', 'Titolo', 'Sezione'].includes(lastItem?.tipologia);
  };

  const isFascicoloLastLevel = (
    breadcrumb: TitolarioOutputDto[],
    numeroMassimoLivelli: number
  ) => {
    // ricavo il livello della sezione corrente escludendo le prime tre sezioni
    const livelloCorrente = breadcrumb?.length;
    return livelloCorrente - 3 === numeroMassimoLivelli;
  };

  const isDipendenteSection = (breadcrumb?: TitolarioOutputDto[]) => {
    const isDipendente = breadcrumb.find((i) => i?.fascicoloDipendente);
    return !!isDipendente;
  };

  return {
    isFascicoloLevel,
    isSezioneLevel,
    isFascicoloLastLevel,
    getSezionePadre,
    getTipologia,
    isDipendenteSection
  };
};
