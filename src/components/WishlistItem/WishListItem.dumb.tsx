import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import Icon, {IName} from '../common/Icons';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import ShadowWrapper from '../common/ShadowWrapper';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import TouchableOpacityGestureDelay from '../controls/TouchableOpacityGestureDelay';

interface IWishListItemProps {
  type: IName;
  title: string;
  extraBtn: any;
  styleCon?: StyleProp<ViewStyle>;
  onPress: any;
  styleTitle?: StyleProp<TextStyle>;
  children?: any;
}

const WishListItem = ({extraBtn, children, title, type, styleCon, onPress, styleTitle}: IWishListItemProps) => {
  const {background, lightText} = useTheme();
  return (
    <ShadowWrapper style={[styles.shadow]}>
      <View style={[styles.con, {backgroundColor: background}, styleCon]}>
        <TouchableOpacityGestureDelay
          onPress={onPress}
          containerStyle={{
            flexGrow: 1,
          }}
          style={styles.viewIcon}>
          <Icon name={type} size={sizes[36]} />
          <View style={styles.viewText}>
            <MyText numberOfLines={2} style={[styles.title, styleTitle]}>
              {title}
            </MyText>
            {children}
          </View>
        </TouchableOpacityGestureDelay>
        {extraBtn}
      </View>
    </ShadowWrapper>
  );
};

const styles = StyleSheet.create({
  con: {
    borderRadius: sizes[4],
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: sizes[15],
  },
  shadow: {
    shadowColor: 'rgb(141, 155, 167)',
    shadowOffset: {
      width: 0,
      height: sizes[16],
    },
    shadowOpacity: 0.15,
    shadowRadius: sizes[40],
  },
  viewIcon: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: sizes[20],
    paddingVertical: sizes[25],
    marginRight: sizes[30],
  },
  viewText: {
    marginLeft: sizes[20],
    justifyContent: 'space-between',
  },
  title: {
    fontSize: sizes[16],
    fontFamily: getFontFamily(500),
  },
});

export default WishListItem;
