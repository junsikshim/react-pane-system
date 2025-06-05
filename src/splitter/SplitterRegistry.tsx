import {
  CSSProperties,
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState
} from 'react';
import { isEqual } from '../utils';

export type Splitter = {
  id: string;
  orientation: 'horizontal' | 'vertical';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  styles: CSSProperties;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  onDrag: (delta: number) => void;
};

export type SplitterIntersection = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  splitter1: Splitter;
  splitter2: Splitter;
};

// Padding for the intersection area.
const SPLITTER_INTERSECTION_PADDING = 2;

const initialState = {
  splitters: [] as Splitter[],
  addSplitter: (_splitter: Splitter) => {},
  removeSplitter: (_id: string) => {},
  currentSplitterIds: [] as string[],
  setCurrentSplitterIds: (_ids: string[]) => {},
  intersections: [] as SplitterIntersection[]
};

export const SplitterRegistry = createContext(initialState);

export const SplitterRegistryProvider = ({ children }: PropsWithChildren) => {
  const [splitters, setSplitters] = useState<Record<string, Splitter>>({});

  // The ID of the current splitter if exists.
  const [currentSplitterIds, setCurrentSplitterIds] = useState<string[]>([]);

  const addSplitter = useCallback(
    (splitter: Splitter) => {
      const s = splitters[splitter.id];

      // If the splitter with the same values already exists, return.
      if (s && s.x === splitter.x && s.y === splitter.y) return;

      setSplitters((prev) => ({ ...prev, [splitter.id]: splitter }));
    },
    [splitters, setSplitters]
  );

  const removeSplitter = useCallback((id: string) => {
    setSplitters((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const splittersArray = useMemo(() => Object.values(splitters), [splitters]);

  // Find intersections between splitters.
  const intersections = useMemo(() => {
    const list = [] as SplitterIntersection[];

    // Find intersections between splitters.
    for (let i = 0; i < splittersArray.length; i++) {
      const s1 = splittersArray[i];

      for (let j = i + 1; j < splittersArray.length; j++) {
        const s2 = splittersArray[j];

        if (s1.id === s2.id) continue;
        if (s1.orientation === s2.orientation) continue;

        if (s1.orientation === 'horizontal' && s2.orientation === 'vertical') {
          if (isEqual(s1.x, s2.x) || isEqual(s1.x + s1.width, s2.x)) {
            list.push({
              id: `${s1.id}-${s2.id}`,
              x: s2.x,
              y: s1.y,
              width: s2.width + SPLITTER_INTERSECTION_PADDING * 2,
              height: s1.height + SPLITTER_INTERSECTION_PADDING * 2,
              splitter1: s1,
              splitter2: s2
            });
          }

          continue;
        }

        if (s1.orientation === 'vertical' && s2.orientation === 'horizontal') {
          if (isEqual(s1.x, s2.x) || isEqual(s1.x, s2.x + s2.width)) {
            list.push({
              id: `${s1.id}-${s2.id}`,
              x: s1.x,
              y: s2.y,
              width: s1.width + SPLITTER_INTERSECTION_PADDING * 2,
              height: s2.height + SPLITTER_INTERSECTION_PADDING * 2,
              splitter1: s1,
              splitter2: s2
            });
          }

          continue;
        }
      }
    }

    return list;
  }, [splittersArray]);

  return (
    <SplitterRegistry.Provider
      value={{
        splitters: splittersArray,
        addSplitter,
        removeSplitter,
        currentSplitterIds,
        setCurrentSplitterIds,
        intersections
      }}
    >
      {children}
    </SplitterRegistry.Provider>
  );
};
