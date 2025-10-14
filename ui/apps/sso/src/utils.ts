export const orderBy = ({ array, by }: { array: []; by: string }) =>
  array.sort((a: unknown, b: unknown) => {
    const nameA = a[by].toLowerCase();
    const nameB = b[by].toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
