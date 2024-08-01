import dayjs, { Dayjs } from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const calculateDateFromNow = (date: Dayjs | string) => {
  return dayjs(date).fromNow();
};

export const formatReadableDate = (
  date: Dayjs | string,
  format: string = "DD/MM/YYYY HH:mm:ss",
) => {
  return dayjs(date).format(format);
};

export const convertUnixToDate = (unix: number) => {
  return dayjs.unix(unix);
};
