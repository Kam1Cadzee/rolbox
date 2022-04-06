import {DayOfWeek} from '../../typings/IEvent';

interface IItemDate {
  day: number;
  month: number;
  year: number;
  isActiveMonth?: boolean;
}

class ExtensionCalendar {
  static changeWeeks(weeks: string[], first: DayOfWeek) {
    if (first === DayOfWeek.Mon) {
      return weeks;
    }
    let start: number = first;
    const res: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      res.push(weeks[(start + i) % 7]);
    }
    return res;
  }

  static getDay(date: Date) {
    let day = date.getDay();
    if (day === 0) {
      return 6;
    }
    return day - 1;
  }

  static offsetPrevDays(first: DayOfWeek, current: DayOfWeek) {
    let res = 0;
    while (first !== current) {
      res += 1;
      first = (first + 1) % 7;
    }
    return res;
  }

  static getDaysForCurrentMoment(date: Date, firstDayOfMonth: DayOfWeek) {
    const sixRow = 6 * 7;
    const fiveRow = 5 * 7;
    const currentMonth = date.getMonth();

    const beginDate = new Date(date);
    beginDate.setDate(1);
    const endDate = new Date(date);
    endDate.setMonth(beginDate.getMonth() + 1, 0);

    const offset1 = ExtensionCalendar.offsetPrevDays(firstDayOfMonth, ExtensionCalendar.getDay(beginDate));
    beginDate.setDate(-offset1 + 1);

    const res: IItemDate[] = [];

    const end = fiveRow - offset1 < endDate.getDate() ? sixRow : fiveRow;

    for (let i = 0; i < end; i += 1) {
      const month = beginDate.getMonth();
      const year = beginDate.getFullYear();
      res.push({
        day: beginDate.getDate(),
        month,
        year,
        isActiveMonth: currentMonth === month,
      });
      beginDate.setDate(beginDate.getDate() + 1);
    }
    return res;
  }
}

export {IItemDate};
export default ExtensionCalendar;
