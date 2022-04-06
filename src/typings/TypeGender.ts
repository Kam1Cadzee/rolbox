import t from '../utils/t';
import IOption from './IOption';

enum Gender {
  male = 'male',
  female = 'female',
  ratherNotSay = 'ratherNotSay',
}

const useGenderOptions = () => {
  const genderOptions: IOption<string, Gender>[] = [
    {
      label: t('male'),
      value: Gender.male,
    },
    {
      label: t('female'),
      value: Gender.female,
    },
    {
      label: t('ratherNotSay'),
      value: Gender.ratherNotSay,
    },
  ];

  return genderOptions;
};

const useGetLabelGender = () => {
  const options = useGenderOptions();
  return (value?: Gender) => {
    const find = options.find((o) => o.value === value);
    return find?.label ?? '';
  };
};

const getLabelGender = (options: IOption<string, Gender>[], value: Gender) => {
  const find = options.find((o) => o.value === value);
  return find?.label ?? '';
};

export {Gender, getLabelGender, useGetLabelGender};
export default useGenderOptions;
