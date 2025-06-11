import { RefCallback, RefObject, useCallback, useRef } from 'react';

const useResizableRef = <T extends HTMLElement>(
  callback: (width: number, height: number) => void
): [RefObject<T>, RefCallback<T>] => {
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const ref = useRef<T | null>(null);

  // Custom ref setter.
  const setRef = useCallback(
    (node: T) => {
      if (!node) return;

      // Clean up previous observer.
      if (ref.current) resizeObserver.current?.unobserve(ref.current);

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

  return [ref, setRef];
};

export default useResizableRef;
