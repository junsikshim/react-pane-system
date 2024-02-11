import { PaneSystem, Pane, PaneRow } from '../../src';

interface TopRowProps {
  systemWidth: string;
  systemHeight?: string;
  topRowHeight: string;
  topRowMinHeight?: string;
  topRowMaxHeight?: string;
  splitterHeight?: number;
  splitterColor?: string;
}

export const TopRow = ({
  systemWidth,
  systemHeight,
  topRowHeight,
  topRowMinHeight,
  topRowMaxHeight,
  splitterHeight,
  splitterColor
}: TopRowProps) => {
  const hasSplitter =
    typeof topRowMinHeight !== 'undefined' ||
    typeof topRowMaxHeight !== 'undefined';

  return (
    <article>
      <PaneSystem width={systemWidth} height={systemHeight}>
        <PaneRow
          height={topRowHeight}
          minHeight={topRowMinHeight}
          maxHeight={topRowMaxHeight}
          splitter={hasSplitter ? 'bottom' : undefined}
          bgColor="#00afb9"
          borderColor="#fff"
          splitterHeight={splitterHeight}
          splitterColor={splitterColor}
        >
          <Pane id="top-pane">
            <div className="panel">Top Row</div>
          </Pane>
        </PaneRow>
        <PaneRow bgColor="#f07167">
          <Pane id="bottom-pane">
            <div className="panel">Auto Row</div>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
