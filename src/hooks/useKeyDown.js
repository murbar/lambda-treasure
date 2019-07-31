import { useState, useEffect } from 'react';

const useKeyDown = targetKey => {
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  useEffect(() => {
    const toggle = ({ key }) => {
      if (key === targetKey) setIsKeyPressed(prev => !prev);
    };

    window.addEventListener('keydown', toggle);
    window.addEventListener('keyup', toggle);
    return () => {
      window.removeEventListener('keydown', toggle);
      window.removeEventListener('keyup', toggle);
    };
  }, [isKeyPressed, targetKey]);

  return isKeyPressed;
};

export default useKeyDown;
