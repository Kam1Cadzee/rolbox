import {useCallback, useRef} from 'react';
import debounce from '../utils/debounce';
import {globalDelayPressRef} from '../utils/navigationRef';

const useDebounce = (f: Function, args: any[] = [], delay = 300) => {
  return useCallback(debounce(f, delay), args);
};

const useDelay = (f: Function, delay = 500) => {
  const refDisabled = useRef(false);
  return (...args: any[]) => {
    if (refDisabled.current) {
      return;
    }
    if (globalDelayPressRef.current) {
      return;
    }
    globalDelayPressRef.current = true;
    refDisabled.current = true;
    f(args);
    setTimeout(() => {
      refDisabled.current = false;
      globalDelayPressRef.current = false;
    }, delay);
  };
};

const useDelayCallback = (f: Function, args: any[] = [], delay = 500) => {
  const refDisabled = useRef(false);
  return useCallback((...args: any[]) => {
    if (refDisabled.current) {
      return;
    }
    if (globalDelayPressRef.current) {
      return;
    }
    refDisabled.current = true;
    globalDelayPressRef.current = true;
    f(args);
    setTimeout(() => {
      refDisabled.current = false;
      globalDelayPressRef.current = false;
    }, delay);
  }, args);
};

export {useDelay, useDelayCallback};
export default useDebounce;
