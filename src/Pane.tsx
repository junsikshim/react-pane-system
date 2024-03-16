'use client';

import { PropsWithChildren, ReactNode, createElement, useMemo } from 'react';
import ColumnSplitter from './ColumnSplitter';
import { InnerPaneSystem } from './PaneSystem';

export interface PaneProps extends PropsWithChildren {
  id: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  splitter?: 'left' | 'right';
  splitterWidth?: number;
  splitterColor?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

const Pane = ({ children }: PaneProps) => children;

export default Pane;

export interface InnerPaneProps {
  index: number;
  totalPanes: number;
  left: number;
  width: number;
  splitter?: 'left' | 'right';
  splitterWidth?: number;
  splitterColor?: string;
  onSplitterDrag?: (dx: number) => void;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

export const InnerPane = ({
  index,
  totalPanes,
  left,
  width,
  splitter,
  splitterWidth,
  splitterColor,
  onSplitterDrag,
  bgColor,
  borderWidth,
  borderColor,
  children: _children
}: PropsWithChildren<InnerPaneProps>) => {
  const children = useMemo(() => {
    if (!_children) return _children;
    if (typeof _children === 'string') return _children;
    if (typeof _children === 'number') return _children;
    if (typeof _children === 'boolean') return _children;
    if (isIterableReactNode(_children)) return _children;

    // TODO: Inference displayName from the component
    if ((_children.type as any).displayName === 'PaneSystem') {
      return createElement(InnerPaneSystem, {
        ...(_children.props || {}),
        parentContainerSize: { width: width }
      });
    }

    return _children;
  }, [_children, width]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}px`,
        width: `${width}px`,
        height: '100%'
      }}
    >
      {splitter === 'left' && onSplitterDrag && (
        <ColumnSplitter
          offsetLeft={0}
          onDrag={onSplitterDrag}
          width={splitterWidth}
          color={splitterColor}
        />
      )}
      <div
        className="pane"
        style={{
          left: 0,
          width: `${width}px`,
          position: 'absolute',
          height: '100%',
          backgroundColor: bgColor,
          overflow: 'hidden'
        }}
      >
        {/* Border on the right side of the pane */}
        {index !== totalPanes - 1 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: `${borderWidth}px`,
              height: '100%',
              backgroundColor: borderColor
            }}
          />
        )}

        {children}
      </div>
      {splitter === 'right' && onSplitterDrag && (
        <ColumnSplitter
          offsetLeft={width}
          onDrag={onSplitterDrag}
          width={splitterWidth}
          color={splitterColor}
        />
      )}
    </div>
  );
};

function isIterableReactNode(
  children: ReactNode | ReactNode[]
): children is Iterable<ReactNode> {
  return Symbol.iterator in Object(children);
}
