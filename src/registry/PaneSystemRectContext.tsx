import { PropsWithChildren, createContext, useMemo, useState } from 'react';
import { Rect } from '../types';

const initialRect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
};

type PaneSystemRectContextType = {
  containerRect: Rect;
  setContainerRect: (rect: Rect) => void;
};

export const PaneSystemRectContext = createContext<PaneSystemRectContextType>({
  containerRect: initialRect,
  setContainerRect: () => {}
});

export const PaneSystemRectContextProvider = ({
  children
}: PropsWithChildren) => {
  const [rect, setRect] = useState<Rect>(initialRect);

  const r = useMemo(
    () => ({ containerRect: rect, setContainerRect: setRect }),
    [rect]
  );

  return (
    <PaneSystemRectContext.Provider value={r}>
      {children}
    </PaneSystemRectContext.Provider>
  );
};
