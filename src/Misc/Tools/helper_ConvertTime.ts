import moment from "moment-timezone";

export const ServerTimeToLocal = (data: any) =>
  data ? moment.tz(data, 'US/Eastern').local() : data;
