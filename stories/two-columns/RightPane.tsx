import { PaneSystem, Pane, PaneRow } from '../../src';

interface RightPaneProps {
  systemWidth: string;
  systemHeight?: string;
  rightPaneWidth: string;
  rightPaneMinWidth?: string;
  rightPaneMaxWidth?: string;
  splitterWidth?: number;
  splitterColor?: string;
}

export const RightPane = ({
  systemWidth,
  systemHeight,
  rightPaneWidth,
  rightPaneMinWidth,
  rightPaneMaxWidth,
  splitterWidth,
  splitterColor
}: RightPaneProps) => {
  const hasSplitter =
    typeof rightPaneMinWidth !== 'undefined' ||
    typeof rightPaneMaxWidth !== 'undefined';

  return (
    <article>
      <PaneSystem width={systemWidth} height={systemHeight}>
        <PaneRow>
          <Pane id="left-pane" bgColor="#f07167" borderColor="#fff">
            <div className="panel">Auto Pane</div>
          </Pane>
          <Pane
            id="right-pane"
            width={rightPaneWidth}
            minWidth={rightPaneMinWidth}
            maxWidth={rightPaneMaxWidth}
            splitter={hasSplitter ? 'left' : undefined}
            splitterWidth={splitterWidth}
            splitterColor={splitterColor}
            bgColor="#00afb9"
          >
            <div className="panel">Right Pane</div>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
