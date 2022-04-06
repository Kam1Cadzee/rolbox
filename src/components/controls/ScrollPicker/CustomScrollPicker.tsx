import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, FlatList, Platform, StyleProp, ViewStyle, ListRenderItemInfo} from 'react-native';
import IOption from '../../../typings/IOption';
import MyText from '../MyText';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';

const VISIBLE_ITEMS = 3;
const ITEM_HEIGHT = sizes[48];

interface ICustomScrollPickerProps<T> {
  itemHeight?: number;
  visibleItems?: number;
  defaultSelectedIndex: number;
  options: IOption<T, any>[];
  onValueChange: (d: IOption<T, any>, index: number) => void;
  renderItem?: (data: IOption<T, any>, index: number, isSelected: boolean) => any;
  style?: StyleProp<ViewStyle>;
  onEndReachedThreshold?: number;
  onEndReached?: any;
}

const CustomScrollPicker = <T,>({
  itemHeight = ITEM_HEIGHT,
  visibleItems = VISIBLE_ITEMS,
  defaultSelectedIndex,
  options,
  onValueChange,
  renderItem,
  style,
  onEndReached,
  onEndReachedThreshold,
}: ICustomScrollPickerProps<T>) => {
  const {text, lightText} = useTheme();
  const wrapperHeight = itemHeight * visibleItems;
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const sview = useRef(null as null | any);
  const momentumStarted = useRef(false);
  const isScrollTo = useRef(false);
  const dragStarted = useRef(false);
  const timer = useRef(null as null | any);
  const heightEmptyItem = (wrapperHeight - itemHeight) / 2;

  useEffect(() => {
    if (selectedIndex) {
      setTimeout(() => {
        scrollToIndex(selectedIndex);
      }, 0);
    }

    return () => {
      clearTimer();
    };
  }, []);

  useDidUpdateEffect(() => {
    if (selectedIndex > options.length - 1) {
      setTimeout(() => {
        scrollToIndex(defaultSelectedIndex, true);
      }, 0);
    }
  }, [selectedIndex, options]);

  const _renderItem = useCallback(
    (info: ListRenderItemInfo<any>) => {
      const index = info.index;
      const data = info.item;

      if (data === 'header' || data === 'footer') {
        return <View style={{height: heightEmptyItem, flex: 1}} />;
      }
      const isSelected = index - 1 === selectedIndex;

      let item = (
        <MyText
          style={[
            styles.itemText,
            {
              fontFamily: getFontFamily(isSelected ? 500 : 400),
              color: isSelected ? text : lightText,
            },
          ]}>
          {data.label}
        </MyText>
      );

      if (renderItem) {
        item = renderItem(data, index, isSelected);
      }

      return (
        <View style={[styles.itemWrapper, {height: itemHeight}]} key={index}>
          {item}
        </View>
      );
    },
    [selectedIndex],
  );

  const _scrollFix = (e: any) => {
    let y = 0;
    const h = itemHeight;
    if (e.nativeEvent.contentOffset) {
      y = e.nativeEvent.contentOffset.y;
    }
    const index = Math.round(y / h);
    const _y = index * h;
    if (_y !== y) {
      // using scrollTo in ios, onMomentumScrollEnd will be invoked
      if (Platform.OS === 'ios') {
        isScrollTo.current = true;
      }
      sview.current.scrollToOffset({offset: _y});
    }

    if (selectedIndex === index) {
      return;
    }
    const selectedValue = options[index];
    setSelectedIndex(index);
    onValueChange(selectedValue, index);
  };
  const _onScrollBeginDrag = () => {
    dragStarted.current = true;
    if (Platform.OS === 'ios') {
      isScrollTo.current = false;
    }
    clearTimer();
  };
  const _onScrollEndDrag = (e: any) => {
    dragStarted.current = false;
    // if not used, event will be garbaged
    const _e = {
      nativeEvent: {
        contentOffset: {
          y: e.nativeEvent.contentOffset.y,
        },
      },
    };
    clearTimer();
    timer.current = setTimeout(() => {
      if (!momentumStarted.current && !dragStarted.current) {
        _scrollFix(_e);
      }
    }, 10);
  };
  const _onMomentumScrollBegin = () => {
    momentumStarted.current = true;
    clearTimer();
  };

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const _onMomentumScrollEnd = (e: any) => {
    momentumStarted.current = false;
    if (!isScrollTo.current && !momentumStarted.current && !dragStarted.current) {
      _scrollFix(e);
    }
  };

  const scrollToIndex = (ind: number, animated: boolean = false) => {
    setSelectedIndex(ind);

    const y = itemHeight * ind;
    sview.current.scrollToIndex({index: ind, animated});
  };

  return (
    <View
      style={[
        styles.con,
        {
          height: wrapperHeight,
        },
        style,
      ]}>
      <View
        style={[
          styles.centerView,
          {
            top: (wrapperHeight - itemHeight) / 2,
            height: itemHeight,
            borderTopColor: text,
            borderBottomColor: text,
          },
        ]}
      />
      <FlatList
        ref={sview}
        removeClippedSubviews={true}
        maxToRenderPerBatch={9}
        initialNumToRender={3}
        windowSize={5}
        keyExtractor={(item, index) => index.toString()}
        bounces={false}
        getItemLayout={(data, index) => ({length: itemHeight, offset: itemHeight * index, index})}
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={_onMomentumScrollBegin}
        onMomentumScrollEnd={_onMomentumScrollEnd}
        onScrollBeginDrag={_onScrollBeginDrag}
        onScrollEndDrag={_onScrollEndDrag}
        data={['header', ...options, 'footer']}
        renderItem={_renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
      />
    </View>
  );
};

let styles = StyleSheet.create({
  con: {
    overflow: 'hidden',
  },
  centerView: {
    right: 0,
    position: 'absolute',
    left: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: sizes[16],
  },
});

export default CustomScrollPicker;
