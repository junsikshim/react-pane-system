'use client';

import {
  PropsWithChildren,
  useEffect,
  useState,
  Children,
  useMemo,
  ReactElement,
  useCallback,
  createElement,
  useLayoutEffect,
  createContext,
  useContext,
  Dispatch
} from 'react';
import { PaneRowProps, InnerPaneRow } from './PaneRow';
import { sizeToPixels, limit, isPaneSystemComponent } from './utils';
import useResizableRef from './useResizableRef';
import SplitterLayer from './SplitterLayer';
import PaneSystemContextRegistry, {
  useNestedPaneSystemChecker
} from './registry/PaneSystemPresenceContextRegistry';
import {
  PaneSystemContext,
  PaneSystemContextProvider
} from './PaneSystemContext';
import { SplitterRegistryProvider } from './registry/SplitterRegistry';

export type Size = {
  width: number;
  height: number;
};

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const ContainerRectContext = createContext<[Rect, Dispatch<Rect>]>([
  { left: 0, top: 0, width: 0, height: 0 },
  () => {}
]);

interface CorePaneSystemProps extends PropsWithChildren {
  width?: string;
  height?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

export const paneSystemComponentType = [
  'PaneSystem',
  'PaneRow',
  'Pane'
] as const;
export type PaneSystemComponentType = (typeof paneSystemComponentType)[number];

const CorePaneSystem = ({
  width: systemWidth = '100%',
  height: systemHeight = '100%',
  bgColor = '#4b5563',
  borderWidth = 1,
  borderColor = '#909090',
  children
}: PropsWithChildren<CorePaneSystemProps>) => {
  // Container size in pixels.
  const [containerRect, setContainerRect] = useContext(ContainerRectContext);

  const [ref, setRef] = useResizableRef<HTMLDivElement>((width, height) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    console.log('rect', rect);
    setContainerRect(rect);
  });

  // useEffect(() => {
  //   if (!ref.current) return;

  //   const rect = ref.current.getBoundingClientRect();
  //   setContainerRect(rect);
  //   console.log('rect', rect);
  // }, []);

  useNestedPaneSystemChecker();

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
      return sizeToPixels(minHeight, containerRect.height);
    });
  }, [paneRows, containerRect]);

  // Calculate the row max heights in pixels.
  const rowMaxHeightPxs = useMemo<number[]>(() => {
    return paneRows.map((r) => {
      const maxHeight = r.props.maxHeight ?? '100%';
      return sizeToPixels(maxHeight, containerRect.height);
    });
  }, [paneRows, containerRect]);

  // Calculate the row heights in pixels.
  useLayoutEffect(() => {
    if (containerRect.height === 0) return;

    // Return if the row heights have already been calculated.
    if (rowHeightPxs.length > 0) return;

    const nonAutoHeights = rowHeights.filter((h) => h !== 'auto');
    const autoHeights = rowHeights.filter((h) => h === 'auto');

    if (autoHeights.length > 1) {
      throw new Error('Only one row can have an auto height.');
    }

    const nonAutoHeightPxs = nonAutoHeights.map((h) =>
      sizeToPixels(h, containerRect.height)
    );
    const autoHeightPx =
      containerRect.height - nonAutoHeightPxs.reduce((a, b) => a + b, 0);
    const autoHeightIndex = rowHeights.findIndex((h) => h === 'auto');

    if (autoHeightIndex !== -1)
      nonAutoHeightPxs.splice(autoHeightIndex, 0, autoHeightPx);

    setRowHeightPxs(nonAutoHeightPxs);
  }, [containerRect, rowHeights]);

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

          const totalHeight = clone[index - 1] + clone[index];
          const bottomHeight = limit(clone[index] - dy, min, max);

          clone[index - 1] = totalHeight - bottomHeight;
          clone[index] = bottomHeight;

          return clone;
        });
      } else if (autoRowIndex === index + 1) {
        // The splitter is on the top side of the auto row.
        setRowHeightPxs((prev) => {
          const clone = [...prev];

          const totalHeight = clone[index] + clone[index + 1];
          const topHeight = limit(clone[index] + dy, min, max);

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
          totalRows: paneRows.length,
          containerWidth: containerRect.width,
          top,
          height: rowHeightPxs[index],
          splitter: row.props.splitter,
          splitterHeight: row.props.splitterHeight,
          splitterColor: row.props.splitterColor,
          onSplitterDrag: onRowSplitterDrag(index),
          bgColor: row.props.bgColor ?? bgColor,
          borderWidth: row.props.borderWidth ?? borderWidth,
          borderColor: row.props.borderColor ?? borderColor
        },
        row.props.children
      );

      top += rowHeightPxs[index];

      return r;
    });
  }, [paneRows, rowHeightPxs, containerRect.width, onRowSplitterDrag]);

  return (
    <div
      ref={ref}
      className="pane-system"
      style={{
        width: systemWidth,
        height: systemHeight,
        position: 'relative'
      }}
    >
      {rows}
    </div>
  );
};

interface PaneSystemProps extends PropsWithChildren {
  width?: string;
  height?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

const PaneSystem = (props: PaneSystemProps) => {
  // Container rect in pixels.
  const [containerRect, setContainerRect] = useState<Rect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  useNestedPaneSystemChecker();

  return (
    <PaneSystemContextRegistry>
      <ContainerRectContext.Provider value={[containerRect, setContainerRect]}>
        <CorePaneSystem {...props} />
      </ContainerRectContext.Provider>
    </PaneSystemContextRegistry>
  );
};

PaneSystem.displayName = 'PaneSystem';

export default PaneSystem;

type InnerPaneSystemProps = PaneSystemProps & {
  parentContainerSize?: Size;
};

export const InnerPaneSystem = ({
  parentContainerSize,
  ...props
}: InnerPaneSystemProps) => {
  // Container size in pixels.
  const [containerSize, setContainerSize] = useState<Size>({
    width: 0,
    height: 0
  });

  const containerRect = useMemo<Rect>(() => {
    return {
      left: 0,
      top: 0,
      width: containerSize.width,
      height: containerSize.height
    };
  }, [containerSize]);

  const setContainerRect = useCallback(
    (rect: Rect) => {
      setContainerSize((prev) => ({
        ...prev,
        width: rect.width,
        height: rect.height
      }));
    },
    [setContainerSize]
  );

  useEffect(() => {
    if (!parentContainerSize) return;

    const { width, height } = parentContainerSize!;

    if (width) setContainerSize((prev) => ({ ...prev, width }));
    if (height) setContainerSize((prev) => ({ ...prev, height }));
  }, [parentContainerSize]);

  return (
    <ContainerRectContext.Provider value={[containerRect, setContainerRect]}>
      <CorePaneSystem {...props} />
    </ContainerRectContext.Provider>
  );
};
