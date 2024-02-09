'use client';

import { PropsWithChildren } from 'react';
import ColumnSplitter from './ColumnSplitter';

export interface PaneProps extends PropsWithChildren {
  id: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  splitter?: 'left' | 'right';
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

const Pane = ({ children }: PaneProps) => children;

export default Pane;

export interface InnerPaneProps {
  left: number;
  width: number;
  splitter?: 'left' | 'right';
  onSplitterDrag?: (dx: number) => void;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

export const InnerPane = ({
  left,
  width,
  splitter,
  onSplitterDrag,
  bgColor,
  borderWidth,
  borderColor,
  children
}: PropsWithChildren<InnerPaneProps>) => {
  return (
    <div
      className="pane"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        position: 'absolute',
        height: '100%',
        backgroundColor: bgColor
      }}
    >
      {/* Border on the right side of the pane */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: `${borderWidth}px`,
          width: `${borderWidth}px`,
          height: '100%',
          backgroundColor: borderColor
        }}
      />

      {splitter === 'left' && onSplitterDrag && (
        <ColumnSplitter offsetLeft={0} onDrag={onSplitterDrag} />
      )}

      {children}

      {splitter === 'right' && onSplitterDrag && (
        <ColumnSplitter offsetLeft={width} onDrag={onSplitterDrag} />
      )}
    </div>
  );
};
