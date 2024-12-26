import { parseISO } from 'date-fns';

const toTimestampFormat = (dtString: string): number => {
  /**
   * Converts a datetime string to timestamp format including microseconds.
   * @param dtString - Input datetime string in 'YYYY-MM-DD HH:MM:SS.ssssss' format.
   * @returns The timestamp corresponding to the datetime string.
   */
  const date = parseISO(dtString);
  return date.getTime() / 1000; // Convert milliseconds to seconds for Unix timestamp.
};

const stringToBoolean = (boolString: String) => {
  let boolValue = boolString === 'true';

  console.log(boolValue); // true
  return boolValue;
};
export { stringToBoolean, toTimestampFormat };
