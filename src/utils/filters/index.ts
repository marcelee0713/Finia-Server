export const filter = <T>(arr: T[], conditionFn: (val: T) => boolean): T[] => {
  return arr.filter((val) => conditionFn(val));
};
