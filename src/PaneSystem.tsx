'use client';

import {
  PropsWithChildren,
  useState,
  Children,
  useMemo,
  ReactElement,
  useCallback,
  createElement,
  createContext,
  useContext,
  Dispatch,
  useRef,
  CSSProperties
} from 'react';
import { PaneRowProps, InnerPaneRow } from './PaneRow';
import { sizeToPixels, limit, createId } from './utils';
import SplitterLayer from './SplitterLayer';
import {
  SplitterRegistry,
  SplitterRegistryProvider
} from './splitter/SplitterRegistry';
import { Size } from './types';
import {
  PaneSystemRectContext,
  PaneSystemRectContextProvider
} from './registry/PaneSystemRectContext';
import useResizableRef from './hooks/useResizableRef';
import PaneSystemContextRegistry, {
  useNestedPaneSystemChecker
} from './registry/PaneSystemPresenceContextRegistry';
import useIsomorphicLayoutEffect from './hooks/useIsomorphicLayoutEffect';

const ContainerSizeContext = createContext<{
  containerSize: Size;
  setContainerSize: Dispatch<Size>;
}>({
  containerSize: { width: 0, height: 0 },
  setContainerSize: () => {}
});

interface CorePaneSystemProps extends PropsWithChildren {
  isRoot?: boolean;
  width?: string;
  height?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyles?: CSSProperties;
  gap?: number;
}

export const paneSystemComponentType = [
  'PaneSystem',
  'PaneRow',
  'Pane'
] as const;
export type PaneSystemComponentType = (typeof paneSystemComponentType)[number];

const CorePaneSystem = ({
  isRoot = false,
  width: systemWidth = '100%',
  height: systemHeight = '100%',
  bgColor = '#4b5563',
  borderWidth = 1,
  borderColor = '#909090',
  borderStyles = {},
  gap = 0,
  children
}: PropsWithChildren<CorePaneSystemProps>) => {
  // Container size in pixels.
  const { containerSize, setContainerSize } = useContext(ContainerSizeContext);

  const { containerRect, setContainerRect } = useContext(PaneSystemRectContext);

  const { ref, setRef } = useResizableRef<HTMLDivElement>((width, height) => {
    if (!ref.current) return;

    // Set the container size.
    setContainerSize({ width, height });

    if (!isRoot) return;

    // Set the container rect if this is the top-level PaneSystem.
    const rect = ref.current.getBoundingClientRect();

    if (
      rect.left === containerRect.left &&
      rect.top === containerRect.top &&
      rect.width === containerRect.width &&
      rect.height === containerRect.height
    )
      return;

    setContainerRect(rect);
  });

  const splitterIds = useRef<string[]>([]);

  const { addSplitter } = useContext(SplitterRegistry);

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
  }, [paneRows, containerSize.height]);

  // Calculate the row max heights in pixels.
  const rowMaxHeightPxs = useMemo<number[]>(() => {
    return paneRows.map((r) => {
      const maxHeight = r.props.maxHeight ?? '100%';
      return sizeToPixels(maxHeight, containerSize.height) - gap;
    });
  }, [paneRows, containerSize.height, gap]);

  // Calculate the row heights in pixels.
  useIsomorphicLayoutEffect(() => {
    if (containerSize.height === 0) return;

    // Return if the row heights have already been calculated.
    if (rowHeightPxs.length > 0) return;

    const nonAutoHeights = rowHeights.filter((h) => h !== 'auto');
    const autoHeights = rowHeights.filter((h) => h === 'auto');

    if (autoHeights.length > 1) {
      throw new Error('Only one row can have an auto height.');
    }

    const nonAutoHeightPxs = nonAutoHeights.map((h) =>
      sizeToPixels(h, containerSize.height)
    );
    const totalGapPx = nonAutoHeightPxs.length * gap;
    const autoHeightPx =
      containerSize.height -
      nonAutoHeightPxs.reduce((a, b) => a + b, 0) -
      totalGapPx;
    const autoHeightIndex = rowHeights.findIndex((h) => h === 'auto');

    if (autoHeightIndex !== -1)
      nonAutoHeightPxs.splice(autoHeightIndex, 0, autoHeightPx);

    setRowHeightPxs(nonAutoHeightPxs);
  }, [containerSize.height, gap, rowHeightPxs, rowHeights]);

  const rows = useMemo(() => {
    let top = 0;

    return paneRows.map((row, index) => {
      const r = createElement(
        InnerPaneRow,
        {
          key: index,
          index,
          totalRows: paneRows.length,
          containerWidth: containerSize.width,
          containerHeight: containerSize.height,
          top,
          height: rowHeightPxs[index],
          bgColor: row.props.bgColor ?? bgColor,
          borderWidth: row.props.borderWidth ?? borderWidth,
          borderColor: row.props.borderColor ?? borderColor,
          borderStyles: row.props.borderStyles ?? borderStyles,
          styles: row.props.styles,
          gap: row.props.gap ?? gap
        },
        row.props.children
      );

      top += rowHeightPxs[index] + gap;

      return r;
    });
  }, [
    bgColor,
    borderColor,
    borderStyles,
    borderWidth,
    containerSize.width,
    containerSize.height,
    gap,
    paneRows,
    rowHeightPxs
  ]);

  // Drag handler for the row splitter.
  const onRowSplitterDrag = useCallback(
    (index: number) => (dy: number) => {
      const autoRowIndex = rowHeights.findIndex((h) => h === 'auto');
      const min = rowMinHeightPxs[index];
      const max = rowMaxHeightPxs[index];

      if (autoRowIndex === index - 1) {
        // The splitter is on the bottom side of the auto row.
        setRowHeightPxs((prev) => {
          const clone = [...prev];

          const totalHeight = clone[index - 1] + clone[index] + gap;
          const bottomHeight = limit(clone[index] - dy, min, max);

          clone[index - 1] = totalHeight - bottomHeight - gap;
          clone[index] = bottomHeight;

          return clone;
        });
      } else if (autoRowIndex === index + 1) {
        // The splitter is on the top side of the auto row.
        setRowHeightPxs((prev) => {
          const clone = [...prev];

          const totalHeight = clone[index] + clone[index + 1] + gap;
          const topHeight = limit(clone[index] + dy, min, max);

          clone[index] = topHeight;
          clone[index + 1] = totalHeight - topHeight - gap;

          return clone;
        });
      }
    },
    [setRowHeightPxs, rowHeights, rowMinHeightPxs, rowMaxHeightPxs, gap]
  );

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    let top = 0;

    paneRows.forEach((row, index) => {
      top += rowHeightPxs[index] + gap;

      // Add a splitter if the row has a splitter.
      if (row.props.splitter === 'top' || row.props.splitter === 'bottom') {
        const x = rect.x - containerRect.left;
        const y =
          rect.y +
          top -
          gap / 2 +
          (row.props.splitter === 'top' ? -rowHeightPxs[index] : 0) -
          containerRect.top;
        const sWidth = rect.width;
        const sHeight = row.props.splitterHeight ?? 4;
        const color = row.props.splitterColor ?? 'rgba(0, 0, 0, 0.2)';
        const styles = row.props.splitterStyles ?? {};
        const boundMinX = x;
        const boundMaxX = x + sWidth;
        const boundMinY = rect.y;
        const boundMaxY = rect.y + rowHeightPxs[index];

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
          orientation: 'horizontal',
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
          onDrag: onRowSplitterDrag(index)
        });
      }
    });
  }, [
    addSplitter,
    containerRect.left,
    containerRect.top,
    gap,
    onRowSplitterDrag,
    paneRows,
    ref,
    rowHeightPxs
  ]);

  return (
    <div
      ref={setRef}
      className="pane-system"
      style={{
        width: systemWidth,
        height: systemHeight,
        position: 'relative'
      }}
    >
      {isRoot && <SplitterLayer />}
      {rows}
    </div>
  );
};

