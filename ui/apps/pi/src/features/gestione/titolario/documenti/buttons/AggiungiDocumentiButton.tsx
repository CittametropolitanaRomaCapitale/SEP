import * as React from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TitolarioOutputDto, useGetAllExtensionsQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { LoadingButton } from '@mui/lab';
import toast from '@cmrc/ui/components/Toast';
import { bytesToSize } from '@cmrc/ui/utils/bytes-to-size';
import { shortenFilename } from '@cmrc/ui/utils/string-utils';
import { useOffice } from '@cmrc/auth/useOffice';
import { dictionary } from '../dictionary';
import { useUploadDocumento } from '../hooks/useUploadDocumento';
import { useGetDocumentiTitolarioListQuery } from '../hooks/useDataDocumentiFascicolo';
import { configurazioniTitolario } from '../../../../../hooks/useConfigurazioniFormProtocollo';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export type AggiungiDocumentiProps = {
  disabled: boolean;
  itemSelected: TitolarioOutputDto;
}

export const AggiungiDocumentiButton: FCC<AggiungiDocumentiProps> = ({
  disabled,
  itemSelected,
}) => {
  const { cdrCode } = useOffice();
  const { uploadDocumento, uploading } = useUploadDocumento();
  const { refetch } = useGetDocumentiTitolarioListQuery();
  const { maxUploadSize, maxLengthFilenameAllegato } = configurazioniTitolario()
  const { data } = useGetAllExtensionsQuery()

  const resertFileInput = (event) => {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = '';
  }

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const idTitolario = itemSelected?.id;
    const fileList = Array.from(event.target.files || []);

    fileList.forEach(async (file: File) => {
      let errorMessage = '';

      if (file.size > maxUploadSize) {
        errorMessage = `Impossibile caricare il documento "${shortenFilename(file?.name, 20)}", (dimensione max ${bytesToSize(maxUploadSize)})`;
      } else if (file.name.length > maxLengthFilenameAllegato) {
        errorMessage = `Impossibile caricare il documento "${shortenFilename(file?.name, 20)}", (lunghezza max ${maxLengthFilenameAllegato} caratteri)`;
      }

      if (errorMessage) {
        toast.error(errorMessage);
        resertFileInput(event);
        return;
      }

      uploadDocumento({
        fileName: file?.name,
        apiUrl: `${process.env.NEXT_PUBLIC_API_URL}/allegato/upload/titolario`,
        meta: [
          { name: 'idTitolario', value: idTitolario },
          { name: 'fileStream', value: file },
          { name: 'filename', value: file?.name },
          { name: 'size', value: file?.size },
          { name: 'selectedOffice', value: cdrCode }
        ],
        onUpload: () => {
          refetch();
          resertFileInput(event);
        },
        onError: () => { resertFileInput(event); },
      });
    });
  }

  return (
    <LoadingButton
      loading={uploading}
      component="label"
      role={undefined}
      disabled={disabled}
      variant="contained"
      tabIndex={-1}
      sx={{ mr: 1 }}
      size='small'
      startIcon={<CloudUploadIcon />}
    >
      {dictionary.get('aggiungiDocumenti')}
      <VisuallyHiddenInput
        type="file"
        onChange={onUpload}
        multiple
        accept={data?.getAllExtensions.toString()}
      />
    </LoadingButton>
  );
}
