'use client';

import {
  CSSProperties,
  Children,
  PropsWithChildren,
  ReactElement,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { InnerPane, PaneProps } from './Pane';
import { sizeToPixels, limit, createId } from './utils';
import { SplitterRegistry } from './splitter/SplitterRegistry';
import { PaneSystemRectContext } from './registry/PaneSystemRectContext';
import useIsomorphicLayoutEffect from './hooks/useIsomorphicLayoutEffect';

export interface PaneRowProps extends PropsWithChildren {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  splitter?: 'top' | 'bottom';
  splitterHeight?: number;
  splitterColor?: string;
  splitterStyles?: CSSProperties;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyles?: CSSProperties;
  gap?: number;
  styles?: CSSProperties;
}

const PaneRow = ({ children }: PaneRowProps) => children;
PaneRow.displayName = 'PaneRow';

export default PaneRow;

export interface InnerPaneRowProps {
  index: number;
  totalRows: number;
  containerWidth: number;
  containerHeight: number;
  top: number;
  height: number;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyles?: CSSProperties;
  gap: number;
  styles?: CSSProperties;
}

export const InnerPaneRow = ({
  index,
  totalRows,
  containerWidth,
  top,
  height,
  bgColor,
  borderWidth,
  borderColor,
  borderStyles,
  gap,
  styles = {},
  children
}: PropsWithChildren<InnerPaneRowProps>) => {
  const ref = useRef<HTMLDivElement>(null);
  const splitterIds = useRef<string[]>([]);

  const { addSplitter } = useContext(SplitterRegistry);
  const { containerRect } = useContext(PaneSystemRectContext);

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
      return sizeToPixels(maxWidth, containerWidth) - gap;
    });
  }, [panes, containerWidth, gap]);

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
    const totalGapPx = nonAutoWidthPxs.length * gap;
    const autoWidthPx =
      containerWidth - nonAutoWidthPxs.reduce((a, b) => a + b, 0) - totalGapPx;
    const autoWidthIndex = paneWidths.findIndex((w) => w === 'auto');

    if (autoWidthIndex !== -1)
      nonAutoWidthPxs.splice(autoWidthIndex, 0, autoWidthPx);

    setPaneWidthPxs(nonAutoWidthPxs);
  }, [containerWidth, gap, paneMaxWidthPxs, paneMinWidthPxs, paneWidths]);

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
          bgColor: pane.props.bgColor ?? bgColor,
          borderWidth: pane.props.borderWidth ?? borderWidth,
          borderColor: pane.props.borderColor ?? borderColor,
          borderStyles: pane.props.borderStyles ?? borderStyles,
          styles: pane.props.styles ?? styles
        },
        pane.props.children
      );

      left += paneWidthPxs[index] + gap;

      return c;
    });
  }, [
    bgColor,
    borderColor,
    borderStyles,
    borderWidth,
    gap,
    paneWidthPxs,
    panes,
    styles
  ]);

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

          const totalWidth = clone[index - 1] + clone[index] + gap;
          const rightWidth = limit(clone[index] - dx, min, max);

          clone[index - 1] = totalWidth - rightWidth - gap;
          clone[index] = rightWidth;

          return clone;
        });
      } else if (autoPaneIndex === index + 1) {
        // The splitter is on the left side of the auto pane.
        setPaneWidthPxs((prev) => {
          const clone = [...prev];

          const totalWidth = clone[index] + clone[index + 1] + gap;
          const leftWidth = limit(clone[index] + dx, min, max);

          clone[index] = leftWidth;
          clone[index + 1] = totalWidth - leftWidth - gap;

          return clone;
        });
      }
    },
    [paneWidths, paneMinWidthPxs, paneMaxWidthPxs, gap]
  );

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    let left = 0;

    panes.forEach((pane, index) => {
      left += paneWidthPxs[index] + gap;

      // Add a splitter if the column has a splitter.
      if (pane.props.splitter === 'left' || pane.props.splitter === 'right') {
        const x =
          rect.x +
          left -
          gap / 2 +
          (pane.props.splitter === 'left' ? -paneWidthPxs[index] : 0) -
          containerRect.left;
        const y = rect.y - containerRect.top;
        const sWidth = pane.props.splitterWidth ?? 4;
        const sHeight = height;
        const color = pane.props.splitterColor ?? 'rgba(0, 0, 0, 0.2)';
        const styles = pane.props.splitterStyles ?? {};
        const boundMinX = rect.x;
        const boundMaxX = rect.x + paneWidthPxs[index];
        const boundMinY = y;
        const boundMaxY = y + sHeight;

        // Return if the positions are invalid.
        if (Number.isNaN(x) || Number.isNaN(y)) return;

        let id = splitterIds.current[index];

        // Keep track of the splitter IDs.
        if (!id) {
          id = createId();
          splitterIds.current[index] = id;
        }

        addSplitter({
          id,
          orientation: 'vertical',
          x,
          y,
          width: sWidth,
          height: sHeight,
          color,
          styles,
          bounds: {
            minX: boundMinX,
            minY: boundMinY,
            maxX: boundMaxX,
            maxY: boundMaxY
          },
          onDrag: onPaneSplitterDrag(index)
        });
      }
    });
  }, [
    addSplitter,
    containerRect.left,
    containerRect.top,
    gap,
    height,
    onPaneSplitterDrag,
    paneWidthPxs,
    panes
  ]);

  return (
    <div
      ref={ref}
      className="pane-row"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        position: 'absolute',
        width: '100%',
        ...styles
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
            zIndex: 1,
            ...borderStyles
          }}
        />
      )}

      {cols}
    </div>
  );
};
