type StyleFont = 200 | 300 | 400 | 500 | 700 | 900;

const getWeight = (str: number) => {
  switch (str) {
    case 200:
      return 'Thin';
    case 300:
      return 'Light';
    case 400:
      return 'Regular';
    case 500:
      return 'Medium';
    case 700:
      return 'Bold';
    case 900:
      return 'Black';
  }
};

export const getFontFamily = (style: StyleFont, i: boolean = false) => {
  let weight = getWeight(style);
  if (i) {
    weight = style === 400 ? 'Italic' : `${weight}Italic`;
  }
  return `Roboto-${weight}`;
};
