import React from 'react';
import {TouchableOpacityProps} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GenericTouchableProps} from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';
import {useDelay} from '../../useHooks/useDebounce';

interface TouchableOpacityGestureDelayProps
  extends Omit<TouchableOpacityProps, 'onPressOut' | 'onPressIn' | 'onPress' | 'onLongPress'>,
    GenericTouchableProps {
  children?: any;
}

const TouchableOpacityGestureDelay = React.memo(
  React.forwardRef(({children, onPress, ...props}: TouchableOpacityGestureDelayProps, ref: any) => {
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

export default TouchableOpacityGestureDelay;
