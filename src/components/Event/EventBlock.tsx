import React, {useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IEvent} from '../../typings/IEvent';
import IGuest from '../../typings/IGuest';
import {IWishlist} from '../../typings/IWishlist';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/t';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import TouchableOpacityDelay from '../controls/TouchableOpacityDelay';
import ModalGuests from '../Modals/ModalGuests';
import MiniBlockWishlist from '../WishlistItem/MiniBlockWishlist';

interface IEventBlockProps {
  conStyle?: StyleProp<ViewStyle>;
  event: IEvent;
}

const countGuests = (guests: IGuest[]) => {
  let yes = 0,
    no = 0,
    maybe = 0;

  guests.forEach((e) => {
    if (e.status === StatusAnswerEvent.yes) {
      yes += 1;
    } else if (e.status === StatusAnswerEvent.no || e.status === StatusAnswerEvent.deleted) {
      no += 1;
    } else if (e.status === StatusAnswerEvent.maybe) {
      maybe += 1;
    }
  });
  return {
    yes,
    no,
    maybe,
  };
};
const EventBlock = ({conStyle, event}: IEventBlockProps) => {
  const {lightText, text, backgroundLight} = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const {maybe, no, yes} = countGuests(event.guests);

  const wishlist = event.wishlist as IWishlist;

  return (
    <View style={[styles.con, conStyle]}>
      {isOpen && <ModalGuests guests={event.guests} modalVisible={isOpen} onClose={() => setIsOpen(false)} />}
      <MyText numberOfLines={2} style={styles.title}>
        {event.name}
      </MyText>
      <MyText numberOfLines={2} style={{marginBottom: sizes[6]}}>
        {event.location}
      </MyText>
      <MyText style={[styles.subTitle, {color: lightText}]}>{t('wishlistForEvent')}</MyText>
      <MiniBlockWishlist idEvent={event._id} wishlist={wishlist} />
      <MyText style={[styles.subTitle, {color: lightText}]}>{t('guests')}</MyText>
      <TouchableOpacityDelay onPress={() => setIsOpen(true)} style={[styles.item, {backgroundColor: backgroundLight}]}>
        <Icon name="GuestsIcon" fill={text} size={sizes[16]} />
        <View>
          <MyText style={styles.textItem}>
            {t('guests') + ': '}
            {event.guests.length}
          </MyText>
          <MyText style={[styles.textLittleItem, {color: lightText}]}>
            {yes} {t('answerYes')}, {no} {t('answerNo')}, {maybe} {t('answerMaybe')}
          </MyText>
        </View>
      </TouchableOpacityDelay>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    padding: sizes[16],
  },
  title: {
    fontFamily: getFontFamily(500),
    fontSize: sizes[18],
    marginBottom: sizes[4],
  },
  subTitle: {
    fontSize: sizes[12],
    marginBottom: sizes[4],
    marginTop: sizes[10],
  },
  item: {
    borderRadius: sizes[32],
    paddingVertical: sizes[6],
    paddingHorizontal: sizes[14],
    flexDirection: 'row',
    alignItems: 'center',
    height: sizes[40],
  },
  textItem: {
    fontSize: sizes[12],
    marginLeft: sizes[10],
    textTransform: 'lowercase',
  },
  textLittleItem: {
    fontSize: sizes[10],
    marginLeft: sizes[10],
    textTransform: 'lowercase',
  },
});
export default EventBlock;
