import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';
import { ScaricaDocumentoButton } from '../../../../gestione/titolario/documenti/buttons/ScaricaDocumentoButton';
import { AllegatoTable } from '../../../allegati/hooks/useAllegatiService';
import { useGetTotalSizeFromBytes } from '../../../../../utils/sizing_utilities';

export const useInviaPecPeoAllegatiTable = () => {

  const columns: ColumnDef<AllegatoTable>[] = [
    {
      accessorKey: 'nome',
      header: dictionary.get('nomeFile'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.nome}
          sx={{ width: 500 }}
        />
      )
    },
    {
      accessorKey: 'oggetto',
      size: 250,
      header: dictionary.get('descrizione'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.oggetto}
          sx={{ width: 250 }}
        />
      )
    },
    {
      accessorKey: 'dimensione',
      size: 60,
      header: dictionary.get('dimensione'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={useGetTotalSizeFromBytes(original?.dimensione, 1)}
          sx={{ width: 60 }}
        />
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <ScaricaDocumentoButton documento={original} />
      )
    }
  ];

  return {
    columns
  };
};
