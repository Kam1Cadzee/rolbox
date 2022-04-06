import {getLocaleConstant} from '../config/configLocale';
import IOption from '../typings/IOption';
import generateRange from './generateRange';

const MIN_YEAR = 1900;
const OFFSET_YEAR = 0;

const monthShortNames = (selectedYear: number) => {
  selectedYear += MIN_YEAR;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months = getLocaleConstant().shortMonths;
  const filterMoths = selectedYear === currentYear ? months.filter((_, i) => i <= currentMonth) : months;

  return filterMoths.map((m, i) => ({
    value: i,
    label: m,
  })) as IOption<string, number>[];
};

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const years = generateRange(MIN_YEAR, getCurrentYear() - OFFSET_YEAR);

const getDefaultDate = () => {
  const d = new Date();
  d.setFullYear(1990);
  d.setMonth(0, 1);
  return d;
};

const getLastDay = (date: Date) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const y = date.getFullYear(),
    m = date.getMonth();

  if (currentYear === y && currentMonth === m) {
    return currentDay;
  }
  return new Date(y, m + 1, 0).getDate();
};

const getDaysRange = (date: Date) => {
  const lastDay = getLastDay(date);

  return generateRange(1, lastDay);
};

const checkDate = (date: Date, savedDate: number) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  let y = date.getFullYear(),
    m = date.getMonth(),
    d = savedDate;

  if (currentYear === y) {
    date.setMonth(Math.min(currentMonth, m), 1);
  }
  m = date.getMonth();

  if (currentYear === y && currentMonth === m) {
    date.setDate(Math.min(currentDay, d));
  } else {
    const lastDay = getLastDay(date);
    if (d > lastDay) {
      date.setDate(lastDay);
    } else {
      date.setDate(d);
    }
  }

  return date;
};

export {monthShortNames, years, MIN_YEAR, getDefaultDate, getLastDay, getDaysRange, checkDate};
