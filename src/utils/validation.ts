import isHttp from './isHttp';
import t from './t';

const validOnMask = (value: string) => value && value.indexOf('_') === -1;

const useValidation = () => {
  const validation = {
    phone: {
      validate: (value: string) => {
        const error = 'Wrong phone';
        return validOnMask(value) ? undefined : error;
      },
    },
    email: {
      pattern: {
        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Wrong email',
      },
    },
    required: {
      pattern: {
        value: /\S+/,
        message: t('errorRequired'),
      },
      validate: (value: string) => {
        if (!value) {
          return t('errorRequired');
        }
        return undefined;
      },
    },
    firstName: {
      pattern: {
        value: /\S+/,
        message: t('errorRequired'),
      },
      validate: (value: string) => {
        const error = t('errorFirstName');
        if (!value) {
          return t('errorRequired');
        }

        const match = value.match(/[^\p{L}\s]/u);

        return match === null ? undefined : error;
      },
    },
    lastName: {
      validate: (value: string) => {
        const error = t('errorLastName');
        const match = value.match(/[^\p{L}\s]/u);

        return match === null ? undefined : error;
      },
    },
    quantity: {
      pattern: {
        value: /\S+/,
        message: t('errorRequired'),
      },
      validate: (value: string) => {
        if (!value) {
          return t('errorRequired');
        }

        const number = parseFloat(value);
        if (Number.isNaN(number)) {
          return t('errorNumber');
        }
        return number > 0 ? undefined : t('errorMoreThanZero');
      },
    },
    website: {
      validate: (value: string) => {
        if (!value) {
          return undefined;
        }
        const http = isHttp(value);
        return http ? undefined : t('errorWebsite');
      },
    },
  };

  return validation;
};

const rulesInput = {
  maxValue: (max: number) => (value: string) => {
    if (!value) {
      return value;
    }
    const n = parseFloat(value);
    const is = max > n;
    return is ? value : value.substr(0, max.toString().length);
  },
  maxLength: (max: number) => (value: string) => {
    const is = max > value.length;
    return is ? value : value.substr(0, max);
  },
  onlyNumber: (value: string) => {
    if (!value) {
      return value;
    }
    const match = value.match(/\d*/g);
    if (match) {
      value = match.filter((m) => parseFloat(m)).join('');
    }
    return value;
  },
  oneSeparateSymbol: (value: string) => {
    if (!value) {
      return value;
    }
    const newValue = value.replace(',', '.');
    if (newValue.startsWith('.')) {
      return newValue.substr(1);
    }
    const dots = newValue.match(/\./g);
    if (dots === null) {
      return newValue;
    }
    if (dots.length > 1 && newValue.endsWith('.')) {
      return newValue.replace(/\.$/, '');
    }
    return (dots.length <= 1 ? newValue : newValue.replace(/\./, '')).match(/^\d+\.?\d?\d?/)[0];
  },
  price: (value: string) => {
    // /^\d+\.?\d\d/
    if (!value) {
      return value;
    }
    const newValue = value.replace(',', '.');
    const res = newValue.match(/(\d+\.?\d{0,2})/);
    return res === null ? '' : res[0];
  },
};

const executeRules = (funcs: any[], value: string) => {
  if (value === undefined || value === null) return value;
  let newValue = value;
  funcs.forEach((func) => {
    newValue = func(newValue);
  });
};

export {rulesInput, executeRules};
export default useValidation;
