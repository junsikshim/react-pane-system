'use client';

import useDelayedHover from './hooks/useDelayedHover';
import { useEffect, useRef } from 'react';

interface ColumnSplitterProps {
  offsetLeft: number;
  onDrag: (dx: number) => void;
  width?: number;
  color?: string;
}

type DragState = {
  startX: number;
  currentX: number;
};

const ColumnSplitter = ({
  offsetLeft,
  onDrag,
  width = 4,
  color = '#fff'
}: ColumnSplitterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const { isHover, onPointerEnter, onPointerLeave } = useDelayedHover();

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
        width: `${width}px`,
        height: '100%',
        top: 0,
        background: isHover ? color : 'transparent',
        cursor: 'col-resize',
        zIndex: 10,
        transition: 'background-color 0.2s',
        transform: `translateX(${offsetLeft - width / 2}px)`
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
};

export default ColumnSplitter;
