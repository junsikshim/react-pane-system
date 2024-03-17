import { ReactNode, createContext, useContext, useEffect } from 'react';

export const PaneSystemPresenceContext = createContext<boolean>(false);

const PaneSystemContextRegistry = ({ children }: { children: ReactNode }) => {
  const paneSystemPresence = useContext(PaneSystemPresenceContext);

  if (paneSystemPresence) return children;

  return (
    <PaneSystemPresenceContext.Provider value={true}>
      {children}
    </PaneSystemPresenceContext.Provider>
  );
};

export default PaneSystemContextRegistry;

/**
 * Warns the user if the <PaneSystem /> component is not directly nested with only a single child component, <Pane />.
 */
export const useNestedPaneSystemChecker = () => {
  const paneSystemPresence = useContext(PaneSystemPresenceContext);

  useEffect(() => {
    if (paneSystemPresence) {
      console.warn(
        'Warning: <PaneSystem /> recommends being directly nested with only a single child component, <Pane />. Otherwise, unexpected side effects may occur.'
      );
    }
  }, []);
};
