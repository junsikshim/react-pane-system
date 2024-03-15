import {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState
} from 'react';

export type Splitter = {
  id: string;
  orientation: 'horizontal' | 'vertical';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const initialState = {
  containerRect: { x: 0, y: 0, width: 0, height: 0 },
  setContainerRect: (rect: Rect) => {},
  splitters: [] as Splitter[],
  addSplitter: (splitter: Splitter) => {},
  removeSplitter: (id: string) => {}
};

export const PaneSystemContext = createContext(initialState);

export const PaneSystemContextProvider = ({ children }: PropsWithChildren) => {
  const [containerRect, setContainerRect] = useState<Rect>(
    initialState.containerRect
  );
  const [splitters, setSplitters] = useState({} as Record<string, Splitter>);

  const addSplitter = useCallback((splitter: Splitter) => {
    setSplitters((prev) => ({ ...prev, [splitter.id]: splitter }));
  }, []);

  const removeSplitter = useCallback((id: string) => {
    setSplitters((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const splittersArray = useMemo(() => Object.values(splitters), [splitters]);

  return (
    <PaneSystemContext.Provider
      value={{
        containerRect,
        setContainerRect,
        splitters: splittersArray,
        addSplitter,
        removeSplitter
      }}
    >
      {children}
    </PaneSystemContext.Provider>
  );
};
