'use client';

import { PropsWithChildren } from 'react';
import ColumnSplitter from './ColumnSplitter';

export interface PaneProps extends PropsWithChildren {
  id: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  splitter?: 'left' | 'right';
}

const Pane = ({ children }: PaneProps) => children;

export default Pane;

export interface InnerPaneProps {
  left: number;
  width: number;
  splitter?: 'left' | 'right';
  onSplitterDrag?: (dx: number) => void;
}

export const InnerPane = ({
  left,
  width,
  splitter,
  onSplitterDrag,
  children
}: PropsWithChildren<InnerPaneProps>) => {
  return (
    <div
      className="pane"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        position: 'absolute',
        height: '100%'
      }}
    >
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
