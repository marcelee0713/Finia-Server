const skipArr = <T>(arr: T[], n: number): T[] => {
  if (n < 0) {
    return arr;
  }
  return arr.slice(n);
};

const takeArr = <T>(arr: T[], m: number): T[] => {
  if (m < 0) {
    return arr;
  }
  return arr.slice(0, m);
};

const skipAndTake = <T>(arr: T[], skipCount?: number, takeCount?: number): T[] => {
  if (skipCount && takeCount) {
    const skipped = skipArr(arr, skipCount);
    return takeArr(skipped, takeCount);
  } else if (!skipCount && takeCount) {
    return takeArr(arr, takeCount);
  } else if (skipCount && !takeCount) {
    return skipArr(arr, skipCount);
  } else {
    return arr;
  }
};

export { skipArr, takeArr, skipAndTake };
