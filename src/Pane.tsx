'use client';

import {
  CSSProperties,
  PropsWithChildren,
  createElement,
  isValidElement,
  useMemo
} from 'react';
import { InnerPaneSystem } from './PaneSystem';

export interface PaneProps extends PropsWithChildren {
  id: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  splitter?: 'left' | 'right';
  splitterWidth?: number;
  splitterColor?: string;
  splitterStyles?: CSSProperties;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyles?: CSSProperties;
  styles?: CSSProperties;
}

const Pane = ({ children }: PaneProps) => children;
Pane.displayName = 'Pane';

export default Pane;

export interface InnerPaneProps {
  index: number;
  totalPanes: number;
  left: number;
  width: number;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyles?: CSSProperties;
  styles?: CSSProperties;
}

export const InnerPane = ({
  index,
  totalPanes,
  left,
  width,
  bgColor,
  borderWidth,
  borderColor,
  borderStyles,
  styles,
  children: _children
}: PropsWithChildren<InnerPaneProps>) => {
  const children = useMemo(() => {
    if (
      !isValidElement(_children) ||
      typeof _children.type === 'string' ||
      typeof _children.type === 'symbol'
    )
      return _children;

    if (
      'displayName' in _children.type &&
      _children.type.displayName === 'PaneSystem'
    ) {
      return createElement(InnerPaneSystem, {
        ...(_children.props ?? {}),
        parentContainerSize: { width }
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
      <div
        className="pane"
        style={{
          left: 0,
          width: `${width}px`,
          position: 'absolute',
          height: '100%',
          backgroundColor: bgColor,
          overflow: 'hidden',
          ...styles
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
              backgroundColor: borderColor,
              ...borderStyles
            }}
          />
        )}

        {children}
      </div>
    </div>
  );
};
