export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key]);
    acc[groupKey] ??= [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};
