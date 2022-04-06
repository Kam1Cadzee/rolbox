import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import StatusAnswerEvent from '../../typings/StatusAnswerEvent';
import t from '../../utils/t';
import CircleStatus from '../common/CircleStatus';
import Icon from '../common/Icons';
import MyText from '../controls/MyText';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

const sizeCircle = sizes[20];
const sizeIcon = sizeCircle / 2.5;

interface IEventAnswerBlockProps {
  onPress: (e: StatusAnswerEvent) => void;
  statusEvent?: StatusAnswerEvent;
}
const EventAnswerBlock = ({onPress, statusEvent}: IEventAnswerBlockProps) => {
  const {lightText, text} = useTheme();

  const options = useMemo(() => {
    return [
      {
        status: StatusAnswerEvent.yes,
        text: t('answerYes'),
      },
      {
        status: StatusAnswerEvent.no,
        text: t('answerNo'),
      },
      {
        status: StatusAnswerEvent.maybe,
        text: t('answerMaybe'),
      },
    ];
  }, []);

  const getColor = (status: StatusAnswerEvent) => {
    if (!statusEvent) {
      return lightText;
    }
    if (status === statusEvent) {
      return lightText;
    }
    return text;
  };

  const getOpacity = (status: StatusAnswerEvent) => {
    if (!statusEvent) {
      return 1;
    }
    if (status === statusEvent) {
      return 0.4;
    }
    return 1;
  };

  return (
    <View style={styles.con}>
      {options.map((opt) => {
        return (
          <TouchableOpacityGestureDelay
            activeOpacity={0.7}
            key={opt.status}
            style={styles.item}
            onPress={() => onPress(opt.status)}>
            <CircleStatus style={{opacity: getOpacity(opt.status)}} statusEvent={opt.status} />
            <MyText
              style={[
                styles.text,
                {
                  color: getColor(opt.status),
                },
              ]}>
              {opt.text}
            </MyText>
          </TouchableOpacityGestureDelay>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: '#F4F9FB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: sizes[20],
    paddingVertical: sizes[16],
    borderBottomRightRadius: sizes[4],
    borderBottomLeftRadius: sizes[4],
  },
  circle: {
    width: sizeCircle,
    height: sizeCircle,
    borderRadius: sizeCircle / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: sizes[10],
    fontSize: sizes[12],
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default EventAnswerBlock;
