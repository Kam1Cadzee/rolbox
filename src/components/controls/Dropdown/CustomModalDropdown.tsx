import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Modal,
  ActivityIndicator,
  FlatList,
  StyleProp,
  ViewStyle,
  FlatListProps,
  TextStyle,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ListRenderItemInfo,
  Keyboard,
} from 'react-native';
import IOption from '../../../typings/IOption';
import MyText from '../MyText';
import {colorWithOpacity, sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import Icon from '../../common/Icons';
import WrapperInput from '../WrapperInput';
import {isIOS} from '../../../utils/isPlatform';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {TextInput} from 'react-native-gesture-handler';

interface IDropdownItem<T> {
  option: IOption<T>;
  index: number;
}

interface IModalDropdown<T> {
  label: string;
  disabled?: boolean;
  withoutBorder?: boolean;
  isRequired?: boolean;
  multipleSelect?: boolean;
  scrollEnabled?: boolean;
  value?: string;
  options: IOption<T>[];
  accessible?: boolean;
  animated?: boolean;
  isFullWidth?: boolean;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  placeholder?: string;

  style?: StyleProp<ViewStyle>;
  styleWrapper?: StyleProp<ViewStyle>;
  styleRowComponent?: StyleProp<ViewStyle>;
  styleRow?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  defaultTextStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  dropdownTextStyle?: StyleProp<ViewStyle>;
  dropdownTextHighlightStyle?: StyleProp<ViewStyle>;

  dropdownListProps?: FlatListProps<IOption<T>>;
  dropdownTextProps?: any;

  adjustFrame?: any;
  renderRow?: (d: IDropdownItem<T>, onPress: any) => any;
  renderSeparator?: any;
  renderButtonComponent?: any;
  onDropdownWillShow?: any;
  onDropdownWillHide?: any;
  onSelect: (item: IOption<T>, index: number) => void;
  defaultShowDropdown?: boolean;

  extra?: any;
  extraBorder?: boolean;
  error?: string;
}

interface IRenderItemProps<T> extends IDropdownItem<T> {
  style?: StyleProp<ViewStyle>;
}

const RenderItem = <T,>({option, style}: IRenderItemProps<T>) => {
  return <MyText style={[styles.renderText, style]}>{option.label}</MyText>;
};

const CustomModalDropdown = <T,>({
  disabled = false,
  multipleSelect = false,
  defaultShowDropdown = false,
  scrollEnabled = true,
  animated = true,
  isFullWidth = false,
  showsVerticalScrollIndicator = true,
  keyboardShouldPersistTaps = 'never',
  placeholder,
  renderButtonComponent,
  options,
  accessible,
  value = '',
  label,
  withoutBorder,
  isRequired,
  styleWrapper,
  onSelect,
  renderSeparator,
  style,
  error,
  extra,
  extraBorder = true,
  ...props
}: IModalDropdown<T>) => {
  const {text, border, background, primaryLight} = useTheme();
  const _button = useRef(null as null | any);
  const _buttonFrame = useRef(null as null | any);
  const [loading, setLoading] = useState(!options);
  const ref = useRef<any>();
  const [showDropdown, setShowDropdown] = useState(defaultShowDropdown);

  useEffect(() => {
    if (!loading !== !options) {
      setLoading(!options);
    }
  }, [loading, options]);

  const _updatePosition = (callback: any) => {
    if (_button.current && _button.current.measure) {
      _button.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
        _buttonFrame.current = {
          x: px,
          y: py,
          w: width,
          h: height,
        };
        callback && callback();
      });
    }
  };

  const show = () => {
    _updatePosition(() => {
      setShowDropdown(true);
    });
  };

  const hide = () => {
    setShowDropdown(false);
  };

  useDidUpdateEffect(() => {
    if (error) {
      if (ref && ref.current && ref.current.focus) {
        ref.current.focus();
        Keyboard.dismiss();
      }
    }
  }, [error]);

  const _renderButton = () => {
    const {textStyle} = props;
    const ButtonTouchable = renderButtonComponent;

    if (ButtonTouchable) {
      return <ButtonTouchable forwardRef={_button} onPress={_onButtonPress} />;
    }
    return (
      <WrapperInput
        label={label}
        isFocus={showDropdown}
        styleCon={[styleWrapper]}
        innerCon={{
          borderWidth: withoutBorder ? 0 : 1,
        }}
        error={error}
        isRequired={isRequired}>
        <TextInput
          style={{height: 1, maxHeight: 1, position: 'absolute', top: -sizes[30]}}
          editable={true}
          enabled={false}
          ref={ref}
        />
        <TouchableOpacity
          ref={_button}
          disabled={disabled}
          accessible={accessible}
          onPress={_onButtonPress}
          style={[
            styles.touchable,
            {
              backgroundColor: disabled ? colorWithOpacity(border, 0.8) : undefined,
            },
          ]}>
          <View
            style={{
              justifyContent: withoutBorder ? 'flex-start' : 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {!value && placeholder && (
              <MyText textBreakStrategy={'balanced'} numberOfLines={2} style={styles.placeholder}>
                {placeholder}
              </MyText>
            )}
            <MyText
              textBreakStrategy={'balanced'}
              numberOfLines={2}
              style={[{fontFamily: getFontFamily(500), marginRight: sizes[10]}, textStyle]}>
              {value}
            </MyText>
            <Icon name={showDropdown ? 'ArrowUpIcon' : 'ArrowDownIcon'} fill={text} size={sizes[10]} />
          </View>
        </TouchableOpacity>
      </WrapperInput>
    );
  };

  const _onButtonPress = () => {
    if (disabled) {
      return;
    }
    const {onDropdownWillShow} = props;

    if (!onDropdownWillShow || onDropdownWillShow() !== false) {
      show();
    }
  };

  const _renderModal = () => {
    const {dropdownStyle} = props;

    if (showDropdown && _buttonFrame.current) {
      const frameStyle = _calcPosition();
      const animationType = animated ? 'fade' : 'none';

      const Extra = extra;

      return (
        <Modal
          animationType={animationType}
          visible
          transparent
          onRequestClose={_onRequestClose}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}>
          <TouchableWithoutFeedback accessible={accessible} disabled={!showDropdown} onPress={_onModalPress}>
            <View style={styles.modal}>
              <View
                style={[
                  styles.dropdown,
                  {
                    borderColor: text,
                    backgroundColor: background,
                  },
                  dropdownStyle,
                  frameStyle,
                ]}>
                {loading ? _renderLoading() : _renderDropdown()}
                {extra && (
                  <View style={[styles.bottom, {borderTopColor: border, borderTopWidth: extraBorder ? 1 : 0}]}>
                    <Extra onPress={() => setShowDropdown(false)} />
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  };

  const _calcPosition = () => {
    const {dropdownStyle, adjustFrame} = props;
    const dimensions = Dimensions.get('screen');
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;
    let dropdownHeight: any =
      (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) || StyleSheet.flatten(styles.dropdown).height;
    const isString = typeof dropdownHeight === 'string';
    if (isString) {
      dropdownHeight = 0;
    }
    const bottomSpace = windowHeight - _buttonFrame.current.y - _buttonFrame.current.h;
    const rightSpace = windowWidth - _buttonFrame.current.x;
    const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= _buttonFrame.current.y;
    const showInLeft = rightSpace >= _buttonFrame.current.x;
    const positionStyle: any = {
      height: isString ? 'auto' : dropdownHeight,
      top: showInBottom
        ? _buttonFrame.current.y + _buttonFrame.current.h
        : Math.max(0, _buttonFrame.current.y - dropdownHeight),
    };

    if (showInLeft) {
      positionStyle.left = _buttonFrame.current.x;
      if (isFullWidth) {
        positionStyle.right = rightSpace - _buttonFrame.current.w;
      }
    } else {
      const dropdownWidth =
        (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) || (style && StyleSheet.flatten(style).width) || -1;

      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }

      positionStyle.right = rightSpace - _buttonFrame.current.w;
    }

    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  };

  const _onRequestClose = () => {
    const {onDropdownWillHide} = props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      hide();
    }
  };

  const _onModalPress = () => {
    const {onDropdownWillHide} = props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      hide();
    }
  };

  const _renderLoading = () => {
    return <ActivityIndicator size="small" />;
  };

  const _renderDropdown = () => {
    const {dropdownListProps} = props;

    return (
      <FlatList
        {...dropdownListProps}
        data={options}
        scrollEnabled={scrollEnabled}
        keyExtractor={(item, i) => `key-${i}`}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderSeparator}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        indicatorStyle="black"
        persistentScrollbar={true}
        bounces={false}
      />
    );
  };

  const _renderItem = (item: ListRenderItemInfo<IOption<T>>) => {
    const {renderRow, styleRow, styleRowComponent} = props;

    const handlePress = () => _onRowPress(item.item, item.index);
    return (
      <TouchableOpacity style={[styles.renderItem, styleRowComponent]} onPress={handlePress}>
        {renderRow ? (
          renderRow(
            {
              option: item.item,
              index: item.index,
            },
            handlePress,
          )
        ) : (
          <RenderItem style={styleRow} option={item.item} index={item.index} />
        )}
      </TouchableOpacity>
    );
  };

  const _onRowPress = (rowData: IOption<T>, rowID: number) => {
    const {onDropdownWillHide} = props;

    onSelect && onSelect(rowData, rowID);
    if (!multipleSelect && (!onDropdownWillHide || onDropdownWillHide() !== false)) {
      setShowDropdown(false);
    }
  };

  const _renderSeparator = () => {
    if (renderSeparator) {
      const RenderSeparator = renderSeparator;
      return <RenderSeparator />;
    }
    return null;
  };

  return (
    <View style={style}>
      {_renderButton()}
      {_renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flexGrow: 1,
  },
  dropdown: {
    position: 'absolute',
    borderWidth: sizes[1],
    borderRadius: sizes[4],
    justifyContent: 'center',
    marginTop: -sizes[4],
    marginLeft: -sizes[1],
    height: 'auto',
  },
  loading: {
    alignSelf: 'center',
  },
  renderItem: {
    padding: sizes[15],
  },
  renderText: {
    fontFamily: getFontFamily(500),
  },
  touchable: {
    padding: isIOS ? sizes[15] : sizes[16] - sizes[1] / 2,
  },
  bottom: {
    borderTopWidth: 1,
  },
  placeholder: {
    fontFamily: getFontFamily(300),
    fontSize: sizes[14],
  },
});

export default CustomModalDropdown;
