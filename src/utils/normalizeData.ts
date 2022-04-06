import {parseHttpString} from './isHttp';

const normalizeData: (data?: string | number | null | undefined) => any = (
  data?: string | number | null | undefined,
) => {
  if (data === undefined) {
    return undefined;
  } else if (data === null) {
    return null;
  } else if (typeof data === 'number') {
    return data;
  } else if (typeof data === 'string') {
    const value = data.trim();
    return value;
  }
  return data;
};

const normalizePrice = (price?: string | number | null) => {
  if (price !== null && price !== undefined && price !== '') {
    const res = parseFloat(`${price}`).toFixed(2).replace('.00', '');
    return res.indexOf('.') !== -1 && res.endsWith('0') ? res.substr(0, res.length - 1) : res;
  }
  return undefined;
};

const twoSymbols = (n: number) => {
  return n.toString().padStart(2, '0');
};
const normalizeDate = (date: Date | string) => {
  if (!date) {
    return null;
  }
  const d = new Date(date); // 2021-04-20
  const year = d.getUTCFullYear();
  const month = twoSymbols(d.getUTCMonth() + 1);
  const day = twoSymbols(d.getUTCDate());
  const hour = twoSymbols(d.getUTCHours());
  const minute = twoSymbols(d.getUTCMinutes());

  // 2021-07-15T09:00:42.394Z
  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
};

const normalizeDateOffset = (value: Date) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  date.setUTCHours(offset / 60);
  return date;
};

const normalizeURL = (value: string) => {
  if (!value) {
    return undefined;
  }
  return parseHttpString(value) ?? undefined;
};

const normalizeBigNumber = (number: number) => {
  if (isNaN(number)) {
    return 0;
  }
  const millions = Math.floor(number / 1000000);

  if (millions >= 1) {
    return `${millions}M+`;
  }

  const thousands = Math.floor(number / 1000);
  if (thousands < 1) {
    return number;
  }

  return `${thousands}K+`;
};

export {normalizePrice, normalizeDate, normalizeDateOffset, normalizeURL, normalizeBigNumber};
export default normalizeData;
