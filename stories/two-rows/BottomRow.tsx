import { PaneSystem, Pane, PaneRow } from '../../src';

interface BottomRowProps {
  systemWidth: string;
  systemHeight?: string;
  bottomRowHeight: string;
  bottomRowMinHeight?: string;
  bottomRowMaxHeight?: string;
  splitterHeight?: number;
  splitterColor?: string;
}

export const BottomRow = ({
  systemWidth,
  systemHeight,
  bottomRowHeight,
  bottomRowMinHeight,
  bottomRowMaxHeight,
  splitterHeight,
  splitterColor
}: BottomRowProps) => {
  const hasSplitter =
    typeof bottomRowMinHeight !== 'undefined' ||
    typeof bottomRowMaxHeight !== 'undefined';

  return (
    <article>
      <PaneSystem width={systemWidth} height={systemHeight}>
        <PaneRow bgColor="#f07167" borderColor="#fff">
          <Pane id="top-pane">
            <div className="panel">Auto Row</div>
          </Pane>
        </PaneRow>
        <PaneRow
          height={bottomRowHeight}
          minHeight={bottomRowMinHeight}
          maxHeight={bottomRowMaxHeight}
          splitter={hasSplitter ? 'top' : undefined}
          bgColor="#00afb9"
          splitterHeight={splitterHeight}
          splitterColor={splitterColor}
        >
          <Pane id="bottom-pane">
            <div className="panel">Bottom Row</div>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
