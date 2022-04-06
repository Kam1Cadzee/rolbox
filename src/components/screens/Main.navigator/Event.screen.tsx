import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {SelectorsEvent} from '../../../redux/event/eventReducer';
import {selectorsUser} from '../../../redux/user/userReducer';
import {FilterEvents, IEvent} from '../../../typings/IEvent';
import IOption from '../../../typings/IOption';
import {IUser} from '../../../typings/IUser';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {getFontFamily} from '../../../utils/getFontFamily';
import {heightTabBarRef} from '../../../utils/navigationRef';
import t from '../../../utils/t';
import VerticalTabs from '../../common/VerticalTabs';
import IconButton from '../../controls/IconButton';
import MyText from '../../controls/MyText';
import EventBirthday from '../../Event/EventBirthday';
import InvitedEvent from '../../Event/InvitedEvent';
import MineEvent from '../../Event/MineEvent';
import {EventScreenProps} from '../../navigators/Main.navigator';

const marginBottom = sizes[10];

const HEIGHT_EVENT = {
  [FilterEvents.birthday]: sizes[55] + marginBottom,
  [FilterEvents.mine]: sizes[65] + marginBottom,
  [FilterEvents.yes]: sizes[65] + marginBottom,
  [FilterEvents.no]: sizes[65] + marginBottom,
  [FilterEvents.maybe]: sizes[65] + marginBottom,
  [FilterEvents.invited]: sizes[300] + marginBottom,
};

const EventScreen = ({navigation, route}: EventScreenProps) => {
  const dispatch = useDispatch();
  const {secondary} = useTheme();
  const {id} = route.params ?? {};
  const [scrollId, setScrollId] = useState<string>();
  const isEmptyEvents = useSelector(SelectorsEvent.isEmpty);
  const mineEvents = useSelector(SelectorsEvent.getEventsWithTypeMine);
  const invitedEvents = useSelector(SelectorsEvent.getEventsWithTypeInvited);
  const newEvents = useSelector(SelectorsEvent.getEventsWithTypeNew);
  const birthdayEvents = useSelector(selectorsUser.getFiendsAsEvents);
  const [openEvent, setOpenEvent] = useState<IEvent | null>(null);
  const refFlatlist = useRef<any>();

  const options: IOption<string, FilterEvents>[] = useMemo(() => {
    return [
      {
        label: t('allEventsType'),
        value: FilterEvents.all,
      },
      {
        label: t('invitedEventsType'),
        value: FilterEvents.invited,
      },
      {
        label: t('mineEventsType'),
        value: FilterEvents.mine,
      },
      {
        label: t('birthdaysEventType'),
        value: FilterEvents.birthday,
      },
    ];
  }, []);
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (e: IEvent) => {
    setOpenEvent((event) => {
      return event === e ? null : e;
    });
  };

  const navigateToCalendar = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'Calendar',
    });
  };

  const getEvents = () => {
    switch (selected.value) {
      case FilterEvents.all:
        return [...mineEvents, ...invitedEvents, ...birthdayEvents];
      case FilterEvents.invited:
        return invitedEvents;
      case FilterEvents.mine:
        return mineEvents;
      case FilterEvents.birthday:
        return birthdayEvents;
    }
  };

  let filterEvents = getEvents().sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
  });

  if (selected.value === options[0].value) {
    filterEvents = [...newEvents, ...filterEvents];
  }

  useDidUpdateEffect(() => {
    if (!scrollId) {
      return;
    }
    if (selected.value !== options[0].value) {
      setSelected(options[0]);
      return;
    }

    const findIndex = filterEvents.findIndex((e) => e.payload._id === scrollId);

    if (findIndex === -1) {
      return;
    }

    setScrollId(undefined);
    refFlatlist.current.scrollToIndex({
      animated: true,
      index: findIndex,
      viewPosition: 0,
    });
    setOpenEvent(filterEvents[findIndex].payload as any);
  }, [scrollId, selected]);

  useEffect(() => {
    navigation.setParams({
      id: null,
    });
    if (id) {
      setScrollId(id);
    }
  }, [id]);

  const measures = useMemo(() => {
    const res: number[] = [];
    let value = 0;
    filterEvents.forEach((item) => {
      res.push(value);
      value += HEIGHT_EVENT[item.type];
    });
    return res;
  }, [filterEvents]);

  const renderItem = (info) => {
    const item = info.item as any;
    const event = item.payload as IEvent;
    const isOpen = event._id === openEvent?._id;

    if (item.type === FilterEvents.birthday) {
      return <EventBirthday user={item.payload as IUser} date={item.date} conStyle={styles.eventBlock} />;
    } else if (item.type === FilterEvents.mine) {
      return <MineEvent onPress={handleSelect} isOpen={isOpen} event={event} conStyle={styles.eventBlock} />;
    } else if (item.type === FilterEvents.invited) {
      return <InvitedEvent onPress={handleSelect} isOpen={isOpen} event={event} conStyle={styles.eventBlock} />;
    } else {
      return (
        <InvitedEvent
          onPress={handleSelect}
          isOpen={isOpen}
          event={event}
          conStyle={styles.eventBlock}
          defaultStatus={event.currentUserStatus}
        />
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View style={styles.topView}>
        <MyText style={styles.title}>{t('titleEvent')}</MyText>
        <IconButton
          onPress={navigateToCalendar}
          icon={{
            name: 'CalendarIcon',
            fill: secondary,
            size: sizes[20],
          }}
        />
      </View>
      <VerticalTabs<string>
        style={{marginHorizontal: sizes[20]}}
        options={options}
        select={selected}
        setOption={setSelected}
        styleText={{
          fontSize: sizes[13],
        }}
      />
      <FlatList
        ref={refFlatlist}
        getItemLayout={(data, index) => {
          return {length: HEIGHT_EVENT[data[index].type], offset: measures[index], index};
        }}
        style={styles.styleScrollView}
        keyExtractor={(item) => item.payload._id}
        contentContainerStyle={[
          styles.contentContainerStyle,
          {
            paddingBottom: heightTabBarRef.current,
          },
        ]}
        data={filterEvents}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: sizes[20],
  },
  title: {
    fontFamily: getFontFamily(700),
    fontSize: sizes[24],
  },
  eventBlock: {
    marginBottom: marginBottom,
    paddingHorizontal: sizes[20],
  },
  styleScrollView: {},
  contentContainerStyle: {
    paddingTop: sizes[10],
  },
});

export default EventScreen;
