'use client';

import { SplitterIntersection, SplitterRegistry } from './SplitterRegistry';
import useDelayedHover from '../hooks/useDelayedHover';
import { useContext, useEffect, useRef } from 'react';

interface SplitterIntersectionHandleProps {
  intersection: SplitterIntersection;
}

type DragState = {
  startX: number;
  currentX: number;
  startY: number;
  currentY: number;
};

const SplitterIntersectionHandle = ({
  intersection
}: SplitterIntersectionHandleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const { isHover, onPointerEnter, onPointerLeave } = useDelayedHover();
  const { setCurrentSplitterIds } = useContext(SplitterRegistry);
  const {
    x: handleX,
    y: handleY,
    width: handleWidth,
    height: handleHeight,
    splitter1,
    splitter2
  } = intersection;

  useEffect(() => {
    if (!ref.current) return;

    const s = ref.current;

    const onPointerDown = (e: PointerEvent) => {
      if (!s) return;

      s.setPointerCapture(e.pointerId);

      dragState.current = {
        startX: e.clientX,
        currentX: e.clientX,
        startY: e.clientY,
        currentY: e.clientY
      };

      setCurrentSplitterIds([splitter1.id, splitter2.id]);

      const onPointerMove = (e: PointerEvent) => {
        if (!s) return;
        if (!dragState.current) return;

        const dx = e.clientX - dragState.current.currentX;
        const dy = e.clientY - dragState.current.currentY;

        splitter1.orientation === 'vertical'
          ? splitter1.onDrag(dx)
          : splitter1.onDrag(dy);
        splitter2.orientation === 'vertical'
          ? splitter2.onDrag(dx)
          : splitter2.onDrag(dy);

        dragState.current.currentX = e.clientX;
        dragState.current.currentY = e.clientY;
      };

      const onPointerUp = () => {
        if (!s) return;

        s.releasePointerCapture(e.pointerId);

        dragState.current = null;

        setCurrentSplitterIds([]);

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    s.addEventListener('pointerdown', onPointerDown);

    return () => {
      s.removeEventListener('pointerdown', onPointerDown);
    };
  }, [splitter1, splitter2, setCurrentSplitterIds]);

  // Adjust hover state.
  // TODO - Need to keep hover state while dragging.
  useEffect(() => {
    if (isHover) setCurrentSplitterIds([splitter1.id, splitter2.id]);
    else if (!dragState.current) setCurrentSplitterIds([]);
  }, [isHover, splitter1, splitter2]);

  const x = `${handleX}px`;
  const y = `${handleY}px`;
  const width = `${handleWidth}px`;
  const height = `${handleHeight}px`;

  return (
    <div
      ref={ref}
      className="splitter splitter-handle"
      style={{
        position: 'absolute',
        width,
        height,
        left: x,
        top: y,
        background: 'transparent',
        cursor: 'move',
        zIndex: 11,
        transform: `translate(-${handleWidth / 2}px, -${handleHeight / 2}px)`
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
};

export default SplitterIntersectionHandle;
