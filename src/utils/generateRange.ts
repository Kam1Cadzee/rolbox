import IOption from '../typings/IOption';

const generateRange = (start: number, end: number) => {
  const range: IOption<string, number>[] = [];
  for (let i = start; i <= end; i += 1) {
    range.push({
      label: i.toString(),
      value: i,
    });
  }

  return range;
};

export default generateRange;
