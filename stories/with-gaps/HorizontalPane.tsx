import { PaneSystem, Pane, PaneRow } from '../../src';

interface HorizontalPaneProps {
  systemWidth: string;
  systemHeight?: string;
  leftPaneWidth: string;
  leftPaneMinWidth?: string;
  leftPaneMaxWidth?: string;
  borderWidth?: number;
  splitterWidth?: number;
  gap: number;
}

export const HorizontalPane = ({
  systemWidth,
  systemHeight,
  leftPaneWidth,
  leftPaneMinWidth,
  leftPaneMaxWidth,
  borderWidth,
  splitterWidth,
  gap
}: HorizontalPaneProps) => {
  return (
    <article>
      <PaneSystem
        width={systemWidth}
        height={systemHeight}
        borderWidth={borderWidth}
        gap={gap}
      >
        <PaneRow>
          <Pane
            id="left-pane"
            width={leftPaneWidth}
            minWidth={leftPaneMinWidth}
            maxWidth={leftPaneMaxWidth}
            splitter="right"
            splitterWidth={splitterWidth}
            splitterColor="transparent"
            bgColor="#00afb9"
          >
            <div className="panel">Left Pane</div>
          </Pane>
          <Pane id="right-pane" bgColor="#eee">
            <div className="panel">Auto Pane</div>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
