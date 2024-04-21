'use client';

import { useRef, useState } from 'react';

const useDelayedHover = (delayMs = 300) => {
  const [isHover, setIsHover] = useState(false);
  const timeout = useRef<number | null>(null);

  const onPointerEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setIsHover(true), delayMs);
  };

  const onPointerLeave = () => {
    if (timeout.current) window.clearTimeout(timeout.current);
    setIsHover(false);
  };

  return {
    isHover,
    onPointerEnter,
    onPointerLeave
  };
};

export default useDelayedHover;
