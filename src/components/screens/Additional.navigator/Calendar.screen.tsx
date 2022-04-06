import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {sizes} from '../../../context/ThemeContext';
import {SelectorsEvent} from '../../../redux/event/eventReducer';
import {selectorsUser} from '../../../redux/user/userReducer';
import {FilterEvents, IEvent, IEventData, IEventDataItem} from '../../../typings/IEvent';
import {IUser} from '../../../typings/IUser';
import StatusAnswerEvent from '../../../typings/StatusAnswerEvent';
import {getFontFamily} from '../../../utils/getFontFamily';
import CalendarScrollMonth from '../../Calendar/CalendarScrollMonth';
import MyText from '../../controls/MyText';
import EmptyEvents from '../../EmptyBlocks/EmptyEvents';
import EventBirthday from '../../Event/EventBirthday';
import InvitedEvent from '../../Event/InvitedEvent';
import MineEvent from '../../Event/MineEvent';
import {CalendarScreenProps} from '../../navigators/Additional.navigator';

const CalendarScreen = ({navigation}: CalendarScreenProps) => {
  const [year, setYear] = useState<number>();
  const [openEvent, setOpenEvent] = useState<IEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [eventItems, setEventItems] = useState<IEventDataItem[]>([]);
  const mineEvents = useSelector(SelectorsEvent.getEventsWithTypeMine);
  const invitedEvents = useSelector(SelectorsEvent.getEventsWithTypeInvited);
  const birthdayEvents = useSelector(selectorsUser.getFiendsAsEvents);
  const eventsData = useMemo(() => {
    const res: IEventData = {};
    [...mineEvents, ...invitedEvents].forEach((e) => {
      if (e.type === StatusAnswerEvent.no) {
        return;
      }
      const year = e.date.getFullYear();
      const month = e.date.getMonth();
      const day = e.date.getDate();

      if (!res[year]) {
        res[year] = {};
      }

      if (!res[year][month]) {
        res[year][month] = {};
      }

      if (!res[year][month][day]) {
        res[year][month][day] = {
          events: [],
          existsEvents: [],
        };
      }
      res[year][month][day].events.push(e);
      if (!res[year][month][day].existsEvents.some((ee) => ee === e.type)) {
        res[year][month][day].existsEvents.push(e.type);
      }
    });

    const year = new Date().getFullYear();
    if (!res[year]) {
      res[year] = {};
    }

    birthdayEvents.forEach((e) => {
      const month = e.date.getMonth();
      const day = e.date.getDate();

      if (!res[year][month]) {
        res[year][month] = {};
      }

      if (!res[year][month][day]) {
        res[year][month][day] = {
          events: [],
          existsEvents: [],
        };
      }
      res[year][month][day].events.push(e);
      if (!res[year][month][day].existsEvents.some((ee) => ee === e.type)) {
        res[year][month][day].existsEvents.push(e.type);
      }
    });

    return res;
  }, [invitedEvents]);

  const handleSelect = (e: IEvent) => {
    setOpenEvent((event) => {
      return event === e ? null : e;
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <MyText style={styles.year}>{year}</MyText>,
    });
  }, [year]);

  const handleChangeDate = (date: Date) => {
    setYear(date.getFullYear());
  };

  const handelSelectedDate = (date: Date, eventItems?: IEventDataItem[]) => {
    setSelectedDate(date);
    setEventItems(eventItems ?? []);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <CalendarScrollMonth
        selectedDate={selectedDate}
        onSelectedDate={handelSelectedDate}
        eventsData={eventsData}
        onChange={handleChangeDate}
        styleCon={{marginBottom: sizes[20]}}
        isFollowedNextMonth
      />
      {eventItems.length > 0 ? (
        <ScrollView
          style={{
            flexGrow: 1,
            height: '90%',
          }}
          contentContainerStyle={{padding: sizes[20], paddingBottom: sizes[150]}}>
          {eventItems.map((item) => {
            const event = item.payload as IEvent;

            if (item.type === FilterEvents.birthday) {
              return (
                <EventBirthday
                  key={item.payload._id}
                  date={item.date}
                  user={item.payload as IUser}
                  conStyle={styles.eventBlock}
                />
              );
            } else if (item.type === FilterEvents.mine) {
              return (
                <MineEvent
                  onPress={handleSelect}
                  isOpen={event === openEvent}
                  event={event}
                  key={item.payload._id}
                  conStyle={styles.eventBlock}
                />
              );
            } else {
              return (
                <InvitedEvent
                  onPress={handleSelect}
                  isOpen={event === openEvent}
                  event={event}
                  key={item.payload._id}
                  conStyle={styles.eventBlock}
                  defaultStatus={event.currentUserStatus}
                />
              );
            }
          })}
        </ScrollView>
      ) : (
        selectedDate !== null && <EmptyEvents />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  year: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[16],
  },
  eventBlock: {
    marginBottom: sizes[10],
  },
});
export default CalendarScreen;
