export const formatDateToReadableString = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};
