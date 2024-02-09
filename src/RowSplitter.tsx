'use client';

import useDelayedHover from './useDelayedHover';
import { useEffect, useRef } from 'react';

interface RowSplitterProps {
  offsetTop: number;
  onDrag: (dy: number) => void;
}

type DragState = {
  startY: number;
  currentY: number;
};

const RowSplitter = ({ offsetTop, onDrag }: RowSplitterProps) => {
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
        startY: e.clientY,
        currentY: e.clientY
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!splitter) return;
        if (!dragState.current) return;

        const dy = e.clientY - dragState.current.currentY;

        onDrag(dy);

        dragState.current.currentY = e.clientY;
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
      className={`splitter absolute w-full h-1.5 left-0 bg-transparent ${hover ? 'bg-gray-300' : ''} cursor-row-resize z-10 transition-colors`}
      style={{
        transform: `translateY(${offsetTop - 3}px)`
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    ></div>
  );
};

export default RowSplitter;
