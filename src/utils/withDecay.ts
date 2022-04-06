import Animated, {
  Clock,
  Value,
  add,
  block,
  cond,
  eq,
  set,
  startClock,
  and,
  not,
  clockRunning,
  timing,
  Easing,
  stopClock,
  call,
} from 'react-native-reanimated';
import {State} from 'react-native-gesture-handler';
// @ts-ignore
import {snapPoint} from 'react-native-redash/lib/module/v1';
import {ITEM_HEIGHT} from '../components/controls/ScrollPicker/ScrollPicker';

interface WithDecayParams {
  value: Animated.Adaptable<number>;
  velocity: Animated.Adaptable<number>;
  state: Animated.Node<State>;
  offset: Animated.Value<number>;
  snapPoints: number[];
  defaultKey?: number;
  onFinalPositionResolve: (n: number) => any;
}

export const withDecay = (params: WithDecayParams) => {
  const {value, velocity, state: gestureState, offset, defaultKey = 0, snapPoints, onFinalPositionResolve} = {
    ...params,
  };

  const init = new Value(-ITEM_HEIGHT * defaultKey + 0.0001);
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    resolved: new Value(0),
    position: new Value(-ITEM_HEIGHT * defaultKey + 0.0001),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    toValue: new Value(0),
    duration: new Value(1000),
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  };

  return block([
    cond(not(init), [set(state.position, offset), set(init, 1)]),
    cond(eq(gestureState, State.BEGAN), set(offset, state.position)),
    cond(eq(gestureState, State.ACTIVE), [
      set(state.position, add(offset, value)),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(state.finished, 0),
      set(state.resolved, 0),
      set(config.toValue, snapPoint(state.position, velocity, snapPoints)),
    ]),
    cond(and(not(state.finished), eq(gestureState, State.END)), [
      cond(not(clockRunning(clock)), [
        startClock(clock),
        call([state.position], ([val]) => {
          const limited = Math.min(Math.max(val, snapPoints[snapPoints.length - 1]), snapPoints[0]);

          if (limited === snapPoints[snapPoints.length - 1] || limited === snapPoints[0]) {
            // @ts-ignore
            state.resolved.setValue(1);

            onFinalPositionResolve && onFinalPositionResolve(Math.round(Math.abs(val / ITEM_HEIGHT)));
          }
        }),
      ]),
      timing(clock, state, config),
      cond(state.finished, [
        stopClock(clock),
        cond(
          not(state.resolved),
          call([state.position], ([val]) => {
            onFinalPositionResolve && onFinalPositionResolve(Math.round(Math.abs(val / ITEM_HEIGHT)));
          }),
        ),
      ]),
    ]),
    state.position,
  ]);
};
