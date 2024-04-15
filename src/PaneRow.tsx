'use client';

import {
  Children,
  PropsWithChildren,
  ReactElement,
  createElement,
  useCallback,
  useMemo,
  useState
} from 'react';
import { InnerPane, PaneProps } from './Pane';
import { sizeToPixels, limit } from './utils';
import RowSplitter from './RowSplitter';
import useIsomorphicLayoutEffect from './hooks/useIsomorphicLayoutEffect';

export interface PaneRowProps extends PropsWithChildren {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  splitter?: 'top' | 'bottom';
  splitterHeight?: number;
  splitterColor?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

const PaneRow = ({ children }: PaneRowProps) => children;

export default PaneRow;

export interface InnerPaneRowProps {
  index: number;
  totalRows: number;
  containerWidth: number;
  top: number;
  height: number;
  splitter?: 'top' | 'bottom';
  splitterHeight?: number;
  splitterColor?: string;
  onSplitterDrag?: (dy: number) => void;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

export const InnerPaneRow = ({
  index,
  totalRows,
  containerWidth,
  top,
  height,
  splitter,
  splitterHeight,
  splitterColor,
  onSplitterDrag,
  bgColor,
  borderWidth,
  borderColor,
  children
}: PropsWithChildren<InnerPaneRowProps>) => {
  // The widths of the Pane components in pixels.
  const [paneWidthPxs, setPaneWidthPxs] = useState<number[]>([]);

  // Gather Pane components in this row.
  const panes = useMemo(() => {
    const array = Children.toArray(children);

    if (array.length === 0)
      throw new Error('PaneRow must have at least one Pane.');

    return array as ReactElement<PaneProps>[];
  }, [children]);

  // Get the widths of the Pane components.
  const paneWidths = useMemo<string[]>(() => {
    return panes.map((p) => p.props.width ?? 'auto');
  }, [panes]);

  // Calculate the column min widths in pixels.
  const paneMinWidthPxs = useMemo<number[]>(() => {
    return panes.map((p) => {
      const minWidth = p.props.minWidth ?? 0;
      return sizeToPixels(minWidth, containerWidth);
    });
  }, [panes, containerWidth]);

  // Calculate the column max widths in pixels.
  const paneMaxWidthPxs = useMemo<number[]>(() => {
    return panes.map((p) => {
      const maxWidth = p.props.maxWidth ?? '100%';
      return sizeToPixels(maxWidth, containerWidth);
    });
  }, [panes, containerWidth]);

  // Calculate the column widths in pixels.
  useIsomorphicLayoutEffect(() => {
    if (containerWidth === 0) return;

    const nonAutoWidths = paneWidths.filter((w) => w !== 'auto');
    const autoWidths = paneWidths.filter((w) => w === 'auto');

    if (autoWidths.length > 1) {
      throw new Error('Only one Pane can have auto width');
    }

    const nonAutoWidthPxs = nonAutoWidths
      .map((w) => sizeToPixels(w, containerWidth))
      .map((n, i) => limit(n, paneMinWidthPxs[i], paneMaxWidthPxs[i]));

    const autoWidthPx =
      containerWidth - nonAutoWidthPxs.reduce((a, b) => a + b, 0);
    const autoWidthIndex = paneWidths.findIndex((w) => w === 'auto');

    if (autoWidthIndex !== -1)
      nonAutoWidthPxs.splice(autoWidthIndex, 0, autoWidthPx);

    setPaneWidthPxs(nonAutoWidthPxs);
  }, [containerWidth, paneWidths, paneMinWidthPxs, paneMaxWidthPxs]);

  // Drag handler for the splitters.
  const onPaneSplitterDrag = useCallback(
    (index: number) => (dx: number) => {
      const autoPaneIndex = paneWidths.findIndex((w) => w === 'auto');
      const min = paneMinWidthPxs[index];
      const max = paneMaxWidthPxs[index];

      if (autoPaneIndex === index - 1) {
        // The splitter is on the right side of the auto pane.
        setPaneWidthPxs((prev) => {
          const clone = [...prev];

          const totalWidth = clone[index - 1] + clone[index];
          const rightWidth = limit(clone[index] - dx, min, max);

          clone[index - 1] = totalWidth - rightWidth;
          clone[index] = rightWidth;

          return clone;
        });
      } else if (autoPaneIndex === index + 1) {
        // The splitter is on the left side of the auto pane.
        setPaneWidthPxs((prev) => {
          const clone = [...prev];

          const totalWidth = clone[index] + clone[index + 1];
          const leftWidth = limit(clone[index] + dx, min, max);

          clone[index] = leftWidth;
          clone[index + 1] = totalWidth - leftWidth;

          return clone;
        });
      }
    },
    [paneWidths, paneMinWidthPxs, paneMaxWidthPxs]
  );

  const cols = useMemo(() => {
    let left = 0;

    return panes.map((pane, index) => {
      const c = createElement(
        InnerPane,
        {
          key: index,
          index,
          totalPanes: panes.length,
          left,
          width: paneWidthPxs[index],
          splitter: pane.props.splitter,
          splitterWidth: pane.props.splitterWidth,
          splitterColor: pane.props.splitterColor,
          onSplitterDrag: onPaneSplitterDrag(index),
          bgColor: pane.props.bgColor ?? bgColor,
          borderWidth: pane.props.borderWidth ?? borderWidth,
          borderColor: pane.props.borderColor ?? borderColor
        },
        pane.props.children
      );

      left += paneWidthPxs[index];

      return c;
    });
  }, [panes, paneWidthPxs, onPaneSplitterDrag]);

  return (
    <div
      className="pane-row"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        position: 'absolute',
        width: '100%'
      }}
    >
      {/* Border on the bottom side of the row */}
      {index !== totalRows - 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${borderWidth}px`,
            backgroundColor: borderColor,
            zIndex: 1
          }}
        />
      )}

      {splitter === 'top' && onSplitterDrag && (
        <RowSplitter
          offsetTop={0}
          onDrag={onSplitterDrag}
          height={splitterHeight}
          color={splitterColor}
        />
      )}

      {cols}

      {splitter === 'bottom' && onSplitterDrag && (
        <RowSplitter
          offsetTop={height}
          onDrag={onSplitterDrag}
          height={splitterHeight}
          color={splitterColor}
        />
      )}
    </div>
  );
};
