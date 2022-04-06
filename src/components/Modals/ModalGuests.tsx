import {Image, StyleSheet, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import MyModal from './MyModal';
import {sizes, useTheme} from '../../context/ThemeContext';
import {UserExtension} from '../../typings/IUser';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';
import VerticalTabs from '../common/VerticalTabs';
import MyText from '../controls/MyText';
import {responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';
import CustomScrollView from '../common/CustomScrollView';
import CircleStatus from '../common/CircleStatus';
import IGuest from '../../typings/IGuest';
import ImageUser from '../Profile/ImageUser';

interface IModalGuestsProps {
  onClose: any;
  modalVisible: boolean;
  guests: IGuest[];
}

const scrollViewHeight = responsiveScreenHeight(50);
const widthScroll = responsiveScreenWidth(100) - sizes[80];

const getValueByStatus = (status: StatusAnswerEvent) => {
  switch (status) {
    case StatusAnswerEvent.yes:
      return 3;
    case StatusAnswerEvent.maybe:
      return 2;
    case StatusAnswerEvent.no:
      return 1;
    case StatusAnswerEvent.deleted:
      return 1;
    default:
      return 0;
  }
};
const sortGuests = (guests: IGuest[]) => {
  return [...guests].sort((a, b) => getValueByStatus(b.status) - getValueByStatus(a.status));
};

const ModalGuests = ({modalVisible, onClose, guests}: IModalGuestsProps) => {
  const {backgroundDark} = useTheme();
  const users = guests;

  const options = useMemo(() => {
    return [
      {
        label: `${guests.length} Guests`,
        value: -1,
      },
      {
        label: 'Yes',
        value: StatusAnswerEvent.yes,
      },
      {
        label: 'Maybe',
        value: StatusAnswerEvent.maybe,
      },
      {
        label: 'No',
        value: StatusAnswerEvent.no,
      },
    ];
  }, [guests]);
  const [selected, setSelected] = useState(options[0]);

  const filterUser =
    selected.value === -1
      ? sortGuests(users)
      : users.filter((u) => {
          if (selected.value === StatusAnswerEvent.no) {
            return u.status === StatusAnswerEvent.no || u.status === StatusAnswerEvent.deleted;
          }
          return u.status === selected.value;
        });

  return (
    <MyModal style={styles.contentModal} modalVisible={modalVisible} onClose={onClose} isClose>
      <React.Fragment>
        <View
          style={[
            styles.topView,
            {
              backgroundColor: backgroundDark,
            },
          ]}>
          <VerticalTabs<string> options={options} select={selected} setOption={setSelected} />
        </View>
        <CustomScrollView
          conStyle={{
            width: widthScroll,
            marginTop: sizes[55],
            marginBottom: sizes[20],
          }}
          scrollViewHeight={scrollViewHeight}>
          {filterUser.map((g) => {
            return (
              <View key={g._id} style={styles.item}>
                <CircleStatus
                  sizeCircle={sizes[16]}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    left: sizes[20],
                    bottom: 0,
                  }}
                  statusEvent={g.status}
                />
                <ImageUser size={sizes[32]} image={UserExtension.image(g.user)} />
                <MyText
                  style={{
                    marginLeft: sizes[10],
                  }}
                  numberOfLines={2}>
                  {UserExtension.fullName(g.user)}
                </MyText>
              </View>
            );
          })}
        </CustomScrollView>
      </React.Fragment>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  contentModal: {
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes[20],
    maxWidth: '80%',
  },
  image: {
    borderRadius: sizes[10],
    width: sizes[32],
    height: sizes[32],
    marginRight: sizes[16],
  },
  topView: {
    height: sizes[75],
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

export default ModalGuests;
