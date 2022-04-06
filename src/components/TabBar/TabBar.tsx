import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Platform, StyleSheet, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import Animated, {
  Easing,
  interpolate,
  Transition,
  Transitioning,
  TransitioningView,
  Value,
  Extrapolate,
} from 'react-native-reanimated';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import TabBarAdvancedButton from './TabBarAdvancedButton';
import ModalPlus from '../Modals/ModalPlus';
import ShadowWrapper from '../common/ShadowWrapper';
import Badge from '../common/Badge';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../redux/user/userReducer';
import {SelectorsEvent} from '../../redux/event/eventReducer';
import {normalizeBigNumber} from '../../utils/normalizeData';
import {heightTabBarRef} from '../../utils/navigationRef';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

const TabBar = React.memo((props: BottomTabBarProps) => {
  const {background} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const value = useRef(new Value(0 as any));

  const current = props.state.index;

  const handleClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    Animated.timing(value.current, {
      duration: 200,
      toValue: modalVisible ? 1 : 0,
      easing: Easing.ease,
    }).start();
  }, [modalVisible]);

  return (
    <View
      onLayout={(e) => {
        heightTabBarRef.current = e.nativeEvent.layout.height - insets.bottom + sizes[30];
      }}
      style={[styles.navigatorContainer]}>
      <ModalPlus modalVisible={modalVisible} onClose={handleClose} value={value.current} />
      <ShadowWrapper style={[styles.navigator, styles.shadow]}>
        <Item r={props.state.routes[0]} index={0} current={current} handleClose={handleClose} {...props} />
        <Item r={props.state.routes[1]} index={1} current={current} handleClose={handleClose} {...props} />
        <TabBarAdvancedButton value={value.current} bgColor={background} onPress={() => setModalVisible((s) => !s)} />
        <Item r={props.state.routes[3]} index={3} current={current} handleClose={handleClose} {...props} />
        <Item r={props.state.routes[4]} index={4} current={current} handleClose={handleClose} {...props} />
      </ShadowWrapper>
    </View>
  );
});

interface IItemProps extends BottomTabBarProps {
  r: any;
  index: number;
  current: number;
  handleClose: any;
}
const Item = ({index, r, current, handleClose, descriptors, navigation}: IItemProps) => {
  const {secondary, background} = useTheme();
  const description = descriptors[r.key].options;
  const ref = React.useRef<TransitioningView | null>(null);
  const Icon: any = description.tabBarIcon;
  const value = useRef(new Value(0 as any));

  useEffect(() => {
    if (current === index) {
      Animated.timing(value.current, {
        duration: 500,
        toValue: current === index ? 1 : 0,
        easing: Easing.ease,
      }).start();
    } else {
      value.current.setValue(0);
    }
  }, [current, index]);

  const opacity = interpolate(value.current, {
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.4, 0.1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const scale = interpolate(value.current, {
    inputRange: [0, 0.2, 0.7, 1],
    outputRange: [0, 1, 1.2, 1.6],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <TouchableOpacityGestureDelay
      activeOpacity={0.9}
      key={r.key}
      onPress={() => {
        Keyboard.dismiss();
        ref.current?.animateNextTransition();
        current !== index && handleClose();

        if (index === 1) {
          navigation.navigate('FriendsNavigator', {
            screen: 'Friends',
          });
        } else {
          navigation.navigate(r.name);
        }
      }}
      style={styles.btnStyle}
      containerStyle={[
        styles.btn,
        {
          backgroundColor: background,
        },
      ]}>
      <Transitioning.View ref={ref} transition={transition}>
        <Animated.View
          style={{
            transform: [
              {
                scale,
              },
            ],
            opacity,
            position: 'absolute',
            left: -sizes[8],
            top: -sizes[8],
            zIndex: 1000,
            width: sizes[40],
            height: sizes[40],
            backgroundColor: colorWithOpacity(secondary, 0.1),
            borderRadius: sizes[30],
          }}
        />
        <BadgeTabBarItem name={r.name} />

        {current === index ? (
          <Icon key={1} isCurrent={true} size={sizes[25]} focused />
        ) : (
          <Icon key={2} isCurrent={false} size={sizes[25]} focused={false} />
        )}
      </Transitioning.View>
    </TouchableOpacityGestureDelay>
  );
};

const BadgeTabBarItem = ({name}: any) => {
  const countFriends = useSelector(selectorsUser.getCountFriendsResponses);
  const countEvents = useSelector(SelectorsEvent.getEventsWithTypeNewCount);
  const countObjMessages = useSelector(SelectorsEvent.getUnreadCount);
  const countMessages = Object.values(countObjMessages).reduce((a, b) => a + b, 0);

  if (name === 'FriendsNavigator' && countFriends !== 0) {
    return (
      <Badge
        number={countFriends}
        sizeCircle={sizes[20]}
        type="secondary"
        style={{
          position: 'absolute',
          zIndex: 10,
          right: -sizes[10],
          top: -sizes[6],
        }}
      />
    );
  } else if (name === 'Messenger' && countMessages !== 0) {
    return (
      <Badge
        number={normalizeBigNumber(countMessages)}
        sizeCircle={sizes[20]}
        type="secondary"
        style={{
          position: 'absolute',
          zIndex: 10,
          right: -sizes[10],
          top: -sizes[6],
        }}
      />
    );
  } else if (name === 'Event' && countEvents !== 0) {
    return (
      <Badge
        number={countEvents}
        sizeCircle={sizes[20]}
        type="secondary"
        style={{
          position: 'absolute',
          zIndex: 10,
          right: -sizes[10],
          top: -sizes[6],
        }}
      />
    );
  }
  return null;
};

const transition = (
  <Transition.Together>
    <Transition.Out type="fade" durationMs={150} />
    <Transition.Change interpolation="easeInOut" />
    <Transition.In type="scale" durationMs={150} delayMs={150} />
  </Transition.Together>
);

const styles = StyleSheet.create({
  navigator: {
    flexDirection: 'row',
  },
  navigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    zIndex: 1,
  },
  btnStyle: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.22,
  },
});

export default TabBar;
