import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Modal,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MyText from '../MyText';
import {colorWithOpacity, sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import WrapperInput from '../WrapperInput';
import {isIOS} from '../../../utils/isPlatform';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {TextInput} from 'react-native-gesture-handler';

interface IDropdown<T> {
  label?: string;
  disabled?: boolean;
  withoutBorder?: boolean;
  isRequired?: boolean;
  value?: string;
  accessible?: boolean;
  animated?: boolean;
  isFullWidth?: boolean;

  style?: StyleProp<ViewStyle>;
  styleWrapper?: StyleProp<ViewStyle>;
  styleRowComponent?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  styleTouchable?: StyleProp<ViewStyle>;

  adjustFrame?: any;
  renderButtonComponent?: any;
  onDropdownWillShow?: any;
  onDropdownWillHide?: any;
  defaultShowDropdown?: boolean;
  rightComponent?: any;
  error?: string;
  children?: any;
  isCoverDropdown?: boolean;
}

const Dropdown = <T,>({
  disabled = false,
  defaultShowDropdown = false,
  animated = true,
  isFullWidth = false,
  renderButtonComponent: RenderButtonComponent,
  accessible,
  value = '',
  label,
  withoutBorder,
  isRequired,
  styleWrapper,
  style,
  error,
  children,
  onDropdownWillHide,
  onDropdownWillShow,
  textStyle,
  dropdownStyle,
  styleTouchable,
  adjustFrame,
  rightComponent,
  isCoverDropdown = false,
}: IDropdown<T>) => {
  const {text, border, background} = useTheme();
  const _button = useRef(null as null | any);
  const _buttonFrame = useRef(null as null | any);
  const ref = useRef<any>();
  const refMainView = useRef<any>();
  const [showDropdown, setShowDropdown] = useState(defaultShowDropdown);
  const [heightView, setHeightView] = useState(0);

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

  useEffect(() => {}, []);

  const show = () => {
    _updatePosition(() => {
      setShowDropdown(true);
      onDropdownWillShow && onDropdownWillShow();
    });
  };

  useDidUpdateEffect(() => {
    setShowDropdown(defaultShowDropdown);
  }, [defaultShowDropdown]);

  const hide = () => {
    setShowDropdown(false);
    onDropdownWillHide && onDropdownWillHide();
  };

  useDidUpdateEffect(() => {
    if (error) {
      if (ref && ref.current && ref.current.focus) {
        ref.current.focus();
        Keyboard.dismiss();
      }
    }
  }, [error]);

  const _onButtonPress = () => {
    if (disabled) {
      return;
    }
    show();
  };

  const _renderModal = () => {
    if (showDropdown && _buttonFrame.current) {
      const frameStyle = _calcPosition();
      const animationType = animated ? 'fade' : 'none';

      return (
        <Modal
          animationType={animationType}
          visible
          transparent
          onRequestClose={hide}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}>
          <TouchableWithoutFeedback
            disabled={!showDropdown}
            onPress={() => {
              hide();
            }}>
            <View style={styles.modal}>
              <View
                style={[
                  styles.dropdown,
                  {
                    borderColor: text,
                    backgroundColor: background,
                  },
                  frameStyle,
                  {
                    marginTop: isCoverDropdown ? -Math.max(sizes[50], heightView) : -sizes[4],
                  },
                  dropdownStyle,
                ]}>
                {children(hide)}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  };

  const _calcPosition = () => {
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

  return (
    <View
      style={style}
      onLayout={() => {
        if (_button.current && _button.current.measure) {
          _button.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            setHeightView(height + sizes[1]);
          });
        }
      }}>
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
            styleTouchable,
          ]}>
          {RenderButtonComponent ? (
            RenderButtonComponent
          ) : (
            <View
              style={{
                justifyContent: withoutBorder ? 'flex-start' : 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MyText
                textBreakStrategy={'balanced'}
                numberOfLines={2}
                style={[{fontFamily: getFontFamily(500), marginRight: sizes[10]}, textStyle]}>
                {value}
              </MyText>
              {rightComponent && rightComponent()}
            </View>
          )}
        </TouchableOpacity>
      </WrapperInput>
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
    marginLeft: -sizes[1],
    height: 'auto',
  },
  touchable: {
    padding: sizes[15],
  },
});

export default Dropdown;
