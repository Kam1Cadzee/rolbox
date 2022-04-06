import t from '../utils/t';
import IOption from './IOption';

const useGetStatusBirthday = () => {
  return [
    {
      label: t('hideBirthday'),
      value: true,
    },
    {
      label: t('showBirthday'),
      value: false,
    },
  ] as IOption<string, boolean>[];
};

const getLabelStatusBirthday = (b: boolean) => {
  return b ? t('hideBirthday') : t('showBirthday');
};
export {useGetStatusBirthday, getLabelStatusBirthday};
