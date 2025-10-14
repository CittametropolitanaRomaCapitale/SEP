export const isTrue = (
  check: Function | string | boolean,
  values?: { [key: string]: any }
): boolean =>
  check instanceof Function
    ? check(values)
    : values && typeof check === 'string'
    ? !!values[check]
    : check;
