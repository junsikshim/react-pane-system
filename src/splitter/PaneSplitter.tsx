'use client';

import { Splitter, SplitterRegistry } from './SplitterRegistry';
import { useContext, useEffect, useRef } from 'react';
import useDelayedHover from '../hooks/useDelayedHover';

interface PaneSplitterProps {
  splitter: Splitter;
}

type DragState = {
  startX: number;
  currentX: number;
};

const PaneSplitter = ({ splitter }: PaneSplitterProps) => {
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
        startX: e.clientX,
        currentX: e.clientX
      };

      setCurrentSplitterIds([splitter.id]);

      const onPointerMove = (e: PointerEvent) => {
        if (!s) return;
        if (!dragState.current) return;

        const dx = e.clientX - dragState.current.currentX;

        splitter.onDrag(dx);

        dragState.current.currentX = e.clientX;
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
      className="splitter splitter-horizontal"
      style={{
        position: 'absolute',
        width,
        height,
        left: x,
        top: y,
        background,
        cursor: 'col-resize',
        zIndex: 10,
        transition: 'background-color 0.2s',
        transform: `translateX(-${splitter.width / 2}px)`,
        ...splitter.styles
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
};

export default PaneSplitter;
