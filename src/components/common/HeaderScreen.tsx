import React from 'react';
import {StackHeaderProps} from '@react-navigation/stack';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import IconButton from '../controls/IconButton';
import MyText from '../controls/MyText';
import getHitSlop from '../../utils/getHitSlop';
import ShadowWrapper from './ShadowWrapper';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

const HeaderScreen = ({scene, insets, navigation}: StackHeaderProps) => {
  const {text, background} = useTheme();
  const title = scene.descriptor.options.title || '';
  const {headerRight, headerLeftAction} = scene.descriptor.options;

  if (!headerLeftAction && !navigation.canGoBack()) {
    return null;
  }
  return (
    <ShadowWrapper style={styles.shadow}>
      <View
        style={[
          styles.con,
          {
            paddingTop: Math.max(insets.top, sizes[15]),
            backgroundColor: background,
          },
        ]}>
        <View style={styles.view}>
          <IconButton
            hitSlop={getHitSlop(10)}
            onPress={() => {
              if (headerLeftAction) {
                headerLeftAction();
              } else {
                navigation.goBack();
              }
            }}
            icon={{
              name: 'ArrowLeftIcon',
              size: sizes[16],
              fill: text,
            }}
          />
          <MyText numberOfLines={2} style={styles.text}>
            {title}
          </MyText>
        </View>
        {headerRight && headerRight({tintColor: 'red'})}
      </View>
    </ShadowWrapper>
  );
};

const styles = StyleSheet.create({
  con: {
    padding: sizes[15],
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shadow: {
    shadowColor: 'rgb(141, 155, 167)',
    shadowOffset: {
      width: 0,
      height: sizes[16],
    },
    shadowOpacity: 0.1,
    shadowRadius: sizes[40],
  },
  view: {
    flexDirection: 'row',
  },
  text: {
    fontSize: sizes[16],
    marginLeft: sizes[20],
    maxWidth: responsiveScreenWidth(80),
  },
});
export default HeaderScreen;
