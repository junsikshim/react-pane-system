import { PropsWithChildren, createContext, useState } from 'react';

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const initialState = {
  containerRect: { x: 0, y: 0, width: 0, height: 0 },
  setContainerRect: (rect: Rect) => {}
};

export const PaneSystemContext = createContext(initialState);

export const PaneSystemContextProvider = ({ children }: PropsWithChildren) => {
  const [containerRect, setContainerRect] = useState<Rect>(
    initialState.containerRect
  );

  const onContainerRectChange = (rect: Rect) => {
    console.log('context rect', rect);
    setContainerRect(rect);
  };

  return (
    <PaneSystemContext.Provider
      value={{
        containerRect,
        setContainerRect: onContainerRectChange
      }}
    >
      {children}
    </PaneSystemContext.Provider>
  );
};
