import IOption from './IOption';

enum TypeCurrency {
  USD = 'usd',
  UAH = 'uah',
  EUR = 'eur',
}

const useCurrencyOptions = () => {
  const options: IOption<string, TypeCurrency>[] = [
    {
      value: TypeCurrency.USD,
      label: 'USD',
    },
    {
      value: TypeCurrency.UAH,
      label: 'UAH',
    },
    {
      value: TypeCurrency.EUR,
      label: 'EUR',
    },
  ];

  return options;
};

const useCurrencyOptionByTypeFunc = () => {
  const options = useCurrencyOptions();
  return (type: TypeCurrency) => {
    return options.find((o) => o.value === type);
  };
};

const getSymbolCurrency = (type: TypeCurrency) => {
  switch (type) {
    case TypeCurrency.UAH:
      return '₴';
    case TypeCurrency.USD:
      return '$';
    case TypeCurrency.EUR:
      return '€';
  }
};
export {useCurrencyOptions, useCurrencyOptionByTypeFunc, getSymbolCurrency};
export default TypeCurrency;
