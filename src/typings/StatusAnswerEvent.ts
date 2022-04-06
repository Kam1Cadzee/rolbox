import {useTheme} from '../context/ThemeContext';

enum StatusAnswerEvent {
  invited = 'invited',
  yes = 'yes',
  no = 'no',
  maybe = 'maybe',
  deleted = 'deleted',
}

const useGetColorsEvent = (status?: StatusAnswerEvent) => {
  const {green, yellow, red, greenDark, yellowDark, redDark} = useTheme();

  if (!status) {
    return {
      bg: undefined,
      color: undefined,
    };
  }

  switch (status) {
    case StatusAnswerEvent.yes:
      return {
        bg: green,
        color: greenDark,
      };
    case StatusAnswerEvent.no:
      return {
        bg: red,
        color: redDark,
      };
    case StatusAnswerEvent.maybe:
      return {
        bg: yellow,
        color: yellowDark,
      };
  }
};

export {useGetColorsEvent};
export default StatusAnswerEvent;
