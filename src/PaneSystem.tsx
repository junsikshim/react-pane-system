'use client';

import {
  PropsWithChildren,
  useEffect,
  useState,
  Children,
  useMemo,
  ReactElement,
  useCallback,
  useRef,
  createElement
} from 'react';
import { PaneRowProps, InnerPaneRow } from './PaneRow';
import { sizeToPixels, limit } from './utils';

interface PaneSystemProps {
  width?: string;
  height?: string;
}

export type Size = {
  width: number;
  height: number;
};

const PaneSystem = ({
  width: systemWidth = '100%',
  height: systemHeight = '100%',
  children
}: PropsWithChildren<PaneSystemProps>) => {
  const ref = useRef<HTMLDivElement>(null);

  // Container size in pixels.
  const [containerSize, setContainerSize] = useState<Size>({
    width: 0,
    height: 0
  });

  // Row heights in pixels.
  const [rowHeightPxs, setRowHeightPxs] = useState<number[]>([]);

  // Gather PaneRow components.
  const paneRows = useMemo(() => {
    const array = Children.toArray(children);

    if (array.length === 0)
      throw new Error('PaneSystem must have at least one PaneRow.');

    return array as ReactElement<PaneRowProps>[];
  }, [children]);

  // Get the heights of the PaneRow components.
  const rowHeights = useMemo(() => {
    return paneRows.map((row) => row.props.height ?? 'auto');
  }, [paneRows]);

  // Calculate the row min heights in pixels.
  const rowMinHeightPxs = useMemo<number[]>(() => {
    return paneRows.map((r) => {
      const minHeight = r.props.minHeight ?? 0;
      return sizeToPixels(minHeight, containerSize.height);
    });
  }, [paneRows, containerSize]);

  // Calculate the row max heights in pixels.
  const rowMaxHeightPxs = useMemo<number[]>(() => {
    return paneRows.map((r) => {
      const maxHeight = r.props.maxHeight ?? '100%';
      return sizeToPixels(maxHeight, containerSize.height);
    });
  }, [paneRows, containerSize]);

  // Calculate the container size.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((e) => {
      const { width, height } = e[0].contentRect;
      setContainerSize({ width, height });
    });

    if (!ref.current) return;

    resizeObserver.observe(ref.current);
  }, []);

  // Calculate the row heights in pixels.
  useEffect(() => {
    if (containerSize.height === 0) return;

    const nonAutoHeights = rowHeights.filter((h) => h !== 'auto');
    const autoHeights = rowHeights.filter((h) => h === 'auto');

    if (autoHeights.length > 1) {
      throw new Error('Only one row can have an auto height.');
    }

    const nonAutoHeightPxs = nonAutoHeights.map((h) =>
      sizeToPixels(h, containerSize.height)
    );
    const autoHeightPx =
      containerSize.height - nonAutoHeightPxs.reduce((a, b) => a + b, 0);
    const autoHeightIndex = rowHeights.findIndex((h) => h === 'auto');

    if (autoHeightIndex !== -1)
      nonAutoHeightPxs.splice(autoHeightIndex, 0, autoHeightPx);

    setRowHeightPxs(nonAutoHeightPxs);
  }, [containerSize, rowHeights]);

  // Drag handler for the row splitter.
  const onRowSplitterDrag = useCallback(
    (index: number) => (dy: number) => {
      const autoRowIndex = rowHeights.findIndex((h) => h === 'auto');

      if (autoRowIndex === index - 1) {
        // The splitter is on the bottom side of the auto row.
        setRowHeightPxs((prev) => {
          const clone = [...prev];

          const totalHeight = clone[index] + clone[index + 1];
          const bottomHeight = limit(
            clone[index + 1] - dy,
            rowMinHeightPxs[index + 1],
            rowMaxHeightPxs[index + 1]
          );

          clone[index] = totalHeight - bottomHeight;
          clone[index + 1] = bottomHeight;

          return clone;
        });
      } else if (autoRowIndex === index + 1) {
        // The splitter is on the top side of the auto row.
        setRowHeightPxs((prev) => {
          const clone = [...prev];

          const totalHeight = clone[index] + clone[index + 1];
          const topHeight = limit(
            clone[index] + dy,
            rowMinHeightPxs[index],
            rowMaxHeightPxs[index]
          );

          clone[index] = topHeight;
          clone[index + 1] = totalHeight - topHeight;

          return clone;
        });
      }
    },
    [setRowHeightPxs, rowHeights, rowMinHeightPxs, rowMaxHeightPxs]
  );

  const rows = useMemo(() => {
    let top = 0;

    return paneRows.map((row, index) => {
      const r = createElement(
        InnerPaneRow,
        {
          key: index,
          index,
          containerWidth: containerSize.width,
          top,
          height: rowHeightPxs[index],
          splitter: row.props.splitter,
          onSplitterDrag: onRowSplitterDrag(index)
        },
        row.props.children
      );

      top += rowHeightPxs[index];

      return r;
    });
  }, [paneRows, rowHeightPxs, containerSize.width, onRowSplitterDrag]);

  return (
    <div
      ref={ref}
      className="pane-system"
      style={{ width: systemWidth, height: systemHeight, position: 'relative' }}
    >
      {rows}
    </div>
  );
};

export default PaneSystem;
