import {useEffect, useRef} from 'react';

const useDidUpdateEffect = (fn: Function, inputs: any[]) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
};

export default useDidUpdateEffect;
