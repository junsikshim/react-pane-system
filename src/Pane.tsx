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
      className="pane absolute h-full bg-zinc-900 border-r border-zinc-800 last-of-type:border-r-0"
      style={{
        left: `${left}px`,
        width: `${width}px`
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
