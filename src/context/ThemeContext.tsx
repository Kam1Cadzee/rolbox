import React, {useContext, useMemo} from 'react';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';

const window = Dimensions.get('screen');

export type Theme = 'dark' | 'light';

interface IThemeContext {
  onChangeTheme: (theme: Theme) => any;
  theme: Theme;

  primary: string;
  primaryLight: string;
  primaryThin: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  background: string;
  backgroundLight: string;
  backgroundDark: string;
  border: string;
  text: string;
  lightText: string;
  reverseText: string;
  errorColor: string;
  green: string;
  greenDark;
  yellow: string;
  yellowDark: string;
  blue: string;
  blueDark: string;
  red: string;
  redDark: string;
  red1: string;
  red2: string;
}

const ThemeContext = React.createContext({} as IThemeContext);

const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const colorWithOpacity = (color: string, opacity: number) => {
  const {r, b, g} = hexToRgb(color)!;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getRbaFromHex = (color: string) => {
  return hexToRgb(color)!;
};

const ProviderTheme = ({children}: any) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectorsOther.getTheme);

  const value: IThemeContext = useMemo(() => {
    const primary = theme === 'light' ? '#2A686B' : '#2A686B';
    const primaryLight = theme === 'light' ? '#538689' : '#538689';
    const primaryThin = theme === 'light' ? '#85A3A5' : '#85A3A5';
    const secondary = theme === 'light' ? '#FA8925' : '#FA8925';
    const secondaryDark = theme === 'light' ? '#E86D00' : '#E86D00';
    const accent = theme === 'light' ? '#01C5C5' : '#01C5C5';

    const background = theme === 'light' ? '#ffffff' : '#ffffff';
    const backgroundLight = theme === 'light' ? '#F9FCFD' : '#F9FCFD';
    const backgroundDark = theme === 'light' ? '#EBF3FA' : '#EBF3FA';

    const lightText = theme === 'light' ? '#85A3A5' : '#85A3A5';
    const reverseText = theme === 'light' ? '#ffffff' : '#ffffff';
    const text = theme === 'light' ? '#2C504C' : '#2C504C';

    const border = theme === 'light' ? '#C4DFEB' : '#C4DFEB';
    const errorColor = theme === 'light' ? '#dc3545' : '#dc3545';

    const green = theme === 'light' ? '#7DD170' : '#7DD170';
    const greenDark = theme === 'light' ? '#129336' : '#129336';

    const yellow = theme === 'light' ? '#FBCC55' : '#FBCC55';
    const yellowDark = theme === 'light' ? '#B18F35' : '#B18F35';

    const blue = theme === 'light' ? '#A8DDE0' : '#A8DDE0';
    const blueDark = theme === 'light' ? '#587D7F' : '#587D7F';

    const red = theme === 'light' ? '#FBA8A8' : '#FBA8A8';
    const redDark = theme === 'light' ? '#AA4E4E' : '#AA4E4E';
    const red1 = theme === 'light' ? '#F35F4A' : '#F35F4A';
    const red2 = theme === 'light' ? '#C44141' : '#C44141';

    return {
      onChangeTheme: (theme: Theme) => {
        dispatch(
          actionsOther.setData({
            theme,
          }),
        );
      },
      theme,
      primary,
      background,
      lightText,
      text,
      border,
      secondary,
      errorColor,
      accent,
      reverseText,
      backgroundLight,
      backgroundDark,
      primaryLight,
      primaryThin,
      secondaryDark,
      green,
      greenDark,
      yellow,
      yellowDark,
      blue,
      blueDark,
      red,
      redDark,
      red1,
      red2,
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const isTablet = Math.min(responsiveScreenHeight(100), responsiveScreenWidth(100)) > 800;

const width = 360;

const f = (z: number) => {
  const x = (16 / 9) * width;

  return (100 * z) / Math.sqrt(x ** 2 + width ** 2);
};

const sizes: any = {};

for (let i = 1; i <= 300; i++) {
  sizes[i] = Math.floor(responsiveScreenFontSize(f(i) * (isTablet ? 0.7 : 1)));
}

export {useTheme, sizes, colorWithOpacity, getRbaFromHex};
export default ProviderTheme;
