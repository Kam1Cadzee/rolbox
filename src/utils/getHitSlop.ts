import {sizes} from '../context/ThemeContext';

const getHitSlop = (size: number) => {
  return {
    bottom: sizes[size],
    left: sizes[size],
    top: sizes[size],
    right: sizes[size],
  };
};

export default getHitSlop;
