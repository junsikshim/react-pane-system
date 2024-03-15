'use client';

import useDelayedHover from './useDelayedHover';
import { useEffect, useRef } from 'react';

interface RowSplitterProps {
  offsetTop: number;
  onDrag: (dy: number) => void;
  height?: number;
  color?: string;
}

type DragState = {
  startY: number;
  currentY: number;
};

const RowSplitter = ({
  offsetTop,
  onDrag,
  height = 4,
  color = '#fff'
}: RowSplitterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const { isHover, onPointerEnter, onPointerLeave } = useDelayedHover();

  useEffect(() => {
    if (!ref.current) return;

    const splitter = ref.current;

    const onPointerDown = (e: PointerEvent) => {
      if (!splitter) return;
      console.log('row');
      // splitter.setPointerCapture(e.pointerId);

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

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
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
      className="splitter"
      style={{
        position: 'absolute',
        width: '100%',
        height: `${height}px`,
        left: 0,
        background: isHover ? color : 'transparent',
        cursor: 'row-resize',
        zIndex: 10,
        transition: 'background-color 0.2s',
        transform: `translateY(${offsetTop - height / 2}px)`
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
};

export default RowSplitter;
