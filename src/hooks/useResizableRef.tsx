import { RefCallback, RefObject, useCallback, useEffect, useRef } from 'react';

const useResizableRef = <T extends HTMLElement>(
  callback: (width: number, height: number) => void
): { ref: RefObject<T>; setRef: RefCallback<T> } => {
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const ref = useRef<T | null>(null);

  // Custom ref setter.
  const setRef = useCallback(
    (node: T) => {
      if (!node || node === ref.current) return;

      // Clean up previous observer.
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
        resizeObserver.current = null;
      }

      // Create new observer.
      resizeObserver.current = new ResizeObserver((e) => {
        const { width, height } = e[0].contentRect;
        callback(width, height);
      });

      resizeObserver.current.observe(node);

      ref.current = node;
    },
    [callback]
  );

  useEffect(() => {
    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
    };
  }, []);

  return { ref, setRef };
};

export default useResizableRef;
