import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {GenericTouchableProps} from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';
import {useDelay, useDelayCallback} from '../../useHooks/useDebounce';

interface TouchableOpacityDelayProps
  extends TouchableOpacityProps,
    Omit<GenericTouchableProps, 'onPressOut' | 'onPressIn' | 'onPress' | 'onLongPress'> {
  children?: any;
}

const TouchableOpacityDelay = React.memo(
  React.forwardRef(({children, onPress, ...props}: TouchableOpacityDelayProps, ref: any) => {
    const handlePress = useDelay((e) => {
      onPress && onPress(e);
    });

    return (
      <TouchableOpacity onPress={handlePress} ref={ref} {...props}>
        {children}
      </TouchableOpacity>
    );
  }),
);

export default TouchableOpacityDelay;
