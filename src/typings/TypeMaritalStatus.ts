import {checkLocale, Locale} from '../config/configLocale';
import {useFormattingContext} from '../context/FormattingContext';
import t from '../utils/t';
import IOption from './IOption';

enum MaritalStatus {
  singleMale = 'singleMale',
  singleFemale = 'singleFemale',
  marriedMale = 'marriedMale',
  marriedFemale = 'marriedFemale',
  ratherNotSay = 'ratherNotSay',
}

const useMaritalStatusOptions = () => {
  const {currentLocale} = useFormattingContext();
  const maritalStatusOptions: IOption<string, MaritalStatus>[] = [
    {
      value: MaritalStatus.singleMale,
      label: t('singleMale'),
    },
    {
      value: MaritalStatus.singleFemale,
      label: t('singleFemale'),
    },
    {
      value: MaritalStatus.marriedMale,
      label: t('marriedMale'),
    },
    {
      value: MaritalStatus.marriedFemale,
      label: t('marriedFemale'),
    },
    {
      value: MaritalStatus.ratherNotSay,
      label: t('ratherNotSay'),
    },
  ];

  if (checkLocale(['en', 'es'], currentLocale)) {
    return [
      {
        value: MaritalStatus.singleMale,
        label: t('singleMale'),
      },
      {
        value: MaritalStatus.marriedMale,
        label: t('marriedMale'),
      },
      {
        value: MaritalStatus.ratherNotSay,
        label: t('ratherNotSay'),
      },
    ] as IOption<string, MaritalStatus>[];
  }

  return maritalStatusOptions;
};

const useGetLabelMaritalStatus = () => {
  const options = useMaritalStatusOptions();
  return (value?: MaritalStatus) => {
    const find = options.find((o) => o.value === value);
    return find?.label ?? '';
  };
};

const getLabelMaritalStatus = (options: IOption<string, MaritalStatus>[], value: MaritalStatus) => {
  const find = options.find((o) => o.value === value);
  return find?.label ?? '';
};

const normalizeMaritalStatus = (status: MaritalStatus) => {
  if (!status) {
    return undefined;
  }

  if (!checkLocale(['en', 'es'])) {
    return status;
  }
  if (status === MaritalStatus.singleFemale) {
    return MaritalStatus.singleMale;
  } else if (status === MaritalStatus.marriedFemale) {
    return MaritalStatus.marriedMale;
  }

  return status;
};

export {MaritalStatus, getLabelMaritalStatus, useGetLabelMaritalStatus, normalizeMaritalStatus};
export default useMaritalStatusOptions;
