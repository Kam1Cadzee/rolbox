import {StyleSheet} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes} from '../context/ThemeContext';

const STYLES = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowC: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowSB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSBC: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventBlock: {
    borderRadius: sizes[4],
    padding: sizes[16],
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventShadow: {
    shadowColor: 'rgb(141, 155, 167)',
    shadowOffset: {
      width: 0,
      height: sizes[16],
    },
    shadowOpacity: 0.18,
    shadowRadius: sizes[20],
  },
});

const WIDTH_EVENT_PANEL = responsiveScreenWidth(70);

export {WIDTH_EVENT_PANEL};
export default STYLES;
