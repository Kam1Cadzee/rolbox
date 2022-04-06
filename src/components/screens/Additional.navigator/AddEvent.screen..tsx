import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useFormattingContext} from '../../../context/FormattingContext';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {actionsEvent} from '../../../redux/event/eventReducer';
import {selectorsUser} from '../../../redux/user/userReducer';
import eventService from '../../../services/eventService/eventService';
import {FilterMessenger} from '../../../typings/IChat';
import {IEvent, IEventClientPost, IEventPost, IEventUpdate} from '../../../typings/IEvent';
import IGuest from '../../../typings/IGuest';
import IUnit from '../../../typings/IUnit';
import {IUser, UserExtension} from '../../../typings/IUser';
import TypeTime, {ExtensionTime} from '../../../typings/TypeTime';
import VisibilityType from '../../../typings/VisibilityType';
import useAxios from '../../../useHooks/useAxios';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import getErrorByObj from '../../../utils/getErrorByObj';
import {getFontFamily} from '../../../utils/getFontFamily';
import getIdObj from '../../../utils/getIdObj';
import normalizeData, {normalizeDate} from '../../../utils/normalizeData';
import t from '../../../utils/t';
import useValidation from '../../../utils/validation';
import Icon from '../../common/Icons';
import RowSelectedUser from '../../common/RowSelectedUser';
import DropdownCalendar from '../../controls/Dropdown/DropdownCalendar';
import DropdownWishlist from '../../controls/Dropdown/DropdownWishlist';
import IconButton from '../../controls/IconButton';
import MyButton, {TypeButton} from '../../controls/MyButton';
import MyInputText from '../../controls/MyInputText';
import MySwitch from '../../controls/MySwitch';
import MyText from '../../controls/MyText';
import TouchableInputWithModal, {TypeInputModal} from '../../controls/TouchableInputWithModal';
import TouchableOpacityGestureDelay from '../../controls/TouchableOpacityGestureDelay';
import ModalAllowAccessToWishlist from '../../Modals/ModalAllowAccessToWishlist';
import {AddEventScreenProps} from '../../navigators/Additional.navigator';
import ImageUser from '../../Profile/ImageUser';

enum TypeControl {
  text,
  dropdown,
  modal,
  date,
  wishlist,
  guests,
}

const useDataEvent = (defaultData?: IEvent) => {
  const validation = useValidation();
  const {formatDate} = useFormattingContext();

  return useMemo(() => {
    return [
      {
        name: 'name',
        label: t('eventName'),
        isRequired: true,
        rules: validation.required,
        type: TypeControl.text,
        defaultValue: defaultData?.name ?? '',
      },
      {
        name: 'date',
        label: t('date'),
        isRequired: true,
        rules: validation.required,
        type: TypeControl.date,
        formatStr: (date?: Date) => {
          if (!date) {
            return undefined;
          }
          return formatDate(date);
        },
        defaultValue: defaultData?.date ?? undefined,
      },
      {
        name: 'time',
        label: t('titleTime'),
        isRequired: false,
        type: TypeControl.modal,
        typeModal: TypeInputModal.time,
        formatStr: (value?: IUnit<TypeTime, string>) => {
          if (!value) {
            return '';
          }
          return ExtensionTime.formatTime(value.value);
        },
        defaultValue: defaultData?.time ?? undefined,
        isRemove: true,
      },
      {
        type: TypeControl.guests,
      },
      {
        name: 'location',
        label: t('location'),
        isRequired: false,
        type: TypeControl.text,
        defaultValue: defaultData?.location ?? '',
      },
      {
        name: 'wishlist',
        label: t('wishlist'),
        isRequired: false,
        type: TypeControl.wishlist,
        defaultValue: undefined,
        placeholder: t('placeholderWishlist'),
      },
    ];
  }, []);
};

const differenceGuests = (origin: IGuest[], guests: IUser[]) => {
  const originUsers = origin.map((o) => o.user) as IUser[];
  const addedUsers: IUser[] = [];
  const removedUsers: IUser[] = [];

  guests.forEach((g) => {
    if (!originUsers.some((og) => og._id === g._id)) {
      addedUsers.push(g);
    }
  });

  originUsers.forEach((g) => {
    if (!guests.some((og) => og._id === g._id)) {
      removedUsers.push(g);
    }
  });

  return {
    addedUsers,
    removedUsers,
  };
};