// PaneSystem interface component.
interface PaneSystemProps extends PropsWithChildren {
  width?: string;
  height?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyles?: CSSProperties;
  gap?: number;
}

const PaneSystem = (props: PaneSystemProps) => {
  // Container size in pixels.
  const [containerSize, setContainerSize] = useState<Size>({
    width: 0,
    height: 0
  });

  const r = useMemo(
    () => ({
      containerSize,
      setContainerSize
    }),
    [containerSize]
  );

  useNestedPaneSystemChecker();

  return (
    <PaneSystemContextRegistry>
      <PaneSystemRectContextProvider>
        <SplitterRegistryProvider>
          <ContainerSizeContext.Provider value={r}>
            <CorePaneSystem {...props} isRoot={true} />
          </ContainerSizeContext.Provider>
        </SplitterRegistryProvider>
      </PaneSystemRectContextProvider>
    </PaneSystemContextRegistry>
  );
};

PaneSystem.displayName = 'PaneSystem';

export default PaneSystem;

type InnerPaneSystemProps = PaneSystemProps & {
  parentContainerSize?: Size;
};

// Internal PaneSystem component.
export const InnerPaneSystem = ({
  parentContainerSize,
  ...props
}: InnerPaneSystemProps) => {
  // Container size in pixels.
  const [containerSize, setContainerSize] = useState<Size>({
    width: 0,
    height: 0
  });

  useIsomorphicLayoutEffect(() => {
    if (!parentContainerSize) return;

    const { width, height } = parentContainerSize;

    if (width) setContainerSize((prev) => ({ ...prev, width }));
    if (height) setContainerSize((prev) => ({ ...prev, height }));
  }, [parentContainerSize]);

  const r = useMemo(
    () => ({
      containerSize,
      setContainerSize
    }),
    [containerSize]
  );

  return (
    <ContainerSizeContext.Provider value={r}>
      <CorePaneSystem {...props} />
    </ContainerSizeContext.Provider>
  );
};
