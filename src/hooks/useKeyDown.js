import { useState, useEffect } from 'react';

const useKeyDown = targetKey => {
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  useEffect(() => {
    const handleDown = ({ key }) => {
      if (key === targetKey) setIsKeyPressed(true);
    };

    const handleUp = ({ key }) => {
      if (key === targetKey) setIsKeyPressed(false);
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [isKeyPressed, targetKey]);

  return isKeyPressed;
};

export default useKeyDown;
