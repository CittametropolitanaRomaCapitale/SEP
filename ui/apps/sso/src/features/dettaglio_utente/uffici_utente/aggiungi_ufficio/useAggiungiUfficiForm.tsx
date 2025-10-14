import {
  PostApiOfficeByUserIdOfficesApiArg,
  SSOApi as api
} from '@cmrc/services/sso';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { useDialog } from '../../../../store/dialog/useDialog';
import { useGetUfficiUtente } from '../../useGetUfficiUtente';
import { dictionary } from '../dictionary';
import { CreaUfficio } from './CreaUfficio';

export const useAggiungiUfficioForm = () => {
  const [trigger] = api.endpoints.getApiOffice.useLazyQuery();

  const { data: dataUserOffices } = useGetUfficiUtente();

  const { isOpen, close, open } = useDialog({
    dialog_id: 'creaUfficio'
  });

  const structure: BaseInputProps<
    PostApiOfficeByUserIdOfficesApiArg & { office }
  >[] = [
    {
      type: 'creatable-select-autocomplete',
      name: 'office',
      required: true,
      componentProps: {
        multiple: true
      },
      label: dictionary.get('uffici'),
      query: (value) =>
        trigger({
          search: value,
          by: 'name',
          desc: false
        }),
      optionMapping: ({ data: { data: totalOffices } }) => {
        const uniqueOffices = totalOffices.filter(
          (office) =>
            !dataUserOffices?.data?.some(
              (userOffice) => office.id === userOffice.office_id
            )
        );
        return uniqueOffices?.map((el) => ({
          label: el.name,
          value: el.id
        }));
      },
      onSelect: (newValue, setval, setValue) => {
        if (
          newValue.length >= 1 &&
          (newValue[newValue.length - 1].isNew ||
            typeof newValue[newValue.length - 1] === 'string')
        ) {
          setValue(
            'default_name',
            typeof newValue[newValue.length - 1] === 'string'
              ? newValue[newValue.length - 1]
              : newValue[newValue.length - 1].value
          );
          open();
        } else {
          setval(newValue);
          setValue('office', newValue);
        }
      },
      dialogComponent: (getValues, setval, setValue) => (
        <CreaUfficio
          isOpen={isOpen}
          close={close}
          getValues={getValues()}
          setval={setval}
          setValue={setValue}
        />
      )
    }
  ];

  return { structure };
};
