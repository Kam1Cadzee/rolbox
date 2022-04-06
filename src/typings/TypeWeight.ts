import t from '../utils/t';
import IOption from './IOption';

enum TypeWeight {
  kg = 'kg',
  st = 'st',
  lb = 'lb',
}

const units = {
  [TypeWeight.kg]: 1,
  [TypeWeight.st]: 0.1574,
  [TypeWeight.lb]: 2.2046,
};

const convertKgInto = (w: number, type: TypeWeight) => {
  return w * units[type];
};

const formatUnitWeightValue = (weight: number, type: TypeWeight) => {
  const value = convertKgInto(weight, type);
  switch (type) {
    case TypeWeight.kg:
      return value.toString();
    case TypeWeight.lb:
      return Math.round(value).toString();
    case TypeWeight.st:
      return Math.fround(value).toPrecision(3);
  }
};

const useOptionsWeight = () => {
  const tWeight = useTranslateUnitWeight();

  return [
    /* {
      value: TypeWeight.st,
      label: tWeight(TypeWeight.st),
    }, */
    {
      value: TypeWeight.kg,
      label: tWeight(TypeWeight.kg),
    },
    {
      value: TypeWeight.lb,
      label: tWeight(TypeWeight.lb),
    },
  ] as IOption<string>[];
};

const useTranslateUnitWeight = () => {
  return (type: TypeWeight) => {
    switch (type) {
      case TypeWeight.kg:
        return t('kg');
      case TypeWeight.lb:
        return t('lb');
      case TypeWeight.st:
        return 'st';
    }
  };
};

const MIN_WEIGHT_OPTION = 3;
const DEFAULT_WEIGHT_OPTION = 80;
const maxValueWeight = (type: TypeWeight) => {
  if (type === TypeWeight.kg) {
    return 200;
  }
  return 500;
};
export {
  convertKgInto,
  maxValueWeight,
  useOptionsWeight,
  formatUnitWeightValue,
  MIN_WEIGHT_OPTION,
  useTranslateUnitWeight,
  DEFAULT_WEIGHT_OPTION,
};
export default TypeWeight;
