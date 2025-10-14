import _get from 'lodash/get';
import { WhenProps } from './types';

export const when = (
  values: any,
  conditions: WhenProps[] = [],
  when_strategy: string = 'AND'
) => {
  if (when_strategy === 'AND') {
    return conditions
      .filter((when) => when.accessor)
      .every((when) => compareFunction(when, _get(values, when.accessor)));
  } else if (when_strategy === 'OR') {
    return conditions
      .filter((when) => when.accessor)
      .some((when) => compareFunction(when, _get(values, when.accessor)));
  }
};

const evaluateValue = (value) =>
  value === 'true' || value === 'false' ? Boolean(value) : value;

const compareFunction = (when: WhenProps, value: any) => {
  if (!when.accessor) return;

  switch (when?.comparator) {
    case '!=':
      return value != evaluateValue(when?.value);
    case '==':
      return value == evaluateValue(when?.value);

    default:
      return value == evaluateValue(when?.value);
  }
};

export const getDefaultValue = ({ type, value }: { type: any; value: any }) => {
  switch (type) {
    case 'text':
      return value || '';
    case 'checkbox':
      return false;
    case 'number':
      return '';
    case 'select':
    case 'radio':
    case 'date':
    case 'time':
    case 'date-time':
    case 'quill':
      return value;
    default:
      return '';
  }
};

export const isTrue = (
  check: Function | string | boolean,
  values?: { [key: string]: any }
): boolean =>
  check instanceof Function
    ? check(values)
    : values && typeof check === 'string'
    ? !!values[check]
    : check;
