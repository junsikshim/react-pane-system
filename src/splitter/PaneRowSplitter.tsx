'use client';

import { Splitter, SplitterRegistry } from './SplitterRegistry';
import { useContext, useEffect, useRef } from 'react';
import useDelayedHover from '../hooks/useDelayedHover';

interface PaneRowSplitterProps {
  splitter: Splitter;
}

type DragState = {
  startY: number;
  currentY: number;
};

const PaneRowSplitter = ({ splitter }: PaneRowSplitterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const { isHover, onPointerEnter, onPointerLeave } = useDelayedHover();
  const { currentSplitterIds, setCurrentSplitterIds } =
    useContext(SplitterRegistry);

  useEffect(() => {
    if (!ref.current) return;

    const s = ref.current;

    const onPointerDown = (e: PointerEvent) => {
      if (!s) return;

      s.setPointerCapture(e.pointerId);

      dragState.current = {
        startY: e.clientY,
        currentY: e.clientY
      };

      setCurrentSplitterIds([splitter.id]);

      const onPointerMove = (e: PointerEvent) => {
        if (!s) return;
        if (!dragState.current) return;

        const dy = e.clientY - dragState.current.currentY;

        splitter.onDrag(dy);

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
  }, [splitter, setCurrentSplitterIds]);

  const x = `${splitter.x}px`;
  const y = `${splitter.y}px`;
  const width = `${splitter.width}px`;
  const height = `${splitter.height}px`;
  const color = splitter.color;
  const background =
    isHover || currentSplitterIds.includes(splitter.id) ? color : 'transparent';

  return (
    <div
      ref={ref}
      className="splitter splitter-vertical"
      style={{
        position: 'absolute',
        width,
        height,
        left: x,
        top: y,
        background,
        cursor: 'row-resize',
        zIndex: 10,
        transition: 'background-color 0.2s',
        transform: `translateY(-${splitter.height / 2}px)`,
        ...splitter.styles
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
};

export default PaneRowSplitter;
