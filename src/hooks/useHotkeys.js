import { useEffect, useRef } from 'react';

// keyHandlerMap = {
//   key: callback,
//   eg.
//   'r': reset
// }

export default function useHotKeys(keyHandlerMap, noRepeat = true) {
  // TODO verify map is string and functions

  const targets = Object.keys(keyHandlerMap);
  const keydown = useRef(false);

  useEffect(() => {
    const downHandler = e => {
      // check for long press
      if (keydown.current && noRepeat) return;
      const { key } = e;
      if (targets.includes(key)) {
        keydown.current = true;
        const callback = keyHandlerMap[key];
        callback(e);
      }
    };

    const upHandler = ({ key }) => {
      if (targets.includes(key)) {
        keydown.current = false;
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targets, keyHandlerMap, noRepeat]);
}
