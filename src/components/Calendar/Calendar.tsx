import React, {useMemo, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import {DayOfWeek, IEventData, IEvent, FilterEvents, IEventDataItem} from '../../typings/IEvent';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';
import {getFontFamily} from '../../utils/getFontFamily';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';
import ExtensionCalendar, {IItemDate} from '../extensions/ExtensionCalendar';

const {width} = Dimensions.get('screen');
const itemWidth = Math.floor((width - sizes[40]) / 7);

interface ICalendarProps {
  firstDayOfMonth?: DayOfWeek;
  selectedDate?: Date;
  pointDate: Date;
  onSelectedMonth: (month: number, year: number) => void;
  eventsData?: IEventData;
  isFollowedNextMonth?: boolean;
  onSelectedDate?: (date: Date, events?: IEventDataItem[]) => void;
  namesWeek: string[];
  minDate?: Date;
}

const isThisDate = (date: Date, item: IItemDate) => {
  if (!date) {
    return false;
  }

  return item.day === date.getDate() && item.month === date.getMonth() && item.year === date.getFullYear();
};

const compareItemDate = (date1: IItemDate, date2?: Date) => {
  if (!date2) {
    return false;
  }
  const d1 = new Date(date1.year, date1.month, date1.day, 0, 0, 0, 0);
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 0, 0, 0, 0);
  return d1.getTime() < d2.getTime();
};

const getDataEventItem = (eventsData: IEventData, item: IItemDate) => {
  return eventsData[item.year] && eventsData[item.year][item.month] && eventsData[item.year][item.month][item.day];
};

const Calendar = ({
  pointDate = new Date(),
  eventsData,
  selectedDate,
  firstDayOfMonth = DayOfWeek.Mon,
  isFollowedNextMonth = true,
  namesWeek,
  onSelectedMonth,
  onSelectedDate,
  minDate,
}: ICalendarProps) => {
  const {border, text, lightText, secondary, blue, green, yellow} = useTheme();
  const currentDate = useMemo(() => new Date(), []);
  const items = useMemo(() => {
    const res = ExtensionCalendar.getDaysForCurrentMoment(pointDate, firstDayOfMonth);
    return res;
  }, [pointDate]);

  const handleSelectDate = (item: IItemDate) => {
    if (!item.day) {
      return;
    }
    if (!item.isActiveMonth && isFollowedNextMonth) {
      onSelectedMonth(item.month, item.year);
    } else {
      const newDate = new Date(pointDate);
      newDate.setMonth(item.month, item.day);
      if (eventsData) {
        onSelectedDate(newDate, getDataEventItem(eventsData, item)?.events);
      } else {
        onSelectedDate(newDate);
      }
    }
  };

  return (
    <View style={styles.con}>
      <View
        style={[
          styles.viewWeek,
          {
            borderBottomColor: border,
          },
        ]}>
        {ExtensionCalendar.changeWeeks(namesWeek, firstDayOfMonth).map((week, i) => {
          return (
            <MyText style={[styles.textWeek]} key={i}>
              {week}
            </MyText>
          );
        })}
      </View>
      <View style={styles.calendar}>
        {items.map((item, index) => {
          const isCurrentDate = isThisDate(currentDate, item);
          const isSelected = isThisDate(selectedDate, item);

          const isDisabled = compareItemDate(item, minDate);

          const dataEventItem = eventsData && getDataEventItem(eventsData, item);

          let fillProgress = 100;
          if (dataEventItem) {
            fillProgress = 66;
          }
          let colorText = lightText;
          if (item.isActiveMonth) {
            colorText = text;
          }
          if (isCurrentDate || isSelected) {
            colorText = secondary;
          }
          if (isDisabled) {
            colorText = lightText;
          }

          return (
            <TouchableOpacityDelay
              key={index}
              activeOpacity={0.7}
              onPress={isDisabled ? null : () => handleSelectDate(item)}
              style={[
                styles.item,
                isCurrentDate
                  ? {
                      backgroundColor: colorWithOpacity(secondary, 0.1),
                      borderRadius: itemWidth / 2,
                    }
                  : undefined,
              ]}>
              {dataEventItem && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  {dataEventItem.existsEvents.map((ee, i) => {
                    let color = blue;

                    if (ee === StatusAnswerEvent.yes) {
                      color = green;
                    } else if (ee === StatusAnswerEvent.maybe) {
                      color = yellow;
                    }
                    if (ee === FilterEvents.birthday) {
                      return (
                        <View
                          key={i}
                          style={{
                            backgroundColor: '#C1D2E0',
                            borderRadius: sizes[3],
                            height: sizes[5],
                            width: sizes[5],
                            position: 'absolute',
                            bottom: -sizes[40],
                          }}
                        />
                      );
                    }

                    return <Icon key={i} name="EventMenuIcon" size={sizes[12]} fill={color} stroke={color} />;
                  })}
                </View>
              )}
              {isSelected ? (
                <AnimatedCircularProgress
                  rotation={60}
                  duration={300}
                  size={itemWidth}
                  width={1}
                  fill={fillProgress}
                  tintColor={secondary}
                  backgroundColor="transparent">
                  {() => <TextDay day={item.day} colorText={colorText} isActiveMonth={item.isActiveMonth} />}
                </AnimatedCircularProgress>
              ) : (
                <TextDay day={item.day} colorText={colorText} isActiveMonth={item.isActiveMonth} />
              )}
            </TouchableOpacityDelay>
          );
        })}
      </View>
    </View>
  );
};

interface ITextDay {
  day?: number;
  isActiveMonth: boolean;
  colorText: string;
}

const TextDay = React.memo(({colorText, isActiveMonth, day}: ITextDay) => {
  if (!day) {
    return <View />;
  }
  return (
    <MyText
      style={[
        isActiveMonth ? styles.activeDate : styles.passiveDate,
        {
          color: colorText,
        },
      ]}>
      {day}
    </MyText>
  );
});

const styles = StyleSheet.create({
  con: {
    marginTop: sizes[20],
  },
  viewWeek: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: sizes[10],
    marginBottom: sizes[5],
  },
  textWeek: {
    fontFamily: getFontFamily(700),
    fontSize: sizes[12],
    textTransform: 'uppercase',
    textAlign: 'center',
    width: itemWidth,
  },
  calendar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  item: {
    width: itemWidth,
    height: itemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDate: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[14],
  },
  passiveDate: {
    fontFamily: getFontFamily(300),
    fontSize: sizes[14],
  },
});

export default Calendar;
