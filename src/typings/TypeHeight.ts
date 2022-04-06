import IOption from './IOption';
import generateRange from '../utils/generateRange';
import t from '../utils/t';

enum TypeHeight {
  cm = 'cm',
  foot = 'foot',
  inch = 'inch',
}

const units = {
  [TypeHeight.cm]: 1,
  [TypeHeight.inch]: 0.3937007874,
  [TypeHeight.foot]: 0.3937007874 / 12,
};

const convertHeightInto = (w: number, type: TypeHeight) => {
  return w * units[type];
};
const convertFootIntoCm = (f: number, inch: number) => {
  return Math.round((f * 12 + inch) * 2.54);
};
const convertCmIntoFoot = (cm: number) => {
  const foot = convertHeightInto(cm, TypeHeight.foot);
  const ceilValue = Math.floor(foot);
  const roundValue = foot - ceilValue;

  return roundValue > 0.98 ? ceilValue + 1 : ceilValue;
};
const convertCmIntoInch = (cm: number) => {
  const inchs = convertHeightInto(cm, TypeHeight.inch);
  return Math.round(inchs % 12) % 12;
};

const useFormatUnitHeightValue = () => {
  const t = useTranslateUnitHeight();

  return (value: number, type: TypeHeight) => {
    switch (type) {
      case TypeHeight.cm:
        return `${value.toString()} ${t(TypeHeight.cm)}`;
      case TypeHeight.foot:
      case TypeHeight.inch: {
        let foot = convertCmIntoFoot(value);
        let inch = convertCmIntoInch(value);

        if (inch === 12) {
          foot += 1;
          inch = 0;
        }

        let res = `${foot} ${t(TypeHeight.foot)}`;
        if (inch > 0) {
          res += `, ${inch} ${t(TypeHeight.inch)}`;
        }
        return res;
      }
    }
  };
};

const useOptionsHeight = () => {
  const tHeight = useTranslateUnitHeight();
  return [
    {
      value: TypeHeight.cm,
      label: tHeight(TypeHeight.cm),
    },
    {
      value: TypeHeight.foot,
      label: tHeight(TypeHeight.foot),
    },
  ] as IOption<string, TypeHeight>[];
};

const useOptionsHeightCM = () => {
  const tHeight = useTranslateUnitHeight();
  return generateRange(MIN_HEIGHT_OPTION, MAX_HEIGHT_OPTION).map((o) => ({
    value: o.value,
    label: `${o.label} ${tHeight(TypeHeight.cm)}`,
  })) as IOption<string, number>[];
};

const useOptionsHeightFOOT = () => {
  const tHeight = useTranslateUnitHeight();

  return generateRange(MIN_FOOT_OPTION, MAX_FOOT_OPTION).map((o) => ({
    value: o.value,
    label: `${o.label} ${tHeight(TypeHeight.foot)}`,
  })) as IOption<string, number>[];
};

const useOptionsHeightINCH = () => {
  const tHeight = useTranslateUnitHeight();

  return generateRange(0, 11).map((o) => ({
    value: o.value,
    label: o.value !== 0 ? `${o.label} ${tHeight(TypeHeight.inch)}` : '',
  })) as IOption<string, number>[];
};

const useTranslateUnitHeight = () => {
  return (type: TypeHeight) => {
    switch (type) {
      case TypeHeight.cm:
        return t('cm');
      case TypeHeight.foot:
        return t('foot');
      case TypeHeight.inch:
        return t('inch');
    }
  };
};

const MIN_FOOT_OPTION = 1;
const MAX_FOOT_OPTION = 7;

const MIN_HEIGHT_OPTION = Math.floor(MIN_FOOT_OPTION * 12 * 2.54);
const MAX_HEIGHT_OPTION = Math.round(MAX_FOOT_OPTION * 12 * 2.54 + 11 * 2.54);

const DEFAULT_HEIGHT_OPTION = 175;

export {
  convertHeightInto,
  useFormatUnitHeightValue,
  MAX_HEIGHT_OPTION,
  MIN_HEIGHT_OPTION,
  DEFAULT_HEIGHT_OPTION,
  useOptionsHeight,
  useTranslateUnitHeight,
  useOptionsHeightCM,
  useOptionsHeightFOOT,
  useOptionsHeightINCH,
  convertFootIntoCm,
  convertCmIntoFoot,
  convertCmIntoInch,
};
export default TypeHeight;