const AddEventScreen = ({route, navigation}: AddEventScreenProps) => {
  const dispatch = useDispatch();
  const {text} = useTheme();
  const throwIdWishlist = route?.params?.throwIdWishlist;
  const defaultEvent = route?.params?.event;
  const updatedGuests = route?.params?.updatedGuests;
  const items = useDataEvent(defaultEvent);

  // const friends = useSelector(selectorsUser.getFriends);
  // const [guests, setGuests] = useState([...friends, ...friends, ...friends, ...friends]);
  const [guests, setGuests] = useState((defaultEvent?.guests ?? []).map((g) => g.user));
  const [usersForWishlist, setUsersForWishlist] = useState<IUser[]>([]);
  const [usersAlreadyForWishlist, setUsersAlreadyForWishlist] = useState<string[]>([]);
  const [currentIdWishlist, setCurrentIdWishlist] = useState(throwIdWishlist ?? getIdObj(defaultEvent?.wishlist));
  const wishlistForEvent = useSelector(selectorsUser.getWishlistById(currentIdWishlist));
  const wishlistOptions = useSelector(selectorsUser.getOwnedWishlistOptions);
  const defaultWishlist = currentIdWishlist
    ? wishlistOptions.find((w) => w.value === currentIdWishlist)
    : {
        value: -1,
        label: {
          icon: 'ForbiddenIcon',
          name: t('withoutWishlist'),
        },
      };
  const [createSecretChat, setCreateSecretChat] = useState(false);
  const {request, isLoading} = useAxios(defaultEvent ? eventService.updateEvent : eventService.createEvent);
  const {control, handleSubmit, errors, setValue} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  useEffect(() => {
    if (defaultEvent) {
      navigation.setOptions({
        title: t('editEvent'),
      });
    }
  }, []);

  useDidUpdateEffect(() => {
    if (throwIdWishlist) {
      setCurrentIdWishlist(throwIdWishlist);
    } else if (defaultEvent) {
      setCurrentIdWishlist(getIdObj(defaultEvent?.wishlist));
    }
  }, [throwIdWishlist, defaultEvent]);

  useDidUpdateEffect(() => {
    setGuests(updatedGuests ?? []);
  }, [updatedGuests]);

  useDidUpdateEffect(() => {
    setValue('wishlist', defaultWishlist);
  }, [defaultWishlist]);

  const onSubmit = async (data: IEventClientPost) => {
    const fetchData = getFetchData(data);

    const res = await request<IEvent>(fetchData);

    if (res.success) {
      res.data.date = new Date(res.data.date);
      res.data.wishlist = wishlistForEvent;

      res.data.guests.forEach((g) => {
        const findUser = guests.find((u) => u._id === getIdObj(g.user))!;
        if (findUser) {
          g.user = findUser;
        }
      });
      res.data.chats = res.data.chats.filter((c) => {
        if (typeof c !== 'string') {
          return c.type !== FilterMessenger.secret;
        }
        return true;
      });

      dispatch(actionsEvent.addEvent(res.data));
      if (defaultEvent) {
        dispatch(
          actionsEvent.updateMembers({
            chats: res.data.chats.map(getIdObj),
            users: fetchData.data.deletedGuests ?? [],
          }),
        );
      }

      onSubmitFinish();
    }
  };

  const onSubmitFinish = () => {
    if (wishlistForEvent && wishlistForEvent.visibility === VisibilityType.specific) {
      const usersIs: string[] = [];
      const usersNoIs: IUser[] = [];

      wishlistForEvent.showUsers = wishlistForEvent.showUsers ?? [];
      guests.forEach((g) => {
        if (wishlistForEvent.showUsers.some((id) => id === g._id)) {
          usersIs.push(g._id);
        } else {
          usersNoIs.push(g);
        }
      });
      if (usersNoIs.length > 0) {
        setUsersForWishlist(usersNoIs);
        setUsersAlreadyForWishlist(usersIs);
        return;
      }
    }
    navigateToEvent();
  };

  const navigateToEvent = () => {
    navigation.navigate('MainNavigator', {
      screen: 'Event',
    });
  };

  const getFetchData = (data: IEventClientPost) => {
    const {time} = data;

    if (time) {
      const {hour, minute} = ExtensionTime.parseTimeToNumbers(data.time);

      data.date.setHours(hour, minute, 0, 0);
    }
    const wishlist = (data?.wishlist?.value ?? -1) === -1 ? null : data?.wishlist?.value;

    if (defaultEvent) {
      const {addedUsers, removedUsers} = differenceGuests(defaultEvent.guests, guests);

      const fetchData: IEventUpdate = {
        date: normalizeDate(data.date),
        name: normalizeData(data.name),
        wishlist,
        location: normalizeData(data.location),
        time: data.time ?? null,
        newGuests: addedUsers.map((g) => g._id),
        deletedGuests: removedUsers.map((g) => g._id),
        secretChat: defaultEvent.secretChat ? undefined : createSecretChat,
      };
      return {
        id: defaultEvent._id,
        data: fetchData,
      };
    }
    const fetchData: IEventPost = {
      date: normalizeDate(data.date),
      name: normalizeData(data.name),
      secretChat: createSecretChat,
      wishlist: wishlist === null ? undefined : wishlist,
      guests: guests.map((g) => g._id),
      location: normalizeData(data.location),
      time: data.time,
    };

    return fetchData;
  };

  const navigateToAddWishlist = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddWishlist',
      params: {
        isBackToAddEvent: true,
      },
    });
  };

  const navigateToAddGuests = () => {
    navigation.navigate('AdditionalNavigator', {
      screen: 'AddGuests',
      params: {
        guests,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={sizes[70]}
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView>
        {usersForWishlist.length > 0 && (
          <ModalAllowAccessToWishlist
            onClose={() => setUsersForWishlist([])}
            users={usersForWishlist}
            usersAlready={usersAlreadyForWishlist}
            wishlist={wishlistForEvent}
            onSubmit={navigateToEvent}
          />
        )}
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          {items.map((item, i) => {
            if (item.type === TypeControl.guests) {
              return <RowSelectedUser onPress={navigateToAddGuests} users={guests} />;
            }
            return (
              <Controller
                key={i}
                control={control}
                render={({onChange, value}: {onChange: any; value: any}) => {
                  if (item.type === TypeControl.text) {
                    return (
                      <MyInputText
                        isRequired={item.isRequired}
                        label={item.label}
                        onChangeText={onChange}
                        error={getErrorByObj(errors, item.name)}
                        placeholder={item.placeholder ?? ''}
                        defaultValue={item.defaultValue as any}
                      />
                    );
                  } else if (item.type === TypeControl.modal) {
                    return (
                      <TouchableInputWithModal
                        clearValue={undefined}
                        label={item.label}
                        strValue={value && item.formatStr ? item.formatStr(value) : ''}
                        value={value}
                        onSubmit={onChange}
                        type={item.typeModal ?? TypeInputModal.none}
                        isRequired={item.isRequired}
                        rightComponent={
                          item.isRemove &&
                          value && (
                            <IconButton
                              onPress={() => onChange(undefined)}
                              icon={{
                                name: 'TrashIcon',
                                fill: text,
                                size: sizes[14],
                              }}
                            />
                          )
                        }
                      />
                    );
                  } else if (item.type === TypeControl.date) {
                    return (
                      <DropdownCalendar
                        label={item.label}
                        errors={errors}
                        value={item.formatStr(value)}
                        isRequired={item.isRequired}
                        date={value}
                        onChange={onChange}
                        name={item.name}
                      />
                    );
                  } else if (item.type === TypeControl.wishlist) {
                    return (
                      <DropdownWishlist
                        label={t('addWishlist')}
                        isRequired={item.isRequired}
                        errors={errors}
                        name={item.name}
                        value={value}
                        onSelect={(e) => {
                          setCurrentIdWishlist(e.value);
                          onChange(e);
                        }}
                        isWithoutWishlist
                        placeholder={item.placeholder}
                        onPressExtra={navigateToAddWishlist}
                      />
                    );
                  }
                }}
                name={item.name}
                rules={item.rules}
                defaultValue={item.name === 'wishlist' ? defaultWishlist : item.defaultValue!}
              />
            );
          })}
          {(!defaultEvent || (defaultEvent && defaultEvent.chats.length === 1)) && (
            <React.Fragment>
              <View style={styles.viewSecret}>
                <MyText style={styles.title}>{t('createSecretChat')}</MyText>
                <MySwitch checked={createSecretChat} onChecked={setCreateSecretChat} />
              </View>
              <MyText style={styles.text}>{t('createSecretChat2')}</MyText>
            </React.Fragment>
          )}
          <MyButton isLoading={isLoading} onPress={handleSubmit(onSubmit)} type={TypeButton.primary}>
            {t('save')}
          </MyButton>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: sizes[20],
  },
  dropdownStyle: {
    width: responsiveScreenWidth(100) - sizes[20],
    borderWidth: 0,
    padding: 0,

    shadowColor: 'rgb(118, 105, 103)',
    shadowOffset: {
      width: 0,
      height: sizes[4],
    },
    shadowOpacity: 0.2,
    shadowRadius: sizes[20],
    elevation: 10,
    marginTop: sizes[10],
    marginLeft: -sizes[10],
  },
  title: {
    fontFamily: getFontFamily(500),
  },
  text: {
    fontSize: sizes[12],
    marginBottom: sizes[20],
    marginTop: sizes[10],
    width: '80%',
  },
  viewSecret: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default AddEventScreen;
