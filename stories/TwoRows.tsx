import { PaneSystem, Pane, PaneRow } from '../src';

interface TwoRowsProps {
  systemWidth: string;
  systemHeight?: string;
  topRowHeight: string;
  topRowMinHeight?: string;
  topRowMaxHeight?: string;
}

export const TwoRows = ({
  systemWidth,
  systemHeight,
  topRowHeight,
  topRowMinHeight,
  topRowMaxHeight
}: TwoRowsProps) => {
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
        >
          <Pane id="top-pane">
            <span style={{ color: '#fff' }}>Pane with splitter</span>
          </Pane>
        </PaneRow>
        <PaneRow>
          <Pane id="bottom-pane">
            <span style={{ color: '#fff' }}>Auto Pane</span>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
