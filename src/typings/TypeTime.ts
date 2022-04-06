import IOption from './IOption';
import generateRange from '../utils/generateRange';
import {CONSTANTS_UNIT, IConstant, Locale} from '../config/configLocale';
import IUnit from './IUnit';
import t from '../utils/t';

enum TypeTime {
  clock12 = '12',
  clock24 = '24',
}

enum TimeOfDay {
  AM = 'AM',
  PM = 'PM',
}

enum DetectedDate {
  theSameDay = 1,
  theSameWeek = 2,
  theSameYear = 3,
  other = 4,
}
class ExtensionTime {
  static detectedDate(date: Date) {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (currentDay === day && currentMonth === month && currentYear === year) {
      return DetectedDate.theSameDay;
    }

    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 7);
    if (newDate.getTime() < date.getTime()) {
      return DetectedDate.theSameWeek;
    }

    if (year === currentYear) {
      return DetectedDate.theSameYear;
    }

    return DetectedDate.other;
  }
  static formatDate(date: Date, strFormat: string, constant: IConstant) {
    if (!date) {
      return undefined;
    }
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();

    const nameShortMonths = constant.shortMonths;
    const nameLongMonths = constant.longMonths;

    strFormat = strFormat.replace('dd', day.padStart(2, '0'));

    strFormat = strFormat.replace('mm', month.padStart(2, '0'));
    strFormat = strFormat.replace('MMMM', nameLongMonths[date.getMonth()]);
    strFormat = strFormat.replace('MM', nameShortMonths[date.getMonth()]);

    strFormat = strFormat.replace('yyyy', year);

    return strFormat;
  }
  static useOptionsTime() {
    const tHeight = ExtensionTime.useTranslateUnitTime();
    return [
      {
        value: TypeTime.clock12,
        label: tHeight(TypeTime.clock12),
      },
      {
        value: TypeTime.clock24,
        label: tHeight(TypeTime.clock24),
      },
    ] as IOption<string, TypeTime>[];
  }

  static useTranslateUnitTime() {
    return (type: TypeTime) => {
      switch (type) {
        case TypeTime.clock12:
          return t('clock12');
        case TypeTime.clock24:
          return t('clock24');
      }
    };
  }

  static getDefaultTime(unit: TypeTime) {
    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    m = Math.round(m / 5) * 5;

    if (unit === TypeTime.clock24) {
      return `${h}:${m}`;
    }

    let timeOfDay = ExtensionTime.getLabelFotTimeOfDay(TimeOfDay.AM);
    if (h > 11) {
      timeOfDay = ExtensionTime.getLabelFotTimeOfDay(TimeOfDay.PM);
      if (h !== 12) {
        h %= 12;
      }
    }

    return `${h}:${m}:${timeOfDay}`;
  }

  static parseTimeToNumbers(value: IUnit<TypeTime, string>) {
    let {hour, minute} = ExtensionTime.parseTime(value.value);

    if (value.unit === TypeTime.clock12) {
      hour += 12;
    }

    return {hour, minute};
  }
  static parseTime(time: string) {
    const arr = time.split(':');

    return {
      hour: +arr[0],
      minute: +arr[1],
      timeOfDay: arr[2] as TimeOfDay | undefined,
    };
  }

  static formatTime(value?: string) {
    if (!value) {
      return '';
    }
    const res = ExtensionTime.parseTime(value);
    const h = res.hour.toString().padStart(2, '0');
    const m = res.minute.toString().padStart(2, '0');
    let str = `${h}:${m}`;
    if (res.timeOfDay) {
      str += ` ${res.timeOfDay}`;
    }
    return str;
  }

  static formatTimeByDate(date: Date, locale: Locale) {
    const typeTime = CONSTANTS_UNIT[locale].typeTime;
    let h = date.getHours();
    const m = date.getMinutes();
    if (typeTime === TypeTime.clock24) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    } else {
      let time = h > 11 ? TimeOfDay.PM : TimeOfDay.AM;
      if (h !== 12) {
        h %= 12;
      }
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ExtensionTime.getLabelFotTimeOfDay(
        time,
      )}`;
    }
  }

  static stringifyTime(hour: number, minute: number, unit: TypeTime, time: TimeOfDay) {
    let str = `${hour}:${minute}`;
    if (unit === TypeTime.clock12) {
      str += `:${ExtensionTime.getLabelFotTimeOfDay(time)}`;
    }

    return str;
  }

  static getOptionsTimeOfDay() {
    return [
      {
        label: ExtensionTime.getLabelFotTimeOfDay(TimeOfDay.AM),
        value: TimeOfDay.AM,
      },
      {
        label: ExtensionTime.getLabelFotTimeOfDay(TimeOfDay.PM),
        value: TimeOfDay.PM,
      },
    ] as IOption<string, TimeOfDay>[];
  }

  static getLabelFotTimeOfDay(time: TimeOfDay) {
    if (time === TimeOfDay.AM) {
      return 'AM';
    }
    return 'PM';
  }

  static getOptionsMinutes() {
    const res: IOption<string, number>[] = [];
    for (let i = 0; i < 60; i += 5) {
      res.push({
        value: i,
        label: i.toString().padStart(2, '0'),
      });
    }
    return res;
  }

  static getOptionsHours(unit: TypeTime) {
    const res: IOption<string, number>[] = [];
    const hour = unit === TypeTime.clock12 ? 12 : 24;

    for (let i = 0; i < hour; i += 1) {
      res.push({
        value: i,
        label: i.toString().padStart(2, '0'),
      });
    }
    return res;
  }
}

export {ExtensionTime, TimeOfDay, DetectedDate};
export default TypeTime;
