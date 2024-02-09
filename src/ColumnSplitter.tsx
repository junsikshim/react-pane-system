'use client';

import useDelayedHover from './useDelayedHover';
import { useEffect, useRef } from 'react';

interface ColumnSplitterProps {
  offsetLeft: number;
  onDrag: (dx: number) => void;
}

type DragState = {
  startX: number;
  currentX: number;
};

const ColumnSplitter = ({ offsetLeft, onDrag }: ColumnSplitterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const { hover, onPointerEnter, onPointerLeave } = useDelayedHover();

  useEffect(() => {
    if (!ref.current) return;

    const splitter = ref.current;

    const onPointerDown = (e: PointerEvent) => {
      if (!splitter) return;

      splitter.setPointerCapture(e.pointerId);

      dragState.current = {
        startX: e.clientX,
        currentX: e.clientX
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!splitter) return;
        if (!dragState.current) return;

        const dx = e.clientX - dragState.current.currentX;

        onDrag(dx);

        dragState.current.currentX = e.clientX;
      };

      const onPointerUp = () => {
        if (!splitter) return;

        splitter.releasePointerCapture(e.pointerId);

        dragState.current = null;
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    splitter.addEventListener('pointerdown', onPointerDown);

    return () => {
      splitter.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onDrag]);

  return (
    <div
      ref={ref}
      className={`splitter absolute w-1.5 h-full top-0 bg-transparent ${hover ? 'bg-gray-300' : ''} cursor-col-resize z-10 transition-colors`}
      style={{
        transform: `translateX(${offsetLeft - 3}px)`
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    ></div>
  );
};

export default ColumnSplitter;
