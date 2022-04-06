import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useFormattingContext} from '../../context/FormattingContext';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import {IEvent, IEventData} from '../../typings/IEvent';
import {getFontFamily} from '../../utils/getFontFamily';
import IconButton from '../controls/IconButton';
import MyText from '../controls/MyText';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';
import Calendar from './Calendar';

interface ICalendarControlsProps {
  eventsData?: IEventData;
  isFollowedNextMonth?: boolean;
  onSelectedDate?: (date: Date, events?: IEvent[]) => void;
  selectedDate?: Date;
}

const CalendarControls = ({
  isFollowedNextMonth = false,
  eventsData,
  onSelectedDate,
  selectedDate,
}: ICalendarControlsProps) => {
  const {border, text} = useTheme();
  const {payload, formatDateStr} = useFormattingContext();
  const [pointDate, setPointDate] = useState(new Date());
  const {shortWeek, dayOfWeek} = payload;

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

  const today = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    handleSelectMonth(month, year);
  };

  const prevYear = () => {
    const year = pointDate.getFullYear() - 1;
    const month = pointDate.getMonth();
    handleSelectMonth(month, year);
  };

  const prevMonth = () => {
    const year = pointDate.getFullYear();
    const month = pointDate.getMonth() - 1;
    handleSelectMonth(month, year);
  };

  const nextYear = () => {
    const year = pointDate.getFullYear() + 1;
    const month = pointDate.getMonth();
    handleSelectMonth(month, year);
  };

  const nextMonth = () => {
    const year = pointDate.getFullYear();
    const month = pointDate.getMonth() + 1;
    handleSelectMonth(month, year);
  };

  const handleSelectDate = (date: Date) => {
    onSelectedDate && onSelectedDate(date);
  };

  return (
    <View
      style={{
        backgroundColor: colorWithOpacity(border, 0.1),
        padding: sizes[9],
      }}>
      <View style={styles.viewTitle}>
        <IconButton
          onPress={prevYear}
          icon={{
            name: 'ArrowDoubleLeftIcon',
            fill: text,
            size: sizes[10],
          }}
        />
        <IconButton
          style={styles.btnLeft}
          onPress={prevMonth}
          icon={{
            name: 'ArrowLeftIcon',
            fill: text,
            size: sizes[10],
          }}
        />
        <TouchableOpacityDelay
          style={{
            flexGrow: 1,
          }}
          onPress={today}>
          <MyText style={styles.title}>{formatDateStr(pointDate, 'MMMM yyyy')}</MyText>
        </TouchableOpacityDelay>
        <IconButton
          style={styles.btnRight}
          onPress={nextMonth}
          icon={{
            name: 'ArrowRightIcon',
            fill: text,
            size: sizes[10],
          }}
        />
        <IconButton
          onPress={nextYear}
          icon={{
            name: 'ArrowDoubleRightIcon',
            fill: text,
            size: sizes[10],
          }}
        />
      </View>
      <Calendar
        minDate={new Date()}
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
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes[20],
    paddingVertical: sizes[10],
  },
  title: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[18],
    textAlign: 'center',
  },
  btnLeft: {
    marginHorizontal: sizes[30],
  },
  btnRight: {
    marginHorizontal: sizes[30],
  },
});
export default CalendarControls;
