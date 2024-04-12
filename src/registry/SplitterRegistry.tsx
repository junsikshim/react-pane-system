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
  onDrag: (delta: number) => void;
};

const initialState = {
  splitters: [] as Splitter[],
  addSplitter: (splitter: Splitter) => {},
  removeSplitter: (id: string) => {}
};

export const SplitterRegistry = createContext(initialState);

export const SplitterRegistryProvider = ({ children }: PropsWithChildren) => {
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
    <SplitterRegistry.Provider
      value={{
        splitters: splittersArray,
        addSplitter,
        removeSplitter
      }}
    >
      {children}
    </SplitterRegistry.Provider>
  );
};
