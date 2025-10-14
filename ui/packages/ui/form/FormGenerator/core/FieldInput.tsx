import { forwardRef } from 'react';

import {
  FGCheckbox,
  FGInput,
  FGNumberInput,
  FGTextarea,
  FGRadio,
  FGSelect,
  FGDate,
  FGTime,
  FGDateTime,
  FGSelectAutocomplete,
  FGCreatableSelectAutocomplete,
  FGQuillEditor,
  FGSelectCheckbox,
  FGFileInput,
  FGTableInput,
  FGCurrencyInput,
  FGSearchableInput,
  FGSwitch
} from '../components';

import {
  BaseInputProps,
  CheckboxProps,
  DateProps,
  DateTimeProps,
  FGHookForm,
  GroupProps,
  InputProps,
  NumberInputProps,
  RadioProps,
  SelectAutocompleteProps,
  CreatableSelectAutocompleteProps,
  SelectProps,
  TextareaProps,
  TimeProps,
  QuillEditorProps,
  SelectCheckboxProps,
  FileInputProps,
  TableInputProps,
  CurrencyInputProps,
  SearchableInputProps,
  OverrideRequired,
  SearchableInputPropsPIMod,
  SwitchProps,
  SearchableTextFieldProps
} from './types';
import { FGSearchableInputPiMod } from '../components/FGSearchableInputPIMod';
import { Box } from '@mui/material';
import { FGSearchableTextField } from '../components/FGSearchableTextField';

export const FieldInput = forwardRef<
  unknown,
  FGHookForm<
    OverrideRequired<BaseInputProps<any>> | OverrideRequired<GroupProps<any>>
  >
>((props, ref) => {
  const { has_when, when, when_strategy, ...fieldProps } = props;

  switch (props.type) {
    case 'select-autocomplete':
      return (
        <FGSelectAutocomplete
          {...(fieldProps as FGHookForm<
            OverrideRequired<SelectAutocompleteProps<any>>
          >)}
        />
      );

    case 'creatable-select-autocomplete':
      return (
        <FGCreatableSelectAutocomplete
          {...(fieldProps as FGHookForm<
            OverrideRequired<CreatableSelectAutocompleteProps<any>>
          >)}
        />
      );

    case 'date-time':
      return (
        <FGDateTime
          {...(fieldProps as FGHookForm<OverrideRequired<DateTimeProps<any>>>)}
        />
      );

    case 'time':
      return (
        <FGTime
          {...(fieldProps as FGHookForm<OverrideRequired<TimeProps<any>>>)}
        />
      );

    case 'date':
      return (
        <FGDate
          {...(fieldProps as FGHookForm<OverrideRequired<DateProps<any>>>)}
        />
      );

    case 'select':
      return (
        <FGSelect
          {...(fieldProps as FGHookForm<OverrideRequired<SelectProps<any>>>)}
        />
      );

    case 'select-checkbox':
      return (
        <FGSelectCheckbox
          {...(fieldProps as FGHookForm<
            OverrideRequired<SelectCheckboxProps<any>>
          >)}
        />
      );

    case 'radio':
      return (
        <FGRadio
          {...(fieldProps as FGHookForm<OverrideRequired<RadioProps<any>>>)}
        />
      );

    case 'checkbox':
      return (
        <FGCheckbox
          {...(fieldProps as FGHookForm<OverrideRequired<CheckboxProps<any>>>)}
        />
      );

    case 'textarea':
      return (
        <FGTextarea
          {...(fieldProps as FGHookForm<OverrideRequired<TextareaProps<any>>>)}
        />
      );

    case 'number':
      return (
        <FGNumberInput
          {...(fieldProps as FGHookForm<
            OverrideRequired<NumberInputProps<any>>
          >)}
        />
      );

    case 'quill':
      return (
        <FGQuillEditor
          {...(fieldProps as FGHookForm<
            OverrideRequired<QuillEditorProps<any>>
          >)}
        />
      );

    case 'file':
      return (
        <FGFileInput
          {...(fieldProps as FGHookForm<OverrideRequired<FileInputProps<any>>>)}
        />
      );

    case 'table':
      return (
        <FGTableInput
          {...(fieldProps as FGHookForm<
            OverrideRequired<TableInputProps<any>>
          >)}
        />
      );

    case 'currency':
      return (
        <FGCurrencyInput
          {...(fieldProps as FGHookForm<
            OverrideRequired<CurrencyInputProps<any>>
          >)}
        />
      );

    case 'searchable-input':
      return (
        <FGSearchableInput
          {...(fieldProps as FGHookForm<
            OverrideRequired<SearchableInputProps<any>>
          >)}
        />
      );

      case 'searchable-inputPiMod':
        return (
          <FGSearchableInputPiMod
            {...(fieldProps as FGHookForm<
              OverrideRequired<SearchableInputPropsPIMod<any>>
            >)}
          />
        );

        case 'searchable-textField':
          return (
            <FGSearchableTextField
              {...(fieldProps as FGHookForm<
                OverrideRequired<SearchableTextFieldProps<any>>
              >)}
            />
          );

        case 'switch':
          return (
            <FGSwitch
              {...(fieldProps as FGHookForm<
                OverrideRequired<SwitchProps<any>>
              >)}
            />
          );

        case 'custom':
          return (
            <Box key={fieldProps.name}>
              {fieldProps.render()}
            </Box>
          );

    default:
      return (
        <FGInput
          {...(fieldProps as FGHookForm<OverrideRequired<InputProps<any>>>)}
        />
      );
  }
});

FieldInput.displayName = 'FieldInput';
