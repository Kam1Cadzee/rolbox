import t from '../utils/t';

const inRange = (value: number, min: number, max?: number) => {
  if (max) {
    return value >= min && value <= max;
  }
  return value >= min;
};

const usePluralizationMembers = () => {
  const pluralization = new Pluralization(t('pluralizationMemberDefault'));
  pluralization.addRule((n) => {
    if (!inRange(n, 1, 20)) {
      return;
    }
    if (n === 1) {
      return t('pluralizationMember4');
    } else if (inRange(n, 2, 4)) {
      return t('pluralizationMember2');
    } else {
      return t('pluralizationMember3');
    }
  });
  pluralization.addRule((n) => {
    if (!inRange(n, 21)) {
      return;
    }
    n = n % 10;
    if (n === 1) {
      return t('pluralizationMember1');
    } else if (inRange(n, 2, 4)) {
      return t('pluralizationMember2');
    } else {
      return t('pluralizationMember3');
    }
  });

  return (n: number) => {
    return pluralization.execute(n);
  };
};

type Rule = (n: number) => string | undefined;

class Pluralization {
  defaultValue: string = '';
  rules: Rule[] = [];

  constructor(defaultValue: string = '') {
    this.defaultValue = defaultValue;
  }
  addRule(rule: Rule) {
    this.rules.push(rule);
  }

  execute(n: number) {
    for (const rule of this.rules) {
      const res = rule(n);
      if (res) {
        return res;
      }
    }

    return this.defaultValue;
  }
}

export {usePluralizationMembers};
