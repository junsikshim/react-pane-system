import { PaneSystem, Pane, PaneRow } from '../../src';

interface LeftPaneProps {
  systemWidth: string;
  systemHeight?: string;
  leftPaneWidth: string;
  leftPaneMinWidth?: string;
  leftPaneMaxWidth?: string;
  splitterWidth?: number;
  splitterColor?: string;
}

export const LeftPane = ({
  systemWidth,
  systemHeight,
  leftPaneWidth,
  leftPaneMinWidth,
  leftPaneMaxWidth,
  splitterWidth,
  splitterColor
}: LeftPaneProps) => {
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
            splitterWidth={splitterWidth}
            splitterColor={splitterColor}
            bgColor="#00afb9"
            borderColor="#fff"
          >
            <div className="panel">Left Pane</div>
          </Pane>
          <Pane id="right-pane" bgColor="#f07167">
            <div className="panel">Auto Pane</div>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
