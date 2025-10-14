import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';
import { dictionary } from '../../dictionary';
import { ScaricaDocumentoButton } from '../../../../gestione/titolario/documenti/buttons/ScaricaDocumentoButton';
import { AllegatoTable } from '../../../allegati/hooks/useAllegatiService';

export const useDocumentoRaccomandataTable = () => {

  const columns: ColumnDef<AllegatoTable>[] = [
    {
      accessorKey: 'nome',
      header: dictionary.get('nomeFile'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.nome}
          sx={{ width: 400 }}
        />
      )
    },
    {
      accessorKey: 'oggetto',
      header: dictionary.get('descrizione'),
      enableSorting: true,
      size: 480,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.oggetto}
          sx={{ width: 480 }}
        />
      )
    },
    {
      id: 'actions',
      header: '',
      size: 10,
      cell: ({ row: { original } }) => (
        <ScaricaDocumentoButton documento={original} />
      )
    }
  ];

  return {
    columns
  };
};
