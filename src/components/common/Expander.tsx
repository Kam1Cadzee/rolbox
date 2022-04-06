import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MyText from '../controls/MyText';
import Icon from './Icons';
import {sizes, useTheme} from '../../context/ThemeContext';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IExpanderProps {
  children?: any;
  title: string;
}

const Expander = ({children, title}: IExpanderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {lightText} = useTheme();

  return (
    <React.Fragment>
      <TouchableOpacityGestureDelay
        onPress={() => setIsOpen((s) => !s)}
        style={[
          styles.viewCenter,
          styles.touchable,
          {
            borderBottomWidth: isOpen ? 0 : 1,
            borderTopColor: lightText,
            borderBottomColor: lightText,
          },
        ]}>
        <MyText style={{color: lightText}}>{title}</MyText>
        <Icon name={isOpen ? 'ArrowUpIcon' : 'ArrowDownIcon'} fill={lightText} size={sizes[10]} />
      </TouchableOpacityGestureDelay>
      {isOpen && (
        <View
          style={{
            borderBottomColor: lightText,
            borderBottomWidth: 1,
            paddingBottom: sizes[15],
          }}>
          {children}
        </View>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  viewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchable: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: sizes[15],
    paddingHorizontal: sizes[3],
  },
  extraInfo: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
});
export default Expander;
