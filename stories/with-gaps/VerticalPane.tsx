import { PaneSystem, Pane, PaneRow } from '../../src';

interface VerticalPaneProps {
  systemWidth: string;
  systemHeight?: string;
  topPaneHeight: string;
  topPanelMinHeight?: string;
  topPanelMaxHeight?: string;
  borderWidth?: number;
  splitterHeight?: number;
  gap: number;
}

export const VerticalPane = ({
  systemWidth,
  systemHeight,
  topPaneHeight,
  topPanelMinHeight,
  topPanelMaxHeight,
  borderWidth,
  splitterHeight,
  gap
}: VerticalPaneProps) => {
  return (
    <article>
      <PaneSystem
        width={systemWidth}
        height={systemHeight}
        borderWidth={borderWidth}
        gap={gap}
      >
        <PaneRow
          height={topPaneHeight}
          minHeight={topPanelMinHeight}
          maxHeight={topPanelMaxHeight}
          splitter="bottom"
          splitterHeight={splitterHeight}
          splitterColor="transparent"
          bgColor="#00afb9"
        >
          <Pane id="left-pane">
            <div className="panel">Top Pane</div>
          </Pane>
        </PaneRow>
        <PaneRow bgColor="#eee">
          <Pane id="right-pane">
            <div className="panel">Auto Pane</div>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
