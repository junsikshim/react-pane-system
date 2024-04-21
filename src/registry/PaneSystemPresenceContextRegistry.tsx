import { ReactNode, createContext, useContext, useEffect } from 'react';

const PaneSystemPresenceContext = createContext<boolean>(false);

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
        "Warning: <PaneSystem /> isn't the only direct child of <Pane />. Unexpected side effects may occur."
      );
    }
  }, [paneSystemPresence]);
};
