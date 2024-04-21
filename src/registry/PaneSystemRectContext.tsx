import { PropsWithChildren, createContext, useState } from 'react';
import { Rect } from '../types';

const initialRect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
};

type PaneSystemRectContextType = [Rect, (rect: Rect) => void];

export const PaneSystemRectContext = createContext<PaneSystemRectContextType>([
  initialRect,
  () => {}
]);

export const PaneSystemRectContextProvider = ({
  children
}: PropsWithChildren) => {
  const [rect, setRect] = useState<Rect>(initialRect);

  return (
    <PaneSystemRectContext.Provider value={[rect, setRect]}>
      {children}
    </PaneSystemRectContext.Provider>
  );
};
