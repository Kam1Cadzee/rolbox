import React, {useCallback, useRef, useState} from 'react';
import {FilterEvents} from '../../typings/IEvent';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import StatusAnswerEvent, {useGetColorsEvent} from '../../typings/StatusAnswerEvent';
import eventService from '../../services/eventService/eventService';
import {useDispatch} from 'react-redux';
import {actionsEvent} from '../../redux/event/eventReducer';
import ReAnimated, {Easing, timing} from 'react-native-reanimated';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import t from '../../utils/t';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ISwipeableEventProps {
  type: FilterEvents;
  children?: any;
  id: string;
}

enum StatusRequest {
  success = 1,
  fail = 2,
  pending = 3,
}
const SwipeableEvent = ({type, children, id}: ISwipeableEventProps) => {
  const {red2} = useTheme();
  const dispatch = useDispatch();
  const refSwipeable = useRef<any>();
  const noColors = useGetColorsEvent(StatusAnswerEvent.no);
  const refAnim = useRef(new ReAnimated.Value(1));
  const [isAnimFinished, setIsAnimFinished] = useState(false);
  const [requestStatus, setRequestSuccess] = useState(StatusRequest.pending);

  const handleDeleteEvent = async () => {
    refSwipeable.current?.close();
    timing(refAnim.current, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
    }).start(() => {
      setIsAnimFinished(true);
    });

    if (type === FilterEvents.invited) {
      const res = await eventService.changeStatus({
        answer: StatusAnswerEvent.deleted,
        id,
      });
      setRequestSuccess(res.success ? StatusRequest.success : StatusRequest.fail);
    } else {
      const res = await eventService.deleteEventById(id);
      setRequestSuccess(res.success ? StatusRequest.success : StatusRequest.fail);
    }
  };

  useDidUpdateEffect(() => {
    if (isAnimFinished) {
      switch (requestStatus) {
        case StatusRequest.pending:
          dispatch(
            actionsEvent.setDeleted({
              id,
              isDeleted: true,
            }),
          );
          break;
        case StatusRequest.success:
          dispatch(actionsEvent.removeEvent(id));
          break;
        case StatusRequest.fail:
          refAnim.current.setValue(1);
          dispatch(
            actionsEvent.setDeleted({
              id,
              isDeleted: false,
            }),
          );
      }
    }
  }, [isAnimFinished, requestStatus]);

  const renderRightActions = useCallback((progress, dragX: Animated.AnimatedInterpolation) => {
    const trans = dragX.interpolate({
      inputRange: [-sizes[80], 0],
      outputRange: [1, 0.8],
    });
    return (
      <AnimatedTouchableOpacity
        onPress={handleDeleteEvent}
        style={{
          borderColor: noColors.bg,
          borderWidth: 1,
          borderRadius: sizes[4],
          marginLeft: sizes[7],
          alignItems: 'center',
          opacity: progress,
          justifyContent: 'center',
          width: sizes[80],
          transform: [{scale: trans}],
        }}>
        <Icon name="TrashIcon" size={sizes[16]} fill={red2} />
        <MyText
          style={{
            color: red2,
            fontFamily: getFontFamily(500),
            marginTop: sizes[3],
          }}>
          {t('delete')}
        </MyText>
      </AnimatedTouchableOpacity>
    );
  }, []);

  return (
    <ReAnimated.View
      style={{
        opacity: refAnim.current,
      }}>
      <Swipeable
        ref={refSwipeable}
        friction={2}
        overshootRight={false}
        useNativeAnimations={true}
        containerStyle={[styles.containerStyle]}
        renderRightActions={renderRightActions}>
        {children}
      </Swipeable>
    </ReAnimated.View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    overflow: 'visible',
  },
});
export default SwipeableEvent;
