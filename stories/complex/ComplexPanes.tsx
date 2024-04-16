import { PaneSystem, Pane, PaneRow } from '../../src';

interface ComplexPanesProps {
  systemWidth: string;
  systemHeight?: string;
  leftPaneWidth: string;
  leftPaneMinWidth?: string;
  leftPaneMaxWidth?: string;
  rightPaneWidth: string;
  rightPaneMinWidth?: string;
  rightPaneMaxWidth?: string;
  splitterWidth?: number;
  splitterColor?: string;
}

export const ComplexPanes = ({
  systemWidth,
  systemHeight,
  leftPaneWidth,
  leftPaneMinWidth,
  leftPaneMaxWidth,
  rightPaneWidth,
  rightPaneMinWidth,
  rightPaneMaxWidth,
  splitterWidth,
  splitterColor
}: ComplexPanesProps) => {
  return (
    <article>
      <PaneSystem width={systemWidth} height={systemHeight}>
        <PaneRow height="50px" borderColor="transparent">
          <Pane id="gnb-pane" bgColor="#c7c7c7">
            <div className="panel">GNB Pane</div>
          </Pane>
        </PaneRow>
        <PaneRow borderColor="transparent">
          <Pane
            id="left-pane"
            width={leftPaneWidth}
            minWidth={leftPaneMinWidth}
            maxWidth={leftPaneMaxWidth}
            splitter="right"
            splitterWidth={splitterWidth}
            splitterColor={splitterColor}
            bgColor="#00afb9"
            borderColor="transparent"
          >
            <div className="panel">Left Pane</div>
          </Pane>
          <Pane id="content-pane" bgColor="#fdfcdc" borderColor="transparent">
            <div className="panel" style={{ color: '#101010' }}>
              Content Pane
            </div>
          </Pane>
          <Pane
            id="right-pane"
            width={rightPaneWidth}
            minWidth={rightPaneMinWidth}
            maxWidth={rightPaneMaxWidth}
            splitter="left"
            splitterWidth={splitterWidth}
            splitterColor={splitterColor}
          >
            <PaneSystem>
              <PaneRow
                height="200px"
                maxHeight="70%"
                splitter="bottom"
                splitterColor={splitterColor}
                borderColor="transparent"
              >
                <Pane id="top-right-pane" bgColor="#f07167">
                  <div className="panel">Top Right Pane</div>
                </Pane>
              </PaneRow>
              <PaneRow>
                <Pane id="bottom-right-pane" bgColor="#0081a7">
                  <div className="panel">Bottom Right Pane</div>
                </Pane>
              </PaneRow>
            </PaneSystem>
          </Pane>
        </PaneRow>
        <PaneRow height="26px">
          <Pane id="status-pane" bgColor="#62466B">
            <div className="panel">Status Pane</div>
          </Pane>
        </PaneRow>
      </PaneSystem>
    </article>
  );
};
