import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useFormattingContext} from '../../context/FormattingContext';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import {IEvent, IEventData, IEventDataItem} from '../../typings/IEvent';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';
import Calendar from './Calendar';

interface ICalendarScrollMonthProps {
  eventsData?: IEventData;
  isFollowedNextMonth?: boolean;
  onSelectedDate?: (date: Date, events?: IEventDataItem[]) => void;
  selectedDate?: Date;
  styleCon?: StyleProp<ViewStyle>;
  onChange?: (d: Date) => void;
}
const {width} = Dimensions.get('screen');
const widthMonth = sizes[100];

const CalendarScrollMonth = ({
  isFollowedNextMonth = false,
  eventsData,
  onSelectedDate,
  selectedDate,
  styleCon,
  onChange,
}: ICalendarScrollMonthProps) => {
  const refScroll = useRef<any>();
  const {border, text, lightText} = useTheme();
  const {payload} = useFormattingContext();
  const [pointDate, setPointDate] = useState(new Date());
  const indexMonth = useMemo(() => pointDate.getMonth(), [pointDate]);
  const {longMonths, shortWeek, dayOfWeek} = payload;

  const handleSelectMonth = (month: number, year: number = pointDate.getFullYear()) => {
    if (pointDate.getMonth() === month && year === pointDate.getFullYear()) {
      return;
    }
    setPointDate((date) => {
      const newDate = new Date(date);
      newDate.setFullYear(year, month, 1);
      return newDate;
    });
  };

  useEffect(() => {
    onChange && onChange(pointDate);
  }, [pointDate]);

  const handleSelectDate = (date: Date, events?: IEventDataItem[]) => {
    onSelectedDate && onSelectedDate(date, events);
  };

  const scrollToMonth = () => {
    refScroll.current?.scrollTo({
      x: widthMonth * indexMonth - width / 3,
      animated: false,
    });
  };

  useDidUpdateEffect(() => {
    scrollToMonth();
  }, [indexMonth]);

  return (
    <View
      style={[
        {
          backgroundColor: colorWithOpacity(border, 0.1),
          padding: sizes[20],
        },
        styleCon,
      ]}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        onLayout={scrollToMonth}
        ref={refScroll}
        style={{
          marginRight: -sizes[20],
        }}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        horizontal={true}>
        {longMonths.map((month, i) => {
          const currentMonth = pointDate.getMonth();
          return (
            <TouchableOpacityGestureDelay
              key={i}
              onPress={() => handleSelectMonth(i)}
              style={{
                width: widthMonth,
                alignItems: 'center',
              }}>
              <MyText
                style={[
                  currentMonth === i ? styles.selectedMonth : styles.textMonth,
                  {
                    color: currentMonth === i ? text : lightText,
                    paddingVertical: sizes[20],
                  },
                ]}>
                {month}
              </MyText>
            </TouchableOpacityGestureDelay>
          );
        })}
      </ScrollView>
      <Calendar
        isFollowedNextMonth={isFollowedNextMonth}
        eventsData={eventsData}
        onSelectedMonth={handleSelectMonth}
        onSelectedDate={handleSelectDate}
        pointDate={pointDate}
        namesWeek={shortWeek}
        firstDayOfMonth={dayOfWeek}
        selectedDate={selectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectedMonth: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[20],
  },
  textMonth: {
    fontFamily: getFontFamily(400),
    fontSize: sizes[16],
  },
});
export default CalendarScrollMonth;
