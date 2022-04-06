import React, {useMemo} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useFormattingContext} from '../../context/FormattingContext';
import {sizes, useTheme} from '../../context/ThemeContext';
import IUnit from '../../typings/IUnit';
import TypeTime, {ExtensionTime} from '../../typings/TypeTime';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/t';
import MyText from '../controls/MyText';

interface IEventInfoDateProps {
  date: Date;
  time?: IUnit<TypeTime, string>;
  textTime?: string;
  style?: StyleProp<ViewStyle>;
  styleDate?: StyleProp<TextStyle>;
  styleTime?: StyleProp<TextStyle>;
}

const EventInfoDate = ({date, time, style, styleDate, styleTime, textTime = ''}: IEventInfoDateProps) => {
  const {formatDateStr} = useFormattingContext();
  const {lightText, text} = useTheme();
  const isCurrentYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return currentYear === date.getFullYear();
  }, [date]);

  const strTime = time ? ExtensionTime.formatTime(time.value) : textTime;

  return (
    <View style={[styles.con, style]}>
      <MyText style={[styles.date, styleDate]}>
        {formatDateStr(date, 'dd MM')}{' '}
        {!isCurrentYear && (
          <MyText
            style={{
              fontFamily: getFontFamily(700),
            }}>
            {date.getFullYear()}
          </MyText>
        )}
      </MyText>

      <MyText
        style={[
          styles.time,
          {
            color: time ? text : lightText,
          },
          styleTime,
        ]}>
        {strTime}
      </MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    width: sizes[55],
  },
  date: {
    fontFamily: getFontFamily(500),
    marginBottom: sizes[1],
    textAlign: 'center',
  },
  time: {
    fontSize: sizes[10],
    textAlign: 'center',
  },
});
export default EventInfoDate;
