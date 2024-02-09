import { PaneSystem, Pane, PaneRow } from '../src';

interface TwoColumnsProps {
  systemWidth: string;
  systemHeight?: string;
  leftPaneWidth: string;
  leftPaneMinWidth?: string;
  leftPaneMaxWidth?: string;
}

export const TwoColumns = ({
  systemWidth,
  systemHeight,
  leftPaneWidth,
  leftPaneMinWidth,
  leftPaneMaxWidth
}: TwoColumnsProps) => {
  const hasSplitter =
    typeof leftPaneMinWidth !== 'undefined' ||
    typeof leftPaneMaxWidth !== 'undefined';

  return (
    <article>
      <PaneSystem width={systemWidth} height={systemHeight}>
        <PaneRow>
          <Pane
            id="left-pane"
            width={leftPaneWidth}
            minWidth={leftPaneMinWidth}
            maxWidth={leftPaneMaxWidth}
            splitter={hasSplitter ? 'right' : undefined}
          >
            <span style={{ color: '#fff' }}>Pane with splitter</span>
          </Pane>
          <Pane id="right-pane">
            <span style={{ color: '#fff' }}>Auto Pane</span>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
