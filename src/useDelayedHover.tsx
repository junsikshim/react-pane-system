'use client';

import { useRef, useState } from 'react';

const useDelayedHover = (delayMs: number = 300) => {
  const [hover, setHover] = useState(false);
  const timeout = useRef<number | null>(null);

  const onPointerEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setHover(true), delayMs);
  };

  const onPointerLeave = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setHover(false);
  };

  return {
    hover,
    onPointerEnter,
    onPointerLeave
  };
};

export default useDelayedHover;
